import React, { useEffect, useMemo, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";
import { useColors } from "../context/ThemeContext";
;

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const PIECE_COUNT = 24;

interface Piece {
  x: number;
  delay: number;
  duration: number;
  rotateStart: number;
  color: string;
  size: number;
}

export function Confetti({ active }: { active: boolean }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const PIECE_COLORS = [colors.primary, colors.accentOrange, colors.success, "#FFD166", colors.primaryContainer];
  const progress = useRef(new Animated.Value(0)).current;
  const pieces = useMemo<Piece[]>(
    () =>
      Array.from({ length: PIECE_COUNT }, () => ({
        x: Math.random() * SCREEN_WIDTH,
        delay: Math.random() * 200,
        duration: 1400 + Math.random() * 900,
        rotateStart: Math.random() * 360,
        color: PIECE_COLORS[Math.floor(Math.random() * PIECE_COLORS.length)],
        size: 6 + Math.random() * 6,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [active]
  );

  useEffect(() => {
    if (!active) return;
    progress.setValue(0);
    Animated.timing(progress, { toValue: 1, duration: 2400, useNativeDriver: true }).start();
  }, [active, progress]);

  if (!active) return null;

  return (
    <View style={styles.root} pointerEvents="none">
      {pieces.map((piece, index) => {
        const fall = progress.interpolate({
          inputRange: [0, piece.delay / 2400, 1],
          outputRange: [-20, -20, 420],
          extrapolate: "clamp",
        });
        const sway = progress.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, index % 2 === 0 ? 18 : -18, 0] });
        const opacity = progress.interpolate({ inputRange: [0, 0.1, 0.8, 1], outputRange: [0, 1, 1, 0] });
        const rotate = progress.interpolate({ inputRange: [0, 1], outputRange: [`${piece.rotateStart}deg`, `${piece.rotateStart + 360}deg`] });
        return (
          <Animated.View
            key={index}
            style={[
              styles.piece,
              {
                left: piece.x,
                width: piece.size,
                height: piece.size,
                backgroundColor: piece.color,
                opacity,
                transform: [{ translateY: fall }, { translateX: sway }, { rotate }],
              },
            ]}
          />
        );
      })}
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({

  root: { ...StyleSheet.absoluteFillObject, overflow: "hidden", zIndex: 50 },
  piece: { position: "absolute", top: 0, borderRadius: 2 },
  });
}
