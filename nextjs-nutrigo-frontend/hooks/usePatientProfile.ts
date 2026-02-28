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
      return data.data;
    },
    enabled: true,
  });
};

export const useUpdateHealthMetrics = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateHealthMetricPayload) => {
      return await api.post("/patients/health-metrics", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient-profile"] });
    },
  });
};
