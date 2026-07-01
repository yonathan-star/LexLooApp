import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../lib/auth";
import { ok, fail } from "../lib/respond";
import { canAccessProfile } from "./profiles";
import { trackEvent } from "../services/analytics";
import { awardCustomXp } from "../services/gamification";

export const missionsRouter = Router();

interface MissionRequirement {
  type: "scan_tile" | "learn_words" | "complete_quiz" | "review_saved";
  count: number;
}

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

// Screen 13: Daily Missions Panel — generated fresh each day, progress
// computed live from today's events rather than client-reported counters.
missionsRouter.get("/today", requireAuth, async (req, res) => {
  const profileId = req.query.profileId as string;
  if (!profileId) return fail(res, 400, "profileId is required");
  const hasAccess = await canAccessProfile(req.auth!.userId, req.auth!.role, profileId);
  if (!hasAccess) return fail(res, 403, "You don't have access to this profile");

  const todayStart = startOfToday();
  const missions = await prisma.mission.findMany({ where: { active: true, missionType: "daily" } });

  const savedWordRows = await prisma.savedWord.findMany({ where: { profileId }, select: { wordId: true } });
  const savedWordIds = savedWordRows.map((saved) => saved.wordId);

  const [scansToday, wordsLearnedToday, quizzesToday, savedWordViewsToday, savedWordPracticeToday] = await Promise.all([
    prisma.scanEvent.count({ where: { profileId, scannedAt: { gte: todayStart }, result: "success" } }),
    prisma.userWordProgress.count({ where: { profileId, lastSeenAt: { gte: todayStart } } }),
    prisma.quizSession.count({ where: { profileId, completedAt: { gte: todayStart } } }),
    savedWordIds.length
      ? prisma.xpEvent.findMany({
          where: { profileId, eventType: "word_view", sourceId: { in: savedWordIds }, createdAt: { gte: todayStart } },
          distinct: ["sourceId"],
          select: { sourceId: true },
        })
      : Promise.resolve([]),
    savedWordIds.length
      ? prisma.quizSession.findMany({
          where: { profileId, wordId: { in: savedWordIds }, completedAt: { gte: todayStart } },
          distinct: ["wordId"],
          select: { wordId: true },
        })
      : Promise.resolve([]),
  ]);

  const reviewedSavedWordIds = new Set<string>();
  savedWordViewsToday.forEach((event) => {
    if (event.sourceId) reviewedSavedWordIds.add(event.sourceId);
  });
  savedWordPracticeToday.forEach((session) => {
    if (session.wordId) reviewedSavedWordIds.add(session.wordId);
  });

  const progressByType: Record<string, number> = {
    scan_tile: scansToday,
    learn_words: wordsLearnedToday,
    complete_quiz: quizzesToday,
    review_saved: reviewedSavedWordIds.size,
  };

  const results = [];
  for (const mission of missions) {
    let requirement: MissionRequirement;
    try {
      requirement = JSON.parse(mission.requirementJson);
    } catch {
      continue;
    }
    const current = progressByType[requirement.type] ?? 0;
    const completed = current >= requirement.count;
    const progressJson = JSON.stringify({ type: requirement.type, current, target: requirement.count });

    let userMission = await prisma.userMission.findFirst({
      where: { profileId, missionId: mission.id, startedAt: { gte: todayStart } },
    });
    if (!userMission) {
      userMission = await prisma.userMission.create({
        data: { profileId, missionId: mission.id, status: completed ? "completed" : "in_progress", completedAt: completed ? new Date() : undefined, progressJson },
      });
      if (completed) {
        await awardCustomXp(profileId, "mission_complete", mission.xpReward, mission.id);
        await trackEvent("mission_complete", { profileId, properties: { missionId: mission.id, code: mission.code, xpReward: mission.xpReward } });
      }
    } else if (completed && userMission.status !== "completed") {
      userMission = await prisma.userMission.update({ where: { id: userMission.id }, data: { status: "completed", completedAt: new Date(), progressJson } });
      await awardCustomXp(profileId, "mission_complete", mission.xpReward, mission.id);
      await trackEvent("mission_complete", { profileId, properties: { missionId: mission.id, code: mission.code, xpReward: mission.xpReward } });
    } else if (userMission.progressJson !== progressJson) {
      userMission = await prisma.userMission.update({ where: { id: userMission.id }, data: { progressJson } });
    }

    results.push({
      id: mission.id,
      code: mission.code,
      title: mission.title,
      xpReward: mission.xpReward,
      current,
      target: requirement.count,
      completed: userMission.status === "completed",
    });
  }

  return ok(res, results);
});
