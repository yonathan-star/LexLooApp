import React from "react";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts, Sora_400Regular, Sora_500Medium, Sora_600SemiBold, Sora_700Bold } from "@expo-google-fonts/sora";
import { queryClient } from "./src/lib/queryClient";
import { AuthProvider } from "./src/context/AuthContext";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { ErrorBoundary } from "./src/screens/common/ErrorBoundary";
import { OfflineBanner } from "./src/components/OfflineBanner";

function AppContent() {
  const { theme, colors } = useTheme();
  const [fontsLoaded] = useFonts({
    Sora_400Regular,
    Sora_500Medium,
    Sora_600SemiBold,
    Sora_700Bold,
  });

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <StatusBar style={theme === "dark" ? "light" : "dark"} />
          <OfflineBanner />
          <RootNavigator />
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
