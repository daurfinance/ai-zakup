import { PrismaService } from '../prisma/prisma.service';
import { CompaniesService } from '../companies/companies.service';
import { CreateLotDto, UpdateLotDto, LotFilterDto, PublishLotDto } from './dto/lot.dto';
export declare class LotsService {
    private prisma;
    private companiesService;
    constructor(prisma: PrismaService, companiesService: CompaniesService);
    create(userId: string, createLotDto: CreateLotDto): Promise<{
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
    private validateTenderData;
    private generateTenderNumber;
    findAll(filters: LotFilterDto): Promise<{
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
    findOne(id: string, userId?: string): Promise<{
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
    update(userId: string, id: string, updateLotDto: UpdateLotDto): Promise<{
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
    publish(userId: string, id: string, publishData: PublishLotDto): Promise<{
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
    private validateTenderForPublication;
    private createEscrowAccount;
    findByCompany(userId: string, status?: string): Promise<({
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
    cancel(userId: string, id: string, reason: string): Promise<{
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
    close(userId: string, id: string): Promise<{
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
    selectWinner(id: string): Promise<{
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
    private calculateDaysUntilDeadline;
    private isTenderActive;
    private canSubmitBid;
    private calculateAverageBidPrice;
    private calculateMinBidPrice;
    private calculateMaxBidPrice;
}
