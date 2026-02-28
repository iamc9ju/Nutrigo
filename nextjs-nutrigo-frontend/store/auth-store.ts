import { create } from "zustand";
import type { AuthUser } from "@/types/auth";
import api from "@/lib/api";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: AuthUser) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: (user) => set({ user, isAuthenticated: true, isLoading: false }),
  logout: async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      set({ user: null, isAuthenticated: false, isLoading: false });
      window.location.href = "/login";
    }
  },
}));
