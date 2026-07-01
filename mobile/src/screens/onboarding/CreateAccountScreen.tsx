import React, { useState, useMemo } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LexLooMark } from "../../components/LexLooMark";
import { LexMascot } from "../../components/LexMascot";
import { TextField } from "../../components/TextField";
import { useAuth } from "../../context/AuthContext";
import { fontFamily, fontSize, glow, radius, shadow, spacing } from "../../theme";
import { useColors } from "../../context/ThemeContext";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
type Role = "student" | "parent" | "adult_learner";

export function CreateAccountScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { register, verifyRegistration } = useAuth();
  const [displayName, setDisplayName] = useState(route.params?.displayName ?? "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("student");
  const [challenge, setChallenge] = useState<{ challengeId: string; deliveryTarget: string; devCode?: string } | null>(null);
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    const name = displayName.trim();
    const normalizedEmail = email.trim().toLowerCase();
    if (!name || !normalizedEmail || !password) {
      Alert.alert("Missing details", "Enter your name, email, and password.");
      return;
    }
    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      Alert.alert("Invalid email", "Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Weak password", "Password must be at least 8 characters.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await register({
        email: normalizedEmail,
        password,
        displayName: name,
        role,
      });
      setChallenge(result);
      setCode("");
    } catch (error: any) {
      Alert.alert("Couldn't create account", error?.message ?? "That email may already be registered. Try logging in instead.");
    } finally {
      setSubmitting(false);
    }
  }

  async function verify() {
    if (!challenge) return;
    if (!/^\d{6}$/.test(code.trim())) {
      Alert.alert("Code required", "Enter the six-digit verification code.");
      return;
    }
    setSubmitting(true);
    try {
      await verifyRegistration(challenge.challengeId, code.trim());
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
            <Text style={styles.pillText}>{challenge ? "Verify" : "Start"}</Text>
          </View>
        </View>

        <View style={styles.hero}>
          {!challenge ? <LexMascot size={92} mood="celebrate" /> : null}
          <Text style={styles.eyebrow}>{challenge ? "Verification" : "Meet Lex"}</Text>
          <Text style={styles.title}>{challenge ? "Enter your verification code" : "Peel your potential."}</Text>
          <Text style={styles.subtitle}>
            {challenge
              ? `Enter the code emailed to ${challenge.deliveryTarget}.`
              : "Each word is a segment. Build enough small segments and you build something incredible."}
            {challenge?.devCode ? ` Dev code: ${challenge.devCode}` : ""}
          </Text>
        </View>

        <View style={styles.formCard}>
          {challenge ? (
            <TextInput
              style={styles.codeInput}
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              maxLength={6}
              placeholder="000000"
              placeholderTextColor={colors.textMuted}
            />
          ) : (
            <>
              <View style={styles.socialStack}>
                <Pressable style={styles.socialButton} onPress={() => Alert.alert("Coming soon", "Apple sign-in will be connected before launch.")}>
                  <Ionicons name="logo-apple" size={20} color={colors.textPrimary} />
                  <Text style={styles.socialText}>Continue with Apple</Text>
                </Pressable>
                <Pressable style={styles.socialButton} onPress={() => Alert.alert("Coming soon", "Google sign-in will be connected before launch.")}>
                  <Ionicons name="logo-google" size={20} color={colors.textPrimary} />
                  <Text style={styles.socialText}>Continue with Google</Text>
                </Pressable>
              </View>
              <View style={styles.dividerRow}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>or email</Text>
                <View style={styles.divider} />
              </View>
              <TextField label="Name" value={displayName} onChangeText={setDisplayName} placeholder="Learner name" autoCapitalize="words" />
              <TextField label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" autoCapitalize="none" keyboardType="email-address" />
              <TextField label="Password" value={password} onChangeText={setPassword} placeholder="At least 8 characters" secureTextEntry />

              <Text style={styles.roleLabel}>Account Type</Text>
              <View style={styles.roleRow}>
                <OptionButton label="Student" active={role === "student"} onPress={() => setRole("student")} />
                <OptionButton label="Parent" active={role === "parent"} onPress={() => setRole("parent")} />
                <OptionButton label="Adult" active={role === "adult_learner"} onPress={() => setRole("adult_learner")} />
              </View>

            </>
          )}
        </View>

        <Pressable style={[styles.primaryButton, submitting && styles.disabled]} onPress={challenge ? verify : submit} disabled={submitting}>
          <Text style={styles.primaryText}>{submitting ? "Checking..." : challenge ? "Verify & Create Account" : "Get Started"}</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.onPrimary} />
        </Pressable>

        <Pressable style={styles.signInButton} onPress={() => (challenge ? setChallenge(null) : navigation.navigate("Login"))}>
          <Text style={styles.signInText}>{challenge ? "Back to account details" : "Already have an account? Sign in"}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function OptionButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <Pressable style={[styles.roleButton, active && styles.roleButtonActive]} onPress={onPress}>
      <Text style={[styles.roleText, active && styles.roleTextActive]}>{label}</Text>
    </Pressable>
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
  socialStack: { gap: spacing.sm, marginBottom: spacing.md },
  socialButton: {
    height: 54,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardHighest,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  socialText: { color: colors.textPrimary, fontFamily: fontFamily.bodyBold, fontSize: 14 },
  dividerRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.md },
  divider: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { color: colors.textMuted, fontFamily: fontFamily.bodyBold, fontSize: 11, textTransform: "uppercase" },
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
  roleLabel: { color: colors.textSecondary, fontFamily: fontFamily.title, fontSize: fontSize.sm, marginBottom: spacing.xs },
  methodLabel: { marginTop: spacing.md },
  roleRow: { flexDirection: "row", gap: spacing.sm },
  roleButton: {
    flex: 1,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.cardHighest,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  roleButtonActive: { backgroundColor: colors.primaryWash, borderColor: colors.borderStrong },
  roleText: { color: colors.textSecondary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  roleTextActive: { color: colors.primary },
  primaryButton: {
    height: 60,
    borderRadius: radius.xl,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    ...glow.primary,
  },
  disabled: { opacity: 0.6 },
  primaryText: { color: colors.onPrimary, fontFamily: fontFamily.headline, fontSize: 16 },
  signInButton: { alignItems: "center", paddingVertical: spacing.sm },
  signInText: { color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 14 },
  });
}
