import { Response } from 'express';
import { FilesService } from './files.service';
export declare class FilesController {
    private readonly filesService;
    constructor(filesService: FilesService);
    uploadFile(file: Express.Multer.File, entityType: string, entityId: string, category: string, req: any): Promise<{
        id: string;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        path: string;
        entityType: string;
        entityId: string;
        uploadedBy: string;
        category: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    uploadMultipleFiles(files: Express.Multer.File[], entityType: string, entityId: string, category: string, req: any): Promise<{
        uploaded: any[];
        errors: any[];
    }>;
    getFile(id: string, req: any, res: Response): Promise<void>;
    getFilePreview(id: string, req: any, res: Response): Promise<void>;
    getFilesByEntity(entityType: string, entityId: string, category?: string): Promise<{
        id: string;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        path: string;
        entityType: string;
        entityId: string;
        uploadedBy: string;
        category: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    deleteFile(id: string, req: any): Promise<{
        success: boolean;
    }>;
    getFileStats(entityType?: string, entityId?: string): Promise<{
        totalFiles: number;
        totalSize: number;
        averageSize: number;
    }>;
    cleanupTempFiles(hours?: number): Promise<{
        deletedCount: number;
    }>;
    createArchive(documentIds: string, req: any): Promise<{
        id: string;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        path: string;
        entityType: string;
        entityId: string;
        uploadedBy: string;
        category: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getFileInfo(id: string, req: any): Promise<{
        id: string;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        path: string;
        entityType: string;
        entityId: string;
        uploadedBy: string;
        category: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
