"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "../lib/AdminAuthContext";

export function AdminGate({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.replace("/login");
  }, [isLoading, user, router]);

  if (isLoading) return <div className="text-textSecondary">Loading...</div>;
  if (!user) return null;
  return <>{children}</>;
}
