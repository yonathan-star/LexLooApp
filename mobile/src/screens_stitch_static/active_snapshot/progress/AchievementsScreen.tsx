import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fontFamily, fontSize, glow, radius, shadow, spacing } from "../../theme";

const ACHIEVEMENTS = [
  { title: "7-Day Streak", body: "You're on fire! Keep the momentum going.", icon: "⌁", color: colors.accentOrange, earned: true },
  { title: "Scholar", body: "Completed your first 10 scans successfully.", icon: "◉", color: colors.primary, earned: true },
  { title: "Early Bird", body: "Logged breakfast 5 days before 8:00 AM.", icon: "☼", color: colors.accentOrange, earned: true },
  { title: "Marathoner", body: "Scan 30 meals in a single month.", icon: "◇", color: colors.textMuted, earned: false },
  { title: "Master Chef", body: "Complete all 12 practice recipes.", icon: "◌", color: colors.textMuted, earned: false },
  { title: "Data Scientist", body: "Review your weekly progress 4 times.", icon: "◎", color: colors.textMuted, earned: false },
  { title: "Green Eater", body: "Scan 15 vegetarian meals in a row.", icon: "♧", color: colors.textMuted, earned: false },
  { title: "Community Star", body: "Share 5 progress updates with friends.", icon: "✦", color: colors.textMuted, earned: false },
];

export function AchievementsScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Text style={styles.logo}>LexLoo</Text>
          <View style={styles.streakRow}>
            <Text style={styles.streakText}>12 Streak • 1.2k XP</Text>
            <View style={styles.avatar} />
          </View>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroCopy}>
            <Text style={styles.heroTitle}>Your Trophies</Text>
            <Text style={styles.heroSub}>3 of 8 badges collected</Text>
            <Pressable style={styles.shareProgress}>
              <Text style={styles.shareProgressText}>Share Progress</Text>
            </Pressable>
          </View>
          <View style={styles.progressRing}>
            <View style={styles.progressInner}>
              <Text style={styles.progressText}>37%</Text>
            </View>
          </View>
        </View>

        <View style={styles.grid}>
          {ACHIEVEMENTS.map((achievement) => (
            <View key={achievement.title} style={[styles.achievementCard, !achievement.earned && styles.lockedCard]}>
              <Text style={[styles.check, { color: achievement.earned ? colors.primary : colors.textMuted }]}>{achievement.earned ? "✓" : "◇"}</Text>
              <View style={[styles.badgeIcon, { backgroundColor: achievement.earned ? (achievement.color === colors.primary ? colors.primaryWash : colors.orangeWash) : colors.cardHighest }]}>
                <Text style={[styles.badgeIconText, { color: achievement.color }]}>{achievement.icon}</Text>
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
              <Text style={styles.upcomingIconText}>◇</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.upcomingMeta}>
                <Text style={styles.upcomingName}>Fitness Pro</Text>
                <Text style={styles.upcomingCount}>12 / 20 Scans</Text>
              </View>
              <View style={styles.track}>
                <View style={styles.fill} />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.safeMargin, paddingTop: spacing.md, paddingBottom: 132, gap: spacing.md },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  logo: { color: colors.primary, fontFamily: fontFamily.display, fontSize: fontSize.display, lineHeight: 38 },
  streakRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  streakText: { color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.cardHighest, borderWidth: 2, borderColor: colors.white },
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
  progressRing: { width: 128, height: 128, borderRadius: 64, borderWidth: 12, borderColor: colors.accentOrange, alignItems: "center", justifyContent: "center", ...glow.orange },
  progressInner: { width: 86, height: 86, borderRadius: 43, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" },
  progressText: { color: colors.accentOrange, fontFamily: fontFamily.display, fontSize: fontSize.xl },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  achievementCard: {
    width: "47.8%",
    minHeight: 190,
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
  check: { position: "absolute", top: 12, right: 12, fontSize: 18, fontFamily: fontFamily.display },
  badgeIcon: { width: 80, height: 80, borderRadius: 20, alignItems: "center", justifyContent: "center", marginTop: spacing.sm },
  badgeIconText: { fontFamily: fontFamily.display, fontSize: 38 },
  badgeTitle: { color: colors.textPrimary, fontFamily: fontFamily.bodyBold, fontSize: 12, textAlign: "center" },
  badgeBody: { color: colors.textSecondary, fontFamily: fontFamily.mono, fontSize: 11, textAlign: "center", lineHeight: 16 },
  upcomingCard: { borderRadius: 28, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, padding: spacing.md, ...shadow.card },
  upcomingTitle: { color: colors.textPrimary, fontFamily: fontFamily.headline, fontSize: fontSize.lg, marginBottom: spacing.md },
  upcomingRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  upcomingIcon: { width: 64, height: 64, borderRadius: 16, backgroundColor: colors.cardHighest, alignItems: "center", justifyContent: "center" },
  upcomingIconText: { color: colors.textMuted, fontSize: 28 },
  upcomingMeta: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  upcomingName: { color: colors.textPrimary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  upcomingCount: { color: colors.textSecondary, fontFamily: fontFamily.mono, fontSize: 11 },
  track: { height: 8, borderRadius: 4, backgroundColor: colors.cardHighest, overflow: "hidden" },
  fill: { height: "100%", width: "60%", backgroundColor: colors.primary, borderRadius: 4 },
});
