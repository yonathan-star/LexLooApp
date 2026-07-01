import React, { useEffect, useState, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { fontSize, spacing } from "../theme";
import { useColors } from "../context/ThemeContext";

// Screen 77: Offline Mode Notice — a persistent banner rather than a
// blocking screen, since saved/cached content should remain reachable.
export function OfflineBanner() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(state.isConnected === false);
    });
    return unsubscribe;
  }, []);

  if (!isOffline) return null;

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>You're offline. Some features may be limited.</Text>
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({

  banner: { backgroundColor: colors.warning, paddingVertical: spacing.xs, alignItems: "center" },
  text: { color: "#1A1300", fontSize: fontSize.xs, fontWeight: "700" },
  });
}
