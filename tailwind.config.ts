import type { Config } from "tailwindcss";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
// Edit these to retheme the entire site at once
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        bg: {
          base: "#040810",      // Main page background
          surface: "#070E1C",   // Card / elevated surface
          raised: "#0C1829",    // More elevated surface
        },
        // Brand accent
        emerald: {
          hedge: "#00E87A",     // Primary CTA / active state
          dim: "#00A858",       // Muted variant
          glow: "#00FF8844",    // Glow effect
        },
        // Electric blue
        blue: {
          accent: "#2A7FFF",    // Secondary accent
          muted: "#1A4B9A",
          glow: "#2A7FFF33",
        },
        // Text
        text: {
          primary: "#EEF2FF",   // Near-white, slight blue tint
          secondary: "#7B8DB0", // Muted blue-gray
          tertiary: "#3D4F70",  // Very muted
        },
        // Borders / separators
        border: {
          DEFAULT: "#FFFFFF10",
          subtle: "#FFFFFF08",
          active: "#FFFFFF20",
        },
      },
      fontFamily: {
        display: ["var(--font-syne)", "sans-serif"],  // Headlines
        body: ["var(--font-dm-sans)", "sans-serif"],  // Body text
        mono: ["var(--font-dm-mono)", "monospace"],   // Code / data
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "noise": "url('/noise.svg')",
      },
      animation: {
        "fade-up": "fadeUp 0.7s ease forwards",
        "fade-in": "fadeIn 0.5s ease forwards",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "scroll-hint": "scrollHint 2s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        scrollHint: {
          "0%, 100%": { transform: "translateY(0)", opacity: "1" },
          "50%": { transform: "translateY(8px)", opacity: "0.3" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
