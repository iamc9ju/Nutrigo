import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AllergiesService } from './allergies.service';
import { AllergiesController } from './allergies.controller';

@Module({
  imports: [PrismaModule],
  controllers: [AllergiesController],
  providers: [AllergiesService],
  exports: [AllergiesService],
})
export class AllergiesModule {}
