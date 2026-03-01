import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLeaveDto } from './dto/create-leave.dto';

@Injectable()
export class NutritionistLeavesService {
  constructor(private prisma: PrismaService) {}

  async createLeave(userId: string, dto: CreateLeaveDto) {
    const nutritionist = await this.prisma.nutritionist.findUnique({
      where: { userId },
    });

    if (!nutritionist) {
      throw new NotFoundException('คุณไม่ได้ลงทะเบียนเป็นนักโภชนาการ');
    }

    const leaveDate = new Date(`${dto.leaveDate}T00:00:00.000Z`);

    return this.prisma.nutritionistLeave.upsert({
      where: {
        nutritionistId_leaveDate: {
          nutritionistId: nutritionist.nutritionistId,
          leaveDate: leaveDate,
        },
      },
      update: {
        isFullDay: dto.isFullDay ?? true,
        newStartTime: dto.newStartTime,
        newEndTime: dto.newEndTime,
      },
      create: {
        nutritionistId: nutritionist.nutritionistId,
        leaveDate: leaveDate,
        isFullDay: dto.isFullDay ?? true,
        newStartTime: dto.newStartTime,
        newEndTime: dto.newEndTime,
      },
    });
  }
}
