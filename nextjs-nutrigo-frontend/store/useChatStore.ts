import { create } from "zustand";
import { ChatRoom, ChatMessage } from "@/types/chat";

interface ChatState {
  rooms: ChatRoom[];
  activeRoomId: string | null;
  messages: Record<string, ChatMessage[]>;
  isLoading: boolean;

  setRooms: (rooms: ChatRoom[]) => void;
  setActiveRoom: (roomId: string | null) => void;
  addMessage: (roomId: string, message: ChatMessage) => void;
  setMessages: (roomId: string, messages: ChatMessage[]) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  rooms: [],
  activeRoomId: null,
  messages: {},
  isLoading: false,

  setRooms: (rooms) =>
    set((state) => {
      const newMessages = { ...state.messages };
      rooms.forEach((room) => {
        if (room.messages) {
          newMessages[room.chatRoomId] = room.messages.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          );
        }
      });
      return { rooms, messages: newMessages };
    }),

  setActiveRoom: (activeRoomId) => set({ activeRoomId }),

  addMessage: (roomId, message) =>
    set((state) => {
      const roomMessages = state.messages[roomId] || [];

      // Check for existing optimistic message to replace or prevent duplicates
      const existingMessageIndex = roomMessages.findIndex((m) => {
        // Match by ID if it's already a real message
        if (m.chatMessageId === message.chatMessageId) return true;

        // Match by content and sender if it's an optimistic message and we are receiving the real one
        if (
          m.isOptimistic &&
          !message.isOptimistic &&
          m.message === message.message &&
          m.senderId === message.senderId
        ) {
          return true;
        }

        return false;
      });

      let newMessages;
      if (existingMessageIndex !== -1) {
        // Replace optimistic message with real message or update
        newMessages = [...roomMessages];
        newMessages[existingMessageIndex] = message;
      } else {
        // Add new message
        newMessages = [...roomMessages, message];
      }

      return {
        messages: {
          ...state.messages,
          [roomId]: newMessages.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          ),
        },
      };
    }),

  setMessages: (roomId, messages) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [roomId]: messages.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        ),
      },
    })),

  setLoading: (isLoading) => set({ isLoading }),
}));
