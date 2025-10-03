import { ApiProperty } from '@nestjs/swagger';
import { 
  IsString, 
  IsNumber, 
  IsOptional, 
  IsArray, 
  IsObject, 
  IsBoolean, 
  IsDateString,
  IsIn,
  Min,
  Max,
  MinLength,
  ValidateNested,
  IsNotEmpty
} from 'class-validator';
import { Type } from 'class-transformer';

export class TenderDeadlinesDto {
  @ApiProperty({ description: 'Дата начала подачи заявок' })
  @IsDateString()
  applicationStart: string;

  @ApiProperty({ description: 'Дата окончания подачи заявок' })
  @IsDateString()
  applicationEnd: string;

  @ApiProperty({ description: 'Дата начала исполнения' })
  @IsDateString()
  executionStart: string;

  @ApiProperty({ description: 'Дата окончания исполнения' })
  @IsDateString()
  executionEnd: string;

  @ApiProperty({ description: 'Крайний срок подачи разъяснений', required: false })
  @IsOptional()
  @IsDateString()
  clarificationDeadline?: string;
}

export class TenderCriteriaDto {
  @ApiProperty({ description: 'Критерии оценки заявок' })
  @IsArray()
  evaluationCriteria: string[];

  @ApiProperty({ description: 'Квалификационные требования' })
  @IsArray()
  qualificationRequirements: string[];

  @ApiProperty({ description: 'Технические требования' })
  @IsObject()
  technicalRequirements: any;

  @ApiProperty({ description: 'Вес критерия цены (%)', minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  priceWeight: number;

  @ApiProperty({ description: 'Вес критерия качества (%)', minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  qualityWeight: number;

  @ApiProperty({ description: 'Вес критерия сроков (%)', minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  timelineWeight: number;

  @ApiProperty({ description: 'Требуется ли гарантия' })
  @IsBoolean()
  guaranteeRequired: boolean;

  @ApiProperty({ description: 'Размер гарантии', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  guaranteeAmount?: number;

  @ApiProperty({ description: 'Размер аванса (%)', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  advancePayment?: number;

  @ApiProperty({ description: 'Применение национального режима' })
  @IsBoolean()
  nationalRegime: boolean;
}

export class TenderDocsDto {
  @ApiProperty({ description: 'Техническое задание' })
  @IsArray()
  technicalSpecification: string[];

  @ApiProperty({ description: 'Правовые документы', required: false })
  @IsOptional()
  @IsArray()
  legalDocuments?: string[];

  @ApiProperty({ description: 'Дополнительные документы', required: false })
  @IsOptional()
  @IsArray()
  additionalDocuments?: string[];

  @ApiProperty({ description: 'Шаблоны документов', required: false })
  @IsOptional()
  @IsArray()
  templates?: string[];
}

export class CreateLotDto {
  @ApiProperty({ description: 'Название тендера', minLength: 10 })
  @IsString()
  @MinLength(10)
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Описание тендера', minLength: 50 })
  @IsString()
  @MinLength(50)
  @IsNotEmpty()
  description: string;

  @ApiProperty({ 
    description: 'Тип закупки',
    enum: ['goods', 'services', 'works']
  })
  @IsIn(['goods', 'services', 'works'])
  type: string;

  @ApiProperty({ 
    description: 'Метод закупки',
    enum: ['open_tender', 'limited_tender', 'single_source', 'request_for_quotations']
  })
  @IsIn(['open_tender', 'limited_tender', 'single_source', 'request_for_quotations'])
  method: string;

  @ApiProperty({ description: 'Бюджет тендера', minimum: 1 })
  @IsNumber()
  @Min(1)
  budget: number;

  @ApiProperty({ description: 'Валюта', default: 'KZT' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ description: 'Регион проведения' })
  @IsString()
  @IsNotEmpty()
  region: string;

  @ApiProperty({ description: 'Сроки тендера' })
  @ValidateNested()
  @Type(() => TenderDeadlinesDto)
  deadlines: TenderDeadlinesDto;

  @ApiProperty({ description: 'Критерии оценки' })
  @ValidateNested()
  @Type(() => TenderCriteriaDto)
  criteria: TenderCriteriaDto;

  @ApiProperty({ description: 'Документы тендера', required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => TenderDocsDto)
  docs?: TenderDocsDto;

  @ApiProperty({ description: 'Подлоты', required: false })
  @IsOptional()
  @IsArray()
  lots?: any[];

  @ApiProperty({ description: 'Контактная информация', required: false })
  @IsOptional()
  @IsObject()
  contactInfo?: any;

  @ApiProperty({ description: 'Условия поставки', required: false })
  @IsOptional()
  @IsObject()
  deliveryTerms?: any;

  @ApiProperty({ description: 'Условия оплаты', required: false })
  @IsOptional()
  @IsObject()
  paymentTerms?: any;
}

export class UpdateLotDto {
  @ApiProperty({ description: 'Название тендера', required: false })
  @IsOptional()
  @IsString()
  @MinLength(10)
  title?: string;

  @ApiProperty({ description: 'Описание тендера', required: false })
  @IsOptional()
  @IsString()
  @MinLength(50)
  description?: string;

  @ApiProperty({ description: 'Бюджет тендера', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  budget?: number;

  @ApiProperty({ description: 'Регион проведения', required: false })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiProperty({ description: 'Сроки тендера', required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => TenderDeadlinesDto)
  deadlines?: TenderDeadlinesDto;

  @ApiProperty({ description: 'Критерии оценки', required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => TenderCriteriaDto)
  criteria?: TenderCriteriaDto;

  @ApiProperty({ description: 'Документы тендера', required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => TenderDocsDto)
  docs?: TenderDocsDto;

  @ApiProperty({ description: 'Контактная информация', required: false })
  @IsOptional()
  @IsObject()
  contactInfo?: any;

  @ApiProperty({ description: 'Условия поставки', required: false })
  @IsOptional()
  @IsObject()
  deliveryTerms?: any;

  @ApiProperty({ description: 'Условия оплаты', required: false })
  @IsOptional()
  @IsObject()
  paymentTerms?: any;
}

export class PublishLotDto {
  @ApiProperty({ description: 'Создать эскроу счет' })
  @IsBoolean()
  createEscrow: boolean;

  @ApiProperty({ description: 'Сумма депозита на эскроу счет', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  escrowDeposit?: number;

  @ApiProperty({ description: 'Дополнительные уведомления', required: false })
  @IsOptional()
  @IsArray()
  notifications?: string[];
}

export class LotFilterDto {
  @ApiProperty({ description: 'Поиск по тексту', required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ description: 'Номер тендера', required: false })
  @IsOptional()
  @IsString()
  tenderNumber?: string;

  @ApiProperty({ description: 'Регион', required: false })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiProperty({ 
    description: 'Метод закупки', 
    required: false,
    enum: ['open_tender', 'limited_tender', 'single_source', 'request_for_quotations']
  })
  @IsOptional()
  @IsIn(['open_tender', 'limited_tender', 'single_source', 'request_for_quotations'])
  method?: string;

  @ApiProperty({ 
    description: 'Тип закупки', 
    required: false,
    enum: ['goods', 'services', 'works']
  })
  @IsOptional()
  @IsIn(['goods', 'services', 'works'])
  type?: string;

  @ApiProperty({ description: 'Минимальный бюджет', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minBudget?: number;

  @ApiProperty({ description: 'Максимальный бюджет', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxBudget?: number;

  @ApiProperty({ description: 'Валюта', required: false })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ 
    description: 'Статус тендера', 
    required: false,
    enum: ['draft', 'published', 'closed', 'cancelled', 'winner_selected']
  })
  @IsOptional()
  @IsIn(['draft', 'published', 'closed', 'cancelled', 'winner_selected'])
  status?: string;

  @ApiProperty({ description: 'Дата от', required: false })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiProperty({ description: 'Дата до', required: false })
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiProperty({ description: 'Поле для сортировки', required: false })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({ 
    description: 'Порядок сортировки', 
    required: false,
    enum: ['asc', 'desc']
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: string;

  @ApiProperty({ description: 'Количество записей для пропуска', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  skip?: number;

  @ApiProperty({ description: 'Количество записей для получения', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  take?: number;
}

export class CancelLotDto {
  @ApiProperty({ description: 'Причина отмены тендера' })
  @IsString()
  @MinLength(10)
  @IsNotEmpty()
  reason: string;
}
