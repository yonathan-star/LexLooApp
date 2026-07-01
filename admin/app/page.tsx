"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "../lib/AdminAuthContext";

export default function Home() {
  const { user, isLoading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    router.replace(user ? "/dashboard" : "/login");
  }, [isLoading, user, router]);

  return <div className="text-textSecondary">Loading...</div>;
}
