import {
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class OmiseWebhookDataDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsOptional()
  object?: string;
}

export class OmiseWebhookDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @ValidateNested()
  @IsNotEmpty()
  @Type(() => OmiseWebhookDataDto)
  data: OmiseWebhookDataDto;
}
