import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LuminousNativeScreen } from "../stitch/LuminousNativeScreen";

export function FeatureComingSoonScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const featureName = route.params?.featureName ?? "This feature";

  return (
    <LuminousNativeScreen
      eyebrow="Roadmap"
      title={`${featureName} is coming soon`}
      subtitle="This part of LexLoo is still being polished for a future release."
      medallion="✦"
      rows={[{ label: "Status", value: "In progress", accent: "blue" }]}
      primaryLabel="Back"
      onPrimary={() => navigation.goBack()}
    />
  );
}
