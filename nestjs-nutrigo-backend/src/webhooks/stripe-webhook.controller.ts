import {
  Controller,
  Post,
  Headers,
  Req,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaymentsService } from '../payments/payments.service';
import { PrismaService } from '../prisma/prisma.service';
import { AppointmentStatus } from '@prisma/client';
import Stripe from 'stripe';

@ApiTags('Webhooks')
@Controller('webhooks/stripe')
export class StripeWebhookController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'รับข้อมูล Stripe Webhook',
    description:
      'รับและประมวลผล event จาก Stripe (เช่น payment_intent.succeeded) เพื่ออัปเดตสถานะในระบบ',
  })
  @ApiResponse({
    status: 200,
    description: 'รับและประมวลผล Webhook เรียบร้อยแล้ว',
  })
  @ApiResponse({
    status: 400,
    description: 'Signature หรือ Payload ไม่ถูกต้อง',
  })
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: any,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing signature');
    }

    let event: Stripe.Event;

    try {
      event = this.paymentsService.constructWebhookEvent(
        req.rawBody,
        signature,
      );
    } catch (err: unknown) {
      let message = 'Unknown error';
      if (err instanceof Error) {
        message = err.message;
      }
      throw new BadRequestException(`Webhook Error: ${message}`);
    }
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const appointmentId = paymentIntent.metadata.appointmentId;

      if (appointmentId) {
        await this.prisma.appointment.update({
          where: { appointmentId },
          data: { status: AppointmentStatus.confirmed },
        });
      }
    }
    return { received: true };
  }
}
