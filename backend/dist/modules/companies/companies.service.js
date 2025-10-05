"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompaniesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CompaniesService = class CompaniesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createCompanyDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { company: true },
        });
        if (existingUser?.company) {
            throw new common_1.BadRequestException('У пользователя уже есть зарегистрированная компания');
        }
        const company = await this.prisma.company.create({
            data: {
                ...createCompanyDto,
                userId: userId,
                address: createCompanyDto.address || "",
                bankReqs: createCompanyDto.bankReqs || {},
                verifiedStatus: "draft",
                rating: 0,
                blacklistFlag: false,
            },
        });
        return company;
    }
    async findByUserId(userId) {
        const userWithCompany = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { company: true },
        });
        if (!userWithCompany) {
            throw new common_1.NotFoundException("Пользователь не найден");
        }
        if (!userWithCompany.company) {
            throw new common_1.NotFoundException("Компания не найдена для данного пользователя");
        }
        return userWithCompany.company;
    }
    async findOne(id) {
        const company = await this.prisma.company.findUnique({
            where: { id },
        });
        if (!company) {
            throw new common_1.NotFoundException('Компания не найдена');
        }
        return company;
    }
    async update(userId, updateCompanyDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { company: true },
        });
        if (!user?.company) {
            throw new common_1.NotFoundException('Компания не найдена');
        }
        return this.prisma.company.update({
            where: { userId: userId },
            data: updateCompanyDto,
        });
    }
    async verify(companyId, status, reason) {
        const company = await this.prisma.company.findUnique({
            where: { id: companyId },
        });
        if (!company) {
            throw new common_1.NotFoundException('Компания не найдена');
        }
        return this.prisma.company.update({
            where: { id: companyId },
            data: {
                verifiedStatus: status,
            },
        });
    }
    async updateLicenses(userId, licenses) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { company: true },
        });
        if (!user?.company) {
            throw new common_1.NotFoundException('Компания не найдена');
        }
        return this.prisma.company.update({
            where: { userId: userId },
            data: { licenses },
        });
    }
    async checkTenderCriteria(companyId, criteria) {
        const company = await this.prisma.company.findUnique({
            where: { id: companyId },
        });
        if (!company) {
            throw new common_1.NotFoundException('Компания не найдена');
        }
        const checks = {
            verified: company.verifiedStatus === 'verified',
            notBlacklisted: !company.blacklistFlag,
            hasRequiredLicenses: this.checkLicenses(company.licenses, criteria.requiredLicenses),
            meetsRatingRequirement: company.rating >= (criteria.minRating || 0),
        };
        const passed = Object.values(checks).every(check => check === true);
        return {
            passed,
            checks,
            company: {
                id: company.id,
                name: company.name,
                rating: company.rating,
                verifiedStatus: company.verifiedStatus,
            },
        };
    }
    checkLicenses(companyLicenses, requiredLicenses) {
        if (!requiredLicenses || requiredLicenses.length === 0) {
            return true;
        }
        return true;
    }
    async calculateRating(companyId) {
        return 4.2;
    }
    async addToBlacklist(companyId, reason) {
        return this.prisma.company.update({
            where: { id: companyId },
            data: { blacklistFlag: true },
        });
    }
    async removeFromBlacklist(companyId) {
        return this.prisma.company.update({
            where: { id: companyId },
            data: { blacklistFlag: false },
        });
    }
};
exports.CompaniesService = CompaniesService;
exports.CompaniesService = CompaniesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CompaniesService);
//# sourceMappingURL=companies.service.js.map