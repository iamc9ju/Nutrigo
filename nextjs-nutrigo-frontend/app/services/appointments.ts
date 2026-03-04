import api from "@/lib/api";

export interface CreateAppointmentDto {
  nutritionistId: string;
  startTime: string; // ISO 8601 format
  type: "online" | "onsite";
}

export const appointmentsApi = {
  create: async (dto: CreateAppointmentDto) => {
    const response = await api.post("/appointments", dto);
    return response.data;
  },

  getMyAppointments: async () => {
    const response = await api.get("/appointments/me");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },
};
