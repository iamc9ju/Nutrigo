import { Test, TestingModule } from '@nestjs/testing';
import { NutritionistsService } from './nutritionists.service';

describe('NutritionistsService', () => {
  let service: NutritionistsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NutritionistsService],
    }).compile();

    service = module.get<NutritionistsService>(NutritionistsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
