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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const util_1 = require("util");
const unlinkAsync = (0, util_1.promisify)(fs.unlink);
const mkdirAsync = (0, util_1.promisify)(fs.mkdir);
let FilesService = class FilesService {
    constructor(prisma) {
        this.prisma = prisma;
        this.uploadDir = process.env.UPLOAD_DIR || './uploads';
        this.maxFileSize = parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024;
        this.allowedMimeTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'image/jpeg',
            'image/png',
            'image/gif',
            'text/plain',
            'application/zip',
            'application/x-rar-compressed',
        ];
        this.ensureUploadDirExists();
    }
    async ensureUploadDirExists() {
        try {
            await mkdirAsync(this.uploadDir, { recursive: true });
            const subdirs = ['tenders', 'bids', 'companies', 'contracts', 'temp'];
            for (const subdir of subdirs) {
                await mkdirAsync(path.join(this.uploadDir, subdir), { recursive: true });
            }
        }
        catch (error) {
            console.error('Error creating upload directories:', error);
        }
    }
    async uploadFile(file, entityType, entityId, uploadedBy, category) {
        this.validateFile(file);
        const fileExtension = path.extname(file.originalname);
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}${fileExtension}`;
        const relativePath = path.join(entityType, fileName);
        const fullPath = path.join(this.uploadDir, relativePath);
        try {
            await fs.promises.writeFile(fullPath, file.buffer);
            const document = await this.prisma.document.create({
                data: {
                    filename: fileName,
                    originalName: file.originalname,
                    mimeType: file.mimetype,
                    size: file.size,
                    path: relativePath,
                    entityType,
                    entityId,
                    uploadedBy,
                    category: category || 'general',
                },
            });
            return document;
        }
        catch (error) {
            try {
                await unlinkAsync(fullPath);
            }
            catch (unlinkError) {
                console.error('Error deleting file after DB error:', unlinkError);
            }
            throw new common_1.BadRequestException('Ошибка при сохранении файла');
        }
    }
    async uploadMultipleFiles(files, entityType, entityId, uploadedBy, category) {
        const uploadedDocuments = [];
        const errors = [];
        for (const file of files) {
            try {
                const document = await this.uploadFile(file, entityType, entityId, uploadedBy, category);
                uploadedDocuments.push(document);
            }
            catch (error) {
                errors.push({
                    filename: file.originalname,
                    error: error.message,
                });
            }
        }
        return {
            uploaded: uploadedDocuments,
            errors,
        };
    }
    async getFile(id, userId) {
        const document = await this.prisma.document.findUnique({
            where: { id },
        });
        if (!document) {
            throw new common_1.NotFoundException('Файл не найден');
        }
        if (userId && document.uploadedBy !== userId) {
            const hasAccess = await this.checkFileAccess(document, userId);
            if (!hasAccess) {
                throw new common_1.NotFoundException('Файл не найден');
            }
        }
        const fullPath = path.join(this.uploadDir, document.path);
        try {
            await fs.promises.access(fullPath);
        }
        catch (error) {
            throw new common_1.NotFoundException('Файл не найден на диске');
        }
        return {
            document,
            filePath: fullPath,
        };
    }
    async getFilesByEntity(entityType, entityId, category) {
        const where = {
            entityType,
            entityId,
        };
        if (category) {
            where.category = category;
        }
        return this.prisma.document.findMany({
            where,
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async deleteFile(id, userId) {
        const document = await this.prisma.document.findUnique({
            where: { id },
        });
        if (!document) {
            throw new common_1.NotFoundException('Файл не найден');
        }
        if (document.uploadedBy !== userId) {
            const hasAccess = await this.checkFileAccess(document, userId);
            if (!hasAccess) {
                throw new common_1.NotFoundException('Файл не найден');
            }
        }
        const fullPath = path.join(this.uploadDir, document.path);
        try {
            await unlinkAsync(fullPath);
        }
        catch (error) {
            console.error('Error deleting file from disk:', error);
        }
        await this.prisma.document.delete({
            where: { id },
        });
        return { success: true };
    }
    validateFile(file) {
        if (!file) {
            throw new common_1.BadRequestException('Файл не предоставлен');
        }
        if (file.size > this.maxFileSize) {
            throw new common_1.BadRequestException(`Размер файла превышает максимально допустимый (${this.maxFileSize / 1024 / 1024}MB)`);
        }
        if (!this.allowedMimeTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException('Недопустимый тип файла. Разрешены: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, JPG, PNG, GIF, TXT, ZIP, RAR');
        }
        const fileExtension = path.extname(file.originalname).toLowerCase();
        const allowedExtensions = [
            '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
            '.jpg', '.jpeg', '.png', '.gif', '.txt', '.zip', '.rar'
        ];
        if (!allowedExtensions.includes(fileExtension)) {
            throw new common_1.BadRequestException('Недопустимое расширение файла');
        }
    }
    async checkFileAccess(document, userId) {
        try {
            return document.uploadedBy === userId;
        }
        catch (error) {
            console.error('Error checking file access:', error);
            return false;
        }
    }
    async getFileStats(entityType, entityId) {
        const where = {};
        if (entityType) {
            where.entityType = entityType;
        }
        if (entityId) {
            where.entityId = entityId;
        }
        const [totalFiles, totalSize] = await Promise.all([
            this.prisma.document.count({ where }),
            this.prisma.document.aggregate({
                where,
                _sum: {
                    size: true,
                },
            }),
        ]);
        return {
            totalFiles,
            totalSize: totalSize._sum.size || 0,
            averageSize: totalFiles > 0 ? (totalSize._sum.size || 0) / totalFiles : 0,
        };
    }
    async cleanupTempFiles(olderThanHours = 24) {
        const cutoffDate = new Date(Date.now() - olderThanHours * 60 * 60 * 1000);
        const tempFiles = await this.prisma.document.findMany({
            where: {
                entityType: 'temp',
                createdAt: {
                    lt: cutoffDate,
                },
            },
        });
        for (const file of tempFiles) {
            try {
                await this.deleteFile(file.id, file.uploadedBy);
            }
            catch (error) {
                console.error(`Error deleting temp file ${file.id}:`, error);
            }
        }
        return {
            deletedCount: tempFiles.length,
        };
    }
    async createArchive(documentIds, userId) {
        const documents = await this.prisma.document.findMany({
            where: {
                id: {
                    in: documentIds,
                },
            },
        });
        for (const doc of documents) {
            if (doc.uploadedBy !== userId) {
                const hasAccess = await this.checkFileAccess(doc, userId);
                if (!hasAccess) {
                    throw new common_1.BadRequestException(`Нет доступа к файлу: ${doc.originalName}`);
                }
            }
        }
        return documents;
    }
    async getFilePreview(id, userId) {
        const { document, filePath } = await this.getFile(id, userId);
        if (!document.mimeType.startsWith('image/')) {
            throw new common_1.BadRequestException('Превью доступно только для изображений');
        }
        return {
            document,
            filePath,
        };
    }
};
exports.FilesService = FilesService;
exports.FilesService = FilesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FilesService);
//# sourceMappingURL=files.service.js.map