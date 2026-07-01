import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { fontFamily, fontSize, radius, spacing } from "../theme";
import { useColors } from "../context/ThemeContext";

export function StatChip({ label, value, accentColor }: { label: string; value: string | number; accentColor?: string }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={[styles.chip, accentColor ? { borderColor: accentColor } : null]} accessibilityLabel={`${label}: ${value}`}>
      <Text style={[styles.value, accentColor ? { color: accentColor } : null]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({

  chip: {
    backgroundColor: colors.card,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    minWidth: 84,
    minHeight: 64,
    justifyContent: "center",
  },
  value: { color: colors.textPrimary, fontSize: fontSize.lg, fontFamily: fontFamily.headline },
  label: {
    color: colors.textSecondary,
    fontSize: 11,
    fontFamily: fontFamily.mono,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginTop: 2,
  },
  });
}
