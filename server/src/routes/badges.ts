import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, requireRole } from "../lib/auth";
import { ok, fail } from "../lib/respond";
import { canAccessProfile } from "./profiles";
import { writeAudit } from "../services/audit";

export const badgesRouter = Router();

const BADGE_COPY: Record<string, { description: string; requirementJson: string }> = {
  quiz_champion: { description: "Completed 3 practice sessions.", requirementJson: JSON.stringify({ type: "quiz_complete", count: 3 }) },
  quiz_regular: { description: "Completed 10 practice sessions.", requirementJson: JSON.stringify({ type: "quiz_complete", count: 10 }) },
  quiz_veteran: { description: "Completed 25 practice sessions.", requirementJson: JSON.stringify({ type: "quiz_complete", count: 25 }) },
};

// Screen 45: Achievements — unlocked + locked badges with requirements shown.
badgesRouter.get("/", requireAuth, async (req, res) => {
  const profileId = req.query.profileId as string;
  const allBadges = await prisma.badge.findMany({ where: { active: true } });
  if (!profileId) return ok(res, allBadges);

  const hasAccess = await canAccessProfile(req.auth!.userId, req.auth!.role, profileId);
  if (!hasAccess) return fail(res, 403, "You don't have access to this profile");

  const earned = await prisma.userBadge.findMany({ where: { profileId } });
  const earnedMap = new Map(earned.map((e) => [e.badgeId, e.earnedAt]));

  return ok(
    res,
    allBadges.map((b) => ({
      ...b,
      ...(BADGE_COPY[b.code] ?? {}),
      earned: earnedMap.has(b.id),
      earnedAt: earnedMap.get(b.id) ?? null,
    }))
  );
});

const createBadgeSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  iconUrl: z.string().optional(),
  requirementJson: z.string().min(1),
});

badgesRouter.post("/", requireAuth, requireRole("admin"), async (req, res) => {
  const parsed = createBadgeSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid input");
  const badge = await prisma.badge.create({ data: parsed.data });
  await writeAudit(req.auth!.userId, "create", "badge", badge.id, null, badge);
  return ok(res, badge);
});

badgesRouter.patch("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const before = await prisma.badge.findUnique({ where: { id: req.params.id } });
  if (!before) return fail(res, 404, "Badge not found");
  const updated = await prisma.badge.update({ where: { id: req.params.id }, data: req.body });
  await writeAudit(req.auth!.userId, "update", "badge", updated.id, before, updated);
  return ok(res, updated);
});
