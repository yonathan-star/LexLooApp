import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { LuminousNativeScreen } from "../stitch/LuminousNativeScreen";

export function PrivacyConsentScreen() {
  const navigation = useNavigation<any>();

  async function accept() {
    await AsyncStorage.setItem("lexloo_privacy_accepted_at", new Date().toISOString());
    navigation.goBack();
  }

  return (
    <LuminousNativeScreen
      eyebrow="Privacy"
      title="Your privacy matters"
      subtitle="LexLoo tracks learning progress, not location, advertising profiles, public chat, or unnecessary family data."
      medallion="◌"
      rows={[
        { label: "Words, scans, quiz results", value: "Used for progress", accent: "blue" },
        { label: "Family controls", value: "Parent managed", accent: "orange" },
      ]}
      primaryLabel="Accept"
      onPrimary={accept}
    />
  );
}
