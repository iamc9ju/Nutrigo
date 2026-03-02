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

    // ป้องกันการจองย้อนหลัง (Past Time Validation)
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

        // --- 1. ตรวจสอบตารางงาน (NutritionistSchedule) ---
        const dayOfWeek = requestedStartTime.getDay();
        const startHour = requestedStartTime
          .getHours()
          .toString()
          .padStart(2, '0');
        const startMinute = requestedStartTime
          .getMinutes()
          .toString()
          .padStart(2, '0');
        const startString = `${startHour}:${startMinute}`;

        const endHour = requestedEndTime.getHours().toString().padStart(2, '0');
        const endMinute = requestedEndTime
          .getMinutes()
          .toString()
          .padStart(2, '0');
        const endString = `${endHour}:${endMinute}`;

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

        // --- 2. ตรวจสอบวันลา (NutritionistLeave) ---
        const requestedDateISO = requestedStartTime.toISOString().split('T')[0];
        const requestedDate = new Date(`${requestedDateISO}T00:00:00.000Z`);

        const leave = await tx.nutritionistLeave.findFirst({
          where: {
            nutritionistId: dto.nutritionistId,
            leaveDate: requestedDate,
          },
        });

        if (leave) {
          if (leave.isFullDay) {
            throw new BadRequestException(
              ErrorMessages.APPOINTMENTS.NUTRITIONIST_ON_LEAVE,
            );
          }
          // กรณีลางานแบบไม่เต็มวัน (Part-day leave) เวลาเปิดให้บริการจะเปลี่ยนไปตาม newStartTime/newEndTime
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

    const amount = Math.round(appointmentResult.fee * 100);
    const clientSecret = await this.paymentsService.createPaymentIntent(
      amount,
      {
        appointmentId: appointmentResult.appointment.appointmentId,
        patientId: patient.patientId,
      },
    );

    return {
      appointmentId: appointmentResult.appointment.appointmentId,
      payment: {
        clientSecret,
        amount: appointmentResult.fee,
      },
    };
  }
}
