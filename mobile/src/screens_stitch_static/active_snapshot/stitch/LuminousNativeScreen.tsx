import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fontFamily, fontSize, glow, radius, shadow, spacing } from "../../theme";

export interface LuminousRow {
  label: string;
  value?: string;
  accent?: "blue" | "orange" | "muted";
}

export function LuminousNativeScreen({
  eyebrow,
  title,
  subtitle,
  medallion = "✦",
  rows = [],
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
}: {
  eyebrow?: string;
  title: string;
  subtitle: string;
  medallion?: string;
  rows?: LuminousRow[];
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
}) {
  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Text style={styles.logo}>LexLoo</Text>
          <View style={styles.streakPill}>
            <Text style={styles.streakText}>12 Streak • 1.2k XP</Text>
          </View>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.glowOrb} />
          <View style={styles.medallion}>
            <Text style={styles.medallionText}>{medallion}</Text>
          </View>
          {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        {rows.length ? (
          <View style={styles.rows}>
            {rows.map((row) => (
              <View key={row.label} style={styles.row}>
                <View style={[styles.rowIcon, row.accent === "orange" ? styles.orangeIcon : row.accent === "muted" ? styles.mutedIcon : styles.blueIcon]}>
                  <Text style={[styles.rowIconText, row.accent === "orange" ? styles.orangeText : row.accent === "muted" ? styles.mutedText : styles.blueText]}>
                    {row.accent === "orange" ? "⌁" : row.accent === "muted" ? "◇" : "✦"}
                  </Text>
                </View>
                <Text style={styles.rowLabel}>{row.label}</Text>
                {row.value ? <Text style={styles.rowValue}>{row.value}</Text> : null}
              </View>
            ))}
          </View>
        ) : null}

        <View style={styles.actions}>
          {primaryLabel ? (
            <Pressable style={styles.primaryButton} onPress={onPrimary}>
              <Text style={styles.primaryText}>{primaryLabel}</Text>
            </Pressable>
          ) : null}
          {secondaryLabel ? (
            <Pressable style={styles.secondaryButton} onPress={onSecondary}>
              <Text style={styles.secondaryText}>{secondaryLabel}</Text>
            </Pressable>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.safeMargin, paddingTop: spacing.md, paddingBottom: spacing.xl, gap: spacing.lg },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  logo: { color: colors.primary, fontFamily: fontFamily.display, fontSize: fontSize.display, lineHeight: 38 },
  streakPill: { backgroundColor: colors.orangeWash, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 8 },
  streakText: { color: colors.accentOrangePressed, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  heroCard: {
    minHeight: 330,
    borderRadius: 32,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    ...shadow.card,
  },
  glowOrb: { position: "absolute", width: 260, height: 260, borderRadius: 130, backgroundColor: colors.primaryWash },
  medallion: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 10,
    borderColor: colors.white,
    backgroundColor: colors.cardAlt,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
    ...glow.primary,
  },
  medallionText: { color: colors.primary, fontFamily: fontFamily.display, fontSize: 46, lineHeight: 52 },
  eyebrow: { color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 12, letterSpacing: 1.7, marginBottom: spacing.sm, textTransform: "uppercase" },
  title: { color: colors.textPrimary, fontFamily: fontFamily.display, fontSize: fontSize.display, lineHeight: 38, textAlign: "center" },
  subtitle: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 16, lineHeight: 26, textAlign: "center", marginTop: spacing.sm },
  rows: { gap: spacing.md },
  row: {
    minHeight: 68,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    ...shadow.card,
  },
  rowIcon: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  blueIcon: { backgroundColor: colors.primaryWash },
  orangeIcon: { backgroundColor: colors.orangeWash },
  mutedIcon: { backgroundColor: colors.cardHighest },
  rowIconText: { fontFamily: fontFamily.display, fontSize: 18 },
  blueText: { color: colors.primary },
  orangeText: { color: colors.accentOrange },
  mutedText: { color: colors.textMuted },
  rowLabel: { flex: 1, color: colors.textPrimary, fontFamily: fontFamily.bodyBold, fontSize: 14 },
  rowValue: { color: colors.textSecondary, fontFamily: fontFamily.mono, fontSize: 11 },
  actions: { gap: spacing.md },
  primaryButton: { height: 60, borderRadius: radius.xl, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", ...glow.primary },
  primaryText: { color: colors.onPrimary, fontFamily: fontFamily.headline, fontSize: 16 },
  secondaryButton: { height: 56, borderRadius: radius.xl, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.borderStrong, alignItems: "center", justifyContent: "center" },
  secondaryText: { color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 13 },
});
