import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { colors, fontFamily, fontSize, glow, radius, shadow, spacing } from "../../theme";

export function ProgressDashboardScreen() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <View style={styles.brandRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarIcon}>●</Text>
            </View>
            <Text style={styles.logo}>LexLoo</Text>
          </View>
          <View style={styles.streakPill}>
            <Text style={styles.streakText}>12 Streak • 1.2k XP</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <QuickStat label="Scanned" value="1,250" color={colors.primary} />
          <QuickStat label="Learned" value="842" color={colors.accentOrange} />
          <QuickStat label="Mastered" value="318" color={colors.textSecondary} />
        </View>

        <View style={styles.rankCard}>
          <View style={styles.rankRing}>
            <View style={styles.rankRingInner}>
              <Text style={styles.rankIcon}>✦</Text>
            </View>
          </View>
          <View style={styles.rankCopy}>
            <Text style={styles.rankTitle}>Wordsmith</Text>
            <Text style={styles.rankSubtitle}>Rank 4 of 10 • Path to Legend</Text>
            <View style={styles.rankTrack}>
              <View style={styles.rankFill} />
            </View>
            <View style={styles.rankMeta}>
              <Text style={styles.rankXp}>1,840 XP</Text>
              <Text style={styles.rankCap}>2,500 XP</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Learning Ladder</Text>
        <View style={styles.ladder}>
          <LadderStep title="LexLoo Legend" state="locked" />
          <LadderStep title="Wordsmith (Current)" state="active" />
          <LadderStep title="Explorer" state="done" />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Module Progress</Text>
          <Pressable onPress={() => navigation.navigate("ProgressByPack")}>
            <Text style={styles.link}>See All</Text>
          </Pressable>
        </View>
        <View style={styles.modules}>
          <ModuleCard icon="◐" title="Culinary" subtitle="85% Complete" percent="85%" accent={colors.accentOrange} />
          <ModuleCard icon="✈" title="Travel" subtitle="42% Complete" percent="42%" accent={colors.primary} />
          <ModuleCard icon="♧" title="Nature" subtitle="12% Complete" percent="12%" accent={colors.textSecondary} />
          <ModuleCard icon="☷" title="Daily Phrases" subtitle="68% Complete" percent="68%" accent={colors.primary} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={styles.quickStat}>
      <Text style={[styles.quickLabel, { color }]}>{label}</Text>
      <Text style={styles.quickValue}>{value}</Text>
    </View>
  );
}

function LadderStep({ title, state }: { title: string; state: "locked" | "active" | "done" }) {
  const accent = state === "active" ? colors.primary : state === "done" ? colors.accentOrange : colors.textMuted;
  return (
    <View style={[styles.ladderStep, state === "locked" && styles.lockedStep]}>
      <View style={styles.ladderRail}>
        <View style={[styles.railLine, { backgroundColor: state === "locked" ? colors.cardHighest : colors.primary }]} />
        <View style={[styles.ladderNode, { backgroundColor: state === "active" ? colors.primaryContainer : state === "done" ? colors.orangeWash : "transparent", borderColor: colors.cardHighest }]}>
          <Text style={[styles.ladderNodeText, { color: accent }]}>{state === "locked" ? "◇" : state === "active" ? "✦" : "✓"}</Text>
        </View>
      </View>
      <View style={[styles.ladderCard, state === "active" && styles.activeLadderCard]}>
        <Text style={[styles.ladderTitle, state === "active" && { color: colors.primary }]}>{title}</Text>
        {state === "active" ? (
          <View style={styles.activePill}>
            <Text style={styles.activePillText}>Active</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

function ModuleCard({ icon, title, subtitle, percent, accent }: { icon: string; title: string; subtitle: string; percent: string; accent: string }) {
  return (
    <View style={styles.moduleCard}>
      <View style={styles.moduleHeader}>
        <View style={[styles.moduleIcon, { backgroundColor: accent === colors.accentOrange ? colors.orangeWash : colors.primaryWash }]}>
          <Text style={[styles.moduleIconText, { color: accent }]}>{icon}</Text>
        </View>
        <View>
          <Text style={styles.moduleTitle}>{title}</Text>
          <Text style={styles.moduleSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <View style={styles.moduleTrack}>
        <View style={[styles.moduleFill, { width: percent as any, backgroundColor: accent }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.safeMargin, paddingTop: spacing.md, paddingBottom: 132, gap: spacing.lg },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  brandRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryWash,
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarIcon: { color: colors.primary },
  logo: { color: colors.primary, fontFamily: fontFamily.display, fontSize: fontSize.display, lineHeight: 38 },
  streakPill: { backgroundColor: colors.orangeWash, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 8 },
  streakText: { color: colors.accentOrangePressed, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  statsGrid: { flexDirection: "row", gap: spacing.md },
  quickStat: {
    flex: 1,
    minHeight: 92,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.sm,
    ...shadow.card,
  },
  quickLabel: { fontFamily: fontFamily.bodyBold, fontSize: 12, marginBottom: 6 },
  quickValue: { color: colors.textPrimary, fontFamily: fontFamily.headline, fontSize: fontSize.xl },
  rankCard: {
    borderRadius: 32,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    padding: spacing.lg,
    alignItems: "center",
    gap: spacing.md,
    ...shadow.card,
  },
  rankRing: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 8,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...glow.primary,
  },
  rankRingInner: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  rankIcon: { color: colors.primary, fontFamily: fontFamily.display, fontSize: 38 },
  rankCopy: { width: "100%", alignItems: "center" },
  rankTitle: { color: colors.textPrimary, fontFamily: fontFamily.headline, fontSize: fontSize.xl },
  rankSubtitle: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 14, marginTop: 4, marginBottom: spacing.md },
  rankTrack: { width: "100%", height: 12, borderRadius: 6, backgroundColor: colors.backgroundDeep, overflow: "hidden" },
  rankFill: { width: "73%", height: "100%", borderRadius: 6, backgroundColor: colors.primary },
  rankMeta: { width: "100%", flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  rankXp: { color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  rankCap: { color: colors.textSecondary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  sectionTitle: { color: colors.textPrimary, fontFamily: fontFamily.headline, fontSize: fontSize.lg },
  link: { color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  ladder: { gap: spacing.md },
  ladderStep: { flexDirection: "row", gap: spacing.md, alignItems: "center" },
  lockedStep: { opacity: 0.42 },
  ladderRail: { width: 48, alignItems: "center" },
  railLine: { width: 4, height: 20, borderRadius: 2, marginBottom: 4 },
  ladderNode: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  ladderNodeText: { fontFamily: fontFamily.display, fontSize: 18 },
  ladderCard: {
    flex: 1,
    minHeight: 64,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...shadow.card,
  },
  activeLadderCard: { borderColor: colors.borderStrong },
  ladderTitle: { color: colors.textPrimary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  activePill: { backgroundColor: colors.primaryWash, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 4 },
  activePillText: { color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 11 },
  modules: { gap: spacing.md },
  moduleCard: {
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    ...shadow.card,
  },
  moduleHeader: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.md },
  moduleIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  moduleIconText: { fontFamily: fontFamily.display, fontSize: 20 },
  moduleTitle: { color: colors.textPrimary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  moduleSubtitle: { color: colors.textSecondary, fontFamily: fontFamily.mono, fontSize: 11, marginTop: 2 },
  moduleTrack: { height: 8, borderRadius: 4, backgroundColor: colors.backgroundDeep, overflow: "hidden" },
  moduleFill: { height: "100%", borderRadius: 4 },
});
