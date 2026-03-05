import {
  IsInt,
  Min,
  Max,
  IsString,
  Matches,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateScheduleDto {
  @ApiProperty({
    description: 'วันในสัปดาห์ (0 = วันอาทิตย์, 6 = วันเสาร์)',
    example: 1,
    minimum: 0,
    maximum: 6,
  })
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @ApiProperty({
    description: 'เวลาเริ่มต้น (HH:mm)',
    example: '09:00',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):?([0-5]\d)$/)
  startTime: string;

  @ApiProperty({
    description: 'เวลาสิ้นสุด (HH:mm)',
    example: '17:00',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):?([0-5]\d)$/)
  endTime: string;

  @ApiProperty({
    description: 'เปิดรับงานในเวลานี้หรือไม่',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean = true;
}
