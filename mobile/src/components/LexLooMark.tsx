import React from "react";
import { Text, TextStyle } from "react-native";
import { fontFamily } from "../theme";
import { useColors } from "../context/ThemeContext";

export function LexLooMark({ size = 32, style }: { size?: number; style?: TextStyle }) {
  const colors = useColors();
  const wordStyle: TextStyle = { fontFamily: fontFamily.display, fontSize: size, lineHeight: size * 1.18 };
  return (
    <Text style={style}>
      <Text style={{ ...wordStyle, color: colors.primary }}>Lex</Text>
      <Text style={{ ...wordStyle, color: colors.accentOrange }}>Loo</Text>
    </Text>
  );
}
