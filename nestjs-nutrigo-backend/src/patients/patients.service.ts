import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompleteProfileDto } from './dto/complete-profile.dto';

@Injectable()
export class PatientsService {
  private readonly logger = new Logger(PatientsService.name);

  constructor(private prisma: PrismaService) {}

  async completeProfile(userId: string, dto: CompleteProfileDto) {
    const patient = await this.prisma.patient.findUnique({
      where: { userId },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const updated = await this.prisma.patient.update({
      where: { id: patient.id },
      data: {
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
        gender: dto.gender,
        bloodType: dto.bloodType,
        chronicDiseases: dto.chronicDiseases,
        isProfileComplete: true,
      },
    });
    this.logger.log(`Patient ${patient.id} completed profile`);
    return { message: 'Profile completed successfully', patient: updated };
  }

  async getProfile(userId: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { userId },
      include: {
        user: true,
        patientAllergies: true,
        healthMetrics: {
          orderBy: { recordedAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return {
      userId: patient.userId,
      patientId: patient.id,
      email: patient.user.email,
      role: patient.user.role,
      firstName: patient.firstName,
      lastName: patient.lastName,
      phoneNumber: patient.user.phone,
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      bloodType: patient.bloodType,
      chronicDiseases: patient.chronicDiseases,
      isProfileComplete: patient.isProfileComplete,
      allergies: patient.patientAllergies,
      healthMetrics: patient.healthMetrics[0],
    };
  }
}
