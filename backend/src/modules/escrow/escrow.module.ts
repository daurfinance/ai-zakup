import { Module } from '@nestjs/common';
import { EscrowService } from './escrow.service';
import { EscrowController } from './escrow.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  imports: [PrismaModule, CompaniesModule],
  controllers: [EscrowController],
  providers: [EscrowService],
  exports: [EscrowService],
})
export class EscrowModule {}
