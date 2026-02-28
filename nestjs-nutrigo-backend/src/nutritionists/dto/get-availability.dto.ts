import { IsString, IsNotEmpty } from 'class-validator';

export class GetAvailabilityDto {
  @IsString()
  @IsNotEmpty()
  date: string;
}
