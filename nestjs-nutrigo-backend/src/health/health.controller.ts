import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { CustomPrismaHealthIndicator } from './custom-prisma.health';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private customPrismaHealth: CustomPrismaHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.customPrismaHealth.isHealthy('database'),
    ]);
  }
}
