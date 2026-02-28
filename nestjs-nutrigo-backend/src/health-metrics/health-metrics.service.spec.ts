import { Test, TestingModule } from '@nestjs/testing';
import { HealthMetricsService } from './health-metrics.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

interface MockPrisma {
  patient: { findUnique: jest.Mock };
  healthMetric: { findUnique: jest.Mock; delete: jest.Mock };
}

describe('HealthMetricsService - Business Boundary Control', () => {
  let service: HealthMetricsService;
  let prismaMock: MockPrisma;

  beforeEach(async () => {
    prismaMock = {
      patient: { findUnique: jest.fn() },
      healthMetric: { findUnique: jest.fn(), delete: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthMetricsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<HealthMetricsService>(HealthMetricsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Deleting a Health Metric (Authorization Check)', () => {
    it("should throw ForbiddenException if user tries to delete another patient's metric", async () => {
      const maliciousUserId = 'user-hacker';
      const maliciousPatientId = 'patient-hacker';
      const targetMetricId = 999;

      const targetMetric = {
        healthMetricId: targetMetricId,
        patientId: 'patient-victim',
      };

      prismaMock.patient.findUnique.mockResolvedValueOnce({
        patientId: maliciousPatientId,
      });
      prismaMock.healthMetric.findUnique.mockResolvedValueOnce(targetMetric);

      await expect(
        service.remove(maliciousUserId, targetMetricId),
      ).rejects.toThrow(ForbiddenException);

      expect(prismaMock.healthMetric.delete).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if metric does not exist at all', async () => {
      const userId = 'user-1';
      prismaMock.patient.findUnique.mockResolvedValueOnce({
        patientId: 'patient-1',
      });

      prismaMock.healthMetric.findUnique.mockResolvedValueOnce(null);

      await expect(service.remove(userId, 999)).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaMock.healthMetric.delete).not.toHaveBeenCalled();
    });

    it('should successfully delete if ownership matches', async () => {
      const userId = 'user-valid';
      const patientId = 'patient-valid';
      const metricId = 123;

      const metric = {
        healthMetricId: metricId,
        patientId: patientId,
      };

      prismaMock.patient.findUnique.mockResolvedValueOnce({ patientId });
      prismaMock.healthMetric.findUnique.mockResolvedValueOnce(metric);
      prismaMock.healthMetric.delete.mockResolvedValueOnce(metric);

      const result = await service.remove(userId, metricId);

      expect(result.message).toBe('Health metric deleted successfully');
      expect(prismaMock.healthMetric.delete).toHaveBeenCalledWith({
        where: { healthMetricId: metricId },
      });
    });
  });
});
