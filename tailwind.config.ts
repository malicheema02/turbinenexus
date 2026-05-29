import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: {
            DEFAULT: "#1B3A5C",
            50: "#EBF0F6",
            100: "#C8D6E8",
            200: "#A5BCD9",
            300: "#6D93BC",
            400: "#3D6A9E",
            500: "#1B3A5C",
            600: "#152E4A",
            700: "#0F2237",
            800: "#091625",
            900: "#040B12",
          },
          slate: "#64748B",
          amber: {
            DEFAULT: "#F59E0B",
            hover: "#D97706",
          },
          dark: "#0F172A",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-gradient":
          "linear-gradient(135deg, #0F172A 0%, #1B3A5C 50%, #0F172A 100%)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
