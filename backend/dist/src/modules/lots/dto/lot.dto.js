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
exports.CancelLotDto = exports.LotFilterDto = exports.PublishLotDto = exports.UpdateLotDto = exports.CreateLotDto = exports.TenderDocsDto = exports.TenderCriteriaDto = exports.TenderDeadlinesDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class TenderDeadlinesDto {
}
exports.TenderDeadlinesDto = TenderDeadlinesDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Дата начала подачи заявок' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], TenderDeadlinesDto.prototype, "applicationStart", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Дата окончания подачи заявок' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], TenderDeadlinesDto.prototype, "applicationEnd", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Дата начала исполнения' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], TenderDeadlinesDto.prototype, "executionStart", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Дата окончания исполнения' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], TenderDeadlinesDto.prototype, "executionEnd", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Крайний срок подачи разъяснений', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], TenderDeadlinesDto.prototype, "clarificationDeadline", void 0);
class TenderCriteriaDto {
}
exports.TenderCriteriaDto = TenderCriteriaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Критерии оценки заявок' }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], TenderCriteriaDto.prototype, "evaluationCriteria", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Квалификационные требования' }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], TenderCriteriaDto.prototype, "qualificationRequirements", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Технические требования' }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], TenderCriteriaDto.prototype, "technicalRequirements", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Вес критерия цены (%)', minimum: 0, maximum: 100 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], TenderCriteriaDto.prototype, "priceWeight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Вес критерия качества (%)', minimum: 0, maximum: 100 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], TenderCriteriaDto.prototype, "qualityWeight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Вес критерия сроков (%)', minimum: 0, maximum: 100 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], TenderCriteriaDto.prototype, "timelineWeight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Требуется ли гарантия' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], TenderCriteriaDto.prototype, "guaranteeRequired", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Размер гарантии', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], TenderCriteriaDto.prototype, "guaranteeAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Размер аванса (%)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], TenderCriteriaDto.prototype, "advancePayment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Применение национального режима' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], TenderCriteriaDto.prototype, "nationalRegime", void 0);
class TenderDocsDto {
}
exports.TenderDocsDto = TenderDocsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Техническое задание' }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], TenderDocsDto.prototype, "technicalSpecification", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Правовые документы', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], TenderDocsDto.prototype, "legalDocuments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Дополнительные документы', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], TenderDocsDto.prototype, "additionalDocuments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Шаблоны документов', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], TenderDocsDto.prototype, "templates", void 0);
class CreateLotDto {
}
exports.CreateLotDto = CreateLotDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Название тендера', minLength: 10 }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(10),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateLotDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Описание тендера', minLength: 50 }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(50),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateLotDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Тип закупки',
        enum: ['goods', 'services', 'works']
    }),
    (0, class_validator_1.IsIn)(['goods', 'services', 'works']),
    __metadata("design:type", String)
], CreateLotDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Метод закупки',
        enum: ['open_tender', 'limited_tender', 'single_source', 'request_for_quotations']
    }),
    (0, class_validator_1.IsIn)(['open_tender', 'limited_tender', 'single_source', 'request_for_quotations']),
    __metadata("design:type", String)
], CreateLotDto.prototype, "method", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Бюджет тендера', minimum: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateLotDto.prototype, "budget", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Валюта', default: 'KZT' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLotDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Регион проведения' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateLotDto.prototype, "region", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Сроки тендера' }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => TenderDeadlinesDto),
    __metadata("design:type", TenderDeadlinesDto)
], CreateLotDto.prototype, "deadlines", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Критерии оценки' }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => TenderCriteriaDto),
    __metadata("design:type", TenderCriteriaDto)
], CreateLotDto.prototype, "criteria", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Документы тендера', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => TenderDocsDto),
    __metadata("design:type", TenderDocsDto)
], CreateLotDto.prototype, "docs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Подлоты', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateLotDto.prototype, "lots", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Контактная информация', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateLotDto.prototype, "contactInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Условия поставки', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateLotDto.prototype, "deliveryTerms", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Условия оплаты', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateLotDto.prototype, "paymentTerms", void 0);
class UpdateLotDto {
}
exports.UpdateLotDto = UpdateLotDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Название тендера', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(10),
    __metadata("design:type", String)
], UpdateLotDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Описание тендера', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(50),
    __metadata("design:type", String)
], UpdateLotDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Бюджет тендера', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateLotDto.prototype, "budget", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Регион проведения', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateLotDto.prototype, "region", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Сроки тендера', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => TenderDeadlinesDto),
    __metadata("design:type", TenderDeadlinesDto)
], UpdateLotDto.prototype, "deadlines", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Критерии оценки', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => TenderCriteriaDto),
    __metadata("design:type", TenderCriteriaDto)
], UpdateLotDto.prototype, "criteria", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Документы тендера', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => TenderDocsDto),
    __metadata("design:type", TenderDocsDto)
], UpdateLotDto.prototype, "docs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Контактная информация', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateLotDto.prototype, "contactInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Условия поставки', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateLotDto.prototype, "deliveryTerms", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Условия оплаты', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateLotDto.prototype, "paymentTerms", void 0);
class PublishLotDto {
}
exports.PublishLotDto = PublishLotDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Создать эскроу счет' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], PublishLotDto.prototype, "createEscrow", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Сумма депозита на эскроу счет', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PublishLotDto.prototype, "escrowDeposit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Дополнительные уведомления', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], PublishLotDto.prototype, "notifications", void 0);
class LotFilterDto {
}
exports.LotFilterDto = LotFilterDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Поиск по тексту', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LotFilterDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Номер тендера', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LotFilterDto.prototype, "tenderNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Регион', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LotFilterDto.prototype, "region", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Метод закупки',
        required: false,
        enum: ['open_tender', 'limited_tender', 'single_source', 'request_for_quotations']
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['open_tender', 'limited_tender', 'single_source', 'request_for_quotations']),
    __metadata("design:type", String)
], LotFilterDto.prototype, "method", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Тип закупки',
        required: false,
        enum: ['goods', 'services', 'works']
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['goods', 'services', 'works']),
    __metadata("design:type", String)
], LotFilterDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Минимальный бюджет', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], LotFilterDto.prototype, "minBudget", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Максимальный бюджет', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], LotFilterDto.prototype, "maxBudget", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Валюта', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LotFilterDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Статус тендера',
        required: false,
        enum: ['draft', 'published', 'closed', 'cancelled', 'winner_selected']
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['draft', 'published', 'closed', 'cancelled', 'winner_selected']),
    __metadata("design:type", String)
], LotFilterDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Дата от', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], LotFilterDto.prototype, "dateFrom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Дата до', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], LotFilterDto.prototype, "dateTo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Поле для сортировки', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LotFilterDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Порядок сортировки',
        required: false,
        enum: ['asc', 'desc']
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['asc', 'desc']),
    __metadata("design:type", String)
], LotFilterDto.prototype, "sortOrder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Количество записей для пропуска', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], LotFilterDto.prototype, "skip", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Количество записей для получения', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], LotFilterDto.prototype, "take", void 0);
class CancelLotDto {
}
exports.CancelLotDto = CancelLotDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Причина отмены тендера' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(10),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CancelLotDto.prototype, "reason", void 0);
//# sourceMappingURL=lot.dto.js.map