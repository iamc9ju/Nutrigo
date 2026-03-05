import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { NutritionistsService } from './nutritionists.service';
import { NutritionistLeavesService } from './nutritionist-leaves.service';
import { NutritionistSchedulesService } from './nutritionist-schedules.service';
import { FindNutritionistsQueryDto } from './dto/find-nutritionists-query.dto';
import { GetAvailabilityDto } from './dto/get-availability.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Nutritionists')
@Controller('nutritionists')
export class NutritionistsController {
  constructor(
    private nutritionistsService: NutritionistsService,
    private nutritionistLeavesService: NutritionistLeavesService,
    private nutritionistSchedulesService: NutritionistSchedulesService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'ค้นหานักโภชนาการ (สามารถกรอง กรองเรียงลำดับ ได้)' })
  @ApiResponse({
    status: 200,
    description: 'ค้นหาสำเร็จ คืนค่ารายการนักโภชนาการพร้อม pagination',
  })
  async findAll(@Query() query: FindNutritionistsQueryDto) {
    const data = await this.nutritionistsService.findAll(query);
    return data;
  }

  @Get(':id')
  @ApiOperation({ summary: 'ดึงข้อมูลนักโภชนาการตาม ID พร้อมรีวิวและบริการ' })
  @ApiResponse({ status: 200, description: 'ดึงข้อมูลสำเร็จ' })
  @ApiResponse({ status: 404, description: 'ไม่พบนักโภชนาการ' })
  async findOne(@Param('id') id: string) {
    const data = await this.nutritionistsService.findOne(id);
    return data;
  }

  @Get(':id/availability')
  @ApiOperation({ summary: 'ดูเวลาที่เปิดรับจอง (Availability) ในวันที่กำหนด' })
  @ApiResponse({
    status: 200,
    description: 'คืนค่าช่วงเวลาที่ว่างสำหรับการจอง',
  })
  async getAvailability(
    @Param('id') id: string,
    @Query() query: GetAvailabilityDto,
  ) {
    const data = await this.nutritionistsService.getAvailability(
      id,
      query.date,
    );
    return data;
  }

  @Post('me/schedules')
  @ApiBearerAuth()
  @Auth(UserRole.nutritionist)
  @ApiOperation({ summary: 'เพิ่มเวลาทำงาน (เฉพาะนักโภชนาการ)' })
  @ApiResponse({ status: 201, description: 'เพิ่มเวลาทำงานสำเร็จ' })
  @ApiResponse({
    status: 403,
    description: 'ไม่มีสิทธิ์เข้าถึง (ต้องเป็น Nutritionist)',
  })
  async createScheudle(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateScheduleDto,
  ) {
    const data = await this.nutritionistSchedulesService.createSchedule(
      userId,
      dto,
    );
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Post('me/leaves')
  @ApiBearerAuth()
  @Auth(UserRole.nutritionist)
  @ApiOperation({ summary: 'เพิ่มวันลา/เวลาที่ลางาน (เฉพาะนักโภชนาการ)' })
  @ApiResponse({ status: 201, description: 'บันทึกวันลาสำเร็จ' })
  @ApiResponse({
    status: 403,
    description: 'ไม่มีสิทธิ์เข้าถึง (ต้องเป็น Nutritionist)',
  })
  async createLeave(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateLeaveDto,
  ) {
    const data = await this.nutritionistLeavesService.createLeave(userId, dto);
    return data;
  }
}
