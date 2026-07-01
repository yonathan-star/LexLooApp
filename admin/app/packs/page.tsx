"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminGate } from "../../components/AdminGate";
import { PageHeader, Table, Button } from "../../components/ui";
import { apiRequest } from "../../lib/api";

interface PackRow {
  id: string;
  name: string;
  level?: string | null;
  status: string;
  language: { name: string };
  _count: { packWords: number };
}

// Screen 68: Admin Pack List — pack name, language, level, status.
export default function PacksPage() {
  const [packs, setPacks] = useState<PackRow[]>([]);

  useEffect(() => {
    apiRequest<PackRow[]>("/packs").then(setPacks).catch(() => undefined);
  }, []);

  return (
    <AdminGate>
      <PageHeader
        title="Packs"
        action={
          <Link href="/packs/new">
            <Button>Create Pack</Button>
          </Link>
        }
      />
      <Table headers={["Name", "Language", "Level", "Words", "Status", ""]}>
        {packs.map((p) => (
          <tr key={p.id}>
            <td className="px-4 py-3 text-textPrimary font-medium">{p.name}</td>
            <td className="px-4 py-3 text-textSecondary">{p.language?.name}</td>
            <td className="px-4 py-3 text-textSecondary">{p.level}</td>
            <td className="px-4 py-3 text-textSecondary">{p._count?.packWords ?? 0}</td>
            <td className="px-4 py-3">
              <span className={`text-xs px-2 py-1 rounded-full ${p.status === "published" ? "bg-success/20 text-success" : "bg-cardAlt text-textMuted"}`}>
                {p.status}
              </span>
            </td>
            <td className="px-4 py-3">
              <Link href={`/packs/${p.id}`} className="text-primary text-sm font-semibold">
                Edit
              </Link>
            </td>
          </tr>
        ))}
      </Table>
    </AdminGate>
  );
}
