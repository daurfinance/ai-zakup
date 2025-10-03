export declare class CreateEscrowDto {
    lotId: string;
    bankId: string;
    heldPercent?: number;
}
export declare class DepositEscrowDto {
    amount: number;
    currency: string;
    sourceAccount: string;
    purpose?: string;
}
export declare class WithdrawEscrowDto {
    amount: number;
    currency: string;
    destinationAccount: string;
    actId?: string;
    purpose?: string;
}
export declare class EscrowBalanceDto {
    balance: number;
    heldPercent: number;
    availableForWithdrawal: number;
    heldAmount: number;
    currency: string;
}
