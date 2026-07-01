import { LexLooMark } from "../../components/LexLooMark";
import React, { useEffect, useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNotificationPreferences, useSaveNotificationPreferences } from "../../api/queries";
import { useAuth } from "../../context/AuthContext";
import { cancelLearningReminders, scheduleLearningReminders, scheduleParentWeeklySummary } from "../../lib/notifications";
import { fontFamily, fontSize, glow, radius, shadow, spacing } from "../../theme";
import { useColors } from "../../context/ThemeContext";

export function NotificationsSettingsScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<any>();
  const { activeProfile } = useAuth();
  const { data: records } = useNotificationPreferences(activeProfile?.id);
  const saveNotificationPreferences = useSaveNotificationPreferences();
  const [dailyWord, setDailyWord] = useState(true);
  const [streak, setStreak] = useState(true);
  const [parentWeekly, setParentWeekly] = useState(activeProfile?.profileType === "parent");

  useEffect(() => {
    if (!records) return;
    const scheduled = new Set(records.filter((record) => record.status === "scheduled").map((record) => record.type));
    setDailyWord(scheduled.has("daily_word"));
    setStreak(scheduled.has("streak"));
    setParentWeekly(scheduled.has("parent_weekly"));
  }, [records]);

  const enabledCount = useMemo(() => [dailyWord, streak, parentWeekly].filter(Boolean).length, [dailyWord, streak, parentWeekly]);

  async function savePreferences() {
    await AsyncStorage.multiSet([
      ["lexloo_notification_daily_word", dailyWord ? "on" : "off"],
      ["lexloo_notification_streak", streak ? "on" : "off"],
      ["lexloo_notification_parent_weekly", parentWeekly ? "on" : "off"],
      ["lexloo_notification_saved_at", new Date().toISOString()],
    ]);

    if (dailyWord || streak) await scheduleLearningReminders();
    else await cancelLearningReminders();
    if (parentWeekly) await scheduleParentWeeklySummary();

    if (activeProfile?.id) {
      await saveNotificationPreferences.mutateAsync({
        profileId: activeProfile.id,
        dailyWord,
        streak,
        parentWeekly,
      });
    }
    navigation.goBack();
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
            <Text style={styles.pillText}>{enabledCount} Active</Text>
          </View>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.glowOrb} />
          <View style={styles.medallion}>
            <Text style={styles.medallionText}>◷</Text>
          </View>
          <Text style={styles.eyebrow}>Preferences</Text>
          <Text style={styles.title}>Notification Settings</Text>
          <Text style={styles.subtitle}>Tune reminders that keep learning visible without making the app noisy.</Text>
        </View>

        <View style={styles.rows}>
          <ReminderRow
            label="Daily word reminder"
            detail="A fresh LexLoo word every morning."
            value={dailyWord}
            accent="blue"
            onValueChange={setDailyWord}
          />
          <ReminderRow label="Streak reminder" detail="A soft evening nudge before the streak resets." value={streak} accent="orange" onValueChange={setStreak} />
          <ReminderRow
            label="Parent weekly summary"
            detail="A Monday snapshot for family progress."
            value={parentWeekly}
            accent="muted"
            onValueChange={setParentWeekly}
          />
        </View>

        <Pressable style={styles.primaryButton} onPress={savePreferences} disabled={saveNotificationPreferences.isPending}>
          <Text style={styles.primaryText}>{saveNotificationPreferences.isPending ? "Saving..." : "Save Preferences"}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function ReminderRow({
  label,
  detail,
  value,
  accent,
  onValueChange,
}: {
  label: string;
  detail: string;
  value: boolean;
  accent: "blue" | "orange" | "muted";
  onValueChange: (value: boolean) => void;
}) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.row}>
      <View style={[styles.rowIcon, accent === "orange" ? styles.orangeIcon : accent === "muted" ? styles.mutedIcon : styles.blueIcon]}>
        <Text style={[styles.rowIconText, accent === "orange" ? styles.orangeText : accent === "muted" ? styles.mutedText : styles.blueText]}>
          {accent === "orange" ? "⌁" : accent === "muted" ? "◇" : "✦"}
        </Text>
      </View>
      <View style={styles.rowCopy}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowDetail}>{detail}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.cardHighest, true: colors.primaryContainer }}
        thumbColor={colors.white}
      />
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({

  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.safeMargin, paddingTop: spacing.md, paddingBottom: spacing.xl, gap: spacing.lg },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  logo: { color: colors.primary, fontFamily: fontFamily.display, fontSize: fontSize.display, lineHeight: 38 },
  pill: { backgroundColor: colors.orangeWash, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 8 },
  pillText: { color: colors.accentOrangePressed, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  heroCard: {
    minHeight: 300,
    borderRadius: 32,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    ...shadow.card,
  },
  glowOrb: { position: "absolute", width: 250, height: 250, borderRadius: 125, backgroundColor: colors.primaryWash },
  medallion: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 10,
    borderColor: colors.white,
    backgroundColor: colors.cardAlt,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
    ...glow.primary,
  },
  medallionText: { color: colors.primary, fontFamily: fontFamily.display, fontSize: 44, lineHeight: 50 },
  eyebrow: { color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 12, letterSpacing: 1.7, marginBottom: spacing.sm, textTransform: "uppercase" },
  title: { color: colors.textPrimary, fontFamily: fontFamily.display, fontSize: fontSize.display, lineHeight: 38, textAlign: "center" },
  subtitle: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 16, lineHeight: 26, textAlign: "center", marginTop: spacing.sm },
  rows: { gap: spacing.md },
  row: {
    minHeight: 86,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    ...shadow.card,
  },
  rowIcon: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  blueIcon: { backgroundColor: colors.primaryWash },
  orangeIcon: { backgroundColor: colors.orangeWash },
  mutedIcon: { backgroundColor: colors.cardHighest },
  rowIconText: { fontFamily: fontFamily.display, fontSize: 18 },
  blueText: { color: colors.primary },
  orangeText: { color: colors.accentOrange },
  mutedText: { color: colors.textMuted },
  rowCopy: { flex: 1, gap: 4 },
  rowLabel: { color: colors.textPrimary, fontFamily: fontFamily.bodyBold, fontSize: 14 },
  rowDetail: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 12, lineHeight: 18 },
  primaryButton: { height: 60, borderRadius: radius.xl, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", ...glow.primary },
  primaryText: { color: colors.onPrimary, fontFamily: fontFamily.headline, fontSize: 16 },
  });
}
