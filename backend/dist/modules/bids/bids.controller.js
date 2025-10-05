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
exports.BidsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const bids_service_1 = require("./bids.service");
const bid_dto_1 = require("./dto/bid.dto");
let BidsController = class BidsController {
    constructor(bidsService) {
        this.bidsService = bidsService;
    }
    create(req, createBidDto) {
        return this.bidsService.create(req.user.sub, createBidDto);
    }
    findMy(req) {
        return this.bidsService.findByCompany(req.user.sub);
    }
    getMyStats(req) {
        return this.bidsService.getStats(req.user.sub);
    }
    findByLot(lotId) {
        return this.bidsService.findByLot(lotId);
    }
    findOne(id) {
        return this.bidsService.findOne(id);
    }
    update(req, id, updateBidDto) {
        return this.bidsService.update(req.user.sub, id, updateBidDto);
    }
    withdraw(req, id) {
        return this.bidsService.withdraw(req.user.sub, id);
    }
    approve(req, id) {
        return this.bidsService.approve(req.user.sub, id);
    }
    reject(req, id, rejectBidDto) {
        return this.bidsService.reject(req.user.sub, id, rejectBidDto.reason);
    }
};
exports.BidsController = BidsController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Подача заявки на участие в тендере' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Заявка успешно подана' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Ошибка валидации или заявка уже подана' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Недостаточно прав или не соответствует критериям' }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, bid_dto_1.CreateBidDto]),
    __metadata("design:returntype", void 0)
], BidsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Получение заявок компании' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Список заявок компании' }),
    (0, common_1.Get)('my'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BidsController.prototype, "findMy", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Получение статистики заявок' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Статистика заявок компании' }),
    (0, common_1.Get)('my/stats'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BidsController.prototype, "getMyStats", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Получение заявок на лот' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Список заявок на лот' }),
    (0, common_1.Get)('lot/:lotId'),
    __param(0, (0, common_1.Param)('lotId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BidsController.prototype, "findByLot", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Получение заявки по ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Информация о заявке' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Заявка не найдена' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BidsController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Обновление заявки' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Заявка успешно обновлена' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Нельзя редактировать заявку или срок истек' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Недостаточно прав' }),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, bid_dto_1.UpdateBidDto]),
    __metadata("design:returntype", void 0)
], BidsController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Отзыв заявки' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Заявка отозвана' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Нельзя отозвать заявку' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Недостаточно прав' }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], BidsController.prototype, "withdraw", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Одобрение заявки (для заказчика)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Заявка одобрена' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Нельзя одобрить заявку' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Недостаточно прав' }),
    (0, common_1.Post)(':id/approve'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], BidsController.prototype, "approve", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Отклонение заявки (для заказчика)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Заявка отклонена' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Нельзя отклонить заявку' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Недостаточно прав' }),
    (0, common_1.Post)(':id/reject'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, bid_dto_1.RejectBidDto]),
    __metadata("design:returntype", void 0)
], BidsController.prototype, "reject", null);
exports.BidsController = BidsController = __decorate([
    (0, swagger_1.ApiTags)('Bids'),
    (0, common_1.Controller)('bids'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [bids_service_1.BidsService])
], BidsController);
//# sourceMappingURL=bids.controller.js.map