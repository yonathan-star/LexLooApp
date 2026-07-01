import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../lib/auth";
import { ok, fail } from "../lib/respond";
import { canAccessProfile } from "./profiles";

export const streaksRouter = Router();

// Screen 49: Streak Screen — current/longest streak + a simple calendar marker set.
streaksRouter.get("/", requireAuth, async (req, res) => {
  const profileId = req.query.profileId as string;
  if (!profileId) return fail(res, 400, "profileId is required");
  const hasAccess = await canAccessProfile(req.auth!.userId, req.auth!.role, profileId);
  if (!hasAccess) return fail(res, 403, "You don't have access to this profile");

  const streak = await prisma.streak.findUnique({ where: { profileId } });
  return ok(res, streak ?? { profileId, currentCount: 0, longestCount: 0, lastActiveDate: null });
});

streaksRouter.patch("/timezone", requireAuth, async (req, res) => {
  const { profileId, timezone } = req.body as { profileId: string; timezone: string };
  const hasAccess = await canAccessProfile(req.auth!.userId, req.auth!.role, profileId);
  if (!hasAccess) return fail(res, 403, "You don't have access to this profile");
  const updated = await prisma.streak.upsert({
    where: { profileId },
    create: { profileId, timezone },
    update: { timezone },
  });
  return ok(res, updated);
});
