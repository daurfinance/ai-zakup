export declare class CreateCompanyDto {
    name: string;
    type: string;
    address?: string;
    bankReqs?: any;
    licenses?: any[];
}
export declare class UpdateCompanyDto {
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
