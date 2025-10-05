import { LotsService } from './lots.service';
import { CreateLotDto, UpdateLotDto, PublishLotDto } from './dto/lot.dto';
export declare class LotsController {
    private readonly lotsService;
    constructor(lotsService: LotsService);
    create(req: any, createLotDto: CreateLotDto): Promise<{
        customer: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            userId: string;
            type: string;
            address: string;
            bankReqs: import("@prisma/client/runtime/library").JsonValue;
            licenses: import("@prisma/client/runtime/library").JsonValue;
            rating: number;
            blacklistFlag: boolean;
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
    }>;
    findAll(search?: string, region?: string, method?: string, type?: string, status?: string, minBudget?: string, maxBudget?: string, currency?: string, page?: string, limit?: string): Promise<{
        lots: ({
            customer: {
                id: string;
                name: string;
                verifiedStatus: string;
            };
            _count: {
                bids: number;
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
        })[];
        total: number;
        hasMore: boolean;
        page: number;
        totalPages: number;
    }>;
    findMy(req: any): Promise<({
        escrowAccount: {
            status: string;
            balance: number;
        };
        _count: {
            bids: number;
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
    })[]>;
    findOne(id: string): Promise<{
        daysUntilDeadline: number;
        isActive: boolean;
        canSubmitBid: boolean;
        statistics: {
            totalBids: number;
            activeBids: number;
            averageBidPrice: number;
            minBidPrice: number;
            maxBidPrice: number;
        };
        escrowAccount: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            customerCompanyId: string;
            lotId: string;
            bankId: string;
            balance: number;
            heldPercent: number;
            fee1pctApplied: boolean;
        };
        contract: {
            acts: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                amount: number;
                contractId: string;
                stage: string;
                statusSignedCustomer: boolean;
                statusSignedSupplier: boolean;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            docs: import("@prisma/client/runtime/library").JsonValue;
            lotId: string;
            winnerBidId: string;
            signStatus: string;
        };
        bids: ({
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
        })[];
        customer: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            userId: string;
            type: string;
            address: string;
            bankReqs: import("@prisma/client/runtime/library").JsonValue;
            licenses: import("@prisma/client/runtime/library").JsonValue;
            rating: number;
            blacklistFlag: boolean;
            verifiedStatus: string;
        };
        guarantees: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: string;
            status: string;
            docs: import("@prisma/client/runtime/library").JsonValue;
            lotId: string | null;
            bankId: string;
            bidId: string | null;
            amount: number;
        }[];
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
    }>;
    update(req: any, id: string, updateLotDto: UpdateLotDto): Promise<{
        customer: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            userId: string;
            type: string;
            address: string;
            bankReqs: import("@prisma/client/runtime/library").JsonValue;
            licenses: import("@prisma/client/runtime/library").JsonValue;
            rating: number;
            blacklistFlag: boolean;
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
    }>;
    publish(req: any, id: string, publishLotDto: PublishLotDto): Promise<{
        escrowAccount: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            customerCompanyId: string;
            lotId: string;
            bankId: string;
            balance: number;
            heldPercent: number;
            fee1pctApplied: boolean;
        };
        customer: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            userId: string;
            type: string;
            address: string;
            bankReqs: import("@prisma/client/runtime/library").JsonValue;
            licenses: import("@prisma/client/runtime/library").JsonValue;
            rating: number;
            blacklistFlag: boolean;
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
    }>;
    close(req: any, id: string): Promise<{
        bids: ({
            supplier: {
                user: {
                    email: string;
                    phone: string;
                    password: string;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                userId: string;
                type: string;
                address: string;
                bankReqs: import("@prisma/client/runtime/library").JsonValue;
                licenses: import("@prisma/client/runtime/library").JsonValue;
                rating: number;
                blacklistFlag: boolean;
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
        })[];
        customer: {
            user: {
                email: string;
                phone: string;
                password: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            userId: string;
            type: string;
            address: string;
            bankReqs: import("@prisma/client/runtime/library").JsonValue;
            licenses: import("@prisma/client/runtime/library").JsonValue;
            rating: number;
            blacklistFlag: boolean;
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
    }>;
    selectWinner(req: any, id: string): Promise<{
        lot: {
            bids: ({
                supplier: {
                    user: {
                        email: string;
                        phone: string;
                        password: string;
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                    };
                } & {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    userId: string;
                    type: string;
                    address: string;
                    bankReqs: import("@prisma/client/runtime/library").JsonValue;
                    licenses: import("@prisma/client/runtime/library").JsonValue;
                    rating: number;
                    blacklistFlag: boolean;
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
            })[];
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
        winnerBid: {
            supplier: {
                user: {
                    email: string;
                    phone: string;
                    password: string;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                userId: string;
                type: string;
                address: string;
                bankReqs: import("@prisma/client/runtime/library").JsonValue;
                licenses: import("@prisma/client/runtime/library").JsonValue;
                rating: number;
                blacklistFlag: boolean;
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
        };
        message: string;
    }>;
    cancel(req: any, id: string, reason: string): Promise<{
        customer: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            userId: string;
            type: string;
            address: string;
            bankReqs: import("@prisma/client/runtime/library").JsonValue;
            licenses: import("@prisma/client/runtime/library").JsonValue;
            rating: number;
            blacklistFlag: boolean;
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
    }>;
}
