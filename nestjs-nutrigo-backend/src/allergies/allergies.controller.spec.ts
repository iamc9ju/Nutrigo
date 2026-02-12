import { Test, TestingModule } from '@nestjs/testing';
import { AllergiesController } from './allergies.controller';

describe('AllergiesController', () => {
  let controller: AllergiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AllergiesController],
    }).compile();

    controller = module.get<AllergiesController>(AllergiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
