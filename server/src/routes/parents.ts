import { Router } from "express";
import crypto from "crypto";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../lib/auth";
import { ok, fail } from "../lib/respond";
import { trackEvent } from "../services/analytics";
import { getXpTotal } from "../services/gamification";
import { sendEmail } from "../services/email";

export const parentsRouter = Router();
const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function generateInviteCode() {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
}

function hashInviteCode(code: string) {
  return crypto.createHash("sha256").update(code).digest("hex");
}

async function deliverFamilyInvite(email: string | undefined, code: string, childName: string) {
  if (!email) return "no_email" as const;
  const message = `You've been invited to LexLoo for ${childName}. Your family invite code is ${code}.`;
  return sendEmail(email, "You're invited to LexLoo", message);
}

// Screen 59: Parent Dashboard Home — children cards + weekly summary.
parentsRouter.get("/children", requireAuth, async (req, res) => {
  const links = await prisma.parentChildLink.findMany({
    where: { parentUserId: req.auth!.userId },
    include: { child: true },
  });
  const children = await Promise.all(
    links.map(async (link) => {
      const [streak, xp, masteredCount, badgeCount] = await Promise.all([
        prisma.streak.findUnique({ where: { profileId: link.childProfileId } }),
        getXpTotal(link.childProfileId),
        prisma.userWordProgress.count({ where: { profileId: link.childProfileId, status: "mastered" } }),
        prisma.userBadge.count({ where: { profileId: link.childProfileId } }),
      ]);
      const invite = await prisma.familyInvite.findFirst({
        where: { parentUserId: req.auth!.userId, childProfileId: link.childProfileId, status: "pending" },
        orderBy: { createdAt: "desc" },
        select: { id: true, email: true, inviteCode: true, status: true, createdAt: true },
      });
      return { profile: link.child, streak, xp, masteredCount, badgeCount, invite };
    })
  );
  return ok(res, children);
});

parentsRouter.get("/invites", requireAuth, async (req, res) => {
  const invites = await prisma.familyInvite.findMany({
    where: { parentUserId: req.auth!.userId },
    include: { child: true },
    orderBy: { createdAt: "desc" },
  });
  return ok(res, invites);
});

const addChildSchema = z.object({
  name: z.string().min(1),
  ageRange: z.string().optional(),
  gradeLevel: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  sendInvite: z.boolean().optional(),
});

// Screen 62: Add Child Profile.
parentsRouter.post("/children", requireAuth, async (req, res) => {
  const parsed = addChildSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, parsed.error.issues[0]?.message ?? "Invalid input");
  const childEmail = parsed.data.email?.trim().toLowerCase() || undefined;
  const child = await prisma.profile.create({
    data: {
      userId: req.auth!.userId,
      profileType: "child",
      name: parsed.data.name,
      ageRange: parsed.data.ageRange,
      gradeLevel: parsed.data.gradeLevel,
    },
  });
  await prisma.streak.create({ data: { profileId: child.id } });
  await prisma.parentChildLink.create({
    data: { parentUserId: req.auth!.userId, childProfileId: child.id, relationship: "parent" },
  });
  let invite = null;
  if (parsed.data.sendInvite || childEmail) {
    const inviteCode = generateInviteCode();
    invite = await prisma.familyInvite.create({
      data: {
        parentUserId: req.auth!.userId,
        childProfileId: child.id,
        email: childEmail,
        inviteCode,
        mfaCodeHash: hashInviteCode(inviteCode),
        mfaCodeExpiresAt: new Date(Date.now() + INVITE_TTL_MS),
      },
    });
    const deliveryStatus = await deliverFamilyInvite(childEmail, inviteCode, child.name);
    invite = { ...invite, deliveryStatus };
    await trackEvent("family_invite_created", { userId: req.auth!.userId, profileId: child.id, properties: { hasEmail: Boolean(childEmail), deliveryStatus } });
  }
  await trackEvent("child_profile_created", { userId: req.auth!.userId, profileId: child.id });
  return ok(res, { ...child, invite });
});

const createInviteSchema = z.object({
  childProfileId: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
});

parentsRouter.post("/invites", requireAuth, async (req, res) => {
  const parsed = createInviteSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, parsed.error.issues[0]?.message ?? "Invalid input");
  const link = await prisma.parentChildLink.findFirst({
    where: { parentUserId: req.auth!.userId, childProfileId: parsed.data.childProfileId },
    include: { child: true },
  });
  const ownProfile = link ? null : await prisma.profile.findFirst({
    where: { id: parsed.data.childProfileId, userId: req.auth!.userId },
  });
  if (!link && !ownProfile) return fail(res, 403, "You don't have access to this profile");
  const inviteProfile = link?.child ?? ownProfile!;
  const email = parsed.data.email?.trim().toLowerCase() || undefined;
  const inviteCode = generateInviteCode();
  const invite = await prisma.familyInvite.create({
    data: {
      parentUserId: req.auth!.userId,
      childProfileId: inviteProfile.id,
      email,
      inviteCode,
      mfaCodeHash: hashInviteCode(inviteCode),
      mfaCodeExpiresAt: new Date(Date.now() + INVITE_TTL_MS),
    },
    include: { child: true },
  });
  const deliveryStatus = await deliverFamilyInvite(email, inviteCode, inviteProfile.name);
  await trackEvent("family_invite_created", { userId: req.auth!.userId, profileId: inviteProfile.id, properties: { hasEmail: Boolean(email), resent: true, deliveryStatus } });
  return ok(res, { ...invite, deliveryStatus });
});

parentsRouter.delete("/invites/:inviteId", requireAuth, async (req, res) => {
  const invite = await prisma.familyInvite.findFirst({
    where: { id: req.params.inviteId, parentUserId: req.auth!.userId },
  });
  if (!invite) return fail(res, 403, "You don't have access to this invite");
  await prisma.familyInvite.delete({ where: { id: invite.id } });
  await trackEvent("family_invite_deleted", { userId: req.auth!.userId, profileId: invite.childProfileId });
  return ok(res, { deleted: true });
});

parentsRouter.delete("/children/:profileId", requireAuth, async (req, res) => {
  const link = await prisma.parentChildLink.findFirst({
    where: { parentUserId: req.auth!.userId, childProfileId: req.params.profileId },
  });
  if (!link) return fail(res, 403, "You don't have access to this child's profile");
  const profileId = req.params.profileId;

  const sessionIds = (await prisma.quizSession.findMany({ where: { profileId }, select: { id: true } })).map((s) => s.id);
  await prisma.quizAttempt.deleteMany({ where: { sessionId: { in: sessionIds } } });
  await prisma.quizSession.deleteMany({ where: { profileId } });
  await prisma.scanEvent.deleteMany({ where: { profileId } });
  await prisma.userWordProgress.deleteMany({ where: { profileId } });
  await prisma.xpEvent.deleteMany({ where: { profileId } });
  await prisma.streak.deleteMany({ where: { profileId } });
  await prisma.userBadge.deleteMany({ where: { profileId } });
  await prisma.userMission.deleteMany({ where: { profileId } });
  await prisma.notification.deleteMany({ where: { profileId } });
  await prisma.savedWord.deleteMany({ where: { profileId } });
  await prisma.analyticsEvent.updateMany({ where: { profileId }, data: { profileId: null } });
  await prisma.familyInvite.deleteMany({ where: { childProfileId: profileId } });
  await prisma.parentChildLink.deleteMany({ where: { childProfileId: profileId } });
  await prisma.profile.delete({ where: { id: profileId } });

  await trackEvent("child_profile_deleted", { userId: req.auth!.userId, profileId });
  return ok(res, { deleted: true });
});

// Screen 60: Parent Child Detail.
parentsRouter.get("/children/:profileId", requireAuth, async (req, res) => {
  const link = await prisma.parentChildLink.findFirst({
    where: { parentUserId: req.auth!.userId, childProfileId: req.params.profileId },
  });
  if (!link) return fail(res, 403, "You don't have access to this child's profile");

  const [profile, streak, xp, progress, badges, recentScans] = await Promise.all([
    prisma.profile.findUnique({ where: { id: req.params.profileId } }),
    prisma.streak.findUnique({ where: { profileId: req.params.profileId } }),
    getXpTotal(req.params.profileId),
    prisma.userWordProgress.findMany({ where: { profileId: req.params.profileId }, include: { word: true } }),
    prisma.userBadge.findMany({ where: { profileId: req.params.profileId }, include: { badge: true } }),
    prisma.scanEvent.findMany({
      where: { profileId: req.params.profileId },
      orderBy: { scannedAt: "desc" },
      take: 10,
      include: { word: true },
    }),
  ]);

  const mastered = progress.filter((p) => p.status === "mastered");
  const learned = progress.filter((p) => p.status === "learned" || p.status === "mastered");

  return ok(res, {
    profile,
    streak,
    xp,
    masteredWords: mastered.map((p) => p.word.text),
    learnedCount: learned.length,
    badges: badges.map((b) => b.badge.name),
    recentActivity: recentScans.map((s) => ({ word: s.word?.text, scannedAt: s.scannedAt })),
  });
});

// Screen 61: Parent Weekly Report.
parentsRouter.get("/children/:profileId/weekly-report", requireAuth, async (req, res) => {
  const link = await prisma.parentChildLink.findFirst({
    where: { parentUserId: req.auth!.userId, childProfileId: req.params.profileId },
  });
  if (!link) return fail(res, 403, "You don't have access to this child's profile");

  const since = new Date();
  since.setDate(since.getDate() - 7);

  const [profile, streak, wordsLearned, wordsMastered, badgesEarned] = await Promise.all([
    prisma.profile.findUnique({ where: { id: req.params.profileId } }),
    prisma.streak.findUnique({ where: { profileId: req.params.profileId } }),
    prisma.userWordProgress.count({
      where: { profileId: req.params.profileId, status: { in: ["learned", "mastered"] }, lastSeenAt: { gte: since } },
    }),
    prisma.userWordProgress.count({
      where: { profileId: req.params.profileId, status: "mastered", lastSeenAt: { gte: since } },
    }),
    prisma.userBadge.findMany({
      where: { profileId: req.params.profileId, earnedAt: { gte: since } },
      include: { badge: true },
    }),
  ]);

  const suggestedFocus = wordsMastered === 0 ? "Try a quick quiz today to build momentum." : "Keep reviewing weak words to push toward mastery.";

  return ok(res, {
    profileName: profile?.name,
    wordsLearned,
    wordsMastered,
    streak: streak?.currentCount ?? 0,
    badgesEarned: badgesEarned.map((b) => b.badge.name),
    suggestedFocus,
    summaryText: `This week, ${profile?.name} learned ${wordsLearned} words, mastered ${wordsMastered}, and kept a ${streak?.currentCount ?? 0}-day streak.`,
  });
});
