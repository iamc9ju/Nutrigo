import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { HealthMetricsService } from './health-metrics.service';
import { CreateHealthMetricDto } from './dto/create-health-metric.dto';
import { UpdateHealthMetricDto } from './dto/update-health-metric.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('patients/health-metrics')
@UseGuards(JwtAuthGuard)
export class HealthMetricsController {
  constructor(private healthMetricsService: HealthMetricsService) {}

  @Post()
  create(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateHealthMetricDto,
  ) {
    return this.healthMetricsService.create(userId, dto);
  }

  @Get()
  findAll(@CurrentUser('sub') userId: string) {
    return this.healthMetricsService.findAll(userId);
  }

  @Get('latest')
  findLatest(@CurrentUser('sub') userId: string) {
    return this.healthMetricsService.findLatest(userId);
  }

  @Get(':id')
  findOne(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.healthMetricsService.findOne(userId, id);
  }

  @Patch(':id')
  update(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateHealthMetricDto,
  ) {
    return this.healthMetricsService.update(userId, id, dto);
  }

  @Delete(':id')
  remove(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.healthMetricsService.remove(userId, id);
  }
}
