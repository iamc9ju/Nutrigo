"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import type { AuthUser } from "@/types/auth";

export default function AuthInitializer({ user }: { user: AuthUser | null }) {
  useEffect(() => {
    useAuthStore.setState({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    });
  }, [user]);

  return null;
}
