import React from "react";
import { Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { LuminousNativeScreen } from "../stitch/LuminousNativeScreen";

export function TermsAcceptanceScreen() {
  const navigation = useNavigation<any>();

  async function accept() {
    await AsyncStorage.setItem("lexloo_terms_accepted_at", new Date().toISOString());
    navigation.goBack();
  }

  return (
    <LuminousNativeScreen
      eyebrow="Terms"
      title="Terms of Service"
      subtitle="Continue when you are comfortable with LexLoo's terms and privacy policy."
      medallion="§"
      rows={[
        { label: "Terms of Service", value: "lexloo.app/terms", accent: "blue" },
        { label: "Privacy Policy", value: "lexloo.app/privacy", accent: "muted" },
      ]}
      primaryLabel="Accept"
      secondaryLabel="View Terms"
      onPrimary={accept}
      onSecondary={() => Linking.openURL("https://lexloo.app/terms")}
    />
  );
}
