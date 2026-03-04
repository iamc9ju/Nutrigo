import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { AppointmentStatus } from '@prisma/client';

const PENDING_TIMEOUT_MINUTES = 30;

@Injectable()
export class AppointmentExpiryService {
  private readonly logger = new Logger(AppointmentExpiryService.name);
  constructor(private readonly prisma: PrismaService) {}
  @Cron(CronExpression.EVERY_5_MINUTES)
  async cancelExpiredPendingAppointments() {
    try {
      const cutoff = new Date(Date.now() - PENDING_TIMEOUT_MINUTES * 60 * 1000);

      const result = await this.prisma.appointment.updateMany({
        where: {
          status: AppointmentStatus.pending,
          createdAt: { lt: cutoff },
        },
        data: {
          status: AppointmentStatus.cancelled,
        },
      });

      if (result.count > 0) {
        this.logger.log(
          `Cancelled ${result.count} expired pending appointment(s)`,
        );
      }
    } catch (error) {
      this.logger.error(
        'Failed to verify expired appointments due to database connection issue',
        error instanceof Error ? error.stack : 'Unknown error',
      );
    }
  }
}
