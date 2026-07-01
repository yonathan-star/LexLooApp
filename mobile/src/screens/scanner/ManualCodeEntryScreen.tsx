import { LexLooMark } from "../../components/LexLooMark";
import React, { useState, useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../../components/Button";
import { TextField } from "../../components/TextField";
import { useAuth } from "../../context/AuthContext";
import { useScanTile } from "../../api/queries";
import { fontFamily, fontSize, glow, radius, shadow, spacing } from "../../theme";
import { useColors } from "../../context/ThemeContext";

export function ManualCodeEntryScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<any>();
  const { activeProfile } = useAuth();
  const scanTile = useScanTile();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | undefined>();

  async function submit() {
    const normalized = code.trim().toUpperCase();
    if (!normalized) {
      setError("Enter a LexLoo code.");
      return;
    }
    if (!activeProfile) {
      setError("Choose a profile before scanning.");
      return;
    }
    setError(undefined);
    try {
      const result = await scanTile.mutateAsync({ profileId: activeProfile.id, code: normalized, source: "manual" });
      if (result.word) {
        navigation.navigate("WordDetail", { wordId: result.word.id });
      } else if (result.reason === "not_assigned" || result.reason === "not_ready") {
        navigation.navigate("TileNotOwned", { packId: result.pack?.id, tileCode: result.tile?.tileCode });
      } else {
        setError(result.message ?? "We could not find that code. Check it and try again.");
      }
    } catch (err: any) {
      setError(err?.message ?? "We could not check that code. Try again.");
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </Pressable>
          <LexLooMark />
          <View style={styles.pill}>
            <Text style={styles.pillText}>Manual</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <View style={styles.medallion}>
            <Ionicons name="keypad" size={36} color={colors.primary} />
          </View>
          <Text style={styles.eyebrow}>Scanner</Text>
          <Text style={styles.title}>Enter LexLoo Code</Text>
          <Text style={styles.subtitle}>Type a LexLoo code to unlock its word without using the camera.</Text>
        </View>

        <View style={styles.form}>
          <TextField
            label="LexLoo code"
            value={code}
            onChangeText={(value) => setCode(value.toUpperCase())}
            placeholder="LEX1001"
            autoCapitalize="characters"
            autoCorrect={false}
            error={error}
            returnKeyType="done"
            onSubmitEditing={submit}
          />
          <Button label="Unlock Word" onPress={submit} loading={scanTile.isPending} disabled={scanTile.isPending} />
          <Button label="Open Camera Scanner" variant="ghost" onPress={() => navigation.navigate("ScannerTab")} style={styles.secondaryButton} />
        </View>
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
  logo: { color: colors.primary, fontFamily: fontFamily.display, fontSize: fontSize.xl },
  pill: { backgroundColor: colors.orangeWash, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 8 },
  pillText: { color: colors.accentOrangePressed, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  hero: { borderRadius: 32, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, alignItems: "center", ...shadow.card },
  medallion: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.primaryWash, alignItems: "center", justifyContent: "center", marginBottom: spacing.md, ...glow.primary },
  eyebrow: { color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 12, letterSpacing: 1.6, textTransform: "uppercase" },
  title: { color: colors.textPrimary, fontFamily: fontFamily.display, fontSize: fontSize.display, lineHeight: 38, textAlign: "center", marginTop: spacing.sm },
  subtitle: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 15, lineHeight: 24, textAlign: "center", marginTop: spacing.sm },
  form: { borderRadius: 28, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, ...shadow.card },
  secondaryButton: { marginTop: spacing.sm },
  });
}
