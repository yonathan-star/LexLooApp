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
        { label: "My tile will not scan", value: "Use manual code entry", accent: "blue", icon: "scan-outline" },
        { label: "How mastery works", value: "Repeated practice wins", accent: "orange", icon: "school-outline" },
        { label: "Child safety", value: "No public chat or leaderboards", accent: "muted", icon: "shield-checkmark-outline" },
      ]}
      primaryLabel="Contact Support"
      onPrimary={() => Linking.openURL("mailto:support@lexloo.com")}
    />
  );
}
