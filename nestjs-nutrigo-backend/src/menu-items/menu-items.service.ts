import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FindMenuItemsQueryDto } from './dto/find-menu-items-query.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class MenuItemsService {
  private readonly logger = new Logger(MenuItemsService.name);
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: FindMenuItemsQueryDto) {
    const where: Prisma.MenuItemWhereInput = {};

    if (query.foodPartnerId) {
      where.foodPartnerId = query.foodPartnerId;
    }

    if (query.maxCalories) {
      where.caloriesKcal = { lte: query.maxCalories };
    }

    if (query.isAvailable !== undefined) {
      where.isAvailable = query.isAvailable;
    }

    if (query.q) {
      where.OR = [
        { name: { contains: query.q, mode: 'insensitive' } },
        { description: { contains: query.q, mode: 'insensitive' } },
      ];
    }

    return this.prisma.menuItem.findMany({
      where,
      include: {
        foodPartner: {
          select: {
            name: true,
            foodPartnerId: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const item = await this.prisma.menuItem.findUnique({
      where: { menuItemId: id },
      include: {
        foodPartner: true,
      },
    });

    if (!item) {
      throw new NotFoundException(`Menu item with ID ${id} not found`);
    }

    return item;
  }
}
