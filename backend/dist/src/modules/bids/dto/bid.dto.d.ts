export declare class CreateBidDto {
    lotId: string;
    price: number;
    currency: string;
    etaDays: number;
    attachments?: any[];
}
export declare class UpdateBidDto {
    price?: number;
    currency?: string;
    etaDays?: number;
    attachments?: any[];
}
export declare class RejectBidDto {
    reason?: string;
}
