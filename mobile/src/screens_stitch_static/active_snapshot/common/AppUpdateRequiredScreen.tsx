import React from "react";
import { Linking } from "react-native";
import { LuminousNativeScreen } from "../stitch/LuminousNativeScreen";

export function AppUpdateRequiredScreen() {
  return (
    <LuminousNativeScreen
      eyebrow="Update"
      title="Update LexLoo to continue"
      subtitle="This version is no longer supported. Install the latest app to keep learning."
      medallion="↑"
      rows={[{ label: "Required version", value: "Latest", accent: "orange" }]}
      primaryLabel="Open Store"
      onPrimary={() => Linking.openURL("https://lexloo.app/update")}
    />
  );
}
