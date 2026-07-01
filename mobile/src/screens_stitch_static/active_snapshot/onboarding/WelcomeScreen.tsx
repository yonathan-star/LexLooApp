import React from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fontFamily, fontSize, glow, radius, shadow, spacing } from "../../theme";

const PRODUCT_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCOPg7v8Qz0hbl233_IC53JqTe7NbN6FwaO6CI9J6-sAFtzV_KN-hyCdU_4IucBv2Ut_mQxD6OVDKX9z4uM2dAAAOMTJaSY04s1EXkwbYA0dYU8-72JmxXUrcMkgnHQLEbxW46v3xvMtlKYw--zaMtXoUQ3QeySqjP0v8Sm6tAYzZ9YtQA9LWv4TyeGB8cEc69jRqRNVeykLjqwL2loX6aLwSqGZI09DbV1T-mFPgXpGDhSHxwHuQ4H-PVPUrVUoQ-gZDQYeJ6HeVw5";

export function WelcomeScreen() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Text style={styles.logo}>LexLoo</Text>
        <Text style={styles.lang}>EN</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroWrap}>
          <View style={styles.glow} />
          <View style={styles.orbitLarge} />
          <View style={styles.orbitSmall} />
          <View style={styles.productGlass}>
            <Image source={{ uri: PRODUCT_IMAGE }} style={styles.productImage} />
          </View>
          <View style={styles.dataPill}>
            <Text style={styles.dataIcon}>✦</Text>
            <Text style={styles.dataText}>AI Decoded</Text>
          </View>
        </View>

        <View style={styles.copyBlock}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>PREMIUM WEARABLE LEARNING</Text>
          </View>
          <Text style={styles.headline}>Meet Lex. Learn daily.</Text>
          <Text style={styles.subhead}>Master new languages naturally through the rhythm of your day.</Text>
        </View>

        <View style={styles.steps}>
          <WelcomeStep icon="◉" title="Choose your ring" body="Sizing kit delivered to your doorstep." />
          <WelcomeStep icon="◌" title="Build it daily" body="Each word is one segment toward something bigger." />
          <WelcomeStep icon="◇" title="Master new words" body="Contextual learning via haptic feedback." />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.dots}>
          <View style={styles.activeDot} />
          <View style={styles.inactiveDot} />
          <View style={styles.inactiveDot} />
        </View>
        <Pressable style={styles.primaryButton} onPress={() => navigation.navigate("CreateAccount")}>
          <Text style={styles.primaryText}>Get Started</Text>
          <Text style={styles.primaryArrow}>→</Text>
        </Pressable>
        <Pressable style={styles.signInButton} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.signInText}>Already have a ring? Sign in</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function WelcomeStep({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <View style={styles.stepCard}>
      <View style={styles.stepIcon}>
        <Text style={styles.stepIconText}>{icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text style={styles.stepBody}>{body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.safeMargin,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: "rgba(252,249,248,0.7)",
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
    backgroundColor: "rgba(0,81,213,0.05)",
  },
  orbitLarge: { position: "absolute", width: 288, height: 288, borderRadius: 144, borderWidth: 1, borderColor: "rgba(0,81,213,0.1)" },
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
  productImage: { width: "100%", height: "100%" },
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
  dataIcon: { color: colors.primary, fontFamily: fontFamily.display, fontSize: 16 },
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
  stepIconText: { color: colors.primary, fontFamily: fontFamily.display, fontSize: 24 },
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
    backgroundColor: "rgba(252,249,248,0.94)",
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
  primaryArrow: { color: colors.onPrimary, fontSize: 22 },
  signInButton: { alignItems: "center", paddingVertical: spacing.sm },
  signInText: { color: colors.textSecondary, fontFamily: fontFamily.bodyBold, fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase" },
});
