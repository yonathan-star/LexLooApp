import React from "react";
import { Linking } from "react-native";
import { LuminousNativeScreen } from "../stitch/LuminousNativeScreen";

export function HelpCenterScreen() {
  return (
    <LuminousNativeScreen
      eyebrow="Support"
      title="Help Center"
      subtitle="Quick answers for scans, mastery, family safety, and account support."
      medallion="?"
      rows={[
        { label: "My tile will not scan", value: "Use manual code entry", accent: "blue" },
        { label: "How mastery works", value: "Repeated practice wins", accent: "orange" },
        { label: "Child safety", value: "No public chat or leaderboards", accent: "muted" },
      ]}
      primaryLabel="Contact Support"
      onPrimary={() => Linking.openURL("mailto:support@lexloo.app")}
    />
  );
}
