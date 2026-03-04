import {
  Injectable,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentsService } from '../payments/payments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Prisma, AppointmentStatus } from '@prisma/client';
import { TIME_CONSTANTS } from '../common/constants/time.constants';
import { ErrorMessages } from '../common/constants/response.constants';
import { format, getDay } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentsService: PaymentsService,
  ) {}

  async create(userId: string, dto: CreateAppointmentDto) {
    const requestedStartTime = new Date(dto.startTime);
    const requestedEndTime = new Date(
      requestedStartTime.getTime() + TIME_CONSTANTS.MS.ONE_HOUR,
    );

    if (requestedStartTime.getTime() <= Date.now()) {
      throw new BadRequestException(
        ErrorMessages.APPOINTMENTS.PAST_TIME_NOT_ALLOWED,
      );
    }

    const patient = await this.prisma.patient.findUnique({
      where: { userId },
    });

    if (!patient || !patient.isProfileComplete) {
      throw new ForbiddenException(ErrorMessages.PATIENTS.PROFILE_INCOMPLETE);
    }

    const appointmentResult = await this.prisma.$transaction(
      async (tx) => {
        const nutritionist = await tx.nutritionist.findUnique({
          where: {
            nutritionistId: dto.nutritionistId,
            verificationStatus: 'approved',
          },
        });

        if (!nutritionist) {
          throw new NotFoundException(
            ErrorMessages.NUTRITIONISTS.NOT_FOUND_OR_APPROVED,
          );
        }

        const BANGKOK_TZ = 'Asia/Bangkok';
        const startInBKK = toZonedTime(requestedStartTime, BANGKOK_TZ);
        const endInBKK = toZonedTime(requestedEndTime, BANGKOK_TZ);

        const dayOfWeek = getDay(startInBKK);
        const startString = format(startInBKK, 'HH:mm');
        const endString = format(endInBKK, 'HH:mm');

        const schedule = await tx.nutritionistSchedule.findFirst({
          where: {
            nutritionistId: dto.nutritionistId,
            dayOfWeek,
            isAvailable: true,
          },
        });

        if (!schedule) {
          throw new BadRequestException(
            ErrorMessages.APPOINTMENTS.SCHEDULE_NOT_FOUND,
          );
        }

        if (startString < schedule.startTime || endString > schedule.endTime) {
          throw new BadRequestException(
            ErrorMessages.APPOINTMENTS.OUTSIDE_WORKING_HOURS,
          );
        }

        const requestedDateStr = format(startInBKK, 'yyyy-MM-dd');
        const leaveStart = new Date(`${requestedDateStr}T00:00:00.000+07:00`);
        const leaveEnd = new Date(`${requestedDateStr}T23:59:59.999+07:00`);

        const leave = await tx.nutritionistLeave.findFirst({
          where: {
            nutritionistId: dto.nutritionistId,
            leaveDate: {
              gte: leaveStart,
              lte: leaveEnd,
            },
          },
        });

        if (leave) {
          if (leave.isFullDay) {
            throw new BadRequestException(
              ErrorMessages.APPOINTMENTS.NUTRITIONIST_ON_LEAVE,
            );
          }

          if (
            !leave.newStartTime ||
            !leave.newEndTime ||
            startString < leave.newStartTime ||
            endString > leave.newEndTime
          ) {
            throw new BadRequestException(
              ErrorMessages.APPOINTMENTS.OUTSIDE_WORKING_HOURS,
            );
          }
        }
        const conflictingAppointment = await tx.appointment.findFirst({
          where: {
            nutritionistId: dto.nutritionistId,
            startTime: requestedStartTime,
            status: {
              in: [AppointmentStatus.pending, AppointmentStatus.confirmed],
            },
          },
        });

        if (conflictingAppointment) {
          throw new ConflictException(
            ErrorMessages.APPOINTMENTS.TIME_SLOT_TAKEN,
          );
        }

        const fee = nutritionist.consultationFee.toNumber();

        const appointment = await tx.appointment.create({
          data: {
            patientId: patient.patientId,
            nutritionistId: dto.nutritionistId,
            startTime: requestedStartTime,
            endTime: requestedEndTime,
            type: dto.type,
            status: AppointmentStatus.pending,
          },
        });

        return { appointment, fee };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        maxWait: 5000,
        timeout: 10000,
      },
    );

    const amount = Math.round(appointmentResult.fee);
    const { chargeId, qrCodeUrl } =
      await this.paymentsService.createPromptPayCharge(amount, {
        appointmentId: appointmentResult.appointment.appointmentId,
        patientId: patient.patientId,
      });

    // Update appointment with chargeId, amount and qrCodeUrl
    await this.prisma.appointment.update({
      where: { appointmentId: appointmentResult.appointment.appointmentId },
      data: { chargeId, amount, qrCodeUrl },
    });

    return {
      appointmentId: appointmentResult.appointment.appointmentId,
      payment: {
        amount: appointmentResult.fee,
        chargeId,
        qrCodeUrl,
      },
    };
  }
  async findAllForPatient(userId: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { userId },
    });

    if (!patient) {
      throw new NotFoundException(ErrorMessages.PATIENTS.NOT_FOUND);
    }

    return this.prisma.appointment.findMany({
      where: { patientId: patient.patientId },
      include: {
        nutritionist: {
          select: {
            nutritionistId: true,
            firstName: true,
            lastName: true,
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
      orderBy: { startTime: 'desc' },
    });
  }

  async findOne(appointmentId: string, userId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { appointmentId },
      include: {
        nutritionist: {
          select: {
            nutritionistId: true,
            firstName: true,
            lastName: true,
          },
        },
        patient: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!appointment) {
      throw new NotFoundException(ErrorMessages.APPOINTMENTS.NOT_FOUND);
    }

    if (appointment.patient.userId !== userId) {
      throw new ForbiddenException(ErrorMessages.AUTH.FORBIDDEN);
    }

    // If pending, include payment info from local database
    if (
      appointment.status === AppointmentStatus.pending &&
      appointment.amount &&
      appointment.qrCodeUrl
    ) {
      return {
        ...appointment,
        payment: {
          amount: appointment.amount.toNumber(),
          qrCodeUrl: appointment.qrCodeUrl,
        },
      };
    }

    return appointment;
  }

  async findAllForNutritionist(userId: string) {
    const nutritionist = await this.prisma.nutritionist.findUnique({
      where: { userId },
    });

    if (!nutritionist) {
      throw new NotFoundException(ErrorMessages.NUTRITIONISTS.NOT_FOUND);
    }

    const appointments = await this.prisma.appointment.findMany({
      where: { nutritionistId: nutritionist.nutritionistId },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
            user: {
              select: {
                email: true,
                phone: true,
              },
            },
          },
        },
      },
      orderBy: { startTime: 'desc' },
    });

    return appointments;
  }
}
