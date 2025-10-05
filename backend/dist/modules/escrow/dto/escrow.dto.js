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
exports.EscrowBalanceDto = exports.WithdrawEscrowDto = exports.DepositEscrowDto = exports.CreateEscrowDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateEscrowDto {
}
exports.CreateEscrowDto = CreateEscrowDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'lot_123', description: 'ID лота' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEscrowDto.prototype, "lotId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'KKMFKZ2A', description: 'ID банка для эскроу счета' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEscrowDto.prototype, "bankId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 50,
        description: 'Процент средств, удерживаемых на эскроу (по умолчанию 50%)',
        minimum: 10,
        maximum: 100
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(10),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CreateEscrowDto.prototype, "heldPercent", void 0);
class DepositEscrowDto {
}
exports.DepositEscrowDto = DepositEscrowDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 25000000, description: 'Сумма депозита' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], DepositEscrowDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'KZT', description: 'Валюта депозита' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DepositEscrowDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'KZ123456789012345678',
        description: 'IBAN счета для списания средств'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DepositEscrowDto.prototype, "sourceAccount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Депозит для обеспечения тендера',
        description: 'Назначение платежа'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DepositEscrowDto.prototype, "purpose", void 0);
class WithdrawEscrowDto {
}
exports.WithdrawEscrowDto = WithdrawEscrowDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5000000, description: 'Сумма вывода' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], WithdrawEscrowDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'KZT', description: 'Валюта вывода' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WithdrawEscrowDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'KZ987654321098765432',
        description: 'IBAN счета для зачисления средств'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WithdrawEscrowDto.prototype, "destinationAccount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'act_456',
        description: 'ID акта, по которому производится выплата'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WithdrawEscrowDto.prototype, "actId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Выплата по акту выполненных работ этап 1',
        description: 'Назначение платежа'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WithdrawEscrowDto.prototype, "purpose", void 0);
class EscrowBalanceDto {
}
exports.EscrowBalanceDto = EscrowBalanceDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 25000000, description: 'Текущий баланс эскроу счета' }),
    __metadata("design:type", Number)
], EscrowBalanceDto.prototype, "balance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50, description: 'Процент удерживаемых средств' }),
    __metadata("design:type", Number)
], EscrowBalanceDto.prototype, "heldPercent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12500000, description: 'Доступно для вывода' }),
    __metadata("design:type", Number)
], EscrowBalanceDto.prototype, "availableForWithdrawal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12500000, description: 'Заблокировано' }),
    __metadata("design:type", Number)
], EscrowBalanceDto.prototype, "heldAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'KZT', description: 'Валюта счета' }),
    __metadata("design:type", String)
], EscrowBalanceDto.prototype, "currency", void 0);
//# sourceMappingURL=escrow.dto.js.map