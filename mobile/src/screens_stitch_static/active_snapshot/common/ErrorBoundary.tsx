import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, fontSize, spacing } from "../../theme";
import { Button } from "../../components/Button";

interface State {
  hasError: boolean;
}

// Screen 76: Error Boundary Screen — catches unexpected render errors
// anywhere in the tree so the app never crashes silently.
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
      return (
        <View style={styles.container}>
          <Text style={styles.emoji}>😕</Text>
          <Text style={styles.title}>Something unexpected happened</Text>
          <Text style={styles.muted}>Let's get you back on track.</Text>
          <Button label="Go Home" onPress={() => this.setState({ hasError: false })} style={{ marginTop: spacing.lg }} />
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center", padding: spacing.lg },
  emoji: { fontSize: 48, marginBottom: spacing.sm },
  title: { color: colors.textPrimary, fontSize: fontSize.lg, fontWeight: "700", textAlign: "center" },
  muted: { color: colors.textSecondary, fontSize: fontSize.sm, marginTop: spacing.xs, textAlign: "center" },
});
