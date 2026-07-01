import React from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDeleteAccount } from "../../api/queries";
import { useAuth } from "../../context/AuthContext";
import { LuminousNativeScreen } from "../stitch/LuminousNativeScreen";

export function DeleteAccountScreen() {
  const navigation = useNavigation<any>();
  const { logout } = useAuth();
  const deleteAccount = useDeleteAccount();

  async function confirmDelete() {
    Alert.alert(
      "Delete account?",
      "This will deactivate your LexLoo account and sign you out.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAccount.mutateAsync();
              await logout();
            } catch (error: any) {
              Alert.alert("Couldn't delete account", error?.message ?? "Please try again.");
            }
          },
        },
      ]
    );
  }

  return (
    <LuminousNativeScreen
      eyebrow="Account"
      title="Delete Account"
      subtitle="This deactivates your LexLoo account and removes personal sign-in details. Learning records are anonymized for product safety and integrity."
      medallion="!"
      rows={[
        { label: "Account access", value: "Removed", accent: "orange" },
        { label: "Personal profile", value: "Anonymized", accent: "blue" },
        { label: "Family controls", value: "Disabled", accent: "muted" },
      ]}
      primaryLabel={deleteAccount.isPending ? "Deleting..." : "Delete Account"}
      secondaryLabel="Cancel"
      onPrimary={confirmDelete}
      onSecondary={() => navigation.goBack()}
    />
  );
}
