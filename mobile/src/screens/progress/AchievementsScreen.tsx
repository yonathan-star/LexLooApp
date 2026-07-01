import React, { useMemo } from "react";
import { Pressable, ScrollView, Share, StyleSheet, Text, View } from "react-native";
import { LexLooMark } from "../../components/LexLooMark";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { useBadges, useProgress } from "../../api/queries";
import { EmptyState, ErrorState, LoadingState } from "../../components/StateViews";
import { haptics } from "../../lib/haptics";
import { fontFamily, fontSize, glow, radius, shadow, spacing } from "../../theme";
import { useColors } from "../../context/ThemeContext";

// Maps badge code to { icon, accent color } for category-tinted badge cards.
const BADGE_STYLES: Record<string, { icon: keyof typeof Ionicons.glyphMap; accent: string; wash: string }> = {
  first_scan:         { icon: "scan",             accent: "#29b6f6", wash: "rgba(41, 182, 246, 0.15)" },
  scan_explorer:      { icon: "scan-circle",      accent: "#29b6f6", wash: "rgba(41, 182, 246, 0.15)" },
  scan_master:        { icon: "camera",           accent: "#29b6f6", wash: "rgba(41, 182, 246, 0.15)" },
  streak_3:           { icon: "sunny",            accent: "#f5821f", wash: "rgba(245, 130, 31, 0.18)" },
  streak_7:           { icon: "flame",            accent: "#f5821f", wash: "rgba(245, 130, 31, 0.18)" },
  streak_14:          { icon: "bonfire",          accent: "#f5821f", wash: "rgba(245, 130, 31, 0.18)" },
  streak_30:          { icon: "planet",           accent: "#f5821f", wash: "rgba(245, 130, 31, 0.18)" },
  words_10:           { icon: "footsteps",        accent: "#2A7A4C", wash: "rgba(42, 122, 76, 0.10)" },
  words_25:           { icon: "leaf",             accent: "#2A7A4C", wash: "rgba(42, 122, 76, 0.10)" },
  words_50:           { icon: "book",             accent: "#2A7A4C", wash: "rgba(42, 122, 76, 0.10)" },
  words_100:          { icon: "library",          accent: "#2A7A4C", wash: "rgba(42, 122, 76, 0.10)" },
  words_mastered_10:  { icon: "bulb",             accent: "#6B3A8A", wash: "rgba(107, 58, 138, 0.10)" },
  words_mastered_25:  { icon: "sparkles",         accent: "#6B3A8A", wash: "rgba(107, 58, 138, 0.10)" },
  words_mastered_50:  { icon: "medal",            accent: "#6B3A8A", wash: "rgba(107, 58, 138, 0.10)" },
  words_mastered_100: { icon: "trophy",           accent: "#6B3A8A", wash: "rgba(107, 58, 138, 0.10)" },
  quiz_champion:      { icon: "ribbon",           accent: "#f5821f", wash: "rgba(245, 130, 31, 0.18)" },
  quiz_regular:       { icon: "school",           accent: "#f5821f", wash: "rgba(245, 130, 31, 0.18)" },
  quiz_veteran:       { icon: "shield-checkmark", accent: "#f5821f", wash: "rgba(245, 130, 31, 0.18)" },
  word_collector:     { icon: "bookmarks",        accent: "#29b6f6", wash: "rgba(41, 182, 246, 0.15)" },
  word_hoarder:       { icon: "file-tray-full",   accent: "#29b6f6", wash: "rgba(41, 182, 246, 0.15)" },
  word_archivist:     { icon: "archive",          accent: "#29b6f6", wash: "rgba(41, 182, 246, 0.15)" },
};

const FALLBACK_BADGE_STYLE = { icon: "star" as keyof typeof Ionicons.glyphMap, accent: "#29b6f6", wash: "rgba(41, 182, 246, 0.15)" };

// Keep for backwards compat; new code uses BADGE_STYLES.
const BADGE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  // Scanning
  first_scan: "scan",
  scan_explorer: "scan-circle",
  scan_master: "camera",
  // Streaks
  streak_3: "sunny",
  streak_7: "flame",
  streak_14: "bonfire",
  streak_30: "planet",
  // Words learned
  words_10: "footsteps",
  words_25: "leaf",
  words_50: "book",
  words_100: "library",
  // Words mastered
  words_mastered_10: "bulb",
  words_mastered_25: "sparkles",
  words_mastered_50: "medal",
  words_mastered_100: "trophy",
  // Quizzes
  quiz_champion: "ribbon",
  quiz_regular: "school",
  quiz_veteran: "shield-checkmark",
  // Word collecting
  word_collector: "bookmarks",
  word_hoarder: "file-tray-full",
  word_archivist: "archive",
};
const FALLBACK_ICONS: (keyof typeof Ionicons.glyphMap)[] = ["star", "medal", "sparkles", "rocket"];

export function AchievementsScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<any>();
  const { activeProfile } = useAuth();
  const profileId = activeProfile?.id;
  const badges = useBadges(profileId);
  const progress = useProgress(profileId);

  if (badges.isLoading || progress.isLoading) return <LoadingState label="Loading achievements..." />;
  if (badges.isError) return <ErrorState message="We couldn't load your achievements." onRetry={() => badges.refetch()} />;
  if (!badges.data?.length) {
    return <EmptyState title="No badges yet" message="Badges will appear here once they're set up for your account." />;
  }

  const achievements = badges.data.map((badge, index) => {
    const bs = BADGE_STYLES[badge.code] ?? FALLBACK_BADGE_STYLE;
    return {
      title: badge.name,
      body: badge.description,
      icon: bs.icon,
      accent: badge.earned ? bs.accent : colors.textMuted,
      wash: badge.earned ? bs.wash : colors.backgroundDeep,
      earned: Boolean(badge.earned),
    };
  });
  const earnedCount = achievements.filter((achievement) => achievement.earned).length;
  const totalCount = achievements.length || 1;
  const percent = Math.round((earnedCount / totalCount) * 100);
  const upcoming = achievements.find((achievement) => !achievement.earned);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </Pressable>
          <LexLooMark />
          <View style={styles.streakRow}>
            <Text style={styles.streakText}>{progress.data?.streak?.currentCount ?? 0} Streak · {(progress.data?.xp ?? 0).toLocaleString()} XP</Text>
          </View>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroCopy}>
            <Text style={styles.heroTitle}>Your Trophies</Text>
            <Text style={styles.heroSub}>{earnedCount} of {totalCount} badges collected</Text>
            <Pressable
              style={styles.shareProgress}
              onPress={() => {
                haptics.tap();
                Share.share({ message: `I've earned ${earnedCount} of ${totalCount} badges on LexLoo! 🏆` });
              }}
            >
              <Text style={styles.shareProgressText}>Share Progress</Text>
            </Pressable>
          </View>
          <View style={styles.progressRing}>
            <View style={styles.progressInner}>
              <Text style={styles.progressText}>{percent}%</Text>
            </View>
          </View>
        </View>

        <View style={styles.grid}>
          {achievements.map((achievement) => (
            <View key={achievement.title} style={[styles.achievementCard, !achievement.earned && styles.lockedCard]}>
              <Ionicons
                name={achievement.earned ? "checkmark-circle" : "lock-closed"}
                size={18}
                color={achievement.earned ? achievement.accent : colors.textMuted}
                style={styles.check}
              />
              <View style={[styles.badgeIcon, { backgroundColor: achievement.wash }]}>
                <Ionicons name={achievement.icon} size={36} color={achievement.accent} />
              </View>
              <Text style={styles.badgeTitle}>{achievement.title}</Text>
              <Text style={styles.badgeBody}>{achievement.body}</Text>
            </View>
          ))}
        </View>

        <View style={styles.upcomingCard}>
          <Text style={styles.upcomingTitle}>Upcoming Achievement</Text>
          <View style={styles.upcomingRow}>
            <View style={styles.upcomingIcon}>
              <Ionicons name="hourglass-outline" size={26} color={colors.textMuted} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.upcomingMeta}>
                <Text style={styles.upcomingName}>{upcoming?.title ?? "All Badges Earned"}</Text>
                <Text style={styles.upcomingCount}>{earnedCount} / {totalCount}</Text>
              </View>
              <View style={styles.track}>
                <View style={[styles.fill, { width: `${percent}%` as any }]} />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({

  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.safeMargin, paddingTop: spacing.md, paddingBottom: 132, gap: spacing.md },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  streakRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  streakText: { color: colors.textSecondary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  heroCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 28,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    overflow: "hidden",
    ...shadow.card,
  },
  heroCopy: { flex: 1 },
  heroTitle: { color: colors.textPrimary, fontFamily: fontFamily.headline, fontSize: fontSize.xl },
  heroSub: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 14, marginTop: 4 },
  shareProgress: { alignSelf: "flex-start", backgroundColor: colors.primary, borderRadius: radius.pill, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, marginTop: spacing.md, ...glow.primary },
  shareProgressText: { color: colors.onPrimary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  progressRing: { width: 128, height: 128, borderRadius: 64, borderWidth: 3, borderColor: colors.accentOrange, alignItems: "center", justifyContent: "center", ...glow.orange },
  progressInner: { width: 100, height: 100, borderRadius: 50, backgroundColor: colors.background, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border },
  progressText: { color: colors.accentOrange, fontFamily: fontFamily.display, fontSize: fontSize.xl },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  achievementCard: {
    width: "48%",
    minHeight: 190,
    marginBottom: spacing.md,
    borderRadius: 28,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    alignItems: "center",
    gap: spacing.sm,
    ...shadow.card,
  },
  lockedCard: { opacity: 0.58 },
  check: { position: "absolute", top: 12, right: 12 },
  badgeIcon: { width: 80, height: 80, borderRadius: 20, alignItems: "center", justifyContent: "center", marginTop: spacing.sm },
  badgeTitle: { color: colors.textPrimary, fontFamily: fontFamily.bodyBold, fontSize: 12, textAlign: "center" },
  badgeBody: { color: colors.textSecondary, fontFamily: fontFamily.mono, fontSize: 11, textAlign: "center", lineHeight: 16 },
  upcomingCard: { borderRadius: 28, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, padding: spacing.md, ...shadow.card },
  upcomingTitle: { color: colors.textPrimary, fontFamily: fontFamily.headline, fontSize: fontSize.lg, marginBottom: spacing.md },
  upcomingRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  upcomingIcon: { width: 64, height: 64, borderRadius: 16, backgroundColor: colors.cardHighest, alignItems: "center", justifyContent: "center" },
  upcomingMeta: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  upcomingName: { color: colors.textPrimary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  upcomingCount: { color: colors.textSecondary, fontFamily: fontFamily.mono, fontSize: 11 },
  track: { height: 8, borderRadius: 4, backgroundColor: colors.cardHighest, overflow: "hidden" },
  fill: { height: "100%", width: "60%", backgroundColor: colors.primary, borderRadius: 4 },
  });
}
