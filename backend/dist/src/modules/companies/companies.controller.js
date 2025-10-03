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
exports.CompaniesController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const companies_service_1 = require("./companies.service");
const company_dto_1 = require("./dto/company.dto");
let CompaniesController = class CompaniesController {
    constructor(companiesService) {
        this.companiesService = companiesService;
    }
    create(req, createCompanyDto) {
        return this.companiesService.create(req.user.sub, createCompanyDto);
    }
    findMy(req) {
        return this.companiesService.findByUserId(req.user.sub);
    }
    findOne(id) {
        return this.companiesService.findOne(id);
    }
    update(req, updateCompanyDto) {
        return this.companiesService.update(req.user.sub, updateCompanyDto);
    }
    updateLicenses(req, body) {
        return this.companiesService.updateLicenses(req.user.sub, body.licenses);
    }
    checkCriteria(id, criteria) {
        return this.companiesService.checkTenderCriteria(id, criteria);
    }
    verify(req, id, verifyCompanyDto) {
        if (req.user.role !== 'admin') {
            throw new common_1.ForbiddenException('Только администраторы могут верифицировать компании');
        }
        return this.companiesService.verify(id, verifyCompanyDto.status, verifyCompanyDto.reason);
    }
    addToBlacklist(req, id, body) {
        if (req.user.role !== 'admin') {
            throw new common_1.ForbiddenException('Только администраторы могут управлять черным списком');
        }
        return this.companiesService.addToBlacklist(id, body.reason);
    }
    removeFromBlacklist(req, id) {
        if (req.user.role !== 'admin') {
            throw new common_1.ForbiddenException('Только администраторы могут управлять черным списком');
        }
        return this.companiesService.removeFromBlacklist(id);
    }
};
exports.CompaniesController = CompaniesController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Создание профиля компании' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Компания успешно создана' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Ошибка валидации или компания уже существует' }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, company_dto_1.CreateCompanyDto]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Получение профиля своей компании' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Профиль компании' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Компания не найдена' }),
    (0, common_1.Get)('my'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "findMy", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Получение профиля компании по ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Профиль компании' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Компания не найдена' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Обновление профиля своей компании' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Компания успешно обновлена' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Компания не найдена' }),
    (0, common_1.Patch)('my'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, company_dto_1.UpdateCompanyDto]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Обновление лицензий компании' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Лицензии успешно обновлены' }),
    (0, common_1.Patch)('my/licenses'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "updateLicenses", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Проверка соответствия критериям тендера' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Результат проверки' }),
    (0, common_1.Post)(':id/check-criteria'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "checkCriteria", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Верификация компании (только для администраторов)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Статус верификации обновлен' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Недостаточно прав' }),
    (0, common_1.Post)(':id/verify'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, company_dto_1.VerifyCompanyDto]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "verify", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Добавление компании в черный список (только для администраторов)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Компания добавлена в черный список' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Недостаточно прав' }),
    (0, common_1.Post)(':id/blacklist'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "addToBlacklist", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Удаление компании из черного списка (только для администраторов)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Компания удалена из черного списка' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Недостаточно прав' }),
    (0, common_1.Post)(':id/whitelist'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "removeFromBlacklist", null);
exports.CompaniesController = CompaniesController = __decorate([
    (0, swagger_1.ApiTags)('Companies'),
    (0, common_1.Controller)('companies'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [companies_service_1.CompaniesService])
], CompaniesController);
//# sourceMappingURL=companies.controller.js.map