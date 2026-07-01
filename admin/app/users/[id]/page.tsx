"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AdminGate } from "../../../components/AdminGate";
import { Button, Card, PageHeader, StatCard, Table } from "../../../components/ui";
import { apiRequest } from "../../../lib/api";

interface SupportProfile {
  id: string;
  name: string;
  profileType: string;
  ageRange?: string | null;
  gradeLevel?: string | null;
  activeGoalId?: string | null;
  xp: number;
  level: { current: string; next: string | null; nextXp: number | null };
  streak?: { currentCount: number; longestCount: number; lastActiveDate: string | null } | null;
  scannedCount: number;
  learnedCount: number;
  masteredCount: number;
  savedCount: number;
  badgeCount: number;
  quizCount: number;
  recentActivity: { type: string; label: string; at: string }[];
}

interface SupportUser {
  id: string;
  email: string;
  displayName: string;
  role: string;
  status: string;
  createdAt: string;
  lastLoginAt?: string | null;
  profiles: SupportProfile[];
}

export default function UserDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [user, setUser] = useState<SupportUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const reload = useCallback(() => {
    setError(null);
    apiRequest<SupportUser>(`/admin/users/${params.id}`)
      .then(setUser)
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load user"));
  }, [params.id]);

  useEffect(() => {
    reload();
  }, [reload]);

  async function updateStatus(status: "active" | "disabled") {
    setIsSaving(true);
    setError(null);
    try {
      await apiRequest(`/admin/users/${params.id}/status`, { method: "PATCH", body: { status } });
      reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update account");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AdminGate>
      <PageHeader
        title="User Support"
        action={
          <Button variant="ghost" onClick={() => router.push("/users")}>
            Back to Users
          </Button>
        }
      />

      {error ? <Card className="mb-4 text-danger">{error}</Card> : null}
      {!user ? (
        <Card>Loading user...</Card>
      ) : (
        <>
          <Card className="mb-6">
            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-textPrimary">{user.displayName}</h2>
                <p className="text-textSecondary">{user.email}</p>
                <p className="text-xs text-textMuted mt-2">
                  {user.role} • {user.status} • joined {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2 items-start">
                {user.status === "active" ? (
                  <Button variant="danger" disabled={isSaving} onClick={() => updateStatus("disabled")}>
                    Disable Account
                  </Button>
                ) : (
                  <Button disabled={isSaving} onClick={() => updateStatus("active")}>
                    Reactivate
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {user.profiles.map((profile) => (
            <Card key={profile.id} className="mb-6">
              <div className="flex flex-wrap justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-textPrimary">{profile.name}</h3>
                  <p className="text-sm text-textSecondary">
                    {profile.profileType}
                    {profile.gradeLevel ? ` • ${profile.gradeLevel}` : ""}
                    {profile.ageRange ? ` • ${profile.ageRange}` : ""}
                  </p>
                </div>
                <Link href={`/analytics`} className="text-primary text-sm font-semibold">
                  View Analytics
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                <StatCard label="XP" value={profile.xp.toLocaleString()} />
                <StatCard label="Level" value={profile.level.current} />
                <StatCard label="Streak" value={profile.streak?.currentCount ?? 0} />
                <StatCard label="Badges" value={profile.badgeCount} />
              </div>

              <Table headers={["Metric", "Count"]}>
                <tr>
                  <td className="px-4 py-3 text-textPrimary">Scans</td>
                  <td className="px-4 py-3 text-textSecondary">{profile.scannedCount}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-textPrimary">Words learned</td>
                  <td className="px-4 py-3 text-textSecondary">{profile.learnedCount}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-textPrimary">Words mastered</td>
                  <td className="px-4 py-3 text-textSecondary">{profile.masteredCount}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-textPrimary">Saved words</td>
                  <td className="px-4 py-3 text-textSecondary">{profile.savedCount}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-textPrimary">Completed practice sessions</td>
                  <td className="px-4 py-3 text-textSecondary">{profile.quizCount}</td>
                </tr>
              </Table>

              {profile.recentActivity.length ? (
                <div className="mt-5">
                  <h4 className="text-textPrimary font-bold mb-2">Recent activity</h4>
                  <div className="space-y-2">
                    {profile.recentActivity.map((activity, index) => (
                      <div key={`${activity.type}-${index}`} className="text-sm text-textSecondary">
                        <span className="font-semibold text-textPrimary">{activity.type}</span> {activity.label} • {new Date(activity.at).toLocaleString()}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </Card>
          ))}
        </>
      )}
    </AdminGate>
  );
}
