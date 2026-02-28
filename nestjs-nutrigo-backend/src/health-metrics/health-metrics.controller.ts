import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { HealthMetricsService } from './health-metrics.service';
import { CreateHealthMetricDto } from './dto/create-health-metric.dto';
import { UpdateHealthMetricDto } from './dto/update-health-metric.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserRole } from '@prisma/client';

@Controller('patients/health-metrics')
@Auth(UserRole.patient)
export class HealthMetricsController {
  constructor(private healthMetricsService: HealthMetricsService) {}

  @Post()
  async create(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateHealthMetricDto,
  ) {
    const data = await this.healthMetricsService.create(userId, dto);
    return data;
  }

  @Get()
  async findAll(@CurrentUser('sub') userId: string) {
    const data = await this.healthMetricsService.findAll(userId);
    return data;
  }

  @Get('latest')
  async findLatest(@CurrentUser('sub') userId: string) {
    const data = await this.healthMetricsService.findLatest(userId);
    return data;
  }

  @Get(':id')
  async findOne(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const data = await this.healthMetricsService.findOne(userId, id);
    return data;
  }

  @Patch(':id')
  async update(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateHealthMetricDto,
  ) {
    const data = await this.healthMetricsService.update(userId, id, dto);
    return data;
  }

  @Delete(':id')
  async remove(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const data = await this.healthMetricsService.remove(userId, id);
    return data;
  }
}
