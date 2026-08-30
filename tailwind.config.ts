import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F5F1E8",
        surface: "#FBF8F1",
        surface2: "#EFEADD",
        ink: "#171410",
        ink2: "#453E33",
        muted: "#7A7161",
        line: "#DED6C4",
        coral: "#FF5A38",
        coralink: "#C23A1E",
        teal: "#0E5B54",
        good: "#1E7A54",
        warn: "#C98A18",
        bad: "#C6472C",
      },
      fontFamily: {
        display: ["var(--font-bricolage)", "system-ui", "sans-serif"],
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
        mono: ["var(--font-space-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
