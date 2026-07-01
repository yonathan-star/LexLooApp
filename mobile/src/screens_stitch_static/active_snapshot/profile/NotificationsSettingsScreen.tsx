import React from "react";
import { LuminousNativeScreen } from "../stitch/LuminousNativeScreen";

export function NotificationsSettingsScreen() {
  return (
    <LuminousNativeScreen
      eyebrow="Preferences"
      title="Notification Settings"
      subtitle="Tune the reminders that keep learning visible without making the app noisy."
      medallion="◷"
      rows={[
        { label: "Daily word reminder", value: "On", accent: "blue" },
        { label: "Streak reminder", value: "On", accent: "orange" },
        { label: "Parent weekly summary", value: "On", accent: "muted" },
      ]}
      primaryLabel="Save Preferences"
    />
  );
}
