import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { InternalServerErrorException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ErrorMessages } from '../common/constants/response.constants';
import { IOmiseClient } from './types/omise.type';

// Mock Omise SDK completely
jest.mock('omise', () => {
  return jest.fn().mockImplementation(() => ({
    charges: {
      create: jest.fn(),
    },
  }));
});

describe('PaymentsService Unit Tests', () => {
  let service: PaymentsService;
  let configService: jest.Mocked<Partial<ConfigService>>;

  beforeEach(async () => {
    configService = {
      get: jest.fn((key: string) => {
        if (key === 'OMISE_SECRET_KEY') return 'sk_test_123';
        if (key === 'OMISE_PUBLIC_KEY') return 'pk_test_123';
        return null;
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
    it('should throw InternalServerErrorException if keys are missing', () => {
      configService.get = jest.fn().mockReturnValue(undefined);
      expect(
        () => new PaymentsService(configService as unknown as ConfigService),
      ).toThrow(
        new InternalServerErrorException('Omise keys are not configured'),
      );
    });
  });

  describe('createPromptPayCharge', () => {
    it('should successfully create a promptpay charge and return chargeId and qrCodeUrl', async () => {
      const omiseMockInstance = (
        service as unknown as { omiseClient: IOmiseClient }
      ).omiseClient;
      (omiseMockInstance.charges.create as jest.Mock).mockResolvedValueOnce({
        id: 'chrg_mock_123',
        source: {
          scannable_code: {
            image: {
              download_uri: 'https://omise.co/qr_mock_123',
            },
          },
        },
      });

      const result = await service.createPromptPayCharge(500, {
        appointmentId: 'appt-1',
      });

      expect(result).toEqual({
        chargeId: 'chrg_mock_123',
        qrCodeUrl: 'https://omise.co/qr_mock_123',
      });

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(omiseMockInstance.charges.create).toHaveBeenCalledWith({
        amount: 50000,
        currency: 'thb',
        source: {
          type: 'promptpay',
        },
        metadata: { appointmentId: 'appt-1' },
      });
    });

    it('should throw InternalServerErrorException if charge response is invalid', async () => {
      const omiseMockInstance = (
        service as unknown as { omiseClient: IOmiseClient }
      ).omiseClient;
      (omiseMockInstance.charges.create as jest.Mock).mockResolvedValueOnce({});

      await expect(service.createPromptPayCharge(500, {})).rejects.toThrow(
        new InternalServerErrorException(ErrorMessages.PROCESSING_ERROR),
      );
    });

    it('should throw InternalServerErrorException (PROCESSING_ERROR) if Omise SDK fails', async () => {
      const omiseMockInstance = (
        service as unknown as { omiseClient: IOmiseClient }
      ).omiseClient;
      (omiseMockInstance.charges.create as jest.Mock).mockRejectedValueOnce(
        new Error('Omise Down'),
      );

      await expect(service.createPromptPayCharge(500, {})).rejects.toThrow(
        new InternalServerErrorException(ErrorMessages.PROCESSING_ERROR),
      );
    });
  });
});
