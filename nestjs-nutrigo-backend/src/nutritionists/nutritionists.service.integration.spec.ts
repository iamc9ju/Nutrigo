import { Test, TestingModule } from '@nestjs/testing';
import { NutritionistsService } from './nutritionists.service';
import { NutritionistSchedulesService } from './nutritionist-schedules.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';

describe('NutritionistsService Integration - Concurrency & Constraints', () => {
  let schedulesService: NutritionistSchedulesService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        NutritionistsService,
        NutritionistSchedulesService,
        PrismaService,
      ],
    }).compile();

    schedulesService = module.get<NutritionistSchedulesService>(
      NutritionistSchedulesService,
    );
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.nutritionistSchedule.deleteMany();
    await prisma.nutritionist.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('Race Conditions on Schedule Creation (Upsert Validation)', () => {
    it('should safely upsert without creating duplicate schedules during concurrent requests', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'dr.nutrition@hospital.com',
          passwordHash: 'hashed',
          role: 'nutritionist',
          phone: '111222333',
        },
      });

      const nutritionist = await prisma.nutritionist.create({
        data: {
          userId: user.userId,
          firstName: 'House',
          lastName: 'MD',
        },
      });

      const dto = {
        dayOfWeek: 1,
        startTime: '09:00',
        endTime: '17:00',
        isAvailable: true,
      };

      const concurrentRequests = Array.from({ length: 5 }).map(() =>
        schedulesService.createSchedule(user.userId, dto).catch(() => null),
      );

      await Promise.all(concurrentRequests);

      const schedulesInDb = await prisma.nutritionistSchedule.findMany({
        where: {
          nutritionistId: nutritionist.nutritionistId,
          dayOfWeek: 1,
        },
      });

      expect(schedulesInDb).toHaveLength(1);
      expect(schedulesInDb[0].startTime).toBe('09:00');
    });
  });
});
