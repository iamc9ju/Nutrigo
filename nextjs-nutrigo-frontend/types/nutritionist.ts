// ─── Nutritionist List Item (from GET /nutritionists) ───
export interface NutritionistListItem {
  nutritionistId: string;
  firstName: string;
  lastName: string;
  licenseNumber: string | null;
  consultationFee: number;
  verificationStatus: string;
  user: { email: string };
  nutritionistSpecialties?: {
    specialty: { specialtyId: number; name: string };
  }[];
  avgRating: number;
  totalReviews: number;
}

// ─── Nutritionist Detail (from GET /nutritionists/:id) ───
export interface NutritionistSchedule {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface NutritionistReview {
  rating: number;
  comment: string | null;
  createdAt: string;
  patient: { firstName: string; lastName: string };
}

export interface NutritionistDetail extends NutritionistListItem {
  nutritionistSchedules: NutritionistSchedule[];
  reviews: NutritionistReview[];
}

// ─── Availability Slot (from GET /nutritionists/:id/availability) ───
export interface TimeSlot {
  time: string;
  available: boolean;
}

// ─── Pagination Meta ───
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface NutritionistListResponse {
  data: NutritionistListItem[];
  meta: PaginationMeta;
}

// ─── Day Names Helper ───
export const DAY_NAMES_TH = [
  "อาทิตย์",
  "จันทร์",
  "อังคาร",
  "พุธ",
  "พฤหัสบดี",
  "ศุกร์",
  "เสาร์",
] as const;
