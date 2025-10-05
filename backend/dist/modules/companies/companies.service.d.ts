import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';
import { Company } from '@prisma/client';
export declare class CompaniesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, createCompanyDto: CreateCompanyDto): Promise<{
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
    findByUserId(userId: string): Promise<Company>;
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
    update(userId: string, updateCompanyDto: UpdateCompanyDto): Promise<{
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
    verify(companyId: string, status: 'verified' | 'rejected', reason?: string): Promise<{
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
    updateLicenses(userId: string, licenses: any[]): Promise<{
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
    checkTenderCriteria(companyId: string, criteria: any): Promise<{
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
    private checkLicenses;
    calculateRating(companyId: string): Promise<number>;
    addToBlacklist(companyId: string, reason: string): Promise<{
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
    removeFromBlacklist(companyId: string): Promise<{
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
