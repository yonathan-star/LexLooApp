import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../lib/auth";
import { ok, fail } from "../lib/respond";
import { canAccessProfile } from "./profiles";
import { trackEvent } from "../services/analytics";
import { awardXp, evaluateBadges, getXpTotal, getLevelForXp, recordStreakActivity } from "../services/gamification";

export const progressRouter = Router();

// Screens 11/12: Wear of the Day / Word of the Day — recommends an unseen or
// weak word from the user's active goal pack, falling back to any published
// pack if no goal is set yet. Deterministic for MVP; AI Coach (AI Roadmap 10)
// can replace this logic later without changing the response shape.
progressRouter.get("/recommendations", requireAuth, async (req, res) => {
  const profileId = req.query.profileId as string;
  if (!profileId) return fail(res, 400, "profileId is required");
  const hasAccess = await canAccessProfile(req.auth!.userId, req.auth!.role, profileId);
  if (!hasAccess) return fail(res, 403, "You don't have access to this profile");

  const profile = await prisma.profile.findUnique({ where: { id: profileId } });
  const goalPack = profile?.activeGoalId
    ? await prisma.wordPack.findUnique({ where: { slug: profile.activeGoalId } })
    : null;
  const pack = goalPack ?? (await prisma.wordPack.findFirst({ where: { status: "published" } }));

  if (!pack) return ok(res, { wearOfDay: null, wordOfDay: null });

  const packWords = await prisma.packWord.findMany({
    where: { packId: pack.id },
    include: { word: { include: { content: true, examples: true, progress: { where: { profileId } } } } },
    orderBy: { displayOrder: "asc" },
  });

  const unseenOrWeak = packWords.find((pw) => {
    const status = pw.word.progress[0]?.status ?? "new";
    return status === "new" || status === "learning";
  });
  const wearOfDay = unseenOrWeak ?? packWords[0];

  const dayIndex = (new Date().getDate() - 1) % Math.max(packWords.length, 1);
  const wordOfDay = packWords[dayIndex] ?? packWords[0];

  return ok(res, {
    wearOfDay: wearOfDay
      ? { word: wearOfDay.word, pack: pack.name, reason: unseenOrWeak ? "A word you haven't mastered yet" : "Keep building your streak" }
      : null,
    wordOfDay: wordOfDay ? { word: wordOfDay.word, pack: pack.name } : null,
  });
});

// Screen 40: Progress Dashboard — words scanned, learned, mastered, XP, streak.
progressRouter.get("/", requireAuth, async (req, res) => {
  const profileId = req.query.profileId as string;
  if (!profileId) return fail(res, 400, "profileId is required");
  const hasAccess = await canAccessProfile(req.auth!.userId, req.auth!.role, profileId);
  if (!hasAccess) return fail(res, 403, "You don't have access to this profile");

  const [scannedCount, learnedCount, masteredCount, xp, streak, savedCount] = await Promise.all([
    prisma.scanEvent.count({ where: { profileId, result: "success" } }),
    prisma.userWordProgress.count({ where: { profileId, status: { in: ["learned", "mastered"] } } }),
    prisma.userWordProgress.count({ where: { profileId, status: "mastered" } }),
    getXpTotal(profileId),
    prisma.streak.findUnique({ where: { profileId } }),
    prisma.savedWord.count({ where: { profileId } }),
  ]);

  return ok(res, {
    scannedCount,
    learnedCount,
    masteredCount,
    savedCount,
    xp,
    level: getLevelForXp(xp),
    streak,
  });
});

// Screen 41: Progress by Pack.
progressRouter.get("/by-pack", requireAuth, async (req, res) => {
  const profileId = req.query.profileId as string;
  if (!profileId) return fail(res, 400, "profileId is required");
  const hasAccess = await canAccessProfile(req.auth!.userId, req.auth!.role, profileId);
  if (!hasAccess) return fail(res, 403, "You don't have access to this profile");

  const packs = await prisma.wordPack.findMany({
    where: { status: "published" },
    include: { packWords: { include: { word: { include: { progress: { where: { profileId } } } } } } },
  });

  const result = packs.map((pack) => {
    const total = pack.packWords.length;
    const completed = pack.packWords.filter((pw) => pw.word.progress[0]?.status === "mastered").length;
    return { id: pack.id, name: pack.name, total, completed, percent: total ? Math.round((completed / total) * 100) : 0 };
  });
  return ok(res, result);
});

// Screen 42: Learning History.
progressRouter.get("/history", requireAuth, async (req, res) => {
  const profileId = req.query.profileId as string;
  if (!profileId) return fail(res, 400, "profileId is required");
  const hasAccess = await canAccessProfile(req.auth!.userId, req.auth!.role, profileId);
  if (!hasAccess) return fail(res, 403, "You don't have access to this profile");

  const [scans, sessions] = await Promise.all([
    prisma.scanEvent.findMany({ where: { profileId }, orderBy: { scannedAt: "desc" }, take: 25, include: { word: true } }),
    prisma.quizSession.findMany({
      where: { profileId, completedAt: { not: null } },
      orderBy: { completedAt: "desc" },
      take: 25,
    }),
  ]);

  const timeline = [
    ...scans.map((s) => ({ type: "scan", at: s.scannedAt, label: s.word ? `Scanned ${s.word.text}` : "Scan attempt" })),
    ...sessions.map((s) => ({ type: "quiz", at: s.completedAt!, label: `${s.activityType} session — score ${s.score ?? 0}` })),
  ].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());

  return ok(res, timeline.slice(0, 30));
});

// Screen 43: Saved Words.
progressRouter.get("/saved-words", requireAuth, async (req, res) => {
  const profileId = req.query.profileId as string;
  if (!profileId) return fail(res, 400, "profileId is required");
  const hasAccess = await canAccessProfile(req.auth!.userId, req.auth!.role, profileId);
  if (!hasAccess) return fail(res, 403, "You don't have access to this profile");

  const saved = await prisma.savedWord.findMany({
    where: { profileId },
    include: { word: { include: { content: true, progress: { where: { profileId } } } } },
    orderBy: { createdAt: "desc" },
  });
  return ok(res, saved.map((s) => ({ ...s.word, savedAt: s.createdAt })));
});

const saveWordSchema = z.object({ profileId: z.string().min(1), wordId: z.string().min(1) });

// Screen 26: Save Word Confirmation.
progressRouter.post("/saved-words", requireAuth, async (req, res) => {
  const parsed = saveWordSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid input");
  const hasAccess = await canAccessProfile(req.auth!.userId, req.auth!.role, parsed.data.profileId);
  if (!hasAccess) return fail(res, 403, "You don't have access to this profile");

  const saved = await prisma.savedWord.upsert({
    where: { profileId_wordId: parsed.data },
    create: parsed.data,
    update: {},
  });
  await trackEvent("word_saved", { profileId: parsed.data.profileId, properties: { wordId: parsed.data.wordId } });
  return ok(res, saved);
});

progressRouter.patch("/saved-words/:wordId", requireAuth, async (req, res) => {
  const profileId = req.query.profileId as string;
  if (!profileId) return fail(res, 400, "profileId is required");
  const hasAccess = await canAccessProfile(req.auth!.userId, req.auth!.role, profileId);
  if (!hasAccess) return fail(res, 403, "You don't have access to this profile");
  await prisma.savedWord.delete({ where: { profileId_wordId: { profileId, wordId: req.params.wordId } } }).catch(() => null);
  await trackEvent("word_unsaved", { profileId, properties: { wordId: req.params.wordId } });
  return ok(res, { removed: true });
});

// Mark Learned flow (Screen 27).
const markLearnedSchema = z.object({ profileId: z.string().min(1), wordId: z.string().min(1) });

progressRouter.post("/mark-learned", requireAuth, async (req, res) => {
  const parsed = markLearnedSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid input");
  const hasAccess = await canAccessProfile(req.auth!.userId, req.auth!.role, parsed.data.profileId);
  if (!hasAccess) return fail(res, 403, "You don't have access to this profile");

  const existing = await prisma.userWordProgress.findUnique({
    where: { profileId_wordId: parsed.data },
  });
  const progress = await prisma.userWordProgress.upsert({
    where: { profileId_wordId: parsed.data },
    create: { ...parsed.data, status: "learned", masteryScore: 40, correctCount: 1, lastSeenAt: new Date() },
    update: {
      lastSeenAt: new Date(),
      status: "learned",
      masteryScore: Math.min(100, (existing?.masteryScore ?? 0) + 10),
      correctCount: { increment: 1 },
    },
  });
  if (existing?.status !== "learned" && existing?.status !== "mastered") {
    await awardXp(parsed.data.profileId, "word_learned", parsed.data.wordId);
  }
  await recordStreakActivity(parsed.data.profileId);
  const newBadges = await evaluateBadges(parsed.data.profileId);
  await trackEvent("word_marked_learned", { profileId: parsed.data.profileId, properties: { wordId: parsed.data.wordId } });
  return ok(res, { progress, newBadges });
});

progressRouter.get("/word/:wordId", requireAuth, async (req, res) => {
  const profileId = req.query.profileId as string;
  if (!profileId) return fail(res, 400, "profileId is required");
  const progress = await prisma.userWordProgress.findUnique({
    where: { profileId_wordId: { profileId, wordId: req.params.wordId } },
  });
  const saved = await prisma.savedWord.findUnique({ where: { profileId_wordId: { profileId, wordId: req.params.wordId } } });
  return ok(res, { progress, isSaved: Boolean(saved) });
});
