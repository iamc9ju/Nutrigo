import { Module } from '@nestjs/common';
import { NutritionistsService } from './nutritionists.service';
import { NutritionistLeavesService } from './nutritionist-leaves.service';
import { NutritionistSchedulesService } from './nutritionist-schedules.service';
import { NutritionistsController } from './nutritionists.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    NutritionistsService,
    NutritionistLeavesService,
    NutritionistSchedulesService,
  ],
  controllers: [NutritionistsController],
})
export class NutritionistsModule {}
