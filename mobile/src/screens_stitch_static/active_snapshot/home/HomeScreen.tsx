import React from "react";
import { DimensionValue, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fontFamily, fontSize, glow, lineHeight, radius, shadow, spacing } from "../../theme";

const DISCOVERY_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBuKavu_uCFi1AQeMECF-UAlL6wOFF50G28-5knMrctltRMkwCUX1ZuCu6DJ7DAWxNVhra7EpeEFZz9vIyRrRkEiCwKDhptJkwMoXDn986pbjsSuHWvROCygQmHiDam5t1idbumpbwJNrXxAviQc4FeLIDgAJ4MS-tAW9DA3deM4wu8u9uAqDK8Ae995HYckPo8dHu1u156R7qFFCGyZWXJmwcR0PMmNGBlwDX_1DCNCUqJZHX6rDaqiuEy0LkxKY9sW3NMltj7xDpN";

export function HomeScreen() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <View style={styles.brandRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarIcon}>●</Text>
            </View>
            <View>
              <Text style={styles.logo}>LexLoo</Text>
              <Text style={styles.level}>Level 12 Explorer</Text>
            </View>
          </View>
          <View style={styles.streakPill}>
            <Text style={styles.streakText}>12 Streak • 1.2k XP</Text>
          </View>
        </View>

        <View style={styles.dashboardCard}>
          <Text style={styles.sectionTitleCentered}>Dashboard</Text>
          <View style={styles.ringWrap}>
            <View style={styles.ringOuter}>
              <View style={styles.ringInner}>
                <Text style={styles.ringBolt}>↯</Text>
                <Text style={styles.ringDate}>20 AUG</Text>
                <Text style={styles.ringValue}>
                  1250 <Text style={styles.ringUnit}>XP</Text>
                </Text>
                <Text style={styles.ringGoal}>Goal 2000 XP</Text>
              </View>
            </View>
          </View>

          <View style={styles.statRow}>
            <GlassStat icon="⌁" value="14 Days" label="Streak" accent={colors.accentOrange} />
            <GlassStat icon="□" value="842" label="Words Mastered" accent={colors.primary} />
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Daily Discovery</Text>
          <Pressable>
            <Text style={styles.link}>View History</Text>
          </Pressable>
        </View>

        <View style={styles.discoveryCard}>
          <View style={styles.discoveryImageWrap}>
            <Image source={{ uri: DISCOVERY_IMAGE }} style={styles.discoveryImage} />
            <View style={styles.imageShade} />
            <View style={styles.imageChip}>
              <Text style={styles.imageChipText}>WORD OF THE DAY</Text>
            </View>
          </View>
          <View style={styles.discoveryBody}>
            <View style={styles.wordHeader}>
              <View>
                <Text style={styles.word}>Ephemeral</Text>
                <Text style={styles.phonetic}>/əˈfem(ə)rəl/ • adjective</Text>
              </View>
              <Pressable style={styles.soundButton}>
                <Text style={styles.soundIcon}>♪</Text>
              </Pressable>
            </View>
            <Text style={styles.definition}>Lasting for a very short time; transient or momentary.</Text>
            <Pressable style={styles.primaryButton} onPress={() => navigation.navigate("PracticeTab")}>
              <Text style={styles.primaryIcon}>◌</Text>
              <Text style={styles.primaryButtonText}>Practice Now</Text>
            </Pressable>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Daily Missions</Text>
        <View style={styles.missionStack}>
          <MissionRow icon="◇" title="Scan 5 Environment Items" progress="3/5" reward="+50 XP" percent="60%" accent={colors.accentOrange} />
          <MissionRow icon="◎" title="Master 3 New Words" progress="1/3" reward="+120 XP" percent="33%" accent={colors.primary} />
          <MissionRow icon="✓" title="Listen to 1 Audio Story" progress="Done" reward="" percent="100%" accent={colors.success} done />
        </View>
      </ScrollView>

      <Pressable style={styles.fab} onPress={() => navigation.navigate("ScannerTab")}>
        <Text style={styles.fabIcon}>⌖</Text>
      </Pressable>
    </SafeAreaView>
  );
}

function GlassStat({ icon, value, label, accent }: { icon: string; value: string; label: string; accent: string }) {
  return (
    <View style={styles.glassStat}>
      <Text style={[styles.statIcon, { color: accent }]}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
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
  icon: string;
  title: string;
  progress: string;
  reward: string;
  percent: DimensionValue;
  accent: string;
  done?: boolean;
}) {
  return (
    <View style={[styles.missionCard, done && styles.doneMission]}>
      <View style={[styles.missionIcon, { backgroundColor: done ? colors.successWash : accent === colors.primary ? colors.primaryWash : colors.orangeWash }]}>
        <Text style={[styles.missionIconText, { color: accent }]}>{icon}</Text>
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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.safeMargin, paddingBottom: 132, paddingTop: spacing.md, gap: spacing.md },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: spacing.sm,
  },
  brandRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryContainer,
    alignItems: "center",
    justifyContent: "center",
    ...glow.primary,
  },
  avatarIcon: { color: colors.onPrimary, fontSize: 16 },
  logo: { color: colors.primary, fontFamily: fontFamily.display, fontSize: fontSize.lg, lineHeight: 24 },
  level: { color: colors.textSecondary, fontFamily: fontFamily.mono, fontSize: 11, marginTop: 2 },
  streakPill: { backgroundColor: colors.orangeWash, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 8 },
  streakText: { color: colors.onAccentOrange, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  dashboardCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 32,
    padding: 24,
    alignItems: "center",
    ...shadow.card,
  },
  sectionTitleCentered: { color: colors.textPrimary, fontFamily: fontFamily.headline, fontSize: fontSize.lg, marginBottom: spacing.md },
  ringWrap: { width: 256, height: 256, alignItems: "center", justifyContent: "center", marginBottom: spacing.sm },
  ringOuter: {
    width: 238,
    height: 238,
    borderRadius: 119,
    borderWidth: 10,
    borderColor: colors.accentOrange,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.cardAlt,
    ...glow.orange,
  },
  ringInner: {
    width: 178,
    height: 178,
    borderRadius: 89,
    borderWidth: 8,
    borderColor: colors.backgroundDeep,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  ringBolt: { color: colors.accentOrange, fontFamily: fontFamily.display, fontSize: 26, marginBottom: 4 },
  ringDate: { color: colors.textSecondary, fontFamily: fontFamily.mono, fontSize: 11 },
  ringValue: { color: colors.textPrimary, fontFamily: fontFamily.display, fontSize: 32, lineHeight: 38 },
  ringUnit: { fontSize: 20, fontFamily: fontFamily.headline },
  ringGoal: { color: colors.accentOrange, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  statRow: { flexDirection: "row", gap: spacing.md, marginTop: spacing.sm },
  glassStat: {
    flex: 1,
    backgroundColor: "rgba(246, 243, 242, 0.55)",
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  statIcon: { fontFamily: fontFamily.display, fontSize: 22, marginBottom: 2 },
  statValue: { color: colors.textPrimary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  statLabel: { color: colors.textSecondary, fontFamily: fontFamily.mono, fontSize: 11, marginTop: 3, textAlign: "center" },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 4, marginTop: spacing.md },
  sectionTitle: { color: colors.textPrimary, fontFamily: fontFamily.headline, fontSize: fontSize.lg, marginTop: spacing.sm, marginBottom: spacing.xs },
  link: { color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  discoveryCard: { borderRadius: 32, overflow: "hidden", backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, ...shadow.card },
  discoveryImageWrap: { height: 192, overflow: "hidden" },
  discoveryImage: { width: "100%", height: "100%" },
  imageShade: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.22)" },
  imageChip: {
    position: "absolute",
    left: 24,
    bottom: 16,
    backgroundColor: "rgba(255,255,255,0.22)",
    borderColor: "rgba(255,255,255,0.3)",
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  imageChipText: { color: colors.white, fontFamily: fontFamily.mono, fontSize: 11 },
  discoveryBody: { padding: 24 },
  wordHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: spacing.md },
  word: { color: colors.textPrimary, fontFamily: fontFamily.display, fontSize: fontSize.display, lineHeight: lineHeight.display },
  phonetic: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 14 },
  soundButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.cardHighest,
    alignItems: "center",
    justifyContent: "center",
  },
  soundIcon: { color: colors.primary, fontFamily: fontFamily.display, fontSize: 22 },
  definition: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 16, lineHeight: 26, marginBottom: spacing.md },
  primaryButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    ...glow.primary,
  },
  primaryIcon: { color: colors.white, fontSize: 20 },
  primaryButtonText: { color: colors.onPrimary, fontFamily: fontFamily.bodyBold, fontSize: 16 },
  missionStack: { gap: spacing.sm, marginBottom: spacing.lg },
  missionCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: spacing.md,
    ...shadow.card,
  },
  doneMission: { opacity: 0.76 },
  missionIcon: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  missionIconText: { fontFamily: fontFamily.display, fontSize: 22 },
  missionMain: { flex: 1 },
  missionTitle: { color: colors.textPrimary, fontFamily: fontFamily.bodyBold, fontSize: 14, marginBottom: 8 },
  doneTitle: { textDecorationLine: "line-through" },
  progressTrack: { height: 6, borderRadius: 3, backgroundColor: colors.cardHighest, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 3 },
  missionMeta: { minWidth: 54, alignItems: "flex-end" },
  missionProgress: { color: colors.textPrimary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  missionReward: { color: colors.textSecondary, fontFamily: fontFamily.mono, fontSize: 11, marginTop: 2 },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 96,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    ...glow.primary,
  },
  fabIcon: { color: colors.white, fontSize: 30, lineHeight: 34 },
});
