import {
  IsInt,
  Min,
  Max,
  IsString,
  Matches,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateScheduleDto {
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):?([0-5]\d)$/)
  startTime: string;
  @IsString()
  @Matches(/^([01]\d|2[0-3]):?([0-5]\d)$/)
  endTime: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean = true;
}
