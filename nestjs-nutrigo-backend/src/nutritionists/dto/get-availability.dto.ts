import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetAvailabilityDto {
  @ApiProperty({
    description: 'วันที่ต้องการดูเวลาว่าง (YYYY-MM-DD)',
    example: '2024-05-20',
  })
  @IsString()
  @IsNotEmpty()
  date: string;
}
