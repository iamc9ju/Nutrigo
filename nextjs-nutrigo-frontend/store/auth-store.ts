import { create } from "zustand";
import api from "@/lib/api";

interface User {
  id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (user: User) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: (user) => {
    set({ user, isAuthenticated: true });
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      set({ user: null, isAuthenticated: false });
      window.location.href = "/login";
    }
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const { data } = await api.get("/patients/profile");

      set({
        user: {
          id: data.userId,
          ...data,
        },
        isAuthenticated: true,
      });
    } catch (error) {
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },
}));
