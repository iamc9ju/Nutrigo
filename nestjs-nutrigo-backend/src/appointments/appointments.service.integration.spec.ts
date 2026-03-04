import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsService } from './appointments.service';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentsService } from '../payments/payments.service';
import { AppointmentType } from '@prisma/client';

describe('AppointmentsService - Concurrency Integration', () => {
  let service: AppointmentsService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        PrismaService,
        {
          provide: PaymentsService,
          useValue: {
            createPromptPayCharge: jest.fn().mockResolvedValue({
              chargeId: 'chrg_mock_123',
              qrCodeUrl: 'https://omise.co/qr_mock_123',
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await prisma.appointment.deleteMany();
  });

  it('should prevent double booking with race conditions via Serializable Transaction', async () => {
    const tempUser = await prisma.user.create({
      data: {
        email: `nutri_test_${Date.now()}@test.com`,
        passwordHash: 'hash',
        role: 'nutritionist',
      },
    });

    const tempNutri = await prisma.nutritionist.create({
      data: {
        userId: tempUser.userId,
        firstName: 'Test',
        lastName: 'Nutri',
        verificationStatus: 'approved',
        consultationFee: 500,
      },
    });

    const tempPatients = await Promise.all(
      Array.from({ length: 5 }).map(async (_, idx) => {
        const u = await prisma.user.create({
          data: {
            email: `patient_test_${idx}_${Date.now()}@test.com`,
            passwordHash: 'hash',
            role: 'patient',
          },
        });
        return prisma.patient.create({
          data: {
            userId: u.userId,
            firstName: `P${idx}`,
            lastName: 'Test',
            isProfileComplete: true,
          },
        });
      }),
    );

    const requestedTime = new Date('2026-03-05T10:00:00Z');
    await prisma.nutritionistSchedule.create({
      data: {
        nutritionistId: tempNutri.nutritionistId,
        dayOfWeek: requestedTime.getDay(),
        startTime: '00:00',
        endTime: '23:59',
        isAvailable: true,
      },
    });

    const dto = {
      nutritionistId: tempNutri.nutritionistId,
      startTime: requestedTime.toISOString(),
      type: AppointmentType.online,
    };

    const concurrentRequests: Promise<object | string>[] = tempPatients.map(
      (patient) =>
        service
          .create(patient.userId, dto)
          .catch((err: unknown) =>
            err instanceof Error ? err.message : String(err),
          ),
    );
    const results = await Promise.all(concurrentRequests);
    const successes = results.filter(
      (r): r is { appointmentId: string } =>
        typeof r === 'object' && r !== null && 'appointmentId' in r,
    );

    const conflicts = results.filter(
      (r) => !r || typeof r !== 'object' || !('appointmentId' in r),
    );
    console.log(
      'CONCURRENCY TEST RESULTS:',
      results.map((r: object | string): string => {
        if (typeof r === 'object' && r !== null) {
          const res = r as { message?: string; code?: string };
          return res.message ?? res.code ?? JSON.stringify(r);
        }
        return String(r);
      }),
    );

    expect(successes).toHaveLength(1);
    expect(conflicts.length).toBeGreaterThanOrEqual(4);

    const appointmentsInDb = await prisma.appointment.count({
      where: {
        nutritionistId: tempNutri.nutritionistId,
        startTime: requestedTime,
      },
    });
    expect(appointmentsInDb).toBe(1);

    await prisma.appointment.deleteMany({
      where: { nutritionistId: tempNutri.nutritionistId },
    });
    await prisma.nutritionistSchedule.deleteMany({
      where: { nutritionistId: tempNutri.nutritionistId },
    });
    await prisma.nutritionist.delete({
      where: { nutritionistId: tempNutri.nutritionistId },
    });
    await prisma.user.delete({ where: { userId: tempUser.userId } });
    for (const p of tempPatients) {
      await prisma.patient.delete({ where: { patientId: p.patientId } });
      await prisma.user.delete({ where: { userId: p.userId } });
    }
  }, 15000);
});
