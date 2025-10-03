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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BidsService } from './bids.service';
import { CreateBidDto, UpdateBidDto, RejectBidDto } from './dto/bid.dto';

@ApiTags('Bids')
@Controller('bids')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  @ApiOperation({ summary: 'Подача заявки на участие в тендере' })
  @ApiResponse({ status: 201, description: 'Заявка успешно подана' })
  @ApiResponse({ status: 400, description: 'Ошибка валидации или заявка уже подана' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав или не соответствует критериям' })
  @Post()
  create(@Request() req, @Body() createBidDto: CreateBidDto) {
    return this.bidsService.create(req.user.sub, createBidDto);
  }

  @ApiOperation({ summary: 'Получение заявок компании' })
  @ApiResponse({ status: 200, description: 'Список заявок компании' })
  @Get('my')
  findMy(@Request() req) {
    return this.bidsService.findByCompany(req.user.sub);
  }

  @ApiOperation({ summary: 'Получение статистики заявок' })
  @ApiResponse({ status: 200, description: 'Статистика заявок компании' })
  @Get('my/stats')
  getMyStats(@Request() req) {
    return this.bidsService.getStats(req.user.sub);
  }

  @ApiOperation({ summary: 'Получение заявок на лот' })
  @ApiResponse({ status: 200, description: 'Список заявок на лот' })
  @Get('lot/:lotId')
  findByLot(@Param('lotId') lotId: string) {
    return this.bidsService.findByLot(lotId);
  }

  @ApiOperation({ summary: 'Получение заявки по ID' })
  @ApiResponse({ status: 200, description: 'Информация о заявке' })
  @ApiResponse({ status: 404, description: 'Заявка не найдена' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bidsService.findOne(id);
  }

  @ApiOperation({ summary: 'Обновление заявки' })
  @ApiResponse({ status: 200, description: 'Заявка успешно обновлена' })
  @ApiResponse({ status: 400, description: 'Нельзя редактировать заявку или срок истек' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateBidDto: UpdateBidDto,
  ) {
    return this.bidsService.update(req.user.sub, id, updateBidDto);
  }

  @ApiOperation({ summary: 'Отзыв заявки' })
  @ApiResponse({ status: 200, description: 'Заявка отозвана' })
  @ApiResponse({ status: 400, description: 'Нельзя отозвать заявку' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @Delete(':id')
  withdraw(@Request() req, @Param('id') id: string) {
    return this.bidsService.withdraw(req.user.sub, id);
  }

  @ApiOperation({ summary: 'Одобрение заявки (для заказчика)' })
  @ApiResponse({ status: 200, description: 'Заявка одобрена' })
  @ApiResponse({ status: 400, description: 'Нельзя одобрить заявку' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @Post(':id/approve')
  approve(@Request() req, @Param('id') id: string) {
    return this.bidsService.approve(req.user.sub, id);
  }

  @ApiOperation({ summary: 'Отклонение заявки (для заказчика)' })
  @ApiResponse({ status: 200, description: 'Заявка отклонена' })
  @ApiResponse({ status: 400, description: 'Нельзя отклонить заявку' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @Post(':id/reject')
  reject(
    @Request() req,
    @Param('id') id: string,
    @Body() rejectBidDto: RejectBidDto,
  ) {
    return this.bidsService.reject(req.user.sub, id, rejectBidDto.reason);
  }
}
