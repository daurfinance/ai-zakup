-- Initialization script for AI-Zakup database
-- This script sets up the database with proper extensions and initial data

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Create indexes for better performance
-- These will be created after Prisma migration

-- Insert initial system data
-- Fee structure
INSERT INTO "Fee" (id, type, percent, flat, "appliedTo", exemptions) VALUES
('fee_platform', 'platform', 1.0, NULL, 'tender_value', '[]'),
('fee_escrow', 'escrow', 0.5, NULL, 'escrow_amount', '[]'),
('fee_guarantee', 'guarantee', 2.0, NULL, 'guarantee_amount', '[]')
ON CONFLICT (id) DO NOTHING;

-- Calendar data for Kazakhstan working days
-- Insert current year working days (excluding weekends and holidays)
DO $$
DECLARE
    current_date DATE := DATE_TRUNC('year', CURRENT_DATE);
    end_date DATE := DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year' - INTERVAL '1 day';
    is_working BOOLEAN;
BEGIN
    WHILE current_date <= end_date LOOP
        -- Check if it's a weekend
        is_working := EXTRACT(DOW FROM current_date) NOT IN (0, 6);
        
        -- Check for Kazakhstan holidays (simplified list)
        IF current_date IN (
            DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '0 days',  -- New Year
            DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 days',  -- New Year
            DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '6 days',  -- Orthodox Christmas
            DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '67 days', -- Women's Day (Mar 8)
            DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '80 days', -- Nauryz (Mar 21)
            DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '120 days', -- Unity Day (May 1)
            DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '128 days', -- Defender's Day (May 7)
            DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '129 days', -- Victory Day (May 9)
            DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '162 days', -- Capital Day (Jul 6)
            DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '237 days', -- Constitution Day (Aug 30)
            DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '358 days', -- Independence Day (Dec 16)
            DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '359 days'  -- Independence Day (Dec 17)
        ) THEN
            is_working := FALSE;
        END IF;
        
        INSERT INTO "Calendar" (id, date, "isWorkingDay", country)
        VALUES (
            'cal_' || TO_CHAR(current_date, 'YYYY_MM_DD'),
            current_date,
            is_working,
            'KZ'
        ) ON CONFLICT (date) DO NOTHING;
        
        current_date := current_date + INTERVAL '1 day';
    END LOOP;
END $$;

-- Create admin user (password should be changed after first login)
-- Password: admin123 (hashed with bcrypt)
INSERT INTO "User" (
    id, 
    email, 
    password, 
    role, 
    status, 
    locale,
    "createdAt",
    "updatedAt"
) VALUES (
    'admin_user_001',
    'admin@ai-zakup.kz',
    '$2b$12$LQv3c1yqBwlVHpPjrPyFUOeCDcR6HrYxJOIFiEzPCI4YydQAORUPi', -- admin123
    'admin',
    'active',
    'ru',
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Create system company for admin
INSERT INTO "Company" (
    id,
    name,
    "binIin",
    opf,
    address,
    rating,
    "verifiedStatus",
    "blacklistFlag",
    "bankReqs",
    "createdAt",
    "updatedAt"
) VALUES (
    'system_company_001',
    'Администрация AI-Zakup',
    '000000000000',
    'Система',
    'г. Алматы, ул. Системная, 1',
    5.0,
    'verified',
    false,
    '{"bankName": "Системный банк", "iban": "KZ000000000000000000", "bik": "SYSBKZ2A"}',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Link admin user to system company
UPDATE "User" 
SET "companyId" = 'system_company_001'
WHERE email = 'admin@ai-zakup.kz' AND "companyId" IS NULL;

-- Create performance indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_lot_status ON "Lot"(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_lot_region ON "Lot"(region);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_lot_budget ON "Lot"(budget);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_lot_created_at ON "Lot"("createdAt");
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_lot_search ON "Lot" USING gin(to_tsvector('russian', title || ' ' || description));

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bid_status ON "Bid"(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bid_price ON "Bid"(price);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bid_created_at ON "Bid"("createdAt");

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_company_verified ON "Company"("verifiedStatus");
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_company_rating ON "Company"(rating);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_company_search ON "Company" USING gin(to_tsvector('russian', name));

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_email ON "User"(email);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_status ON "User"(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_role ON "User"(role);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_escrow_status ON "EscrowAccount"(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_guarantee_status ON "Guarantee"(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_contract_status ON "Contract"("signStatus");

-- Create audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO "AuditLog" (
            id,
            "userId",
            action,
            entity,
            details,
            ip,
            ua,
            "totpVerified",
            "createdAt"
        ) VALUES (
            'audit_' || gen_random_uuid(),
            COALESCE(current_setting('app.current_user_id', true), 'system'),
            'INSERT',
            TG_TABLE_NAME,
            row_to_json(NEW),
            COALESCE(current_setting('app.client_ip', true), '127.0.0.1'),
            COALESCE(current_setting('app.user_agent', true), 'system'),
            false,
            NOW()
        );
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO "AuditLog" (
            id,
            "userId",
            action,
            entity,
            details,
            ip,
            ua,
            "totpVerified",
            "createdAt"
        ) VALUES (
            'audit_' || gen_random_uuid(),
            COALESCE(current_setting('app.current_user_id', true), 'system'),
            'UPDATE',
            TG_TABLE_NAME,
            json_build_object('old', row_to_json(OLD), 'new', row_to_json(NEW)),
            COALESCE(current_setting('app.client_ip', true), '127.0.0.1'),
            COALESCE(current_setting('app.user_agent', true), 'system'),
            false,
            NOW()
        );
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO "AuditLog" (
            id,
            "userId",
            action,
            entity,
            details,
            ip,
            ua,
            "totpVerified",
            "createdAt"
        ) VALUES (
            'audit_' || gen_random_uuid(),
            COALESCE(current_setting('app.current_user_id', true), 'system'),
            'DELETE',
            TG_TABLE_NAME,
            row_to_json(OLD),
            COALESCE(current_setting('app.client_ip', true), '127.0.0.1'),
            COALESCE(current_setting('app.user_agent', true), 'system'),
            false,
            NOW()
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers to important tables
-- (These will be created after Prisma migration)

COMMIT;
