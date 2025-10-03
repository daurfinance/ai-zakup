import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { EscrowService } from './escrow.service';
import { CreateEscrowDto, DepositEscrowDto, WithdrawEscrowDto } from './dto/escrow.dto';

@ApiTags('Escrow')
@Controller('escrow')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class EscrowController {
  constructor(private readonly escrowService: EscrowService) {}

  @ApiOperation({ summary: 'Создание эскроу счета для лота' })
  @ApiResponse({ status: 201, description: 'Эскроу счет успешно создан' })
  @ApiResponse({ status: 400, description: 'Ошибка валидации или эскроу уже существует' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @Post()
  create(@Request() req, @Body() createEscrowDto: CreateEscrowDto) {
    return this.escrowService.create(req.user.sub, createEscrowDto);
  }

  @ApiOperation({ summary: 'Пополнение эскроу счета' })
  @ApiResponse({ status: 200, description: 'Средства успешно зачислены' })
  @ApiResponse({ status: 400, description: 'Ошибка при проведении платежа' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @Post(':id/deposit')
  deposit(
    @Request() req,
    @Param('id') id: string,
    @Body() depositEscrowDto: DepositEscrowDto,
  ) {
    return this.escrowService.deposit(req.user.sub, id, depositEscrowDto);
  }

  @ApiOperation({ summary: 'Вывод средств с эскроу счета' })
  @ApiResponse({ status: 200, description: 'Средства успешно выведены' })
  @ApiResponse({ status: 400, description: 'Недостаточно средств или ошибка перевода' })
  @Post(':id/withdraw')
  withdraw(@Param('id') id: string, @Body() withdrawEscrowDto: WithdrawEscrowDto) {
    return this.escrowService.withdraw(id, withdrawEscrowDto);
  }

  @ApiOperation({ summary: 'Получение эскроу счета по ID лота' })
  @ApiResponse({ status: 200, description: 'Информация об эскроу счете' })
  @ApiResponse({ status: 404, description: 'Эскроу счет не найден' })
  @Get('lot/:lotId')
  findByLotId(@Param('lotId') lotId: string) {
    return this.escrowService.findByLotId(lotId);
  }

  @ApiOperation({ summary: 'Получение всех эскроу счетов компании' })
  @ApiResponse({ status: 200, description: 'Список эскроу счетов' })
  @Get('my')
  findMy(@Request() req) {
    return this.escrowService.findByCompany(req.user.sub);
  }

  @ApiOperation({ summary: 'Закрытие эскроу счета' })
  @ApiResponse({ status: 200, description: 'Эскроу счет закрыт' })
  @ApiResponse({ status: 400, description: 'Нельзя закрыть счет с положительным балансом' })
  @Delete(':id')
  close(@Request() req, @Param('id') id: string) {
    return this.escrowService.close(req.user.sub, id);
  }

  @ApiOperation({ summary: 'Расчет комиссии платформы' })
  @ApiResponse({ status: 200, description: 'Информация о комиссии' })
  @Get(':id/fee')
  calculateFee(@Param('id') id: string) {
    return this.escrowService.calculatePlatformFee(id);
  }

  @ApiOperation({ summary: 'Применение комиссии платформы' })
  @ApiResponse({ status: 200, description: 'Комиссия применена' })
  @ApiResponse({ status: 400, description: 'Комиссия уже применена или нет выплат' })
  @Post(':id/apply-fee')
  applyFee(@Param('id') id: string) {
    return this.escrowService.applyPlatformFee(id);
  }
}
