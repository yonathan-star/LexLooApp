import React, { useMemo } from "react";
import { ScrollView, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { spacing } from "../theme";
import { useColors } from "../context/ThemeContext";

interface ScreenContainerProps {
  children: React.ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
  padded?: boolean;
}

export function ScreenContainer({ children, scroll = false, style, padded = true }: ScreenContainerProps) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const Inner = scroll ? ScrollView : View;
  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <Inner
        style={scroll ? undefined : [styles.body, padded && styles.padded, style]}
        contentContainerStyle={scroll ? [styles.body, padded && styles.padded, style] : undefined}
      >
        {children}
      </Inner>
    </SafeAreaView>
  );
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({

  safe: { flex: 1, backgroundColor: colors.background },
  body: { flexGrow: 1 },
  padded: { paddingHorizontal: spacing.safeMargin, paddingTop: spacing.lg, paddingBottom: spacing.lg },
  });
}
