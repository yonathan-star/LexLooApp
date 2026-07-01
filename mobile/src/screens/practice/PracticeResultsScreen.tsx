import React, { useEffect, useMemo } from "react";
import { Image, Pressable, ScrollView, Share, StyleSheet, Text, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { useProgress } from "../../api/queries";
import { fontFamily, fontSize, glow, radius, shadow, spacing } from "../../theme";
import { haptics } from "../../lib/haptics";
import { Confetti } from "../../components/Confetti";
import { useColors } from "../../context/ThemeContext";

const MEDALLION =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCLnoRowmemOZapi-PX21RX5aiVM4nw4ILUkjmwrRKdDGDZ_dDgPCn002dxCx-eXcwR6IQzn7I5kTvRDisJYfXVfiVVW8T8Hxayefic6Cq0MVSbd9ABaLmNHNMYvc7b07gCoiuT1WiFFHCf8N-NUgDqDzCkkhpPeK6Rvz1AetljicSiknmKV2sFCHXd6Xj5Jd84Tc7tkA0hBOf1wOqAoqy7hQ2kp1WHAl7wNI5_FlJwkZuRTGgKXgbsbmFEjr1gJdkW3iRmZW1j1BPr";

export function PracticeResultsScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { activeProfile } = useAuth();
  const progress = useProgress(activeProfile?.id);
  const levelLabel = progress.data?.level?.current ?? "Explorer";
  const correctCount = route.params?.correctCount ?? route.params?.correct ?? 0;
  const total = route.params?.total ?? route.params?.totalQuestions ?? 0;
  const score = route.params?.score ?? Math.round((correctCount / Math.max(1, total)) * 100);
  const xpGained = route.params?.xpGained ?? 0;
  const newBadges = route.params?.newBadges ?? [];
  const firstBadge = Array.isArray(newBadges) ? newBadges[0] : undefined;
  const isStrongResult = score >= 70;
  const activityType = route.params?.activityType as string | undefined;
  const packId = route.params?.packId as string | undefined;
  const wordId = route.params?.wordId as string | undefined;

  function practiceAgain() {
    haptics.tap();
    if (activityType === "flashcard") {
      // The swipeable flashcard hub starts a fresh session when it gets a
      // new restart token.
      navigation.navigate("PracticeHub", { restartAt: Date.now(), packId });
    } else if (activityType === "sentence_builder") {
      navigation.navigate("SentenceBuilder", { wordId });
    } else if (activityType) {
      navigation.navigate("PracticeSession", { activityType, packId, wordId });
    } else {
      navigation.navigate("PracticeHub");
    }
  }

  useEffect(() => {
    if (isStrongResult) haptics.celebrate();
    else haptics.warning();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <Confetti active={isStrongResult} />
      <View style={styles.header}>
        <View style={styles.headerSide}>
          <Ionicons name="flash" size={18} color={colors.primary} />
          <Text style={styles.headerLabel}>{levelLabel}</Text>
        </View>
        <Text style={styles.headerTitle}>Mission Success!</Text>
        <Ionicons name="sparkles" size={18} color={colors.primary} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <View style={styles.successBadge}>
            <Ionicons name="checkmark" size={48} color={colors.onAccentOrange} />
          </View>
          <Text style={styles.title}>Daily Practice</Text>
          <Text style={styles.subtitle}>{route.params?.title ?? "Practice Session"}</Text>
          <View style={styles.scoreRow}>
            <View style={styles.scoreCard}>
              <Text style={styles.scoreLabel}>SCORE</Text>
              <Text style={styles.scoreValue}>{correctCount}/{total}</Text>
            </View>
            <View style={[styles.scoreCard, styles.xpCard]}>
              <Text style={styles.xpLabel}>XP GAINED</Text>
              <Text style={styles.xpValue}>+{xpGained} XP</Text>
            </View>
          </View>
        </View>

        <View style={styles.medallionStage}>
          <View style={styles.medallionGlow} />
          <View style={styles.medallionCard}>
            <Image source={{ uri: MEDALLION }} style={styles.medallionImage} />
            <Text style={styles.unlockLabel}>{firstBadge ? "ACHIEVEMENT UNLOCKED" : "MISSION COMPLETE"}</Text>
            <Text style={styles.unlockTitle}>{firstBadge?.name ?? firstBadge?.code ?? "Practice Streak"}</Text>
          </View>
        </View>

        <View style={styles.trendCard}>
          <View style={styles.trendIcon}>
            <Ionicons name="trending-up" size={22} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.trendHeader}>
              <Text style={styles.trendTitle}>Accuracy Trend</Text>
              <Text style={styles.trendValue}>{score}%</Text>
            </View>
            <View style={styles.track}>
              <View style={[styles.trendFill, { width: `${score}%` as any }]} />
            </View>
          </View>
        </View>

        <Pressable style={styles.practiceAgainButton} onPress={practiceAgain}>
          <Ionicons name="refresh" size={18} color={colors.primary} />
          <Text style={styles.practiceAgainText}>Restart Practice</Text>
        </Pressable>
        <Pressable
          style={styles.continueButton}
          onPress={() => {
            haptics.tap();
            navigation.navigate("Main", { screen: "HomeTab" });
          }}
        >
          <Text style={styles.continueText}>Continue Journey</Text>
          <Ionicons name="arrow-forward" size={20} color={colors.onPrimary} />
        </Pressable>
        <Pressable
          style={styles.shareButton}
          onPress={() => {
            haptics.tap();
            Share.share({
              message: firstBadge
                ? `I just unlocked the "${firstBadge.name ?? firstBadge.code}" badge on LexLoo! Scored ${correctCount}/${total} and earned ${xpGained} XP.`
                : `I scored ${correctCount}/${total} and earned ${xpGained} XP on LexLoo!`,
            });
          }}
        >
          <Ionicons name="share-social-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.shareText}>Share Achievement</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({

  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    height: 64,
    paddingHorizontal: spacing.safeMargin,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.backgroundElevated,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerSide: { flexDirection: "row", alignItems: "center", gap: 6 },
  headerLabel: { color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  headerTitle: { color: colors.primary, fontFamily: fontFamily.display, fontSize: 18 },
  content: { paddingHorizontal: spacing.safeMargin, paddingTop: spacing.lg, paddingBottom: 132, alignItems: "center", gap: spacing.lg },
  summaryCard: {
    width: "100%",
    borderRadius: 32,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    alignItems: "center",
    gap: spacing.md,
    ...shadow.card,
  },
  successBadge: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.accentOrange, alignItems: "center", justifyContent: "center", ...glow.orange },
  title: { color: colors.textPrimary, fontFamily: fontFamily.headline, fontSize: fontSize.xl },
  subtitle: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 14 },
  scoreRow: { flexDirection: "row", gap: spacing.md, width: "100%" },
  scoreCard: { flex: 1, borderRadius: 20, backgroundColor: "rgba(246,243,242,0.55)", borderWidth: 1, borderColor: colors.border, padding: spacing.md, alignItems: "center" },
  xpCard: { backgroundColor: colors.orangeWash },
  scoreLabel: { color: colors.textSecondary, fontFamily: fontFamily.bodyBold, fontSize: 11, letterSpacing: 1.6 },
  xpLabel: { color: colors.onAccentOrange, fontFamily: fontFamily.bodyBold, fontSize: 11, letterSpacing: 1.6 },
  scoreValue: { color: colors.primary, fontFamily: fontFamily.display, fontSize: fontSize.display },
  xpValue: { color: colors.accentOrange, fontFamily: fontFamily.display, fontSize: fontSize.display },
  medallionStage: { width: 280, height: 280, alignItems: "center", justifyContent: "center" },
  medallionGlow: { position: "absolute", width: 280, height: 280, borderRadius: 140, backgroundColor: colors.primaryWash },
  medallionCard: {
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
    ...glow.primary,
  },
  medallionImage: { width: 128, height: 128, marginBottom: spacing.md },
  unlockLabel: { color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 12, letterSpacing: 0.4 },
  unlockTitle: { color: colors.textPrimary, fontFamily: fontFamily.headline, fontSize: fontSize.lg, marginTop: 4 },
  trendCard: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderRadius: 24,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    ...shadow.card,
  },
  trendIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primaryWash, alignItems: "center", justifyContent: "center" },
  trendHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  trendTitle: { color: colors.textPrimary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  trendValue: { color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  track: { height: 8, borderRadius: 4, backgroundColor: colors.cardHighest, overflow: "hidden" },
  trendFill: { width: "85%", height: "100%", backgroundColor: colors.primary, borderRadius: 4 },
  practiceAgainButton: {
    width: "100%",
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryWash,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  practiceAgainText: { color: colors.primary, fontFamily: fontFamily.headline, fontSize: 15 },
  continueButton: { width: "100%", height: 64, borderRadius: 32, backgroundColor: colors.primary, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, ...glow.primary },
  continueText: { color: colors.onPrimary, fontFamily: fontFamily.headline, fontSize: fontSize.lg },
  shareButton: { flexDirection: "row", alignItems: "center", gap: spacing.sm, borderRadius: 24, borderWidth: 1, borderColor: colors.divider, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  shareText: { color: colors.textSecondary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  });
}
