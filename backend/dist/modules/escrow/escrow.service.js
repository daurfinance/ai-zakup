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
exports.EscrowService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const companies_service_1 = require("../companies/companies.service");
let EscrowService = class EscrowService {
    constructor(prisma, companiesService) {
        this.prisma = prisma;
        this.companiesService = companiesService;
    }
    async create(userId, createEscrowDto) {
        const company = await this.companiesService.findByUserId(userId);
        const lot = await this.prisma.lot.findUnique({
            where: { id: createEscrowDto.lotId },
            include: { customer: true },
        });
        if (!lot) {
            throw new common_1.NotFoundException('Лот не найден');
        }
        if (lot.customerCompanyId !== company.id) {
            throw new common_1.ForbiddenException('Вы можете создавать эскроу счета только для своих лотов');
        }
        const existingEscrow = await this.prisma.escrowAccount.findUnique({
            where: { lotId: createEscrowDto.lotId },
        });
        if (existingEscrow) {
            throw new common_1.BadRequestException('Эскроу счет для этого лота уже существует');
        }
        const escrowAccount = await this.prisma.escrowAccount.create({
            data: {
                bankId: createEscrowDto.bankId,
                lotId: createEscrowDto.lotId,
                customerCompanyId: company.id,
                status: 'created',
                balance: 0,
                heldPercent: createEscrowDto.heldPercent || 50,
            },
            include: {
                lot: true,
                customer: true,
            },
        });
        return escrowAccount;
    }
    async deposit(userId, escrowId, depositDto) {
        const company = await this.companiesService.findByUserId(userId);
        const escrowAccount = await this.prisma.escrowAccount.findUnique({
            where: { id: escrowId },
            include: { lot: true, customer: true },
        });
        if (!escrowAccount) {
            throw new common_1.NotFoundException('Эскроу счет не найден');
        }
        if (escrowAccount.customerCompanyId !== company.id) {
            throw new common_1.ForbiddenException('Вы можете пополнять только свои эскроу счета');
        }
        if (escrowAccount.status === 'closed') {
            throw new common_1.BadRequestException('Эскроу счет закрыт');
        }
        const paymentResult = await this.processPayment(depositDto);
        if (!paymentResult.success) {
            throw new common_1.BadRequestException('Ошибка при проведении платежа: ' + paymentResult.error);
        }
        const updatedEscrow = await this.prisma.escrowAccount.update({
            where: { id: escrowId },
            data: {
                balance: {
                    increment: depositDto.amount,
                },
                status: 'active',
            },
            include: {
                lot: true,
                customer: true,
            },
        });
        await this.logTransaction(escrowId, 'deposit', depositDto.amount, 'Пополнение эскроу счета');
        return updatedEscrow;
    }
    async withdraw(escrowId, withdrawDto) {
        const escrowAccount = await this.prisma.escrowAccount.findUnique({
            where: { id: escrowId },
            include: { lot: true, customer: true },
        });
        if (!escrowAccount) {
            throw new common_1.NotFoundException('Эскроу счет не найден');
        }
        if (escrowAccount.balance < withdrawDto.amount) {
            throw new common_1.BadRequestException('Недостаточно средств на эскроу счете');
        }
        const payout = await this.prisma.payout.create({
            data: {
                escrowId: escrowId,
                amount: withdrawDto.amount,
                status: 'pending',
                actId: withdrawDto.actId,
            },
        });
        const transferResult = await this.processTransfer(withdrawDto);
        if (!transferResult.success) {
            await this.prisma.payout.update({
                where: { id: payout.id },
                data: { status: 'failed' },
            });
            throw new common_1.BadRequestException('Ошибка при переводе средств: ' + transferResult.error);
        }
        const [updatedEscrow, updatedPayout] = await this.prisma.$transaction([
            this.prisma.escrowAccount.update({
                where: { id: escrowId },
                data: {
                    balance: {
                        decrement: withdrawDto.amount,
                    },
                },
            }),
            this.prisma.payout.update({
                where: { id: payout.id },
                data: { status: 'completed' },
            }),
        ]);
        await this.logTransaction(escrowId, 'withdrawal', withdrawDto.amount, 'Выплата по акту');
        return { escrow: updatedEscrow, payout: updatedPayout };
    }
    async findByLotId(lotId) {
        const escrowAccount = await this.prisma.escrowAccount.findUnique({
            where: { lotId },
            include: {
                lot: true,
                customer: true,
                payouts: {
                    include: {
                        act: true,
                    },
                },
            },
        });
        if (!escrowAccount) {
            throw new common_1.NotFoundException('Эскроу счет не найден');
        }
        return escrowAccount;
    }
    async findByCompany(userId) {
        const company = await this.companiesService.findByUserId(userId);
        return this.prisma.escrowAccount.findMany({
            where: { customerCompanyId: company.id },
            include: {
                lot: {
                    select: {
                        id: true,
                        title: true,
                        budget: true,
                        currency: true,
                        status: true,
                    },
                },
                payouts: {
                    select: {
                        id: true,
                        amount: true,
                        status: true,
                        createdAt: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async close(userId, escrowId) {
        const company = await this.companiesService.findByUserId(userId);
        const escrowAccount = await this.prisma.escrowAccount.findUnique({
            where: { id: escrowId },
            include: { lot: true },
        });
        if (!escrowAccount) {
            throw new common_1.NotFoundException('Эскроу счет не найден');
        }
        if (escrowAccount.customerCompanyId !== company.id) {
            throw new common_1.ForbiddenException('Вы можете закрывать только свои эскроу счета');
        }
        if (escrowAccount.balance > 0) {
            throw new common_1.BadRequestException('Нельзя закрыть эскроу счет с положительным балансом');
        }
        return this.prisma.escrowAccount.update({
            where: { id: escrowId },
            data: { status: 'closed' },
        });
    }
    async calculatePlatformFee(escrowId) {
        const escrowAccount = await this.prisma.escrowAccount.findUnique({
            where: { id: escrowId },
            include: {
                payouts: {
                    where: { status: 'completed' },
                },
            },
        });
        if (!escrowAccount) {
            throw new common_1.NotFoundException('Эскроу счет не найден');
        }
        const totalPayouts = escrowAccount.payouts.reduce((sum, payout) => sum + payout.amount, 0);
        const platformFee = totalPayouts * 0.01;
        return {
            totalPayouts,
            platformFee,
            feeApplied: escrowAccount.fee1pctApplied,
        };
    }
    async applyPlatformFee(escrowId) {
        const feeInfo = await this.calculatePlatformFee(escrowId);
        if (feeInfo.feeApplied) {
            throw new common_1.BadRequestException('Комиссия уже применена');
        }
        if (feeInfo.platformFee === 0) {
            throw new common_1.BadRequestException('Нет выплат для расчета комиссии');
        }
        return this.prisma.escrowAccount.update({
            where: { id: escrowId },
            data: { fee1pctApplied: true },
        });
    }
    async processPayment(depositDto) {
        return { success: true };
    }
    async processTransfer(withdrawDto) {
        return { success: true };
    }
    async logTransaction(escrowId, type, amount, description) {
        console.log(`Escrow ${escrowId}: ${type} ${amount} - ${description}`);
    }
};
exports.EscrowService = EscrowService;
exports.EscrowService = EscrowService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        companies_service_1.CompaniesService])
], EscrowService);
//# sourceMappingURL=escrow.service.js.map