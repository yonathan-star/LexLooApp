import { LexLooMark } from "../../components/LexLooMark";
import React, { useState, useMemo } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { TextField } from "../../components/TextField";
import { fontFamily, fontSize, radius, shadow, spacing } from "../../theme";
import { useColors } from "../../context/ThemeContext";

export function LoginScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<any>();
  const { login, verifyLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [mfaChallenge, setMfaChallenge] = useState<{ challengeId: string; deliveryTarget: string; devCode?: string } | null>(null);
  const [mfaCode, setMfaCode] = useState("");

  async function submitLogin() {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      Alert.alert("Missing details", "Enter your email and password.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await login(normalizedEmail, password);
      setMfaChallenge({ challengeId: result.challengeId, deliveryTarget: result.deliveryTarget, devCode: result.devCode });
      setMfaCode("");
    } catch (error: any) {
      Alert.alert("Couldn't sign in", error?.message ?? "That email and password combination didn't work.");
    } finally {
      setSubmitting(false);
    }
  }

  async function submitMfa() {
    if (!mfaChallenge) return;
    const code = mfaCode.trim();
    if (!/^\d{6}$/.test(code)) {
      Alert.alert("Code required", "Enter the six-digit verification code.");
      return;
    }
    setSubmitting(true);
    try {
      await verifyLogin(mfaChallenge.challengeId, code);
    } catch (error: any) {
      Alert.alert("Invalid code", error?.message ?? "That verification code did not work.");
    } finally {
      setSubmitting(false);
    }
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
            <Text style={styles.pillText}>Sign In</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>{mfaChallenge ? "Verification" : "Welcome Back"}</Text>
          <Text style={styles.title}>{mfaChallenge ? "Enter your code" : "Sign in to LexLoo"}</Text>
          <Text style={styles.subtitle}>
            {mfaChallenge
              ? `Enter the code emailed to ${mfaChallenge.deliveryTarget}.`
              : "Continue your daily words, streaks, LexWorld progress, and family learning."}
            {mfaChallenge?.devCode ? ` Dev code: ${mfaChallenge.devCode}` : ""}
          </Text>
        </View>

        <View style={styles.formCard}>
          {mfaChallenge ? (
            <TextInput
              style={styles.codeInput}
              value={mfaCode}
              onChangeText={setMfaCode}
              keyboardType="number-pad"
              maxLength={6}
              placeholder="000000"
              placeholderTextColor={colors.textMuted}
            />
          ) : (
            <>
              <TextField label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" autoCapitalize="none" keyboardType="email-address" />
              <TextField label="Password" value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />
            </>
          )}
        </View>

        <Pressable style={[styles.primaryButton, submitting && styles.disabled]} onPress={mfaChallenge ? submitMfa : submitLogin} disabled={submitting}>
          <Text style={styles.primaryText}>{submitting ? "Checking..." : mfaChallenge ? "Verify & Sign In" : "Sign In"}</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.onPrimary} />
        </Pressable>

        {mfaChallenge ? (
          <Pressable style={styles.secondaryButton} onPress={() => setMfaChallenge(null)}>
            <Text style={styles.secondaryText}>Back to password</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate("CreateAccount")}>
            <Text style={styles.secondaryText}>Need an account? Get Started</Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({

  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.safeMargin, paddingTop: spacing.md, paddingBottom: 132, gap: spacing.lg },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  pill: { backgroundColor: colors.orangeWash, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 8 },
  pillText: { color: colors.accentOrangePressed, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  hero: { borderRadius: 32, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, ...shadow.card },
  eyebrow: { color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 12, letterSpacing: 1.6, textTransform: "uppercase" },
  title: { color: colors.textPrimary, fontFamily: fontFamily.display, fontSize: fontSize.xl, lineHeight: 34, marginTop: spacing.sm },
  subtitle: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 15, lineHeight: 24, marginTop: spacing.sm },
  formCard: { borderRadius: 24, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, ...shadow.card },
  codeInput: {
    height: 58,
    borderRadius: 18,
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    color: colors.textPrimary,
    fontFamily: fontFamily.headline,
    fontSize: 22,
    textAlign: "center",
    letterSpacing: 4,
  },
  primaryButton: {
    height: 60,
    borderRadius: radius.xl,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  disabled: { opacity: 0.6 },
  primaryText: { color: colors.onPrimary, fontFamily: fontFamily.headline, fontSize: 16 },
  secondaryButton: { alignItems: "center", paddingVertical: spacing.sm },
  secondaryText: { color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 14 },
  });
}
