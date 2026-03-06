import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Prisma, OrderStatus, PaymentStatus, UserRole } from '@prisma/client';

type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: {
        menuItem: true;
      };
    };
  };
}>;

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOrderDto, userId: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { userId },
    });

    if (!patient) {
      throw new ForbiddenException('Only patients can create orders');
    }

    return this.prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      const orderItemsData: {
        menuItemId: number;
        quantity: number;
        priceAtOrder: number;
        totalPrice: number;
      }[] = [];

      for (const itemRequest of dto.items) {
        const menuItem = await tx.menuItem.findUnique({
          where: { menuItemId: itemRequest.menuItemId },
        });

        if (!menuItem) {
          throw new NotFoundException(
            `Menu item #${itemRequest.menuItemId} not found`,
          );
        }

        if (menuItem.stockQuantity < itemRequest.quantity) {
          throw new BadRequestException(
            `Not enough stock for ${menuItem.name}`,
          );
        }

        const priceAtOrder = Number(menuItem.price);
        const totalPrice = priceAtOrder * itemRequest.quantity;
        totalAmount += totalPrice;

        orderItemsData.push({
          menuItemId: itemRequest.menuItemId,
          quantity: itemRequest.quantity,
          priceAtOrder,
          totalPrice,
        });

        // Decrement stock
        await tx.menuItem.update({
          where: { menuItemId: itemRequest.menuItemId },
          data: {
            stockQuantity: { decrement: itemRequest.quantity },
            isOutOfStock: menuItem.stockQuantity - itemRequest.quantity <= 0,
          },
        });
      }

      const order = await tx.order.create({
        data: {
          patientId: patient.patientId,
          totalAmount,
          deliveryAddress: dto.deliveryAddress,
          contactPhone: dto.contactPhone,
          status: OrderStatus.PENDING,
          paymentStatus: PaymentStatus.UNPAID,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: {
            include: {
              menuItem: true,
            },
          },
        },
      });

      return this.mapOrder(order);
    });
  }

  async findAll(userId: string, role: string) {
    const where: any = {};

    if (role === UserRole.patient) {
      const patient = await this.prisma.patient.findUnique({
        where: { userId },
      });
      if (!patient) throw new NotFoundException('Patient profile not found');
      where.patientId = patient.patientId;
    } else if (role === UserRole.food_partner) {
      const partner = await this.prisma.foodPartner.findUnique({
        where: { userId },
      });
      if (!partner)
        throw new NotFoundException('Food Partner profile not found');
      where.items = {
        some: {
          menuItem: {
            foodPartnerId: partner.foodPartnerId,
          },
        },
      };
    }

    const orders = await this.prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((o) => this.mapOrder(o));
  }

  async findOne(id: string, userId: string, role: string) {
    const order = await this.prisma.order.findUnique({
      where: { orderId: id },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    if (!order) throw new NotFoundException(`Order #${id} not found`);

    // Verify access
    if (role === UserRole.patient) {
      const patient = await this.prisma.patient.findUnique({
        where: { userId },
      });
      if (!patient || order.patientId !== patient.patientId)
        throw new ForbiddenException();
    } else if (role === UserRole.food_partner) {
      // A partner can see the order if it contains their items
      const partner = await this.prisma.foodPartner.findUnique({
        where: { userId },
      });
      if (!partner) throw new ForbiddenException();

      const hasPartnerItems = order.items.some(
        (i) => i.menuItem.foodPartnerId === partner.foodPartnerId,
      );
      if (!hasPartnerItems) throw new ForbiddenException();
    }

    return this.mapOrder(order);
  }

  async updateStatus(
    id: string,
    status: OrderStatus,
    userId: string,
    role: string,
  ) {
    const order = await this.findOne(id, userId, role);

    return this.prisma.order
      .update({
        where: { orderId: id },
        data: { status },
        include: {
          items: {
            include: {
              menuItem: true,
            },
          },
        },
      })
      .then((o) => this.mapOrder(o));
  }

  private mapOrder(order: OrderWithItems) {
    return {
      ...order,
      totalAmount: Number(order.totalAmount),
      items: order.items.map((i) => ({
        ...i,
        name: i.menuItem.name,
        imageUrl: i.menuItem.imageUrl,
        priceAtOrder: Number(i.priceAtOrder),
        totalPrice: Number(i.totalPrice),
        menuItem: undefined,
      })),
    };
  }
}
