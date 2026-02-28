import api from "@/lib/api";

export interface CreateSchedulePayload {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable?: boolean;
}

export interface CreateLeavePayload {
  leaveDate: string;
  isFullDay?: boolean;
  newStartTime?: string;
  newEndTime?: string;
}

export const nutritionistApi = {
  getNutritionists: async (params?: Record<string, any>) => {
    const response = await api.get("/nutritionists", { params });
    return response.data;
  },

  getNutritionistById: async (id: string) => {
    const response = await api.get(`/nutritionists/${id}`);
    return response.data;
  },

  getAvailability: async (id: string, dateStr: string) => {
    const response = await api.get(`/nutritionists/${id}/availability`, {
      params: { date: dateStr },
    });
    return response.data;
  },

  createSchedule: async (scheduleData: CreateSchedulePayload) => {
    const response = await api.post(
      "/nutritionists/me/schedules",
      scheduleData,
    );
    return response.data;
  },

  createLeave: async (leaveData: CreateLeavePayload) => {
    const response = await api.post("/nutritionists/me/leaves", leaveData);
    return response.data;
  },
};
