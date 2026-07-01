"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminGate } from "../../components/AdminGate";
import { PageHeader, StatCard, Card, Button } from "../../components/ui";
import { apiRequest } from "../../lib/api";

interface Overview {
  userCount: number;
  wordCount: number;
  packCount: number;
  tileCount: number;
  scanCount: number;
  scanErrors: number;
}

// Screen 65: Admin Dashboard — operations overview: users, words, packs,
// tile scans, errors.
export default function DashboardPage() {
  const [overview, setOverview] = useState<Overview | null>(null);

  useEffect(() => {
    apiRequest<Overview>("/admin/overview").then(setOverview).catch(() => undefined);
  }, []);

  return (
    <AdminGate>
      <PageHeader title="Dashboard" />
      <div className="flex flex-wrap gap-4 mb-8">
        <StatCard label="Users" value={overview?.userCount ?? "-"} />
        <StatCard label="Words" value={overview?.wordCount ?? "-"} />
        <StatCard label="Packs" value={overview?.packCount ?? "-"} />
        <StatCard label="Tiles" value={overview?.tileCount ?? "-"} />
        <StatCard label="Scans" value={overview?.scanCount ?? "-"} />
        <StatCard label="Scan Errors" value={overview?.scanErrors ?? "-"} />
      </div>

      <Card>
        <h2 className="text-lg font-bold text-textPrimary mb-3">Manage Content</h2>
        <div className="flex gap-3 flex-wrap">
          <Link href="/words"><Button>Words</Button></Link>
          <Link href="/packs"><Button variant="ghost">Packs</Button></Link>
          <Link href="/tiles"><Button variant="ghost">Tiles</Button></Link>
          <Link href="/qa"><Button variant="ghost">Content QA</Button></Link>
        </div>
      </Card>
    </AdminGate>
  );
}
