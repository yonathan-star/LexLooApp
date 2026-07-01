"use client";

import React from "react";

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-card border border-border rounded-xl p-5 ${className}`}>{children}</div>;
}

export function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  const variantClass = {
    primary: "bg-primary text-white hover:opacity-90",
    secondary: "bg-accent text-white hover:opacity-90",
    ghost: "bg-transparent border border-primary text-primary hover:bg-cardAlt",
    danger: "bg-danger text-white hover:opacity-90",
  }[variant];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-full font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed ${variantClass} ${className}`}
    >
      {children}
    </button>
  );
}

export function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card className="flex-1 min-w-[140px]">
      <div className="text-2xl font-extrabold text-textPrimary">{value}</div>
      <div className="text-xs text-textSecondary mt-1">{label}</div>
    </Card>
  );
}

export function PageHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-extrabold text-textPrimary">{title}</h1>
      {action}
    </div>
  );
}

export function Table({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="bg-surface text-textSecondary text-left">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">{children}</tbody>
      </table>
    </div>
  );
}
