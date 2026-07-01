import React from "react";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import { useProgress } from "../../api/queries";
import { ErrorState, LoadingState } from "../../components/StateViews";
import { LuminousNativeScreen } from "../stitch/LuminousNativeScreen";

const LEVELS = ["Explorer", "Scholar", "Wordsmith", "Linguist", "Master", "LexLoo Legend"];

export function LevelsScreen() {
  const navigation = useNavigation<any>();
  const { activeProfile } = useAuth();
  const progress = useProgress(activeProfile?.id);

  if (progress.isLoading) return <LoadingState label="Loading levels..." />;
  if (progress.isError) return <ErrorState message="We couldn't load your levels." onRetry={() => progress.refetch()} />;

  const current = progress.data?.level.current ?? "Explorer";
  const xp = progress.data?.xp ?? 0;
  const nextXp = progress.data?.level.nextXp;

  return (
    <LuminousNativeScreen
      eyebrow="Progression"
      title={current}
      subtitle={nextXp ? `${nextXp - xp} XP until ${progress.data?.level.next ?? "the next level"}.` : "You reached the top visible LexLoo level."}
      medallion="✦"
      rows={LEVELS.map((level) => ({
        label: level,
        value: level === current ? `${xp.toLocaleString()} XP` : LEVELS.indexOf(level) < LEVELS.indexOf(current) ? "Unlocked" : "Locked",
        accent: level === current ? "blue" : LEVELS.indexOf(level) < LEVELS.indexOf(current) ? "orange" : "muted",
        icon: level === current ? "star" : LEVELS.indexOf(level) < LEVELS.indexOf(current) ? "checkmark-circle" : "lock-closed",
      }))}
      primaryLabel="View XP Ledger"
      secondaryLabel="Back"
      onPrimary={() => navigation.navigate("XpLedger")}
      onSecondary={() => navigation.goBack()}
    />
  );
}
