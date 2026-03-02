import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PaymentsModule } from 'src/payments/payments.module';

@Module({
  imports: [PrismaModule, PaymentsModule],
  providers: [AppointmentsService],
  controllers: [AppointmentsController],
})
export class AppointmentsModule {}
