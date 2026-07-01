import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useParentChildren, useParentWeeklyReport } from "../../api/queries";
import { ErrorState, LoadingState } from "../../components/StateViews";
import { LuminousNativeScreen } from "../stitch/LuminousNativeScreen";

export function ParentWeeklyReportScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const children = useParentChildren();
  const fallbackProfileId = children.data?.[0]?.profile?.id ?? children.data?.[0]?.id ?? children.data?.[0]?.profileId;
  const profileId = route.params?.profileId ?? fallbackProfileId;
  const report = useParentWeeklyReport(profileId);

  if (children.isLoading || report.isLoading) return <LoadingState label="Loading weekly report..." />;
  if (report.isError) return <ErrorState message="We couldn't load this weekly report." onRetry={() => report.refetch()} />;

  const data = report.data ?? {};
  const badges = Array.isArray(data.badgesEarned) ? data.badgesEarned : [];

  return (
    <LuminousNativeScreen
      eyebrow="Family Report"
      title={`${data.profileName ?? "Learner"} This Week`}
      subtitle={data.summaryText ?? "A parent-friendly summary of learning progress, streak health, and suggested next focus."}
      medallion={`${data.streak ?? 0}`}
      rows={[
        { label: "Words learned", value: `${data.wordsLearned ?? 0}`, accent: "blue", icon: "book" },
        { label: "Words mastered", value: `${data.wordsMastered ?? 0}`, accent: "orange", icon: "trophy" },
        { label: "Current streak", value: `${data.streak ?? 0} days`, accent: "muted", icon: "flame" },
        { label: "Badges earned", value: badges.length ? badges.join(", ") : "None this week", accent: "orange", icon: "ribbon" },
        { label: "Suggested focus", value: data.suggestedFocus ?? "Complete a quick practice session today.", accent: "blue", icon: "bulb-outline" },
      ]}
      primaryLabel="Child Detail"
      secondaryLabel="Switch Child"
      onPrimary={() => navigation.navigate("ParentChildDetail", { profileId })}
      onSecondary={() => navigation.navigate("SwitchChildProfile")}
    />
  );
}
