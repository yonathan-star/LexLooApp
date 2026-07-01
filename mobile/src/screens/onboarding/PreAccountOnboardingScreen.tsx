import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LexLooMark } from "../../components/LexLooMark";
import { LexMascot } from "../../components/LexMascot";
import { haptics } from "../../lib/haptics";
import { fontFamily, fontSize, glow, radius, shadow, spacing } from "../../theme";
import { useColors } from "../../context/ThemeContext";

const LANGUAGES = [
  { label: "English", icon: "🇺🇸" },
  { label: "Spanish", icon: "🇪🇸" },
  { label: "Hebrew", icon: "🇮🇱" },
  { label: "French", icon: "🇫🇷" },
  { label: "Mandarin", icon: "🇨🇳" },
];

const GOALS = [
  { label: "Grow my vocabulary", icon: "📚" },
  { label: "Learn a new language", icon: "🌎" },
  { label: "School", icon: "🎓" },
  { label: "Work", icon: "💼" },
  { label: "Just for fun", icon: "😊" },
];

const DAILY_GOALS = [
  { label: "1 Word", badge: "" },
  { label: "3 Words", badge: "" },
  { label: "5 Words", badge: "Recommended" },
  { label: "10 Words", badge: "Challenge" },
];

export function PreAccountOnboardingScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<any>();
  const [step, setStep] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [language, setLanguage] = useState("English");
  const [goal, setGoal] = useState("Grow my vocabulary");
  const [dailyGoal, setDailyGoal] = useState("5 Words");

  const canContinue = step !== 1 || firstName.trim().length > 0;
  const progress = `${step + 1}/5`;

  function next() {
    if (!canContinue) return;
    haptics.tap();
    if (step < 4) {
      setStep((current) => current + 1);
      return;
    }
    navigation.navigate("CreateAccount", {
      displayName: firstName.trim(),
      onboarding: { language, goal, dailyGoal },
    });
  }

  function back() {
    haptics.tap();
    if (step === 0) navigation.goBack();
    else setStep((current) => current - 1);
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.topBar}>
        <Pressable style={styles.iconButton} onPress={back}>
          <Ionicons name="chevron-back" size={23} color={colors.textPrimary} />
        </Pressable>
        <LexLooMark size={22} />
        <Text style={styles.progress}>{progress}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.mascotWrap}>
          <LexMascot mood={step === 4 ? "celebrate" : "happy"} />
        </View>

        {step === 0 ? (
          <Question title="Welcome to LexLoo!" subtitle="Discover a word, practice it fast, earn rewards, and come back tomorrow." />
        ) : null}

        {step === 1 ? (
          <>
            <Question title="What's your first name?" subtitle="Lex will use it to make your daily word feel personal." />
            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              placeholder="First name"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="words"
              style={styles.input}
            />
          </>
        ) : null}

        {step === 2 ? (
          <>
            <Question title="What would you like to learn?" subtitle="Start simple. You can add more languages later." />
            <OptionList options={LANGUAGES} value={language} onChange={setLanguage} />
          </>
        ) : null}

        {step === 3 ? (
          <>
            <Question title="What's your goal?" subtitle="This helps Lex choose the right daily words." />
            <OptionList options={GOALS} value={goal} onChange={setGoal} />
          </>
        ) : null}

        {step === 4 ? (
          <>
            <Question title="How many new words each day?" subtitle="Pick a goal that feels easy to keep." />
            <OptionList options={DAILY_GOALS} value={dailyGoal} onChange={setDailyGoal} />
          </>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={[styles.primaryButton, !canContinue && styles.disabled]} onPress={next} disabled={!canContinue}>
          <Text style={styles.primaryText}>{step === 0 ? "Get Started" : step === 4 ? "Create Account" : "Continue"}</Text>
          <Ionicons name="arrow-forward" size={19} color={colors.onPrimary} />
        </Pressable>
        <Pressable style={styles.signInButton} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.signInText}>Already have an account? Sign in</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function Question({ title, subtitle }: { title: string; subtitle: string }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.question}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

function OptionList({
  options,
  value,
  onChange,
}: {
  options: { label: string; icon?: string; badge?: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.optionStack}>
      {options.map((option) => {
        const active = option.label === value;
        return (
          <Pressable
            key={option.label}
            style={[styles.optionCard, active && styles.optionCardActive]}
            onPress={() => {
              haptics.tap();
              onChange(option.label);
            }}
          >
            {option.icon ? <Text style={styles.optionIcon}>{option.icon}</Text> : null}
            <Text style={styles.optionText}>{option.label}</Text>
            {option.badge ? <Text style={styles.badge}>{option.badge}</Text> : null}
            <Ionicons name={active ? "checkmark-circle" : "ellipse-outline"} size={23} color={active ? colors.success : colors.textMuted} />
          </Pressable>
        );
      })}
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    topBar: {
      paddingHorizontal: spacing.safeMargin,
      paddingTop: spacing.sm,
      paddingBottom: spacing.sm,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    iconButton: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center", backgroundColor: colors.card },
    progress: { minWidth: 42, textAlign: "right", color: colors.textMuted, fontFamily: fontFamily.bodyBold, fontSize: 12 },
    content: { paddingHorizontal: spacing.safeMargin, paddingTop: spacing.md, paddingBottom: 160, gap: spacing.lg },
    mascotWrap: { alignItems: "center" },
    question: { gap: spacing.sm, alignItems: "center" },
    title: { color: colors.textPrimary, fontFamily: fontFamily.display, fontSize: fontSize.xxl, lineHeight: 40, textAlign: "center" },
    subtitle: { maxWidth: 320, color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 16, lineHeight: 25, textAlign: "center" },
    input: {
      height: 64,
      borderRadius: 22,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.borderStrong,
      color: colors.textPrimary,
      fontFamily: fontFamily.headline,
      fontSize: 20,
      paddingHorizontal: spacing.lg,
      ...shadow.card,
    },
    optionStack: { gap: spacing.sm },
    optionCard: {
      minHeight: 66,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
      paddingHorizontal: spacing.md,
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      ...shadow.card,
    },
    optionCardActive: { borderColor: colors.borderStrong, backgroundColor: colors.cardAlt },
    optionIcon: { fontSize: 22, width: 32 },
    optionText: { flex: 1, color: colors.textPrimary, fontFamily: fontFamily.headline, fontSize: 16 },
    badge: {
      color: colors.accentOrangePressed,
      backgroundColor: colors.orangeWash,
      borderRadius: radius.pill,
      overflow: "hidden",
      paddingHorizontal: 9,
      paddingVertical: 5,
      fontFamily: fontFamily.bodyBold,
      fontSize: 10,
    },
    footer: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      paddingHorizontal: spacing.safeMargin,
      paddingTop: spacing.md,
      paddingBottom: spacing.safeMargin,
      gap: spacing.sm,
      backgroundColor: colors.backgroundElevated,
      borderTopWidth: 1,
      borderColor: colors.border,
    },
    primaryButton: {
      height: 62,
      borderRadius: radius.xl,
      backgroundColor: colors.primary,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.sm,
      ...glow.primary,
    },
    disabled: { opacity: 0.45 },
    primaryText: { color: colors.onPrimary, fontFamily: fontFamily.headline, fontSize: 16 },
    signInButton: { alignItems: "center", paddingVertical: spacing.sm },
    signInText: { color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 13 },
  });
}
