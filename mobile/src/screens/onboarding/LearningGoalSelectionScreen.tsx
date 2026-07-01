import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../../components/Button";
import { LexLooMark } from "../../components/LexLooMark";
import { ErrorState, LoadingState } from "../../components/StateViews";
import { usePacks, useUpdateProfile } from "../../api/queries";
import { useAuth } from "../../context/AuthContext";
import { fontFamily, fontSize, packColors, shadow, spacing } from "../../theme";
import type { WordPack } from "../../types";
import { useColors } from "../../context/ThemeContext";

function packStyle(pack: WordPack) {
  return packColors[pack.slug] ?? packColors[pack.category ?? ""] ?? packColors.default;
}

export function LearningGoalSelectionScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<any>();
  const { activeProfile, refreshProfiles } = useAuth();
  const packs = usePacks();
  const updateProfile = useUpdateProfile();
  const initialSlug = activeProfile?.activeGoalId || packs.data?.[0]?.slug || null;
  const [selectedSlug, setSelectedSlug] = useState<string | null>(initialSlug);
  const selectedPack = useMemo(() => packs.data?.find((pack) => pack.slug === selectedSlug) ?? packs.data?.[0], [packs.data, selectedSlug]);

  async function continueFlow() {
    if (activeProfile?.id && selectedPack?.slug) {
      await updateProfile.mutateAsync({ profileId: activeProfile.id, activeGoalId: selectedPack.slug });
      await refreshProfiles();
    }
    navigation.navigate("ReminderSetup");
  }

  if (packs.isLoading) return <LoadingState label="Loading packs..." />;
  if (packs.isError) return <ErrorState message="We couldn't load vocabulary packs." onRetry={() => packs.refetch()} />;

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <LexLooMark />
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Vocabulary goal</Text>
          <Text style={styles.title}>Pick a pack to start with.</Text>
          <Text style={styles.subtitle}>You can switch packs later from Practice.</Text>
        </View>

        <View style={styles.stack}>
          {(packs.data ?? []).map((pack) => {
            const ps = packStyle(pack);
            const active = (selectedSlug ?? selectedPack?.slug) === pack.slug;
            return (
              <Pressable key={pack.id} style={[styles.card, active && styles.cardActive]} onPress={() => setSelectedSlug(pack.slug)}>
                <View style={[styles.icon, { backgroundColor: ps.wash }]}>
                  <Ionicons name={ps.glyph as keyof typeof Ionicons.glyphMap} size={22} color={ps.accent} />
                </View>
                <View style={styles.cardText}>
                  <Text style={styles.cardTitle}>{pack.name}</Text>
                  <Text style={[styles.cardMeta, { color: ps.accent }]}>{[pack.level, pack.category].filter(Boolean).join(" · ")}</Text>
                  <Text style={styles.cardBody} numberOfLines={2}>{pack.description ?? "A LexLoo vocabulary pack for daily practice."}</Text>
                </View>
                <Ionicons name={active ? "checkmark-circle" : "ellipse-outline"} size={24} color={active ? colors.success : colors.textMuted} />
              </Pressable>
            );
          })}
        </View>

        <Button label="Continue" onPress={continueFlow} disabled={!selectedPack} loading={updateProfile.isPending} />
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({

  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.safeMargin, paddingTop: spacing.md, paddingBottom: spacing.xl, gap: spacing.md },
  hero: { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 28, padding: spacing.lg, ...shadow.card },
  eyebrow: { color: colors.accentOrange, fontFamily: fontFamily.bodyBold, fontSize: 12, letterSpacing: 1.4, textTransform: "uppercase" },
  title: { color: colors.textPrimary, fontFamily: fontFamily.display, fontSize: fontSize.xxl, lineHeight: 40, marginTop: spacing.sm },
  subtitle: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 15, lineHeight: 24, marginTop: spacing.sm },
  stack: { gap: spacing.sm },
  card: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    ...shadow.card,
  },
  cardActive: { borderColor: colors.borderStrong, backgroundColor: colors.cardAlt },
  icon: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  cardText: { flex: 1 },
  cardTitle: { color: colors.textPrimary, fontFamily: fontFamily.headline, fontSize: fontSize.md },
  cardMeta: { fontFamily: fontFamily.mono, fontSize: 11, marginTop: 3 },
  cardBody: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 13, lineHeight: 20, marginTop: 6 },
  });
}
