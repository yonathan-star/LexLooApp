import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../../components/Button";
import { LexLooMark } from "../../components/LexLooMark";
import { useAuth } from "../../context/AuthContext";
import { trackScreenEvent } from "../../lib/analytics";
import { fontFamily, fontSize, glow, shadow, spacing } from "../../theme";
import { useColors } from "../../context/ThemeContext";

export function OnboardingCompleteScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { activeProfile, markOnboarded } = useAuth();

  function complete() {
    trackScreenEvent("onboarding_complete", {}, activeProfile?.id);
    markOnboarded();
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <LexLooMark />
        <View style={styles.hero}>
          <View style={styles.medallion}>
            <Ionicons name="checkmark" size={42} color={colors.onPrimary} />
          </View>
          <Text style={styles.eyebrow}>Ready</Text>
          <Text style={styles.title}>Your bracelet practice is set.</Text>
          <Text style={styles.subtitle}>Scan a LexLoo vocabulary tile, open your pack, and start building mastery.</Text>
        </View>

        <View style={styles.card}>
          <Step icon="scan" title="Scan physical tiles" />
          <Step icon="library" title="Practice your selected pack" />
          <Step icon="trophy" title="Earn XP, streaks, and badges" />
        </View>

        <Button label="Start LexLoo" onPress={complete} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Step({ icon, title }: { icon: keyof typeof Ionicons.glyphMap; title: string }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.step}>
      <Ionicons name={icon} size={20} color={colors.accentOrange} />
      <Text style={styles.stepText}>{title}</Text>
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({

  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.safeMargin, paddingTop: spacing.md, paddingBottom: spacing.xl, gap: spacing.md },
  hero: { alignItems: "center", backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 28, padding: spacing.lg, ...shadow.card },
  medallion: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    marginBottom: spacing.md,
    ...glow.primary,
  },
  eyebrow: { color: colors.accentOrange, fontFamily: fontFamily.bodyBold, fontSize: 12, letterSpacing: 1.4, textTransform: "uppercase" },
  title: { color: colors.textPrimary, fontFamily: fontFamily.display, fontSize: fontSize.xxl, lineHeight: 40, textAlign: "center", marginTop: spacing.sm },
  subtitle: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 15, lineHeight: 24, textAlign: "center", marginTop: spacing.sm },
  card: { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 24, padding: spacing.lg, gap: spacing.md, ...shadow.card },
  step: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  stepText: { color: colors.textPrimary, fontFamily: fontFamily.bodyBold, fontSize: 14 },
  });
}
