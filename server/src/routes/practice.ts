import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../lib/auth";
import { ok, fail } from "../lib/respond";
import { canAccessProfile } from "./profiles";
import { trackEvent } from "../services/analytics";
import { awardCustomXp, awardXp, evaluateBadges, recordStreakActivity, updateWordProgress } from "../services/gamification";

export const practiceRouter = Router();

// Screen 32: quiz setup — pick a word's distractors from the same language for
// a multiple-choice question. Kept deterministic/random rather than ML-based
// for the MVP per AI Roadmap notes (defer AI quiz generation).
practiceRouter.get("/quiz-options/:wordId", requireAuth, async (req, res) => {
  const word = await prisma.word.findUnique({ where: { id: req.params.wordId }, include: { content: true } });
  if (!word) return fail(res, 404, "Word not found");

  const distractors = await prisma.word.findMany({
    where: { languageId: word.languageId, id: { not: word.id }, status: "published" },
    include: { content: true },
    take: 20,
  });
  const shuffled = distractors.sort(() => Math.random() - 0.5).slice(0, 3);
  const options = [word, ...shuffled]
    .map((w) => ({ wordId: w.id, text: w.content?.shortDefinition ?? w.text }))
    .sort(() => Math.random() - 0.5);

  return ok(res, { prompt: word.text, correctWordId: word.id, options });
});

const startSessionSchema = z.object({
  profileId: z.string().min(1),
  activityType: z.enum(["flashcard", "multiple_choice", "spelling", "match", "sentence_builder"]),
  packId: z.string().optional(),
  wordId: z.string().optional(),
});

// Screen 29/32: Flashcard/Quiz Start.
practiceRouter.post("/sessions", requireAuth, async (req, res) => {
  const parsed = startSessionSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid input");
  const hasAccess = await canAccessProfile(req.auth!.userId, req.auth!.role, parsed.data.profileId);
  if (!hasAccess) return fail(res, 403, "You don't have access to this profile");

  const session = await prisma.quizSession.create({ data: parsed.data });
  await trackEvent("practice_session_started", { profileId: parsed.data.profileId, properties: parsed.data });
  return ok(res, session);
});

const attemptSchema = z.object({
  wordId: z.string().min(1),
  promptType: z.string().min(1),
  answer: z.string(),
  isCorrect: z.boolean(),
  responseTimeMs: z.number().int().optional(),
});

// Screen 30/33/37: record one attempt within a session (flashcard self-report,
// quiz answer, or spelling check), update mastery, and award XP immediately.
practiceRouter.post("/sessions/:id/attempts", requireAuth, async (req, res) => {
  const session = await prisma.quizSession.findUnique({ where: { id: req.params.id } });
  if (!session) return fail(res, 404, "Session not found");
  const hasAccess = await canAccessProfile(req.auth!.userId, req.auth!.role, session.profileId);
  if (!hasAccess) return fail(res, 403, "You don't have access to this session");
  const parsed = attemptSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid input");

  const attempt = await prisma.quizAttempt.create({
    data: { sessionId: session.id, ...parsed.data },
  });

  await updateWordProgress(session.profileId, parsed.data.wordId, parsed.data.isCorrect);
  if (parsed.data.isCorrect) {
    await awardXp(session.profileId, "quiz_correct", attempt.id);
  }

  return ok(res, attempt);
});

const completeSessionSchema = z.object({ score: z.number().int().min(0).max(100) });

// Screen 31/35: Flashcard/Quiz Results.
practiceRouter.patch("/sessions/:id/complete", requireAuth, async (req, res) => {
  const session = await prisma.quizSession.findUnique({ where: { id: req.params.id } });
  if (!session) return fail(res, 404, "Session not found");
  const hasAccess = await canAccessProfile(req.auth!.userId, req.auth!.role, session.profileId);
  if (!hasAccess) return fail(res, 403, "You don't have access to this session");
  const parsed = completeSessionSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid input");
  if (session.completedAt) {
    const newBadges = await evaluateBadges(session.profileId);
    return ok(res, { session, newBadges });
  }

  const xpAwarded = Math.max(5, Math.round(parsed.data.score / 2));

  const updated = await prisma.quizSession.update({
    where: { id: session.id },
    data: { completedAt: new Date(), score: parsed.data.score, xpAwarded },
  });
  await awardCustomXp(session.profileId, "quiz_session_complete", xpAwarded, session.id);
  await recordStreakActivity(session.profileId);
  const newBadges = await evaluateBadges(session.profileId);
  await trackEvent("quiz_complete", { profileId: session.profileId, properties: { score: parsed.data.score, activityType: session.activityType } });

  return ok(res, { session: updated, newBadges });
});
