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
exports.BidsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const companies_service_1 = require("../companies/companies.service");
let BidsService = class BidsService {
    constructor(prisma, companiesService) {
        this.prisma = prisma;
        this.companiesService = companiesService;
    }
    async create(userId, createBidDto) {
        const company = await this.companiesService.findByUserId(userId);
        const lot = await this.prisma.lot.findUnique({
            where: { id: createBidDto.lotId },
            include: { customer: true },
        });
        if (!lot) {
            throw new common_1.NotFoundException('Лот не найден');
        }
        if (lot.status !== 'published') {
            throw new common_1.BadRequestException('Заявки можно подавать только на опубликованные лоты');
        }
        const submissionDeadline = new Date(lot.deadlines['submissionDeadline']);
        if (new Date() > submissionDeadline) {
            throw new common_1.BadRequestException('Срок подачи заявок истек');
        }
        const existingBid = await this.prisma.bid.findFirst({
            where: {
                lotId: createBidDto.lotId,
                supplierCompanyId: company.id,
            },
        });
        if (existingBid) {
            throw new common_1.BadRequestException('Вы уже подали заявку на этот лот');
        }
        if (lot.customerCompanyId === company.id) {
            throw new common_1.BadRequestException('Нельзя подавать заявку на собственный лот');
        }
        const criteriaCheck = await this.companiesService.checkTenderCriteria(company.id, lot.criteria);
        if (!criteriaCheck.passed) {
            throw new common_1.BadRequestException('Ваша компания не соответствует критериям тендера');
        }
        const bid = await this.prisma.bid.create({
            data: {
                lotId: createBidDto.lotId,
                supplierCompanyId: company.id,
                price: createBidDto.price,
                currency: createBidDto.currency,
                etaDays: createBidDto.etaDays,
                attachments: createBidDto.attachments || [],
                status: 'pending',
            },
            include: {
                lot: {
                    select: {
                        id: true,
                        title: true,
                        budget: true,
                        currency: true,
                    },
                },
                supplier: {
                    select: {
                        id: true,
                        name: true,
                        rating: true,
                    },
                },
            },
        });
        await this.createBidSecurity(bid.id, createBidDto.price);
        return bid;
    }
    async createBidSecurity(bidId, bidPrice) {
        const securityAmount = bidPrice * 0.05;
        const platformShare = securityAmount * 0.4;
        const customerShare = securityAmount * 0.6;
        return this.prisma.security.create({
            data: {
                bidId,
                amount5pct: securityAmount,
                splitPlatform2pct: platformShare,
                splitCustomer3pct: customerShare,
                status: 'pending',
                refundDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
        });
    }
    async update(userId, id, updateBidDto) {
        const company = await this.companiesService.findByUserId(userId);
        const bid = await this.prisma.bid.findUnique({
            where: { id },
            include: { lot: true, supplier: true },
        });
        if (!bid) {
            throw new common_1.NotFoundException('Заявка не найдена');
        }
        if (bid.supplierCompanyId !== company.id) {
            throw new common_1.ForbiddenException('Вы можете редактировать только свои заявки');
        }
        if (bid.status !== 'pending') {
            throw new common_1.BadRequestException('Можно редактировать только заявки в статусе "На рассмотрении"');
        }
        const submissionDeadline = new Date(bid.lot.deadlines['submissionDeadline']);
        if (new Date() > submissionDeadline) {
            throw new common_1.BadRequestException('Срок подачи заявок истек');
        }
        return this.prisma.bid.update({
            where: { id },
            data: updateBidDto,
            include: {
                lot: {
                    select: {
                        id: true,
                        title: true,
                        budget: true,
                        currency: true,
                    },
                },
                supplier: {
                    select: {
                        id: true,
                        name: true,
                        rating: true,
                    },
                },
            },
        });
    }
    async withdraw(userId, id) {
        const company = await this.companiesService.findByUserId(userId);
        const bid = await this.prisma.bid.findUnique({
            where: { id },
            include: { lot: true, security: true },
        });
        if (!bid) {
            throw new common_1.NotFoundException('Заявка не найдена');
        }
        if (bid.supplierCompanyId !== company.id) {
            throw new common_1.ForbiddenException('Вы можете отзывать только свои заявки');
        }
        if (bid.status === 'withdrawn') {
            throw new common_1.BadRequestException('Заявка уже отозвана');
        }
        if (bid.status === 'winner') {
            throw new common_1.BadRequestException('Нельзя отозвать заявку-победителя');
        }
        const updatedBid = await this.prisma.bid.update({
            where: { id },
            data: { status: 'withdrawn' },
        });
        if (bid.security) {
            await this.refundBidSecurity(bid.security.id);
        }
        return updatedBid;
    }
    async refundBidSecurity(securityId) {
        return this.prisma.security.update({
            where: { id: securityId },
            data: { status: 'refunded' },
        });
    }
    async findOne(id) {
        const bid = await this.prisma.bid.findUnique({
            where: { id },
            include: {
                lot: {
                    include: {
                        customer: {
                            select: {
                                id: true,
                                name: true,
                                rating: true,
                                verifiedStatus: true,
                            },
                        },
                    },
                },
                supplier: {
                    select: {
                        id: true,
                        name: true,
                        rating: true,
                        verifiedStatus: true,
                        licenses: true,
                    },
                },
                security: true,
            },
        });
        if (!bid) {
            throw new common_1.NotFoundException('Заявка не найдена');
        }
        return bid;
    }
    async findByCompany(userId) {
        const company = await this.companiesService.findByUserId(userId);
        return this.prisma.bid.findMany({
            where: { supplierCompanyId: company.id },
            include: {
                lot: {
                    select: {
                        id: true,
                        title: true,
                        budget: true,
                        currency: true,
                        status: true,
                        deadlines: true,
                        customer: {
                            select: {
                                name: true,
                                rating: true,
                            },
                        },
                    },
                },
                security: {
                    select: {
                        amount5pct: true,
                        status: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async findByLot(lotId) {
        return this.prisma.bid.findMany({
            where: { lotId },
            include: {
                supplier: {
                    select: {
                        id: true,
                        name: true,
                        rating: true,
                        verifiedStatus: true,
                    },
                },
                security: {
                    select: {
                        amount5pct: true,
                        status: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async approve(userId, bidId) {
        const company = await this.companiesService.findByUserId(userId);
        const bid = await this.prisma.bid.findUnique({
            where: { id: bidId },
            include: { lot: true },
        });
        if (!bid) {
            throw new common_1.NotFoundException('Заявка не найдена');
        }
        if (bid.lot.customerCompanyId !== company.id) {
            throw new common_1.ForbiddenException('Вы можете одобрять заявки только на свои лоты');
        }
        if (bid.status !== 'pending') {
            throw new common_1.BadRequestException('Можно одобрять только заявки в статусе "На рассмотрении"');
        }
        return this.prisma.bid.update({
            where: { id: bidId },
            data: { status: 'approved' },
        });
    }
    async reject(userId, bidId, reason) {
        const company = await this.companiesService.findByUserId(userId);
        const bid = await this.prisma.bid.findUnique({
            where: { id: bidId },
            include: { lot: true, security: true },
        });
        if (!bid) {
            throw new common_1.NotFoundException('Заявка не найдена');
        }
        if (bid.lot.customerCompanyId !== company.id) {
            throw new common_1.ForbiddenException('Вы можете отклонять заявки только на свои лоты');
        }
        if (bid.status !== 'pending') {
            throw new common_1.BadRequestException('Можно отклонять только заявки в статусе "На рассмотрении"');
        }
        const updatedBid = await this.prisma.bid.update({
            where: { id: bidId },
            data: {
                status: 'rejected',
            },
        });
        if (bid.security) {
            await this.refundBidSecurity(bid.security.id);
        }
        return updatedBid;
    }
    async getStats(userId) {
        const company = await this.companiesService.findByUserId(userId);
        const [total, pending, approved, rejected, won] = await Promise.all([
            this.prisma.bid.count({
                where: { supplierCompanyId: company.id },
            }),
            this.prisma.bid.count({
                where: {
                    supplierCompanyId: company.id,
                    status: 'pending',
                },
            }),
            this.prisma.bid.count({
                where: {
                    supplierCompanyId: company.id,
                    status: 'approved',
                },
            }),
            this.prisma.bid.count({
                where: {
                    supplierCompanyId: company.id,
                    status: 'rejected',
                },
            }),
            this.prisma.bid.count({
                where: {
                    supplierCompanyId: company.id,
                    status: 'winner',
                },
            }),
        ]);
        const successRate = total > 0 ? (won / total) * 100 : 0;
        return {
            total,
            pending,
            approved,
            rejected,
            won,
            successRate: Math.round(successRate * 100) / 100,
        };
    }
};
exports.BidsService = BidsService;
exports.BidsService = BidsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        companies_service_1.CompaniesService])
], BidsService);
//# sourceMappingURL=bids.service.js.map