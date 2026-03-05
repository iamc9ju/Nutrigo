import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MessageType, AppointmentStatus } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async validateRoomAccess(
    chatRoomId: string,
    userId: string,
  ): Promise<boolean> {
    const room = await this.prisma.chatRoom.findUnique({
      where: { chatRoomId },
      include: {
        appointment: {
          select: {
            patientId: true,
            nutritionist: {
              select: { userId: true },
            },
            patient: {
              select: { userId: true },
            },
          },
        },
      },
    });

    if (!room || !room.appointment) return false;

    return (
      room.appointment.patient.userId === userId ||
      room.appointment.nutritionist.userId === userId
    );
  }

  async saveMessage(data: {
    chatRoomId: string;
    senderId: string;
    content: string;
    type: MessageType;
  }) {
    return this.prisma.chatMessage.create({
      data: {
        chatRoomId: data.chatRoomId,
        senderId: data.senderId,
        message: data.content,
        type: data.type,
      },
      include: {
        sender: {
          select: {
            email: true,
          },
        },
      },
    });
  }

  async getMessages(chatRoomId: string, limit = 50, offset = 0) {
    return this.prisma.chatMessage.findMany({
      where: { chatRoomId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      include: {
        sender: {
          select: {
            email: true,
          },
        },
      },
    });
  }

  async getMyChatRooms(userId: string) {
    return this.prisma.chatRoom.findMany({
      where: {
        appointment: {
          OR: [{ patient: { userId } }, { nutritionist: { userId } }],
          status: AppointmentStatus.confirmed,
        },
      },
      include: {
        appointment: {
          select: {
            appointmentId: true,
            startTime: true,
            endTime: true,
            patient: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
            nutritionist: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
  }
}
