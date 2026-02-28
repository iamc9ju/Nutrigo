export interface AuthUser {
  userId: string;
  email: string;
  role: "patient" | "nutritionist" | "admin";
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}
