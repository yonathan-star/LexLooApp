import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../lib/auth";
import { ok, fail } from "../lib/respond";
import { trackEvent } from "../services/analytics";
import { awardXpOncePerDay } from "../services/gamification";
import { canAccessProfile } from "./profiles";

export const analyticsRouter = Router();

const eventSchema = z.object({
  eventName: z.string().min(1),
  profileId: z.string().optional(),
  properties: z.record(z.unknown()).optional(),
});

// Generic sink for client-fired screen_view / interaction events (PRD
// Execution Section 5: Analytics Requirements). Server-side flows that
// already mutate data (scans, quizzes, etc.) log their own events directly.
analyticsRouter.post("/event", requireAuth, async (req, res) => {
  const parsed = eventSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid input");
  if (parsed.data.profileId) {
    const hasAccess = await canAccessProfile(req.auth!.userId, req.auth!.role, parsed.data.profileId);
    if (!hasAccess) return fail(res, 403, "You don't have access to this profile");
  }

  await trackEvent(parsed.data.eventName, {
    userId: req.auth!.userId,
    profileId: parsed.data.profileId,
    properties: parsed.data.properties,
  });

  const wordId = typeof parsed.data.properties?.wordId === "string" ? parsed.data.properties.wordId : undefined;
  if (parsed.data.profileId && wordId && parsed.data.eventName === "audio_play") {
    await awardXpOncePerDay(parsed.data.profileId, "audio_play", wordId);
  }

  return ok(res, { tracked: true });
});
