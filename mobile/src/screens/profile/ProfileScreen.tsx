import React from "react";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import { useProgress } from "../../api/queries";
import { API_URL } from "../../api/client";
import { ErrorState, LoadingState } from "../../components/StateViews";
import { LuminousNativeScreen } from "../stitch/LuminousNativeScreen";

export function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { user, activeProfile } = useAuth();
  const progress = useProgress(activeProfile?.id);

  if (progress.isLoading) return <LoadingState label="Loading profile..." />;
  if (progress.isError) return <ErrorState message="We couldn't load your profile." onRetry={() => progress.refetch()} />;

  const rawAvatar = activeProfile?.avatar ?? null;
  const avatarUri = rawAvatar
    ? rawAvatar.startsWith("http") ? rawAvatar : `${API_URL}${rawAvatar}`
    : null;

  return (
    <LuminousNativeScreen
      eyebrow="Profile"
      title={activeProfile?.name ?? user?.displayName ?? "LexLoo Learner"}
      subtitle={`${user?.role ?? "student"} profile for the daily scan, learn, practice, and mastery loop.`}
      medallion={(activeProfile?.name ?? user?.displayName ?? "L").slice(0, 1).toUpperCase()}
      avatarUri={avatarUri}
      rows={[
        { label: "Level", value: progress.data?.level.current ?? "Explorer", accent: "blue", icon: "star" },
        { label: "Total XP", value: `${progress.data?.xp ?? 0}`, accent: "orange", icon: "flash" },
        { label: "Current streak", value: `${progress.data?.streak?.currentCount ?? 0} days`, accent: "orange", icon: "flame" },
        { label: "Words learned", value: `${progress.data?.learnedCount ?? 0}`, accent: "blue", icon: "book" },
        { label: "Words mastered", value: `${progress.data?.masteredCount ?? 0}`, accent: "muted", icon: "trophy" },
        { label: "Saved words", value: `${progress.data?.savedCount ?? 0}`, accent: "blue", icon: "bookmark" },
      ]}
      primaryLabel="Edit Profile"
      secondaryLabel="Invites"
      onPrimary={() => navigation.navigate("EditProfile")}
      onSecondary={() => navigation.navigate("FamilyInvites")}
      avoidFloatingTabBar
    />
  );
}
