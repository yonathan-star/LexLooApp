import { LexLooMark } from "../../components/LexLooMark";
import React, { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useSavedWords } from "../../api/queries";
import { useAuth } from "../../context/AuthContext";
import { EmptyState, ErrorState, LoadingState } from "../../components/StateViews";
import { fontFamily, fontSize, radius, shadow, spacing } from "../../theme";
import type { Word } from "../../types";
import { useColors } from "../../context/ThemeContext";

export function SavedWordsScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<any>();
  const { activeProfile } = useAuth();
  const savedWords = useSavedWords(activeProfile?.id);

  if (savedWords.isLoading) return <LoadingState label="Loading saved words..." />;
  if (savedWords.isError) return <ErrorState message="We couldn't load saved words." onRetry={() => savedWords.refetch()} />;
  if (!savedWords.data?.length) {
    return <EmptyState title="No saved words yet" message="Save words from word detail to build a review list." actionLabel="Scan a Word" onAction={() => navigation.navigate("ScannerTab")} />;
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
            <Text style={styles.pillText}>{savedWords.data.length} Saved</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Collection</Text>
          <Text style={styles.title}>Saved Words</Text>
          <Text style={styles.subtitle}>Review favorite words, reopen definitions, and practice your personal vocabulary collection.</Text>
        </View>

        <View style={styles.list}>
          {savedWords.data.map((word, index) => (
            <SavedWordRow key={word.id} word={word} index={index} onOpen={() => navigation.navigate("WordDetail", { wordId: word.id })} onPractice={() => navigation.navigate("PracticeSession", { activityType: "flashcard", wordId: word.id })} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SavedWordRow({ word, index, onOpen, onPractice }: { word: Word; index: number; onOpen: () => void; onPractice: () => void }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <Pressable style={styles.wordCard} onPress={onOpen}>
      <View style={[styles.wordIcon, { backgroundColor: index % 2 === 0 ? colors.primaryWash : colors.orangeWash }]}>
        <Ionicons name="bookmark" size={20} color={index % 2 === 0 ? colors.primary : colors.accentOrange} />
      </View>
      <View style={styles.wordMain}>
        <Text style={styles.wordText}>{word.text}</Text>
        <Text style={styles.wordMeta}>{[word.partOfSpeech, word.gradeLevel].filter(Boolean).join(" • ") || "Saved word"}</Text>
        <Text style={styles.definition} numberOfLines={2}>{word.content?.shortDefinition ?? "Open this word to continue learning."}</Text>
      </View>
      <Pressable style={styles.practicePill} onPress={onPractice}>
        <Text style={styles.practiceText}>Practice</Text>
      </Pressable>
    </Pressable>
  );
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({

  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.safeMargin, paddingTop: spacing.md, paddingBottom: 132, gap: spacing.lg },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  logo: { color: colors.primary, fontFamily: fontFamily.display, fontSize: fontSize.display, lineHeight: 38 },
  pill: { backgroundColor: colors.orangeWash, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 8 },
  pillText: { color: colors.accentOrangePressed, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  hero: { borderRadius: 32, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, ...shadow.card },
  eyebrow: { color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 12, letterSpacing: 1.6, textTransform: "uppercase", marginBottom: spacing.sm },
  title: { color: colors.textPrimary, fontFamily: fontFamily.display, fontSize: fontSize.display, lineHeight: 38 },
  subtitle: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 15, lineHeight: 24, marginTop: spacing.sm },
  list: { gap: spacing.md },
  wordCard: { minHeight: 112, borderRadius: 22, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, padding: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.md, ...shadow.card },
  wordIcon: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  wordMain: { flex: 1 },
  wordText: { color: colors.textPrimary, fontFamily: fontFamily.headline, fontSize: fontSize.md },
  wordMeta: { color: colors.primary, fontFamily: fontFamily.mono, fontSize: 11, marginTop: 3 },
  definition: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 13, lineHeight: 20, marginTop: 6 },
  practicePill: { borderRadius: radius.pill, backgroundColor: colors.primaryWash, paddingHorizontal: spacing.sm, paddingVertical: 8 },
  practiceText: { color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 11 },
  });
}
