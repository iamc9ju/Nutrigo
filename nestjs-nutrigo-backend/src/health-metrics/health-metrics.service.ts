import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateHealthMetricDto } from './dto/create-health-metric.dto';
import { UpdateHealthMetricDto } from './dto/update-health-metric.dto';

@Injectable()
export class HealthMetricsService {
  private readonly logger = new Logger(HealthMetricsService.name);

  constructor(private prisma: PrismaService) {}

  private async getPatientId(userId: string): Promise<string> {
    const patient = await this.prisma.patient.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    return patient.id;
  }

  private calculateBmi(weightKg?: number, heightCm?: number): number | null {
    if (!weightKg || !heightCm) return null;
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    return Math.round(bmi * 100) / 100;
  }

  async create(userId: string, dto: CreateHealthMetricDto) {
    const patientId = await this.getPatientId(userId);
    const bmi = this.calculateBmi(dto.weightKg, dto.heightCm);
    const metric = await this.prisma.healthMetric.create({
      data: {
        patientId,
        weightKg: dto.weightKg,
        heightCm: dto.heightCm,
        bmi,
        bodyFatPercent: dto.bodyFatPercent,
      },
    });
    this.logger.log(
      `Created health metric ${metric.id} for patient ${patientId}`,
    );
    return metric;
  }

  async findAll(userId: string) {
    const patientId = await this.getPatientId(userId);
    return this.prisma.healthMetric.findMany({
      where: { patientId },
      orderBy: { recordedAt: 'desc' },
    });
  }

  async findLatest(userId: string) {
    const patientId = await this.getPatientId(userId);
    return this.prisma.healthMetric.findFirst({
      where: { patientId },
      orderBy: { recordedAt: 'desc' },
    });
  }

  async findOne(userId: string, metricId: number) {
    const patientId = await this.getPatientId(userId);
    const metric = await this.prisma.healthMetric.findUnique({
      where: { id: metricId },
    });
    if (!metric || metric.patientId !== patientId) {
      throw new NotFoundException('Health metric not found');
    }
    return metric;
  }

  async update(userId: string, metricId: number, dto: UpdateHealthMetricDto) {
    const patientId = await this.getPatientId(userId);
    const metric = await this.prisma.healthMetric.findUnique({
      where: { id: metricId },
    });
    if (!metric) {
      throw new NotFoundException('Health metric not found');
    }
    if (metric.patientId !== patientId) {
      throw new ForbiddenException('Not allowed to update this metric');
    }
    // คำนวณ BMI ใหม่ถ้ามีการเปลี่ยนน้ำหนักหรือส่วนสูง
    const newWeight = dto.weightKg ?? Number(metric.weightKg);
    const newHeight = dto.heightCm ?? Number(metric.heightCm);
    const bmi = this.calculateBmi(newWeight, newHeight);
    return this.prisma.healthMetric.update({
      where: { id: metricId },
      data: {
        ...dto,
        bmi,
      },
    });
  }

  async remove(userId: string, metricId: number) {
    const patientId = await this.getPatientId(userId);
    const metric = await this.prisma.healthMetric.findUnique({
      where: { id: metricId },
    });
    if (!metric) {
      throw new NotFoundException('Health metric not found');
    }
    if (metric.patientId !== patientId) {
      throw new ForbiddenException('Not allowed to delete this metric');
    }
    await this.prisma.healthMetric.delete({
      where: { id: metricId },
    });
    return { message: 'Health metric deleted successfully' };
  }
}
