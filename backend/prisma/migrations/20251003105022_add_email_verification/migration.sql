-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "twoFactorSecret" TEXT,
    "lastLogin" TIMESTAMP(3),
    "locale" TEXT NOT NULL DEFAULT 'ru',
    "verificationToken" TEXT,
    "verificationExpires" TIMESTAMP(3),
    "emailVerifiedAt" TIMESTAMP(3),
    "resetToken" TEXT,
    "resetExpires" TIMESTAMP(3),
    "companyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "binIin" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "opf" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "bankReqs" JSONB NOT NULL,
    "licenses" JSONB NOT NULL DEFAULT '[]',
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "blacklistFlag" BOOLEAN NOT NULL DEFAULT false,
    "verifiedStatus" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lot" (
    "id" TEXT NOT NULL,
    "customerCompanyId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "budget" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "deadlines" JSONB NOT NULL,
    "criteria" JSONB NOT NULL,
    "docs" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bid" (
    "id" TEXT NOT NULL,
    "lotId" TEXT NOT NULL,
    "supplierCompanyId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "etaDays" INTEGER NOT NULL,
    "attachments" JSONB NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "scoreBreakdown" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EscrowAccount" (
    "id" TEXT NOT NULL,
    "bankId" TEXT NOT NULL,
    "lotId" TEXT NOT NULL,
    "customerCompanyId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'created',
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "heldPercent" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "fee1pctApplied" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EscrowAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guarantee" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "bankId" TEXT NOT NULL,
    "lotId" TEXT,
    "bidId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "docs" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guarantee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Security" (
    "id" TEXT NOT NULL,
    "bidId" TEXT NOT NULL,
    "amount5pct" DOUBLE PRECISION NOT NULL,
    "splitPlatform2pct" DOUBLE PRECISION NOT NULL,
    "splitCustomer3pct" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "refundDueDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Security_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contract" (
    "id" TEXT NOT NULL,
    "lotId" TEXT NOT NULL,
    "winnerBidId" TEXT NOT NULL,
    "signStatus" TEXT NOT NULL DEFAULT 'pending',
    "docs" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Act" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "statusSignedCustomer" BOOLEAN NOT NULL DEFAULT false,
    "statusSignedSupplier" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Act_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payout" (
    "id" TEXT NOT NULL,
    "escrowId" TEXT NOT NULL,
    "actId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dispute" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "resolution" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dispute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "details" JSONB NOT NULL DEFAULT '{}',
    "ip" TEXT NOT NULL,
    "ua" TEXT NOT NULL,
    "totpVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fee" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "percent" DOUBLE PRECISION,
    "flat" DOUBLE PRECISION,
    "appliedTo" TEXT NOT NULL,
    "exemptions" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Calendar" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "isWorkingDay" BOOLEAN NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'KZ',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Calendar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "path" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "uploadedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_companyId_key" ON "User"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "Company_binIin_key" ON "Company"("binIin");

-- CreateIndex
CREATE UNIQUE INDEX "EscrowAccount_lotId_key" ON "EscrowAccount"("lotId");

-- CreateIndex
CREATE UNIQUE INDEX "Security_bidId_key" ON "Security"("bidId");

-- CreateIndex
CREATE UNIQUE INDEX "Contract_lotId_key" ON "Contract"("lotId");

-- CreateIndex
CREATE UNIQUE INDEX "Contract_winnerBidId_key" ON "Contract"("winnerBidId");

-- CreateIndex
CREATE UNIQUE INDEX "Payout_actId_key" ON "Payout"("actId");

-- CreateIndex
CREATE UNIQUE INDEX "Calendar_date_key" ON "Calendar"("date");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lot" ADD CONSTRAINT "Lot_customerCompanyId_fkey" FOREIGN KEY ("customerCompanyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "Lot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_supplierCompanyId_fkey" FOREIGN KEY ("supplierCompanyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EscrowAccount" ADD CONSTRAINT "EscrowAccount_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "Lot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EscrowAccount" ADD CONSTRAINT "EscrowAccount_customerCompanyId_fkey" FOREIGN KEY ("customerCompanyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guarantee" ADD CONSTRAINT "Guarantee_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "Lot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guarantee" ADD CONSTRAINT "Guarantee_bidId_fkey" FOREIGN KEY ("bidId") REFERENCES "Bid"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Security" ADD CONSTRAINT "Security_bidId_fkey" FOREIGN KEY ("bidId") REFERENCES "Bid"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "Lot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_winnerBidId_fkey" FOREIGN KEY ("winnerBidId") REFERENCES "Bid"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Act" ADD CONSTRAINT "Act_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payout" ADD CONSTRAINT "Payout_escrowId_fkey" FOREIGN KEY ("escrowId") REFERENCES "EscrowAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payout" ADD CONSTRAINT "Payout_actId_fkey" FOREIGN KEY ("actId") REFERENCES "Act"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
