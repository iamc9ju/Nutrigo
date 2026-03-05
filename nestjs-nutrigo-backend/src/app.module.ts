import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { MyLoggerModule } from './my-logger/my-logger.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { PatientsModule } from './patients/patients.module';
import { HealthMetricsModule } from './health-metrics/health-metrics.module';
import { NutritionistsModule } from './nutritionists/nutritionists.module';
import { APP_GUARD } from '@nestjs/core';

import { PaymentsModule } from './payments/payments.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { ChatModule } from './chat/chat.module';
import { MenuItemsModule } from './menu-items/menu-items.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        PORT: Joi.number().default(4000),
        FRONTEND_URL: Joi.string().default('http://localhost:3000'),
        REDIS_URL: Joi.string().default('redis://localhost:6379'),
      }),
    }) as unknown as DynamicModule,
    MyLoggerModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 30,
        },
      ],
    }) as unknown as DynamicModule,
    HealthModule,
    AuthModule,
    PatientsModule,
    HealthMetricsModule,
    NutritionistsModule,
    PaymentsModule,
    AppointmentsModule,
    WebhooksModule,
    ChatModule,
    MenuItemsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
