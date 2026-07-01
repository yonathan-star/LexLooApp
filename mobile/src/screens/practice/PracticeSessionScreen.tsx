import { LexLooMark } from "../../components/LexLooMark";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import {
  useCompletePracticeSession,
  usePackDetail,
  usePacks,
  useQuizOptions,
  useRecommendations,
  useRecordPracticeAttempt,
  useStartPracticeSession,
  useWord,
} from "../../api/queries";
import { EmptyState, ErrorState, LoadingState } from "../../components/StateViews";
import { fontFamily, fontSize, glow, radius, shadow, spacing } from "../../theme";
import { haptics } from "../../lib/haptics";
import type { Word } from "../../types";
import { useColors } from "../../context/ThemeContext";

type ActivityType = "flashcard" | "multiple_choice" | "spelling" | "match" | "sentence_builder";

interface MatchTile {
  key: string;
  pairId: string;
  type: "term" | "definition";
  text: string;
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function PracticeSessionScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { activeProfile } = useAuth();
  const profileId = activeProfile?.id;
  const recommendations = useRecommendations(profileId);
  const packId = route.params?.packId as string | undefined;
  const activityType = (route.params?.activityType ?? "flashcard") as ActivityType;
  const isMultipleChoice = activityType === "multiple_choice";
  const isMatch = activityType === "match";
  const isSpelling = activityType === "spelling";

  const pack = usePackDetail(!isMatch ? packId : undefined);
  const packWordId = pack.data?.packWords?.[0]?.word?.id;
  const wordId = route.params?.wordId ?? packWordId ?? recommendations.data?.wordOfDay?.word?.id ?? recommendations.data?.wearOfDay?.word?.id;
  const word = useWord(!isMatch ? wordId : undefined, profileId);
  const quiz = useQuizOptions(isMultipleChoice ? wordId : undefined);

  // Match mode needs several word/definition pairs at once, not a single
  // word's quiz options — resolve the user's active pack (or the one passed
  // in) and pull a handful of pack words to build a real matching grid.
  const allPacks = usePacks();
  const matchPackId = packId ?? allPacks.data?.find((p) => p.slug === activeProfile?.activeGoalId)?.id ?? allPacks.data?.[0]?.id;
  const matchPack = usePackDetail(isMatch ? matchPackId : undefined);
  const pairs = useMemo(
    () =>
      (matchPack.data?.packWords ?? [])
        .slice(0, 6)
        .map((pw) => ({ id: pw.word.id, term: pw.word.text, definition: pw.word.content?.shortDefinition ?? "No definition yet" })),
    [matchPack.data]
  );
  const tiles = useMemo<MatchTile[]>(
    () =>
      shuffle(
        pairs.flatMap((pair) => [
          { key: `${pair.id}-term`, pairId: pair.id, type: "term" as const, text: pair.term },
          { key: `${pair.id}-def`, pairId: pair.id, type: "definition" as const, text: pair.definition },
        ])
      ),
    [pairs]
  );
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
  const [wrongKeys, setWrongKeys] = useState<string[] | null>(null);
  const [attempts, setAttempts] = useState(0);
  const matchFinishedRef = useRef(false);

  const startSession = useStartPracticeSession();
  const recordAttempt = useRecordPracticeAttempt();
  const completeSession = useCompletePracticeSession();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const completingRef = useRef(false);
  const [sessionError, setSessionError] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [revealed, setRevealed] = useState(false);
  const startedAt = useRef(Date.now());
  const startedRef = useRef(false);

  useEffect(() => {
    if (!profileId || startedRef.current) return;
    if (isMatch) {
      if (!matchPackId) return;
      startedRef.current = true;
      setSessionError(false);
      startSession
        .mutateAsync({ profileId, packId: matchPackId, activityType })
        .then((session) => {
          sessionIdRef.current = session.id;
          setSessionId(session.id);
        })
        .catch(() => {
          setSessionError(true);
          startedRef.current = false;
        });
      return;
    }
    if (!wordId) return;
    startedRef.current = true;
    setSessionError(false);
    startSession
      .mutateAsync({ profileId, wordId, packId, activityType })
      .then((session) => {
        sessionIdRef.current = session.id;
        setSessionId(session.id);
      })
      .catch(() => {
        setSessionError(true);
        startedRef.current = false;
      });
  }, [activityType, isMatch, matchPackId, packId, profileId, startSession, wordId]);

  const options = useMemo(() => quiz.data?.options ?? [], [quiz.data?.options]);
  const spellingBank = useMemo<Word[]>(() => {
    if (!isSpelling) return [];
    const packWords = (pack.data?.packWords ?? []).map((item) => item.word).filter(Boolean);
    if (packWords.length) return packWords;
    return word.data ? [word.data] : [];
  }, [isSpelling, pack.data?.packWords, recommendations.data?.wearOfDay?.word, recommendations.data?.wordOfDay?.word, word.data]);

  function retryStartSession() {
    setSessionError(false);
    setSessionId(null);
    sessionIdRef.current = null;
    completingRef.current = false;
    startedRef.current = false;
    startSession.reset();
  }

  async function finish(score: number, correctCount: number, total: number, answer?: string, isCorrect = score >= 70) {
    if (completingRef.current) return;
    completingRef.current = true;
    try {
      let newBadges: { code: string; name: string }[] = [];
      let xpGained = 0;
      const activeSessionId = sessionIdRef.current ?? sessionId;
      if (profileId && activeSessionId) {
        if (answer && wordId) {
          await recordAttempt.mutateAsync({
            sessionId: activeSessionId,
            wordId,
            promptType: activityType,
            answer,
            isCorrect,
            responseTimeMs: Date.now() - startedAt.current,
          });
        }
        const result = await completeSession.mutateAsync({ sessionId: activeSessionId, score, profileId });
        newBadges = result.newBadges ?? [];
        xpGained = result.session.xpAwarded ?? 0;
      }
      navigation.navigate("PracticeResults", {
        score,
        correctCount,
        total,
        xpGained,
        newBadges,
        title: isMultipleChoice ? "Multiple Choice Quiz" : isMatch ? "Match Definition Game" : isSpelling ? "Spelling Challenge" : "Flashcard Practice",
        activityType,
        packId: isMatch ? matchPackId : packId,
        wordId,
      });
    } catch {
      completingRef.current = false;
      Alert.alert("Practice not saved", "We couldn't save this practice result. Please check your connection and try again.");
    }
  }

  function tapTile(tile: MatchTile) {
    if (matchedIds.has(tile.pairId) || wrongKeys) return;
    if (!selectedKey) {
      haptics.tap();
      setSelectedKey(tile.key);
      return;
    }
    if (selectedKey === tile.key) {
      setSelectedKey(null);
      return;
    }
    const selectedTile = tiles.find((t) => t.key === selectedKey);
    if (selectedTile && selectedTile.pairId === tile.pairId && selectedTile.type !== tile.type) {
      haptics.success();
      setMatchedIds((prev) => new Set(prev).add(tile.pairId));
      setSelectedKey(null);
    } else {
      haptics.error();
      setAttempts((value) => value + 1);
      setWrongKeys([selectedKey, tile.key]);
      setTimeout(() => {
        setWrongKeys(null);
        setSelectedKey(null);
      }, 500);
    }
  }

  useEffect(() => {
    if (!isMatch || matchFinishedRef.current || !sessionId || pairs.length === 0 || matchedIds.size < pairs.length) return;
    matchFinishedRef.current = true;
    const score = Math.max(0, 100 - attempts * 10);
    async function completeMatch() {
      const activeSessionId = sessionIdRef.current ?? sessionId;
      if (profileId && activeSessionId) {
        for (const pair of pairs) {
          await recordAttempt.mutateAsync({
            sessionId: activeSessionId,
            wordId: pair.id,
            promptType: "match",
            answer: "matched",
            isCorrect: true,
            responseTimeMs: Date.now() - startedAt.current,
          });
        }
      }
      finish(score, pairs.length, pairs.length, undefined, score >= 70);
    }
    completeMatch();
  }, [attempts, isMatch, matchedIds.size, pairs, pairs.length, profileId, recordAttempt, sessionId]);

  function submitSpelling() {
    const normalizedTyped = typedAnswer.trim().toLowerCase();
    const normalizedWord = (word.data?.text ?? "").trim().toLowerCase();
    const isCorrect = Boolean(normalizedTyped && normalizedTyped === normalizedWord);
    if (isCorrect) haptics.success();
    else haptics.error();
    finish(isCorrect ? 100 : 0, isCorrect ? 1 : 0, 1, typedAnswer, isCorrect);
  }

  if (isMatch) {
    if (allPacks.isLoading || matchPack.isLoading) return <LoadingState label="Loading match game..." />;
    if (allPacks.isError || matchPack.isError) return <ErrorState message="We couldn't load this match game." onRetry={() => matchPack.refetch()} />;
    if (sessionError) return <ErrorState message="We couldn't start this match session." onRetry={retryStartSession} />;
    if (!sessionId) return <LoadingState label="Starting match session..." />;

    return (
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.topBar}>
            <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
            </Pressable>
            <LexLooMark />
            <View style={styles.pill}>
              <Text style={styles.pillText}>
                {matchedIds.size}/{pairs.length} Matched
              </Text>
            </View>
          </View>
          <Text style={styles.matchHint}>Tap a word, then tap its matching definition.</Text>
          <View style={styles.matchGrid}>
            {tiles.map((tile) => {
              const matched = matchedIds.has(tile.pairId);
              const selected = selectedKey === tile.key;
              const wrong = wrongKeys?.includes(tile.key);
              return (
                <Pressable
                  key={tile.key}
                  style={[
                    styles.matchTile,
                    tile.type === "term" ? styles.matchTermTile : styles.matchDefinitionTile,
                    selected && styles.matchTileSelected,
                    wrong && styles.matchTileWrong,
                    matched && styles.matchTileMatched,
                  ]}
                  disabled={matched}
                  onPress={() => tapTile(tile)}
                >
                  <Text style={[styles.matchTileText, matched && styles.matchTileTextMatched]} numberOfLines={4}>
                    {tile.text}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if ((recommendations.isLoading && !route.params?.wordId) || pack.isLoading || word.isLoading || (isMultipleChoice && quiz.isLoading)) return <LoadingState label="Loading practice..." />;
  if (pack.isError || word.isError || (isMultipleChoice && quiz.isError)) return <ErrorState message="We couldn't load this practice session." onRetry={() => word.refetch()} />;
  if (!wordId) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <EmptyState
          title="No practice word yet"
          message="Choose a pack with words before starting this practice mode."
          actionLabel="Browse Packs"
          onAction={() => navigation.navigate("PackLibrary")}
        />
      </SafeAreaView>
    );
  }
  if (sessionError) return <ErrorState message="We couldn't start this practice session." onRetry={retryStartSession} />;
  if (!sessionId) return <LoadingState label="Starting practice session..." />;

  const currentWord = word.data;
  const prompt = quiz.data?.prompt ?? currentWord?.text ?? "Practice";
  const definition = currentWord?.content?.shortDefinition ?? "Review this word and mark whether you know it.";
  const modeLabel = isMultipleChoice ? "Quiz" : isSpelling ? "Spelling" : "Flashcard";
  const modeTitle = isMultipleChoice ? "Choose the definition" : isSpelling ? "Spell the word" : "Practice word";

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </Pressable>
          <LexLooMark />
          <View style={styles.pill}>
            <Text style={styles.pillText}>{modeLabel}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.eyebrow}>{modeTitle}</Text>
          {pack.data?.name ? <Text style={styles.packContext}>{pack.data.name}</Text> : null}
          <Text style={styles.prompt}>{isSpelling ? definition : prompt}</Text>
          <Text style={styles.phonetic}>{currentWord?.content?.phonetic ?? currentWord?.partOfSpeech ?? "LexLoo word"}</Text>
          {isSpelling ? (
            <>
              <TextInput
                style={styles.spellingInput}
                value={typedAnswer}
                onChangeText={setTypedAnswer}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Type the word"
                placeholderTextColor={colors.textMuted}
                returnKeyType="done"
                onSubmitEditing={submitSpelling}
              />
              {spellingBank.length > 1 ? (
                <View style={styles.wordBank}>
                  <Text style={styles.wordBankLabel}>Word Bank</Text>
                  <View style={styles.wordBankGrid}>
                    {spellingBank.map((bankWord) => (
                      <View key={bankWord.id} style={styles.wordBankTile}>
                        <Text style={styles.wordBankText}>{bankWord.text}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ) : null}
            </>
          ) : null}
          {!isMultipleChoice && !isSpelling ? (
            <Pressable style={styles.revealButton} onPress={() => setRevealed((value) => !value)}>
              {!revealed ? <Ionicons name="eye-outline" size={16} color={colors.textPrimary} style={{ marginBottom: 4 }} /> : null}
              <Text style={styles.revealText}>{revealed ? definition : "Tap to reveal definition"}</Text>
            </Pressable>
          ) : null}
        </View>

        {isMultipleChoice ? (
          <View style={styles.options}>
            {options.map((option) => {
              const active = selectedAnswer === option.wordId;
              return (
                <Pressable
                  key={option.wordId}
                  style={[styles.option, active && styles.activeOption]}
                  onPress={() => {
                    haptics.select();
                    setSelectedAnswer(option.wordId);
                  }}
                >
                  <Text style={[styles.optionText, active && styles.activeOptionText]}>{option.text}</Text>
                  {active ? <Ionicons name="checkmark-circle" size={18} color={colors.primary} /> : null}
                </Pressable>
              );
            })}
          </View>
        ) : isSpelling ? null : (
          <View style={styles.options}>
            <Pressable style={styles.option} onPress={() => finish(40, 0, 1, "needs_review", false)}>
              <Ionicons name="refresh-outline" size={18} color={colors.textPrimary} />
              <Text style={styles.optionText}>Need Review</Text>
            </Pressable>
            <Pressable style={[styles.option, styles.activeOption]} onPress={() => finish(100, 1, 1, "known", true)}>
              <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
              <Text style={styles.activeOptionText}>I Know It</Text>
            </Pressable>
          </View>
        )}

        {isMultipleChoice ? (
          <Pressable
            style={[styles.primaryButton, !selectedAnswer && styles.disabledButton]}
            disabled={!selectedAnswer}
            onPress={() => {
              const isCorrect = selectedAnswer === quiz.data?.correctWordId;
              if (isCorrect) haptics.success();
              else haptics.error();
              finish(isCorrect ? 100 : 0, isCorrect ? 1 : 0, 1, selectedAnswer ?? "", isCorrect);
            }}
          >
            <Text style={styles.primaryText}>Submit Answer</Text>
          </Pressable>
        ) : null}
        {isSpelling ? (
          <Pressable style={[styles.primaryButton, !typedAnswer.trim() && styles.disabledButton]} disabled={!typedAnswer.trim()} onPress={submitSpelling}>
            <Ionicons name="checkmark-done" size={18} color={colors.onPrimary} />
            <Text style={styles.primaryText}>Check Spelling</Text>
          </Pressable>
        ) : null}
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
  logo: { color: colors.primary, fontFamily: fontFamily.display, fontSize: fontSize.display, lineHeight: 38 },
  pill: { backgroundColor: colors.orangeWash, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 8 },
  pillText: { color: colors.accentOrangePressed, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  matchHint: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 14, textAlign: "center" },
  matchGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  matchTile: {
    width: "48%",
    minHeight: 84,
    marginBottom: spacing.sm,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    ...shadow.card,
  },
  matchTermTile: { backgroundColor: colors.primaryWash },
  matchDefinitionTile: { backgroundColor: colors.card },
  matchTileSelected: { borderColor: colors.borderStrong, borderWidth: 2, ...glow.primary },
  matchTileWrong: { backgroundColor: "rgba(186,26,26,0.12)", borderColor: colors.error },
  matchTileMatched: { backgroundColor: colors.successWash, opacity: 0.5 },
  matchTileText: { color: colors.textPrimary, fontFamily: fontFamily.bodyBold, fontSize: 13, textAlign: "center" },
  matchTileTextMatched: { color: colors.success },
  card: {
    minHeight: 360,
    borderRadius: 32,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    ...shadow.card,
  },
  eyebrow: { color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 12, letterSpacing: 1.6, textTransform: "uppercase", marginBottom: spacing.md },
  packContext: { color: colors.accentOrangePressed, fontFamily: fontFamily.mono, fontSize: 11, marginBottom: spacing.sm, textAlign: "center" },
  prompt: { color: colors.textPrimary, fontFamily: fontFamily.display, fontSize: 38, lineHeight: 46, textAlign: "center" },
  phonetic: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 14, marginTop: spacing.sm, textAlign: "center" },
  revealButton: { marginTop: spacing.lg, borderRadius: 24, backgroundColor: colors.primaryWash, borderWidth: 1, borderColor: colors.borderStrong, padding: spacing.lg, alignSelf: "stretch" },
  revealText: { color: colors.textPrimary, fontFamily: fontFamily.body, fontSize: 16, lineHeight: 26, textAlign: "center" },
  spellingInput: {
    alignSelf: "stretch",
    minHeight: 62,
    borderRadius: 22,
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
    color: colors.textPrimary,
    fontFamily: fontFamily.headline,
    fontSize: 18,
    textAlign: "center",
  },
  wordBank: { alignSelf: "stretch", marginTop: spacing.md, gap: spacing.sm },
  wordBankLabel: { color: colors.textMuted, fontFamily: fontFamily.bodyBold, fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase" },
  wordBankGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  wordBankTile: {
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  wordBankText: { color: colors.textPrimary, fontFamily: fontFamily.bodyBold, fontSize: 13 },
  options: { gap: spacing.md },
  option: {
    minHeight: 64,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    ...shadow.card,
  },
  activeOption: { backgroundColor: colors.primaryWash, borderColor: colors.borderStrong },
  optionText: { flex: 1, color: colors.textPrimary, fontFamily: fontFamily.bodyBold, fontSize: 14, lineHeight: 22 },
  activeOptionText: { flex: 1, color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 14, lineHeight: 22 },
  primaryButton: { height: 60, borderRadius: radius.xl, backgroundColor: colors.primary, flexDirection: "row", gap: spacing.sm, alignItems: "center", justifyContent: "center", ...glow.primary },
  disabledButton: { opacity: 0.42 },
  primaryText: { color: colors.onPrimary, fontFamily: fontFamily.headline, fontSize: 16 },
  });
}
