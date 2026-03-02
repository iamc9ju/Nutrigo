import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import Stripe from 'stripe';
import { ErrorMessages } from '../common/constants/response.constants';

// Mock Stripe SDK completely
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    paymentIntents: {
      create: jest.fn(),
    },
    webhooks: {
      constructEvent: jest.fn(),
    },
  }));
});

describe('PaymentsService Unit Tests', () => {
  let service: PaymentsService;
  let configService: jest.Mocked<Partial<ConfigService>>;

  beforeEach(async () => {
    configService = {
      get: jest.fn((key: string) => {
        if (key === 'STRIPE_SECRET_KEY') return 'sk_test_123';
        return null;
      }),
      getOrThrow: jest.fn((key: string) => {
        if (key === 'STRIPE_WEBHOOK_SECRET') return 'whsec_test_123';
        throw new Error();
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should throw InternalServerErrorException if STRIPE_SECRET_KEY is missing', () => {
      configService.get = jest.fn().mockReturnValue(undefined);
      expect(() => new PaymentsService(configService as any)).toThrow(
        new InternalServerErrorException('Stripe key is not configured'),
      );
    });
  });

  describe('createPaymentIntent', () => {
    it('should successfully create a payment intent and return client_secret', async () => {
      const stripeMockInstance = (service as any).stripe as jest.Mocked<Stripe>;
      (
        stripeMockInstance.paymentIntents.create as jest.Mock
      ).mockResolvedValueOnce({
        client_secret: 'pi_client_secret_mock',
      });

      const result = await service.createPaymentIntent(50000, {
        appointmentId: 'appt-1',
      });

      expect(result).toBe('pi_client_secret_mock');
      expect(stripeMockInstance.paymentIntents.create).toHaveBeenCalledWith({
        amount: 50000,
        currency: 'thb',
        metadata: { appointmentId: 'appt-1' },
      });
    });

    it('should throw InternalServerErrorException if client_secret is missing in Stripe response', async () => {
      const stripeMockInstance = (service as any).stripe;
      (
        stripeMockInstance.paymentIntents.create as jest.Mock
      ).mockResolvedValueOnce({});

      await expect(service.createPaymentIntent(50000, {})).rejects.toThrow(
        new InternalServerErrorException(ErrorMessages.PROCESSING_ERROR),
      );
    });

    it('should throw InternalServerErrorException (PROCESSING_ERROR) if Stripe SDK fails', async () => {
      const stripeMockInstance = (service as any).stripe;
      (
        stripeMockInstance.paymentIntents.create as jest.Mock
      ).mockRejectedValueOnce(new Error('Stripe Down'));

      await expect(service.createPaymentIntent(50000, {})).rejects.toThrow(
        new InternalServerErrorException(ErrorMessages.PROCESSING_ERROR),
      );
    });
  });

  describe('constructWebhookEvent', () => {
    it('should successfully construct and return the Stripe event', () => {
      const stripeMockInstance = (service as any).stripe;
      const mockEvent = { type: 'payment_intent.succeeded' };
      (
        stripeMockInstance.webhooks.constructEvent as jest.Mock
      ).mockReturnValueOnce(mockEvent);

      const result = service.constructWebhookEvent(
        'payload',
        'valid_signature',
      );
      expect(result).toEqual(mockEvent);
      expect(stripeMockInstance.webhooks.constructEvent).toHaveBeenCalledWith(
        'payload',
        'valid_signature',
        'whsec_test_123',
      );
    });

    it('should throw BadRequestException if signature is invalid', () => {
      const stripeMockInstance = (service as any).stripe;
      (
        stripeMockInstance.webhooks.constructEvent as jest.Mock
      ).mockImplementationOnce(() => {
        throw new Error(
          'No signatures found matching the expected signature for payload',
        );
      });

      expect(() =>
        service.constructWebhookEvent('payload', 'invalid_sig'),
      ).toThrow(
        new BadRequestException(
          'Webhook Error: No signatures found matching the expected signature for payload',
        ),
      );
    });

    it('should throw InternalServerErrorException if STRIPE_WEBHOOK_SECRET is missing', () => {
      configService.getOrThrow = jest.fn().mockImplementation(() => {
        throw new Error();
      });

      expect(() => service.constructWebhookEvent('payload', 'sig')).toThrow();
    });
  });
});
