import React from "react";
import { Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import { trackScreenEvent } from "../../lib/analytics";
import { LuminousNativeScreen } from "../stitch/LuminousNativeScreen";

export function TermsAcceptanceScreen() {
  const navigation = useNavigation<any>();
  const { activeProfile } = useAuth();

  async function accept() {
    await AsyncStorage.setItem("lexloo_terms_accepted_at", new Date().toISOString());
    trackScreenEvent("terms_accepted", {}, activeProfile?.id);
    navigation.goBack();
  }

  return (
    <LuminousNativeScreen
      eyebrow="Terms"
      title="Terms of Service"
      subtitle="Continue when you are comfortable with LexLoo's terms and privacy policy."
      medallion="§"
      rows={[
        { label: "Terms of Service", value: "lexloo.com/terms", accent: "blue" },
        { label: "Privacy Policy", value: "lexloo.com/privacy", accent: "muted" },
      ]}
      primaryLabel="Accept"
      secondaryLabel="View Terms"
      onPrimary={accept}
      onSecondary={() => Linking.openURL("https://lexloo.com/terms")}
    />
  );
}
