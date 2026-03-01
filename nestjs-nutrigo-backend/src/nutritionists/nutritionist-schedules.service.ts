import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';

@Injectable()
export class NutritionistSchedulesService {
  constructor(private prisma: PrismaService) {}

  async createSchedule(userId: string, dto: CreateScheduleDto) {
    const nutritionist = await this.prisma.nutritionist.findUnique({
      where: { userId },
    });

    if (!nutritionist) {
      throw new NotFoundException('คุณไม่ได้ลงทะเบียนเป็นนักโภชนาการ');
    }

    return this.prisma.nutritionistSchedule.upsert({
      where: {
        nutritionistId_dayOfWeek: {
          nutritionistId: nutritionist.nutritionistId,
          dayOfWeek: dto.dayOfWeek,
        },
      },
      update: {
        startTime: dto.startTime,
        endTime: dto.endTime,
        isAvailable: dto.isAvailable ?? true,
      },
      create: {
        nutritionistId: nutritionist.nutritionistId,
        dayOfWeek: dto.dayOfWeek,
        startTime: dto.startTime,
        endTime: dto.endTime,
        isAvailable: dto.isAvailable ?? true,
      },
    });
  }
}
