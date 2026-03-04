import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Appointments')
@ApiBearerAuth()
@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @Auth('patient')
  @ApiOperation({
    summary: 'สร้างการนัดหมายใหม่',
    description:
      'ให้คนไข้จองคิวกับนักโภชนาการ และคืนค่า Stripe client secret สำหรับการชำระเงิน',
  })
  @ApiResponse({
    status: 201,
    description: 'สร้างการนัดหมายสำเร็จ คืนค่า Payment Intent client secret',
  })
  @ApiResponse({
    status: 400,
    description:
      'ข้อมูลไม่ถูกต้อง (เช่น จองเวลาย้อนหลัง, นอกเวลาทำการ, หรือนักโภชนาการลา)',
  })
  @ApiResponse({
    status: 403,
    description: 'ไม่อนุญาต (โปรไฟล์คนไข้ยังไม่สมบูรณ์)',
  })
  @ApiResponse({
    status: 404,
    description: 'ไม่พบนักโภชนาการ หรือยังไม่ได้รับการอนุมัติ',
  })
  @ApiResponse({ status: 409, description: 'เวลาที่เลือกถูกจองไปแล้ว' })
  async create(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateAppointmentDto,
  ) {
    return this.appointmentsService.create(userId, dto);
  }

  @Get('me')
  @Auth('patient')
  @ApiOperation({ summary: 'ดึงข้อมูลการนัดหมายทั้งหมดของคนไข้' })
  @ApiResponse({ status: 200, description: 'ดึงข้อมูลการนัดหมายสำเร็จ' })
  async findAll(@CurrentUser('sub') userId: string) {
    return this.appointmentsService.findAllForPatient(userId);
  }

  @Get(':id')
  @Auth('patient', 'nutritionist')
  @ApiOperation({ summary: 'ดึงข้อมูลการนัดหมายตาม ID' })
  @ApiResponse({ status: 200, description: 'ดึงข้อมูลการนัดหมายสำเร็จ' })
  @ApiResponse({ status: 404, description: 'ไม่พบการนัดหมาย' })
  async findOne(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.appointmentsService.findOne(id, userId);
  }
}
