import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CompaniesService } from '../companies/companies.service';
import { CreateBidDto, UpdateBidDto } from './dto/bid.dto';

@Injectable()
export class BidsService {
  constructor(
    private prisma: PrismaService,
    private companiesService: CompaniesService,
  ) {}

  /**
   * Подача заявки на участие в тендере
   */
  async create(userId: string, createBidDto: CreateBidDto) {
    const company = await this.companiesService.findByUserId(userId);
    
    // Проверка существования лота
    const lot = await this.prisma.lot.findUnique({
      where: { id: createBidDto.lotId },
      include: { customer: true },
    });

    if (!lot) {
      throw new NotFoundException('Лот не найден');
    }

    if (lot.status !== 'published') {
      throw new BadRequestException('Заявки можно подавать только на опубликованные лоты');
    }

    // Проверка дедлайна
    const submissionDeadline = new Date(lot.deadlines['submissionDeadline']);
    if (new Date() > submissionDeadline) {
      throw new BadRequestException('Срок подачи заявок истек');
    }

    // Проверка, что компания не подавала заявку на этот лот
    const existingBid = await this.prisma.bid.findFirst({
      where: {
        lotId: createBidDto.lotId,
        supplierCompanyId: company.id,
      },
    });

    if (existingBid) {
      throw new BadRequestException('Вы уже подали заявку на этот лот');
    }

    // Проверка, что компания не является заказчиком
    if (lot.customerCompanyId === company.id) {
      throw new BadRequestException('Нельзя подавать заявку на собственный лот');
    }

    // Проверка соответствия критериям тендера
    const criteriaCheck = await this.companiesService.checkTenderCriteria(company.id, lot.criteria);
    if (!criteriaCheck.passed) {
      throw new BadRequestException('Ваша компания не соответствует критериям тендера');
    }

    // Создание заявки
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

    // Создание обеспечения заявки (5% от суммы заявки)
    await this.createBidSecurity(bid.id, createBidDto.price);

    return bid;
  }

  /**
   * Создание обеспечения заявки
   */
  private async createBidSecurity(bidId: string, bidPrice: number) {
    const securityAmount = bidPrice * 0.05; // 5% от суммы заявки
    const platformShare = securityAmount * 0.4; // 2% от суммы заявки (40% от обеспечения)
    const customerShare = securityAmount * 0.6; // 3% от суммы заявки (60% от обеспечения)

    return this.prisma.security.create({
      data: {
        bidId,
        amount5pct: securityAmount,
        splitPlatform2pct: platformShare,
        splitCustomer3pct: customerShare,
        status: 'pending',
        refundDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 дней
      },
    });
  }

  /**
   * Обновление заявки
   */
  async update(userId: string, id: string, updateBidDto: UpdateBidDto) {
    const company = await this.companiesService.findByUserId(userId);
    
    const bid = await this.prisma.bid.findUnique({
      where: { id },
      include: { lot: true, supplier: true },
    });

    if (!bid) {
      throw new NotFoundException('Заявка не найдена');
    }

    if (bid.supplierCompanyId !== company.id) {
      throw new ForbiddenException('Вы можете редактировать только свои заявки');
    }

    if (bid.status !== 'pending') {
      throw new BadRequestException('Можно редактировать только заявки в статусе "На рассмотрении"');
    }

    // Проверка дедлайна
    const submissionDeadline = new Date(bid.lot.deadlines['submissionDeadline']);
    if (new Date() > submissionDeadline) {
      throw new BadRequestException('Срок подачи заявок истек');
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

  /**
   * Отзыв заявки
   */
  async withdraw(userId: string, id: string) {
    const company = await this.companiesService.findByUserId(userId);
    
    const bid = await this.prisma.bid.findUnique({
      where: { id },
      include: { lot: true, security: true },
    });

    if (!bid) {
      throw new NotFoundException('Заявка не найдена');
    }

    if (bid.supplierCompanyId !== company.id) {
      throw new ForbiddenException('Вы можете отзывать только свои заявки');
    }

    if (bid.status === 'withdrawn') {
      throw new BadRequestException('Заявка уже отозвана');
    }

    if (bid.status === 'winner') {
      throw new BadRequestException('Нельзя отозвать заявку-победителя');
    }

    // Обновление статуса заявки
    const updatedBid = await this.prisma.bid.update({
      where: { id },
      data: { status: 'withdrawn' },
    });

    // Возврат обеспечения заявки
    if (bid.security) {
      await this.refundBidSecurity(bid.security.id);
    }

    return updatedBid;
  }

  /**
   * Возврат обеспечения заявки
   */
  private async refundBidSecurity(securityId: string) {
    return this.prisma.security.update({
      where: { id: securityId },
      data: { status: 'refunded' },
    });
  }

  /**
   * Получение заявки по ID
   */
  async findOne(id: string) {
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
      throw new NotFoundException('Заявка не найдена');
    }

    return bid;
  }

  /**
   * Получение заявок компании
   */
  async findByCompany(userId: string) {
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

  /**
   * Получение заявок на лот
   */
  async findByLot(lotId: string) {
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

  /**
   * Одобрение заявки (для заказчика)
   */
  async approve(userId: string, bidId: string) {
    const company = await this.companiesService.findByUserId(userId);
    
    const bid = await this.prisma.bid.findUnique({
      where: { id: bidId },
      include: { lot: true },
    });

    if (!bid) {
      throw new NotFoundException('Заявка не найдена');
    }

    if (bid.lot.customerCompanyId !== company.id) {
      throw new ForbiddenException('Вы можете одобрять заявки только на свои лоты');
    }

    if (bid.status !== 'pending') {
      throw new BadRequestException('Можно одобрять только заявки в статусе "На рассмотрении"');
    }

    return this.prisma.bid.update({
      where: { id: bidId },
      data: { status: 'approved' },
    });
  }

  /**
   * Отклонение заявки (для заказчика)
   */
  async reject(userId: string, bidId: string, reason?: string) {
    const company = await this.companiesService.findByUserId(userId);
    
    const bid = await this.prisma.bid.findUnique({
      where: { id: bidId },
      include: { lot: true, security: true },
    });

    if (!bid) {
      throw new NotFoundException('Заявка не найдена');
    }

    if (bid.lot.customerCompanyId !== company.id) {
      throw new ForbiddenException('Вы можете отклонять заявки только на свои лоты');
    }

    if (bid.status !== 'pending') {
      throw new BadRequestException('Можно отклонять только заявки в статусе "На рассмотрении"');
    }

    // Обновление статуса заявки
    const updatedBid = await this.prisma.bid.update({
      where: { id: bidId },
      data: { 
        status: 'rejected',
        // Можно добавить поле для причины отклонения
      },
    });

    // Возврат обеспечения заявки
    if (bid.security) {
      await this.refundBidSecurity(bid.security.id);
    }

    return updatedBid;
  }

  /**
   * Получение статистики заявок
   */
  async getStats(userId: string) {
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
}
