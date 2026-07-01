import { LexLooMark } from "../../components/LexLooMark";
import React, { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { usePackDetail } from "../../api/queries";
import { EmptyState, ErrorState, LoadingState } from "../../components/StateViews";
import { fontFamily, fontSize, glow, radius, shadow, spacing } from "../../theme";
import type { Word } from "../../types";
import { useColors } from "../../context/ThemeContext";

export function PackDetailScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const packId = route.params?.packId as string | undefined;
  const pack = usePackDetail(packId);

  if (pack.isLoading) return <LoadingState label="Loading pack..." />;
  if (pack.isError) return <ErrorState message="We couldn't load this pack." onRetry={() => pack.refetch()} />;
  if (!pack.data) return <EmptyState title="Pack not found" message="This pack is no longer available." actionLabel="Back" onAction={() => navigation.goBack()} />;

  const words = pack.data.packWords?.map((item) => item.word).filter(Boolean) ?? [];

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </Pressable>
          <LexLooMark />
          <View style={styles.pill}>
            <Text style={styles.pillText}>{words.length} Words</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <View style={styles.medallion}>
            <Ionicons name="albums" size={36} color={colors.primary} />
          </View>
          <Text style={styles.eyebrow}>{pack.data.category ?? "Pack"}</Text>
          <Text style={styles.title}>{pack.data.name}</Text>
          <Text style={styles.subtitle}>{pack.data.description ?? "Practice this pack to build mastery across related words."}</Text>
          <Pressable style={styles.primaryButton} onPress={() => navigation.navigate("PracticeSession", { activityType: "multiple_choice", packId })}>
            <Text style={styles.primaryText}>Practice Pack</Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Word List</Text>
        </View>
        <View style={styles.list}>
          {words.length ? (
            words.map((word, index) => <WordRow key={word.id} word={word} index={index} onPress={() => navigation.navigate("WordDetail", { wordId: word.id })} />)
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No words assigned</Text>
              <Text style={styles.emptyText}>Admin-created words will appear here when this pack is populated.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function WordRow({ word, index, onPress }: { word: Word; index: number; onPress: () => void }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <Pressable style={styles.wordRow} onPress={onPress}>
      <View style={[styles.wordIcon, { backgroundColor: index % 2 === 0 ? colors.primaryWash : colors.orangeWash }]}>
        <Text style={[styles.wordIconText, { color: index % 2 === 0 ? colors.primary : colors.accentOrange }]}>{index + 1}</Text>
      </View>
      <View style={styles.wordMain}>
        <Text style={styles.wordText}>{word.text}</Text>
        <Text style={styles.wordMeta}>{[word.partOfSpeech, word.gradeLevel, `Difficulty ${word.difficultyScore}`].filter(Boolean).join(" • ")}</Text>
        <Text style={styles.wordDefinition} numberOfLines={2}>{word.content?.shortDefinition ?? "Open this word for definition, examples, and practice."}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color={colors.textMuted} />
    </Pressable>
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
  hero: {
    borderRadius: 32,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    alignItems: "center",
    ...shadow.card,
  },
  medallion: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.primaryWash, alignItems: "center", justifyContent: "center", marginBottom: spacing.md, ...glow.primary },
  eyebrow: { color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 12, letterSpacing: 1.6, textTransform: "uppercase" },
  title: { color: colors.textPrimary, fontFamily: fontFamily.display, fontSize: fontSize.xl, textAlign: "center", marginTop: spacing.sm },
  subtitle: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 15, lineHeight: 24, textAlign: "center", marginTop: spacing.sm },
  primaryButton: { height: 56, alignSelf: "stretch", borderRadius: radius.xl, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", marginTop: spacing.lg, ...glow.primary },
  primaryText: { color: colors.onPrimary, fontFamily: fontFamily.headline, fontSize: 15 },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  sectionTitle: { color: colors.textPrimary, fontFamily: fontFamily.headline, fontSize: fontSize.lg },
  list: { gap: spacing.md },
  wordRow: {
    minHeight: 106,
    borderRadius: 22,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    ...shadow.card,
  },
  wordIcon: { width: 46, height: 46, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  wordIconText: { fontFamily: fontFamily.display, fontSize: 18 },
  wordMain: { flex: 1 },
  wordText: { color: colors.textPrimary, fontFamily: fontFamily.headline, fontSize: fontSize.md },
  wordMeta: { color: colors.primary, fontFamily: fontFamily.mono, fontSize: 11, marginTop: 3 },
  wordDefinition: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 13, lineHeight: 20, marginTop: 7 },
  emptyCard: { borderRadius: 22, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, ...shadow.card },
  emptyTitle: { color: colors.textPrimary, fontFamily: fontFamily.headline, fontSize: fontSize.md },
  emptyText: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 14, lineHeight: 22, marginTop: spacing.sm },
  });
}
