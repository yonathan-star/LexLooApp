import React, { useState } from "react";
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fontFamily, fontSize, glow, radius, shadow, spacing } from "../../theme";

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD0H9YgeCtSWgwCZZ4FzTC3EDCH406bzYnZe_Xxue8AoKGNG8EQJ9fTcGcjDqD-eVYRBlMlQUEpnfjSTvjwxpXeLqknBiJotVcWbdsTvCNeGR9wZ4fm29Xffcm_z18lxSNhaD5PvpqecVCBMfwTLhDtRX7UNACY6p8fv2UdclLGajOnndcKkxf4P1EC1hMacXGOntgiFlOEafYIYRpCFYWRSHcd7GfYCE8SLgf9shVnhUbeVLFLjXaOvqflGzoVeAJPw-u9rhUioArp";

const TABS = ["Definition", "Translation", "Examples", "Synonyms"];

export function WordDetailScreen() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState("Definition");

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>
        <Text style={styles.logo}>LexLoo</Text>
        <View style={styles.xpPill}>
          <Text style={styles.xpText}>12 | 250 XP</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <ImageBackground source={{ uri: HERO_IMAGE }} style={StyleSheet.absoluteFill} resizeMode="cover" blurRadius={12}>
            <View style={styles.heroGradient} />
          </ImageBackground>
          <View style={styles.heroWord}>
            <Text style={styles.pos}>ADJECTIVE</Text>
            <Text style={styles.word}>ETHEREAL</Text>
            <View style={styles.pronounceRow}>
              <Text style={styles.phonetic}>/ɪˈθɪə.ri.əl/</Text>
              <Pressable style={styles.audioButton}>
                <Text style={styles.audioIcon}>♪</Text>
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

          <View style={styles.definitionCard}>
            <View style={styles.definitionRow}>
              <View style={styles.orangeBar} />
              <Text style={styles.definition}>Extremely delicate and light in a way that seems too perfect for this world.</Text>
            </View>
            <View style={styles.noteDivider} />
            <View style={styles.noteHeader}>
              <Text style={styles.noteIcon}>◌</Text>
              <Text style={styles.noteLabel}>USAGE NOTE</Text>
            </View>
            <Text style={styles.noteText}>
              Often used to describe delicate beauty, music, or spiritual qualities that transcend the physical realm.
            </Text>
          </View>

          <View style={styles.exampleGrid}>
            <ExampleCard icon="✦" text={'"The sunrise cast an ethereal glow across the mist-covered valley."'} />
            <ExampleCard icon="♪" text={'"Her voice had an ethereal quality that brought the audience to tears."'} />
          </View>

          <View style={styles.relatedSection}>
            <Text style={styles.relatedLabel}>Related Nuances</Text>
            <View style={styles.chipRow}>
              {["Celestial", "Gossamer", "Incorporeal", "Vaporous"].map((chip) => (
                <View key={chip} style={styles.chip}>
                  <Text style={styles.chipText}>{chip}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.practiceButton} onPress={() => navigation.navigate("PracticeSession", { activityType: "flashcard" })}>
          <Text style={styles.practiceIcon}>◎</Text>
          <Text style={styles.practiceText}>Practice Word</Text>
        </Pressable>
        <Pressable style={styles.saveButton}>
          <Text style={styles.saveIcon}>◇</Text>
          <Text style={styles.saveText}>Save and Mark Learned</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function ExampleCard({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.exampleCard}>
      <Text style={styles.exampleIcon}>{icon}</Text>
      <Text style={styles.exampleText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.safeMargin,
    backgroundColor: "rgba(252,249,248,0.72)",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: { width: 40, height: 40, alignItems: "flex-start", justifyContent: "center" },
  backIcon: { color: colors.textSecondary, fontSize: 38, lineHeight: 40 },
  logo: { color: colors.primary, fontFamily: fontFamily.headline, fontSize: fontSize.xl },
  xpPill: { backgroundColor: colors.primaryWash, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 6 },
  xpText: { color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  content: { paddingBottom: 148 },
  hero: { height: 330, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  heroGradient: { flex: 1, backgroundColor: "rgba(252,249,248,0.48)" },
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
  audioIcon: { color: colors.textPrimary, fontSize: 18 },
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
  noteIcon: { color: colors.textMuted, fontSize: 20 },
  noteLabel: { color: colors.textMuted, fontFamily: fontFamily.bodyBold, fontSize: 12, letterSpacing: 1.4 },
  noteText: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 14, lineHeight: 22, fontStyle: "italic" },
  exampleGrid: { gap: spacing.md },
  exampleCard: {
    backgroundColor: "rgba(255,255,255,0.34)",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: spacing.md,
  },
  exampleIcon: { color: colors.primary, fontSize: 22, marginBottom: spacing.sm },
  exampleText: { color: colors.textPrimary, fontFamily: fontFamily.body, fontSize: 14, lineHeight: 22 },
  relatedSection: { gap: spacing.sm },
  relatedLabel: { color: colors.textSecondary, fontFamily: fontFamily.bodyBold, fontSize: 14 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chip: { backgroundColor: colors.cardHighest, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 8 },
  chipText: { color: colors.textSecondary, fontFamily: fontFamily.bodyBold, fontSize: 13 },
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
    backgroundColor: "rgba(252,249,248,0.94)",
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
  practiceIcon: { color: colors.white, fontSize: 18 },
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
  saveIcon: { color: colors.primary, fontSize: 18 },
  saveText: { color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 12, textAlign: "center" },
});
