import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../lib/auth";
import { ok, fail } from "../lib/respond";
import { trackEvent } from "../services/analytics";
import { getXpTotal, getLevelForXp } from "../services/gamification";

export const profilesRouter = Router();

profilesRouter.get("/", requireAuth, async (req, res) => {
  const profiles = await prisma.profile.findMany({ where: { userId: req.auth!.userId } });
  return ok(res, profiles);
});

profilesRouter.get("/:id", requireAuth, async (req, res) => {
  const profile = await prisma.profile.findUnique({ where: { id: req.params.id } });
  if (!profile) return fail(res, 404, "Profile not found");
  const hasAccess = await canAccessProfile(req.auth!.userId, req.auth!.role, profile.id);
  if (!hasAccess) return fail(res, 403, "You don't have access to this profile");
  const [streak, xp] = await Promise.all([
    prisma.streak.findUnique({ where: { profileId: profile.id } }),
    getXpTotal(profile.id),
  ]);
  return ok(res, { ...profile, streak, xp, level: getLevelForXp(xp) });
});

const createSchema = z.object({
  profileType: z.enum(["student", "parent", "adult_learner", "child"]).default("student"),
  name: z.string().min(1),
  ageRange: z.string().optional(),
  gradeLevel: z.string().optional(),
  avatar: z.string().optional(),
});

profilesRouter.post("/", requireAuth, async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, parsed.error.issues[0]?.message ?? "Invalid input");
  const profile = await prisma.profile.create({ data: { userId: req.auth!.userId, ...parsed.data } });
  await prisma.streak.create({ data: { profileId: profile.id } });

  if (req.body.linkAsChild) {
    await prisma.parentChildLink.create({
      data: { parentUserId: req.auth!.userId, childProfileId: profile.id, relationship: "parent" },
    });
  }

  await trackEvent("profile_created", { userId: req.auth!.userId, profileId: profile.id });
  return ok(res, profile);
});

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  profileType: z.enum(["student", "parent", "adult_learner", "child"]).optional(),
  ageRange: z.string().optional(),
  gradeLevel: z.string().optional(),
  avatar: z.string().optional(),
  activeGoalId: z.string().optional(),
});

profilesRouter.patch("/:id", requireAuth, async (req, res) => {
  const profile = await prisma.profile.findUnique({ where: { id: req.params.id } });
  if (!profile) return fail(res, 404, "Profile not found");
  if (profile.userId !== req.auth!.userId) return fail(res, 403, "You don't have access to this profile");
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid input");
  const updated = await prisma.profile.update({ where: { id: profile.id }, data: parsed.data });
  await trackEvent("profile_updated", { userId: req.auth!.userId, profileId: profile.id, properties: parsed.data });
  return ok(res, updated);
});

export async function canAccessProfile(userId: string, role: string, profileId: string): Promise<boolean> {
  if (role === "admin") return true;
  const profile = await prisma.profile.findUnique({ where: { id: profileId } });
  if (!profile) return false;
  if (profile.userId === userId) return true;
  const link = await prisma.parentChildLink.findFirst({ where: { parentUserId: userId, childProfileId: profileId } });
  return Boolean(link);
}
