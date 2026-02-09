import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ThrottlerModule } from '@nestjs/throttler';

import { MyLoggerModule } from './my-logger/my-logger.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { PatientsModule } from './patients/patients.module';
import { HealthMetricsModule } from './health-metrics/health-metrics.module';
import { AllergiesModule } from './allergies/allergies.module';

@Module({
  imports: [
    PrismaModule,
    MyLoggerModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    HealthModule,
    AuthModule,
    PatientsModule,
    AllergiesModule,
    HealthMetricsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
