import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FindMenuItemsQueryDto } from './dto/find-menu-items-query.dto';
import {
  CreateMenuItemDto,
  UpdateMenuItemDto,
} from './dto/menu-item-request.dto';
import { Prisma, UserRole } from '@prisma/client';

type MenuItemWithPartner = Prisma.MenuItemGetPayload<{
  include: {
    foodPartner: { select: { partnerName: true; foodPartnerId: true } };
  };
}>;

@Injectable()
export class MenuItemsService {
  private readonly logger = new Logger(MenuItemsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: FindMenuItemsQueryDto) {
    const {
      page,
      limit,
      sortBy,
      sortOrder,
      q,
      foodPartnerId,
      maxCalories,
      isAvailable,
      category,
    } = query;

    const skip = (page - 1) * limit;
    const where: Prisma.MenuItemWhereInput = {};

    if (foodPartnerId) where.foodPartnerId = foodPartnerId;
    if (isAvailable !== undefined) where.isAvailable = isAvailable;
    if (maxCalories) where.caloriesKcal = { lte: maxCalories };
    if (category) where.category = category;

    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    try {
      const [data, total] = await Promise.all([
        this.prisma.menuItem.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: {
            foodPartner: {
              select: { partnerName: true, foodPartnerId: true },
            },
          },
        }),
        this.prisma.menuItem.count({ where }),
      ]);

      return {
        data: this.mapItems(data),
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error(`Error fetching menu items: ${error.message}`);
      throw new BadRequestException('Invalid query parameters');
    }
  }

  async findOne(id: number) {
    const item = await this.prisma.menuItem.findUnique({
      where: { menuItemId: id },
      include: {
        foodPartner: {
          select: {
            partnerName: true,
            foodPartnerId: true,
            description: true,
            address: true,
          },
        },
      },
    });

    if (!item) throw new NotFoundException(`MenuItem #${id} not found`);
    return this.mapItem(item);
  }

  async create(dto: CreateMenuItemDto, userId: string) {
    const partner = await this.prisma.foodPartner.findUnique({
      where: { userId },
    });

    if (!partner) {
      throw new ForbiddenException('User is not registered as a Food Partner');
    }

    return this.prisma.menuItem.create({
      data: {
        ...dto,
        foodPartnerId: partner.foodPartnerId,
      },
      include: {
        foodPartner: { select: { partnerName: true, foodPartnerId: true } },
      },
    });
  }

  async update(
    id: number,
    dto: UpdateMenuItemDto,
    userId: string,
    role: string,
  ) {
    const item = await this.verifyOwnership(id, userId, role);

    return this.prisma.menuItem.update({
      where: { menuItemId: id },
      data: dto,
      include: {
        foodPartner: { select: { partnerName: true, foodPartnerId: true } },
      },
    });
  }

  async remove(id: number, userId: string, role: string) {
    await this.verifyOwnership(id, userId, role);
    return this.prisma.menuItem.delete({ where: { menuItemId: id } });
  }

  private async verifyOwnership(itemId: number, userId: string, role: string) {
    const item = await this.prisma.menuItem.findUnique({
      where: { menuItemId: itemId },
      include: { foodPartner: true },
    });

    if (!item) throw new NotFoundException(`MenuItem #${itemId} not found`);

    if (role !== UserRole.admin && item.foodPartner.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to modify this item',
      );
    }

    return item;
  }

  private mapItems(items: MenuItemWithPartner[]) {
    return items.map((item) => this.mapItem(item));
  }

  private mapItem(item: MenuItemWithPartner) {
    return {
      ...item,
      price: Number(item.price),
      proteinG: item.proteinG ? Number(item.proteinG) : null,
      carbsG: item.carbsG ? Number(item.carbsG) : null,
      fatG: item.fatG ? Number(item.fatG) : null,
    };
  }
}
