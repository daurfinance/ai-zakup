import { PrismaService } from '../prisma/prisma.service';
export declare class FilesService {
    private prisma;
    private readonly uploadDir;
    private readonly maxFileSize;
    private readonly allowedMimeTypes;
    constructor(prisma: PrismaService);
    private ensureUploadDirExists;
    uploadFile(file: Express.Multer.File, entityType: string, entityId: string, uploadedBy: string, category?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        path: string;
        entityType: string;
        entityId: string;
        uploadedBy: string;
        category: string;
    }>;
    uploadMultipleFiles(files: Express.Multer.File[], entityType: string, entityId: string, uploadedBy: string, category?: string): Promise<{
        uploaded: any[];
        errors: any[];
    }>;
    getFile(id: string, userId?: string): Promise<{
        document: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            filename: string;
            originalName: string;
            mimeType: string;
            size: number;
            path: string;
            entityType: string;
            entityId: string;
            uploadedBy: string;
            category: string;
        };
        filePath: string;
    }>;
    getFilesByEntity(entityType: string, entityId: string, category?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        path: string;
        entityType: string;
        entityId: string;
        uploadedBy: string;
        category: string;
    }[]>;
    deleteFile(id: string, userId: string): Promise<{
        success: boolean;
    }>;
    private validateFile;
    private checkFileAccess;
    getFileStats(entityType?: string, entityId?: string): Promise<{
        totalFiles: number;
        totalSize: number;
        averageSize: number;
    }>;
    cleanupTempFiles(olderThanHours?: number): Promise<{
        deletedCount: number;
    }>;
    createArchive(documentIds: string[], userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        path: string;
        entityType: string;
        entityId: string;
        uploadedBy: string;
        category: string;
    }[]>;
    getFilePreview(id: string, userId?: string): Promise<{
        document: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            filename: string;
            originalName: string;
            mimeType: string;
            size: number;
            path: string;
            entityType: string;
            entityId: string;
            uploadedBy: string;
            category: string;
        };
        filePath: string;
    }>;
}
