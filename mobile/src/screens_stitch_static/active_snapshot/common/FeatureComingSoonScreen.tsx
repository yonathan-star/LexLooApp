import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LuminousNativeScreen } from "../stitch/LuminousNativeScreen";

export function FeatureComingSoonScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const featureName = route.params?.featureName ?? "This area";

  return (
    <LuminousNativeScreen
      eyebrow="Roadmap"
      title={`${featureName} is on the roadmap`}
      subtitle="Keep learning from LexWorld, daily practice, and Lex while this area is shaped around the core word habit."
      medallion="✦"
      rows={[
        { label: "Learn now", value: "LexWorld", accent: "blue" },
        { label: "Coach", value: "Ask Lex", accent: "orange" },
      ]}
      primaryLabel="Open LexWorld"
      secondaryLabel="Ask Lex"
      onPrimary={() => navigation.navigate("LexWorldTab")}
      onSecondary={() => navigation.navigate("LexTab")}
    />
  );
}
