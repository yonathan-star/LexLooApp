import { LexLooMark } from "../../components/LexLooMark";
import React, { useState, useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { usePacks, useProgress } from "../../api/queries";
import { haptics } from "../../lib/haptics";
import { fontFamily, fontSize, glow, radius, shadow, spacing } from "../../theme";
import { useColors } from "../../context/ThemeContext";

type SessionType = "quick" | "review" | "new";

const SESSIONS: { id: SessionType; icon: keyof typeof Ionicons.glyphMap; title: string; body: string }[] = [
  { id: "quick", icon: "flash", title: "Quick Scan", body: "5-minute rapid-fire vocabulary challenge for busy schedules." },
  { id: "review", icon: "refresh", title: "Review Session", body: "Deep dive into words you've struggled with in the past 7 days." },
  { id: "new", icon: "sparkles", title: "New Words", body: "Expand your lexicon with new words based on your rank." },
];

export function PracticeSetupScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { activeProfile } = useAuth();
  const progress = useProgress(activeProfile?.id);
  const packs = usePacks();
  const [selected, setSelected] = useState<SessionType>("quick");
  const defaultPackId =
    (route.params?.packId as string | undefined) ??
    packs.data?.find((pack) => pack.slug === activeProfile?.activeGoalId)?.id ??
    packs.data?.[0]?.id;
  const [selectedPackId, setSelectedPackId] = useState<string | undefined>(defaultPackId);
  const effectivePackId = selectedPackId ?? defaultPackId;

  function startSession() {
    if (selected === "quick") {
      navigation.navigate("PracticeHub", { packId: effectivePackId, restartAt: Date.now() });
      return;
    }
    const activityType = selected === "review" ? "multiple_choice" : "spelling";
    navigation.navigate("PracticeSession", { activityType, packId: effectivePackId });
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </Pressable>
          <LexLooMark />
          <View style={styles.pill}>
            <Text style={styles.pillText}>
              {progress.data?.streak?.currentCount ?? 0} Streak • {(progress.data?.xp ?? 0).toLocaleString()} XP
            </Text>
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.title}>Practice Session</Text>
          <Text style={styles.subtitle}>Customize your learning rhythm. Select a focus area to begin.</Text>
        </View>

        <View style={styles.cards}>
          {SESSIONS.map((session) => {
            const active = selected === session.id;
            return (
              <Pressable
                key={session.id}
                style={[styles.card, active && styles.cardActive]}
                onPress={() => {
                  haptics.select();
                  setSelected(session.id);
                }}
              >
                <View style={[styles.cardIcon, active && styles.cardIconActive]}>
                  <Ionicons name={session.icon} size={22} color={active ? colors.primary : colors.textSecondary} />
                </View>
                <View style={styles.cardMain}>
                  <Text style={styles.cardTitle}>{session.title}</Text>
                  <Text style={styles.cardBody}>{session.body}</Text>
                </View>
                {active ? <Ionicons name="checkmark-circle" size={20} color={colors.primary} /> : null}
              </Pressable>
            );
          })}
        </View>

        <View style={styles.packSection}>
          <Text style={styles.sectionLabel}>Practice Pack</Text>
          <View style={styles.packList}>
            {(packs.data ?? []).map((pack) => {
              const active = effectivePackId === pack.id;
              return (
                <Pressable
                  key={pack.id}
                  style={[styles.packChip, active && styles.packChipActive]}
                  onPress={() => {
                    haptics.select();
                    setSelectedPackId(pack.id);
                  }}
                >
                  <Text style={[styles.packChipText, active && styles.packChipTextActive]}>{pack.name}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Pressable
          style={styles.startButton}
          onPress={() => {
            haptics.tap();
            startSession();
          }}
        >
          <Text style={styles.startText}>Let's Go!</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.onPrimary} />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({

  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.safeMargin, paddingTop: spacing.md, paddingBottom: 132, gap: spacing.lg },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  logo: { color: colors.primary, fontFamily: fontFamily.display, fontSize: fontSize.display, lineHeight: 38 },
  pill: { backgroundColor: colors.primaryWash, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 8 },
  pillText: { color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  hero: { gap: 6 },
  title: { color: colors.textPrimary, fontFamily: fontFamily.display, fontSize: fontSize.display, lineHeight: 38 },
  subtitle: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 15, lineHeight: 24, maxWidth: 320 },
  cards: { gap: spacing.md },
  packSection: { gap: spacing.sm },
  sectionLabel: { color: colors.textMuted, fontFamily: fontFamily.bodyBold, fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase" },
  packList: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  packChip: {
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  packChipActive: { backgroundColor: colors.primaryWash, borderColor: colors.borderStrong },
  packChipText: { color: colors.textSecondary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  packChipTextActive: { color: colors.primary },
  card: {
    borderRadius: 24,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    ...shadow.card,
  },
  cardActive: { borderColor: colors.borderStrong, backgroundColor: colors.cardAlt, ...glow.primary },
  cardIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: colors.cardHighest, alignItems: "center", justifyContent: "center" },
  cardIconActive: { backgroundColor: colors.primaryWash },
  cardMain: { flex: 1 },
  cardTitle: { color: colors.textPrimary, fontFamily: fontFamily.headline, fontSize: fontSize.md },
  cardBody: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 13, lineHeight: 19, marginTop: 4 },
  startButton: {
    height: 64,
    borderRadius: radius.xl,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    ...glow.primary,
  },
  startText: { color: colors.onPrimary, fontFamily: fontFamily.headline, fontSize: 16 },
  });
}
