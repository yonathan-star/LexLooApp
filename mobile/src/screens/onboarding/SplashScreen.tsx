import React, { useMemo } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { LexLooMark } from "../../components/LexLooMark";
import { fontFamily, spacing } from "../../theme";
import { useColors } from "../../context/ThemeContext";

export function SplashScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.safe}>
      <LexLooMark size={34} />
      <ActivityIndicator color={colors.primary} size="large" />
      <Text style={styles.label}>Loading LexLoo</Text>
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({

  safe: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    backgroundColor: colors.background,
  },
  label: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 14 },
  });
}
