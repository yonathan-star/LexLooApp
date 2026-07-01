import { LexLooMark } from "../../components/LexLooMark";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { useCompletePracticeSession, useRecommendations, useStartPracticeSession, useWord } from "../../api/queries";
import { EmptyState, ErrorState, LoadingState } from "../../components/StateViews";
import { fontFamily, fontSize, glow, radius, shadow, spacing } from "../../theme";
import { haptics } from "../../lib/haptics";
import { useColors } from "../../context/ThemeContext";

function shuffledIndices(length: number) {
  const indices = Array.from({ length }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices;
}

export function SentenceBuilderScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { activeProfile } = useAuth();
  const profileId = activeProfile?.id;
  const recommendations = useRecommendations(profileId);
  const startSession = useStartPracticeSession();
  const completeSession = useCompletePracticeSession();
  const startedRef = useRef(false);
  const completingRef = useRef(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionError, setSessionError] = useState(false);
  const wordId = route.params?.wordId ?? recommendations.data?.wordOfDay?.word?.id ?? recommendations.data?.wearOfDay?.word?.id;
  const word = useWord(wordId, profileId);

  const tokens = useMemo(() => {
    const sentence = word.data?.examples?.[0]?.exampleText?.replace(/^["']|["']$/g, "").trim();
    return sentence ? sentence.split(/\s+/) : [];
  }, [word.data]);

  const [pool, setPool] = useState<number[]>([]);
  const [frame, setFrame] = useState<number[]>([]);
  const [checked, setChecked] = useState<"correct" | "incorrect" | null>(null);

  useEffect(() => {
    if (tokens.length) setPool(shuffledIndices(tokens.length));
  }, [tokens.length]);

  useEffect(() => {
    if (!profileId || startedRef.current || !wordId) return;
    startedRef.current = true;
    setSessionError(false);
    startSession
      .mutateAsync({ profileId, wordId, activityType: "sentence_builder" })
      .then((session) => setSessionId(session.id))
      .catch(() => {
        setSessionError(true);
        startedRef.current = false;
      });
  }, [profileId, startSession, wordId]);

  function retryStartSession() {
    setSessionError(false);
    setSessionId(null);
    completingRef.current = false;
    startedRef.current = false;
    startSession.reset();
  }

  if (recommendations.isLoading || word.isLoading) return <LoadingState label="Loading sentence builder..." />;
  if (word.isError) return <ErrorState message="We couldn't load this practice." onRetry={() => word.refetch()} />;
  if (!tokens.length) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <EmptyState
          title="No example sentence yet"
          message="This word doesn't have an example sentence to build yet. Try practicing a different word."
          actionLabel="Back to Practice"
          onAction={() => navigation.goBack()}
        />
      </SafeAreaView>
    );
  }
  if (sessionError) return <ErrorState message="We couldn't start this sentence session." onRetry={retryStartSession} />;
  if (!sessionId) return <LoadingState label="Starting sentence session..." />;

  function addToFrame(tokenIndex: number) {
    if (checked) return;
    setPool((prev) => prev.filter((i) => i !== tokenIndex));
    setFrame((prev) => [...prev, tokenIndex]);
  }

  function removeFromFrame(tokenIndex: number) {
    if (checked) return;
    setFrame((prev) => prev.filter((i) => i !== tokenIndex));
    setPool((prev) => [...prev, tokenIndex]);
  }

  function resetFrame() {
    setFrame([]);
    setPool(shuffledIndices(tokens.length));
    setChecked(null);
  }

  async function checkSentence() {
    if (completingRef.current) return;
    const isCorrect = frame.every((tokenIndex, position) => tokenIndex === position) && frame.length === tokens.length;
    if (isCorrect) haptics.success();
    else haptics.error();
    setChecked(isCorrect ? "correct" : "incorrect");
    const score = isCorrect ? 100 : 0;
    let newBadges: { code: string; name: string }[] = [];
    let xpGained = 0;
    if (profileId && sessionId) {
      completingRef.current = true;
      try {
        const result = await completeSession.mutateAsync({ profileId, sessionId, score });
        newBadges = result.newBadges ?? [];
        xpGained = result.session.xpAwarded ?? 0;
      } catch {
        completingRef.current = false;
        setChecked(null);
        Alert.alert("Practice not saved", "We couldn't finish this sentence session. Please check your connection and try again.");
        return;
      }
    }
    setTimeout(() => {
      navigation.navigate("PracticeResults", {
        score,
        correctCount: isCorrect ? 1 : 0,
        total: 1,
        xpGained,
        newBadges,
        title: "Sentence Builder",
        activityType: "sentence_builder",
        wordId,
      });
    }, isCorrect ? 700 : 1100);
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
            <Text style={styles.pillText}>Sentence Builder</Text>
          </View>
        </View>

        <View style={styles.taskCard}>
          <Text style={styles.taskLabel}>Build the sentence using the word</Text>
          <Text style={styles.taskWord}>{word.data?.text}</Text>
        </View>

        <Text style={styles.sectionLabel}>Your Sentence</Text>
        <View style={[styles.frame, checked === "correct" && styles.frameCorrect, checked === "incorrect" && styles.frameIncorrect]}>
          {frame.length === 0 ? (
            <Text style={styles.framePlaceholder}>Tap tiles below to build the sentence...</Text>
          ) : (
            frame.map((tokenIndex) => (
              <Pressable key={tokenIndex} style={styles.tile} onPress={() => removeFromFrame(tokenIndex)}>
                <Text style={styles.tileText}>{tokens[tokenIndex]}</Text>
              </Pressable>
            ))
          )}
        </View>

        {checked ? (
          <View style={[styles.feedback, checked === "correct" ? styles.feedbackCorrect : styles.feedbackIncorrect]}>
            <Ionicons
              name={checked === "correct" ? "checkmark-circle" : "close-circle"}
              size={18}
              color={checked === "correct" ? colors.success : colors.error}
              style={{ marginBottom: 4 }}
            />
            <Text style={styles.feedbackText}>
              {checked === "correct" ? "Nailed it! That's the right order." : `Not quite. The sentence is: "${tokens.join(" ")}"`}
            </Text>
          </View>
        ) : null}

        <Text style={styles.sectionLabel}>Available Words</Text>
        <View style={styles.pool}>
          {pool.map((tokenIndex) => (
            <Pressable key={tokenIndex} style={styles.tile} onPress={() => addToFrame(tokenIndex)}>
              <Text style={styles.tileText}>{tokens[tokenIndex]}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.actionsRow}>
          <Pressable
            style={styles.resetButton}
            onPress={() => {
              haptics.tap();
              resetFrame();
            }}
          >
            <Ionicons name="refresh" size={16} color={colors.textPrimary} />
            <Text style={styles.resetText}>Reset</Text>
          </Pressable>
          <Pressable
            style={[styles.checkButton, (frame.length !== tokens.length || checked) && styles.disabledButton]}
            disabled={frame.length !== tokens.length || Boolean(checked)}
            onPress={checkSentence}
          >
            <Ionicons name="checkmark-done" size={16} color={colors.onPrimary} />
            <Text style={styles.checkText}>Check Sentence</Text>
          </Pressable>
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
  taskCard: { borderRadius: 28, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, alignItems: "center", ...shadow.card },
  taskLabel: { color: colors.textSecondary, fontFamily: fontFamily.bodyBold, fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase" },
  taskWord: { color: colors.primary, fontFamily: fontFamily.display, fontSize: fontSize.display, marginTop: spacing.sm },
  sectionLabel: { color: colors.textSecondary, fontFamily: fontFamily.bodyBold, fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase" },
  frame: {
    minHeight: 100,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: "dashed",
    backgroundColor: colors.card,
    padding: spacing.md,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  frameCorrect: { borderColor: colors.success, borderStyle: "solid" },
  frameIncorrect: { borderColor: colors.error, borderStyle: "solid" },
  framePlaceholder: { color: colors.textMuted, fontFamily: fontFamily.body, fontStyle: "italic", fontSize: 14 },
  pool: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, justifyContent: "center" },
  tile: {
    borderRadius: 16,
    backgroundColor: colors.cardAlt,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    ...shadow.card,
  },
  tileText: { color: colors.primary, fontFamily: fontFamily.headline, fontSize: 16 },
  feedback: { borderRadius: 16, padding: spacing.md, alignItems: "center" },
  feedbackCorrect: { backgroundColor: colors.successWash },
  feedbackIncorrect: { backgroundColor: "rgba(186,26,26,0.1)" },
  feedbackText: { color: colors.textPrimary, fontFamily: fontFamily.bodyBold, fontSize: 13, textAlign: "center" },
  actionsRow: { flexDirection: "row", gap: spacing.md },
  resetButton: {
    flex: 1,
    height: 56,
    borderRadius: radius.xl,
    backgroundColor: colors.cardHighest,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    gap: spacing.xs,
    alignItems: "center",
    justifyContent: "center",
  },
  resetText: { color: colors.textPrimary, fontFamily: fontFamily.bodyBold, fontSize: 14 },
  checkButton: {
    flex: 2,
    height: 56,
    borderRadius: radius.xl,
    backgroundColor: colors.primary,
    flexDirection: "row",
    gap: spacing.xs,
    alignItems: "center",
    justifyContent: "center",
    ...glow.primary,
  },
  disabledButton: { opacity: 0.42 },
  checkText: { color: colors.onPrimary, fontFamily: fontFamily.headline, fontSize: 15 },
  });
}
