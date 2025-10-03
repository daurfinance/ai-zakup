import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { PrismaModule } from '../prisma/prisma.module';
import { memoryStorage } from 'multer';

@Module({
  imports: [
    PrismaModule,
    MulterModule.register({
      storage: memoryStorage(), // Используем память для временного хранения
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
        files: 10, // Максимум 10 файлов за раз
      },
      fileFilter: (req, file, callback) => {
        // Дополнительная фильтрация файлов
        const allowedMimeTypes = [
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

        if (allowedMimeTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(new Error('Недопустимый тип файла'), false);
        }
      },
    }),
  ],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
