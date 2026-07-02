import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LexLooMark } from "../../components/LexLooMark";
import { LexMascot, LexMood } from "../../components/LexMascot";
import { ErrorState, LoadingState } from "../../components/StateViews";
import { useAuth } from "../../context/AuthContext";
import { useRecommendations, useWord } from "../../api/queries";
import { haptics } from "../../lib/haptics";
import { fontFamily, fontSize, radius, shadow, spacing } from "../../theme";
import { useColors } from "../../context/ThemeContext";

type LexReply = { mood: LexMood; title: string; body: string };

const SUGGESTIONS = ["Give me a hint", "Use it in a sentence", "What should I practice?", "Explain it simply"];

export function AskLexScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { activeProfile } = useAuth();
  const recommendations = useRecommendations(activeProfile?.id);
  const recommendedWord = recommendations.data?.wordOfDay?.word ?? recommendations.data?.wearOfDay?.word;
  const wordId = (route.params?.wordId as string | undefined) ?? recommendedWord?.id;
  const word = useWord(wordId, activeProfile?.id);
  const [input, setInput] = useState("");
  const [reply, setReply] = useState<LexReply>({
    mood: "welcome",
    title: "Ask me about a word.",
    body: "I can give hints, examples, simple explanations, or tell you what to practice next.",
  });

  if (recommendations.isLoading || word.isLoading) return <LoadingState label="Lex is thinking..." />;
  if (recommendations.isError || word.isError) return <ErrorState message="Lex couldn't load your coach context." onRetry={() => recommendations.refetch()} />;

  const activeWord = word.data ?? recommendedWord;
  const definition = activeWord?.content?.shortDefinition ?? "this word";
  const example = activeWord?.examples?.[0]?.exampleText;

  function askLex(prompt: string) {
    const question = prompt.trim();
    if (!question) return;
    haptics.tap();
    const lower = question.toLowerCase();
    if (lower.includes("sentence") || lower.includes("example")) {
      setReply({
        mood: "coach",
        title: activeWord ? `Try "${activeWord.text}" in context.` : "Try it in context.",
        body: example ?? `Make a sentence where the word means: ${definition}`,
      });
    } else if (lower.includes("hint")) {
      setReply({
        mood: "thinking",
        title: "Here is a small hint.",
        body: activeWord ? `Think of "${activeWord.text}" as: ${definition}` : "Look for the clue in the definition, then say the word out loud once.",
      });
    } else if (lower.includes("practice") || lower.includes("next")) {
      setReply({
        mood: "correct",
        title: "Your next move",
        body: activeWord ? `Practice "${activeWord.text}" once, then save it if it still feels useful.` : "Do one quick quiz, then review any word you miss.",
      });
    } else {
      setReply({
        mood: "encourage",
        title: activeWord ? `${activeWord.text}: simple version` : "Simple version",
        body: activeWord ? `${activeWord.text} means ${definition}` : "Send me a word or choose one of the prompts below.",
      });
    }
    setInput("");
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
            <Text style={styles.pillText}>Ask Lex</Text>
          </View>
        </View>

        <View style={styles.coachCard}>
          <LexMascot size={122} mood={reply.mood} />
          <View style={styles.bubble}>
            <Text style={styles.replyTitle}>{reply.title}</Text>
            <Text style={styles.replyBody}>{reply.body}</Text>
          </View>
        </View>

        {activeWord ? (
          <Pressable style={styles.wordCard} onPress={() => navigation.navigate("WordDetail", { wordId: activeWord.id })}>
            <Text style={styles.eyebrow}>Current word</Text>
            <Text style={styles.word}>{activeWord.text}</Text>
            <Text style={styles.definition}>{definition}</Text>
          </Pressable>
        ) : null}

        <View style={styles.suggestions}>
          {SUGGESTIONS.map((suggestion) => (
            <Pressable key={suggestion} style={styles.suggestion} onPress={() => askLex(suggestion)}>
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.inputRow}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask Lex..."
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            returnKeyType="send"
            onSubmitEditing={() => askLex(input)}
          />
          <Pressable style={[styles.sendButton, !input.trim() && styles.sendDisabled]} disabled={!input.trim()} onPress={() => askLex(input)}>
            <Ionicons name="send" size={18} color={colors.onPrimary} />
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
    pill: { backgroundColor: colors.orangeWash, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 8 },
    pillText: { color: colors.accentOrangePressed, fontFamily: fontFamily.bodyBold, fontSize: 12 },
    coachCard: { borderRadius: 28, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, padding: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.md, ...shadow.card },
    bubble: { flex: 1, gap: 6 },
    replyTitle: { color: colors.textPrimary, fontFamily: fontFamily.headline, fontSize: fontSize.lg, lineHeight: 26 },
    replyBody: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 15, lineHeight: 23 },
    wordCard: { borderRadius: 24, backgroundColor: colors.primary, padding: spacing.lg },
    eyebrow: { color: colors.onPrimary, opacity: 0.75, fontFamily: fontFamily.bodyBold, fontSize: 12, textTransform: "uppercase" },
    word: { color: colors.onPrimary, fontFamily: fontFamily.display, fontSize: 36, lineHeight: 42, marginTop: 4 },
    definition: { color: colors.onPrimary, fontFamily: fontFamily.body, fontSize: 15, lineHeight: 23, marginTop: spacing.sm },
    suggestions: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
    suggestion: { borderRadius: radius.pill, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.borderStrong, paddingHorizontal: spacing.md, paddingVertical: 10 },
    suggestionText: { color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 13 },
    inputRow: { flexDirection: "row", gap: spacing.sm, alignItems: "center" },
    input: { flex: 1, minHeight: 58, borderRadius: 22, backgroundColor: colors.inputBackground, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md, color: colors.textPrimary, fontFamily: fontFamily.bodyBold, fontSize: 15 },
    sendButton: { width: 58, height: 58, borderRadius: 22, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
    sendDisabled: { opacity: 0.45 },
  });
}
