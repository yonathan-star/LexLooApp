import { prisma } from "../lib/prisma";

// Every important user action funnels through this so the PRD's analytics
// requirement (Execution Section 5) is satisfied without scattering raw
// inserts across every route.
export async function trackEvent(
  eventName: string,
  opts: { userId?: string; profileId?: string; properties?: Record<string, unknown> } = {}
) {
  await prisma.analyticsEvent.create({
    data: {
      eventName,
      userId: opts.userId,
      profileId: opts.profileId,
      propertiesJson: JSON.stringify(opts.properties ?? {}),
    },
  });
}
