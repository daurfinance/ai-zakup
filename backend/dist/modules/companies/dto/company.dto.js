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
exports.VerifyCompanyDto = exports.UpdateCompanyDto = exports.CreateCompanyDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateCompanyDto {
}
exports.CreateCompanyDto = CreateCompanyDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ТОО "Строительная компания"', description: 'Наименование компании' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'llp', description: 'Тип компании', enum: ['llp', 'jsc', 'sp'] }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'г. Алматы, ул. Абая, 123', description: 'Юридический адрес', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Банковские реквизиты',
        example: { iban: 'KZ123456789012345678', bik: 'KKMFKZ2A' },
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateCompanyDto.prototype, "bankReqs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Лицензии и сертификаты',
        example: [{ type: 'строительная', number: 'СТР-123', validUntil: '2025-12-31' }]
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateCompanyDto.prototype, "licenses", void 0);
class UpdateCompanyDto {
}
exports.UpdateCompanyDto = UpdateCompanyDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ТОО "Строительная компания"', description: 'Наименование компании' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ТОО', description: 'Организационно-правовая форма' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "opf", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'г. Алматы, ул. Абая, 123', description: 'Юридический адрес' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Банковские реквизиты',
        example: { iban: 'KZ123456789012345678', bik: 'KKMFKZ2A' }
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateCompanyDto.prototype, "bankReqs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Лицензии и сертификаты',
        example: [{ type: 'строительная', number: 'СТР-123', validUntil: '2025-12-31' }]
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], UpdateCompanyDto.prototype, "licenses", void 0);
class VerifyCompanyDto {
}
exports.VerifyCompanyDto = VerifyCompanyDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'verified',
        description: 'Статус верификации',
        enum: ['verified', 'rejected']
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VerifyCompanyDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Документы не соответствуют требованиям', description: 'Причина отклонения' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VerifyCompanyDto.prototype, "reason", void 0);
//# sourceMappingURL=company.dto.js.map