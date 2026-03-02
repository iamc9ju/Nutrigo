import { Test, TestingModule } from '@nestjs/testing';
import { StripeWebhookController } from './stripe-webhook.controller';
import { PaymentsService } from '../payments/payments.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { AppointmentStatus } from '@prisma/client';

describe('StripeWebhookController Unit Tests', () => {
  let controller: StripeWebhookController;
  let paymentsService: jest.Mocked<Partial<PaymentsService>>;
  let prisma: jest.Mocked<Partial<PrismaService>>;

  beforeEach(async () => {
    paymentsService = {
      constructWebhookEvent: jest.fn(),
    };

    prisma = {
      appointment: {
        update: jest.fn(),
      } as any,
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StripeWebhookController],
      providers: [
        { provide: PaymentsService, useValue: paymentsService },
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    controller = module.get<StripeWebhookController>(StripeWebhookController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleWebhook', () => {
    it('should throw BadRequestException if signature is missing', async () => {
      await expect(
        controller.handleWebhook('', { rawBody: 'req_body' }),
      ).rejects.toThrow(new BadRequestException('Missing signature'));
    });

    it('should throw BadRequestException if signature verification fails', async () => {
      (
        paymentsService.constructWebhookEvent as jest.Mock
      ).mockImplementationOnce(() => {
        throw new Error('Invalid signature');
      });

      await expect(
        controller.handleWebhook('invalid_sig', { rawBody: 'req_body' }),
      ).rejects.toThrow(
        new BadRequestException('Webhook Error: Invalid signature'),
      );
    });

    it('should handle payment_intent.succeeded and update appointment status (Idempotent)', async () => {
      const mockEvent = {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            metadata: {
              appointmentId: 'appt-123',
            },
          },
        },
      };

      (paymentsService.constructWebhookEvent as jest.Mock).mockReturnValueOnce(
        mockEvent,
      );

      const result = await controller.handleWebhook('valid_sig', {
        rawBody: 'req_body',
      });

      expect(result).toEqual({ received: true });
      expect(prisma.appointment!.update).toHaveBeenCalledWith({
        where: { appointmentId: 'appt-123' },
        data: { status: AppointmentStatus.confirmed },
      });
    });

    it('should handle webhook successfully without updating DB if appointmentId is missing in metadata', async () => {
      const mockEvent = {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            metadata: {},
          },
        },
      };

      (paymentsService.constructWebhookEvent as jest.Mock).mockReturnValueOnce(
        mockEvent,
      );

      const result = await controller.handleWebhook('valid_sig', {
        rawBody: 'req_body',
      });

      expect(result).toEqual({ received: true });
      expect(prisma.appointment!.update).not.toHaveBeenCalled();
    });

    it('should ignore unhandled event types and return received: true', async () => {
      const mockEvent = {
        type: 'payment_intent.created',
        data: { object: {} },
      };

      (paymentsService.constructWebhookEvent as jest.Mock).mockReturnValueOnce(
        mockEvent,
      );

      const result = await controller.handleWebhook('valid_sig', {
        rawBody: 'req_body',
      });

      expect(result).toEqual({ received: true });
      expect(prisma.appointment!.update).not.toHaveBeenCalled();
    });
  });
});
