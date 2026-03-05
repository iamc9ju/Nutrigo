import { IsString, IsUUID, IsEnum, IsNotEmpty } from 'class-validator';
import { MessageType } from '@prisma/client';

export class SendMessageDto {
  @IsUUID()
  chatRoomId: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(MessageType)
  type: MessageType = MessageType.text;
}
