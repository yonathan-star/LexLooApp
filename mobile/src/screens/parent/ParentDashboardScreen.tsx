import { LexLooMark } from "../../components/LexLooMark";
import { ProfileAvatar } from "../../components/ProfileAvatar";
import React, { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useFamilyInvites, useParentChildren } from "../../api/queries";
import { EmptyState, ErrorState, LoadingState } from "../../components/StateViews";
import { fontFamily, fontSize, glow, radius, shadow, spacing } from "../../theme";
import { useColors } from "../../context/ThemeContext";

export function ParentDashboardScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<any>();
  const children = useParentChildren();
  const invites = useFamilyInvites();

  if (children.isLoading || invites.isLoading) return <LoadingState label="Loading family dashboard..." />;
  if (children.isError) return <ErrorState message="We couldn't load your family dashboard." onRetry={() => children.refetch()} />;

  const child = children.data?.[0];
  if (!child) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.emptyTopBar}>
            <LexLooMark />
          </View>
          <EmptyState
            title="No child profiles yet"
            message="Add a child profile to start building a family dashboard with progress, streaks, and weekly reports."
            actionLabel="Add Child"
            onAction={() => navigation.navigate("AddChildProfile")}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }
  const childName = child?.name ?? child?.profile?.name ?? "Learner";
  const level = child?.level?.current ?? child?.progress?.level?.current ?? "Explorer";
  const streak = child?.streak?.currentCount ?? child?.progress?.streak?.currentCount ?? 0;
  const xp = child?.xp ?? child?.progress?.xp ?? 0;
  const xpGoal = child?.nextXp ?? child?.progress?.level?.nextXp ?? Math.max(100, xp + 400);
  const goalPercent = xpGoal > 0 ? Math.min(100, Math.round((xp / xpGoal) * 100)) : 100;
  const weeklyXp = child?.weeklyXp ?? xp;
  const learned = child?.learnedCount ?? child?.progress?.learnedCount ?? 0;
  const mastered = child?.masteredCount ?? child?.progress?.masteredCount ?? 0;
  const childProfileId = child?.profile?.id ?? child?.id ?? child?.profileId;
  const childParams = childProfileId ? { profileId: childProfileId } : undefined;
  const pendingInvites = (invites.data ?? []).filter((invite) => invite.status === "pending").slice(0, 3);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <ProfileAvatar />
          <LexLooMark />
          <View style={styles.streakPill}>
            <Text style={styles.streakText}>{streak} Streak</Text>
          </View>
        </View>

        <Pressable style={styles.addChildBanner} onPress={() => navigation.navigate("AddChildProfile")}>
          <Ionicons name="person-add-outline" size={18} color={colors.primary} />
          <Text style={styles.addChildText}>Add child or create invite</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.primary} />
        </Pressable>

        <Pressable style={styles.addChildBanner} onPress={() => navigation.navigate("FamilyInvites")}>
          <Ionicons name="share-social-outline" size={18} color={colors.primary} />
          <Text style={styles.addChildText}>Share family invite</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.primary} />
        </Pressable>

        <View style={styles.goalCard}>
          <View style={styles.goalRing}>
            <View style={styles.goalInner}>
              <Text style={styles.goalPercent}>{goalPercent}%</Text>
              <Text style={styles.goalLabel}>GOAL MET</Text>
              <Text style={styles.goalXp}>{xp.toLocaleString()} / {xpGoal.toLocaleString()} XP</Text>
            </View>
          </View>
          <View style={styles.goalCopy}>
            <Text style={styles.goalTitle}>Daily Learning Mission</Text>
            <Text style={styles.goalSub}>{childName} is building momentum toward the next learning goal.</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <ParentStat icon="book-outline" label="Words Learned" value={learned.toLocaleString()} meta={`${mastered.toLocaleString()} mastered`} accent={colors.primary} />
          <ParentStat icon="trending-up-outline" label="Weekly XP" value={weeklyXp.toLocaleString()} meta="On track" accent={colors.accentOrange} />
        </View>

        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <View style={styles.insightTitleRow}>
              <Ionicons name="sparkles" size={16} color={colors.primary} />
              <Text style={styles.insightTitle}>Premium AI Insight</Text>
            </View>
            <View style={styles.livePill}>
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>
          <Text style={styles.insightText}>
            {childName} is progressing through <Text style={styles.inlinePrimary}>{level}</Text> work. Review weekly patterns to choose the next practice focus.
          </Text>
        </View>

        {pendingInvites.length ? (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Pending Invites</Text>
              <Pressable onPress={() => navigation.navigate("SwitchChildProfile")}>
                <Text style={styles.link}>Manage</Text>
              </Pressable>
            </View>
            <View style={styles.inviteList}>
              {pendingInvites.map((invite) => (
                <View key={invite.id} style={styles.inviteCard}>
                  <View style={styles.inviteIcon}>
                    <Ionicons name="mail-unread-outline" size={18} color={colors.accentOrange} />
                  </View>
                  <View style={styles.inviteMain}>
                    <Text style={styles.inviteTitle}>{invite.child?.name ?? "Child invite"}</Text>
                    <Text style={styles.inviteMeta}>{invite.email || "Manual invite"} · {invite.inviteCode}</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        ) : null}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Subject Mastery</Text>
          <Pressable onPress={() => navigation.navigate("ParentChildDetail", childParams)}>
            <Text style={styles.link}>View History</Text>
          </Pressable>
        </View>
        <View style={styles.subjects}>
          <SubjectRow title="Scanned" value={`${Math.min(100, child?.progress?.scannedCount ?? child?.scannedCount ?? 0)}%`} accent={colors.primary} />
          <SubjectRow title="Learned" value={`${Math.min(100, learned)}%`} accent={colors.accentOrange} />
          <SubjectRow title="Mastered" value={`${Math.min(100, mastered)}%`} accent={colors.primaryContainer} />
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.primaryButton} onPress={() => navigation.navigate("ParentChildDetail", childParams)}>
            <Text style={styles.primaryText}>Plan Next Lesson</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate("ParentWeeklyReport", childParams)}>
            <Text style={styles.secondaryText}>Review Weekly Report</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ParentStat({
  icon,
  label,
  value,
  meta,
  accent,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  meta: string;
  accent: string;
}) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.statCard}>
      <View style={styles.statHeader}>
        <Ionicons name={icon} size={16} color={accent} />
        <Text style={styles.statLabel}>{label}</Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={[styles.statMeta, { color: accent }]}>{meta}</Text>
    </View>
  );
}

function SubjectRow({ title, value, accent }: { title: string; value: string; accent: string }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
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

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({

  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.safeMargin, paddingTop: spacing.md, paddingBottom: 132, gap: spacing.md },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  emptyTopBar: { alignItems: "center", marginBottom: spacing.md },
  addChildBanner: {
    minHeight: 54,
    borderRadius: 20,
    backgroundColor: colors.primaryWash,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  addChildText: { flex: 1, color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 13 },
  childRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  childAvatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: colors.borderStrong, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  childAvatarText: { color: colors.white, fontFamily: fontFamily.display, fontSize: 16, lineHeight: 20 },
  childName: { color: colors.textPrimary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  childLevel: { color: colors.primary, fontFamily: fontFamily.mono, fontSize: 11, marginTop: 2 },
  logo: { color: colors.primary, fontFamily: fontFamily.display, fontSize: fontSize.xl },
  streakPill: { backgroundColor: colors.orangeWash, borderWidth: 1, borderColor: colors.orangeWash, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 8 },
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
  statLabel: { color: colors.textSecondary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  statValue: { color: colors.textPrimary, fontFamily: fontFamily.headline, fontSize: fontSize.xl },
  statMeta: { fontFamily: fontFamily.bodyBold, fontSize: 11, marginTop: 8 },
  insightCard: { borderRadius: 24, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.borderStrong, padding: spacing.md, ...shadow.card },
  insightHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.md },
  insightTitleRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  insightTitle: { color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  livePill: { backgroundColor: colors.primary, borderRadius: radius.sm, paddingHorizontal: 8, paddingVertical: 3 },
  liveText: { color: colors.onPrimary, fontFamily: fontFamily.bodyBold, fontSize: 10 },
  insightText: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 16, lineHeight: 26 },
  inlinePrimary: { color: colors.primary, fontFamily: fontFamily.bodyBold },
  inviteList: { gap: spacing.sm },
  inviteCard: { borderRadius: 18, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, padding: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.sm, ...shadow.card },
  inviteIcon: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center", backgroundColor: colors.orangeWash },
  inviteMain: { flex: 1 },
  inviteTitle: { color: colors.textPrimary, fontFamily: fontFamily.bodyBold, fontSize: 13 },
  inviteMeta: { color: colors.textSecondary, fontFamily: fontFamily.mono, fontSize: 11, marginTop: 3 },
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
}
