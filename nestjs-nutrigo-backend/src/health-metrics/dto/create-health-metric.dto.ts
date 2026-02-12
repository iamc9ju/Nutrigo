import { IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateHealthMetricDto {
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(500)
  weightKg?: number;

  @IsNumber()
  @IsOptional()
  @Min(30)
  @Max(300)
  heightCm?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  bodyFatPercent?: number;
}
