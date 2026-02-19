// lib/api.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// === Refresh Queue ===
let isRefreshing = false;
let refreshSubscribers: ((success: boolean) => void)[] = [];

// เมื่อ refresh เสร็จ → ปล่อย request ทั้งหมดที่รออยู่
function onRefreshComplete(success: boolean) {
  refreshSubscribers.forEach((callback) => callback(success));
  refreshSubscribers = [];
}

// เพิ่ม request เข้าคิวรอ
function addSubscriber(callback: (success: boolean) => void) {
  refreshSubscribers.push(callback);
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!originalRequest) return Promise.reject(error);

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (
        originalRequest.url?.includes("/auth/refresh") ||
        originalRequest.url?.includes("/auth/login")
      ) {
        return Promise.reject(error);
      }

      // ถ้ามีคนอื่นกำลัง refresh อยู่แล้ว → เข้าคิวรอ
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          addSubscriber((success: boolean) => {
            if (success) {
              resolve(api(originalRequest)); // refresh สำเร็จ → retry
            } else {
              reject(error); // refresh ล้มเหลว → reject
            }
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post("/auth/refresh");
        isRefreshing = false;
        onRefreshComplete(true); // ปล่อย request ทั้งหมดที่รอ
        return api(originalRequest); // retry request เดิม
      } catch (refreshError) {
        isRefreshing = false;
        onRefreshComplete(false); // บอก request ทั้งหมดว่าล้มเหลว
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
