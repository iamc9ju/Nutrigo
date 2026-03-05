import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';
import { Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { JoinRoomDto } from './dto/join-room.dto';
import { SendMessageDto } from './dto/send-message.dto';

interface JwtPayload {
  sub: string;
  role: string;
}

interface AuthenticatedSocket extends Socket {
  user: {
    userId: string;
    role: string;
  };
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  },
  namespace: 'chat',
})
@UsePipes(new ValidationPipe({ transform: true }))
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const authHeader = client.handshake.headers.authorization as
        | string
        | string[]
        | undefined;
      const handshakeToken = client.handshake.auth.token as string | undefined;
      const cookieHeader = client.handshake.headers.cookie;

      let token: string | undefined = handshakeToken;

      if (!token && authHeader) {
        const headerValue = Array.isArray(authHeader)
          ? authHeader[0]
          : authHeader;
        token = headerValue.split(' ')[1];
      }

      // Try extraction from cookie if not found in headers or handshake.auth
      if (!token && cookieHeader) {
        const match = cookieHeader.match(/(^|;)\s*accessToken\s*=\s*([^;]+)/);
        token = match ? match[2] : undefined;
      }

      if (!token) {
        this.logger.error(
          `Connection rejected: No token provided for client ${client.id}`,
        );
        client.disconnect();
        return;
      }

      const decoded = (await this.jwtService.verifyAsync(token)) as unknown;
      const payload = decoded as JwtPayload;
      (client as AuthenticatedSocket).user = {
        userId: payload.sub,
        role: payload.role,
      };

      this.logger.log(
        `✅ Client connected: ${client.id} (User: ${payload.sub})`,
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `❌ Connection failed for ${client.id}: ${errorMessage}`,
      );
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: JoinRoomDto,
  ) {
    const hasAccess = await this.chatService.validateRoomAccess(
      data.chatRoomId,
      client.user.userId,
    );

    if (!hasAccess) {
      client.emit('error', { message: 'You do not have access to this room' });
      return;
    }

    await client.join(data.chatRoomId);
    this.logger.log(
      `User ${client.user.userId} joined room ${data.chatRoomId}`,
    );

    return { status: 'success', roomId: data.chatRoomId };
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: SendMessageDto,
  ) {
    const message = await this.chatService.saveMessage({
      chatRoomId: data.chatRoomId,
      senderId: client.user.userId,
      content: data.content,
      type: data.type,
    });

    // Broadcast to the room
    this.server.to(data.chatRoomId).emit('new_message', message);

    return message;
  }
}
