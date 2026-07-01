import React, { useMemo } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { fontFamily, fontSize, spacing } from "../theme";
import { Button } from "./Button";
import { useColors } from "../context/ThemeContext";

// Screen 79: Loading State Generic.
export function LoadingState({ label = "Loading..." }: { label?: string }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.center} accessibilityRole="progressbar" accessibilityLabel={label}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.muted}>{label}</Text>
    </View>
  );
}

// Screen 78: Empty State Generic — friendly message plus one clear action.
export function EmptyState({
  title,
  message,
  actionLabel,
  onAction,
}: {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.center}>
      <Text style={styles.symbol}>+</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.muted}>{message}</Text>
      {actionLabel && onAction ? <Button label={actionLabel} onPress={onAction} style={styles.action} /> : null}
    </View>
  );
}

// Screen 76/Design System 11: Error States — human language + retry action.
export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.center} accessibilityLiveRegion="polite">
      <Text style={styles.symbol}>!</Text>
      <Text style={styles.title}>Something didn't work</Text>
      <Text style={styles.muted}>{message}</Text>
      {onRetry ? <Button label="Try Again" onPress={onRetry} style={styles.action} /> : null}
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({

  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.lg, gap: spacing.sm },
  symbol: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryWash,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    color: colors.primary,
    fontSize: 28,
    fontFamily: fontFamily.display,
    textAlign: "center",
    lineHeight: 54,
    marginBottom: spacing.sm,
  },
  title: { color: colors.textPrimary, fontSize: fontSize.lg, fontFamily: fontFamily.headline, textAlign: "center" },
  muted: { color: colors.textSecondary, fontSize: fontSize.sm, fontFamily: fontFamily.body, textAlign: "center" },
  action: { marginTop: spacing.md, minWidth: 180 },
  });
}
