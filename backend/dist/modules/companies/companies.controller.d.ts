import { CompaniesService } from './companies.service';
import { CreateCompanyDto, UpdateCompanyDto, VerifyCompanyDto } from './dto/company.dto';
export declare class CompaniesController {
    private readonly companiesService;
    constructor(companiesService: CompaniesService);
    create(req: any, createCompanyDto: CreateCompanyDto): Promise<{
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
    }>;
    findMy(req: any): Promise<{
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
    }>;
    findOne(id: string): Promise<{
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
    }>;
    update(req: any, updateCompanyDto: UpdateCompanyDto): Promise<{
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
    }>;
    updateLicenses(req: any, body: {
        licenses: any[];
    }): Promise<{
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
    }>;
    checkCriteria(id: string, criteria: any): Promise<{
        passed: boolean;
        checks: {
            verified: boolean;
            notBlacklisted: boolean;
            hasRequiredLicenses: boolean;
            meetsRatingRequirement: boolean;
        };
        company: {
            id: string;
            name: string;
            rating: number;
            verifiedStatus: string;
        };
    }>;
    verify(req: any, id: string, verifyCompanyDto: VerifyCompanyDto): Promise<{
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
    }>;
    addToBlacklist(req: any, id: string, body: {
        reason: string;
    }): Promise<{
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
    }>;
    removeFromBlacklist(req: any, id: string): Promise<{
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
    }>;
}
