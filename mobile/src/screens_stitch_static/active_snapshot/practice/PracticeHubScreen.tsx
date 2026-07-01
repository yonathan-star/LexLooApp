import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { colors, fontFamily, fontSize, glow, radius, shadow, spacing } from "../../theme";

export function PracticeHubScreen() {
  const navigation = useNavigation<any>();
  const [flipped, setFlipped] = useState(false);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
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

      <View style={styles.content}>
        <View style={styles.progressHeader}>
          <View style={styles.dots}>
            {Array.from({ length: 7 }).map((_, index) => (
              <View key={`active-${index}`} style={styles.activeDot} />
            ))}
            {Array.from({ length: 3 }).map((_, index) => (
              <View key={`inactive-${index}`} style={styles.inactiveDot} />
            ))}
          </View>
          <Text style={styles.counter}>7 / 10</Text>
        </View>

        <Pressable style={styles.flipCard} onPress={() => setFlipped((value) => !value)}>
          {!flipped ? (
            <View style={styles.cardFace}>
              <View style={styles.wordMeta}>
                <Text style={styles.wordMetaIcon}>◇</Text>
                <Text style={styles.wordMetaText}>WORD 7</Text>
              </View>
              <Text style={styles.practiceWord}>Ethereal</Text>
              <Text style={styles.practicePhonetic}>/ɪˈθɪəriəl/</Text>
              <View style={styles.tapHint}>
                <Text style={styles.tapIcon}>⌁</Text>
                <Text style={styles.tapText}>Tap to flip</Text>
              </View>
            </View>
          ) : (
            <View style={[styles.cardFace, styles.backFace]}>
              <Text style={styles.backTitle}>Definition</Text>
              <Text style={styles.backDefinition}>Extremely delicate and light in a way that seems too perfect for this world.</Text>
              <View style={styles.divider} />
              <View style={styles.exampleBlock}>
                <Text style={styles.exampleLabel}>Example</Text>
                <Text style={styles.exampleText}>"The singer's ethereal voice left the audience in a state of absolute calm."</Text>
              </View>
            </View>
          )}
        </Pressable>

        <Text style={styles.swipeHint}>Swipe left to skip or right to repeat later.</Text>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.reviewButton} onPress={() => setFlipped(false)}>
          <Text style={styles.reviewIcon}>↻</Text>
          <Text style={styles.reviewText}>Need Review</Text>
        </Pressable>
        <Pressable style={styles.knowButton} onPress={() => navigation.navigate("PracticeSession", { activityType: "flashcard" })}>
          <Text style={styles.knowIcon}>✓</Text>
          <Text style={styles.knowText}>I Know It</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.safeMargin,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: "rgba(252,249,248,0.7)",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  brandRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryWash,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarIcon: { color: colors.primary, fontSize: 16 },
  logo: { color: colors.primary, fontFamily: fontFamily.display, fontSize: fontSize.display, lineHeight: 38 },
  streakPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    backgroundColor: colors.cardHighest,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  streakText: { color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  content: { flex: 1, paddingHorizontal: spacing.safeMargin, paddingTop: spacing.lg, alignItems: "center" },
  progressHeader: { width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 40 },
  dots: { flexDirection: "row", alignItems: "center", gap: 6 },
  activeDot: { width: 24, height: 6, borderRadius: 3, backgroundColor: colors.primary },
  inactiveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.cardHighest },
  counter: { color: colors.textSecondary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  flipCard: { width: "100%", aspectRatio: 0.8 },
  cardFace: {
    flex: 1,
    borderRadius: 24,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    ...shadow.card,
  },
  backFace: { backgroundColor: colors.primaryWash },
  wordMeta: { position: "absolute", top: 24, left: 24, flexDirection: "row", alignItems: "center", gap: 8, opacity: 0.42 },
  wordMetaIcon: { color: colors.textPrimary, fontSize: 16 },
  wordMetaText: { color: colors.textPrimary, fontFamily: fontFamily.mono, fontSize: 11, letterSpacing: 1.6 },
  practiceWord: { color: colors.primary, fontFamily: fontFamily.display, fontSize: 42, lineHeight: 50, marginBottom: spacing.md },
  practicePhonetic: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 14 },
  tapHint: { position: "absolute", bottom: spacing.xl, alignItems: "center", opacity: 0.6 },
  tapIcon: { color: colors.textSecondary, fontSize: 28, marginBottom: 8 },
  tapText: { color: colors.textSecondary, fontFamily: fontFamily.mono, fontSize: 11 },
  backTitle: { color: colors.textPrimary, fontFamily: fontFamily.headline, fontSize: fontSize.lg, marginBottom: spacing.md },
  backDefinition: { color: colors.textPrimary, fontFamily: fontFamily.body, fontSize: 16, lineHeight: 26, textAlign: "center", marginBottom: spacing.lg },
  divider: { width: "100%", height: 1, backgroundColor: "rgba(0,81,213,0.1)", marginBottom: spacing.lg },
  exampleBlock: { width: "100%" },
  exampleLabel: { color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 12, marginBottom: spacing.sm },
  exampleText: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 14, lineHeight: 22, fontStyle: "italic" },
  swipeHint: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 14, textAlign: "center", opacity: 0.72, marginTop: spacing.lg },
  actions: {
    flexDirection: "row",
    gap: spacing.md,
    paddingHorizontal: spacing.safeMargin,
    paddingTop: spacing.md,
    paddingBottom: 112,
    backgroundColor: "rgba(252,249,248,0.92)",
  },
  reviewButton: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.cardHighest,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    ...shadow.card,
  },
  reviewIcon: { color: colors.textPrimary, fontSize: 18 },
  reviewText: { color: colors.textPrimary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  knowButton: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    ...glow.primary,
  },
  knowIcon: { color: colors.white, fontSize: 18 },
  knowText: { color: colors.white, fontFamily: fontFamily.bodyBold, fontSize: 12 },
});
