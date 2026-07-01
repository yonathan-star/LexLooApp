import React, { useState, useMemo } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../../components/Button";
import { LexLooMark } from "../../components/LexLooMark";
import { TextField } from "../../components/TextField";
import { useAddChildProfile } from "../../api/queries";
import { fontFamily, fontSize, shadow, spacing } from "../../theme";
import { useColors } from "../../context/ThemeContext";

const AGES = ["5-7", "8-10", "11-13", "14-16"];
const GRADES = [
  { label: "K-2", value: "k_2" },
  { label: "3-5", value: "3_5" },
  { label: "6-8", value: "6_8" },
  { label: "9-12", value: "9_12" },
];

export function AddChildProfileScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<any>();
  const addChild = useAddChildProfile();
  const [name, setName] = useState("");
  const [ageRange, setAgeRange] = useState("8-10");
  const [gradeLevel, setGradeLevel] = useState("3_5");
  const [email, setEmail] = useState("");
  const [sendInvite, setSendInvite] = useState(false);

  async function add() {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert("Name required", "Add your child's name to create a profile.");
      return;
    }
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const child = await addChild.mutateAsync({
        name: trimmed,
        ageRange,
        gradeLevel,
        email: normalizedEmail || undefined,
        sendInvite: sendInvite || Boolean(normalizedEmail),
      });
      if (child.invite?.inviteCode) {
        const delivery = child.invite.deliveryStatus === "sent" ? "Email sent." : "Use the invite screen to share or email it.";
        Alert.alert("Invite created", `Invite code: ${child.invite.inviteCode}\n${delivery}`);
      }
      navigation.navigate("ParentChildDetail", { profileId: child.id });
    } catch (error: any) {
      Alert.alert("Couldn't add child", error?.message ?? "Please try again.");
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </Pressable>
          <LexLooMark size={22} />
          <View style={styles.backButton} />
        </View>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Family</Text>
          <Text style={styles.title}>Add a child profile.</Text>
          <Text style={styles.subtitle}>Create a learner profile so progress, streaks, and weekly reports stay separate.</Text>
        </View>

        <View style={styles.card}>
          <TextField label="Child name" value={name} onChangeText={setName} placeholder="Name" autoCapitalize="words" />
          <TextField label="Child email (optional)" value={email} onChangeText={setEmail} placeholder="child@example.com" autoCapitalize="none" keyboardType="email-address" />
          <Pressable style={styles.inviteRow} onPress={() => setSendInvite((value) => !value)}>
            <View style={[styles.checkbox, sendInvite && styles.checkboxActive]}>
              {sendInvite ? <Ionicons name="checkmark" size={15} color={colors.onPrimary} /> : null}
            </View>
            <View style={styles.inviteTextWrap}>
              <Text style={styles.inviteTitle}>Create family invite</Text>
              <Text style={styles.inviteBody}>Optional. If no email is entered, LexLoo still creates an invite code you can share.</Text>
            </View>
          </Pressable>
          <SelectionGroup title="Age" values={AGES.map((age) => ({ label: age, value: age }))} selected={ageRange} onSelect={setAgeRange} />
          <SelectionGroup title="Grade" values={GRADES} selected={gradeLevel} onSelect={setGradeLevel} />
        </View>

        <Button label="Add Child" onPress={add} loading={addChild.isPending} />
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
    <View style={styles.group}>
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
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  hero: { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 28, padding: spacing.lg, ...shadow.card },
  eyebrow: { color: colors.accentOrange, fontFamily: fontFamily.bodyBold, fontSize: 12, letterSpacing: 1.4, textTransform: "uppercase" },
  title: { color: colors.textPrimary, fontFamily: fontFamily.display, fontSize: fontSize.xxl, lineHeight: 40, marginTop: spacing.sm },
  subtitle: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 15, lineHeight: 24, marginTop: spacing.sm },
  card: { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 24, padding: spacing.lg, ...shadow.card },
  inviteRow: {
    flexDirection: "row",
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.inputBackground,
    marginBottom: spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  checkboxActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  inviteTextWrap: { flex: 1 },
  inviteTitle: { color: colors.textPrimary, fontFamily: fontFamily.bodyBold, fontSize: 13 },
  inviteBody: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 12, lineHeight: 18, marginTop: 3 },
  group: { marginTop: spacing.sm },
  groupTitle: { color: colors.textPrimary, fontFamily: fontFamily.headline, fontSize: fontSize.md, marginBottom: spacing.sm },
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
