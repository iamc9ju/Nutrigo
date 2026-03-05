import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PatientsService } from './patients.service';
import { CompleteProfileDto } from './dto/complete-profile.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Patients')
@ApiBearerAuth()
@Controller('patients')
@Auth(UserRole.patient)
export class PatientsController {
  constructor(private patientsService: PatientsService) {}

  @Post('complete-profile')
  @ApiOperation({ summary: 'เพิ่มข้อมูลส่วนตัวของคนไข้ให้สมบูรณ์' })
  @ApiResponse({ status: 201, description: 'บันทึกข้อมูลสำเร็จ' })
  async completeProfile(
    @Body() dto: CompleteProfileDto,
    @CurrentUser('sub') userId: string,
  ) {
    const data = await this.patientsService.completeProfile(userId, dto);
    return data;
  }

  @Get('profile')
  @ApiOperation({ summary: 'ดึงข้อมูลโปรไฟล์ของคนไข้' })
  @ApiResponse({ status: 200, description: 'ดึงข้อมูลโปรไฟล์สำเร็จ' })
  async getProfile(@CurrentUser('sub') userId: string) {
    const data = await this.patientsService.getProfile(userId);
    return data;
  }
}
