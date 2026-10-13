import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        brand: {
          DEFAULT: "#00D4AA",
          dim: "#00b891",
          glow: "rgba(0,212,170,0.15)",
        },
        surface: {
          900: "#080C14",
          800: "#0D1421",
          700: "#131D2E",
          600: "#1A2640",
          500: "#223050",
        },
        accent: {
          red: "#FF4D6A",
          yellow: "#FFB547",
          blue: "#4D9FFF",
          purple: "#A855F7",
        },
      },
      boxShadow: {
        glow: "0 0 20px rgba(0,212,170,0.25)",
        "glow-sm": "0 0 10px rgba(0,212,170,0.15)",
        panel: "0 4px 24px rgba(0,0,0,0.5)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scan-line": "scanLine 2s ease-in-out infinite",
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "fill-bar": "fillBar 1.2s ease-out forwards",
      },
      keyframes: {
        scanLine: {
          "0%, 100%": { opacity: "0.4", transform: "scaleX(0.95)" },
          "50%": { opacity: "1", transform: "scaleX(1)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fillBar: {
          from: { width: "0%" },
          to: { width: "var(--bar-width)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
