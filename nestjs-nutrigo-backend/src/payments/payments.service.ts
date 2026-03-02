import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ErrorMessages } from 'src/common/constants/response.constants';
import Stripe from 'stripe';
@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!secretKey) {
      throw new InternalServerErrorException('Stripe key is not configured');
    }

    this.stripe = new Stripe(secretKey, {
      apiVersion: '2026-02-25.clover',
    });
  }

  //paymentIntention คือ object ที่เเทนการพยายามจ่ายเงินหนึ่งครั้ง
  //BE สร้าง paymentIntention ส่ง client_secret ให้FE -> fe confirm payment ด้วย stripe.js
  async createPaymentIntent(
    amount: number,
    metadata: Record<string, string>,
  ): Promise<string> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amount,
        currency: 'thb',
        metadata,
      });
      if (!paymentIntent.client_secret) {
        throw new InternalServerErrorException(
          'Failed to generate client secret',
        );
      }
      return paymentIntent.client_secret;
    } catch {
      throw new InternalServerErrorException(ErrorMessages.PROCESSING_ERROR);
    }
  }

  constructWebhookEvent(
    payload: string | Buffer,
    signature: string,
  ): Stripe.Event {
    const webhookSecret = this.configService.getOrThrow<string>(
      'STRIPE_WEBHOOK_SECRET',
    );
    if (!webhookSecret) {
      throw new InternalServerErrorException(
        'Webhook secret is not configured',
      );
    }
    try {
      return this.stripe.webhooks.constructEvent(
        //คำนวณHMACจากpayloadเทียบกับsignatureถ้าตรงคืนStripe.Event
        payload,
        signature,
        webhookSecret,
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new BadRequestException(`Webhook Error: ${err.message}`);
      }
      throw new BadRequestException('Webhook Error: Unknown');
    }
  }
}
