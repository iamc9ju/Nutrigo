import { Module } from '@nestjs/common';
import { NutritionistsService } from './nutritionists.service';
import { NutritionistsController } from './nutritionists.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [NutritionistsService],
  controllers: [NutritionistsController],
})
export class NutritionistsModule {}
