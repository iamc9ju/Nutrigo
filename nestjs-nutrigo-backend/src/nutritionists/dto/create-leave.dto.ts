import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateLeaveDto {
  @IsDateString()
  leaveDate: string;

  @IsBoolean()
  @IsOptional()
  isFullDay?: boolean;

  @IsString()
  @IsOptional()
  newStartTime?: string;

  @IsString()
  @IsOptional()
  newEndTime?: string;
}
