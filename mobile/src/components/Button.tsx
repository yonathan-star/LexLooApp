import React, { useMemo } from "react";
import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, ViewStyle } from "react-native";
import { fontFamily, glow, radius, spacing, touchTarget } from "../theme";
import { useColors } from "../context/ThemeContext";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityHint?: string;
}

export function Button({ label, onPress, variant = "primary", disabled, loading, style, accessibilityHint }: ButtonProps) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const isDisabled = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled }}
      onPress={isDisabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.base,
        variant === "primary" && styles.primary,
        variant === "secondary" && styles.secondary,
        variant === "ghost" && styles.ghost,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? colors.onPrimary : colors.accentOrange} />
      ) : (
        <Text
          style={[
            styles.label,
            variant === "secondary" && styles.secondaryLabel,
            variant === "ghost" && styles.ghostLabel,
            isDisabled && styles.disabledLabel,
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({

  base: {
    minHeight: touchTarget.minHeight,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  primary: { backgroundColor: colors.primary, ...glow.primary },
  secondary: { backgroundColor: colors.orangeWash, borderWidth: 1, borderColor: colors.accentOrange, ...glow.orange },
  ghost: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.borderStrong },
  pressed: { opacity: 0.8 },
  disabled: { backgroundColor: colors.inputBackground, shadowOpacity: 0, elevation: 0 },
  label: { color: colors.onPrimary, fontSize: 16, fontFamily: fontFamily.headline },
  secondaryLabel: { color: colors.onAccentOrange },
  ghostLabel: { color: colors.primary },
  disabledLabel: { color: colors.textMuted },
  });
}
