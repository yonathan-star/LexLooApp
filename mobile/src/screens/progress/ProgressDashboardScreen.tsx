import { LexLooMark } from "../../components/LexLooMark";
import { ProfileAvatar } from "../../components/ProfileAvatar";
import React, { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { useProgress, useProgressByPack } from "../../api/queries";
import { ErrorState, LoadingState } from "../../components/StateViews";
import { fontFamily, fontSize, glow, radius, shadow, spacing } from "../../theme";
import { useColors } from "../../context/ThemeContext";

const MODULE_ICONS: (keyof typeof Ionicons.glyphMap)[] = ["restaurant-outline", "airplane-outline", "leaf-outline", "grid-outline"];

export function ProgressDashboardScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<any>();
  const { activeProfile } = useAuth();
  const profileId = activeProfile?.id;
  const progress = useProgress(profileId);
  const progressByPack = useProgressByPack(profileId);

  if (progress.isLoading || progressByPack.isLoading) return <LoadingState label="Loading progress..." />;
  if (progress.isError) return <ErrorState message="We couldn't load your progress." onRetry={() => progress.refetch()} />;

  const summary = progress.data;
  const xp = summary?.xp ?? 0;
  const nextXp = summary?.level.nextXp ?? Math.max(100, xp + 500);
  const rankPercent = nextXp > 0 ? Math.min(100, Math.round((xp / nextXp) * 100)) : 100;
  const packs = progressByPack.data?.length ? progressByPack.data.slice(0, 4) : [];
  const isParent = activeProfile?.profileType === "parent";

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <View style={styles.brandRow}>
            <ProfileAvatar />
            <LexLooMark />
          </View>
          <View style={styles.streakPill}>
            <Text style={styles.streakText}>{summary?.streak?.currentCount ?? 0} Streak • {xp.toLocaleString()} XP</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <QuickStat label="Scanned" value={(summary?.scannedCount ?? 0).toLocaleString()} color={colors.primary} />
          <QuickStat label="Learned" value={(summary?.learnedCount ?? 0).toLocaleString()} color={colors.accentOrange} />
          <QuickStat label="Mastered" value={(summary?.masteredCount ?? 0).toLocaleString()} color={colors.textSecondary} />
        </View>

        <View style={styles.rankCard}>
          <View style={styles.rankRing}>
            <View style={styles.rankRingInner}>
              <Ionicons name="sparkles" size={32} color={colors.primary} />
            </View>
          </View>
          <View style={styles.rankCopy}>
            <Text style={styles.rankTitle}>{summary?.level.current ?? "Explorer"}</Text>
            <Text style={styles.rankSubtitle}>{summary?.level.next ? `Path to ${summary.level.next}` : "Top level reached"}</Text>
            <View style={styles.rankTrack}>
              <View style={[styles.rankFill, { width: `${rankPercent}%` as any }]} />
            </View>
            <View style={styles.rankMeta}>
              <Text style={styles.rankXp}>{xp.toLocaleString()} XP</Text>
              <Text style={styles.rankCap}>{nextXp.toLocaleString()} XP</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Learning Ladder</Text>
        <View style={styles.ladder}>
          <LadderStep title={summary?.level.next ?? "LexLoo Legend"} state={summary?.level.next ? "locked" : "done"} />
          <LadderStep title={`${summary?.level.current ?? "Explorer"} (Current)`} state="active" />
          <LadderStep title="Explorer" state="done" />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Module Progress</Text>
          <Pressable onPress={() => navigation.navigate("ProgressByPack")}>
            <Text style={styles.link}>See All</Text>
          </Pressable>
        </View>
        <View style={styles.modules}>
          {(packs.length ? packs : [
            { id: "culinary", name: "Culinary", percent: 85 },
            { id: "travel", name: "Travel", percent: 42 },
            { id: "nature", name: "Nature", percent: 12 },
            { id: "phrases", name: "Daily Phrases", percent: 68 },
          ]).map((pack, index) => (
            <ModuleCard
              key={pack.id}
              icon={MODULE_ICONS[index % MODULE_ICONS.length]}
              title={pack.name}
              subtitle={`${pack.percent}% Complete`}
              percent={`${pack.percent}%`}
              accent={index % 2 === 0 ? colors.accentOrange : colors.primary}
            />
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Learning Tools</Text>
        </View>
        <View style={styles.listCard}>
          <ListRow icon="bookmark-outline" label="Saved Words" onPress={() => navigation.navigate("SavedWords")} />
          <ListRow icon="time-outline" label="History" onPress={() => navigation.navigate("LearningHistory")} />
          <ListRow icon="trophy-outline" label="Achievements" onPress={() => navigation.navigate("Achievements")} />
          <ListRow icon="trending-up-outline" label="Levels" onPress={() => navigation.navigate("Levels")} />
          <ListRow icon="receipt-outline" label="XP Ledger" onPress={() => navigation.navigate("XpLedger")} />
          <ListRow icon="flame-outline" label="Streak" onPress={() => navigation.navigate("Streak")} last />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Account &amp; Settings</Text>
        </View>
        <View style={styles.listCard}>
          <ListRow icon="albums-outline" label="Packs" onPress={() => navigation.navigate("PackLibrary")} />
          <ListRow icon="person-outline" label="Profile" onPress={() => navigation.navigate("Profile")} />
          <ListRow icon="settings-outline" label="Settings" onPress={() => navigation.navigate("Settings")} />
          <ListRow icon="share-social-outline" label="Invites" onPress={() => navigation.navigate("FamilyInvites")} />
          {isParent ? <ListRow icon="people-outline" label="Family" onPress={() => navigation.navigate("ParentDashboard")} /> : null}
          <ListRow icon="help-circle-outline" label="Help" onPress={() => navigation.navigate("HelpCenter")} />
          <ListRow icon="shield-checkmark-outline" label="Privacy" onPress={() => navigation.navigate("PrivacyConsent")} />
          <ListRow icon="document-text-outline" label="Terms" onPress={() => navigation.navigate("TermsAcceptance")} last />
        </View>
        <Pressable style={styles.dangerRow} onPress={() => navigation.navigate("DeleteAccount")}>
          <Text style={styles.dangerText}>Delete Account</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickStat({ label, value, color }: { label: string; value: string; color: string }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.quickStat}>
      <Text style={[styles.quickLabel, { color }]}>{label}</Text>
      <Text style={styles.quickValue}>{value}</Text>
    </View>
  );
}

function LadderStep({ title, state }: { title: string; state: "locked" | "active" | "done" }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const accent = state === "active" ? colors.primary : state === "done" ? colors.accentOrange : colors.textMuted;
  return (
    <View style={[styles.ladderStep, state === "locked" && styles.lockedStep]}>
      <View style={styles.ladderRail}>
        <View style={[styles.railLine, { backgroundColor: state === "locked" ? colors.cardHighest : colors.primary }]} />
        <View style={[styles.ladderNode, { backgroundColor: state === "active" ? colors.primaryContainer : state === "done" ? colors.orangeWash : "transparent", borderColor: colors.cardHighest }]}>
          <Ionicons name={state === "locked" ? "lock-closed" : state === "active" ? "sparkles" : "checkmark"} size={18} color={accent} />
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

function ModuleCard({
  icon,
  title,
  subtitle,
  percent,
  accent,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  percent: string;
  accent: string;
}) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.moduleCard}>
      <View style={styles.moduleHeader}>
        <View style={[styles.moduleIcon, { backgroundColor: accent === colors.accentOrange ? colors.orangeWash : colors.primaryWash }]}>
          <Ionicons name={icon} size={20} color={accent} />
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

function ListRow({
  icon,
  label,
  onPress,
  last,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  last?: boolean;
}) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <Pressable style={[styles.listRow, !last && styles.listRowDivider]} onPress={onPress}>
      <View style={styles.listRowLeft}>
        <View style={styles.listRowIcon}>
          <Ionicons name={icon} size={16} color={colors.primary} />
        </View>
        <Text style={styles.listRowText}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </Pressable>
  );
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({

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
  moduleTitle: { color: colors.textPrimary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  moduleSubtitle: { color: colors.textSecondary, fontFamily: fontFamily.mono, fontSize: 11, marginTop: 2 },
  moduleTrack: { height: 8, borderRadius: 4, backgroundColor: colors.backgroundDeep, overflow: "hidden" },
  moduleFill: { height: "100%", borderRadius: 4 },
  listCard: {
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    ...shadow.card,
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  listRowDivider: { borderBottomWidth: 1, borderBottomColor: colors.border },
  listRowLeft: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  listRowIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.primaryWash,
    alignItems: "center",
    justifyContent: "center",
  },
  listRowText: { color: colors.textPrimary, fontFamily: fontFamily.bodyBold, fontSize: 13 },
  dangerRow: {
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.error,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  dangerText: { color: colors.error, fontFamily: fontFamily.bodyBold, fontSize: 13 },
  });
}
