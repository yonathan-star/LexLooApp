import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { colors, fontFamily, fontSize, glow, radius, shadow, spacing } from "../../theme";

export function ParentDashboardScreen() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <View style={styles.childRow}>
            <View style={styles.childAvatar} />
            <View>
              <Text style={styles.childName}>Aria</Text>
              <Text style={styles.childLevel}>Lv 14 Explorer</Text>
            </View>
          </View>
          <Text style={styles.logo}>LexLoo</Text>
          <View style={styles.streakPill}>
            <Text style={styles.streakText}>12 Streak</Text>
          </View>
        </View>

        <View style={styles.goalCard}>
          <View style={styles.goalRing}>
            <View style={styles.goalInner}>
              <Text style={styles.goalPercent}>84%</Text>
              <Text style={styles.goalLabel}>GOAL MET</Text>
              <Text style={styles.goalXp}>2,200 / 2,600 XP</Text>
            </View>
          </View>
          <View style={styles.goalCopy}>
            <Text style={styles.goalTitle}>Daily Learning Mission</Text>
            <Text style={styles.goalSub}>Aria is just 15 minutes away from her gold badge!</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <ParentStat icon="◷" label="Time Learning" value="42 mins" meta="+8% vs last week" accent={colors.primary} />
          <ParentStat icon="✦" label="Weekly XP" value="1,840" meta="On track" accent={colors.accentOrange} />
        </View>

        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <View style={styles.insightTitleRow}>
              <Text style={styles.insightIcon}>✦</Text>
              <Text style={styles.insightTitle}>Premium AI Insight</Text>
            </View>
            <View style={styles.livePill}>
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>
          <Text style={styles.insightText}>
            Aria is demonstrating exceptional focus in <Text style={styles.inlinePrimary}>Phonics</Text> this week. She tends to excel during
            mid-morning sessions. AI suggests introducing more multi-syllabic challenges to maintain her 88% engagement rate.
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Subject Mastery</Text>
          <Pressable onPress={() => navigation.navigate("ParentChildDetail")}>
            <Text style={styles.link}>View History</Text>
          </Pressable>
        </View>
        <View style={styles.subjects}>
          <SubjectRow title="Phonics" value="92%" accent={colors.primary} />
          <SubjectRow title="Spelling" value="74%" accent={colors.accentOrange} />
          <SubjectRow title="Comprehension" value="65%" accent={colors.primaryContainer} />
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryText}>Plan Next Lesson</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate("ParentWeeklyReport")}>
            <Text style={styles.secondaryText}>Review Weekly Report</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ParentStat({ icon, label, value, meta, accent }: { icon: string; label: string; value: string; meta: string; accent: string }) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statHeader}>
        <Text style={[styles.statIcon, { color: accent }]}>{icon}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={[styles.statMeta, { color: accent }]}>{meta}</Text>
    </View>
  );
}

function SubjectRow({ title, value, accent }: { title: string; value: string; accent: string }) {
  return (
    <View style={styles.subjectCard}>
      <View style={styles.subjectMeta}>
        <Text style={styles.subjectTitle}>{title}</Text>
        <Text style={[styles.subjectValue, { color: accent }]}>{value}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: value as any, backgroundColor: accent }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.safeMargin, paddingTop: spacing.md, paddingBottom: 132, gap: spacing.md },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  childRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  childAvatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: colors.borderStrong, backgroundColor: colors.primaryWash },
  childName: { color: colors.textPrimary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  childLevel: { color: colors.primary, fontFamily: fontFamily.mono, fontSize: 11, marginTop: 2 },
  logo: { color: colors.primary, fontFamily: fontFamily.display, fontSize: fontSize.xl },
  streakPill: { backgroundColor: colors.orangeWash, borderWidth: 1, borderColor: "rgba(254,137,60,0.2)", borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 8 },
  streakText: { color: colors.accentOrangePressed, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  goalCard: {
    borderRadius: 32,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    alignItems: "center",
    ...shadow.card,
  },
  goalRing: { width: 256, height: 256, borderRadius: 128, borderWidth: 24, borderColor: colors.accentOrange, alignItems: "center", justifyContent: "center", ...glow.orange },
  goalInner: { width: 170, height: 170, borderRadius: 85, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" },
  goalPercent: { color: colors.textPrimary, fontFamily: fontFamily.display, fontSize: fontSize.display },
  goalLabel: { color: colors.textSecondary, fontFamily: fontFamily.bodyBold, fontSize: 12, letterSpacing: 1.8 },
  goalXp: { color: colors.accentOrange, fontFamily: fontFamily.mono, fontSize: 11, marginTop: 4 },
  goalCopy: { alignItems: "center", marginTop: spacing.md },
  goalTitle: { color: colors.textPrimary, fontFamily: fontFamily.headline, fontSize: fontSize.lg },
  goalSub: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 14, textAlign: "center", marginTop: 4 },
  statsGrid: { flexDirection: "row", gap: spacing.md },
  statCard: { flex: 1, borderRadius: 24, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, padding: spacing.md, ...shadow.card },
  statHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 },
  statIcon: { fontSize: 18 },
  statLabel: { color: colors.textSecondary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  statValue: { color: colors.textPrimary, fontFamily: fontFamily.headline, fontSize: fontSize.xl },
  statMeta: { fontFamily: fontFamily.bodyBold, fontSize: 11, marginTop: 8 },
  insightCard: { borderRadius: 24, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.borderStrong, padding: spacing.md, ...shadow.card },
  insightHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.md },
  insightTitleRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  insightIcon: { color: colors.primary, fontSize: 18 },
  insightTitle: { color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  livePill: { backgroundColor: colors.primary, borderRadius: radius.sm, paddingHorizontal: 8, paddingVertical: 3 },
  liveText: { color: colors.onPrimary, fontFamily: fontFamily.bodyBold, fontSize: 10 },
  insightText: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 16, lineHeight: 26 },
  inlinePrimary: { color: colors.primary, fontFamily: fontFamily.bodyBold },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  sectionTitle: { color: colors.textPrimary, fontFamily: fontFamily.headline, fontSize: fontSize.lg },
  link: { color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  subjects: { gap: spacing.md },
  subjectCard: { borderRadius: 16, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, padding: spacing.md, ...shadow.card },
  subjectMeta: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  subjectTitle: { color: colors.textPrimary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  subjectValue: { fontFamily: fontFamily.bodyBold, fontSize: 12 },
  track: { height: 10, borderRadius: 5, backgroundColor: colors.cardHighest, overflow: "hidden" },
  fill: { height: "100%", borderRadius: 5 },
  actions: { gap: spacing.md, marginTop: spacing.sm },
  primaryButton: { height: 64, borderRadius: 20, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", ...glow.primary },
  primaryText: { color: colors.onPrimary, fontFamily: fontFamily.headline, fontSize: fontSize.lg },
  secondaryButton: { height: 56, borderRadius: 20, borderWidth: 1, borderColor: colors.primary, backgroundColor: colors.card, alignItems: "center", justifyContent: "center" },
  secondaryText: { color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
});
