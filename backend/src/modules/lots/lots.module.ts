import { Module } from '@nestjs/common';
import { LotsService } from './lots.service';
import { LotsController } from './lots.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CompaniesModule } from '../companies/companies.module';
import { EscrowModule } from '../escrow/escrow.module';

@Module({
  imports: [PrismaModule, CompaniesModule, EscrowModule],
  controllers: [LotsController],
  providers: [LotsService],
  exports: [LotsService],
})
export class LotsModule {}
