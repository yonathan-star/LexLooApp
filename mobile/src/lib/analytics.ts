import { apiRequest } from "../api/client";

// Fire-and-forget client event tracking. Every screen view / key interaction
// funnels through here per PRD rule "the screen must be tracked with
// analytics screen_view event." Failures are swallowed — analytics must
// never block the user's actual task.
export function trackScreenEvent(eventName: string, properties?: Record<string, unknown>, profileId?: string) {
  apiRequest("/analytics/event", { method: "POST", body: { eventName, profileId, properties } }).catch(() => undefined);
}
