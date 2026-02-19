import { Test, TestingModule } from '@nestjs/testing';
import { NutritionistsController } from './nutritionists.controller';

describe('NutritionistsController', () => {
  let controller: NutritionistsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NutritionistsController],
    }).compile();

    controller = module.get<NutritionistsController>(NutritionistsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
