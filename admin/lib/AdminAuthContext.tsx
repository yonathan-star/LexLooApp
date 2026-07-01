"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest, setToken } from "./api";

interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  role: string;
}

interface AdminAuthValue {
  user: AdminUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthValue | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiRequest<{ user: AdminUser }>("/auth/me")
      .then((res) => {
        if (res.user.role === "admin") setUser(res.user);
        else setToken(null);
      })
      .catch(() => undefined)
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await apiRequest<{ token: string; user: AdminUser }>("/auth/login", {
        method: "POST",
        body: { email, password },
        auth: false,
      });
      if (result.user.role !== "admin") {
        throw new Error("This account does not have admin access.");
      }
      setToken(result.token);
      setUser(result.user);
      router.push("/dashboard");
    },
    [router]
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    router.push("/login");
  }, [router]);

  const value = useMemo(() => ({ user, isLoading, login, logout }), [user, isLoading, login, logout]);

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth(): AdminAuthValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
