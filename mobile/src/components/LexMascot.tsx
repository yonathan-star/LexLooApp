import React, { useMemo } from "react";
import { Image, StyleSheet, View } from "react-native";
import { useColors } from "../context/ThemeContext";

export function LexMascot({ size = 112, mood = "happy" }: { size?: number; mood?: "happy" | "celebrate" }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors, size), [colors, size]);
  return (
    <View style={styles.wrap}>
      <View style={styles.sparkOne} />
      <View style={styles.sparkTwo} />
      <View style={[styles.stage, mood === "celebrate" && styles.celebrate]}>
        <Image source={require("../../assets/lex-mascot-clean.jpeg")} style={styles.image} resizeMode="contain" />
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
    image: { width: "106%", height: "106%", transform: [{ translateX: -3 }, { translateY: -2 }] },
    celebrate: { transform: [{ rotate: "-2deg" }, { scale: 1.04 }] },
    sparkOne: { position: "absolute", top: 6, right: 10, width: 10, height: 10, borderRadius: 5, backgroundColor: colors.accentOrange },
    sparkTwo: { position: "absolute", left: 10, bottom: 14, width: 7, height: 7, borderRadius: 4, backgroundColor: colors.primaryWash },
  });
}
