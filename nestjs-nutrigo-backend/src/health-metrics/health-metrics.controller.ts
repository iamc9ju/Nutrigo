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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { HealthMetricsService } from './health-metrics.service';
import { CreateHealthMetricDto } from './dto/create-health-metric.dto';
import { UpdateHealthMetricDto } from './dto/update-health-metric.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Health Metrics')
@ApiBearerAuth()
@Controller('patients/health-metrics')
@Auth(UserRole.patient)
export class HealthMetricsController {
  constructor(private healthMetricsService: HealthMetricsService) {}

  @Post()
  @ApiOperation({ summary: 'บันทึกข้อมูลสุขภาพใหม่ (น้ำหนัก, ส่วนสูง, ไขมัน)' })
  @ApiResponse({ status: 201, description: 'บันทึกข้อมูบสุขภาพสำเร็จ' })
  async create(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateHealthMetricDto,
  ) {
    const data = await this.healthMetricsService.create(userId, dto);
    return data;
  }

  @Get()
  @ApiOperation({ summary: 'ดึงข้อมูลประวัติสุขภาพทั้งหมดของคนไข้' })
  @ApiResponse({ status: 200, description: 'ดึงข้อมูลสำเร็จ' })
  async findAll(@CurrentUser('sub') userId: string) {
    const data = await this.healthMetricsService.findAll(userId);
    return data;
  }

  @Get('latest')
  @ApiOperation({ summary: 'ดึงข้อมูลสุขภาพล่าสุด' })
  @ApiResponse({ status: 200, description: 'ดึงข้อมูลสุขภาพล่าสุดสำเร็จ' })
  async findLatest(@CurrentUser('sub') userId: string) {
    const data = await this.healthMetricsService.findLatest(userId);
    return data;
  }

  @Get(':id')
  @ApiOperation({ summary: 'ดึงข้อมูลสุขภาพตามคำค้นหา (ID)' })
  @ApiResponse({ status: 200, description: 'ดึงข้อมูลสุขภาพสำเร็จ' })
  @ApiResponse({ status: 404, description: 'ไม่พบข้อมูลสุขภาพ' })
  async findOne(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const data = await this.healthMetricsService.findOne(userId, id);
    return data;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'แก้ไขข้อมูลสุขภาพตามคำค้นหา (ID)' })
  @ApiResponse({ status: 200, description: 'อัปเดตข้อมูลสำเร็จ' })
  async update(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateHealthMetricDto,
  ) {
    const data = await this.healthMetricsService.update(userId, id, dto);
    return data;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'ลบข้อมูลสุขภาพตามคำค้นหา (ID)' })
  @ApiResponse({ status: 200, description: 'ลบข้อมูลสำเร็จ' })
  async remove(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const data = await this.healthMetricsService.remove(userId, id);
    return data;
  }
}
