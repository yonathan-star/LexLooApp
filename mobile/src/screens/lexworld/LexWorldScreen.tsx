import React, { useMemo } from "react";
import { DimensionValue, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LexLooMark } from "../../components/LexLooMark";
import { ProfileAvatar } from "../../components/ProfileAvatar";
import { ErrorState, LoadingState } from "../../components/StateViews";
import { useAuth } from "../../context/AuthContext";
import { useProgress, useProgressByPack, useSavedWords } from "../../api/queries";
import { fontFamily, fontSize, glow, radius, shadow, spacing } from "../../theme";
import { useColors } from "../../context/ThemeContext";

export function LexWorldScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<any>();
  const { activeProfile } = useAuth();
  const profileId = activeProfile?.id;
  const progress = useProgress(profileId);
  const progressByPack = useProgressByPack(profileId);
  const savedWords = useSavedWords(profileId);

  if (progress.isLoading || progressByPack.isLoading || savedWords.isLoading) return <LoadingState label="Loading LexWorld..." />;
  if (progress.isError) return <ErrorState message="We couldn't load LexWorld." onRetry={() => progress.refetch()} />;

  const summary = progress.data;
  const xp = summary?.xp ?? 0;
  const nextXp = summary?.level.nextXp ?? Math.max(100, xp + 500);
  const rankPercent = nextXp > 0 ? Math.min(100, Math.round((xp / nextXp) * 100)) : 100;
  const savedPreview = savedWords.data?.slice(0, 3) ?? [];
  const packs = progressByPack.data?.slice(0, 3) ?? [];

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <View style={styles.brandRow}>
            <ProfileAvatar />
            <LexLooMark size={22} />
          </View>
          <View style={styles.streakPill}>
            <Ionicons name="planet" size={14} color={colors.primary} />
            <Text style={styles.streakText}>{(summary?.savedCount ?? 0).toLocaleString()} Saved</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>LexWorld</Text>
          <Text style={styles.title}>Your vocabulary world.</Text>
          <Text style={styles.subtitle}>Review saved words, browse packs, practice games, and track every word segment you build.</Text>
          <View style={styles.statsRow}>
            <MiniStat label="Words" value={(summary?.learnedCount ?? 0).toLocaleString()} />
            <MiniStat label="Mastered" value={(summary?.masteredCount ?? 0).toLocaleString()} />
            <MiniStat label="XP" value={xp.toLocaleString()} />
          </View>
        </View>

        <View style={styles.primaryGrid}>
          <WorldAction icon="bookmark" title="Saved Words" body="Search and review your collection." onPress={() => navigation.navigate("SavedWords")} />
          <WorldAction icon="albums" title="Learn Packs" body="Choose Daily, School, Fun, or Challenge words." onPress={() => navigation.navigate("PackLibrary")} />
          <WorldAction icon="game-controller" title="Games" body="Quiz, match, spell, and build sentences." onPress={() => navigation.navigate("PracticeSetup")} />
          <WorldAction icon="sparkles" title="Ask Lex" body="Open your vocabulary coach." onPress={() => navigation.navigate("LexTab")} />
        </View>

        <View style={styles.rankCard}>
          <View style={styles.rankHeader}>
            <Text style={styles.rankTitle}>{summary?.level.current ?? "Explorer"}</Text>
            <Text style={styles.rankMeta}>{summary?.level.next ? `${Math.max(0, nextXp - xp).toLocaleString()} XP to ${summary.level.next}` : "Top rank"}</Text>
          </View>
          <View style={styles.rankTrack}>
            <View style={[styles.rankFill, { width: `${rankPercent}%` as DimensionValue }]} />
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Saved Words</Text>
          <Pressable onPress={() => navigation.navigate("SavedWords")}>
            <Text style={styles.link}>See All</Text>
          </Pressable>
        </View>
        <View style={styles.listCard}>
          {savedPreview.length ? (
            savedPreview.map((word, index) => (
              <WordRow
                key={word.id}
                word={word.text}
                definition={word.content?.shortDefinition ?? "Open this word to keep practicing."}
                accent={index % 2 === 0 ? colors.primary : colors.accentOrange}
                onPress={() => navigation.navigate("WordDetail", { wordId: word.id })}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>Save words from word detail and they will appear here.</Text>
          )}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pack Progress</Text>
          <Pressable onPress={() => navigation.navigate("ProgressByPack")}>
            <Text style={styles.link}>Details</Text>
          </Pressable>
        </View>
        <View style={styles.listCard}>
          {packs.length ? (
            packs.map((pack) => (
              <PackProgress key={pack.id} name={pack.name} percent={pack.percent} onPress={() => navigation.navigate("ProgressByPack")} />
            ))
          ) : (
            <Text style={styles.emptyText}>Start a pack to see collection progress.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.miniStat}>
      <Text style={styles.miniValue}>{value}</Text>
      <Text style={styles.miniLabel}>{label}</Text>
    </View>
  );
}

function WorldAction({ icon, title, body, onPress }: { icon: keyof typeof Ionicons.glyphMap; title: string; body: string; onPress: () => void }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <Pressable style={styles.actionCard} onPress={onPress}>
      <View style={styles.actionIcon}>
        <Ionicons name={icon} size={22} color={colors.primary} />
      </View>
      <Text style={styles.actionTitle}>{title}</Text>
      <Text style={styles.actionBody}>{body}</Text>
    </Pressable>
  );
}

function WordRow({ word, definition, accent, onPress }: { word: string; definition: string; accent: string; onPress: () => void }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <Pressable style={styles.wordRow} onPress={onPress}>
      <View style={[styles.wordInitial, { backgroundColor: accent }]}>
        <Text style={styles.wordInitialText}>{word[0]?.toUpperCase() ?? "W"}</Text>
      </View>
      <View style={styles.wordMain}>
        <Text style={styles.wordTitle}>{word}</Text>
        <Text style={styles.wordDefinition} numberOfLines={2}>{definition}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </Pressable>
  );
}

function PackProgress({ name, percent, onPress }: { name: string; percent: number; onPress: () => void }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <Pressable style={styles.packRow} onPress={onPress}>
      <View style={styles.packHeader}>
        <Text style={styles.packName}>{name}</Text>
        <Text style={styles.packPercent}>{percent}%</Text>
      </View>
      <View style={styles.packTrack}>
        <View style={[styles.packFill, { width: `${percent}%` as DimensionValue }]} />
      </View>
    </Pressable>
  );
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    content: { paddingHorizontal: spacing.safeMargin, paddingTop: spacing.md, paddingBottom: 132, gap: spacing.lg },
    topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    brandRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
    streakPill: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: colors.primaryWash, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 8 },
    streakText: { color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
    hero: { borderRadius: 32, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, ...shadow.card },
    eyebrow: { color: colors.accentOrange, fontFamily: fontFamily.bodyBold, fontSize: 12, letterSpacing: 1.4, textTransform: "uppercase" },
    title: { color: colors.textPrimary, fontFamily: fontFamily.display, fontSize: fontSize.display, lineHeight: 38, marginTop: spacing.sm },
    subtitle: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 15, lineHeight: 24, marginTop: spacing.sm },
    statsRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.lg },
    miniStat: { flex: 1, borderRadius: 18, backgroundColor: colors.cardHighest, padding: spacing.sm, alignItems: "center" },
    miniValue: { color: colors.textPrimary, fontFamily: fontFamily.headline, fontSize: 17 },
    miniLabel: { color: colors.textMuted, fontFamily: fontFamily.bodyBold, fontSize: 11, marginTop: 3 },
    primaryGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: spacing.md },
    actionCard: { width: "48%", minHeight: 152, borderRadius: radius.xl, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, padding: spacing.md, ...shadow.card },
    actionIcon: { width: 42, height: 42, borderRadius: 15, backgroundColor: colors.primaryWash, alignItems: "center", justifyContent: "center", marginBottom: spacing.sm },
    actionTitle: { color: colors.textPrimary, fontFamily: fontFamily.headline, fontSize: 17 },
    actionBody: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 13, lineHeight: 19, marginTop: 6 },
    rankCard: { borderRadius: radius.xl, backgroundColor: colors.primary, padding: spacing.lg, ...glow.primary },
    rankHeader: { flexDirection: "row", justifyContent: "space-between", gap: spacing.md, alignItems: "center" },
    rankTitle: { color: colors.onPrimary, fontFamily: fontFamily.headline, fontSize: fontSize.lg },
    rankMeta: { color: colors.onPrimary, fontFamily: fontFamily.bodyBold, fontSize: 12, opacity: 0.82 },
    rankTrack: { height: 12, borderRadius: 6, backgroundColor: "rgba(255,255,255,0.22)", overflow: "hidden", marginTop: spacing.md },
    rankFill: { height: "100%", borderRadius: 6, backgroundColor: colors.white },
    sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    sectionTitle: { color: colors.textPrimary, fontFamily: fontFamily.headline, fontSize: fontSize.lg },
    link: { color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
    listCard: { borderRadius: radius.xl, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, overflow: "hidden", ...shadow.card },
    emptyText: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 14, lineHeight: 21, padding: spacing.lg },
    wordRow: { minHeight: 82, flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
    wordInitial: { width: 44, height: 44, borderRadius: 15, alignItems: "center", justifyContent: "center" },
    wordInitialText: { color: colors.white, fontFamily: fontFamily.headline, fontSize: 18 },
    wordMain: { flex: 1 },
    wordTitle: { color: colors.textPrimary, fontFamily: fontFamily.headline, fontSize: 16 },
    wordDefinition: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 13, lineHeight: 19, marginTop: 3 },
    packRow: { padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
    packHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.sm },
    packName: { color: colors.textPrimary, fontFamily: fontFamily.bodyBold, fontSize: 14 },
    packPercent: { color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
    packTrack: { height: 9, borderRadius: 5, backgroundColor: colors.backgroundDeep, overflow: "hidden" },
    packFill: { height: "100%", borderRadius: 5, backgroundColor: colors.primary },
  });
}
