import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { fontSize, spacing } from "../../theme";
import { Button } from "../../components/Button";
import { useColors } from "../../context/ThemeContext";

interface State {
  hasError: boolean;
}

function ErrorFallback({ onReset }: { onReset: () => void }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>😕</Text>
      <Text style={styles.title}>Something unexpected happened</Text>
      <Text style={styles.muted}>Let's get you back on track.</Text>
      <Button label="Go Home" onPress={onReset} style={{ marginTop: spacing.lg }} />
    </View>
  );
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("LexLoo crashed:", error);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onReset={() => this.setState({ hasError: false })} />;
    }
    return this.props.children;
  }
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({

  container: { flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center", padding: spacing.lg },
  emoji: { fontSize: 48, marginBottom: spacing.sm },
  title: { color: colors.textPrimary, fontSize: fontSize.lg, fontWeight: "700", textAlign: "center" },
  muted: { color: colors.textSecondary, fontSize: fontSize.sm, marginTop: spacing.xs, textAlign: "center" },
  });
}
