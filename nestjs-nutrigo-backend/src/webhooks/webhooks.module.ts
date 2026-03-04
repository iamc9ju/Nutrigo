import { Module } from '@nestjs/common';
import { OmiseWebhookController } from './omise-webhook.controller';
import { WebhooksService } from './webhooks.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [PrismaModule, PaymentsModule],
  controllers: [OmiseWebhookController],
  providers: [WebhooksService],
})
export class WebhooksModule {}
