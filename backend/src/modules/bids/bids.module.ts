import { Module } from '@nestjs/common';
import { BidsService } from './bids.service';
import { BidsController } from './bids.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CompaniesModule } from '../companies/companies.module';
import { LotsModule } from '../lots/lots.module';

@Module({
  imports: [PrismaModule, CompaniesModule, LotsModule],
  controllers: [BidsController],
  providers: [BidsService],
  exports: [BidsService],
})
export class BidsModule {}
