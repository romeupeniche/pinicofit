import { Module } from '@nestjs/common';
import { WaterService } from './water.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { WaterController } from './water.controller';

@Module({
  controllers: [WaterController],
  providers: [WaterService, PrismaService],
  exports: [WaterService],
})
export class WaterModule {}
