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
      <Image
        source={require("../../assets/lex-mascot.jpeg")}
        style={[styles.image, mood === "celebrate" && styles.celebrate]}
        resizeMode="contain"
      />
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useColors>, size: number) {
  return StyleSheet.create({
    wrap: { width: size, height: size, alignItems: "center", justifyContent: "center" },
    image: { width: size, height: size },
    celebrate: { transform: [{ rotate: "-2deg" }, { scale: 1.04 }] },
    sparkOne: { position: "absolute", top: 8, right: 12, width: 10, height: 10, borderRadius: 5, backgroundColor: colors.accentOrange },
    sparkTwo: { position: "absolute", left: 8, bottom: 26, width: 7, height: 7, borderRadius: 4, backgroundColor: colors.primaryWash },
  });
}
