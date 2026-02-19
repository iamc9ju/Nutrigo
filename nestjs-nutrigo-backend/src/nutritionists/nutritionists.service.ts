import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  FindNutritionistsQueryDto,
  SortBy,
} from './dto/find-nutritionists-query.dto';
import { Prisma, VerificationStatus } from '@prisma/client';
// import { contains } from 'class-validator';

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

    const [nutritionist, total] = await Promise.all([
      this.prisma.nutritionist.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: {
          id: true,
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
            select: { specialty: { select: { id: true, name: true } } },
          },
        },
      }),
      this.prisma.nutritionist.count({ where }),
    ]);

    return {
      data: nutritionist,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const nutritionist = await this.prisma.nutritionist.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        licenseNumber: true,
        consultationFee: true,
        verificationStatus: true,
        user: {
          select: { email: true },
        },
        nutritionistSpecialties: {
          select: { specialty: { select: { id: true, name: true } } },
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
}
