import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HealthController } from './health.controller';
import { CustomPrismaHealthIndicator } from './custom-prisma.health';

@Module({
  imports: [TerminusModule, HttpModule, PrismaModule],
  controllers: [HealthController],
  providers: [CustomPrismaHealthIndicator],
})
export class HealthModule {}
