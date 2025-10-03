import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject, IsArray, IsNumber, Min, Max } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ example: '123456789012', description: 'БИН/ИИН компании' })
  @IsString()
  binIin: string;

  @ApiProperty({ example: 'ТОО "Строительная компания"', description: 'Наименование компании' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'llp', description: 'Тип компании', enum: ['llp', 'jsc', 'sp'] })
  @IsString()
  type: string;

  @ApiProperty({ example: 'г. Алматы, ул. Абая, 123', description: 'Юридический адрес', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ 
    description: 'Банковские реквизиты',
    example: { iban: 'KZ123456789012345678', bik: 'KKMFKZ2A' },
    required: false
  })
  @IsOptional()
  @IsObject()
  bankReqs?: any;

  @ApiProperty({ 
    description: 'Лицензии и сертификаты',
    example: [{ type: 'строительная', number: 'СТР-123', validUntil: '2025-12-31' }]
  })
  @IsArray()
  @IsOptional()
  licenses?: any[];
}

export class UpdateCompanyDto {
  @ApiProperty({ example: '123456789012', description: 'БИН/ИИН компании' })
  @IsOptional()
  @IsString()
  binIin?: string;

  @ApiProperty({ example: 'ТОО "Строительная компания"', description: 'Наименование компании' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'ТОО', description: 'Организационно-правовая форма' })
  @IsOptional()
  @IsString()
  opf?: string;

  @ApiProperty({ example: 'г. Алматы, ул. Абая, 123', description: 'Юридический адрес' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ 
    description: 'Банковские реквизиты',
    example: { iban: 'KZ123456789012345678', bik: 'KKMFKZ2A' }
  })
  @IsOptional()
  @IsObject()
  bankReqs?: any;

  @ApiProperty({ 
    description: 'Лицензии и сертификаты',
    example: [{ type: 'строительная', number: 'СТР-123', validUntil: '2025-12-31' }]
  })
  @IsOptional()
  @IsArray()
  licenses?: any[];
}

export class VerifyCompanyDto {
  @ApiProperty({ 
    example: 'verified', 
    description: 'Статус верификации',
    enum: ['verified', 'rejected']
  })
  @IsString()
  status: 'verified' | 'rejected';

  @ApiProperty({ example: 'Документы не соответствуют требованиям', description: 'Причина отклонения' })
  @IsOptional()
  @IsString()
  reason?: string;
}
