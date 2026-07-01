import React, { useState, useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Button } from "../../components/Button";
import { LexLooMark } from "../../components/LexLooMark";
import { useUpdateProfile } from "../../api/queries";
import { useAuth } from "../../context/AuthContext";
import { fontFamily, fontSize, shadow, spacing } from "../../theme";
import { useColors } from "../../context/ThemeContext";

const AGES = ["5-7", "8-10", "11-13", "14-16", "Adult"];
const GRADES = [
  { label: "K-2", value: "k_2" },
  { label: "3-5", value: "3_5" },
  { label: "6-8", value: "6_8" },
  { label: "9-12", value: "9_12" },
  { label: "Adult", value: "adult" },
];

export function AgeGradeSelectionScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<any>();
  const { activeProfile, refreshProfiles } = useAuth();
  const updateProfile = useUpdateProfile();
  const [ageRange, setAgeRange] = useState(activeProfile?.ageRange || "11-13");
  const [gradeLevel, setGradeLevel] = useState(activeProfile?.gradeLevel || "6_8");

  async function continueFlow() {
    if (activeProfile?.id) {
      await updateProfile.mutateAsync({ profileId: activeProfile.id, ageRange, gradeLevel });
      await refreshProfiles();
    }
    navigation.navigate("LearningGoalSelection");
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <LexLooMark />
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Learning level</Text>
          <Text style={styles.title}>Choose an age and grade range.</Text>
          <Text style={styles.subtitle}>LexLoo uses this to recommend vocabulary packs that fit.</Text>
        </View>

        <SelectionGroup title="Age" values={AGES.map((age) => ({ label: age, value: age }))} selected={ageRange} onSelect={setAgeRange} />
        <SelectionGroup title="Grade" values={GRADES} selected={gradeLevel} onSelect={setGradeLevel} />

        <Button label="Continue" onPress={continueFlow} loading={updateProfile.isPending} />
      </ScrollView>
    </SafeAreaView>
  );
}

function SelectionGroup({
  title,
  values,
  selected,
  onSelect,
}: {
  title: string;
  values: { label: string; value: string }[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.card}>
      <Text style={styles.groupTitle}>{title}</Text>
      <View style={styles.chips}>
        {values.map((item) => {
          const active = selected === item.value;
          return (
            <Pressable key={item.value} style={[styles.chip, active && styles.chipActive]} onPress={() => onSelect(item.value)}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
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
  card: { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 24, padding: spacing.lg, ...shadow.card },
  groupTitle: { color: colors.textPrimary, fontFamily: fontFamily.headline, fontSize: fontSize.lg, marginBottom: spacing.md },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chip: {
    minHeight: 44,
    borderRadius: 22,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.textSecondary, fontFamily: fontFamily.bodyBold, fontSize: 13 },
  chipTextActive: { color: colors.onPrimary },
  });
}
