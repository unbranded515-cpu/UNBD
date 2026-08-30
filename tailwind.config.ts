import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FFFFFF",
        surface: "#FFFFFF",
        surface2: "#FFF4EC",
        ink: "#1A1613",
        ink2: "#4A443D",
        muted: "#8A8175",
        line: "#ECE6DE",
        coral: "#F97316",
        coralink: "#C2540A",
        teal: "#B45309",
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
