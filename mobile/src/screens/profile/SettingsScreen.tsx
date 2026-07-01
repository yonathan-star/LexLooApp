import { LexLooMark } from "../../components/LexLooMark";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { fontFamily, fontSize, radius, shadow, spacing } from "../../theme";
import { useColors, useTheme } from "../../context/ThemeContext";

const DAILY_GOALS = ["1", "3", "5", "10"];
const LANGUAGES = ["English", "Spanish", "Hebrew"];
const DAILY_GOAL_KEY = "@lexloo_daily_goal";
const APP_LANGUAGE_KEY = "@lexloo_app_language";

export function SettingsScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<any>();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [dailyGoal, setDailyGoal] = useState("5");
  const [appLanguage, setAppLanguage] = useState("English");

  useEffect(() => {
    AsyncStorage.multiGet([DAILY_GOAL_KEY, APP_LANGUAGE_KEY]).then((pairs) => {
      const storedDailyGoal = pairs.find(([key]) => key === DAILY_GOAL_KEY)?.[1];
      const storedLanguage = pairs.find(([key]) => key === APP_LANGUAGE_KEY)?.[1];
      if (storedDailyGoal && DAILY_GOALS.includes(storedDailyGoal)) setDailyGoal(storedDailyGoal);
      if (storedLanguage && LANGUAGES.includes(storedLanguage)) setAppLanguage(storedLanguage);
    });
  }, []);

  function chooseDailyGoal(value: string) {
    setDailyGoal(value);
    AsyncStorage.setItem(DAILY_GOAL_KEY, value);
  }

  function chooseLanguage(value: string) {
    setAppLanguage(value);
    AsyncStorage.setItem(APP_LANGUAGE_KEY, value);
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </Pressable>
          <LexLooMark />
          <View style={styles.pill}>
            <Text style={styles.pillText}>Settings</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Account</Text>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Manage reminders, privacy, family-safe account controls, and support.</Text>
        </View>

        <View style={styles.list}>
          <SettingRow icon="moon-outline" label="Dark Mode" value="Match the LexLoo website theme" toggle toggleValue={theme === "dark"} onToggle={toggleTheme} />
          <SettingRow icon="notifications-outline" label="Notifications" value="Daily word, streak, parent summary" onPress={() => navigation.navigate("NotificationsSettings")} />
          <SettingPicker icon="flag-outline" label="Language" value={appLanguage} options={LANGUAGES} onChange={chooseLanguage} />
          <SettingPicker icon="calendar-outline" label="Daily Goal" value={dailyGoal} options={DAILY_GOALS} suffix=" words" onChange={chooseDailyGoal} />
          <SettingRow icon="person-outline" label="Edit Profile" value="Name, age, grade, avatar" onPress={() => navigation.navigate("EditProfile")} />
          <SettingRow icon="share-social-outline" label="Family Invites" value="Create, email, and share invite codes" onPress={() => navigation.navigate("FamilyInvites")} />
          <SettingRow icon="shield-half-outline" label="Email Verification" value="A code is always emailed to you at sign in" onPress={() => {}} disabled />
          <SettingRow icon="help-circle-outline" label="Help Center" value="Scanning, mastery, family safety" onPress={() => navigation.navigate("HelpCenter")} />
          <SettingRow icon="shield-checkmark-outline" label="Privacy Consent" value="Learning data and parent controls" onPress={() => navigation.navigate("PrivacyConsent")} />
          <SettingRow icon="document-text-outline" label="Terms Acceptance" value="Terms and privacy policy" onPress={() => navigation.navigate("TermsAcceptance")} />
          <SettingRow icon="trash-outline" label="Delete Account" value="Deactivate and anonymize account" onPress={() => navigation.navigate("DeleteAccount")} danger />
          <SettingRow icon="log-out-outline" label="Log Out" value="Return to welcome screen" onPress={logout} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingPicker({
  icon,
  label,
  value,
  options,
  suffix = "",
  onChange,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  options: string[];
  suffix?: string;
  onChange: (value: string) => void;
}) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.pickerRow}>
      <View style={styles.pickerHeader}>
        <View style={[styles.icon, styles.defaultIcon]}>
          <Ionicons name={icon} size={20} color={colors.primary} />
        </View>
        <View style={styles.rowMain}>
          <Text style={styles.rowLabel}>{label}</Text>
          <Text style={styles.rowValue}>{value}{suffix}</Text>
        </View>
      </View>
      <View style={styles.segmented}>
        {options.map((option) => {
          const active = option === value;
          return (
            <Pressable key={option} style={[styles.segment, active && styles.segmentActive]} onPress={() => onChange(option)}>
              <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{option}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function SettingRow({
  icon,
  label,
  value,
  onPress,
  danger,
  disabled,
  toggle,
  toggleValue,
  onToggle,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  onPress?: () => void;
  danger?: boolean;
  disabled?: boolean;
  toggle?: boolean;
  toggleValue?: boolean;
  onToggle?: () => void;
}) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <Pressable
      style={[styles.row, disabled && styles.disabledRow]}
      onPress={toggle ? onToggle : (disabled ? undefined : onPress)}
      disabled={disabled && !toggle}
    >
      <View style={[styles.icon, danger ? styles.dangerIcon : styles.defaultIcon]}>
        <Ionicons name={icon} size={20} color={danger ? colors.error : colors.primary} />
      </View>
      <View style={styles.rowMain}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
      {toggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: colors.cardHighest, true: colors.primary }}
          thumbColor={colors.white}
        />
      ) : disabled ? null : (
        <Ionicons name="chevron-forward" size={22} color={colors.textMuted} />
      )}
    </Pressable>
  );
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({

  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.safeMargin, paddingTop: spacing.md, paddingBottom: 132, gap: spacing.lg },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  logo: { color: colors.primary, fontFamily: fontFamily.display, fontSize: fontSize.display, lineHeight: 38 },
  pill: { backgroundColor: colors.orangeWash, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 8 },
  pillText: { color: colors.accentOrangePressed, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  hero: { borderRadius: 32, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, ...shadow.card },
  eyebrow: { color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 12, letterSpacing: 1.6, textTransform: "uppercase", marginBottom: spacing.sm },
  title: { color: colors.textPrimary, fontFamily: fontFamily.display, fontSize: fontSize.display, lineHeight: 38 },
  subtitle: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 15, lineHeight: 24, marginTop: spacing.sm },
  list: { gap: spacing.md },
  row: { minHeight: 78, borderRadius: 22, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, padding: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.md, ...shadow.card },
  pickerRow: { borderRadius: 22, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, padding: spacing.md, gap: spacing.md, ...shadow.card },
  pickerHeader: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  segmented: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  segment: { minHeight: 38, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.cardHighest, paddingHorizontal: spacing.md, alignItems: "center", justifyContent: "center" },
  segmentActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  segmentText: { color: colors.textSecondary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  segmentTextActive: { color: colors.onPrimary },
  disabledRow: { opacity: 0.7 },
  icon: { width: 44, height: 44, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  defaultIcon: { backgroundColor: colors.primaryWash },
  dangerIcon: { backgroundColor: "rgba(186,26,26,0.1)" },
  rowMain: { flex: 1 },
  rowLabel: { color: colors.textPrimary, fontFamily: fontFamily.headline, fontSize: fontSize.sm },
  rowValue: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 12, marginTop: 4 },
  });
}
