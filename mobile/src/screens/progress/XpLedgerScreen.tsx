import React from "react";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import { useXpLedger } from "../../api/queries";
import { ErrorState, LoadingState } from "../../components/StateViews";
import { LuminousNativeScreen } from "../stitch/LuminousNativeScreen";

export function XpLedgerScreen() {
  const navigation = useNavigation<any>();
  const { activeProfile } = useAuth();
  const ledger = useXpLedger(activeProfile?.id);

  if (ledger.isLoading) return <LoadingState label="Loading XP ledger..." />;
  if (ledger.isError) return <ErrorState message="We couldn't load your XP ledger." onRetry={() => ledger.refetch()} />;

  const events = ledger.data?.events ?? [];
  const total = ledger.data?.total ?? 0;

  return (
    <LuminousNativeScreen
      eyebrow="Rewards"
      title="XP Ledger"
      subtitle="Every scan, quiz, save, and mastery action contributes to your LexLoo level."
      medallion={total.toLocaleString()}
      rows={(events.length ? events.slice(0, 12) : [{ id: "empty", eventType: "No XP yet", points: 0, createdAt: "" }]).map((event, index) => ({
        label: event.eventType
          .replace(/_/g, " ")
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        value: event.points ? `+${event.points} XP` : "Start learning",
        accent: index % 2 === 0 ? "orange" : "blue",
      }))}
      primaryLabel="Practice Now"
      secondaryLabel="Back"
      onPrimary={() => navigation.navigate("PracticeTab")}
      onSecondary={() => navigation.goBack()}
    />
  );
}
