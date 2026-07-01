import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../lib/auth";
import { ok, fail } from "../lib/respond";
import { canAccessProfile } from "./profiles";
import { trackEvent } from "../services/analytics";

export const notificationsRouter = Router();

const notificationTypes = ["daily_word", "streak", "parent_weekly"] as const;

const preferencesSchema = z.object({
  profileId: z.string().min(1),
  dailyWord: z.boolean().default(false),
  streak: z.boolean().default(false),
  parentWeekly: z.boolean().default(false),
});

function nextScheduledDate(type: (typeof notificationTypes)[number]) {
  const now = new Date();
  const next = new Date(now);
  if (type === "daily_word") next.setHours(9, 0, 0, 0);
  if (type === "streak") next.setHours(18, 0, 0, 0);
  if (type === "parent_weekly") {
    next.setHours(8, 0, 0, 0);
    const monday = 1;
    const dayDelta = (monday - next.getDay() + 7) % 7;
    next.setDate(next.getDate() + dayDelta);
  }
  if (next <= now) {
    if (type === "parent_weekly") next.setDate(next.getDate() + 7);
    else next.setDate(next.getDate() + 1);
  }
  return next;
}

function payloadFor(type: (typeof notificationTypes)[number]) {
  if (type === "daily_word") {
    return { title: "Your LexLoo word is ready", body: "Open today&apos;s word and keep your streak warm." };
  }
  if (type === "streak") {
    return { title: "Keep your LexLoo streak", body: "One quick practice keeps today lit." };
  }
  return { title: "Weekly LexLoo summary", body: "See what your learner practiced this week." };
}

notificationsRouter.get("/", requireAuth, async (req, res) => {
  const profileId = String(req.query.profileId ?? "");
  if (!profileId) return fail(res, 400, "profileId is required");
  const hasAccess = await canAccessProfile(req.auth!.userId, req.auth!.role, profileId);
  if (!hasAccess) return fail(res, 403, "You don't have access to this profile");

  const notifications = await prisma.notification.findMany({
    where: { profileId },
    orderBy: [{ status: "asc" }, { scheduledFor: "asc" }],
  });
  return ok(res, notifications);
});

notificationsRouter.put("/preferences", requireAuth, async (req, res) => {
  const parsed = preferencesSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid notification preferences");
  const { profileId, dailyWord, streak, parentWeekly } = parsed.data;

  const hasAccess = await canAccessProfile(req.auth!.userId, req.auth!.role, profileId);
  if (!hasAccess) return fail(res, 403, "You don't have access to this profile");

  const enabledByType: Record<(typeof notificationTypes)[number], boolean> = {
    daily_word: dailyWord,
    streak,
    parent_weekly: parentWeekly,
  };

  await prisma.notification.updateMany({
    where: { profileId, type: { in: [...notificationTypes] }, status: "scheduled" },
    data: { status: "cancelled" },
  });

  const enabledTypes = notificationTypes.filter((type) => enabledByType[type]);
  if (enabledTypes.length) {
    await prisma.notification.createMany({
      data: enabledTypes.map((type) => ({
        profileId,
        type,
        scheduledFor: nextScheduledDate(type),
        status: "scheduled",
        payloadJson: JSON.stringify(payloadFor(type)),
      })),
    });
  }

  await trackEvent("notification_preferences_saved", {
    userId: req.auth!.userId,
    profileId,
    properties: { dailyWord, streak, parentWeekly },
  });

  const notifications = await prisma.notification.findMany({
    where: { profileId },
    orderBy: [{ status: "asc" }, { scheduledFor: "asc" }],
  });
  return ok(res, notifications);
});

