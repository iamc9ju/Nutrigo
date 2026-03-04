import {
  Controller,
  Post,
  Req,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiExcludeEndpoint } from '@nestjs/swagger';
import { WebhooksService, OmiseEventType } from './webhooks.service';
import type { Request } from 'express';

interface OmiseWebhookPayload {
  key: string;
  data?: {
    id?: string;
    object?: string;
  };
}

@ApiTags('Webhooks')
@Controller('webhooks/omise')
export class OmiseWebhookController {
  private readonly logger = new Logger(OmiseWebhookController.name);

  constructor(private readonly webhooksService: WebhooksService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiExcludeEndpoint()
  @ApiOperation({
    summary: 'รับข้อมูล Omise Webhook (server-to-server)',
    description:
      'รับ event จาก Omise (เช่น charge.complete) เพื่ออัปเดตสถานะการนัดหมายในฐานข้อมูล — ไม่แสดงใน API Docs สาธารณะ',
  })
  async handleWebhook(@Req() req: Request) {
    const payload = req.body as OmiseWebhookPayload;

    if (!payload?.key || !payload?.data?.id) {
      this.logger.warn('Webhook received with missing key or data.id');
      return { received: true };
    }

    if (payload.key !== (OmiseEventType.CHARGE_COMPLETE as string)) {
      this.logger.debug(`Ignored webhook event: ${payload.key}`);
      return { received: true };
    }

    const chargeId = payload.data.id;

    await this.webhooksService.processOmiseChargeComplete(chargeId);

    return { received: true };
  }
}
