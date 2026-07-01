import { LexLooMark } from "../../components/LexLooMark";
import React, { useState, useMemo } from "react";
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import * as Speech from "expo-speech";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { useMarkLearned, useToggleSaveWord, useWord, useWordProgress } from "../../api/queries";
import { ErrorState, LoadingState } from "../../components/StateViews";
import { trackScreenEvent } from "../../lib/analytics";
import { haptics } from "../../lib/haptics";
import { fontFamily, fontSize, glow, radius, shadow, spacing } from "../../theme";
import { useColors } from "../../context/ThemeContext";

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD0H9YgeCtSWgwCZZ4FzTC3EDCH406bzYnZe_Xxue8AoKGNG8EQJ9fTcGcjDqD-eVYRBlMlQUEpnfjSTvjwxpXeLqknBiJotVcWbdsTvCNeGR9wZ4fm29Xffcm_z18lxSNhaD5PvpqecVCBMfwTLhDtRX7UNACY6p8fv2UdclLGajOnndcKkxf4P1EC1hMacXGOntgiFlOEafYIYRpCFYWRSHcd7GfYCE8SLgf9shVnhUbeVLFLjXaOvqflGzoVeAJPw-u9rhUioArp";

const TABS = ["Definition", "Translation", "Examples", "Synonyms"];

export function WordDetailScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { activeProfile } = useAuth();
  const wordId = route.params?.wordId as string | undefined;
  const profileId = activeProfile?.id;
  const word = useWord(wordId, profileId);
  const wordProgress = useWordProgress(wordId, profileId);
  const toggleSave = useToggleSaveWord();
  const markLearned = useMarkLearned();
  const [activeTab, setActiveTab] = useState("Definition");
  const [selectedLangCode, setSelectedLangCode] = useState<string | null>(null);

  if (word.isLoading || wordProgress.isLoading) return <LoadingState label="Loading word..." />;
  if (word.isError) return <ErrorState message="We couldn't load this word." onRetry={() => word.refetch()} />;

  const currentWord = word.data;
  const displayWord = currentWord?.text ?? "";
  const partOfSpeech = currentWord?.partOfSpeech ?? "";
  const phonetic = currentWord?.content?.phonetic ?? "";
  const definition = currentWord?.content?.longDefinition ?? currentWord?.content?.shortDefinition ?? "No definition available yet for this word.";
  const note = currentWord?.content?.funFact ?? currentWord?.content?.origin ?? "Practice this word to strengthen your memory and build mastery.";
  const examples = currentWord?.examples?.map((example) => example.exampleText) ?? [];
  const translations = currentWord?.translations ?? [];
  const activeTranslation =
    translations.find((item) => item.targetLanguage?.code === selectedLangCode) ?? translations[0] ?? null;
  const related = currentWord?.relationsA?.slice(0, 8) ?? [];
  const isSaved = Boolean(wordProgress.data?.isSaved);
  const masteryScore = Math.min(100, Math.max(0, wordProgress.data?.progress?.masteryScore ?? 0));

  const handleSaveAndLearn = async () => {
    if (!profileId || !wordId) return;
    if (!isSaved) await toggleSave.mutateAsync({ profileId, wordId, save: true });
    await markLearned.mutateAsync({ profileId, wordId });
    haptics.celebrate();
  };

  const playPronunciation = () => {
    haptics.tap();
    Speech.stop();
    Speech.speak(displayWord, { rate: 0.82, pitch: 1 });
    trackScreenEvent("audio_play", { wordId, word: displayWord }, profileId);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <LexLooMark />
        <View style={styles.xpPill}>
          <Text style={styles.xpText}>{masteryScore}% Mastery</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <ImageBackground source={{ uri: HERO_IMAGE }} style={StyleSheet.absoluteFill} resizeMode="cover" blurRadius={12}>
            <View style={styles.heroGradient} />
          </ImageBackground>
          <View style={styles.heroWord}>
            <Text style={styles.pos}>{partOfSpeech.toUpperCase()}</Text>
            <Text style={styles.word}>{displayWord.toUpperCase()}</Text>
            <View style={styles.pronounceRow}>
              <Text style={styles.phonetic}>{phonetic}</Text>
              <Pressable style={styles.audioButton} onPress={playPronunciation}>
                <Ionicons name="volume-high" size={18} color={colors.textPrimary} />
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.tabs}>
            {TABS.map((tab) => (
              <Pressable key={tab} style={[styles.tab, activeTab === tab && styles.activeTab]} onPress={() => setActiveTab(tab)}>
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
              </Pressable>
            ))}
          </View>

          {activeTab === "Definition" ? (
            <View style={styles.definitionCard}>
              <View style={styles.definitionRow}>
                <View style={styles.orangeBar} />
                <Text style={styles.definition}>{definition}</Text>
              </View>
              <View style={styles.noteDivider} />
              <View style={styles.noteHeader}>
                <Ionicons name="bulb-outline" size={16} color={colors.textMuted} />
                <Text style={styles.noteLabel}>USAGE NOTE</Text>
              </View>
              <Text style={styles.noteText}>{note}</Text>
            </View>
          ) : null}

          {activeTab === "Translation" ? (
            translations.length ? (
              <View style={{ gap: spacing.md }}>
                {translations.length > 1 ? (
                  <View style={styles.langRow}>
                    {translations.map((item) => {
                      const code = item.targetLanguage?.code ?? item.translation;
                      const isActive = activeTranslation?.targetLanguage?.code === code || (!selectedLangCode && item === translations[0]);
                      return (
                        <Pressable
                          key={code}
                          style={[styles.langChip, isActive && styles.langChipActive]}
                          onPress={() => setSelectedLangCode(code)}
                        >
                          <Text style={[styles.langChipText, isActive && styles.langChipTextActive]}>
                            {item.targetLanguage?.name ?? "Translation"}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                ) : null}
                <View style={styles.definitionCard}>
                  <View style={styles.definitionRow}>
                    <View style={styles.orangeBar} />
                    <Text style={styles.definition}>
                      {[activeTranslation?.translation, activeTranslation?.transliteration ? `(${activeTranslation.transliteration})` : null]
                        .filter(Boolean)
                        .join(" ")}
                    </Text>
                  </View>
                  {activeTranslation?.exampleTranslation ? (
                    <>
                      <View style={styles.noteDivider} />
                      <View style={styles.noteHeader}>
                        <Ionicons name="chatbubble-ellipses-outline" size={16} color={colors.textMuted} />
                        <Text style={styles.noteLabel}>EXAMPLE</Text>
                      </View>
                      <Text style={styles.noteText}>{activeTranslation.exampleTranslation}</Text>
                    </>
                  ) : null}
                </View>
              </View>
            ) : (
              <View style={styles.definitionCard}>
                <Text style={styles.noteText}>No translation available yet for this word.</Text>
              </View>
            )
          ) : null}

          {activeTab === "Examples" ? (
            examples.length ? (
              <View style={styles.exampleGrid}>
                {examples.map((example, index) => (
                  <ExampleCard key={`${example}-${index}`} icon={index === 0 ? "sparkles" : "chatbubble-ellipses-outline"} text={example} />
                ))}
              </View>
            ) : (
              <View style={styles.definitionCard}>
                <Text style={styles.noteText}>No example sentences available yet for this word.</Text>
              </View>
            )
          ) : null}

          {activeTab === "Synonyms" ? (
            related.length ? (
              <View style={styles.relatedSection}>
                <Text style={styles.relatedLabel}>Related Nuances</Text>
                <View style={styles.relatedList}>
                  {related.map((relation) => (
                    <Pressable
                      key={`${relation.relatedWord.id}-${relation.relationType}`}
                      style={styles.relatedCard}
                      onPress={() => navigation.push("WordDetail", { wordId: relation.relatedWord.id })}
                    >
                      <View style={[styles.relationBadge, relation.relationType === "antonym" && styles.antonymBadge]}>
                        <Text style={[styles.relationBadgeText, relation.relationType === "antonym" && styles.antonymBadgeText]}>
                          {relation.relationType}
                        </Text>
                      </View>
                      <View style={styles.relatedMain}>
                        <Text style={styles.relatedWord}>{relation.relatedWord.text}</Text>
                        <Text style={styles.relatedDefinition} numberOfLines={2}>
                          {relation.relatedWord.content?.shortDefinition ?? "Open this word to see definition, translation, and examples."}
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                    </Pressable>
                  ))}
                </View>
              </View>
            ) : (
              <View style={styles.definitionCard}>
                <Text style={styles.noteText}>No related words available yet for this word.</Text>
              </View>
            )
          ) : null}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.practiceButton} onPress={() => navigation.navigate("PracticeSession", { activityType: "flashcard", wordId })}>
          <Ionicons name="flash" size={18} color={colors.white} />
          <Text style={styles.practiceText}>Practice Word</Text>
        </Pressable>
        <Pressable style={styles.saveButton} onPress={handleSaveAndLearn} disabled={toggleSave.isPending || markLearned.isPending}>
          <Ionicons name={isSaved ? "checkmark-circle" : "bookmark-outline"} size={18} color={colors.primary} />
          <Text style={styles.saveText}>{wordProgress.data?.progress?.status === "learned" ? "Learned!" : "Save & Mark Learned"}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function ExampleCard({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.exampleCard}>
      <Ionicons name={icon} size={20} color={colors.primary} style={{ marginBottom: spacing.sm }} />
      <Text style={styles.exampleText}>{text}</Text>
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({

  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.safeMargin,
    backgroundColor: colors.backgroundElevated,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  logo: { color: colors.primary, fontFamily: fontFamily.headline, fontSize: fontSize.xl },
  xpPill: { backgroundColor: colors.primaryWash, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 6 },
  xpText: { color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  content: { paddingBottom: 148 },
  hero: { height: 330, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  heroGradient: { flex: 1, backgroundColor: colors.backgroundElevated },
  heroWord: { alignItems: "center", gap: 6 },
  pos: { color: colors.primaryContainer, fontFamily: fontFamily.bodyBold, fontSize: 14, letterSpacing: 2.4 },
  word: { color: colors.textPrimary, fontFamily: fontFamily.display, fontSize: 40, lineHeight: 48, letterSpacing: 1.5 },
  pronounceRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  phonetic: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 16, fontStyle: "italic" },
  audioButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.44)",
    alignItems: "center",
    justifyContent: "center",
    ...shadow.card,
  },
  body: { paddingHorizontal: spacing.safeMargin, marginTop: -48, gap: spacing.lg },
  tabs: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    padding: 4,
    ...shadow.card,
  },
  tab: { flex: 1, minHeight: 40, borderRadius: radius.pill, alignItems: "center", justifyContent: "center" },
  activeTab: { backgroundColor: colors.primaryWash, borderWidth: 1, borderColor: colors.borderStrong },
  tabText: { color: colors.textSecondary, fontFamily: fontFamily.bodyBold, fontSize: 11 },
  activeTabText: { color: colors.primary },
  definitionCard: {
    backgroundColor: colors.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...shadow.card,
  },
  definitionRow: { flexDirection: "row", gap: spacing.md, alignItems: "flex-start" },
  orangeBar: { width: 6, height: 32, borderRadius: 3, backgroundColor: colors.accentOrange, marginTop: 4 },
  definition: { flex: 1, color: colors.textPrimary, fontFamily: fontFamily.body, fontSize: 18, lineHeight: 28 },
  noteDivider: { height: 1, backgroundColor: colors.divider, marginVertical: spacing.md },
  noteHeader: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.sm },
  noteLabel: { color: colors.textMuted, fontFamily: fontFamily.bodyBold, fontSize: 12, letterSpacing: 1.4 },
  noteText: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 14, lineHeight: 22, fontStyle: "italic" },
  langRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  langChip: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  langChipActive: { backgroundColor: colors.primaryWash, borderColor: colors.borderStrong },
  langChipText: { color: colors.textSecondary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  langChipTextActive: { color: colors.primary },
  exampleGrid: { gap: spacing.md },
  exampleCard: {
    backgroundColor: "rgba(255,255,255,0.34)",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: spacing.md,
  },
  exampleText: { color: colors.textPrimary, fontFamily: fontFamily.body, fontSize: 14, lineHeight: 22 },
  relatedSection: { gap: spacing.sm },
  relatedLabel: { color: colors.textSecondary, fontFamily: fontFamily.bodyBold, fontSize: 14 },
  relatedList: { gap: spacing.sm },
  relatedCard: {
    minHeight: 78,
    borderRadius: 18,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    ...shadow.card,
  },
  relationBadge: { borderRadius: radius.pill, backgroundColor: colors.primaryWash, paddingHorizontal: 10, paddingVertical: 6 },
  antonymBadge: { backgroundColor: colors.orangeWash },
  relationBadgeText: { color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 10, textTransform: "uppercase" },
  antonymBadgeText: { color: colors.accentOrangePressed },
  relatedMain: { flex: 1 },
  relatedWord: { color: colors.textPrimary, fontFamily: fontFamily.headline, fontSize: 15 },
  relatedDefinition: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 12, lineHeight: 18, marginTop: 3 },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.safeMargin,
    paddingTop: spacing.lg,
    paddingBottom: spacing.safeMargin,
    backgroundColor: colors.darkNav,
  },
  practiceButton: {
    flex: 1,
    height: 56,
    borderRadius: radius.xl,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    ...glow.primary,
  },
  practiceText: { color: colors.white, fontFamily: fontFamily.bodyBold, fontSize: 13 },
  saveButton: {
    flex: 1,
    height: 56,
    borderRadius: radius.xl,
    backgroundColor: "rgba(255,255,255,0.4)",
    borderWidth: 2,
    borderColor: colors.borderStrong,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  saveText: { color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 12, textAlign: "center" },
  });
}
