import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
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

@Controller('nutritionists')
export class NutritionistsController {
  constructor(
    private nutritionistsService: NutritionistsService,
    private nutritionistLeavesService: NutritionistLeavesService,
    private nutritionistSchedulesService: NutritionistSchedulesService,
  ) {}

  @Get()
  async findAll(@Query() query: FindNutritionistsQueryDto) {
    const data = await this.nutritionistsService.findAll(query);
    return data;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.nutritionistsService.findOne(id);
    return data;
  }

  @Get(':id/availability')
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
  @Auth(UserRole.nutritionist)
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
  async createLeave(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateLeaveDto,
  ) {
    const data = await this.nutritionistLeavesService.createLeave(userId, dto);
    return data;
  }
}
