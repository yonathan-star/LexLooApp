import React from "react";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import { useLearningHistory } from "../../api/queries";
import { ErrorState, LoadingState } from "../../components/StateViews";
import { LuminousNativeScreen } from "../stitch/LuminousNativeScreen";

export function LearningHistoryScreen() {
  const navigation = useNavigation<any>();
  const { activeProfile } = useAuth();
  const history = useLearningHistory(activeProfile?.id);

  if (history.isLoading) return <LoadingState label="Loading history..." />;
  if (history.isError) return <ErrorState message="We couldn't load your learning history." onRetry={() => history.refetch()} />;

  const events = history.data ?? [];

  return (
    <LuminousNativeScreen
      eyebrow="Progress"
      title="Learning History"
      subtitle="A timeline of scans, saved words, quizzes, and mastery moments from your LexLoo loop."
      medallion={`${events.length}`}
      rows={(events.length ? events.slice(0, 12) : [{ type: "empty", label: "No learning events yet", at: "Scan a tile to begin" }]).map((event, index) => ({
        label: event.label,
        value: event.at ? new Date(event.at).toLocaleDateString() : "",
        accent: index % 3 === 0 ? "blue" : index % 3 === 1 ? "orange" : "muted",
        icon: event.type === "scan" ? "scan-outline" : event.type === "quiz" ? "help-circle-outline" : "time-outline",
      }))}
      primaryLabel="Practice"
      secondaryLabel="Back to Progress"
      onPrimary={() => navigation.navigate("PracticeTab")}
      onSecondary={() => navigation.goBack()}
    />
  );
}
