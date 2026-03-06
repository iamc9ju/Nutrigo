export enum MessageType {
  TEXT = "text",
  IMAGE = "image",
  FOOD_CARD = "food_card",
}

export interface ChatMessage {
  chatMessageId: string;
  chatRoomId: string;
  senderId: string;
  message: string;
  type: MessageType;
  createdAt: string;
  status?: "sending" | "sent" | "failed";
  isOptimistic?: boolean;
  sender: {
    email: string;
  };
}

export interface ChatRoom {
  chatRoomId: string;
  appointmentId: string;
  createdAt: string;
  appointment: {
    appointmentId: string;
    startTime: string;
    endTime: string;
    patient: {
      firstName: string;
      lastName: string;
    };
    nutritionist: {
      firstName: string;
      lastName: string;
    };
  };
  messages?: ChatMessage[];
}

export interface ServerToClientEvents {
  new_message: (message: ChatMessage) => void;
  error: (error: { message: string }) => void;
}

export interface ClientToServerEvents {
  join_room: (
    data: { chatRoomId: string },
    callback: (res: { status: string; roomId: string }) => void,
  ) => void;
  send_message: (
    data: { chatRoomId: string; content: string; type: MessageType },
    callback: (res: ChatMessage) => void,
  ) => void;
}
