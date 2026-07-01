"use client";

import { useState } from "react";
import { useAdminAuth } from "../../lib/AdminAuthContext";
import { Button, Card } from "../../components/ui";

// Screen 64: Admin Login — separate from the child-facing mobile app, with
// a role check so non-admin accounts are rejected.
export default function LoginPage() {
  const { login } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <h1 className="text-xl font-extrabold text-primary mb-1">LexLoo Admin</h1>
        <p className="text-textSecondary text-sm mb-6">Internal operations access only.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-textSecondary block mb-1">Email</label>
            <input className="w-full" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </div>
          <div>
            <label className="text-xs text-textSecondary block mb-1">Password</label>
            <input className="w-full" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
          </div>
          {error ? <p className="text-danger text-sm">{error}</p> : null}
          <Button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
