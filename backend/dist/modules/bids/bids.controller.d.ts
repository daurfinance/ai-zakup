import { BidsService } from './bids.service';
import { CreateBidDto, UpdateBidDto, RejectBidDto } from './dto/bid.dto';
export declare class BidsController {
    private readonly bidsService;
    constructor(bidsService: BidsService);
    create(req: any, createBidDto: CreateBidDto): Promise<{
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
    findMy(req: any): Promise<({
        lot: {
            id: string;
            title: string;
            status: string;
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
    getMyStats(req: any): Promise<{
        total: number;
        pending: number;
        approved: number;
        rejected: number;
        won: number;
        successRate: number;
    }>;
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
            type: string;
            description: string;
            title: string;
            status: string;
            lots: import("@prisma/client/runtime/library").JsonValue;
            method: string;
            budget: number;
            currency: string;
            region: string;
            deadlines: import("@prisma/client/runtime/library").JsonValue;
            criteria: import("@prisma/client/runtime/library").JsonValue;
            docs: import("@prisma/client/runtime/library").JsonValue;
            contactInfo: import("@prisma/client/runtime/library").JsonValue;
            deliveryTerms: import("@prisma/client/runtime/library").JsonValue;
            paymentTerms: import("@prisma/client/runtime/library").JsonValue;
            tenderNumber: string | null;
            publishedAt: Date | null;
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
    update(req: any, id: string, updateBidDto: UpdateBidDto): Promise<{
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
    withdraw(req: any, id: string): Promise<{
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
    approve(req: any, id: string): Promise<{
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
    reject(req: any, id: string, rejectBidDto: RejectBidDto): Promise<{
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
}
