import React, { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LexLooMark } from "../../components/LexLooMark";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { usePacks } from "../../api/queries";
import { EmptyState, ErrorState, LoadingState } from "../../components/StateViews";
import { fontFamily, fontSize, glow, packColors, radius, shadow, spacing } from "../../theme";
import type { WordPack } from "../../types";
import { useColors } from "../../context/ThemeContext";

function getPackStyle(pack: WordPack) {
  const bySlug = packColors[pack.slug ?? ""];
  if (bySlug) return bySlug;
  return packColors[pack.category ?? ""] ?? packColors.default;
}

export function PackLibraryScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<any>();
  const packs = usePacks();

  if (packs.isLoading) return <LoadingState label="Loading packs..." />;
  if (packs.isError) return <ErrorState message="We couldn't load LexLoo packs." onRetry={() => packs.refetch()} />;
  if (!packs.data?.length) {
    return <EmptyState title="No packs yet" message="Published word packs will appear here." actionLabel="Back" onAction={() => navigation.goBack()} />;
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
            <Text style={styles.pillText}>{packs.data.length} Packs</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Library</Text>
          <Text style={styles.title}>Word Packs</Text>
          <Text style={styles.subtitle}>Choose a learning path, discover words, and practice pack vocabulary toward mastery.</Text>
        </View>

        <View style={styles.list}>
          {packs.data.map((pack) => (
            <PackCard key={pack.id} pack={pack} onPress={() => navigation.navigate("PackDetail", { packId: pack.id })} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function PackCard({ pack, onPress }: { pack: WordPack & { _count?: { packWords?: number } }; onPress: () => void }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const count = pack._count?.packWords ?? pack.packWords?.length ?? 0;
  const ps = getPackStyle(pack);

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={[styles.iconWrap, { backgroundColor: ps.wash }]}>
        <Ionicons name={ps.glyph as any} size={24} color={ps.accent} />
      </View>
      <View style={styles.cardMain}>
        <Text style={styles.cardTitle}>{pack.name}</Text>
        <Text style={[styles.cardMeta, { color: ps.accent }]}>
          {[pack.level, pack.category, `${count} words`].filter(Boolean).join(" · ")}
        </Text>
        <Text style={styles.cardBody} numberOfLines={2}>
          {pack.description ?? "A LexLoo vocabulary pack for daily discovery, practice, and mastery."}
        </Text>
      </View>
      <View style={[styles.arrow, { backgroundColor: ps.wash }]}>
        <Ionicons name="chevron-forward" size={18} color={ps.accent} />
      </View>
    </Pressable>
  );
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({

  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.safeMargin, paddingTop: spacing.md, paddingBottom: 132, gap: spacing.lg },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  pill: { backgroundColor: colors.orangeWash, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 8, borderWidth: 1, borderColor: colors.orangeWash },
  pillText: { color: colors.accentOrangePressed, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  hero: { borderRadius: 28, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, ...shadow.card },
  eyebrow: { color: colors.accentOrange, fontFamily: fontFamily.bodyBold, fontSize: 12, letterSpacing: 1.6, textTransform: "uppercase", marginBottom: spacing.sm },
  title: { color: colors.textPrimary, fontFamily: fontFamily.display, fontSize: fontSize.display, lineHeight: 38 },
  subtitle: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 15, lineHeight: 24, marginTop: spacing.sm },
  list: { gap: spacing.sm },
  card: { borderRadius: 22, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, padding: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.md, ...shadow.card },
  iconWrap: { width: 52, height: 52, borderRadius: 14, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  cardMain: { flex: 1 },
  cardTitle: { color: colors.textPrimary, fontFamily: fontFamily.headline, fontSize: fontSize.md },
  cardMeta: { fontFamily: fontFamily.mono, fontSize: 11, marginTop: 4 },
  cardBody: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 13, lineHeight: 20, marginTop: 8 },
  arrow: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  });
}
