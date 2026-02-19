import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "@/lib/api";

interface UserBasicInfo {
  userId: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
}

interface AuthState {
  user: UserBasicInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: UserBasicInfo) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      login: (user) => set({ user, isAuthenticated: true }),

      logout: async () => {
        try {
          await api.post("/auth/logout");
        } finally {
          set({ user: null, isAuthenticated: false });
          window.location.href = "/login";
        }
      },
      checkAuth: async () => {
        try {
          const { data } = await api.get("/auth/me");
          set({
            user: {
              userId: data.userId,
              email: data.email,
              role: data.role,
              firstName: data.firstName,
              lastName: data.lastName,
            },
            isAuthenticated: true,
          });
        } catch {
          set({ user: null, isAuthenticated: false });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);
// export const useAuthStore = create<AuthState>((set) => ({
//   user: null,
//   isAuthenticated: false,
//   isLoading: true,

//   login: (user) => {
//     set({ user, isAuthenticated: true });
//   },

//   logout: async () => {
//     try {
//       await api.post("/auth/logout");
//     } catch (error) {
//       console.error("Logout failed", error);
//     } finally {
//       set({ user: null, isAuthenticated: false });
//       window.location.href = "/login";
//     }
//   },

//   checkAuth: async () => {
//     try {
//       set({ isLoading: true });
//       const { data } = await api.get("/patients/profile");

//       set({
//         user: {
//           id: data.userId,
//           ...data,
//         },
//         isAuthenticated: true,
//       });
//     } catch (error) {
//       set({ user: null, isAuthenticated: false });
//     } finally {
//       set({ isLoading: false });
//     }
//   },
// }));
