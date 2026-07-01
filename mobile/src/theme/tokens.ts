// Design System — "Cozy & Scholarly" — warm parchment base, ink-blue actions,
// amber rewards. Each learning category has its own identity color.

export const lightColors = {
  // Surfaces
  background: "#F7F2EA",
  backgroundDeep: "#EDE7D9",
  backgroundElevated: "rgba(255, 252, 245, 0.75)",
  card: "rgba(255, 252, 245, 0.82)",
  cardSolid: "#FFFCF5",
  cardAlt: "rgba(255, 252, 245, 0.94)",
  cardHighest: "#DDD5C4",

  // Borders
  border: "rgba(180, 155, 110, 0.24)",
  borderStrong: "rgba(27, 58, 107, 0.22)",
  divider: "rgba(80, 65, 40, 0.10)",
  borderFocus: "#1B3A6B",

  // Text (warm ink tones)
  textPrimary: "#1A1610",
  textSecondary: "#4A4035",
  textMuted: "#7A6E60",

  // Primary — ink blue (scholarly, authoritative)
  primary: "#1B3A6B",
  primaryPressed: "#142D54",
  primaryContainer: "#2D5095",
  onPrimary: "#FFFFFF",
  primaryWash: "rgba(27, 58, 107, 0.10)",

  // Accent — warm amber (reward, warmth, encouragement)
  accentOrange: "#C97B3C",
  accentOrangePressed: "#8B5220",
  onAccentOrange: "#4A2800",
  orangeWash: "rgba(201, 123, 60, 0.14)",

  // Semantic
  success: "#2A7A4C",
  successWash: "rgba(42, 122, 76, 0.12)",
  error: "#BA1A1A",
  warning: "#C96B3C",

  // Utility
  white: "#FFFFFF",
  overlay: "rgba(40, 35, 25, 0.45)",
  inputBackground: "rgba(237, 232, 220, 0.82)",
  darkNav: "#1A1711",
  inverseText: "#F5F0E8",
};

// Dark mode — matches lexloo.com website navy palette
export const darkColors: typeof lightColors = {
  // Surfaces (website navy scale)
  background: "#060d24",
  backgroundDeep: "#03081B",
  backgroundElevated: "rgba(10, 18, 48, 0.80)",
  card: "rgba(15, 28, 68, 0.85)",
  cardSolid: "#0f1c44",
  cardAlt: "rgba(10, 18, 48, 0.96)",
  cardHighest: "#15275c",

  // Borders
  border: "rgba(41, 182, 246, 0.15)",
  borderStrong: "rgba(41, 182, 246, 0.30)",
  divider: "rgba(255, 255, 255, 0.08)",
  borderFocus: "#29b6f6",

  // Text
  textPrimary: "#FFFFFF",
  textSecondary: "rgba(255, 255, 255, 0.75)",
  textMuted: "rgba(255, 255, 255, 0.45)",

  // Primary — loo-blue
  primary: "#29b6f6",
  primaryPressed: "#1999d4",
  primaryContainer: "#1a8cc4",
  onPrimary: "#060d24",
  primaryWash: "rgba(41, 182, 246, 0.12)",

  // Accent — loo-orange
  accentOrange: "#f5821f",
  accentOrangePressed: "#f5821f",
  onAccentOrange: "#FFFFFF",
  orangeWash: "rgba(245, 130, 31, 0.22)",

  // Semantic
  success: "#4caf50",
  successWash: "rgba(76, 175, 80, 0.15)",
  error: "#ef5350",
  warning: "#f5821f",

  // Utility
  white: "#FFFFFF",
  overlay: "rgba(0, 0, 0, 0.65)",
  inputBackground: "rgba(15, 28, 68, 0.90)",
  darkNav: "#060d24",
  inverseText: "rgba(255, 255, 255, 0.60)",
};

// Backward-compat alias (default = light; ThemeContext resolves at runtime)
export const colors = lightColors;

// Per-category identity colors — bright enough to be visible in both light and dark mode.
export const packColors: Record<string, { accent: string; wash: string; glyph: string }> = {
  english:  { accent: "#29b6f6", wash: "rgba(41, 182, 246, 0.14)",  glyph: "book" },
  sat:      { accent: "#9c6fd6", wash: "rgba(156, 111, 214, 0.14)", glyph: "school" },
  language: { accent: "#4caf50", wash: "rgba(76, 175, 80, 0.14)",   glyph: "globe" },
  default:  { accent: "#29b6f6", wash: "rgba(41, 182, 246, 0.14)",  glyph: "albums" },
};

export const spacing = {
  xs: 4,
  sm: 12,
  md: 20,
  lg: 32,
  xl: 48,
  xxl: 48,
  safeMargin: 20,
  gutter: 12,
};

export const radius = {
  sm: 4,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
};

export const fontFamily = {
  display: "Sora_700Bold",
  headline: "Sora_600SemiBold",
  title: "Sora_600SemiBold",
  body: "Sora_400Regular",
  bodyBold: "Sora_700Bold",
  mono: "Sora_500Medium",
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  display: 32,
  word: 40,
};

export const lineHeight = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
  xl: 31,
  xxl: 40,
  display: 38,
};

// Colored glows — use loo-blue/loo-orange so they're visible in both themes.
export const glow = {
  primary: {
    shadowColor: "#29b6f6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 5,
  },
  orange: {
    shadowColor: "#f5821f",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 5,
  },
  purple: {
    shadowColor: "#9c6fd6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 5,
  },
  green: {
    shadowColor: "#4caf50",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.20,
    shadowRadius: 20,
    elevation: 5,
  },
};

export const shadow = {
  card: {
    shadowColor: "#29b6f6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 20,
    elevation: 3,
  },
};

export const touchTarget = { minHeight: 44, minWidth: 44 };
