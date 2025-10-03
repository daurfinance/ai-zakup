import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto, UpdateCompanyDto, VerifyCompanyDto } from './dto/company.dto';

@ApiTags('Companies')
@Controller('companies')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @ApiOperation({ summary: 'Создание профиля компании' })
  @ApiResponse({ status: 201, description: 'Компания успешно создана' })
  @ApiResponse({ status: 400, description: 'Ошибка валидации или компания уже существует' })
  @Post()
  create(@Request() req, @Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(req.user.sub, createCompanyDto);
  }

  @ApiOperation({ summary: 'Получение профиля своей компании' })
  @ApiResponse({ status: 200, description: 'Профиль компании' })
  @ApiResponse({ status: 404, description: 'Компания не найдена' })
  @Get('my')
  findMy(@Request() req) {
    return this.companiesService.findByUserId(req.user.sub);
  }

  @ApiOperation({ summary: 'Получение профиля компании по ID' })
  @ApiResponse({ status: 200, description: 'Профиль компании' })
  @ApiResponse({ status: 404, description: 'Компания не найдена' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @ApiOperation({ summary: 'Обновление профиля своей компании' })
  @ApiResponse({ status: 200, description: 'Компания успешно обновлена' })
  @ApiResponse({ status: 404, description: 'Компания не найдена' })
  @Patch('my')
  update(@Request() req, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.update(req.user.sub, updateCompanyDto);
  }

  @ApiOperation({ summary: 'Обновление лицензий компании' })
  @ApiResponse({ status: 200, description: 'Лицензии успешно обновлены' })
  @Patch('my/licenses')
  updateLicenses(@Request() req, @Body() body: { licenses: any[] }) {
    return this.companiesService.updateLicenses(req.user.sub, body.licenses);
  }

  @ApiOperation({ summary: 'Проверка соответствия критериям тендера' })
  @ApiResponse({ status: 200, description: 'Результат проверки' })
  @Post(':id/check-criteria')
  checkCriteria(@Param('id') id: string, @Body() criteria: any) {
    return this.companiesService.checkTenderCriteria(id, criteria);
  }

  @ApiOperation({ summary: 'Верификация компании (только для администраторов)' })
  @ApiResponse({ status: 200, description: 'Статус верификации обновлен' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @Post(':id/verify')
  verify(
    @Request() req,
    @Param('id') id: string,
    @Body() verifyCompanyDto: VerifyCompanyDto,
  ) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Только администраторы могут верифицировать компании');
    }
    return this.companiesService.verify(id, verifyCompanyDto.status, verifyCompanyDto.reason);
  }

  @ApiOperation({ summary: 'Добавление компании в черный список (только для администраторов)' })
  @ApiResponse({ status: 200, description: 'Компания добавлена в черный список' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @Post(':id/blacklist')
  addToBlacklist(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { reason: string },
  ) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Только администраторы могут управлять черным списком');
    }
    return this.companiesService.addToBlacklist(id, body.reason);
  }

  @ApiOperation({ summary: 'Удаление компании из черного списка (только для администраторов)' })
  @ApiResponse({ status: 200, description: 'Компания удалена из черного списка' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @Post(':id/whitelist')
  removeFromBlacklist(@Request() req, @Param('id') id: string) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Только администраторы могут управлять черным списком');
    }
    return this.companiesService.removeFromBlacklist(id);
  }
}
