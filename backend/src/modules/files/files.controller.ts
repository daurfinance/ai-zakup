import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Req,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { FilesService } from './files.service';
import * as path from 'path';

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Загрузка одного файла' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Файл успешно загружен' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('entityType') entityType: string,
    @Query('entityId') entityId: string,
    @Query('category') category: string,
    @Req() req: any,
  ) {
    if (!file) {
      throw new BadRequestException('Файл не предоставлен');
    }

    if (!entityType || !entityId) {
      throw new BadRequestException('Необходимо указать entityType и entityId');
    }

    return this.filesService.uploadFile(
      file,
      entityType,
      entityId,
      req.user.id,
      category,
    );
  }

  @Post('upload-multiple')
  @ApiOperation({ summary: 'Загрузка нескольких файлов' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Файлы успешно загружены' })
  @UseInterceptors(FilesInterceptor('files', 10)) // Максимум 10 файлов
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('entityType') entityType: string,
    @Query('entityId') entityId: string,
    @Query('category') category: string,
    @Req() req: any,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Файлы не предоставлены');
    }

    if (!entityType || !entityId) {
      throw new BadRequestException('Необходимо указать entityType и entityId');
    }

    return this.filesService.uploadMultipleFiles(
      files,
      entityType,
      entityId,
      req.user.id,
      category,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получение файла по ID' })
  @ApiResponse({ status: 200, description: 'Файл найден' })
  async getFile(
    @Param('id') id: string,
    @Req() req: any,
    @Res() res: Response,
  ) {
    const { document, filePath } = await this.filesService.getFile(id, req.user.id);

    // Установка заголовков для скачивания
    res.setHeader('Content-Type', document.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${document.originalName}"`);
    res.setHeader('Content-Length', document.size);

    // Отправка файла
    res.sendFile(path.resolve(filePath));
  }

  @Get(':id/preview')
  @ApiOperation({ summary: 'Получение превью файла (для изображений)' })
  @ApiResponse({ status: 200, description: 'Превью файла' })
  async getFilePreview(
    @Param('id') id: string,
    @Req() req: any,
    @Res() res: Response,
  ) {
    const { document, filePath } = await this.filesService.getFilePreview(id, req.user.id);

    // Установка заголовков для отображения в браузере
    res.setHeader('Content-Type', document.mimeType);
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Кэширование на 1 час

    // Отправка файла
    res.sendFile(path.resolve(filePath));
  }

  @Get('entity/:entityType/:entityId')
  @ApiOperation({ summary: 'Получение списка файлов для сущности' })
  @ApiResponse({ status: 200, description: 'Список файлов' })
  async getFilesByEntity(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
    @Query('category') category?: string,
  ) {
    return this.filesService.getFilesByEntity(entityType, entityId, category);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удаление файла' })
  @ApiResponse({ status: 200, description: 'Файл успешно удален' })
  async deleteFile(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    return this.filesService.deleteFile(id, req.user.id);
  }

  @Get('stats/summary')
  @ApiOperation({ summary: 'Получение статистики по файлам' })
  @ApiResponse({ status: 200, description: 'Статистика файлов' })
  async getFileStats(
    @Query('entityType') entityType?: string,
    @Query('entityId') entityId?: string,
  ) {
    return this.filesService.getFileStats(entityType, entityId);
  }

  @Post('cleanup/temp')
  @ApiOperation({ summary: 'Очистка временных файлов' })
  @ApiResponse({ status: 200, description: 'Временные файлы очищены' })
  async cleanupTempFiles(
    @Query('hours') hours?: number,
  ) {
    const olderThanHours = hours ? parseInt(hours.toString()) : 24;
    return this.filesService.cleanupTempFiles(olderThanHours);
  }

  @Post('archive')
  @ApiOperation({ summary: 'Создание архива файлов' })
  @ApiResponse({ status: 200, description: 'Архив создан' })
  async createArchive(
    @Query('documentIds') documentIds: string,
    @Req() req: any,
  ) {
    if (!documentIds) {
      throw new BadRequestException('Необходимо указать ID документов');
    }

    const ids = documentIds.split(',').filter(id => id.trim());
    if (ids.length === 0) {
      throw new BadRequestException('Необходимо указать хотя бы один ID документа');
    }

    return this.filesService.createArchive(ids, req.user.id);
  }

  @Get('info/:id')
  @ApiOperation({ summary: 'Получение информации о файле без скачивания' })
  @ApiResponse({ status: 200, description: 'Информация о файле' })
  async getFileInfo(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    const { document } = await this.filesService.getFile(id, req.user.id);
    return document;
  }
}
