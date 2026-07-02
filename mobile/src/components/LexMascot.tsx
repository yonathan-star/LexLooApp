import React, { useMemo } from "react";
import { Image, ImageSourcePropType, StyleSheet, View } from "react-native";
import { useColors } from "../context/ThemeContext";

export type LexMood = "happy" | "celebrate" | "coach" | "thinking" | "correct" | "encourage" | "welcome";

const MASCOT_SOURCES: Record<LexMood, ImageSourcePropType> = {
  happy: require("../../assets/lex-poses/welcome.png"),
  celebrate: require("../../assets/lex-poses/correct.png"),
  coach: require("../../assets/lex-poses/coach.png"),
  thinking: require("../../assets/lex-poses/thinking.png"),
  correct: require("../../assets/lex-poses/correct.png"),
  encourage: require("../../assets/lex-poses/encourage.png"),
  welcome: require("../../assets/lex-poses/welcome.png"),
};

export function LexMascot({ size = 112, mood = "happy" }: { size?: number; mood?: LexMood }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors, size), [colors, size]);
  return (
    <View style={styles.wrap}>
      <View style={styles.sparkOne} />
      <View style={styles.sparkTwo} />
      <View style={[styles.stage, (mood === "celebrate" || mood === "correct") && styles.celebrate]}>
        <Image source={MASCOT_SOURCES[mood]} style={styles.image} resizeMode="contain" />
      </View>
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useColors>, size: number) {
  const stageSize = Math.round(size * 0.86);
  return StyleSheet.create({
    wrap: { width: size, height: size, alignItems: "center", justifyContent: "center", overflow: "visible" },
    stage: {
      width: stageSize,
      height: stageSize,
      borderRadius: Math.round(stageSize * 0.28),
      overflow: "hidden",
      backgroundColor: "#061229",
      borderWidth: 1,
      borderColor: colors.borderStrong,
    },
    image: { width: "108%", height: "108%" },
    celebrate: { transform: [{ rotate: "-2deg" }, { scale: 1.04 }] },
    sparkOne: { position: "absolute", top: 6, right: 10, width: 10, height: 10, borderRadius: 5, backgroundColor: colors.accentOrange },
    sparkTwo: { position: "absolute", left: 10, bottom: 14, width: 7, height: 7, borderRadius: 4, backgroundColor: colors.primaryWash },
  });
}
