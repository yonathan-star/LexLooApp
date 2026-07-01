"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminGate } from "../../components/AdminGate";
import { PageHeader, Table } from "../../components/ui";
import { apiRequest } from "../../lib/api";

interface UserRow {
  id: string;
  email: string;
  displayName: string;
  role: string;
  status: string;
  profiles: { name: string; profileType: string }[];
}

// Screen 74: Admin User Search — support tool with privacy controls (no
// raw progress dump, just identity + profile summary).
export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<UserRow[]>([]);

  useEffect(() => {
    apiRequest<UserRow[]>(`/admin/users?search=${encodeURIComponent(search)}`).then(setUsers).catch(() => undefined);
  }, [search]);

  return (
    <AdminGate>
      <PageHeader title="Users" />
      <input className="w-full max-w-sm mb-4" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} />
      <Table headers={["Name", "Email", "Role", "Status", "Profiles", ""]}>
        {users.map((u) => (
          <tr key={u.id}>
            <td className="px-4 py-3 text-textPrimary font-medium">{u.displayName}</td>
            <td className="px-4 py-3 text-textSecondary">{u.email}</td>
            <td className="px-4 py-3 text-textSecondary">{u.role}</td>
            <td className="px-4 py-3 text-textSecondary">{u.status}</td>
            <td className="px-4 py-3 text-textSecondary">{u.profiles.map((p) => p.name).join(", ")}</td>
            <td className="px-4 py-3">
              <Link href={`/users/${u.id}`} className="text-primary text-sm font-semibold">
                Open
              </Link>
            </td>
          </tr>
        ))}
      </Table>
    </AdminGate>
  );
}
