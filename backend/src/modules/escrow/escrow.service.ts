import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CompaniesService } from '../companies/companies.service';
import { CreateEscrowDto, DepositEscrowDto, WithdrawEscrowDto } from './dto/escrow.dto';

@Injectable()
export class EscrowService {
  constructor(
    private prisma: PrismaService,
    private companiesService: CompaniesService,
  ) {}

  /**
   * Создание эскроу счета для лота
   */
  async create(userId: string, createEscrowDto: CreateEscrowDto) {
    const company = await this.companiesService.findByUserId(userId);
    
    // Проверка, что лот принадлежит компании пользователя
    const lot = await this.prisma.lot.findUnique({
      where: { id: createEscrowDto.lotId },
      include: { customer: true },
    });

    if (!lot) {
      throw new NotFoundException('Лот не найден');
    }

    if (lot.customerCompanyId !== company.id) {
      throw new ForbiddenException('Вы можете создавать эскроу счета только для своих лотов');
    }

    // Проверка, что эскроу счет еще не создан
    const existingEscrow = await this.prisma.escrowAccount.findUnique({
      where: { lotId: createEscrowDto.lotId },
    });

    if (existingEscrow) {
      throw new BadRequestException('Эскроу счет для этого лота уже существует');
    }

    // Создание эскроу счета
    const escrowAccount = await this.prisma.escrowAccount.create({
      data: {
        bankId: createEscrowDto.bankId,
        lotId: createEscrowDto.lotId,
        customerCompanyId: company.id,
        status: 'created',
        balance: 0,
        heldPercent: createEscrowDto.heldPercent || 50, // По умолчанию 50%
      },
      include: {
        lot: true,
        customer: true,
      },
    });

    return escrowAccount;
  }

  /**
   * Депозит средств на эскроу счет
   */
  async deposit(userId: string, escrowId: string, depositDto: DepositEscrowDto) {
    const company = await this.companiesService.findByUserId(userId);
    
    const escrowAccount = await this.prisma.escrowAccount.findUnique({
      where: { id: escrowId },
      include: { lot: true, customer: true },
    });

    if (!escrowAccount) {
      throw new NotFoundException('Эскроу счет не найден');
    }

    if (escrowAccount.customerCompanyId !== company.id) {
      throw new ForbiddenException('Вы можете пополнять только свои эскроу счета');
    }

    if (escrowAccount.status === 'closed') {
      throw new BadRequestException('Эскроу счет закрыт');
    }

    // Здесь должна быть интеграция с банковской системой для проведения платежа
    // Пока используем заглушку
    const paymentResult = await this.processPayment(depositDto);

    if (!paymentResult.success) {
      throw new BadRequestException('Ошибка при проведении платежа: ' + paymentResult.error);
    }

    // Обновление баланса эскроу счета
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

    // Логирование транзакции
    await this.logTransaction(escrowId, 'deposit', depositDto.amount, 'Пополнение эскроу счета');

    return updatedEscrow;
  }

  /**
   * Вывод средств с эскроу счета (только для выплат по актам)
   */
  async withdraw(escrowId: string, withdrawDto: WithdrawEscrowDto) {
    const escrowAccount = await this.prisma.escrowAccount.findUnique({
      where: { id: escrowId },
      include: { lot: true, customer: true },
    });

    if (!escrowAccount) {
      throw new NotFoundException('Эскроу счет не найден');
    }

    if (escrowAccount.balance < withdrawDto.amount) {
      throw new BadRequestException('Недостаточно средств на эскроу счете');
    }

    // Создание записи о выплате
    const payout = await this.prisma.payout.create({
      data: {
        escrowId: escrowId,
        amount: withdrawDto.amount,
        status: 'pending',
        actId: withdrawDto.actId,
      },
    });

    // Здесь должна быть интеграция с банковской системой для перевода средств
    const transferResult = await this.processTransfer(withdrawDto);

    if (!transferResult.success) {
      // Отмена выплаты в случае ошибки
      await this.prisma.payout.update({
        where: { id: payout.id },
        data: { status: 'failed' },
      });
      throw new BadRequestException('Ошибка при переводе средств: ' + transferResult.error);
    }

    // Обновление баланса и статуса выплаты
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

    // Логирование транзакции
    await this.logTransaction(escrowId, 'withdrawal', withdrawDto.amount, 'Выплата по акту');

    return { escrow: updatedEscrow, payout: updatedPayout };
  }

  /**
   * Получение эскроу счета по ID лота
   */
  async findByLotId(lotId: string) {
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
      throw new NotFoundException('Эскроу счет не найден');
    }

    return escrowAccount;
  }

  /**
   * Получение всех эскроу счетов компании
   */
  async findByCompany(userId: string) {
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

  /**
   * Закрытие эскроу счета
   */
  async close(userId: string, escrowId: string) {
    const company = await this.companiesService.findByUserId(userId);
    
    const escrowAccount = await this.prisma.escrowAccount.findUnique({
      where: { id: escrowId },
      include: { lot: true },
    });

    if (!escrowAccount) {
      throw new NotFoundException('Эскроу счет не найден');
    }

    if (escrowAccount.customerCompanyId !== company.id) {
      throw new ForbiddenException('Вы можете закрывать только свои эскроу счета');
    }

    if (escrowAccount.balance > 0) {
      throw new BadRequestException('Нельзя закрыть эскроу счет с положительным балансом');
    }

    return this.prisma.escrowAccount.update({
      where: { id: escrowId },
      data: { status: 'closed' },
    });
  }

  /**
   * Расчет комиссии платформы (1% с оборота)
   */
  async calculatePlatformFee(escrowId: string) {
    const escrowAccount = await this.prisma.escrowAccount.findUnique({
      where: { id: escrowId },
      include: {
        payouts: {
          where: { status: 'completed' },
        },
      },
    });

    if (!escrowAccount) {
      throw new NotFoundException('Эскроу счет не найден');
    }

    const totalPayouts = escrowAccount.payouts.reduce((sum, payout) => sum + payout.amount, 0);
    const platformFee = totalPayouts * 0.01; // 1% комиссия

    return {
      totalPayouts,
      platformFee,
      feeApplied: escrowAccount.fee1pctApplied,
    };
  }

  /**
   * Применение комиссии платформы
   */
  async applyPlatformFee(escrowId: string) {
    const feeInfo = await this.calculatePlatformFee(escrowId);
    
    if (feeInfo.feeApplied) {
      throw new BadRequestException('Комиссия уже применена');
    }

    if (feeInfo.platformFee === 0) {
      throw new BadRequestException('Нет выплат для расчета комиссии');
    }

    return this.prisma.escrowAccount.update({
      where: { id: escrowId },
      data: { fee1pctApplied: true },
    });
  }

  /**
   * Заглушка для обработки платежа
   */
  private async processPayment(depositDto: DepositEscrowDto): Promise<{ success: boolean; error?: string }> {
    // Здесь должна быть интеграция с банковской системой
    // Пока возвращаем успешный результат
    return { success: true };
  }

  /**
   * Заглушка для обработки перевода
   */
  private async processTransfer(withdrawDto: WithdrawEscrowDto): Promise<{ success: boolean; error?: string }> {
    // Здесь должна быть интеграция с банковской системой
    // Пока возвращаем успешный результат
    return { success: true };
  }

  /**
   * Логирование транзакций
   */
  private async logTransaction(escrowId: string, type: string, amount: number, description: string) {
    // Здесь можно добавить логирование в отдельную таблицу транзакций
    console.log(`Escrow ${escrowId}: ${type} ${amount} - ${description}`);
  }
}
