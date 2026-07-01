import React, { useEffect, useRef, useMemo } from "react";
import { DimensionValue, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LexLooMark } from "../../components/LexLooMark";
import { ProfileAvatar } from "../../components/ProfileAvatar";
import { LinearGradient } from "expo-linear-gradient";
import * as Speech from "expo-speech";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { fontFamily, fontSize, glow, lineHeight, radius, shadow, spacing } from "../../theme";
import { useAuth } from "../../context/AuthContext";
import { useMissionsToday, useProgress, useRecommendations } from "../../api/queries";
import { ErrorState, LoadingState } from "../../components/StateViews";
import { trackScreenEvent } from "../../lib/analytics";
import type { Mission } from "../../types";
import { useColors } from "../../context/ThemeContext";

function useJumpToScannerAfterOnboarding() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const sectionStyles = useMemo(() => createSectionStyles(colors), [colors]);
  const navigation = useNavigation<any>();
  const { justOnboarded, clearJustOnboarded } = useAuth();
  const handledRef = useRef(false);

  useEffect(() => {
    if (justOnboarded && !handledRef.current) {
      handledRef.current = true;
      clearJustOnboarded();
    }
  }, [justOnboarded, navigation, clearJustOnboarded]);
}

export function HomeScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const sectionStyles = useMemo(() => createSectionStyles(colors), [colors]);
  const navigation = useNavigation<any>();
  useJumpToScannerAfterOnboarding();
  const { activeProfile } = useAuth();
  const profileId = activeProfile?.id;
  const progress = useProgress(profileId);
  const recommendations = useRecommendations(profileId);
  const missions = useMissionsToday(profileId);

  if (progress.isLoading) return <LoadingState label="Loading your dashboard..." />;
  if (progress.isError) return <ErrorState message="We couldn't load your dashboard." onRetry={() => progress.refetch()} />;

  const currentXp = progress.data?.xp ?? 0;
  const xpGoal = progress.data?.level.nextXp ?? Math.max(currentXp, 2000);
  const streakCount = progress.data?.streak?.currentCount ?? 0;
  const masteredCount = progress.data?.masteredCount ?? 0;
  const dailyWord = recommendations.data?.wordOfDay?.word ?? recommendations.data?.wearOfDay?.word;
  const missionList = missions.data ?? [];
  const todayLabel = new Date().toLocaleDateString(undefined, { day: "2-digit", month: "short" }).toUpperCase();
  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  })();

  const playDailyWord = () => {
    const text = dailyWord?.text;
    if (!text) return;
    Speech.stop();
    Speech.speak(text, { rate: 0.82, pitch: 1 });
    trackScreenEvent("audio_play", { wordId: dailyWord.id, word: text, source: "home" }, profileId);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Top bar */}
        <View style={styles.topBar}>
          <View style={styles.brandRow}>
            <ProfileAvatar light />
            <View>
              <LexLooMark size={20} />
              <Text style={styles.level}>{progress.data?.level.current ?? "Explorer"}</Text>
            </View>
          </View>
          <View style={styles.streakPill}>
            <Ionicons name="flame" size={13} color={colors.accentOrange} />
            <Text style={styles.streakText}>{streakCount} · {currentXp} XP</Text>
          </View>
        </View>

        {/* Dashboard card */}
        <View style={styles.dashboardCard}>
          <Text style={styles.greeting}>{greeting}, {activeProfile?.name ?? "learner"}!</Text>

          <View style={styles.ringWrap}>
            <View style={styles.ringOuter}>
              <View style={styles.ringInner}>
                <Ionicons name="flash" size={24} color={colors.accentOrange} style={{ marginBottom: 4 }} />
                <Text style={styles.ringDate}>{todayLabel}</Text>
                <Text style={styles.ringValue}>{currentXp} <Text style={styles.ringUnit}>XP</Text></Text>
                <Text style={styles.ringGoal}>of {xpGoal} XP</Text>
              </View>
            </View>
          </View>

          <View style={styles.statRow}>
            <GlassStat icon="flame" value={`${streakCount}`} label="Day Streak" accent={colors.accentOrange} />
            <View style={styles.statDivider} />
            <GlassStat icon="ribbon" value={`${masteredCount}`} label="Mastered" accent={colors.primary} />
          </View>
        </View>

        {/* Daily Discovery */}
        <SectionTitle label="Daily Discovery" action="View History" onAction={() => navigation.navigate("LearningHistory")} />

        <View style={styles.discoveryCard}>
          {/* Editorial masthead — brand-owned, no stock photo */}
          <LinearGradient
            colors={[colors.primaryContainer, colors.primary, colors.accentOrange]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.discoveryMasthead}
          >
            <Text style={styles.decorLetter} numberOfLines={1} adjustsFontSizeToFit>
              {dailyWord?.text?.[0]?.toUpperCase() ?? "W"}
            </Text>
            <View style={styles.mastheadChip}>
              <Text style={styles.mastheadChipText}>WORD OF THE DAY</Text>
            </View>
          </LinearGradient>

          <View style={styles.discoveryBody}>
            <View style={styles.wordHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.word}>{dailyWord?.text ?? "Pick a goal"}</Text>
                <Text style={styles.phonetic}>
                  {dailyWord
                    ? `${dailyWord.content?.phonetic ? `/${dailyWord.content.phonetic}/ · ` : ""}${dailyWord.partOfSpeech ?? ""}`
                    : "Choose a learning pack to get started"}
                </Text>
              </View>
              {dailyWord ? (
                <Pressable style={styles.soundButton} onPress={playDailyWord}>
                  <Ionicons name="volume-high" size={20} color={colors.primary} />
                </Pressable>
              ) : null}
            </View>

            <Text style={styles.definition}>
              {dailyWord?.content?.shortDefinition ?? "Pick a learning goal to unlock your first word of the day."}
            </Text>

            {dailyWord?.examples?.[0] ? (
              <View style={styles.exampleRow}>
                <View style={styles.exampleBar} />
                <Text style={styles.exampleText} numberOfLines={2}>{dailyWord.examples[0].exampleText}</Text>
              </View>
            ) : null}

            <Pressable
              style={styles.primaryButton}
              onPress={() => (dailyWord ? navigation.navigate("WordDetail", { wordId: dailyWord.id }) : navigation.navigate("PracticeTab"))}
            >
              <Ionicons name="school-outline" size={18} color={colors.white} />
              <Text style={styles.primaryButtonText}>{dailyWord ? "Practice Now" : "Choose a Pack"}</Text>
            </Pressable>
          </View>
        </View>

        {/* Daily Missions */}
        <SectionTitle label="Daily Missions" />
        <View style={styles.missionStack}>
          {missionList.length ? (
            missionList.map((mission: Mission) => (
              <MissionRow
                key={mission.id}
                icon={mission.completed ? "checkmark-circle" : mission.code.includes("scan") ? "scan-outline" : "school-outline"}
                title={mission.title}
                progress={mission.completed ? "Done" : `${Math.min(mission.current, mission.target)}/${mission.target}`}
                reward={mission.completed ? "" : `+${mission.xpReward} XP`}
                percent={`${Math.min(100, Math.round((mission.current / Math.max(mission.target, 1)) * 100))}%`}
                accent={mission.completed ? colors.success : mission.code.includes("scan") ? colors.accentOrange : colors.primary}
                done={mission.completed}
              />
            ))
          ) : (
            <>
              <MissionRow icon="scan-outline" title="Scan 5 Environment Items" progress="0/5" reward="+50 XP" percent="0%" accent={colors.accentOrange} />
              <MissionRow icon="school-outline" title="Master 3 New Words" progress="0/3" reward="+120 XP" percent="0%" accent={colors.primary} />
            </>
          )}
        </View>

      </ScrollView>

      <Pressable style={styles.fab} onPress={() => navigation.navigate("ScannerTab")}>
        <Ionicons name="scan" size={28} color={colors.white} />
      </Pressable>
    </SafeAreaView>
  );
}

function SectionTitle({ label, action, onAction }: { label: string; action?: string; onAction?: () => void }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const sectionStyles = useMemo(() => createSectionStyles(colors), [colors]);
  return (
    <View style={sectionStyles.row}>
      <View style={sectionStyles.accentBar} />
      <Text style={sectionStyles.label}>{label}</Text>
      {action && onAction ? (
        <Pressable onPress={onAction} style={{ marginLeft: "auto" }}>
          <Text style={sectionStyles.link}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function createSectionStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({

  row: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: spacing.md, marginBottom: spacing.xs },
  accentBar: { width: 3, height: 18, borderRadius: 2, backgroundColor: colors.accentOrange },
  label: { color: colors.textPrimary, fontFamily: fontFamily.headline, fontSize: fontSize.lg },
  link: { color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  });
}

function GlassStat({ icon, value, label, accent }: { icon: keyof typeof Ionicons.glyphMap; value: string; label: string; accent: string }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const sectionStyles = useMemo(() => createSectionStyles(colors), [colors]);
  return (
    <View style={styles.glassStat}>
      <Ionicons name={icon} size={20} color={accent} style={{ marginBottom: 2 }} />
      <Text style={[styles.statValue, { color: accent }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function MissionRow({
  icon,
  title,
  progress,
  reward,
  percent,
  accent,
  done,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  progress: string;
  reward: string;
  percent: DimensionValue;
  accent: string;
  done?: boolean;
}) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const sectionStyles = useMemo(() => createSectionStyles(colors), [colors]);
  return (
    <View style={[styles.missionCard, done && styles.doneMission]}>
      {/* Ink checkbox */}
      <View style={[styles.missionCheckbox, done && { borderColor: colors.success, backgroundColor: colors.successWash }]}>
        {done
          ? <Ionicons name="checkmark" size={16} color={colors.success} />
          : <View style={[styles.checkboxDot, { backgroundColor: accent }]} />
        }
      </View>
      <View style={styles.missionMain}>
        <Text style={[styles.missionTitle, done && styles.doneTitle]}>{title}</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: percent, backgroundColor: accent }]} />
        </View>
      </View>
      <View style={styles.missionMeta}>
        <Text style={[styles.missionProgress, done && { color: colors.success }]}>{progress}</Text>
        {reward ? <Text style={styles.missionReward}>{reward}</Text> : null}
      </View>
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({

  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.safeMargin, paddingBottom: 132, paddingTop: spacing.md, gap: spacing.sm },

  // Top bar
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingBottom: spacing.xs },
  brandRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", ...glow.primary },
  level: { color: colors.textMuted, fontFamily: fontFamily.mono, fontSize: 11, marginTop: 1 },
  streakPill: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: colors.orangeWash, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: colors.orangeWash },
  streakText: { color: colors.textSecondary, fontFamily: fontFamily.bodyBold, fontSize: 12 },

  // Dashboard card
  dashboardCard: { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 32, padding: 24, alignItems: "center", ...shadow.card },
  greeting: { color: colors.textPrimary, fontFamily: fontFamily.headline, fontSize: fontSize.lg, marginBottom: spacing.md },
  ringWrap: { width: 240, height: 240, alignItems: "center", justifyContent: "center", marginBottom: spacing.sm },
  ringOuter: { width: 224, height: 224, borderRadius: 112, borderWidth: 3, borderColor: colors.accentOrange, alignItems: "center", justifyContent: "center", backgroundColor: colors.cardAlt, ...glow.orange },
  ringInner: { width: 168, height: 168, borderRadius: 84, borderWidth: 2, borderColor: colors.border, alignItems: "center", justifyContent: "center", backgroundColor: colors.background },
  ringDate: { color: colors.textMuted, fontFamily: fontFamily.mono, fontSize: 11 },
  ringValue: { color: colors.textPrimary, fontFamily: fontFamily.display, fontSize: 32, lineHeight: 38 },
  ringUnit: { fontSize: 18, fontFamily: fontFamily.headline },
  ringGoal: { color: colors.accentOrange, fontFamily: fontFamily.bodyBold, fontSize: 11 },
  statRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, width: "100%", paddingHorizontal: spacing.sm },
  glassStat: { flex: 1, alignItems: "center", paddingVertical: spacing.md },
  statDivider: { width: 1, height: 44, backgroundColor: colors.border },
  statValue: { fontFamily: fontFamily.display, fontSize: 22, lineHeight: 28 },
  statLabel: { color: colors.textMuted, fontFamily: fontFamily.mono, fontSize: 11, marginTop: 2 },

  // Discovery card
  discoveryCard: { borderRadius: 28, overflow: "hidden", backgroundColor: colors.cardSolid, borderWidth: 1, borderColor: colors.border, ...shadow.card },
  discoveryMasthead: { height: 160, justifyContent: "flex-end", padding: 20, overflow: "hidden" },
  decorLetter: { position: "absolute", top: -12, right: 16, fontSize: 160, lineHeight: 200, fontFamily: "Sora_700Bold", color: "rgba(255,255,255,0.10)" },
  mastheadChip: { alignSelf: "flex-start", backgroundColor: "rgba(255,255,255,0.18)", borderColor: "rgba(255,255,255,0.28)", borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 5 },
  mastheadChipText: { color: colors.white, fontFamily: fontFamily.mono, fontSize: 11, letterSpacing: 0.8 },
  discoveryBody: { padding: 22 },
  wordHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: spacing.sm },
  word: { color: colors.textPrimary, fontFamily: fontFamily.display, fontSize: fontSize.display, lineHeight: lineHeight.display },
  phonetic: { color: colors.textMuted, fontFamily: fontFamily.body, fontSize: 14, marginTop: 2 },
  soundButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primaryWash, borderWidth: 1, borderColor: colors.borderStrong, alignItems: "center", justifyContent: "center" },
  definition: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 16, lineHeight: 26, marginBottom: spacing.sm },
  exampleRow: { flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: spacing.md },
  exampleBar: { width: 2, marginTop: 4, height: 34, borderRadius: 1, backgroundColor: colors.accentOrange, flexShrink: 0 },
  exampleText: { flex: 1, color: colors.textMuted, fontFamily: fontFamily.body, fontSize: 14, lineHeight: 22, fontStyle: "italic" },
  primaryButton: { height: 54, borderRadius: 14, backgroundColor: colors.primary, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, ...glow.primary },
  primaryButtonText: { color: colors.onPrimary, fontFamily: fontFamily.bodyBold, fontSize: 16 },

  // Missions
  missionStack: { gap: spacing.sm, marginBottom: spacing.lg },
  missionCard: { flexDirection: "row", alignItems: "center", gap: spacing.sm, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 18, padding: spacing.md, ...shadow.card },
  doneMission: { opacity: 0.72 },
  missionCheckbox: { width: 36, height: 36, borderRadius: 10, borderWidth: 1.5, borderColor: colors.border, alignItems: "center", justifyContent: "center", backgroundColor: colors.background, flexShrink: 0 },
  checkboxDot: { width: 8, height: 8, borderRadius: 4 },
  missionMain: { flex: 1 },
  missionTitle: { color: colors.textPrimary, fontFamily: fontFamily.bodyBold, fontSize: 14, marginBottom: 8 },
  doneTitle: { color: colors.textMuted, textDecorationLine: "line-through" },
  progressTrack: { height: 5, borderRadius: 3, backgroundColor: colors.backgroundDeep, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 3 },
  missionMeta: { minWidth: 54, alignItems: "flex-end" },
  missionProgress: { color: colors.textPrimary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  missionReward: { color: colors.textMuted, fontFamily: fontFamily.mono, fontSize: 11, marginTop: 2 },

  // FAB
  fab: { position: "absolute", right: 24, bottom: 96, width: 64, height: 64, borderRadius: 32, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", ...glow.primary },
  });
}
