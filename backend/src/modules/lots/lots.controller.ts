import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LotsService } from './lots.service';
import { CreateLotDto, UpdateLotDto } from './dto/lot.dto';

@ApiTags('Lots')
@Controller('lots')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class LotsController {
  constructor(private readonly lotsService: LotsService) {}

  @ApiOperation({ summary: 'Создание нового лота' })
  @ApiResponse({ status: 201, description: 'Лот успешно создан' })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @Post()
  create(@Request() req, @Body() createLotDto: CreateLotDto) {
    return this.lotsService.create(req.user.sub, createLotDto);
  }

  @ApiOperation({ summary: 'Получение списка лотов с фильтрацией' })
  @ApiResponse({ status: 200, description: 'Список лотов' })
  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('region') region?: string,
    @Query('method') method?: string,
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('minBudget') minBudget?: string,
    @Query('maxBudget') maxBudget?: string,
    @Query('currency') currency?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
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

  @ApiOperation({ summary: 'Получение лотов компании' })
  @ApiResponse({ status: 200, description: 'Список лотов компании' })
  @Get('my')
  findMy(@Request() req) {
    return this.lotsService.findByCompany(req.user.sub);
  }

  @ApiOperation({ summary: 'Получение лота по ID' })
  @ApiResponse({ status: 200, description: 'Информация о лоте' })
  @ApiResponse({ status: 404, description: 'Лот не найден' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lotsService.findOne(id);
  }

  @ApiOperation({ summary: 'Обновление лота' })
  @ApiResponse({ status: 200, description: 'Лот успешно обновлен' })
  @ApiResponse({ status: 400, description: 'Нельзя редактировать опубликованный лот' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateLotDto: UpdateLotDto,
  ) {
    return this.lotsService.update(req.user.sub, id, updateLotDto);
  }

  @ApiOperation({ summary: 'Публикация лота' })
  @ApiResponse({ status: 200, description: 'Лот опубликован' })
  @ApiResponse({ status: 400, description: 'Лот уже опубликован или не готов к публикации' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @Post(':id/publish')
  publish(@Request() req, @Param('id') id: string) {
    return this.lotsService.publish(req.user.sub, id, { createEscrow: false });
  }

  @ApiOperation({ summary: 'Закрытие лота' })
  @ApiResponse({ status: 200, description: 'Лот закрыт' })
  @ApiResponse({ status: 400, description: 'Нельзя закрыть лот' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @Post(':id/close')
  close(@Request() req, @Param('id') id: string) {
    return this.lotsService.close(req.user.sub, id);
  }

  @ApiOperation({ summary: 'Выбор победителя тендера' })
  @ApiResponse({ status: 200, description: 'Победитель выбран' })
  @ApiResponse({ status: 400, description: 'Нельзя выбрать победителя' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @Post(':id/select-winner/:bidId')
  selectWinner(
    @Request() req,
    @Param('id') id: string,
    @Param('bidId') bidId: string,
  ) {
    return this.lotsService.selectWinner(id);
  }

  @ApiOperation({ summary: 'Удаление лота' })
  @ApiResponse({ status: 200, description: 'Лот удален' })
  @ApiResponse({ status: 400, description: 'Нельзя удалить опубликованный лот' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.lotsService.cancel(req.user.sub, id, 'Tender removed by owner');
  }
}
