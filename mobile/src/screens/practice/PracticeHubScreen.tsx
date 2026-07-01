import { LexLooMark } from "../../components/LexLooMark";
import { ProfileAvatar } from "../../components/ProfileAvatar";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Animated, PanResponder, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import {
  useCompletePracticeSession,
  useMarkLearned,
  usePackDetail,
  usePacks,
  useProgress,
  useRecordPracticeAttempt,
  useStartPracticeSession,
} from "../../api/queries";
import { EmptyState, ErrorState, LoadingState } from "../../components/StateViews";
import { fontFamily, fontSize, radius, shadow, spacing } from "../../theme";
import { haptics } from "../../lib/haptics";
import type { Word } from "../../types";
import { useColors } from "../../context/ThemeContext";

const QUEUE_SIZE = 10;
const SWIPE_THRESHOLD = 100;

export function PracticeHubScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { activeProfile } = useAuth();
  const profileId = activeProfile?.id;
  const restartKey = route.params?.restartAt;
  const requestedPackId = route.params?.packId as string | undefined;

  const progress = useProgress(profileId);
  const packs = usePacks();
  const activePack = useMemo(
    () => packs.data?.find((p) => p.id === requestedPackId) ?? packs.data?.find((p) => p.slug === activeProfile?.activeGoalId) ?? packs.data?.[0],
    [packs.data, requestedPackId, activeProfile?.activeGoalId]
  );
  const packDetail = usePackDetail(activePack?.id);
  const startSession = useStartPracticeSession();
  const recordAttempt = useRecordPracticeAttempt();
  const completeSession = useCompletePracticeSession();
  const markLearned = useMarkLearned();

  const initialQueue = useMemo<Word[]>(() => (packDetail.data?.packWords ?? []).slice(0, QUEUE_SIZE).map((pw) => pw.word), [packDetail.data]);

  const [sessionQueue, setSessionQueue] = useState<Word[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionError, setSessionError] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [sessionNonce, setSessionNonce] = useState(0);
  const startedAt = useRef(Date.now());
  const startedRef = useRef(false);
  const completingRef = useRef(false);
  const requeuedIds = useRef(new Set<string>());
  const pan = useRef(new Animated.ValueXY()).current;

  useEffect(() => {
    if (initialQueue.length && sessionQueue.length === 0) setSessionQueue(initialQueue);
  }, [initialQueue, sessionQueue.length]);

  useEffect(() => {
    if (!restartKey) return;
    resetPractice();
  }, [restartKey]);

  function resetPractice() {
    setSessionQueue(initialQueue);
    setIndex(0);
    setFlipped(false);
    setCorrectCount(0);
    setSessionId(null);
    setSessionError(false);
    setCompleted(false);
    startedAt.current = Date.now();
    startedRef.current = false;
    completingRef.current = false;
    requeuedIds.current = new Set<string>();
    pan.setValue({ x: 0, y: 0 });
    startSession.reset();
    setSessionNonce((value) => value + 1);
  }

  const total = sessionQueue.length;
  const progressRatio = total > 0 ? Math.min(1, (index + 1) / total) : 0;

  useEffect(() => {
    if (!profileId || !activePack?.id || startedRef.current) return;
    startedRef.current = true;
    setSessionError(false);
    startSession
      .mutateAsync({ profileId, activityType: "flashcard", packId: activePack.id })
      .then((session) => setSessionId(session.id))
      .catch(() => {
        setSessionError(true);
        startedRef.current = false;
      });
  }, [activePack?.id, profileId, restartKey, sessionNonce, startSession]);

  function retryStartSession() {
    setSessionError(false);
    setSessionId(null);
    startedRef.current = false;
    completingRef.current = false;
    startSession.reset();
    setSessionNonce((value) => value + 1);
  }

  // Not wrapped in useRef: PanResponder.create's callbacks would otherwise
  // close over whatever `index`/`total`/`advance` were on the very first
  // render (when the queue hadn't loaded yet), permanently freezing them —
  // every swipe would then see a stale `total: 0` and treat itself as the
  // last word. Recreating this each render is cheap and keeps it current.
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_evt, gesture) => Math.abs(gesture.dx) > 14 && Math.abs(gesture.dx) > Math.abs(gesture.dy),
    onPanResponderMove: Animated.event([null, { dx: pan.x }], { useNativeDriver: false }),
    onPanResponderRelease: (_evt, gesture) => {
      if (gesture.dx > SWIPE_THRESHOLD) {
        haptics.success();
        animateOff(1, () => advance(true));
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        haptics.tap();
        animateOff(-1, () => advance(false));
      } else {
        Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
      }
    },
  });

  function animateOff(direction: 1 | -1, onDone: () => void) {
    Animated.timing(pan, { toValue: { x: direction * 500, y: 0 }, duration: 180, useNativeDriver: false }).start(() => {
      pan.setValue({ x: 0, y: 0 });
      onDone();
    });
  }

  async function advance(known: boolean) {
    const currentWord = sessionQueue[index];
    if (currentWord && sessionId && profileId) {
      try {
        await recordAttempt.mutateAsync({
          sessionId,
          wordId: currentWord.id,
          promptType: "flashcard",
          answer: known ? "known" : "needs_review",
          isCorrect: known,
          responseTimeMs: Date.now() - startedAt.current,
        });
        if (known) await markLearned.mutateAsync({ profileId, wordId: currentWord.id });
      } catch {
        Alert.alert("Practice not saved", "We couldn't save this answer. Please check your connection and try again.");
        return;
      }
    }
    const nextCorrect = known ? correctCount + 1 : correctCount;
    setCorrectCount(nextCorrect);
    setFlipped(false);
    startedAt.current = Date.now();

    // "Need Review" isn't just a no-op skip: the word gets one more lap at
    // the end of the queue before the session can finish, so swiping left
    // actually means something instead of just moving past it for good.
    const shouldRequeue = !known && currentWord && !requeuedIds.current.has(currentWord.id);
    if (shouldRequeue) requeuedIds.current.add(currentWord.id);
    const effectiveTotal = shouldRequeue ? total + 1 : total;
    if (shouldRequeue) setSessionQueue((prev) => [...prev, currentWord]);

    const isLast = index + 1 >= effectiveTotal;
    if (isLast) {
      if (completingRef.current) return;
      completingRef.current = true;
      let xpGained = 0;
      let newBadges: { code: string; name: string }[] = [];
      if (sessionId && profileId) {
        try {
          const score = effectiveTotal > 0 ? Math.round((nextCorrect / effectiveTotal) * 100) : 0;
          const result = await completeSession.mutateAsync({ sessionId, score, profileId });
          xpGained = result.session.xpAwarded ?? 0;
          newBadges = result.newBadges ?? [];
        } catch {
          completingRef.current = false;
          Alert.alert("Practice not saved", "We couldn't finish this session. Please check your connection and try again.");
          return;
        }
      }
      setCompleted(true);
      navigation.navigate("PracticeResults", {
        score: effectiveTotal > 0 ? Math.round((nextCorrect / effectiveTotal) * 100) : 0,
        correctCount: nextCorrect,
        total: effectiveTotal,
        xpGained,
        newBadges,
        title: "Flashcard Practice",
        activityType: "flashcard",
        packId: activePack?.id,
      });
      return;
    }
    setIndex((value) => value + 1);
  }

  if (progress.isLoading || packs.isLoading || (activePack?.id && packDetail.isLoading)) {
    return <LoadingState label="Loading your practice queue..." />;
  }
  if (sessionError) {
    return <ErrorState message="We couldn't start your practice session." onRetry={retryStartSession} />;
  }
  if (startedRef.current && !sessionId) {
    return <LoadingState label="Starting practice session..." />;
  }
  if (packs.isError || packDetail.isError) {
    return <ErrorState message="We couldn't load your practice queue." onRetry={() => packDetail.refetch()} />;
  }
  if (!activePack || initialQueue.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <EmptyState
          title="No words to practice yet"
          message="Scan a tile or pick a learning pack to start building your practice queue."
          actionLabel="Browse Packs"
          onAction={() => navigation.navigate("PackLibrary")}
        />
      </SafeAreaView>
    );
  }

  const currentWord = sessionQueue[index];
  const cardRotation = pan.x.interpolate({ inputRange: [-300, 0, 300], outputRange: ["-8deg", "0deg", "8deg"] });

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <ProfileAvatar />
          <LexLooMark />
        </View>
        <View style={styles.streakPill}>
          <Text style={styles.streakText}>
            {progress.data?.streak?.currentCount ?? 0} Streak • {(progress.data?.xp ?? 0).toLocaleString()} XP
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.progressHeader}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressRatio * 100}%` as any }]} />
          </View>
          <Text style={styles.counter}>
            {index + 1} / {total}
          </Text>
        </View>

        {completed ? (
          <View style={styles.completedCard}>
            <View style={styles.completedIcon}>
              <Ionicons name="checkmark-done" size={34} color={colors.onPrimary} />
            </View>
            <Text style={styles.completedTitle}>Practice Complete</Text>
            <Text style={styles.completedBody}>
              You finished {correctCount}/{total} cards. Restart this pack whenever you want another pass.
            </Text>
            <Pressable
              style={styles.restartButton}
              onPress={() => {
                haptics.tap();
                resetPractice();
              }}
            >
              <Ionicons name="refresh" size={18} color={colors.onPrimary} />
              <Text style={styles.restartText}>Restart Practice</Text>
            </Pressable>
          </View>
        ) : (
        <Animated.View
          {...panResponder.panHandlers}
          style={[styles.flipCard, { transform: [{ translateX: pan.x }, { rotate: cardRotation }] }]}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => {
              haptics.select();
              setFlipped((value) => !value);
            }}
          >
            {!flipped ? (
              <View style={styles.cardFace}>
                <View style={styles.wordMeta}>
                  <Ionicons name="sparkles-outline" size={14} color={colors.textPrimary} />
                  <Text style={styles.wordMetaText}>WORD {index + 1}</Text>
                </View>
                <Text style={styles.practiceWord}>{currentWord?.text}</Text>
                <Text style={styles.practicePhonetic}>{currentWord?.content?.phonetic ?? currentWord?.partOfSpeech ?? ""}</Text>
                <View style={styles.tapHint}>
                  <Ionicons name="sync-outline" size={24} color={colors.textSecondary} />
                  <Text style={styles.tapText}>Tap to flip</Text>
                </View>
              </View>
            ) : (
              <View style={[styles.cardFace, styles.backFace]}>
                <Text style={styles.backTitle}>Here's the meaning</Text>
                <Text style={styles.backDefinition}>
                  {currentWord?.content?.shortDefinition ?? "No definition available yet for this word."}
                </Text>
                <View style={styles.divider} />
                <View style={styles.exampleBlock}>
                  <Text style={styles.exampleLabel}>In a sentence</Text>
                  <Text style={styles.exampleText}>{currentWord?.examples?.[0]?.exampleText ?? "No example sentence yet."}</Text>
                </View>
              </View>
            )}
          </Pressable>
        </Animated.View>
        )}

        {!completed ? (
          <View style={styles.swipeHintRow}>
            <Ionicons name="arrow-back" size={14} color={colors.textSecondary} />
            <Text style={styles.swipeHint}>Need review · I know it</Text>
            <Ionicons name="arrow-forward" size={14} color={colors.textSecondary} />
          </View>
        ) : null}

        <View style={styles.practiceModes}>
          <ModeTile icon="options-outline" label="Setup" onPress={() => navigation.navigate("PracticeSetup", { packId: activePack?.id })} />
          <ModeTile icon="help-circle-outline" label="Quiz" onPress={() => navigation.navigate("PracticeSession", { activityType: "multiple_choice", packId: activePack?.id })} />
          <ModeTile icon="grid-outline" label="Match" onPress={() => navigation.navigate("PracticeSession", { activityType: "match", packId: activePack?.id })} />
          <ModeTile icon="create-outline" label="Spell" onPress={() => navigation.navigate("PracticeSession", { activityType: "spelling", packId: activePack?.id })} />
        </View>
        <View style={styles.practiceModes}>
          <ModeTile icon="reader-outline" label="Sentences" onPress={() => navigation.navigate("SentenceBuilder", { packId: activePack?.id })} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ModeTile({ icon, label, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <Pressable style={styles.modeTile} onPress={onPress}>
      <Ionicons name={icon} size={20} color={colors.primary} />
      <Text style={styles.modeLabel}>{label}</Text>
    </Pressable>
  );
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({

  safe: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.safeMargin,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.backgroundElevated,
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
  content: { paddingHorizontal: spacing.safeMargin, paddingTop: spacing.lg, paddingBottom: 120, alignItems: "center" },
  progressHeader: { width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 40 },
  progressTrack: { flex: 1, height: 8, borderRadius: 4, backgroundColor: colors.cardHighest, overflow: "hidden", marginRight: spacing.md },
  progressFill: { height: "100%", borderRadius: 4, backgroundColor: colors.primary },
  counter: { color: colors.textSecondary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  flipCard: { width: "100%", aspectRatio: 0.8 },
  completedCard: {
    width: "100%",
    minHeight: 360,
    borderRadius: 24,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    ...shadow.card,
  },
  completedIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  completedTitle: { color: colors.textPrimary, fontFamily: fontFamily.display, fontSize: fontSize.xl, textAlign: "center" },
  completedBody: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 15, lineHeight: 24, textAlign: "center", marginTop: spacing.sm },
  restartButton: {
    height: 56,
    borderRadius: radius.xl,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  restartText: { color: colors.onPrimary, fontFamily: fontFamily.headline, fontSize: 15 },
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
  wordMetaText: { color: colors.textPrimary, fontFamily: fontFamily.mono, fontSize: 11, letterSpacing: 1.6 },
  practiceWord: { color: colors.primary, fontFamily: fontFamily.display, fontSize: 42, lineHeight: 50, marginBottom: spacing.md, textAlign: "center" },
  practicePhonetic: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 14 },
  tapHint: { position: "absolute", bottom: spacing.xl, alignItems: "center", gap: 4, opacity: 0.6 },
  tapText: { color: colors.textSecondary, fontFamily: fontFamily.mono, fontSize: 11 },
  backTitle: { color: colors.textPrimary, fontFamily: fontFamily.headline, fontSize: fontSize.lg, marginBottom: spacing.md },
  backDefinition: { color: colors.textPrimary, fontFamily: fontFamily.body, fontSize: 16, lineHeight: 26, textAlign: "center", marginBottom: spacing.lg },
  divider: { width: "100%", height: 1, backgroundColor: colors.primaryWash, marginBottom: spacing.lg },
  exampleBlock: { width: "100%" },
  exampleLabel: { color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 12, marginBottom: spacing.sm },
  exampleText: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 14, lineHeight: 22, fontStyle: "italic" },
  swipeHintRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, marginTop: spacing.lg },
  swipeHint: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 14, opacity: 0.72 },
  practiceModes: { width: "100%", flexDirection: "row", gap: spacing.sm, marginTop: spacing.md },
  modeTile: {
    flex: 1,
    minHeight: 74,
    borderRadius: 18,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    ...shadow.card,
  },
  modeLabel: { color: colors.textPrimary, fontFamily: fontFamily.bodyBold, fontSize: 11 },
  });
}
