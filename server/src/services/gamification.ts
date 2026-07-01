import { prisma } from "../lib/prisma";

export const XP_RULES = {
  scan: 5,
  word_view: 2,
  audio_play: 1,
  quiz_correct: 5,
  quiz_session_complete: 10,
  word_learned: 10,
  word_mastered: 25,
  streak_continue: 5,
  mission_complete: 15,
} as const;

export type XpEventType = keyof typeof XP_RULES;

export async function awardXp(profileId: string, eventType: XpEventType, sourceId?: string) {
  const points = XP_RULES[eventType] ?? 0;
  if (points <= 0) return null;
  return prisma.xpEvent.create({
    data: { profileId, eventType, points, sourceId },
  });
}

export async function awardXpOncePerDay(profileId: string, eventType: XpEventType, sourceId?: string) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const existing = await prisma.xpEvent.findFirst({
    where: {
      profileId,
      eventType,
      sourceId,
      createdAt: { gte: startOfDay },
    },
  });
  if (existing) return null;
  return awardXp(profileId, eventType, sourceId);
}

export async function awardCustomXp(profileId: string, eventType: string, points: number, sourceId?: string) {
  if (points <= 0) return null;
  return prisma.xpEvent.create({
    data: { profileId, eventType, points, sourceId },
  });
}

export async function getXpTotal(profileId: string): Promise<number> {
  const sum = await prisma.xpEvent.aggregate({
    where: { profileId },
    _sum: { points: true },
  });
  return sum._sum.points ?? 0;
}

// Levels are a motivational identity ladder, not a hard gate — thresholds are
// intentionally simple/deterministic for the MVP per PRD Habit Engine 4.
export const LEVELS = [
  { name: "Explorer", minXp: 0 },
  { name: "Scholar", minXp: 100 },
  { name: "Wordsmith", minXp: 300 },
  { name: "Linguist", minXp: 700 },
  { name: "Master", minXp: 1500 },
  { name: "LexLoo Legend", minXp: 3000 },
];

export function getLevelForXp(xp: number) {
  let current = LEVELS[0];
  for (const level of LEVELS) {
    if (xp >= level.minXp) current = level;
  }
  const idx = LEVELS.indexOf(current);
  const next = LEVELS[idx + 1] ?? null;
  return { current: current.name, next: next?.name ?? null, nextXp: next?.minXp ?? null };
}

function dateKeyInTimezone(date: Date, timezone: string): string {
  try {
    return new Intl.DateTimeFormat("en-CA", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

function addDaysKey(key: string, days: number): string {
  const d = new Date(`${key}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

// Daily streak logic: counts unique calendar days (in the profile's timezone)
// with at least one learning event. Missing a day resets to 1 on next activity
// rather than 0, so the user is never punished beyond losing the prior count.
export async function recordStreakActivity(profileId: string, timezone = "UTC") {
  const today = dateKeyInTimezone(new Date(), timezone);
  let streak = await prisma.streak.findUnique({ where: { profileId } });
  if (!streak) {
    streak = await prisma.streak.create({
      data: { profileId, currentCount: 1, longestCount: 1, lastActiveDate: today, timezone },
    });
    return streak;
  }
  if (streak.lastActiveDate === today) {
    return streak; // already active today, no double counting
  }
  const yesterday = addDaysKey(today, -1);
  const newCurrent = streak.lastActiveDate === yesterday ? streak.currentCount + 1 : 1;
  const newLongest = Math.max(streak.longestCount, newCurrent);
  streak = await prisma.streak.update({
    where: { profileId },
    data: { currentCount: newCurrent, longestCount: newLongest, lastActiveDate: today, timezone },
  });
  if (newCurrent > 1) {
    await awardXp(profileId, "streak_continue");
  }
  return streak;
}

interface BadgeRequirement {
  type: "first_scan" | "streak" | "words_learned" | "words_mastered" | "quiz_complete" | "words_collected" | "scans";
  count?: number;
}

export async function evaluateBadges(profileId: string): Promise<{ code: string; name: string; id: string }[]> {
  const [badges, earned, scanCount, streak, learnedCount, masteredCount, quizCount, savedCount] = await Promise.all([
    prisma.badge.findMany({ where: { active: true } }),
    prisma.userBadge.findMany({ where: { profileId } }),
    prisma.scanEvent.count({ where: { profileId, result: "success" } }),
    prisma.streak.findUnique({ where: { profileId } }),
    prisma.userWordProgress.count({ where: { profileId, status: { in: ["learned", "mastered"] } } }),
    prisma.userWordProgress.count({ where: { profileId, status: "mastered" } }),
    prisma.quizSession.count({ where: { profileId, completedAt: { not: null } } }),
    prisma.savedWord.count({ where: { profileId } }),
  ]);

  const earnedIds = new Set(earned.map((e) => e.badgeId));
  const newlyEarned: { code: string; name: string; id: string }[] = [];

  for (const badge of badges) {
    if (earnedIds.has(badge.id)) continue;
    let requirement: BadgeRequirement;
    try {
      requirement = JSON.parse(badge.requirementJson);
    } catch {
      continue;
    }
    let met = false;
    switch (requirement.type) {
      case "first_scan":
        met = scanCount >= 1;
        break;
      case "streak":
        met = (streak?.currentCount ?? 0) >= (requirement.count ?? 7);
        break;
      case "words_learned":
        met = learnedCount >= (requirement.count ?? 50);
        break;
      case "words_mastered":
        met = masteredCount >= (requirement.count ?? 100);
        break;
      case "quiz_complete":
        met = quizCount >= (requirement.count ?? 1);
        break;
      case "words_collected":
        met = savedCount >= (requirement.count ?? 10);
        break;
      case "scans":
        met = scanCount >= (requirement.count ?? 5);
        break;
    }
    if (met) {
      await prisma.userBadge.create({ data: { profileId, badgeId: badge.id } });
      newlyEarned.push({ code: badge.code, name: badge.name, id: badge.id });
    }
  }
  return newlyEarned;
}

export async function updateWordProgress(profileId: string, wordId: string, isCorrect: boolean) {
  const existing = await prisma.userWordProgress.findUnique({
    where: { profileId_wordId: { profileId, wordId } },
  });

  const correctCount = (existing?.correctCount ?? 0) + (isCorrect ? 1 : 0);
  const incorrectCount = (existing?.incorrectCount ?? 0) + (isCorrect ? 0 : 1);
  const masteryScore = Math.max(0, Math.min(100, (existing?.masteryScore ?? 0) + (isCorrect ? 15 : -5)));

  // Mastery requires repeated successful interactions (PRD Learning Content 10),
  // not a single tap — at least 3 correct attempts and a score threshold.
  let status = existing?.status ?? "new";
  if (status === "new" && (existing?.lastSeenAt || isCorrect)) status = "learning";
  if (masteryScore >= 80 && correctCount >= 3) status = "mastered";
  else if (status === "mastered" && masteryScore < 80) status = "learned";
  else if (status === "learning" && correctCount >= 1 && masteryScore >= 40) status = "learned";

  const wasMastered = existing?.status === "mastered";

  const updated = await prisma.userWordProgress.upsert({
    where: { profileId_wordId: { profileId, wordId } },
    create: {
      profileId,
      wordId,
      status,
      masteryScore,
      correctCount,
      incorrectCount,
      lastSeenAt: new Date(),
    },
    update: {
      status,
      masteryScore,
      correctCount,
      incorrectCount,
      lastSeenAt: new Date(),
    },
  });

  if (status === "mastered" && !wasMastered) {
    await awardXp(profileId, "word_mastered", wordId);
  } else if (status === "learned" && existing?.status !== "learned" && existing?.status !== "mastered") {
    await awardXp(profileId, "word_learned", wordId);
  }

  return updated;
}
