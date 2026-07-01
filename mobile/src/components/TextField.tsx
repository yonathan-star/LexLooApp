import React, { useState, useMemo } from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import { fontFamily, fontSize, radius, spacing } from "../theme";
import { useColors } from "../context/ThemeContext";

interface TextFieldProps extends TextInputProps {
  label: string;
  error?: string;
}

export function TextField({ label, error, style, onFocus, onBlur, ...rest }: TextFieldProps) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.textMuted}
        style={[styles.input, focused && styles.inputFocused, error ? styles.inputError : null, style]}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...rest}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({

  wrapper: { marginBottom: spacing.md },
  label: { color: colors.textSecondary, fontSize: fontSize.sm, marginBottom: spacing.xs, fontFamily: fontFamily.title },
  input: {
    backgroundColor: colors.inputBackground,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontFamily: fontFamily.body,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 44,
  },
  inputFocused: { borderColor: colors.borderFocus },
  inputError: { borderColor: colors.error },
  error: { color: colors.error, fontSize: fontSize.xs, marginTop: spacing.xs },
  });
}
