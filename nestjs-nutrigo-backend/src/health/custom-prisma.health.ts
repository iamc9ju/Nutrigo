import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustomPrismaHealthIndicator extends HealthIndicator {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }
  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      await this.prismaService.$connect();
      return this.getStatus(key, true);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new HealthCheckError(
        'Prisma check failed',
        this.getStatus(key, false, { error: message }),
      );
    }
  }
}
