import { useState } from "react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import axios from "axios";
import type { ApiResponse, AuthUser } from "@nutrigo/shared";

interface ApiErrorResponse {
  message: string;
  error?: string;
  statusCode?: number;
}

interface RegisterResponse {
  message: string;
  userId: string;
}

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const handleAxiosError = (err: unknown, defaultMessage: string) => {
    let message = defaultMessage;
    if (axios.isAxiosError<ApiErrorResponse>(err)) {
      message = err.response?.data?.message || err.message || message;
    } else if (err instanceof Error) {
      message = err.message;
    }
    setError(message);
    return message;
  };

  const loginUser = async (
    data: Record<string, string>,
    rememberMe: boolean,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await api.post<ApiResponse<AuthUser>>("/auth/login", {
        email: data.email,
        password: data.password,
      });

      if (res.data != null) {
        await Swal.fire({
          icon: "success",
          title: "เข้าสู่ระบบสำเร็จ!",
          text: "ยินดีต้อนรับเข้าสู่ระบบ",
          timer: 1500,
          showConfirmButton: false,
          color: "#3d3522",
          confirmButtonColor: "#C6E065",
        });
      }

      login(res.data.data);

      if (rememberMe) {
        localStorage.setItem("savedEmail", data.email);
      } else {
        localStorage.removeItem("savedEmail");
      }

      router.push("/dashboard");
    } catch (err) {
      const message = handleAxiosError(
        err,
        "เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง",
      );
      await Swal.fire({
        icon: "error",
        title: "เข้าสู่ระบบไม่สำเร็จ",
        text: message,
        confirmButtonText: "ลองใหม่",
        color: "#3d3522",
        confirmButtonColor: "#3d3522",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const registerUser = async (
    payload: Omit<Record<string, any>, "confirmPassword">,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      await api.post<RegisterResponse>("/auth/register", payload);
      await Swal.fire({
        icon: "success",
        title: "สมัครสมาชิกสำเร็จ!",
        text: "ยินดีต้อนรับสมาชิกใหม่ของเรา",
        timer: 1500,
        showConfirmButton: false,
        color: "#3d3522",
        confirmButtonColor: "#C6E065",
      });
      router.push("/login?registered=true");
    } catch (err) {
      handleAxiosError(err, "สมัครสมาชิกไม่สำเร็จ");
    } finally {
      setIsLoading(false);
    }
  };

  return { loginUser, registerUser, isLoading, error, setError };
};
