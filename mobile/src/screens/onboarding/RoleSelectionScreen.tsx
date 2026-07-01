import React, { useState, useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../../components/Button";
import { LexLooMark } from "../../components/LexLooMark";
import { useUpdateProfile } from "../../api/queries";
import { useAuth } from "../../context/AuthContext";
import { fontFamily, fontSize, glow, radius, shadow, spacing } from "../../theme";
import { useColors } from "../../context/ThemeContext";

type ProfileType = "student" | "parent" | "adult_learner";

const OPTIONS: { type: ProfileType; title: string; body: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { type: "student", title: "Learner", body: "I am building vocabulary with my LexLoo bracelet.", icon: "school" },
  { type: "parent", title: "Parent", body: "I want to follow a child's progress and weekly reports.", icon: "people" },
  { type: "adult_learner", title: "Adult learner", body: "I am practicing for myself.", icon: "book" },
];

export function RoleSelectionScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<any>();
  const { activeProfile, refreshProfiles, markOnboarded } = useAuth();
  const updateProfile = useUpdateProfile();
  const [selected, setSelected] = useState<ProfileType>((activeProfile?.profileType as ProfileType) || "student");

  async function continueFlow() {
    if (activeProfile?.id) {
      await updateProfile.mutateAsync({ profileId: activeProfile.id, profileType: selected });
      await refreshProfiles();
    }
    if (selected === "parent") {
      markOnboarded();
      return;
    }
    navigation.navigate("AgeGradeSelection");
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <LexLooMark />
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Set up LexLoo</Text>
          <Text style={styles.title}>Who is using this account?</Text>
          <Text style={styles.subtitle}>This helps LexLoo show the right practice flow and family tools.</Text>
        </View>

        <View style={styles.stack}>
          {OPTIONS.map((option) => {
            const active = selected === option.type;
            return (
              <Pressable key={option.type} style={[styles.card, active && styles.cardActive]} onPress={() => setSelected(option.type)}>
                <View style={[styles.icon, active && styles.iconActive]}>
                  <Ionicons name={option.icon} size={22} color={active ? colors.onPrimary : colors.primary} />
                </View>
                <View style={styles.cardText}>
                  <Text style={styles.cardTitle}>{option.title}</Text>
                  <Text style={styles.cardBody}>{option.body}</Text>
                </View>
                <Ionicons name={active ? "checkmark-circle" : "ellipse-outline"} size={24} color={active ? colors.success : colors.textMuted} />
              </Pressable>
            );
          })}
        </View>

        <Button label="Continue" onPress={continueFlow} loading={updateProfile.isPending} />
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({

  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.safeMargin, paddingTop: spacing.md, paddingBottom: spacing.xl, gap: spacing.md },
  hero: { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 28, padding: spacing.lg, ...shadow.card },
  eyebrow: { color: colors.accentOrange, fontFamily: fontFamily.bodyBold, fontSize: 12, letterSpacing: 1.4, textTransform: "uppercase" },
  title: { color: colors.textPrimary, fontFamily: fontFamily.display, fontSize: fontSize.xxl, lineHeight: 40, marginTop: spacing.sm },
  subtitle: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 15, lineHeight: 24, marginTop: spacing.sm },
  stack: { gap: spacing.sm },
  card: {
    minHeight: 96,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    ...shadow.card,
  },
  cardActive: { borderColor: colors.borderStrong, backgroundColor: colors.cardAlt },
  icon: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: colors.primaryWash },
  iconActive: { backgroundColor: colors.primary, ...glow.primary },
  cardText: { flex: 1 },
  cardTitle: { color: colors.textPrimary, fontFamily: fontFamily.headline, fontSize: fontSize.md },
  cardBody: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 13, lineHeight: 20, marginTop: 4 },
  });
}
