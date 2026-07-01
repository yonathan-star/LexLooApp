import React, { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LexLooMark } from "../../components/LexLooMark";
import { LexMascot } from "../../components/LexMascot";
import { ProfileAvatar } from "../../components/ProfileAvatar";
import { EmptyState, ErrorState, LoadingState } from "../../components/StateViews";
import { useAuth } from "../../context/AuthContext";
import { useMissionsToday, useProgress, useRecommendations } from "../../api/queries";
import { fontFamily, fontSize, glow, radius, shadow, spacing } from "../../theme";
import { useColors } from "../../context/ThemeContext";
import { useNavigation } from "@react-navigation/native";

export function LexCoachScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<any>();
  const { activeProfile } = useAuth();
  const profileId = activeProfile?.id;
  const progress = useProgress(profileId);
  const recommendations = useRecommendations(profileId);
  const missions = useMissionsToday(profileId);

  if (progress.isLoading || recommendations.isLoading || missions.isLoading) return <LoadingState label="Lex is thinking..." />;
  if (progress.isError || recommendations.isError) return <ErrorState message="Lex couldn't load your coach plan." onRetry={() => progress.refetch()} />;

  const dailyWord = recommendations.data?.wordOfDay?.word ?? recommendations.data?.wearOfDay?.word;
  const currentStreak = progress.data?.streak?.currentCount ?? 0;
  const masteredCount = progress.data?.masteredCount ?? 0;
  const mission = missions.data?.find((item) => !item.completed) ?? missions.data?.[0];

  if (!dailyWord) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <EmptyState
          title="Lex needs a pack"
          message="Choose a learning pack so Lex can pick your daily word and coach your next move."
          actionLabel="Browse Packs"
          onAction={() => navigation.navigate("PackLibrary")}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <View style={styles.brandRow}>
            <ProfileAvatar light />
            <LexLooMark size={22} />
          </View>
          <View style={styles.streakPill}>
            <Ionicons name="flame" size={14} color={colors.accentOrange} />
            <Text style={styles.streakText}>{currentStreak} Streak</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <LexMascot size={138} mood="celebrate" />
          <Text style={styles.eyebrow}>Meet Lex</Text>
          <Text style={styles.title}>Your next word segment is ready.</Text>
          <Text style={styles.subtitle}>
            Peel one word at a time. Today's segment is {dailyWord.text}; practice it once, then scan or review to keep building.
          </Text>
        </View>

        <View style={styles.wordCard}>
          <View style={styles.wordHeader}>
            <View>
              <Text style={styles.wordLabel}>Today</Text>
              <Text style={styles.word}>{dailyWord.text}</Text>
            </View>
            <Pressable style={styles.iconButton} onPress={() => navigation.navigate("WordDetail", { wordId: dailyWord.id })}>
              <Ionicons name="arrow-forward" size={20} color={colors.onPrimary} />
            </Pressable>
          </View>
          <Text style={styles.definition}>{dailyWord.content?.shortDefinition ?? "Open the word to see its definition and practice prompts."}</Text>
        </View>

        <View style={styles.planGrid}>
          <CoachAction
            icon="flash"
            title="Practice"
            body="Lock in today's word with instant feedback."
            onPress={() => navigation.navigate("PracticeSession", { activityType: "flashcard", wordId: dailyWord.id })}
          />
          <CoachAction
            icon="scan"
            title="Scan"
            body="Find a LexLoo code and unlock another segment."
            onPress={() => navigation.navigate("ScannerTab")}
          />
          <CoachAction
            icon="bookmark"
            title="Review"
            body={`${masteredCount} mastered. Revisit saved words when you need a boost.`}
            onPress={() => navigation.navigate("SavedWords")}
          />
          <CoachAction
            icon="trophy"
            title="Mission"
            body={mission ? `${mission.title}: ${Math.min(mission.current, mission.target)}/${mission.target}` : "Finish one small action to earn XP."}
            onPress={() => navigation.navigate("PracticeHub")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function CoachAction({
  icon,
  title,
  body,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
  onPress: () => void;
}) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <Pressable style={styles.actionCard} onPress={onPress}>
      <View style={styles.actionIcon}>
        <Ionicons name={icon} size={22} color={colors.primary} />
      </View>
      <Text style={styles.actionTitle}>{title}</Text>
      <Text style={styles.actionBody}>{body}</Text>
    </Pressable>
  );
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    content: { paddingHorizontal: spacing.safeMargin, paddingTop: spacing.md, paddingBottom: 132, gap: spacing.lg },
    topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    brandRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
    streakPill: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: colors.orangeWash, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 8 },
    streakText: { color: colors.accentOrangePressed, fontFamily: fontFamily.bodyBold, fontSize: 12 },
    hero: { alignItems: "center", borderRadius: 32, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, ...shadow.card },
    eyebrow: { color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 12, letterSpacing: 1.4, textTransform: "uppercase", marginTop: spacing.sm },
    title: { color: colors.textPrimary, fontFamily: fontFamily.display, fontSize: fontSize.xl, lineHeight: 34, textAlign: "center", marginTop: spacing.sm },
    subtitle: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 15, lineHeight: 24, textAlign: "center", marginTop: spacing.sm },
    wordCard: { borderRadius: radius.xl, backgroundColor: colors.primary, padding: spacing.lg, ...glow.primary },
    wordHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md },
    wordLabel: { color: colors.onPrimary, opacity: 0.78, fontFamily: fontFamily.bodyBold, fontSize: 12, textTransform: "uppercase" },
    word: { color: colors.onPrimary, fontFamily: fontFamily.display, fontSize: 36, lineHeight: 42 },
    iconButton: { width: 46, height: 46, borderRadius: 23, backgroundColor: "rgba(255,255,255,0.16)", alignItems: "center", justifyContent: "center" },
    definition: { color: colors.onPrimary, fontFamily: fontFamily.body, fontSize: 16, lineHeight: 24, marginTop: spacing.md },
    planGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: spacing.md },
    actionCard: { width: "48%", minHeight: 166, borderRadius: radius.xl, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, padding: spacing.md, ...shadow.card },
    actionIcon: { width: 44, height: 44, borderRadius: 16, backgroundColor: colors.primaryWash, alignItems: "center", justifyContent: "center", marginBottom: spacing.md },
    actionTitle: { color: colors.textPrimary, fontFamily: fontFamily.headline, fontSize: 18, marginBottom: 6 },
    actionBody: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 13, lineHeight: 19 },
  });
}
