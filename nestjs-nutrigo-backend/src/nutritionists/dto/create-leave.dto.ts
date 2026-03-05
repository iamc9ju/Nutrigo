import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLeaveDto {
  @ApiProperty({
    description: 'วันที่ลางาน',
    example: '2024-05-20',
  })
  @IsDateString()
  leaveDate: string;

  @ApiProperty({
    description: 'ลาเต็มวันหรือไม่',
    example: true,
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isFullDay?: boolean;

  @ApiProperty({
    description: 'เวลาเริ่มต้นที่ลา (ถ้าไม่ได้ลาเต็มวัน)',
    example: '09:00',
    required: false,
  })
  @IsString()
  @IsOptional()
  newStartTime?: string;

  @ApiProperty({
    description: 'เวลาสิ้นสุดที่ลา (ถ้าไม่ได้ลาเต็มวัน)',
    example: '12:00',
    required: false,
  })
  @IsString()
  @IsOptional()
  newEndTime?: string;
}
