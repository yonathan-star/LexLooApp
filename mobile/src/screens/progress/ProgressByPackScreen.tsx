import { LexLooMark } from "../../components/LexLooMark";
import React, { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import { useProgressByPack } from "../../api/queries";
import { EmptyState, ErrorState, LoadingState } from "../../components/StateViews";
import { fontFamily, fontSize, radius, shadow, spacing } from "../../theme";
import { useColors } from "../../context/ThemeContext";

export function ProgressByPackScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<any>();
  const { activeProfile } = useAuth();
  const packs = useProgressByPack(activeProfile?.id);

  if (packs.isLoading) return <LoadingState label="Loading pack progress..." />;
  if (packs.isError) return <ErrorState message="We couldn't load pack progress." onRetry={() => packs.refetch()} />;
  if (!packs.data?.length) {
    return <EmptyState title="No pack progress yet" message="Discover and practice pack words to see module progress here." actionLabel="Browse Packs" onAction={() => navigation.navigate("PackLibrary")} />;
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
          <Text style={styles.eyebrow}>Progress</Text>
          <Text style={styles.title}>Progress by Pack</Text>
          <Text style={styles.subtitle}>Track completion across each vocabulary pack and continue where mastery is still growing.</Text>
        </View>

        <View style={styles.list}>
          {packs.data.map((pack, index) => (
            <Pressable key={pack.id} style={styles.packCard} onPress={() => navigation.navigate("PackDetail", { packId: pack.id })}>
              <View style={[styles.icon, { backgroundColor: index % 2 === 0 ? colors.primaryWash : colors.orangeWash }]}>
                <Text style={[styles.iconText, { color: index % 2 === 0 ? colors.primary : colors.accentOrange }]}>{pack.percent}%</Text>
              </View>
              <View style={styles.packMain}>
                <View style={styles.packHeader}>
                  <Text style={styles.packName}>{pack.name}</Text>
                  <Text style={styles.packCount}>{pack.completed}/{pack.total}</Text>
                </View>
                <View style={styles.track}>
                  <View style={[styles.fill, { width: `${pack.percent}%` as any, backgroundColor: index % 2 === 0 ? colors.primary : colors.accentOrange }]} />
                </View>
              </View>
            </Pressable>
          ))}
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
  logo: { color: colors.primary, fontFamily: fontFamily.display, fontSize: fontSize.display, lineHeight: 38 },
  pill: { backgroundColor: colors.orangeWash, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 8 },
  pillText: { color: colors.accentOrangePressed, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  hero: { borderRadius: 32, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, ...shadow.card },
  eyebrow: { color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 12, letterSpacing: 1.6, textTransform: "uppercase", marginBottom: spacing.sm },
  title: { color: colors.textPrimary, fontFamily: fontFamily.display, fontSize: fontSize.display, lineHeight: 38 },
  subtitle: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 15, lineHeight: 24, marginTop: spacing.sm },
  list: { gap: spacing.md },
  packCard: { minHeight: 94, borderRadius: 22, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, padding: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.md, ...shadow.card },
  icon: { width: 54, height: 54, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  iconText: { fontFamily: fontFamily.display, fontSize: 16 },
  packMain: { flex: 1 },
  packHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.sm },
  packName: { color: colors.textPrimary, fontFamily: fontFamily.headline, fontSize: fontSize.md, flex: 1 },
  packCount: { color: colors.textSecondary, fontFamily: fontFamily.mono, fontSize: 11 },
  track: { height: 9, borderRadius: 5, backgroundColor: colors.cardHighest, overflow: "hidden" },
  fill: { height: "100%", borderRadius: 5 },
  });
}
