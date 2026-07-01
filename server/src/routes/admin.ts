import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, requireRole } from "../lib/auth";
import { ok, fail } from "../lib/respond";
import { getLevelForXp, getXpTotal } from "../services/gamification";
import { writeAudit } from "../services/audit";

export const adminRouter = Router();
adminRouter.use(requireAuth, requireRole("admin"));

// Screen 65: Admin Dashboard — operations overview.
adminRouter.get("/overview", async (_req, res) => {
  const [userCount, wordCount, packCount, tileCount, scanCount, scanErrors] = await Promise.all([
    prisma.user.count(),
    prisma.word.count(),
    prisma.wordPack.count(),
    prisma.tile.count(),
    prisma.scanEvent.count(),
    prisma.scanEvent.count({ where: { result: { not: "success" } } }),
  ]);
  return ok(res, { userCount, wordCount, packCount, tileCount, scanCount, scanErrors });
});

// Screen 74: Admin User Search.
adminRouter.get("/users", async (req, res) => {
  const search = (req.query.search as string) || "";
  const users = await prisma.user.findMany({
    where: search ? { OR: [{ email: { contains: search } }, { displayName: { contains: search } }] } : {},
    include: { profiles: true },
    take: 100,
    orderBy: { createdAt: "desc" },
  });
  return ok(res, users.map((u) => ({ id: u.id, email: u.email, displayName: u.displayName, role: u.role, status: u.status, profiles: u.profiles })));
});

// Screen 74: Admin User Detail — support-safe progress summary. This avoids
// raw quiz answers or private event dumps while still giving support enough
// context to help a parent or learner.
adminRouter.get("/users/:id", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
    include: { profiles: true },
  });
  if (!user) return fail(res, 404, "User not found");

  const profiles = await Promise.all(
    user.profiles.map(async (profile) => {
      const [xp, streak, scannedCount, learnedCount, masteredCount, savedCount, badgeCount, quizCount, lastScan, lastPractice] =
        await Promise.all([
          getXpTotal(profile.id),
          prisma.streak.findUnique({ where: { profileId: profile.id } }),
          prisma.scanEvent.count({ where: { profileId: profile.id, result: "success" } }),
          prisma.userWordProgress.count({ where: { profileId: profile.id, status: { in: ["learned", "mastered"] } } }),
          prisma.userWordProgress.count({ where: { profileId: profile.id, status: "mastered" } }),
          prisma.savedWord.count({ where: { profileId: profile.id } }),
          prisma.userBadge.count({ where: { profileId: profile.id } }),
          prisma.quizSession.count({ where: { profileId: profile.id, completedAt: { not: null } } }),
          prisma.scanEvent.findFirst({ where: { profileId: profile.id }, orderBy: { scannedAt: "desc" }, include: { word: true } }),
          prisma.quizSession.findFirst({ where: { profileId: profile.id }, orderBy: { startedAt: "desc" } }),
        ]);

      return {
        id: profile.id,
        name: profile.name,
        profileType: profile.profileType,
        ageRange: profile.ageRange,
        gradeLevel: profile.gradeLevel,
        activeGoalId: profile.activeGoalId,
        xp,
        level: getLevelForXp(xp),
        streak,
        scannedCount,
        learnedCount,
        masteredCount,
        savedCount,
        badgeCount,
        quizCount,
        recentActivity: [
          lastScan ? { type: "scan", label: lastScan.word?.text ?? "Tile scan", at: lastScan.scannedAt } : null,
          lastPractice ? { type: "practice", label: lastPractice.activityType, at: lastPractice.startedAt } : null,
        ].filter(Boolean),
      };
    })
  );

  await writeAudit(req.auth!.userId, "support_view", "user", user.id, null, { profileCount: profiles.length });
  return ok(res, {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt,
    profiles,
  });
});

const userStatusSchema = z.object({
  status: z.enum(["active", "disabled"]),
});

adminRouter.patch("/users/:id/status", async (req, res) => {
  const parsed = userStatusSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid status");

  const before = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!before) return fail(res, 404, "User not found");
  if (before.role === "admin" && before.id === req.auth!.userId && parsed.data.status !== "active") {
    return fail(res, 400, "You cannot disable your own admin account");
  }

  const updated = await prisma.user.update({
    where: { id: before.id },
    data: { status: parsed.data.status },
  });
  await writeAudit(req.auth!.userId, "update_status", "user", updated.id, { status: before.status }, { status: updated.status });
  return ok(res, { id: updated.id, status: updated.status });
});

// Screen 73: Admin Analytics — basic charts data.
adminRouter.get("/analytics", async (_req, res) => {
  const since = new Date();
  since.setDate(since.getDate() - 30);
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [events, scansByDay, activeLearners, firstScans, sevenDayStreaks, completedWords, invalidScans, practiceSessions] = await Promise.all([
    prisma.analyticsEvent.groupBy({ by: ["eventName"], _count: { eventName: true }, where: { createdAt: { gte: since } } }),
    prisma.scanEvent.findMany({ where: { scannedAt: { gte: since } }, select: { scannedAt: true, result: true } }),
    prisma.analyticsEvent.findMany({
      where: { createdAt: { gte: since }, profileId: { not: null } },
      distinct: ["profileId"],
      select: { profileId: true },
    }),
    prisma.scanEvent.groupBy({
      by: ["profileId"],
      _min: { scannedAt: true },
      where: { result: "success" },
    }),
    prisma.streak.count({ where: { currentCount: { gte: 7 } } }),
    prisma.userWordProgress.count({ where: { status: { in: ["learned", "mastered"] }, lastSeenAt: { gte: since } } }),
    prisma.scanEvent.count({ where: { result: { not: "success" }, scannedAt: { gte: since } } }),
    prisma.quizSession.count({ where: { completedAt: { gte: since } } }),
  ]);

  const byDay: Record<string, number> = {};
  for (const scan of scansByDay) {
    const key = scan.scannedAt.toISOString().slice(0, 10);
    byDay[key] = (byDay[key] ?? 0) + 1;
  }

  return ok(res, {
    kpis: {
      activeLearners: activeLearners.length,
      firstScans: firstScans.filter((scan) => scan._min.scannedAt && scan._min.scannedAt >= since).length,
      sevenDayStreaks,
      completedWords,
      invalidScans,
      practiceSessions,
      scanToPracticeRate: scansByDay.length ? Math.round((practiceSessions / scansByDay.length) * 100) : 0,
    },
    eventCounts: events.map((e) => ({ eventName: e.eventName, count: e._count.eventName })),
    scansByDay: Object.entries(byDay).map(([date, count]) => ({ date, count })),
  });
});

adminRouter.get("/audit-logs", async (_req, res) => {
  const logs = await prisma.adminAuditLog.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  return ok(res, logs);
});
