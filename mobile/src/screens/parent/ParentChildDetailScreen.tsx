import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useParentChildDetail, useParentChildren } from "../../api/queries";
import { ErrorState, LoadingState } from "../../components/StateViews";
import { LuminousNativeScreen } from "../stitch/LuminousNativeScreen";

export function ParentChildDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const children = useParentChildren();
  const fallbackProfileId = children.data?.[0]?.profile?.id ?? children.data?.[0]?.id ?? children.data?.[0]?.profileId;
  const profileId = route.params?.profileId ?? fallbackProfileId;
  const detail = useParentChildDetail(profileId);

  if (children.isLoading || detail.isLoading) return <LoadingState label="Loading child detail..." />;
  if (detail.isError) return <ErrorState message="We couldn't load child progress." onRetry={() => detail.refetch()} />;

  const data = detail.data;
  const name = data?.profile?.name ?? "Learner";
  const masteredCount = data?.masteredWords?.length ?? 0;
  const learnedCount = data?.learnedCount ?? 0;
  const activityCount = data?.recentActivity?.length ?? 0;

  return (
    <LuminousNativeScreen
      eyebrow="Family"
      title={`${name}'s Learning Detail`}
      subtitle="A focused view of daily progress, mastered words, streak health, and recent learning activity."
      medallion={`${data?.streak?.currentCount ?? 0}`}
      rows={[
        { label: "Total XP", value: `${data?.xp ?? 0}`, accent: "orange", icon: "flash" },
        { label: "Words mastered", value: `${masteredCount}`, accent: "blue", icon: "trophy" },
        { label: "Recent activity", value: `${activityCount} scans`, accent: "muted", icon: "scan-outline" },
        { label: "Words learned", value: `${learnedCount}`, accent: "blue", icon: "book" },
      ]}
      primaryLabel="Weekly Report"
      secondaryLabel="Switch Child"
      onPrimary={() => navigation.navigate("ParentWeeklyReport", { profileId })}
      onSecondary={() => navigation.navigate("SwitchChildProfile")}
    />
  );
}
