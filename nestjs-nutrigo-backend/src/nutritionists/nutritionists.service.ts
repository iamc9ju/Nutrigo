import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  FindNutritionistsQueryDto,
  SortBy,
} from './dto/find-nutritionists-query.dto';
import { Prisma, VerificationStatus } from '@prisma/client';
import { addMinutes, format, getDay, isAfter, parseISO } from 'date-fns';

@Injectable()
export class NutritionistsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: FindNutritionistsQueryDto) {
    const {
      search,
      specialty,
      sortBy,
      page = 1,
      limit = 12,
      maxFee,
      minRating,
    } = query;
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

    if (maxFee !== undefined) {
      where.consultationFee = { lte: maxFee };
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

    // Since filtering by aggregate minRating is complex in a single findMany with standard Prisma,
    // and this is an MVP, we fetch a bit more or filter the returned paginated set.
    // However, to keep it simple and accurate for small/medium datasets, we'll fetch all matching where
    // condition, then filter by rating, then paginate.
    // NOTE: This approach is NOT scalable for millions of records, but works for the current MVP.

    const allNutritionists = await this.prisma.nutritionist.findMany({
      where,
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
    });

    const formattedNutritionists = allNutritionists
      .map((nutri) => {
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
      })
      .filter((nutri) => {
        if (minRating !== undefined) {
          return nutri.avgRating >= minRating;
        }
        return true;
      });

    const total = formattedNutritionists.length;
    const paginatedData = formattedNutritionists.slice(skip, skip + limit);

    return {
      data: paginatedData,
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

    const bookedTimes = new Set(
      existingAppointments.map((appt) => appt.startTime.getTime()),
    );

    const finalSlots = allSlots.map((slot) => {
      return {
        time: slot.time,
        available: !bookedTimes.has(slot.startDateTime.getTime()),
      };
    });

    return finalSlots;
  }
}
