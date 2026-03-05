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

  setRooms: (rooms) => set({ rooms }),

  setActiveRoom: (activeRoomId) => set({ activeRoomId }),

  addMessage: (roomId, message) =>
    set((state) => {
      const roomMessages = state.messages[roomId] || [];
      // ป้องกันข้อความซ้ำ
      if (roomMessages.find((m) => m.chatMessageId === message.chatMessageId)) {
        return state;
      }
      return {
        messages: {
          ...state.messages,
          [roomId]: [...roomMessages, message].sort(
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
