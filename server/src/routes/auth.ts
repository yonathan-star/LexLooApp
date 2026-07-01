import { Router } from "express";
import crypto from "crypto";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { comparePassword, hashPassword, requireAuth, signToken } from "../lib/auth";
import { ok, fail } from "../lib/respond";
import { trackEvent } from "../services/analytics";
import { sendEmail } from "../services/email";

export const authRouter = Router();

const VERIFICATION_TTL_MS = 5 * 60 * 1000;

function generateVerificationCode() {
  return String(crypto.randomInt(100000, 1000000));
}

function hashVerificationCode(code: string) {
  return crypto.createHash("sha256").update(code).digest("hex");
}

function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  return `${name.slice(0, 2)}***@${domain}`;
}

async function deliverVerificationCode(email: string, code: string) {
  const message = `Your LexLoo verification code is ${code}. It expires in 5 minutes.`;
  const status = await sendEmail(email, "Your LexLoo verification code", message);
  if (status === "not_configured" || status === "failed") throw new Error("Verification email delivery is not configured");
}

async function createVerificationChallenge(user: { id: string; email: string }) {
  const code = generateVerificationCode();
  const challengeId = crypto.randomUUID();
  await deliverVerificationCode(user.email, code);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      mfaChallengeId: challengeId,
      mfaCodeHash: hashVerificationCode(code),
      mfaCodeExpiresAt: new Date(Date.now() + VERIFICATION_TTL_MS),
    },
  });
  return {
    challengeId,
    deliveryTarget: maskEmail(user.email),
    devCode: process.env.NODE_ENV === "production" ? undefined : code,
  };
}

async function completeLogin(user: { id: string; email: string; role: string; displayName: string }) {
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date(), mfaChallengeId: null, mfaCodeHash: null, mfaCodeExpiresAt: null },
  });
  const profiles = await prisma.profile.findMany({ where: { userId: user.id } });
  const token = signToken({ userId: user.id, email: user.email, role: user.role });
  await trackEvent("login", { userId: user.id, properties: {} });
  return { token, user: { id: user.id, email: user.email, displayName: user.displayName, role: user.role }, profiles };
}

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  displayName: z.string().min(1),
  role: z.enum(["student", "parent", "adult_learner"]).default("student"),
});

authRouter.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, parsed.error.issues[0]?.message ?? "Invalid input");
  const { email, password, displayName, role } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing?.status === "active") return fail(res, 409, "An account with that email already exists");
  if (existing && existing.status !== "pending_verification") return fail(res, 409, "That email cannot be used for a new account");

  const passwordHash = await hashPassword(password);
  const user = existing?.status === "pending_verification"
    ? await prisma.user.update({
        where: { id: existing.id },
        data: { email: normalizedEmail, passwordHash, displayName, role },
      })
    : await prisma.user.create({
        data: { email: normalizedEmail, passwordHash, displayName, role, status: "pending_verification" },
      });

  try {
    const challenge = await createVerificationChallenge(user);
    await trackEvent("registration_verification_started", { userId: user.id, properties: { role } });
    return ok(res, { mfaRequired: true, reason: "registration", ...challenge });
  } catch {
    return fail(res, 500, "Verification delivery is not configured. Contact support.");
  }
});

const codeSchema = z.object({
  challengeId: z.string().min(1),
  code: z.string().regex(/^\d{6}$/),
});

authRouter.post("/register/verify", async (req, res) => {
  const parsed = codeSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Enter the six-digit verification code");
  const user = await prisma.user.findFirst({
    where: { mfaChallengeId: parsed.data.challengeId, status: "pending_verification" },
  });
  if (!user) return fail(res, 401, "Invalid verification code");
  if (!user.mfaCodeHash || !user.mfaCodeExpiresAt || user.mfaCodeExpiresAt.getTime() < Date.now()) {
    return fail(res, 401, "Verification code expired. Create the account again to get a new code.");
  }
  if (user.mfaCodeHash !== hashVerificationCode(parsed.data.code)) return fail(res, 401, "Invalid verification code");

  const profile = await prisma.$transaction(async (tx) => {
    const updated = await tx.user.update({
      where: { id: user.id },
      data: { status: "active", mfaChallengeId: null, mfaCodeHash: null, mfaCodeExpiresAt: null },
    });
    const existingProfile = await tx.profile.findFirst({ where: { userId: updated.id } });
    if (existingProfile) return existingProfile;
    const created = await tx.profile.create({
      data: { userId: updated.id, profileType: updated.role, name: updated.displayName },
    });
    await tx.streak.create({ data: { profileId: created.id } });
    return created;
  });

  const activeUser = await prisma.user.findUniqueOrThrow({ where: { id: user.id } });
  await trackEvent("account_created", { userId: activeUser.id, profileId: profile.id, properties: { role: activeUser.role, verified: true } });
  return ok(res, await completeLogin(activeUser));
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

authRouter.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Please enter a valid email and password");
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return fail(res, 401, "We could not find an account with that email");
  if (user.status !== "active") return fail(res, 403, "This account is not active");
  const validPassword = await comparePassword(password, user.passwordHash);
  if (!validPassword) return fail(res, 401, "That password doesn't look right. Try again.");

  try {
    const challenge = await createVerificationChallenge(user);
    await trackEvent("login_verification_started", { userId: user.id, properties: {} });
    return ok(res, { mfaRequired: true, ...challenge });
  } catch {
    return fail(res, 500, "Verification email delivery is not configured. Contact support.");
  }
});

authRouter.post("/login/verify", async (req, res) => {
  const parsed = codeSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Enter the six-digit verification code");
  const user = await prisma.user.findFirst({ where: { mfaChallengeId: parsed.data.challengeId, status: "active" } });
  if (!user) return fail(res, 401, "Invalid verification code");
  if (!user.mfaCodeHash || !user.mfaCodeExpiresAt || user.mfaCodeExpiresAt.getTime() < Date.now()) {
    return fail(res, 401, "Verification code expired. Sign in again to get a new code.");
  }
  if (user.mfaCodeHash !== hashVerificationCode(parsed.data.code)) return fail(res, 401, "Invalid verification code");
  await trackEvent("login_verified", { userId: user.id, properties: {} });
  return ok(res, await completeLogin(user));
});

authRouter.get("/me", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.auth!.userId } });
  if (!user) return fail(res, 404, "Account not found");
  if (user.status !== "active") return fail(res, 403, "This account is not active");
  const profiles = await prisma.profile.findMany({ where: { userId: user.id } });
  return ok(res, { user: { id: user.id, email: user.email, displayName: user.displayName, role: user.role }, profiles });
});

authRouter.delete("/me", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.auth!.userId } });
  if (!user) return fail(res, 404, "Account not found");

  await prisma.notification.updateMany({
    where: { profile: { userId: user.id }, status: "scheduled" },
    data: { status: "cancelled" },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: {
      status: "deleted",
      email: `deleted-${user.id}@lexloo.local`,
      displayName: "Deleted Account",
      lastLoginAt: new Date(),
    },
  });
  await trackEvent("account_deleted", { userId: user.id, properties: {} });

  return ok(res, { deleted: true });
});
