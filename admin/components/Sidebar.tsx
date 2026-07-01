"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminAuth } from "../lib/AdminAuthContext";

const LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/words", label: "Words" },
  { href: "/packs", label: "Packs" },
  { href: "/tiles", label: "Tiles" },
  { href: "/qa", label: "Content QA" },
  { href: "/users", label: "Users" },
  { href: "/analytics", label: "Analytics" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAdminAuth();

  if (pathname === "/login" || !user) return null;

  return (
    <nav className="w-56 bg-surface border-r border-border flex flex-col p-4">
      <div className="text-xl font-extrabold text-primary mb-8">LexLoo Admin</div>
      <div className="flex-1 flex flex-col gap-1">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-2 rounded-lg text-sm font-medium ${
              pathname.startsWith(link.href) ? "bg-primary text-white" : "text-textSecondary hover:bg-cardAlt"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <div className="text-xs text-textMuted mb-2">{user.displayName}</div>
      <button onClick={logout} className="text-sm text-danger text-left px-3 py-2 rounded-lg hover:bg-cardAlt">
        Log Out
      </button>
    </nav>
  );
}
