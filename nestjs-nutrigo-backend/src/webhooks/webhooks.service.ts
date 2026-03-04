import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AppointmentStatus } from '@prisma/client';

export enum OmiseEventType {
  CHARGE_COMPLETE = 'charge.complete',
}

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(private readonly prisma: PrismaService) {}

  async processOmiseChargeComplete(chargeId: string): Promise<void> {
    this.logger.log(
      `Processing Omise charge complete for chargeId: ${chargeId}`,
    );

    try {
      const appointment = await this.prisma.appointment.findUnique({
        where: { chargeId },
      });

      if (!appointment) {
        this.logger.warn(`No appointment found for chargeId: ${chargeId}`);
        return;
      }

      if (appointment.status === AppointmentStatus.confirmed) {
        this.logger.log(
          `Appointment ${appointment.appointmentId} is already confirmed`,
        );
        return;
      }

      await this.prisma.appointment.update({
        where: { appointmentId: appointment.appointmentId },
        data: { status: AppointmentStatus.confirmed },
      });

      this.logger.log(
        `Successfully updated appointment ${appointment.appointmentId} status to confirmed`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to process charge complete for ${chargeId}`,
        error instanceof Error ? error.stack : error,
      );
    }
  }
}
