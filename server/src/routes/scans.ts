import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../lib/auth";
import { ok, fail } from "../lib/respond";
import { trackEvent } from "../services/analytics";
import { recordStreakActivity, awardXp, evaluateBadges } from "../services/gamification";
import { canAccessProfile } from "./profiles";

export const scansRouter = Router();

scansRouter.get("/", requireAuth, async (req, res) => {
  const profileId = req.query.profileId as string;
  if (!profileId) return fail(res, 400, "profileId is required");
  const hasAccess = await canAccessProfile(req.auth!.userId, req.auth!.role, profileId);
  if (!hasAccess) return fail(res, 403, "You don't have access to this profile");

  const scans = await prisma.scanEvent.findMany({
    where: { profileId },
    orderBy: { scannedAt: "desc" },
    take: 50,
    include: { word: true, tile: true },
  });
  return ok(res, scans);
});

const createScanSchema = z.object({
  profileId: z.string().min(1),
  code: z.string().min(1),
  source: z.enum(["camera", "manual"]).default("camera"),
  deviceInfo: z.string().optional(),
});

// Screen 16/17: QR Scan Success/Error — every scan creates a learning event
// per PRD Non-Negotiable Product Principles ("Every scan should create a
// learning event"), regardless of whether the code resolves.
scansRouter.post("/", requireAuth, async (req, res) => {
  const parsed = createScanSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid input");
  const { profileId, code, source, deviceInfo } = parsed.data;

  const hasAccess = await canAccessProfile(req.auth!.userId, req.auth!.role, profileId);
  if (!hasAccess) return fail(res, 403, "You don't have access to this profile");

  const tile = await prisma.tile.findUnique({
    where: { tileCode: code.toUpperCase() },
    include: { word: { include: { content: true } }, pack: true },
  });

  const result = tile && tile.word ? "success" : "not_found";
  const reason = !tile ? "invalid_code" : !tile.word ? "not_assigned" : "resolved";

  const scan = await prisma.scanEvent.create({
    data: {
      userId: req.auth!.userId,
      profileId,
      tileId: tile?.id,
      wordId: tile?.wordId ?? undefined,
      source,
      deviceInfo,
      result,
    },
  });

  await trackEvent(result === "success" ? "scan_success" : "scan_error", {
    userId: req.auth!.userId,
    profileId,
    properties: { code, reason },
  });

  if (result === "not_found") {
    const message =
      reason === "not_assigned"
        ? "This LexLoo code is real, but it is not assigned to a word yet."
        : "We could not read that code. Try again or enter it manually.";
    return ok(res, { scan, word: null, pack: tile?.pack ?? null, tile: tile ?? null, reason, message });
  }

  await awardXp(profileId, "scan", scan.id);
  await recordStreakActivity(profileId);
  const newBadges = await evaluateBadges(profileId);

  return ok(res, { scan, word: tile!.word, pack: tile!.pack, tile, reason, newBadges });
});
