import { LexLooMark } from "../../components/LexLooMark";
import React, { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LexMascot } from "../../components/LexMascot";
import { haptics } from "../../lib/haptics";
import { fontFamily, fontSize, glow, radius, shadow, spacing } from "../../theme";
import { useColors } from "../../context/ThemeContext";

export function WelcomeScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <LexLooMark />
        <Text style={styles.lang}>EN</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroWrap}>
          <View style={styles.glow} />
          <View style={styles.orbitLarge} />
          <View style={styles.orbitSmall} />
          <LexMascot size={168} mood="welcome" />
          <View style={styles.dataPill}>
            <Ionicons name="sparkles" size={14} color={colors.primary} />
            <Text style={styles.dataText}>Daily Word Ready</Text>
          </View>
        </View>

        <View style={styles.copyBlock}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>FAST VOCABULARY HABITS</Text>
          </View>
          <Text style={styles.headline}>Learn one word. Feel smarter today.</Text>
          <Text style={styles.subhead}>Lex helps you discover today's word, practice it fast, earn rewards, and keep your streak alive.</Text>
        </View>

        <View style={styles.steps}>
          <WelcomeStep icon="gift-outline" title="Reveal today's word" body="Open the app and get one clear discovery in seconds." />
          <WelcomeStep icon="flash-outline" title="Practice fast" body="Answer quick, colorful prompts with instant feedback." />
          <WelcomeStep icon="trophy-outline" title="Earn rewards" body="Collect LexPoints, streaks, saved words, and rank progress." />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.dots}>
          <View style={styles.activeDot} />
          <View style={styles.inactiveDot} />
          <View style={styles.inactiveDot} />
        </View>
        <Pressable
          style={styles.primaryButton}
          onPress={() => {
            haptics.tap();
            navigation.navigate("PreAccountOnboarding");
          }}
        >
          <Text style={styles.primaryText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={20} color={colors.onPrimary} />
        </Pressable>
        <Pressable style={styles.signInButton} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.signInText}>Already have LexLoo? Sign in</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function WelcomeStep({ icon, title, body }: { icon: keyof typeof Ionicons.glyphMap; title: string; body: string }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.stepCard}>
      <View style={styles.stepIcon}>
        <Ionicons name={icon} size={24} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text style={styles.stepBody}>{body}</Text>
      </View>
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({

  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.safeMargin,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.backgroundElevated,
  },
  logo: { color: colors.primary, fontFamily: fontFamily.display, fontSize: fontSize.display, lineHeight: 38 },
  lang: { color: colors.textSecondary, fontFamily: fontFamily.bodyBold, fontSize: 12, letterSpacing: 2 },
  content: { paddingHorizontal: spacing.safeMargin, paddingBottom: 212, alignItems: "center" },
  heroWrap: { width: "100%", aspectRatio: 1, alignItems: "center", justifyContent: "center", marginTop: spacing.md, marginBottom: spacing.lg },
  glow: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: colors.primaryWash,
  },
  orbitLarge: { position: "absolute", width: 288, height: 288, borderRadius: 144, borderWidth: 1, borderColor: colors.primaryWash },
  orbitSmall: {
    position: "absolute",
    width: 256,
    height: 256,
    borderRadius: 128,
    borderWidth: 1,
    borderColor: "rgba(154,70,0,0.08)",
    transform: [{ rotate: "45deg" }],
  },
  productGlass: {
    width: 256,
    height: 256,
    borderRadius: 128,
    overflow: "hidden",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    ...shadow.card,
  },
  dataPill: {
    position: "absolute",
    top: 36,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    ...shadow.card,
  },
  dataText: { color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  copyBlock: { alignItems: "center", gap: spacing.md, marginBottom: spacing.xl },
  badge: { backgroundColor: colors.primaryWash, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 8 },
  badgeText: { color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 12, letterSpacing: 1.2 },
  headline: { color: colors.textPrimary, fontFamily: fontFamily.display, fontSize: fontSize.display, lineHeight: 38, textAlign: "center" },
  subhead: { maxWidth: 280, color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 16, lineHeight: 26, textAlign: "center" },
  steps: { width: "100%", gap: spacing.md },
  stepCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    padding: spacing.md,
    ...shadow.card,
  },
  stepIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    backgroundColor: colors.cardHighest,
    alignItems: "center",
    justifyContent: "center",
  },
  stepTitle: { color: colors.textPrimary, fontFamily: fontFamily.headline, fontSize: fontSize.lg },
  stepBody: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 14, lineHeight: 21, marginTop: 4 },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.safeMargin,
    paddingTop: spacing.lg,
    paddingBottom: spacing.safeMargin,
    backgroundColor: colors.darkNav,
    gap: spacing.md,
  },
  dots: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 },
  activeDot: { width: 32, height: 6, borderRadius: 3, backgroundColor: colors.primary },
  inactiveDot: { width: 8, height: 6, borderRadius: 3, backgroundColor: colors.backgroundDeep },
  primaryButton: {
    height: 64,
    borderRadius: radius.xl,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    ...glow.primary,
  },
  primaryText: { color: colors.onPrimary, fontFamily: fontFamily.bodyBold, fontSize: 16 },
  signInButton: { alignItems: "center", paddingVertical: spacing.sm },
  signInText: { color: colors.textSecondary, fontFamily: fontFamily.bodyBold, fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase" },
  });
}
