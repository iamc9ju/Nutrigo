import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface CreateHealthMetricPayload {
  weightKg: number;
  heightCm: number;
  bodyFatPercent?: number;
}

export interface PatientProfile {
  patientId: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  bloodType?: string;
  isProfileComplete?: boolean;
  allergies?: any[];
  chronicDiseases?: string[];
  healthMetrics?: {
    weightKg: number;
    heightCm: number;
    bodyFatPercent?: number;
    recordedAt: string;
  };
}
export const usePatientProfile = () => {
  return useQuery<PatientProfile>({
    queryKey: ["patient-profile"],
    queryFn: async () => {
      const { data } = await api.get("/patients/profile");
      return data;
    },
    enabled: true, // หรือใส่เงื่อนไขให้ดึงเมื่อ Login แล้ว
  });
};

// Hook สำหรับอัปเดตข้อมูล (WRITE) -> อัปเดตเสร็จสั่ง Refetch อัตโนมัติ
export const useUpdateHealthMetrics = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateHealthMetricPayload) => {
      return await api.post("/patients/health-metrics", payload);
    },
    onSuccess: () => {
      // Key นี้สำคัญมาก มันจะไปบอก usePatientProfile ให้ดึงข้อมูลใหม่ทันที
      queryClient.invalidateQueries({ queryKey: ["patient-profile"] });
    },
  });
};
