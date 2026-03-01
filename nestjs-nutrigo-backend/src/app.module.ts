import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { AllergiesModule } from './allergies/allergies.module';
import { NutritionistsModule } from './nutritionists/nutritionists.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';

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
    }),
    MyLoggerModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: 60000,
            limit: 10,
          },
        ],
        storage: new ThrottlerStorageRedisService(
          config.getOrThrow<string>('REDIS_URL'),
        ),
      }),
    }),
    HealthModule,
    AuthModule,
    PatientsModule,
    AllergiesModule,
    HealthMetricsModule,
    NutritionistsModule,
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
