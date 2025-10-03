import { PrismaService } from '../prisma/prisma.service';
import { CompaniesService } from '../companies/companies.service';
import { CreateBidDto, UpdateBidDto } from './dto/bid.dto';
export declare class BidsService {
    private prisma;
    private companiesService;
    constructor(prisma: PrismaService, companiesService: CompaniesService);
    create(userId: string, createBidDto: CreateBidDto): Promise<{
        lot: {
            id: string;
            title: string;
            budget: number;
            currency: string;
        };
        supplier: {
            id: string;
            name: string;
            rating: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        currency: string;
        lotId: string;
        supplierCompanyId: string;
        price: number;
        etaDays: number;
        attachments: import("@prisma/client/runtime/library").JsonValue;
        scoreBreakdown: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    private createBidSecurity;
    update(userId: string, id: string, updateBidDto: UpdateBidDto): Promise<{
        lot: {
            id: string;
            title: string;
            budget: number;
            currency: string;
        };
        supplier: {
            id: string;
            name: string;
            rating: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        currency: string;
        lotId: string;
        supplierCompanyId: string;
        price: number;
        etaDays: number;
        attachments: import("@prisma/client/runtime/library").JsonValue;
        scoreBreakdown: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    withdraw(userId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        currency: string;
        lotId: string;
        supplierCompanyId: string;
        price: number;
        etaDays: number;
        attachments: import("@prisma/client/runtime/library").JsonValue;
        scoreBreakdown: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    private refundBidSecurity;
    findOne(id: string): Promise<{
        lot: {
            customer: {
                id: string;
                name: string;
                rating: number;
                verifiedStatus: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            type: string;
            lots: import("@prisma/client/runtime/library").JsonValue;
            description: string;
            tenderNumber: string | null;
            method: string;
            title: string;
            budget: number;
            currency: string;
            region: string;
            publishedAt: Date | null;
            deadlines: import("@prisma/client/runtime/library").JsonValue;
            criteria: import("@prisma/client/runtime/library").JsonValue;
            docs: import("@prisma/client/runtime/library").JsonValue;
            contactInfo: import("@prisma/client/runtime/library").JsonValue;
            deliveryTerms: import("@prisma/client/runtime/library").JsonValue;
            paymentTerms: import("@prisma/client/runtime/library").JsonValue;
            cancellationReason: string | null;
            cancelledAt: Date | null;
            customerCompanyId: string;
        };
        security: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            bidId: string;
            amount5pct: number;
            splitPlatform2pct: number;
            splitCustomer3pct: number;
            refundDueDate: Date | null;
        };
        supplier: {
            id: string;
            name: string;
            licenses: import("@prisma/client/runtime/library").JsonValue;
            rating: number;
            verifiedStatus: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        currency: string;
        lotId: string;
        supplierCompanyId: string;
        price: number;
        etaDays: number;
        attachments: import("@prisma/client/runtime/library").JsonValue;
        scoreBreakdown: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    findByCompany(userId: string): Promise<({
        lot: {
            id: string;
            status: string;
            title: string;
            budget: number;
            currency: string;
            deadlines: import("@prisma/client/runtime/library").JsonValue;
            customer: {
                name: string;
                rating: number;
            };
        };
        security: {
            status: string;
            amount5pct: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        currency: string;
        lotId: string;
        supplierCompanyId: string;
        price: number;
        etaDays: number;
        attachments: import("@prisma/client/runtime/library").JsonValue;
        scoreBreakdown: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
    findByLot(lotId: string): Promise<({
        security: {
            status: string;
            amount5pct: number;
        };
        supplier: {
            id: string;
            name: string;
            rating: number;
            verifiedStatus: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        currency: string;
        lotId: string;
        supplierCompanyId: string;
        price: number;
        etaDays: number;
        attachments: import("@prisma/client/runtime/library").JsonValue;
        scoreBreakdown: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
    approve(userId: string, bidId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        currency: string;
        lotId: string;
        supplierCompanyId: string;
        price: number;
        etaDays: number;
        attachments: import("@prisma/client/runtime/library").JsonValue;
        scoreBreakdown: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    reject(userId: string, bidId: string, reason?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        currency: string;
        lotId: string;
        supplierCompanyId: string;
        price: number;
        etaDays: number;
        attachments: import("@prisma/client/runtime/library").JsonValue;
        scoreBreakdown: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    getStats(userId: string): Promise<{
        total: number;
        pending: number;
        approved: number;
        rejected: number;
        won: number;
        successRate: number;
    }>;
}
