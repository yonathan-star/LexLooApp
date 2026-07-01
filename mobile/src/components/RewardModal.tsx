import React, { useEffect, useState, useMemo } from "react";
import { Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { fontFamily, fontSize, glow, radius, spacing } from "../theme";
import { haptics } from "../lib/haptics";
import { Confetti } from "./Confetti";
import { useColors } from "../context/ThemeContext";

const BADGE_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCN1CWqVtrr4Nr4p8-OEgQxWJOmpVxXhsqyL5rT-pTW12pYg-leJqVJVAqtuun5Q8W_xTQDlEwjzUT12TrLZayWVpjkbddTvtGctLdC-nsEDGkLkSkNeJfWtslyRy3mv7djz8WpIwJl4r0pkCNl0rM5DHQpNvqFTILtNw_Pfkt6XDpjn0iiUcAEObIvxVIx0TSqEzqQugM0Qu0Sj-7zEe5cKB-5IGz31CmpvrT-D4vw9C1tTYruL-bgFB9RyyNQgilOe_Er6tlwj9Lq";

export function RewardModal({
  visible,
  title,
  subtitle,
  xp,
  onDismiss,
}: {
  visible: boolean;
  title: string;
  subtitle?: string;
  xp?: number;
  onDismiss: () => void;
}) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (visible) {
      haptics.celebrate();
      setShowConfetti(true);
    } else {
      setShowConfetti(false);
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <View style={styles.overlay}>
        <Confetti active={showConfetti} />
        <View style={styles.card}>
          <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={onDismiss} style={styles.close}>
            <Text style={styles.closeText}>×</Text>
          </Pressable>
          <View style={styles.milestonePill}>
            <Text style={styles.milestoneText}>NEW MILESTONE</Text>
          </View>
          <View style={styles.medallionStage}>
            <View style={styles.medallionGlow} />
            <View style={styles.medallion}>
              <Image source={{ uri: BADGE_IMAGE }} style={styles.medallionImage} />
            </View>
          </View>
          <Text style={styles.title}>{title || "MASTER WORDSMITH"}</Text>
          <Text style={styles.subtitle}>{subtitle || "New Achievement Unlocked! You've mastered 500 academic terms."}</Text>
          <View style={styles.rewardCard}>
            <View style={styles.rewardLeft}>
              <View style={styles.rewardIcon}>
                <Text style={styles.rewardIconText}>✦</Text>
              </View>
              <Text style={styles.rewardLabel}>Experience Points</Text>
            </View>
            <Text style={styles.rewardXp}>+{xp ?? 100} XP</Text>
          </View>
          <Pressable style={styles.primaryButton} onPress={onDismiss}>
            <Text style={styles.primaryText}>Awesome</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryText}>Share Achievement</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({

  overlay: {
    flex: 1,
    backgroundColor: "rgba(6,20,38,0.92)",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.safeMargin,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    borderRadius: radius.lg,
    backgroundColor: "rgba(30,42,62,0.62)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    padding: spacing.lg,
    alignItems: "center",
  },
  close: { position: "absolute", top: 12, right: 16, width: 32, height: 32, alignItems: "center", justifyContent: "center" },
  closeText: { color: "rgba(214,227,253,0.55)", fontSize: 28 },
  milestonePill: { backgroundColor: "rgba(180,197,255,0.1)", borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, marginBottom: spacing.lg },
  milestoneText: { color: "#B4C5FF", fontFamily: fontFamily.bodyBold, fontSize: 12, letterSpacing: 1.8 },
  medallionStage: { width: 192, height: 192, alignItems: "center", justifyContent: "center", marginBottom: spacing.lg },
  medallionGlow: { position: "absolute", width: 192, height: 192, borderRadius: 96, backgroundColor: "rgba(180,197,255,0.2)" },
  medallion: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 4,
    borderColor: "rgba(180,197,255,0.3)",
    overflow: "hidden",
    backgroundColor: "rgba(41,53,73,0.9)",
    ...glow.primary,
  },
  medallionImage: { width: "100%", height: "100%" },
  title: { color: "#D6E3FD", fontFamily: fontFamily.headline, fontSize: fontSize.xl, textAlign: "center" },
  subtitle: { color: "#C3C6D8", fontFamily: fontFamily.body, fontSize: 16, lineHeight: 25, textAlign: "center", maxWidth: 280, marginTop: spacing.sm, marginBottom: spacing.xl },
  rewardCard: {
    width: "100%",
    borderRadius: radius.lg,
    backgroundColor: "rgba(41,53,73,0.5)",
    borderWidth: 1,
    borderColor: "rgba(254,137,60,0.3)",
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xl,
  },
  rewardLeft: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  rewardIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(254,137,60,0.2)", alignItems: "center", justifyContent: "center" },
  rewardIconText: { color: colors.accentOrange, fontSize: 18 },
  rewardLabel: { color: "#D6E3FD", fontFamily: fontFamily.headline, fontSize: 16 },
  rewardXp: { color: colors.accentOrange, fontFamily: fontFamily.display, fontSize: 24 },
  primaryButton: { width: "100%", height: 56, borderRadius: radius.pill, backgroundColor: "#608BFF", alignItems: "center", justifyContent: "center", ...glow.primary },
  primaryText: { color: "#002A77", fontFamily: fontFamily.headline, fontSize: 18 },
  secondaryButton: { paddingTop: spacing.md },
  secondaryText: { color: "#C3C6D8", fontFamily: fontFamily.body, fontSize: 14 },
  });
}
