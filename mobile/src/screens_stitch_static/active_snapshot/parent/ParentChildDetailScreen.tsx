import React from "react";
import { useNavigation } from "@react-navigation/native";
import { LuminousNativeScreen } from "../stitch/LuminousNativeScreen";

export function ParentChildDetailScreen() {
  const navigation = useNavigation<any>();

  return (
    <LuminousNativeScreen
      eyebrow="Family"
      title="Aria's Learning Detail"
      subtitle="A focused view of daily progress, mastered words, streak health, and recent learning activity."
      medallion="84%"
      rows={[
        { label: "Weekly XP", value: "1,840", accent: "orange" },
        { label: "Words mastered", value: "318", accent: "blue" },
        { label: "Recent activity", value: "12 scans", accent: "muted" },
      ]}
      primaryLabel="Weekly Report"
      secondaryLabel="Switch Child"
      onPrimary={() => navigation.navigate("ParentWeeklyReport")}
      onSecondary={() => navigation.navigate("SwitchChildProfile")}
    />
  );
}
