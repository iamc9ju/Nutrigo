import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAllergyDto } from './dto/create-allergy.dto';
import { UpdateAllergyDto } from './dto/update-allergy.dto';

@Injectable()
export class AllergiesService {
  private readonly logger = new Logger(AllergiesService.name);

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

  async create(userId: string, dto: CreateAllergyDto) {
    const patientId = await this.getPatientId(userId);

    const allergy = await this.prisma.patientAllergy.create({
      data: {
        patientId,
        ingredientName: dto.ingredientName,
        severity: dto.severity ?? 'moderate',
        note: dto.note,
      },
    });

    this.logger.log(`Created allergy ${allergy.id} for patient ${patientId}`);
    return allergy;
  }

  async findAll(userId: string) {
    const patientId = await this.getPatientId(userId);
    return this.prisma.patientAllergy.findMany({
      where: { patientId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, allergyId: number) {
    const patientId = await this.getPatientId(userId);
    const allergy = await this.prisma.patientAllergy.findUnique({
      where: { id: allergyId },
    });
    if (!allergy || allergy.patientId !== patientId) {
      throw new NotFoundException('Allergy not found');
    }
    return allergy;
  }

  async update(userId: string, allergyId: number, dto: UpdateAllergyDto) {
    const patientId = await this.getPatientId(userId);
    const allergy = await this.prisma.patientAllergy.findUnique({
      where: { id: allergyId },
    });
    if (!allergy) {
      throw new NotFoundException('Allergy not found');
    }
    if (allergy.patientId !== patientId) {
      throw new ForbiddenException('Not allowed to update this allergy');
    }
    return this.prisma.patientAllergy.update({
      where: { id: allergyId },
      data: dto,
    });
  }

  async remove(userId: string, allergyId: number) {
    const patientId = await this.getPatientId(userId);
    const allergy = await this.prisma.patientAllergy.findUnique({
      where: { id: allergyId },
    });
    if (!allergy) {
      throw new NotFoundException('Allergy not found');
    }
    if (allergy.patientId !== patientId) {
      throw new ForbiddenException('Not allowed to delete this allergy');
    }
    await this.prisma.patientAllergy.delete({
      where: { id: allergyId },
    });
    return { message: 'Allergy deleted successfully' };
  }
}
