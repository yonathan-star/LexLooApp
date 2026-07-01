import React, { useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../../components/Button";
import { LexLooMark } from "../../components/LexLooMark";
import { useSaveNotificationPreferences } from "../../api/queries";
import { useAuth } from "../../context/AuthContext";
import { cancelLearningReminders, scheduleLearningReminders } from "../../lib/notifications";
import { fontFamily, fontSize, shadow, spacing } from "../../theme";
import { useColors } from "../../context/ThemeContext";

export function ReminderSetupScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<any>();
  const { activeProfile } = useAuth();
  const saveNotificationPreferences = useSaveNotificationPreferences();

  async function finish(enabled: boolean) {
    if (enabled) {
      await AsyncStorage.setItem("lexloo_onboarding_reminder", "daily");
      await scheduleLearningReminders();
    } else {
      await AsyncStorage.setItem("lexloo_onboarding_reminder", "skipped");
      await cancelLearningReminders();
    }

    if (activeProfile?.id) {
      await saveNotificationPreferences.mutateAsync({
        profileId: activeProfile.id,
        dailyWord: enabled,
        streak: enabled,
        parentWeekly: activeProfile.profileType === "parent" && enabled,
      });
    }
    navigation.navigate("OnboardingComplete");
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <LexLooMark />
        <View style={styles.hero}>
          <View style={styles.icon}>
            <Ionicons name="notifications" size={28} color={colors.accentOrange} />
          </View>
          <Text style={styles.eyebrow}>Daily rhythm</Text>
          <Text style={styles.title}>Want a gentle practice reminder?</Text>
          <Text style={styles.subtitle}>LexLoo can nudge you when your daily word is ready and your streak needs a quick win.</Text>
        </View>

        <View style={styles.card}>
          <InfoRow icon="gift" title="Reveal today's word" />
          <InfoRow icon="book" title="Practice in under a minute" />
          <InfoRow icon="flame" title="Keep streaks and LexPoints moving" />
        </View>

        <Button label="Turn On Reminders" onPress={() => finish(true)} loading={saveNotificationPreferences.isPending} />
        <Button label="Skip for Now" variant="ghost" onPress={() => finish(false)} disabled={saveNotificationPreferences.isPending} />
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ icon, title }: { icon: keyof typeof Ionicons.glyphMap; title: string }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <Text style={styles.infoText}>{title}</Text>
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({

  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.safeMargin, paddingTop: spacing.md, paddingBottom: spacing.xl, gap: spacing.md },
  hero: { alignItems: "center", backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 28, padding: spacing.lg, ...shadow.card },
  icon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.orangeWash,
    marginBottom: spacing.md,
  },
  eyebrow: { color: colors.accentOrange, fontFamily: fontFamily.bodyBold, fontSize: 12, letterSpacing: 1.4, textTransform: "uppercase" },
  title: { color: colors.textPrimary, fontFamily: fontFamily.display, fontSize: fontSize.xxl, lineHeight: 40, textAlign: "center", marginTop: spacing.sm },
  subtitle: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 15, lineHeight: 24, textAlign: "center", marginTop: spacing.sm },
  card: { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 24, padding: spacing.lg, gap: spacing.sm, ...shadow.card },
  infoRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  infoIcon: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: colors.primaryWash },
  infoText: { color: colors.textPrimary, fontFamily: fontFamily.bodyBold, fontSize: 14, flex: 1 },
  });
}
