import React from "react";
import { LuminousNativeScreen } from "../stitch/LuminousNativeScreen";

export function MaintenanceModeScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <LuminousNativeScreen
      eyebrow="System"
      title="LexLoo is getting an upgrade"
      subtitle="We are tuning the learning engine and will be back online shortly."
      medallion="◇"
      rows={[{ label: "Service status", value: "Maintenance", accent: "orange" }]}
      primaryLabel="Retry"
      onPrimary={onRetry}
    />
  );
}
