import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B1220",
        surface: "#121B2E",
        card: "#172238",
        cardAlt: "#1E2C47",
        border: "#28365A",
        primary: "#2F6FFF",
        accent: "#FF8A3D",
        success: "#33C481",
        danger: "#FF5C5C",
        textPrimary: "#F5F7FA",
        textSecondary: "#9AAAC7",
        textMuted: "#6B7A99",
      },
    },
  },
  plugins: [],
};
export default config;
