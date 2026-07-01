import React from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fontFamily, fontSize, glow, radius, shadow, spacing } from "../../theme";

const MEDALLION =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCLnoRowmemOZapi-PX21RX5aiVM4nw4ILUkjmwrRKdDGDZ_dDgPCn002dxCx-eXcwR6IQzn7I5kTvRDisJYfXVfiVVW8T8Hxayefic6Cq0MVSbd9ABaLmNHNMYvc7b07gCoiuT1WiFFHCf8N-NUgDqDzCkkhpPeK6Rvz1AetljicSiknmKV2sFCHXd6Xj5Jd84Tc7tkA0hBOf1wOqAoqy7hQ2kp1WHAl7wNI5_FlJwkZuRTGgKXgbsbmFEjr1gJdkW3iRmZW1j1BPr";

export function PracticeResultsScreen() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <View style={styles.headerSide}>
          <Text style={styles.headerIcon}>⌁</Text>
          <Text style={styles.headerLabel}>Explorer Level 12</Text>
        </View>
        <Text style={styles.headerTitle}>Mission Success!</Text>
        <Text style={styles.headerIcon}>✦</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <View style={styles.successBadge}>
            <Text style={styles.successIcon}>✓</Text>
          </View>
          <Text style={styles.title}>Daily Practice</Text>
          <Text style={styles.subtitle}>Spanish Fundamentals - Module 4</Text>
          <View style={styles.scoreRow}>
            <View style={styles.scoreCard}>
              <Text style={styles.scoreLabel}>SCORE</Text>
              <Text style={styles.scoreValue}>9/10</Text>
            </View>
            <View style={[styles.scoreCard, styles.xpCard]}>
              <Text style={styles.xpLabel}>XP GAINED</Text>
              <Text style={styles.xpValue}>+50 XP</Text>
            </View>
          </View>
        </View>

        <View style={styles.medallionStage}>
          <View style={styles.medallionGlow} />
          <View style={styles.medallionCard}>
            <Image source={{ uri: MEDALLION }} style={styles.medallionImage} />
            <Text style={styles.unlockLabel}>ACHIEVEMENT UNLOCKED</Text>
            <Text style={styles.unlockTitle}>Vocab Voyager</Text>
          </View>
        </View>

        <View style={styles.trendCard}>
          <View style={styles.trendIcon}>
            <Text style={styles.trendIconText}>⌁</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.trendHeader}>
              <Text style={styles.trendTitle}>Accuracy Trend</Text>
              <Text style={styles.trendValue}>+12%</Text>
            </View>
            <View style={styles.track}>
              <View style={styles.trendFill} />
            </View>
          </View>
        </View>

        <Pressable style={styles.continueButton} onPress={() => navigation.navigate("HomeTab")}>
          <Text style={styles.continueText}>Continue Journey</Text>
          <Text style={styles.continueArrow}>→</Text>
        </Pressable>
        <Pressable style={styles.shareButton}>
          <Text style={styles.shareIcon}>◇</Text>
          <Text style={styles.shareText}>Share Achievement</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    height: 64,
    paddingHorizontal: spacing.safeMargin,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(252,249,248,0.7)",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerSide: { flexDirection: "row", alignItems: "center", gap: 6 },
  headerIcon: { color: colors.primary, fontSize: 18, fontFamily: fontFamily.display },
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
  successIcon: { color: colors.onAccentOrange, fontSize: 48, lineHeight: 54 },
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
  trendIconText: { color: colors.primary, fontSize: 22 },
  trendHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  trendTitle: { color: colors.textPrimary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  trendValue: { color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  track: { height: 8, borderRadius: 4, backgroundColor: colors.cardHighest, overflow: "hidden" },
  trendFill: { width: "85%", height: "100%", backgroundColor: colors.primary, borderRadius: 4 },
  continueButton: { width: "100%", height: 64, borderRadius: 32, backgroundColor: colors.primary, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, ...glow.primary },
  continueText: { color: colors.onPrimary, fontFamily: fontFamily.headline, fontSize: fontSize.lg },
  continueArrow: { color: colors.onPrimary, fontSize: 22 },
  shareButton: { flexDirection: "row", alignItems: "center", gap: spacing.sm, borderRadius: 24, borderWidth: 1, borderColor: colors.divider, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  shareIcon: { color: colors.textSecondary },
  shareText: { color: colors.textSecondary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
});
