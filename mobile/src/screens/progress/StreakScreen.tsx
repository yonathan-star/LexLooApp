import React from "react";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import { useMissionsToday, useStreak } from "../../api/queries";
import { ErrorState, LoadingState } from "../../components/StateViews";
import { LuminousNativeScreen } from "../stitch/LuminousNativeScreen";

export function StreakScreen() {
  const navigation = useNavigation<any>();
  const { activeProfile } = useAuth();
  const streak = useStreak(activeProfile?.id);
  const missions = useMissionsToday(activeProfile?.id);

  if (streak.isLoading || missions.isLoading) return <LoadingState label="Loading streak..." />;
  if (streak.isError) return <ErrorState message="We couldn't load your streak." onRetry={() => streak.refetch()} />;

  const current = streak.data?.currentCount ?? 0;
  const longest = streak.data?.longestCount ?? 0;
  const missionRows = (missions.data ?? []).slice(0, 4).map((mission) => ({
    label: mission.title,
    value: mission.completed ? "Complete" : `${mission.current}/${mission.target}`,
    accent: mission.completed ? ("orange" as const) : ("blue" as const),
  }));

  return (
    <LuminousNativeScreen
      eyebrow="Habit"
      title={`${current}-Day Streak`}
      subtitle="Keep the daily scan, learn, and practice loop alive to build lasting vocabulary mastery."
      medallion={`${current}`}
      streakLabel={`${current} Streak`}
      rows={[
        { label: "Current streak", value: `${current} days`, accent: "orange", icon: "flame" },
        { label: "Longest streak", value: `${longest} days`, accent: "blue", icon: "trophy" },
        { label: "Last active", value: streak.data?.lastActiveDate ? new Date(streak.data.lastActiveDate).toLocaleDateString() : "Not yet", accent: "muted", icon: "calendar-outline" },
        ...missionRows,
      ]}
      primaryLabel="Scan Tile"
      secondaryLabel="Practice"
      onPrimary={() => navigation.navigate("ScannerTab")}
      onSecondary={() => navigation.navigate("PracticeHub")}
    />
  );
}
