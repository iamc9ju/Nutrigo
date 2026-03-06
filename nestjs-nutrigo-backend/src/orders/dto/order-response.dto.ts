import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus, PaymentStatus } from '@prisma/client';

class OrderItemResponseDto {
  @ApiProperty()
  orderItemId: number;

  @ApiProperty()
  menuItemId: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  priceAtOrder: number;

  @ApiProperty()
  totalPrice: number;
}

export class OrderResponseDto {
  @ApiProperty()
  orderId: string;

  @ApiProperty()
  patientId: string;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty({ enum: OrderStatus })
  status: OrderStatus;

  @ApiProperty({ enum: PaymentStatus })
  paymentStatus: PaymentStatus;

  @ApiProperty()
  deliveryAddress: string;

  @ApiProperty()
  contactPhone: string;

  @ApiProperty({ required: false })
  qrCodeUrl?: string;

  @ApiProperty({ type: [OrderItemResponseDto] })
  items: OrderItemResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
