import { IsUUID, IsISO8601, IsEnum, IsNotEmpty } from 'class-validator';
import { AppointmentType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({
    description: 'รหัส UUID ของนักโภชนาการที่ต้องการจอง',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'Invalid Nutritionist ID format' })
  @IsNotEmpty()
  nutritionistId: string;

  @ApiProperty({
    description: 'เวลาที่ต้องการเริ่มนัดหมายในรูปแบบ ISO 8601',
    example: '2026-03-05T10:00:00Z',
  })
  @IsISO8601({ strict: true })
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({
    description: 'ประเภทของการนัดหมาย (เช่น online)',
    enum: AppointmentType,
    example: AppointmentType.online,
  })
  @IsEnum(AppointmentType)
  @IsNotEmpty()
  type: AppointmentType;
}
