import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { lightColors, darkColors } from "../theme/tokens";

export type AppTheme = "light" | "dark";
export type AppColors = typeof lightColors;

interface ThemeContextValue {
  theme: AppTheme;
  colors: AppColors;
  toggleTheme: () => void;
  setTheme: (t: AppTheme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  colors: darkColors,
  toggleTheme: () => {},
  setTheme: () => {},
});

const STORAGE_KEY = "@lexloo_theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<AppTheme>("dark");

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, "dark");
  }, []);

  const setTheme = (t: AppTheme) => {
    setThemeState(t);
    AsyncStorage.setItem(STORAGE_KEY, t);
  };

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <ThemeContext.Provider
      value={{ theme, colors: theme === "dark" ? darkColors : lightColors, toggleTheme, setTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function useColors(): AppColors {
  return useContext(ThemeContext).colors;
}
