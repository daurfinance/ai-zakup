import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CompaniesService } from '../companies/companies.service';
import { CreateLotDto, UpdateLotDto, LotFilterDto, PublishLotDto } from './dto/lot.dto';

@Injectable()
export class LotsService {
  constructor(
    private prisma: PrismaService,
    private companiesService: CompaniesService,
  ) {}

  async create(userId: string, createLotDto: CreateLotDto) {
    const company = await this.companiesService.findByUserId(userId);
    
    if (company.verifiedStatus !== 'verified') {
      throw new BadRequestException('Только верифицированные компании могут создавать тендеры');
    }

    this.validateTenderData(createLotDto);

    const tenderNumber = await this.generateTenderNumber(createLotDto.type);

    const lot = await this.prisma.lot.create({
      data: {
        customer: {
          connect: { id: company.id }
        },
        status: 'draft',
        tenderNumber,
        title: createLotDto.title,
        description: createLotDto.description,
        type: createLotDto.type,
        method: createLotDto.method,
        budget: createLotDto.budget,
        currency: createLotDto.currency || 'KZT',
        region: createLotDto.region,
        deadlines: {
          applicationStart: createLotDto.deadlines.applicationStart,
          applicationEnd: createLotDto.deadlines.applicationEnd,
          executionStart: createLotDto.deadlines.executionStart,
          executionEnd: createLotDto.deadlines.executionEnd,
          clarificationDeadline: createLotDto.deadlines.clarificationDeadline,
        },
        criteria: {
          evaluationCriteria: createLotDto.criteria.evaluationCriteria || [],
          qualificationRequirements: createLotDto.criteria.qualificationRequirements || [],
          technicalRequirements: createLotDto.criteria.technicalRequirements || {},
          priceWeight: createLotDto.criteria.priceWeight || 70,
          qualityWeight: createLotDto.criteria.qualityWeight || 20,
          timelineWeight: createLotDto.criteria.timelineWeight || 10,
          guaranteeRequired: createLotDto.criteria.guaranteeRequired || false,
          guaranteeAmount: createLotDto.criteria.guaranteeAmount || 0,
          advancePayment: createLotDto.criteria.advancePayment || 0,
          nationalRegime: createLotDto.criteria.nationalRegime || false,
        },
        docs: {
          technicalSpecification: createLotDto.docs?.technicalSpecification || [],
          legalDocuments: createLotDto.docs?.legalDocuments || [],
          additionalDocuments: createLotDto.docs?.additionalDocuments || [],
          templates: createLotDto.docs?.templates || [],
        },
        lots: createLotDto.lots || [],
        contactInfo: createLotDto.contactInfo || {},
        deliveryTerms: createLotDto.deliveryTerms || {},
        paymentTerms: createLotDto.paymentTerms || {},
      },
      include: {
        customer: true,
      },
    });

    return lot;
  }

  private validateTenderData(data: CreateLotDto) {
    if (!data.title || data.title.length < 10) {
      throw new BadRequestException('Название тендера должно содержать минимум 10 символов');
    }

    if (!data.description || data.description.length < 50) {
      throw new BadRequestException('Описание тендера должно содержать минимум 50 символов');
    }

    if (!data.budget || data.budget <= 0) {
      throw new BadRequestException('Бюджет тендера должен быть больше 0');
    }

    const now = new Date();
    const applicationStart = new Date(data.deadlines.applicationStart);
    const applicationEnd = new Date(data.deadlines.applicationEnd);
    const executionStart = new Date(data.deadlines.executionStart);
    const executionEnd = new Date(data.deadlines.executionEnd);

    if (applicationStart <= now) {
      throw new BadRequestException('Дата начала подачи заявок должна быть в будущем');
    }

    if (applicationEnd <= applicationStart) {
      throw new BadRequestException('Дата окончания подачи заявок должна быть позже даты начала');
    }

    if (executionStart <= applicationEnd) {
      throw new BadRequestException('Дата начала исполнения должна быть позже окончания подачи заявок');
    }

    if (executionEnd <= executionStart) {
      throw new BadRequestException('Дата окончания исполнения должна быть позже даты начала');
    }

    const minApplicationPeriod = data.method === 'open_tender' ? 7 : 3;
    const applicationPeriodDays = Math.ceil((applicationEnd.getTime() - applicationStart.getTime()) / (1000 * 60 * 60 * 24));
    
    if (applicationPeriodDays < minApplicationPeriod) {
      throw new BadRequestException(`Минимальный срок подачи заявок: ${minApplicationPeriod} дней`);
    }

    const validTypes = ['goods', 'services', 'works'];
    const validMethods = ['open_tender', 'limited_tender', 'single_source', 'request_for_quotations'];

    if (!validTypes.includes(data.type)) {
      throw new BadRequestException('Недопустимый тип закупки');
    }

    if (!validMethods.includes(data.method)) {
      throw new BadRequestException('Недопустимый метод закупки');
    }

    if (data.method === 'single_source' && data.budget > 1000000) {
      throw new BadRequestException('Закупка из одного источника не может превышать 1,000,000 тенге');
    }
  }

  private async generateTenderNumber(type: string): Promise<string> {
    const year = new Date().getFullYear();
    const typePrefix = {
      goods: 'T',
      services: 'S', 
      works: 'W'
    }[type] || 'T';

    const lastTender = await this.prisma.lot.findFirst({
      where: {
        tenderNumber: {
          startsWith: `${typePrefix}-${year}-`
        }
      },
      orderBy: {
        tenderNumber: 'desc'
      }
    });

    let nextNumber = 1;
    if (lastTender) {
      const lastNumber = parseInt(lastTender.tenderNumber.split('-')[2]);
      nextNumber = lastNumber + 1;
    }

    return `${typePrefix}-${year}-${nextNumber.toString().padStart(6, '0')}`;
  }

  async findAll(filters: LotFilterDto) {
    const where: any = {};

    if (filters.region) {
      where.region = { contains: filters.region, mode: 'insensitive' };
    }

    if (filters.method) {
      where.method = filters.method;
    }

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.minBudget || filters.maxBudget) {
      where.budget = {};
      if (filters.minBudget) where.budget.gte = filters.minBudget;
      if (filters.maxBudget) where.budget.lte = filters.maxBudget;
    }

    if (filters.currency) {
      where.currency = filters.currency;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) where.createdAt.gte = new Date(filters.dateFrom);
      if (filters.dateTo) where.createdAt.lte = new Date(filters.dateTo);
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { tenderNumber: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.tenderNumber) {
      where.tenderNumber = { contains: filters.tenderNumber, mode: 'insensitive' };
    }

    const lots = await this.prisma.lot.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            verifiedStatus: true,
          },
        },
        _count: {
          select: {
            bids: true,
          },
        },
      },
      orderBy: filters.sortBy ? {
        [filters.sortBy]: filters.sortOrder || 'desc'
      } : {
        createdAt: 'desc',
      },
      skip: filters.skip || 0,
      take: Math.min(filters.take || 20, 100),
    });

    const total = await this.prisma.lot.count({ where });

    return {
      lots,
      total,
      hasMore: (filters.skip || 0) + lots.length < total,
      page: Math.floor((filters.skip || 0) / (filters.take || 20)) + 1,
      totalPages: Math.ceil(total / (filters.take || 20)),
    };
  }

  async findOne(id: string, userId?: string) {
    const lot = await this.prisma.lot.findUnique({
      where: { id },
      include: {
        customer: true,
        bids: {
          include: {
            supplier: {
              select: {
                id: true,
                name: true,
                rating: true,
                verifiedStatus: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        escrowAccount: true,
        contract: {
          include: {
            acts: true,
          },
        },
        guarantees: true
      },
    });

    if (!lot) {
      throw new NotFoundException('Тендер не найден');
    }

    if (lot.status === 'draft' && userId) {
      const company = await this.companiesService.findByUserId(userId);
      if (lot.customerCompanyId !== company.id) {
        throw new ForbiddenException('Доступ к черновику тендера разрешен только владельцу');
      }
    }

    const enrichedLot = {
      ...lot,
      daysUntilDeadline: this.calculateDaysUntilDeadline(lot.deadlines),
      isActive: this.isTenderActive(lot),
      canSubmitBid: this.canSubmitBid(lot),
      statistics: {
        totalBids: lot.bids.length,
        activeBids: lot.bids.filter(bid => bid.status === 'submitted').length,
        averageBidPrice: this.calculateAverageBidPrice(lot.bids),
        minBidPrice: this.calculateMinBidPrice(lot.bids),
        maxBidPrice: this.calculateMaxBidPrice(lot.bids),
      },
    };

    return enrichedLot;
  }

  async update(userId: string, id: string, updateLotDto: UpdateLotDto) {
    const lot = await this.findOne(id);
    const company = await this.companiesService.findByUserId(userId);

    if (lot.customerCompanyId !== company.id) {
      throw new ForbiddenException('Вы можете редактировать только свои тендеры');
    }

    if (lot.status !== 'draft') {
      throw new BadRequestException('Можно редактировать только черновики тендеров');
    }

    return this.prisma.lot.update({
      where: { id },
      data: {
        title: updateLotDto.title,
        description: updateLotDto.description,
        budget: updateLotDto.budget,
        region: updateLotDto.region,
        deadlines: updateLotDto.deadlines ? JSON.parse(JSON.stringify(updateLotDto.deadlines)) : undefined,
        criteria: updateLotDto.criteria ? JSON.parse(JSON.stringify(updateLotDto.criteria)) : undefined,
        docs: updateLotDto.docs ? JSON.parse(JSON.stringify(updateLotDto.docs)) : undefined,
        contactInfo: updateLotDto.contactInfo ? JSON.parse(JSON.stringify(updateLotDto.contactInfo)) : undefined,
        deliveryTerms: updateLotDto.deliveryTerms ? JSON.parse(JSON.stringify(updateLotDto.deliveryTerms)) : undefined,
        paymentTerms: updateLotDto.paymentTerms ? JSON.parse(JSON.stringify(updateLotDto.paymentTerms)) : undefined,
        updatedAt: new Date(),
      },
      include: {
        customer: true,
      },
    });
  }

  async publish(userId: string, id: string, publishData: PublishLotDto) {
    const lot = await this.findOne(id);
    const company = await this.companiesService.findByUserId(userId);

    if (lot.customerCompanyId !== company.id) {
      throw new ForbiddenException('Вы можете публиковать только свои тендеры');
    }

    if (lot.status !== 'draft') {
      throw new BadRequestException('Можно публиковать только черновики тендеров');
    }

    this.validateTenderForPublication(lot);

    let escrowAccount = null;
    if (publishData.createEscrow) {
      escrowAccount = await this.createEscrowAccount(lot, publishData.escrowDeposit);
    }

    const publishedLot = await this.prisma.lot.update({
      where: { id },
      data: {
        status: 'published',
        publishedAt: new Date(),
        escrowAccount: escrowAccount ? {
          connect: { id: escrowAccount.id }
        } : undefined,
      },
      include: {
        customer: true,
        escrowAccount: true,
      },
    });

    return publishedLot;
  }

  private validateTenderForPublication(lot: any) {
    if (!lot.title || !lot.description) {
      throw new BadRequestException('Не заполнены обязательные поля тендера');
    }

    if (!lot.deadlines.applicationStart || !lot.deadlines.applicationEnd) {
      throw new BadRequestException('Не указаны сроки подачи заявок');
    }

    if (!lot.criteria.evaluationCriteria || lot.criteria.evaluationCriteria.length === 0) {
      throw new BadRequestException('Не указаны критерии оценки заявок');
    }

    if (!lot.docs.technicalSpecification || lot.docs.technicalSpecification.length === 0) {
      throw new BadRequestException('Не загружено техническое задание');
    }
  }

  private async createEscrowAccount(lot: any, depositAmount: number) {
    const requiredDeposit = lot.budget * 0.5;
    
    if (depositAmount < requiredDeposit) {
      throw new BadRequestException(
        `Недостаточная сумма депозита. Требуется минимум ${requiredDeposit} ${lot.currency}`
      );
    }

    return this.prisma.escrowAccount.create({
      data: {
        bankId: 'default_bank',
        lot: { connect: { id: lot.id } },
        customer: { connect: { id: lot.customerCompanyId } },
        status: 'created',
        balance: depositAmount,
        heldPercent: 50,
      },
    });
  }

  async findByCompany(userId: string, status?: string) {
    const company = await this.companiesService.findByUserId(userId);

    const where: any = { customerCompanyId: company.id };
    if (status) {
      where.status = status;
    }

    return this.prisma.lot.findMany({
      where,
      include: {
        _count: {
          select: {
            bids: true,
          },
        },
        escrowAccount: {
          select: {
            balance: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async cancel(userId: string, id: string, reason: string) {
    const lot = await this.findOne(id);
    const company = await this.companiesService.findByUserId(userId);

    if (lot.customerCompanyId !== company.id) {
      throw new ForbiddenException('Вы можете отменять только свои тендеры');
    }

    if (lot.status !== 'published') {
      throw new BadRequestException('Можно отменить только опубликованный тендер');
    }

    const cancelledLot = await this.prisma.lot.update({
      where: { id },
      data: {
        status: 'cancelled',
        cancellationReason: reason,
        updatedAt: new Date(),
      },
      include: {
        customer: true,
      },
    });

    return cancelledLot;
  }

  async close(userId: string, id: string) {
    const lot = await this.prisma.lot.findUnique({
      where: { id },
      include: { customer: true },
    });

    if (!lot) {
      throw new NotFoundException('Тендер не найден');
    }

    if (lot.customer.id !== userId) {
      throw new ForbiddenException('Нет прав для закрытия этого тендера');
    }

    if (lot.status !== 'published') {
      throw new BadRequestException('Можно закрыть только опубликованный тендер');
    }

    return this.prisma.lot.update({
      where: { id },
      data: {
        status: 'closed',
        updatedAt: new Date(),
      },
      include: {
        customer: {
          include: { user: true },
        },
        bids: {
          include: {
            supplier: {
              include: { user: true },
            },
          },
        },
      },
    });
  }

  async selectWinner(id: string) {
    const lot = await this.prisma.lot.findUnique({
      where: { id },
      include: {
        bids: {
          include: {
            supplier: {
              include: { user: true },
            },
          },
        },
      },
    });

    if (!lot) {
      throw new NotFoundException('Тендер не найден');
    }

    if (lot.status !== 'published') {
      throw new BadRequestException('Можно выбрать победителя только для опубликованного тендера');
    }

    if (!lot.bids || lot.bids.length === 0) {
      throw new BadRequestException('Нет заявок для выбора победителя');
    }

    const winnerBid = lot.bids.reduce((prev, current) => 
      prev.price < current.price ? prev : current
    );

    await this.prisma.lot.update({
      where: { id },
      data: {
        status: 'winner_selected',
        updatedAt: new Date(),
      },
    });

    await this.prisma.bid.update({
      where: { id: winnerBid.id },
      data: {
        status: 'winner',
        updatedAt: new Date(),
      },
    });

    await this.prisma.bid.updateMany({
      where: {
        lotId: id,
        id: { not: winnerBid.id },
      },
      data: {
        status: 'rejected',
        updatedAt: new Date(),
      },
    });

    return {
      lot,
      winnerBid,
      message: 'Победитель выбран успешно',
    };
  }

  private calculateDaysUntilDeadline(deadlines: any): number {
    if (!deadlines.applicationEnd) return 0;
    const deadline = new Date(deadlines.applicationEnd);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private isTenderActive(lot: any): boolean {
    const now = new Date();
    const applicationStart = new Date(lot.deadlines.applicationStart);
    const applicationEnd = new Date(lot.deadlines.applicationEnd);
    
    return lot.status === 'published' && 
           now >= applicationStart && 
           now <= applicationEnd;
  }

  private canSubmitBid(lot: any): boolean {
    return this.isTenderActive(lot);
  }

  private calculateAverageBidPrice(bids: any[]): number {
    if (bids.length === 0) return 0;
    const total = bids.reduce((sum, bid) => sum + bid.price, 0);
    return total / bids.length;
  }

  private calculateMinBidPrice(bids: any[]): number {
    if (bids.length === 0) return 0;
    return Math.min(...bids.map(bid => bid.price));
  }

  private calculateMaxBidPrice(bids: any[]): number {
    if (bids.length === 0) return 0;
    return Math.max(...bids.map(bid => bid.price));
  }
}

