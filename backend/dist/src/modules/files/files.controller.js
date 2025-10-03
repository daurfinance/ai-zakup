"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const files_service_1 = require("./files.service");
const path = __importStar(require("path"));
let FilesController = class FilesController {
    constructor(filesService) {
        this.filesService = filesService;
    }
    async uploadFile(file, entityType, entityId, category, req) {
        if (!file) {
            throw new common_1.BadRequestException('Файл не предоставлен');
        }
        if (!entityType || !entityId) {
            throw new common_1.BadRequestException('Необходимо указать entityType и entityId');
        }
        return this.filesService.uploadFile(file, entityType, entityId, req.user.id, category);
    }
    async uploadMultipleFiles(files, entityType, entityId, category, req) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('Файлы не предоставлены');
        }
        if (!entityType || !entityId) {
            throw new common_1.BadRequestException('Необходимо указать entityType и entityId');
        }
        return this.filesService.uploadMultipleFiles(files, entityType, entityId, req.user.id, category);
    }
    async getFile(id, req, res) {
        const { document, filePath } = await this.filesService.getFile(id, req.user.id);
        res.setHeader('Content-Type', document.mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="${document.originalName}"`);
        res.setHeader('Content-Length', document.size);
        res.sendFile(path.resolve(filePath));
    }
    async getFilePreview(id, req, res) {
        const { document, filePath } = await this.filesService.getFilePreview(id, req.user.id);
        res.setHeader('Content-Type', document.mimeType);
        res.setHeader('Cache-Control', 'public, max-age=3600');
        res.sendFile(path.resolve(filePath));
    }
    async getFilesByEntity(entityType, entityId, category) {
        return this.filesService.getFilesByEntity(entityType, entityId, category);
    }
    async deleteFile(id, req) {
        return this.filesService.deleteFile(id, req.user.id);
    }
    async getFileStats(entityType, entityId) {
        return this.filesService.getFileStats(entityType, entityId);
    }
    async cleanupTempFiles(hours) {
        const olderThanHours = hours ? parseInt(hours.toString()) : 24;
        return this.filesService.cleanupTempFiles(olderThanHours);
    }
    async createArchive(documentIds, req) {
        if (!documentIds) {
            throw new common_1.BadRequestException('Необходимо указать ID документов');
        }
        const ids = documentIds.split(',').filter(id => id.trim());
        if (ids.length === 0) {
            throw new common_1.BadRequestException('Необходимо указать хотя бы один ID документа');
        }
        return this.filesService.createArchive(ids, req.user.id);
    }
    async getFileInfo(id, req) {
        const { document } = await this.filesService.getFile(id, req.user.id);
        return document;
    }
};
exports.FilesController = FilesController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, swagger_1.ApiOperation)({ summary: 'Загрузка одного файла' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Файл успешно загружен' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Query)('entityType')),
    __param(2, (0, common_1.Query)('entityId')),
    __param(3, (0, common_1.Query)('category')),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Post)('upload-multiple'),
    (0, swagger_1.ApiOperation)({ summary: 'Загрузка нескольких файлов' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Файлы успешно загружены' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 10)),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Query)('entityType')),
    __param(2, (0, common_1.Query)('entityId')),
    __param(3, (0, common_1.Query)('category')),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "uploadMultipleFiles", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Получение файла по ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Файл найден' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "getFile", null);
__decorate([
    (0, common_1.Get)(':id/preview'),
    (0, swagger_1.ApiOperation)({ summary: 'Получение превью файла (для изображений)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Превью файла' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "getFilePreview", null);
__decorate([
    (0, common_1.Get)('entity/:entityType/:entityId'),
    (0, swagger_1.ApiOperation)({ summary: 'Получение списка файлов для сущности' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Список файлов' }),
    __param(0, (0, common_1.Param)('entityType')),
    __param(1, (0, common_1.Param)('entityId')),
    __param(2, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "getFilesByEntity", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Удаление файла' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Файл успешно удален' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "deleteFile", null);
__decorate([
    (0, common_1.Get)('stats/summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Получение статистики по файлам' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Статистика файлов' }),
    __param(0, (0, common_1.Query)('entityType')),
    __param(1, (0, common_1.Query)('entityId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "getFileStats", null);
__decorate([
    (0, common_1.Post)('cleanup/temp'),
    (0, swagger_1.ApiOperation)({ summary: 'Очистка временных файлов' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Временные файлы очищены' }),
    __param(0, (0, common_1.Query)('hours')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "cleanupTempFiles", null);
__decorate([
    (0, common_1.Post)('archive'),
    (0, swagger_1.ApiOperation)({ summary: 'Создание архива файлов' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Архив создан' }),
    __param(0, (0, common_1.Query)('documentIds')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "createArchive", null);
__decorate([
    (0, common_1.Get)('info/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Получение информации о файле без скачивания' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Информация о файле' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "getFileInfo", null);
exports.FilesController = FilesController = __decorate([
    (0, swagger_1.ApiTags)('files'),
    (0, common_1.Controller)('files'),
    __metadata("design:paramtypes", [files_service_1.FilesService])
], FilesController);
//# sourceMappingURL=files.controller.js.map