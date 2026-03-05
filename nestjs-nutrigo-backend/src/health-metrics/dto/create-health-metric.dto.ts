import { IsNumber, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHealthMetricDto {
  @ApiProperty({
    description: 'น้ำหนัก (กิโลกรัม)',
    example: 65.5,
    required: false,
    minimum: 1,
    maximum: 500,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(500)
  weightKg?: number;

  @ApiProperty({
    description: 'ส่วนสูง (เซนติเมตร)',
    example: 170,
    required: false,
    minimum: 30,
    maximum: 300,
  })
  @IsNumber()
  @IsOptional()
  @Min(30)
  @Max(300)
  heightCm?: number;

  @ApiProperty({
    description: 'เปอร์เซ็นต์ไขมันในร่างกาย (%)',
    example: 18.5,
    required: false,
    minimum: 1,
    maximum: 100,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  bodyFatPercent?: number;
}
