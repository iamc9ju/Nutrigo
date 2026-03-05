import api from "@/lib/api";
import { ChatRoom, ChatMessage } from "@/types/chat";
import type { ApiResponse } from "@nutrigo/shared";

export const chatApi = {
  /**
   * ดึงรายการห้องแชททั้งหมดของผู้ใช้ปัจจุบัน
   */
  getRooms: async (): Promise<ChatRoom[]> => {
    const response = await api.get<ApiResponse<ChatRoom[]>>("/chat/rooms");
    return response.data.data;
  },

  /**
   * ดึงประวัติข้อความในห้องแชทที่ระบุ
   */
  getMessages: async (
    roomId: string,
    limit = 50,
    offset = 0,
  ): Promise<ChatMessage[]> => {
    const response = await api.get<ApiResponse<ChatMessage[]>>(
      `/chat/${roomId}/messages`,
      {
        params: { limit, offset },
      },
    );
    return response.data.data;
  },
};
