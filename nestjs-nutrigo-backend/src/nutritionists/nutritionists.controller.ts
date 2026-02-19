import { Controller, Get, Param, Query } from '@nestjs/common';
import { NutritionistsService } from './nutritionists.service';
import { FindNutritionistsQueryDto } from './dto/find-nutritionists-query.dto';

@Controller('nutritionists')
export class NutritionistsController {
  constructor(private nutritionistsService: NutritionistsService) {}

  @Get()
  findAll(@Query() query: FindNutritionistsQueryDto) {
    return this.nutritionistsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nutritionistsService.findOne(id);
  }
}
