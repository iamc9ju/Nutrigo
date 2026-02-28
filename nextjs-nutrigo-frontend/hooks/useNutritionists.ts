import { useQuery } from "@tanstack/react-query";
import { nutritionistApi } from "@/app/services/nutritionists";

export const useNutritionistAvailability = (
  nutritionistId: string,
  date: string,
) => {
  return useQuery({
    queryKey: ["nutritionist-availability", nutritionistId, date],
    queryFn: () => nutritionistApi.getAvailability(nutritionistId, date),
    enabled: !!nutritionistId && !!date,
    staleTime: 1000 * 60 * 5,
  });
};
