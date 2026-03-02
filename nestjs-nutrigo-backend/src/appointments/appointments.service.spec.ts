import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentsService } from '../payments/payments.service';
import { AppointmentStatus, AppointmentType } from '@prisma/client';

describe('AppointmentsService Unit Tests', () => {
  let service: AppointmentsService;
  let prisma: jest.Mocked<Partial<PrismaService>>;
  let paymentsService: jest.Mocked<Partial<PaymentsService>>;

  const mockTransaction = jest.fn();

  beforeEach(async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-03-02T10:00:00Z')); // Current mocked time

    prisma = {
      patient: { findUnique: jest.fn() } as any,
      $transaction: mockTransaction as any,
    };

    paymentsService = {
      createPaymentIntent: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        { provide: PrismaService, useValue: prisma },
        { provide: PaymentsService, useValue: paymentsService },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  describe('create appointment', () => {
    const validDto = {
      nutritionistId: 'nutri-123',
      startTime: '2026-03-03T10:00:00Z', // Future date
      type: AppointmentType.online,
    };

    it('should throw BadRequestException if booking in the past', async () => {
      await expect(
        service.create('patient-id', {
          ...validDto,
          startTime: '2026-03-01T10:00:00Z', // Past date
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw ForbiddenException if patient does not exist or profile incomplete', async () => {
      (prisma.patient!.findUnique as jest.Mock).mockResolvedValueOnce(null);
      await expect(service.create('patient-id', validDto)).rejects.toThrow(
        ForbiddenException,
      );

      (prisma.patient!.findUnique as jest.Mock).mockResolvedValueOnce({
        isProfileComplete: false,
      });
      await expect(service.create('patient-id', validDto)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should successfully create appointment and return payment intent', async () => {
      (prisma.patient!.findUnique as jest.Mock).mockResolvedValueOnce({
        patientId: 'patient-uuid',
        isProfileComplete: true,
      });

      mockTransaction.mockResolvedValueOnce({
        appointment: { appointmentId: 'appt-uuid' },
        fee: 500, // 500 THB
      });

      (paymentsService.createPaymentIntent as jest.Mock).mockResolvedValueOnce(
        'pi_secret_123',
      );

      const result = await service.create('patient-id', validDto);

      expect(result).toEqual({
        appointmentId: 'appt-uuid',
        payment: {
          clientSecret: 'pi_secret_123',
          amount: 500,
        },
      });
      expect(paymentsService.createPaymentIntent).toHaveBeenCalledWith(50000, {
        appointmentId: 'appt-uuid',
        patientId: 'patient-uuid',
      });
    });

    describe('Transaction Logic (Inner behavior mocked)', () => {
      // Since we use prisma.$transaction containing multiple calls,
      // in unit tests we often just mock the transaction itself or use an integration test.
      // The integration test will cover the actual DB logic deeply.
    });
  });
});
