import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateEscrowDto {
  @ApiProperty({ example: 'lot_123', description: 'ID лота' })
  @IsString()
  lotId: string;

  @ApiProperty({ example: 'KKMFKZ2A', description: 'ID банка для эскроу счета' })
  @IsString()
  bankId: string;

  @ApiProperty({ 
    example: 50, 
    description: 'Процент средств, удерживаемых на эскроу (по умолчанию 50%)',
    minimum: 10,
    maximum: 100
  })
  @IsOptional()
  @IsNumber()
  @Min(10)
  @Max(100)
  heldPercent?: number;
}

export class DepositEscrowDto {
  @ApiProperty({ example: 25000000, description: 'Сумма депозита' })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ example: 'KZT', description: 'Валюта депозита' })
  @IsString()
  currency: string;

  @ApiProperty({ 
    example: 'KZ123456789012345678', 
    description: 'IBAN счета для списания средств' 
  })
  @IsString()
  sourceAccount: string;

  @ApiProperty({ 
    example: 'Депозит для обеспечения тендера', 
    description: 'Назначение платежа' 
  })
  @IsOptional()
  @IsString()
  purpose?: string;
}

export class WithdrawEscrowDto {
  @ApiProperty({ example: 5000000, description: 'Сумма вывода' })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ example: 'KZT', description: 'Валюта вывода' })
  @IsString()
  currency: string;

  @ApiProperty({ 
    example: 'KZ987654321098765432', 
    description: 'IBAN счета для зачисления средств' 
  })
  @IsString()
  destinationAccount: string;

  @ApiProperty({ 
    example: 'act_456', 
    description: 'ID акта, по которому производится выплата' 
  })
  @IsOptional()
  @IsString()
  actId?: string;

  @ApiProperty({ 
    example: 'Выплата по акту выполненных работ этап 1', 
    description: 'Назначение платежа' 
  })
  @IsOptional()
  @IsString()
  purpose?: string;
}

export class EscrowBalanceDto {
  @ApiProperty({ example: 25000000, description: 'Текущий баланс эскроу счета' })
  balance: number;

  @ApiProperty({ example: 50, description: 'Процент удерживаемых средств' })
  heldPercent: number;

  @ApiProperty({ example: 12500000, description: 'Доступно для вывода' })
  availableForWithdrawal: number;

  @ApiProperty({ example: 12500000, description: 'Заблокировано' })
  heldAmount: number;

  @ApiProperty({ example: 'KZT', description: 'Валюта счета' })
  currency: string;
}
