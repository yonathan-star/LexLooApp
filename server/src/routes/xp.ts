import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../lib/auth";
import { ok, fail } from "../lib/respond";
import { canAccessProfile } from "./profiles";
import { getXpTotal, getLevelForXp } from "../services/gamification";

export const xpRouter = Router();

// Screen 48: XP Ledger — transparency into how XP was earned.
xpRouter.get("/", requireAuth, async (req, res) => {
  const profileId = req.query.profileId as string;
  if (!profileId) return fail(res, 400, "profileId is required");
  const hasAccess = await canAccessProfile(req.auth!.userId, req.auth!.role, profileId);
  if (!hasAccess) return fail(res, 403, "You don't have access to this profile");

  const events = await prisma.xpEvent.findMany({ where: { profileId }, orderBy: { createdAt: "desc" }, take: 100 });
  const total = await getXpTotal(profileId);
  return ok(res, { events, total, level: getLevelForXp(total) });
});
