import React, { useMemo } from "react";
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { glow, radius, shadow, spacing } from "../theme";
import { useColors } from "../context/ThemeContext";

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  variant?: "default" | "elevated" | "active" | "recessed";
}

export function Card({ children, style, onPress, variant = "default" }: CardProps) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const content = (
    <View
      style={[
        styles.base,
        variant === "elevated" && styles.elevated,
        variant === "active" && styles.active,
        variant === "recessed" && styles.recessed,
        style,
      ]}
    >
      {children}
    </View>
  );
  if (!onPress) return content;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [pressed && styles.pressed]}>
      {content}
    </Pressable>
  );
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({

  base: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.safeMargin,
    borderWidth: 1,
    borderColor: colors.border,
  },
  elevated: { backgroundColor: colors.cardAlt, ...shadow.card },
  active: { borderColor: colors.borderStrong, backgroundColor: colors.cardAlt, ...glow.primary },
  recessed: { backgroundColor: colors.inputBackground, borderColor: colors.border },
  pressed: { opacity: 0.85 },
  });
}
