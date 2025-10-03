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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EscrowController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const escrow_service_1 = require("./escrow.service");
const escrow_dto_1 = require("./dto/escrow.dto");
let EscrowController = class EscrowController {
    constructor(escrowService) {
        this.escrowService = escrowService;
    }
    create(req, createEscrowDto) {
        return this.escrowService.create(req.user.sub, createEscrowDto);
    }
    deposit(req, id, depositEscrowDto) {
        return this.escrowService.deposit(req.user.sub, id, depositEscrowDto);
    }
    withdraw(id, withdrawEscrowDto) {
        return this.escrowService.withdraw(id, withdrawEscrowDto);
    }
    findByLotId(lotId) {
        return this.escrowService.findByLotId(lotId);
    }
    findMy(req) {
        return this.escrowService.findByCompany(req.user.sub);
    }
    close(req, id) {
        return this.escrowService.close(req.user.sub, id);
    }
    calculateFee(id) {
        return this.escrowService.calculatePlatformFee(id);
    }
    applyFee(id) {
        return this.escrowService.applyPlatformFee(id);
    }
};
exports.EscrowController = EscrowController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Создание эскроу счета для лота' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Эскроу счет успешно создан' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Ошибка валидации или эскроу уже существует' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Недостаточно прав' }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, escrow_dto_1.CreateEscrowDto]),
    __metadata("design:returntype", void 0)
], EscrowController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Пополнение эскроу счета' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Средства успешно зачислены' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Ошибка при проведении платежа' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Недостаточно прав' }),
    (0, common_1.Post)(':id/deposit'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, escrow_dto_1.DepositEscrowDto]),
    __metadata("design:returntype", void 0)
], EscrowController.prototype, "deposit", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Вывод средств с эскроу счета' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Средства успешно выведены' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Недостаточно средств или ошибка перевода' }),
    (0, common_1.Post)(':id/withdraw'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, escrow_dto_1.WithdrawEscrowDto]),
    __metadata("design:returntype", void 0)
], EscrowController.prototype, "withdraw", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Получение эскроу счета по ID лота' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Информация об эскроу счете' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Эскроу счет не найден' }),
    (0, common_1.Get)('lot/:lotId'),
    __param(0, (0, common_1.Param)('lotId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EscrowController.prototype, "findByLotId", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Получение всех эскроу счетов компании' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Список эскроу счетов' }),
    (0, common_1.Get)('my'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EscrowController.prototype, "findMy", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Закрытие эскроу счета' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Эскроу счет закрыт' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Нельзя закрыть счет с положительным балансом' }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], EscrowController.prototype, "close", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Расчет комиссии платформы' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Информация о комиссии' }),
    (0, common_1.Get)(':id/fee'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EscrowController.prototype, "calculateFee", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Применение комиссии платформы' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Комиссия применена' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Комиссия уже применена или нет выплат' }),
    (0, common_1.Post)(':id/apply-fee'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EscrowController.prototype, "applyFee", null);
exports.EscrowController = EscrowController = __decorate([
    (0, swagger_1.ApiTags)('Escrow'),
    (0, common_1.Controller)('escrow'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [escrow_service_1.EscrowService])
], EscrowController);
//# sourceMappingURL=escrow.controller.js.map