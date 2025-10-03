import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray, Min } from 'class-validator';

export class CreateBidDto {
  @ApiProperty({ example: 'lot_123', description: 'ID лота' })
  @IsString()
  lotId: string;

  @ApiProperty({ example: 45000000, description: 'Предлагаемая цена' })
  @IsNumber()
  @Min(0.01)
  price: number;

  @ApiProperty({ example: 'KZT', description: 'Валюта' })
  @IsString()
  currency: string;

  @ApiProperty({ example: 120, description: 'Срок выполнения в днях' })
  @IsNumber()
  @Min(1)
  etaDays: number;

  @ApiProperty({ 
    description: 'Вложения к заявке',
    example: [
      { name: 'Коммерческое предложение.pdf', url: '/uploads/proposal.pdf', type: 'proposal' },
      { name: 'Лицензия.pdf', url: '/uploads/license.pdf', type: 'license' }
    ]
  })
  @IsOptional()
  @IsArray()
  attachments?: any[];
}

export class UpdateBidDto {
  @ApiProperty({ example: 45000000, description: 'Предлагаемая цена' })
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  price?: number;

  @ApiProperty({ example: 'KZT', description: 'Валюта' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ example: 120, description: 'Срок выполнения в днях' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  etaDays?: number;

  @ApiProperty({ 
    description: 'Вложения к заявке',
    example: [
      { name: 'Коммерческое предложение.pdf', url: '/uploads/proposal.pdf', type: 'proposal' },
      { name: 'Лицензия.pdf', url: '/uploads/license.pdf', type: 'license' }
    ]
  })
  @IsOptional()
  @IsArray()
  attachments?: any[];
}

export class RejectBidDto {
  @ApiProperty({ 
    example: 'Не соответствует техническим требованиям', 
    description: 'Причина отклонения заявки' 
  })
  @IsOptional()
  @IsString()
  reason?: string;
}
