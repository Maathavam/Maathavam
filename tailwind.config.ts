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
        maroon: {
          DEFAULT: "#6B1A2A",
          dark: "#4A0F1C",
          light: "#8B2A3E",
        },
        gold: {
          DEFAULT: "#C9922A",
          light: "#E8B84B",
          pale: "#F5D78E",
        },
        cream: {
          DEFAULT: "#FDF6EC",
          dark: "#F5E8D0",
          deeper: "#EDD8B4",
        },
        ink: {
          DEFAULT: "#2C2020",
          light: "#5A4040",
          lighter: "#8A6A6A",
        },
      },
      fontFamily: {
        display: ["var(--font-baloo)", "serif"],
        body: ["var(--font-poppins)", "sans-serif"],
      },
      backgroundImage: {
        "hero-pattern":
          "radial-gradient(ellipse at top, #8B2A3E 0%, #6B1A2A 40%, #4A0F1C 100%)",
        "gold-gradient":
          "linear-gradient(135deg, #C9922A 0%, #E8B84B 50%, #C9922A 100%)",
        "cream-gradient":
          "linear-gradient(180deg, #FDF6EC 0%, #F5E8D0 100%)",
        "maroon-gradient":
          "linear-gradient(135deg, #4A0F1C 0%, #6B1A2A 50%, #8B2A3E 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.7s ease-out forwards",
        "slide-down": "slideDown 0.5s ease-out forwards",
        "shimmer": "shimmer 2s infinite linear",
        "float": "float 3s ease-in-out infinite",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(201,146,42,0.4)" },
          "50%": { boxShadow: "0 0 0 12px rgba(201,146,42,0)" },
        },
      },
      boxShadow: {
        "gold-glow": "0 0 20px rgba(201,146,42,0.4)",
        "maroon-glow": "0 0 20px rgba(107,26,42,0.4)",
        "card": "0 4px 24px rgba(44,32,32,0.08)",
        "card-hover": "0 12px 40px rgba(44,32,32,0.16)",
      },
    },
  },
  plugins: [],
};

export default config;
