import React, { useMemo } from "react";
import { Image, Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../api/client";
import { fontFamily, glow } from "../theme";
import { useColors } from "../context/ThemeContext";

export function ProfileAvatar({
  size = 40,
  light = false,
  style,
}: {
  size?: number;
  light?: boolean;
  style?: ViewStyle;
}) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<any>();
  const { activeProfile } = useAuth();
  const rawAvatar = activeProfile?.avatar ?? null;
  const avatarUri = rawAvatar ? (rawAvatar.startsWith("http") ? rawAvatar : `${API_URL}${rawAvatar}`) : null;
  const initials = (activeProfile?.name ?? "L").slice(0, 1).toUpperCase();
  const radius = size / 2;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Open profile"
      onPress={() => navigation.navigate("Profile")}
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: colors.primary,
        },
        style,
      ]}
    >
      {avatarUri ? (
        <Image source={{ uri: avatarUri }} style={{ width: size, height: size, borderRadius: radius }} />
      ) : activeProfile?.name ? (
        <Text style={[styles.initials, { color: colors.white, fontSize: Math.max(14, size * 0.42) }]}>
          {initials}
        </Text>
      ) : (
        <Ionicons name="person" size={Math.max(16, size * 0.45)} color={colors.white} />
      )}
    </Pressable>
  );
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({

  avatar: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    ...glow.primary,
  },
  initials: { fontFamily: fontFamily.display, lineHeight: 24 },
  });
}
