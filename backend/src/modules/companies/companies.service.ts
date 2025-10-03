import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Создание профиля компании
   */
  async create(userId: string, createCompanyDto: CreateCompanyDto) {
    // Проверка, что у пользователя еще нет компании
    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { company: true },
    });

    if (existingUser?.company) {
      throw new BadRequestException('У пользователя уже есть зарегистрированная компания');
    }

    // Проверка уникальности БИН/ИИН
    const existingCompany = await this.prisma.company.findUnique({
      where: { binIin: createCompanyDto.binIin },
    });

    if (existingCompany) {
      throw new BadRequestException('Компания с таким БИН/ИИН уже зарегистрирована');
    }

    // Создание компании
    const company = await this.prisma.company.create({
      data: {
        ...createCompanyDto,

        address: createCompanyDto.address || '',
        bankReqs: createCompanyDto.bankReqs || {},
        verifiedStatus: 'draft',
        rating: 0,
        blacklistFlag: false,
      },
    });

    // Привязка компании к пользователю
    await this.prisma.user.update({
      where: { id: userId },
      data: { companyId: company.id },
    });

    return company;
  }

  /**
   * Получение профиля компании по ID пользователя
   */
  async findByUserId(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { company: true },
    });

    if (!user?.company) {
      throw new NotFoundException('Компания не найдена');
    }

    return user.company;
  }

  /**
   * Получение компании по ID
   */
  async findOne(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
            status: true,
            lastLogin: true,
          },
        },
      },
    });

    if (!company) {
      throw new NotFoundException('Компания не найдена');
    }

    return company;
  }

  /**
   * Обновление профиля компании
   */
  async update(userId: string, updateCompanyDto: UpdateCompanyDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { company: true },
    });

    if (!user?.company) {
      throw new NotFoundException('Компания не найдена');
    }

    // Если обновляется БИН/ИИН, проверяем уникальность
    if (updateCompanyDto.binIin && updateCompanyDto.binIin !== user.company.binIin) {
      const existingCompany = await this.prisma.company.findUnique({
        where: { binIin: updateCompanyDto.binIin },
      });

      if (existingCompany) {
        throw new BadRequestException('Компания с таким БИН/ИИН уже зарегистрирована');
      }
    }

    return this.prisma.company.update({
      where: { id: user.company.id },
      data: updateCompanyDto,
    });
  }

  /**
   * Верификация компании (только для администраторов)
   */
  async verify(companyId: string, status: 'verified' | 'rejected', reason?: string) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException('Компания не найдена');
    }

    return this.prisma.company.update({
      where: { id: companyId },
      data: {
        verifiedStatus: status,
        // Можно добавить поле для причины отклонения
      },
    });
  }

  /**
   * Добавление/обновление лицензий компании
   */
  async updateLicenses(userId: string, licenses: any[]) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { company: true },
    });

    if (!user?.company) {
      throw new NotFoundException('Компания не найдена');
    }

    return this.prisma.company.update({
      where: { id: user.company.id },
      data: { licenses },
    });
  }

  /**
   * Проверка соответствия критериям тендера
   */
  async checkTenderCriteria(companyId: string, criteria: any) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException('Компания не найдена');
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

  /**
   * Проверка наличия требуемых лицензий
   */
  private checkLicenses(companyLicenses: any, requiredLicenses: any[]): boolean {
    if (!requiredLicenses || requiredLicenses.length === 0) {
      return true;
    }

    // Логика проверки лицензий
    // Здесь должна быть реализована проверка соответствия лицензий компании требованиям тендера
    return true; // Заглушка
  }

  /**
   * Получение рейтинга компании
   */
  async calculateRating(companyId: string): Promise<number> {
    // Здесь должна быть логика расчета рейтинга на основе:
    // - Доли успешных проектов
    // - Соблюдения сроков
    // - Отсутствия споров
    // - Качества актов
    // - Отзывов
    // - Финансовой дисциплины

    // Заглушка для демонстрации
    return 4.2;
  }

  /**
   * Добавление компании в черный список
   */
  async addToBlacklist(companyId: string, reason: string) {
    return this.prisma.company.update({
      where: { id: companyId },
      data: { blacklistFlag: true },
    });
  }

  /**
   * Удаление компании из черного списка
   */
  async removeFromBlacklist(companyId: string) {
    return this.prisma.company.update({
      where: { id: companyId },
      data: { blacklistFlag: false },
    });
  }
}
