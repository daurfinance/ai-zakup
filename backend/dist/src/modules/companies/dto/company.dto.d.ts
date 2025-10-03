export declare class CreateCompanyDto {
    binIin: string;
    name: string;
    type: string;
    address?: string;
    bankReqs?: any;
    licenses?: any[];
}
export declare class UpdateCompanyDto {
    binIin?: string;
    name?: string;
    opf?: string;
    address?: string;
    bankReqs?: any;
    licenses?: any[];
}
export declare class VerifyCompanyDto {
    status: 'verified' | 'rejected';
    reason?: string;
}
