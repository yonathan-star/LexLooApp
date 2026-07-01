import React, { useCallback, useRef, useState } from "react";
import { ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/Button";
import { RewardModal } from "../../components/RewardModal";
import { colors, fontFamily, fontSize, glow, radius, shadow, spacing } from "../../theme";
import { useAuth } from "../../context/AuthContext";
import { useScanTile } from "../../api/queries";

const SCANNER_BG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDDoPxgskZIRLkovLyJ_BJ3T4b2Nrmq3gDodkwVL4UwLvkgvMjGqYAb1yxMVvRTWtLcQ2v-ubjcbGcW5gL40vxKhNcngxX01Vu7LqkO7ijgYE1HQPKTE8qEo1VbIstidTQKylIbGPDnIHdcs7eNH-YrQW2ilv0vYNGlTN2Qup1I3ZeEjf-MqK8WSyKjbtzAUuAFXBXTyDeNWkkoGVkPc_Irpvy7rXzWeodMPeAE9c2XA2hCUTelbh6DxaCleLHrfpg3TUbJL8sh-Hv7";

export function ScannerScreen() {
  const navigation = useNavigation<any>();
  const { activeProfile } = useAuth();
  const [permission, requestPermission] = useCameraPermissions();
  const scanTile = useScanTile();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [resultWord, setResultWord] = useState<string | null>(null);
  const [pendingBadge, setPendingBadge] = useState<{ name: string } | null>(null);
  const [pendingWordId, setPendingWordId] = useState<string | null>(null);
  const lockRef = useRef(false);

  const handleBarcodeScanned = useCallback(
    async ({ data }: { data: string }) => {
      if (lockRef.current || !activeProfile) return;
      lockRef.current = true;
      const code = data.replace("lexloo://tile/", "").replace(/^https?:\/\/lexloo\.app\/t\//, "");
      try {
        const result = await scanTile.mutateAsync({ profileId: activeProfile.id, code, source: "camera" });
        if (result.word) {
          setResultWord(result.word.text);
          setStatus("success");
          const wordId = result.word.id;
          const firstBadge = result.newBadges?.[0] ?? null;
          setTimeout(() => {
            if (firstBadge) {
              setPendingWordId(wordId);
              setPendingBadge(firstBadge);
            } else {
              navigation.navigate("WordDetail", { wordId });
            }
            setStatus("idle");
            lockRef.current = false;
          }, 900);
        } else {
          setStatus("error");
          lockRef.current = false;
        }
      } catch {
        setStatus("error");
        lockRef.current = false;
      }
    },
    [activeProfile, navigation, scanTile]
  );

  if (!permission) return null;
  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionSafe}>
        <View style={styles.topBar}>
          <View style={styles.brandRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarIcon}>●</Text>
            </View>
            <Text style={styles.logo}>LexLoo</Text>
          </View>
          <View style={styles.streakPill}>
            <Text style={styles.streakText}>12 Streak • 1.2k XP</Text>
          </View>
        </View>
        <View style={styles.permissionCard}>
          <Text style={styles.permissionIcon}>◇</Text>
          <Text style={styles.permissionTitle}>Camera access</Text>
          <Text style={styles.permissionText}>Align word tile within the frame to scan.</Text>
          <Button label="Allow Camera" onPress={requestPermission} style={{ marginTop: spacing.md }} />
          <Button label="Enter code manually" variant="ghost" onPress={() => navigation.navigate("ManualCodeEntry")} style={{ marginTop: spacing.sm }} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.root}>
      <ImageBackground source={{ uri: SCANNER_BG }} style={StyleSheet.absoluteFill} resizeMode="cover">
        <View style={styles.photoOverlay} />
      </ImageBackground>
      <CameraView
        style={StyleSheet.absoluteFill}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={status === "idle" ? handleBarcodeScanned : undefined}
      />
      <View style={styles.cameraTint} />

      <SafeAreaView style={styles.overlay} edges={["top", "left", "right"]}>
        <View style={styles.topBar}>
          <View style={styles.brandRow}>
            <View style={styles.avatarGlass}>
              <Text style={styles.avatarGlassIcon}>●</Text>
            </View>
            <Text style={styles.logo}>LexLoo</Text>
          </View>
          <View style={styles.streakGlass}>
            <Text style={styles.streakGlassText}>12 Streak • 1.2k XP</Text>
          </View>
        </View>

        <View style={styles.scanStage}>
          <View style={styles.analyzingPill}>
            <Text style={styles.analyzingIcon}>◎</Text>
            <Text style={styles.analyzingText}>{status === "success" ? `Unlocked ${resultWord}` : status === "error" ? "Try Again" : "Analyzing..."}</Text>
          </View>
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
            <View style={styles.scanLine} />
          </View>
        </View>

        <View style={styles.helperArea}>
          <View style={styles.helperGlass}>
            <Text style={styles.helperText}>
              {status === "error" ? "We could not read that tile. Try again or enter the code manually." : "Align word tile within the frame to scan"}
            </Text>
          </View>
          {status === "error" ? (
            <View style={styles.errorRow}>
              <Button label="Try Again" onPress={() => setStatus("idle")} style={{ flex: 1 }} />
              <Button label="Enter Code" variant="ghost" onPress={() => navigation.navigate("ManualCodeEntry")} style={{ flex: 1 }} />
            </View>
          ) : (
            <Pressable style={styles.manualPill} onPress={() => navigation.navigate("ManualCodeEntry")}>
              <Text style={styles.manualIcon}>⌨</Text>
              <Text style={styles.manualText}>Enter code manually</Text>
            </Pressable>
          )}
        </View>
      </SafeAreaView>

      <RewardModal
        visible={Boolean(pendingBadge)}
        title={pendingBadge?.name ?? ""}
        subtitle="New badge unlocked!"
        onDismiss={() => {
          setPendingBadge(null);
          if (pendingWordId) navigation.navigate("WordDetail", { wordId: pendingWordId });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000" },
  permissionSafe: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.safeMargin, paddingTop: spacing.md },
  photoOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.08)" },
  cameraTint: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.2)" },
  overlay: { flex: 1, justifyContent: "space-between", paddingHorizontal: spacing.safeMargin, paddingTop: spacing.md, paddingBottom: 112 },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  brandRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryWash,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarIcon: { color: colors.primary },
  avatarGlass: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(39,106,250,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarGlassIcon: { color: colors.primary },
  logo: { color: colors.primary, fontFamily: fontFamily.display, fontSize: fontSize.display, lineHeight: 38 },
  streakPill: { backgroundColor: colors.orangeWash, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 8 },
  streakText: { color: colors.onAccentOrange, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  streakGlass: {
    backgroundColor: "rgba(255,255,255,0.4)",
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
  },
  streakGlassText: { color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  scanStage: { flex: 1, alignItems: "center", justifyContent: "center" },
  scanFrame: {
    width: 288,
    height: 288,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
    backgroundColor: "rgba(255,255,255,0.05)",
    ...glow.primary,
  },
  corner: { position: "absolute", width: 48, height: 48, borderColor: colors.primary },
  cornerTL: { top: -2, left: -2, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 40 },
  cornerTR: { top: -2, right: -2, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 40 },
  cornerBL: { bottom: -2, left: -2, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 40 },
  cornerBR: { bottom: -2, right: -2, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 40 },
  scanLine: {
    position: "absolute",
    left: 16,
    right: 16,
    top: 96,
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.65,
    shadowRadius: 10,
  },
  analyzingPill: {
    position: "absolute",
    top: "20%",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(0,0,0,0.8)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    zIndex: 2,
  },
  analyzingIcon: { color: colors.primary, fontFamily: fontFamily.display },
  analyzingText: { color: colors.white, fontFamily: fontFamily.bodyBold, fontSize: 12, letterSpacing: 1.6, textTransform: "uppercase" },
  helperArea: { alignItems: "center", gap: spacing.md },
  helperGlass: {
    maxWidth: 320,
    backgroundColor: "rgba(255,255,255,0.6)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)",
    borderRadius: 20,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...shadow.card,
  },
  helperText: { color: colors.textPrimary, fontFamily: fontFamily.bodyBold, fontSize: 12, textAlign: "center", lineHeight: 18 },
  manualPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(252,249,248,0.42)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  manualIcon: { color: colors.textSecondary, fontSize: 18 },
  manualText: { color: colors.textSecondary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  errorRow: { flexDirection: "row", gap: spacing.sm, width: "100%" },
  permissionCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 32,
    padding: spacing.lg,
    marginVertical: spacing.xl,
    ...shadow.card,
  },
  permissionIcon: { color: colors.primary, fontFamily: fontFamily.display, fontSize: 48 },
  permissionTitle: { color: colors.textPrimary, fontFamily: fontFamily.headline, fontSize: fontSize.xl, marginTop: spacing.md },
  permissionText: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: fontSize.sm, textAlign: "center", marginTop: spacing.sm },
});
