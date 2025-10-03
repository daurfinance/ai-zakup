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
exports.LotsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const lots_service_1 = require("./lots.service");
const lot_dto_1 = require("./dto/lot.dto");
let LotsController = class LotsController {
    constructor(lotsService) {
        this.lotsService = lotsService;
    }
    create(req, createLotDto) {
        return this.lotsService.create(req.user.sub, createLotDto);
    }
    findAll(search, region, method, type, status, minBudget, maxBudget, currency, page, limit) {
        const filters = {
            search,
            region,
            method,
            type,
            status,
            minBudget: minBudget ? parseFloat(minBudget) : undefined,
            maxBudget: maxBudget ? parseFloat(maxBudget) : undefined,
            currency,
        };
        const pagination = {
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 20,
        };
        return this.lotsService.findAll(filters);
    }
    findMy(req) {
        return this.lotsService.findByCompany(req.user.sub);
    }
    findOne(id) {
        return this.lotsService.findOne(id);
    }
    update(req, id, updateLotDto) {
        return this.lotsService.update(req.user.sub, id, updateLotDto);
    }
    publish(req, id) {
        return this.lotsService.publish(req.user.sub, id, { createEscrow: false });
    }
    close(req, id) {
        return this.lotsService.close(req.user.sub, id);
    }
    selectWinner(req, id, bidId) {
        return this.lotsService.selectWinner(id);
    }
    remove(req, id) {
        return this.lotsService.cancel(req.user.sub, id, 'Tender removed by owner');
    }
};
exports.LotsController = LotsController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Создание нового лота' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Лот успешно создан' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Ошибка валидации' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Недостаточно прав' }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, lot_dto_1.CreateLotDto]),
    __metadata("design:returntype", void 0)
], LotsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Получение списка лотов с фильтрацией' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Список лотов' }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('region')),
    __param(2, (0, common_1.Query)('method')),
    __param(3, (0, common_1.Query)('type')),
    __param(4, (0, common_1.Query)('status')),
    __param(5, (0, common_1.Query)('minBudget')),
    __param(6, (0, common_1.Query)('maxBudget')),
    __param(7, (0, common_1.Query)('currency')),
    __param(8, (0, common_1.Query)('page')),
    __param(9, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], LotsController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Получение лотов компании' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Список лотов компании' }),
    (0, common_1.Get)('my'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LotsController.prototype, "findMy", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Получение лота по ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Информация о лоте' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Лот не найден' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LotsController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Обновление лота' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Лот успешно обновлен' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Нельзя редактировать опубликованный лот' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Недостаточно прав' }),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, lot_dto_1.UpdateLotDto]),
    __metadata("design:returntype", void 0)
], LotsController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Публикация лота' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Лот опубликован' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Лот уже опубликован или не готов к публикации' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Недостаточно прав' }),
    (0, common_1.Post)(':id/publish'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], LotsController.prototype, "publish", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Закрытие лота' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Лот закрыт' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Нельзя закрыть лот' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Недостаточно прав' }),
    (0, common_1.Post)(':id/close'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], LotsController.prototype, "close", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Выбор победителя тендера' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Победитель выбран' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Нельзя выбрать победителя' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Недостаточно прав' }),
    (0, common_1.Post)(':id/select-winner/:bidId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('bidId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], LotsController.prototype, "selectWinner", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Удаление лота' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Лот удален' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Нельзя удалить опубликованный лот' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Недостаточно прав' }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], LotsController.prototype, "remove", null);
exports.LotsController = LotsController = __decorate([
    (0, swagger_1.ApiTags)('Lots'),
    (0, common_1.Controller)('lots'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [lots_service_1.LotsService])
], LotsController);
//# sourceMappingURL=lots.controller.js.map