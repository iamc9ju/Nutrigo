import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  FindNutritionistsQueryDto,
  SortBy,
} from './dto/find-nutritionists-query.dto';
import { Prisma, VerificationStatus } from '@prisma/client';
import { addMinutes, format, getDay, isAfter, parseISO } from 'date-fns';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { CreateLeaveDto } from './dto/create-leave.dto';

@Injectable()
export class NutritionistsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: FindNutritionistsQueryDto) {
    const { search, specialty, sortBy, page = 1, limit = 12 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.NutritionistWhereInput = {
      verificationStatus: VerificationStatus.approved,
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (specialty) {
      where.nutritionistSpecialties = {
        some: { specialty: { name: specialty } },
      };
    }

    let orderBy: Prisma.NutritionistOrderByWithRelationInput;
    switch (sortBy) {
      case SortBy.LOWEST_FEE:
        orderBy = { consultationFee: 'asc' };
        break;
      case SortBy.HIGHEST_RATED:
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    const [nutritionists, total] = await Promise.all([
      this.prisma.nutritionist.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: {
          nutritionistId: true,
          firstName: true,
          lastName: true,
          licenseNumber: true,
          consultationFee: true,
          verificationStatus: true,
          user: {
            select: {
              email: true,
            },
          },
          nutritionistSpecialties: {
            select: {
              specialty: { select: { specialtyId: true, name: true } },
            },
          },
          reviews: {
            select: { rating: true },
          },
        },
      }),
      this.prisma.nutritionist.count({ where }),
    ]);

    const formattedNutritionists = nutritionists.map((nutri) => {
      const totalReviews = nutri.reviews.length;
      const avgRating =
        totalReviews > 0
          ? nutri.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
          : 0;

      const { reviews: _reviews, ...rest } = nutri;
      return {
        ...rest,
        avgRating,
        totalReviews,
      };
    });

    return {
      data: formattedNutritionists,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(nutritionistId: string) {
    const nutritionist = await this.prisma.nutritionist.findUnique({
      where: { nutritionistId },
      select: {
        nutritionistId: true,
        firstName: true,
        lastName: true,
        licenseNumber: true,
        consultationFee: true,
        verificationStatus: true,
        user: {
          select: { email: true },
        },
        nutritionistSpecialties: {
          select: { specialty: { select: { specialtyId: true, name: true } } },
        },
        nutritionistSchedules: {
          where: { isAvailable: true },
          orderBy: { dayOfWeek: 'asc' },
        },
        reviews: {
          select: {
            rating: true,
            comment: true,
            createdAt: true,
            patient: { select: { firstName: true, lastName: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!nutritionist) {
      throw new NotFoundException('ไม่พบนักโภชนาการ');
    }

    const avgRating =
      nutritionist.reviews.length > 0
        ? nutritionist.reviews.reduce((sum, r) => sum + r.rating, 0) /
          nutritionist.reviews.length
        : 0;

    return {
      ...nutritionist,
      avgRating,
      totalReviews: nutritionist.reviews.length,
    };
  }

  async getAvailability(nutritionistId: string, dateString: string) {
    const nutritionist = await this.prisma.nutritionist.findUnique({
      where: {
        nutritionistId,
        verificationStatus: 'approved',
      },
    });
    if (!nutritionist) {
      throw new NotFoundException(
        'ไม่พบนักโภชนาการ หรือยังไม่ได้รับการอนุมัติ',
      );
    }
    const requestDayOfWeek = getDay(parseISO(dateString));

    const start = new Date(`${dateString}T00:00:00.000+07:00`);
    const end = new Date(`${dateString}T23:59:59.999+07:00`);

    const existingLeave = await this.prisma.nutritionistLeave.findFirst({
      where: {
        nutritionistId,
        leaveDate: {
          gte: start,
          lte: end,
        },
      },
    });

    if (existingLeave && existingLeave.isFullDay) {
      return [];
    }

    let startTimeString: string;
    let endTimeString: string;

    if (existingLeave && !existingLeave.isFullDay) {
      if (!existingLeave.newStartTime || !existingLeave.newEndTime) {
        return [];
      }
      startTimeString = existingLeave.newStartTime;
      endTimeString = existingLeave.newEndTime;
    } else {
      const schedule = await this.prisma.nutritionistSchedule.findFirst({
        where: {
          nutritionistId,
          dayOfWeek: requestDayOfWeek,
          isAvailable: true,
        },
      });

      if (!schedule) {
        return [];
      }

      startTimeString = schedule.startTime;
      endTimeString = schedule.endTime;
    }

    const actualStartDateTime = parseISO(`${dateString}T${startTimeString}:00`);
    const actualEndDateTime = parseISO(`${dateString}T${endTimeString}:00`);
    const consultationDurationMinutes = 60;
    const allSlots: {
      time: string;
      startDateTime: Date;
      endDateTime: Date;
    }[] = [];
    let currentSlot = actualStartDateTime;
    while (
      isAfter(
        actualEndDateTime,
        addMinutes(currentSlot, consultationDurationMinutes - 1),
      )
    ) {
      const nextSlot = addMinutes(currentSlot, consultationDurationMinutes);
      allSlots.push({
        time: format(currentSlot, 'HH:mm'),
        startDateTime: currentSlot,
        endDateTime: nextSlot,
      });
      currentSlot = nextSlot;
    }
    const existingAppointments = await this.prisma.appointment.findMany({
      where: {
        nutritionistId,
        startTime: {
          gte: start,
          lte: end,
        },
        status: {
          in: ['pending', 'confirmed'],
        },
      },
      select: {
        startTime: true,
        endTime: true,
      },
    });

    const finalSlots = allSlots.map((slot) => {
      const isBooked = existingAppointments.some((appt) => {
        return appt.startTime.getTime() === slot.startDateTime.getTime();
      });

      return {
        time: slot.time,
        available: !isBooked,
      };
    });

    return finalSlots;
  }

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
