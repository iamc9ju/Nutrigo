import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  ForbiddenException,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('rooms')
  @ApiOperation({ summary: 'รายการห้องแชททั้งหมดของผู้ใช้' })
  @ApiResponse({ status: 200, description: 'คืนค่ารายการห้องแชทที่เกี่ยวข้อง' })
  async getMyRooms(@CurrentUser('sub') userId: string) {
    return this.chatService.getMyChatRooms(userId);
  }

  @Get(':chatRoomId/messages')
  @ApiOperation({ summary: 'ดึงประวัติข้อความในห้องแชท' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'คืนค่ารายการข้อความ' })
  @ApiResponse({
    status: 403,
    description: 'ผู้ใช้ไม่มีสิทธิ์เข้าถึงห้องแชทนี้',
  })
  async getMessages(
    @Param('chatRoomId') chatRoomId: string,
    @CurrentUser('sub') userId: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
  ) {
    const hasAccess = await this.chatService.validateRoomAccess(
      chatRoomId,
      userId,
    );

    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this chat room');
    }

    return this.chatService.getMessages(chatRoomId, limit || 50, offset || 0);
  }
}
