import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);
const mkdirAsync = promisify(fs.mkdir);

@Injectable()
export class FilesService {
  private readonly uploadDir = process.env.UPLOAD_DIR || './uploads';
  private readonly maxFileSize = parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024; // 10MB
  
  private readonly allowedMimeTypes = [
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

  constructor(private prisma: PrismaService) {
    this.ensureUploadDirExists();
  }

  /**
   * Обеспечение существования директории для загрузок
   */
  private async ensureUploadDirExists() {
    try {
      await mkdirAsync(this.uploadDir, { recursive: true });
      
      // Создание поддиректорий для разных типов документов
      const subdirs = ['tenders', 'bids', 'companies', 'contracts', 'temp'];
      for (const subdir of subdirs) {
        await mkdirAsync(path.join(this.uploadDir, subdir), { recursive: true });
      }
    } catch (error) {
      console.error('Error creating upload directories:', error);
    }
  }

  /**
   * Загрузка файла
   */
  async uploadFile(
    file: Express.Multer.File,
    entityType: string,
    entityId: string,
    uploadedBy: string,
    category?: string
  ) {
    // Валидация файла
    this.validateFile(file);

    // Генерация уникального имени файла
    const fileExtension = path.extname(file.originalname);
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}${fileExtension}`;
    const relativePath = path.join(entityType, fileName);
    const fullPath = path.join(this.uploadDir, relativePath);

    try {
      // Сохранение файла на диск
      await fs.promises.writeFile(fullPath, file.buffer);

      // Сохранение информации о файле в базе данных
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
    } catch (error) {
      // Удаление файла в случае ошибки сохранения в БД
      try {
        await unlinkAsync(fullPath);
      } catch (unlinkError) {
        console.error('Error deleting file after DB error:', unlinkError);
      }
      throw new BadRequestException('Ошибка при сохранении файла');
    }
  }

  /**
   * Загрузка нескольких файлов
   */
  async uploadMultipleFiles(
    files: Express.Multer.File[],
    entityType: string,
    entityId: string,
    uploadedBy: string,
    category?: string
  ) {
    const uploadedDocuments = [];
    const errors = [];

    for (const file of files) {
      try {
        const document = await this.uploadFile(file, entityType, entityId, uploadedBy, category);
        uploadedDocuments.push(document);
      } catch (error) {
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

  /**
   * Получение файла по ID
   */
  async getFile(id: string, userId?: string) {
    const document = await this.prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      throw new NotFoundException('Файл не найден');
    }

    // Проверка прав доступа (базовая)
    if (userId && document.uploadedBy !== userId) {
      // Дополнительная проверка прав доступа через связанные сущности
      const hasAccess = await this.checkFileAccess(document, userId);
      if (!hasAccess) {
        throw new NotFoundException('Файл не найден');
      }
    }

    const fullPath = path.join(this.uploadDir, document.path);
    
    // Проверка существования файла на диске
    try {
      await fs.promises.access(fullPath);
    } catch (error) {
      throw new NotFoundException('Файл не найден на диске');
    }

    return {
      document,
      filePath: fullPath,
    };
  }

  /**
   * Получение списка файлов для сущности
   */
  async getFilesByEntity(entityType: string, entityId: string, category?: string) {
    const where: any = {
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

  /**
   * Удаление файла
   */
  async deleteFile(id: string, userId: string) {
    const document = await this.prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      throw new NotFoundException('Файл не найден');
    }

    // Проверка прав на удаление
    if (document.uploadedBy !== userId) {
      const hasAccess = await this.checkFileAccess(document, userId);
      if (!hasAccess) {
        throw new NotFoundException('Файл не найден');
      }
    }

    const fullPath = path.join(this.uploadDir, document.path);

    try {
      // Удаление файла с диска
      await unlinkAsync(fullPath);
    } catch (error) {
      console.error('Error deleting file from disk:', error);
      // Продолжаем удаление из БД даже если файл не найден на диске
    }

    // Удаление записи из БД
    await this.prisma.document.delete({
      where: { id },
    });

    return { success: true };
  }

  /**
   * Валидация файла
   */
  private validateFile(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Файл не предоставлен');
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `Размер файла превышает максимально допустимый (${this.maxFileSize / 1024 / 1024}MB)`
      );
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Недопустимый тип файла. Разрешены: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, JPG, PNG, GIF, TXT, ZIP, RAR'
      );
    }

    // Проверка расширения файла (дополнительная безопасность)
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = [
      '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
      '.jpg', '.jpeg', '.png', '.gif', '.txt', '.zip', '.rar'
    ];

    if (!allowedExtensions.includes(fileExtension)) {
      throw new BadRequestException('Недопустимое расширение файла');
    }
  }

  /**
   * Проверка прав доступа к файлу
   */
  private async checkFileAccess(document: any, userId: string): Promise<boolean> {
    try {
      // For now, we will allow access if the document was uploaded by the user.
      // More granular access control can be implemented later based on business logic.
      return document.uploadedBy === userId;
    } catch (error) {
      console.error('Error checking file access:', error);
      return false;
    }
  }

  /**
   * Получение статистики по файлам
   */
  async getFileStats(entityType?: string, entityId?: string) {
    const where: any = {};
    
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

  /**
   * Очистка временных файлов
   */
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
      } catch (error) {
        console.error(`Error deleting temp file ${file.id}:`, error);
      }
    }

    return {
      deletedCount: tempFiles.length,
    };
  }

  /**
   * Создание архива файлов
   */
  async createArchive(documentIds: string[], userId: string) {
    // TODO: Реализация создания ZIP архива
    // Для простоты пока возвращаем список файлов
    const documents = await this.prisma.document.findMany({
      where: {
        id: {
          in: documentIds,
        },
      },
    });

    // Проверка прав доступа ко всем файлам
    for (const doc of documents) {
      if (doc.uploadedBy !== userId) {
        const hasAccess = await this.checkFileAccess(doc, userId);
        if (!hasAccess) {
          throw new BadRequestException(`Нет доступа к файлу: ${doc.originalName}`);
        }
      }
    }

    return documents;
  }

  /**
   * Получение превью файла (для изображений)
   */
  async getFilePreview(id: string, userId?: string) {
    const { document, filePath } = await this.getFile(id, userId);

    // Проверка, что это изображение
    if (!document.mimeType.startsWith('image/')) {
      throw new BadRequestException('Превью доступно только для изображений');
    }

    return {
      document,
      filePath,
    };
  }
}
