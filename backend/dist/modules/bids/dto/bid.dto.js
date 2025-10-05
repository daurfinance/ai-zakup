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
exports.RejectBidDto = exports.UpdateBidDto = exports.CreateBidDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateBidDto {
}
exports.CreateBidDto = CreateBidDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'lot_123', description: 'ID лота' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBidDto.prototype, "lotId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 45000000, description: 'Предлагаемая цена' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], CreateBidDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'KZT', description: 'Валюта' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBidDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 120, description: 'Срок выполнения в днях' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateBidDto.prototype, "etaDays", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Вложения к заявке',
        example: [
            { name: 'Коммерческое предложение.pdf', url: '/uploads/proposal.pdf', type: 'proposal' },
            { name: 'Лицензия.pdf', url: '/uploads/license.pdf', type: 'license' }
        ]
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateBidDto.prototype, "attachments", void 0);
class UpdateBidDto {
}
exports.UpdateBidDto = UpdateBidDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 45000000, description: 'Предлагаемая цена' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], UpdateBidDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'KZT', description: 'Валюта' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBidDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 120, description: 'Срок выполнения в днях' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateBidDto.prototype, "etaDays", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Вложения к заявке',
        example: [
            { name: 'Коммерческое предложение.pdf', url: '/uploads/proposal.pdf', type: 'proposal' },
            { name: 'Лицензия.pdf', url: '/uploads/license.pdf', type: 'license' }
        ]
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], UpdateBidDto.prototype, "attachments", void 0);
class RejectBidDto {
}
exports.RejectBidDto = RejectBidDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Не соответствует техническим требованиям',
        description: 'Причина отклонения заявки'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RejectBidDto.prototype, "reason", void 0);
//# sourceMappingURL=bid.dto.js.map