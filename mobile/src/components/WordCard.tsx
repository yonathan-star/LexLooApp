import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { fontFamily, fontSize, spacing } from "../theme";
import { Card } from "./Card";
import { useColors } from "../context/ThemeContext";

// Design System 6: Word Card — large word, part of speech, short definition,
// pronunciation icon, progress status.
export function WordCard({
  word,
  partOfSpeech,
  shortDefinition,
  status,
  onPress,
}: {
  word: string;
  partOfSpeech?: string | null;
  shortDefinition?: string | null;
  status?: "new" | "learning" | "learned" | "mastered";
  onPress?: () => void;
}) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <Card onPress={onPress} variant="elevated">
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.word}>{word}</Text>
          {partOfSpeech ? <Text style={styles.pos}>{partOfSpeech}</Text> : null}
        </View>
        <Text style={styles.icon}>🔊</Text>
      </View>
      {shortDefinition ? <Text style={styles.definition}>{shortDefinition}</Text> : null}
      {status ? <StatusPill status={status} /> : null}
    </Card>
  );
}

function StatusPill({ status }: { status: "new" | "learning" | "learned" | "mastered" }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const labelMap: Record<string, string> = { new: "New", learning: "Learning", learned: "Learned", mastered: "Mastered" };
  const colorMap: Record<string, string> = {
    new: colors.textMuted,
    learning: colors.warning,
    learned: colors.primary,
    mastered: colors.success,
  };
  return (
    <View style={[styles.pill, { borderColor: colorMap[status] }]}>
      <Text style={[styles.pillText, { color: colorMap[status] }]}>{labelMap[status]}</Text>
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({

  row: { flexDirection: "row", alignItems: "flex-start" },
  word: { color: colors.textPrimary, fontSize: fontSize.xl, fontFamily: fontFamily.display },
  pos: { color: colors.textSecondary, fontSize: fontSize.xs, marginTop: 2, fontFamily: fontFamily.body, fontStyle: "italic" },
  icon: { fontSize: 22 },
  definition: { color: colors.textSecondary, fontSize: fontSize.sm, fontFamily: fontFamily.body, marginTop: spacing.sm },
  pill: { alignSelf: "flex-start", marginTop: spacing.sm, borderWidth: 1, borderRadius: 999, paddingHorizontal: spacing.sm, paddingVertical: 2 },
  pillText: { fontSize: 11, fontFamily: fontFamily.mono, letterSpacing: 1, textTransform: "uppercase" },
  });
}
