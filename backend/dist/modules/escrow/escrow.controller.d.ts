import { EscrowService } from './escrow.service';
import { CreateEscrowDto, DepositEscrowDto, WithdrawEscrowDto } from './dto/escrow.dto';
export declare class EscrowController {
    private readonly escrowService;
    constructor(escrowService: EscrowService);
    create(req: any, createEscrowDto: CreateEscrowDto): Promise<{
        lot: {
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
        status: string;
        customerCompanyId: string;
        lotId: string;
        bankId: string;
        balance: number;
        heldPercent: number;
        fee1pctApplied: boolean;
    }>;
    deposit(req: any, id: string, depositEscrowDto: DepositEscrowDto): Promise<{
        lot: {
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
        status: string;
        customerCompanyId: string;
        lotId: string;
        bankId: string;
        balance: number;
        heldPercent: number;
        fee1pctApplied: boolean;
    }>;
    withdraw(id: string, withdrawEscrowDto: WithdrawEscrowDto): Promise<{
        escrow: {
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
        payout: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            amount: number;
            actId: string | null;
            escrowId: string;
        };
    }>;
    findByLotId(lotId: string): Promise<{
        lot: {
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
        payouts: ({
            act: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                amount: number;
                contractId: string;
                stage: string;
                statusSignedCustomer: boolean;
                statusSignedSupplier: boolean;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            amount: number;
            actId: string | null;
            escrowId: string;
        })[];
    } & {
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
    }>;
    findMy(req: any): Promise<({
        lot: {
            id: string;
            title: string;
            status: string;
            budget: number;
            currency: string;
        };
        payouts: {
            id: string;
            createdAt: Date;
            status: string;
            amount: number;
        }[];
    } & {
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
    })[]>;
    close(req: any, id: string): Promise<{
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
    }>;
    calculateFee(id: string): Promise<{
        totalPayouts: number;
        platformFee: number;
        feeApplied: boolean;
    }>;
    applyFee(id: string): Promise<{
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
    }>;
}
