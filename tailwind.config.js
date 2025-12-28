/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Primary colors (Koshpal Primary)
        primary: {
          lightest: "#eff1f8",
          light: "#ccd3ea",
          mid: "#99a6d6",
          primary: "#334eac",
          darkest: "#081f5c",
        },
        // Secondary colors (Koshpal Secondary/Teal)
        secondary: {
          lightest: "#eeeeee",
          light: "#7bb5be",
          mid: "#2b8997",
          primary: "#17a2b8",
          darkest: "#117a8a",
        },
        // Neutral/Black colors
        black: {
          lightest: "#4d4d4d",
          light: "#333333",
          dark: "#1a1a1a",
          mid: "#262626",
          darkest: "#000000",
        },
        // Grey colors
        grey: {
          lightest: "#e0e0e0",
          light: "#b3b3b3",
          mid: "#999999",
          dark: "#808080",
          darkest: "#666666",
        },
        // White/Light colors
        white: {
          lightest: "#eaeaea",
          light: "#f0f0f0",
          mid: "#f5f5f5",
          dark: "#fafafa",
          darkest: "#ffffff",
        },
        // Semantic colors - Red
        "semantic-red": {
          0: "#fff0f0",
          5: "#fad3d1",
          10: "#fa817a",
          20: "#f55a51",
          30: "#d5332a",
          40: "#b21d15",
          50: "#99120b",
          60: "#7c0903",
          70: "#650601",
          80: "#4c0501",
          90: "#370401",
        },
        // Semantic colors - Orange
        "semantic-orange": {
          0: "#fff6eb",
          5: "#fedfb9",
          10: "#fcc178",
          20: "#f5a038",
          30: "#eb8a14",
          40: "#d47602",
          50: "#c26b00",
          60: "#ad5f00",
          70: "#754100",
          80: "#472700",
          90: "#2e1900",
        },
        // Semantic colors - Green
        "semantic-green": {
          0: "#e6f0ea",
          5: "#ecffeb",
          10: "#cce1d5",
          20: "#b3d3c0",
          30: "#9ac4ab",
          40: "#8db69d",
          50: "#80b597",
          60: "#67a682",
          70: "#4e986d",
          80: "#348958",
          90: "#1b7a43",
        },
      },
      fontFamily: {
        // Koshpal Typography Fonts
        outfit: ["Outfit", "sans-serif"],
        "jakarta": ["Plus Jakarta Sans", "sans-serif"],
        sans: ["Plus Jakarta Sans", "Outfit", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Desktop sizes
        "display-xl": ["56px", { lineHeight: "72px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-lg": ["40px", { lineHeight: "52px", letterSpacing: "-0.01em", fontWeight: "700" }],
        "h1": ["32px", { lineHeight: "40px", letterSpacing: "-0.01em", fontWeight: "700" }],
        "h2": ["28px", { lineHeight: "36px", letterSpacing: "0", fontWeight: "600" }],
        "h3": ["22px", { lineHeight: "30px", letterSpacing: "0", fontWeight: "600" }],
        "h4": ["18px", { lineHeight: "26px", letterSpacing: "0.01em", fontWeight: "600" }],
        "h5": ["16px", { lineHeight: "24px", letterSpacing: "0.01em", fontWeight: "600" }],
        "h6": ["14px", { lineHeight: "20px", letterSpacing: "0.02em", fontWeight: "500" }],
        "subtitle": ["14px", { lineHeight: "20px", letterSpacing: "0.01em", fontWeight: "600" }],
        "body-lg": ["16px", { lineHeight: "24px", letterSpacing: "0.01em", fontWeight: "400" }],
        "body-md": ["14px", { lineHeight: "20px", letterSpacing: "0.01em", fontWeight: "400" }],
        "body-sm": ["12px", { lineHeight: "18px", letterSpacing: "0.02em", fontWeight: "400" }],
        "button": ["14px", { lineHeight: "20px", letterSpacing: "0.06em", fontWeight: "600" }],
        "label": ["12px", { lineHeight: "16px", letterSpacing: "0.04em", fontWeight: "600" }],
        "caption": ["11px", { lineHeight: "16px", letterSpacing: "0.02em", fontWeight: "400" }],
        "overline": ["10px", { lineHeight: "12px", letterSpacing: "0.12em", fontWeight: "600", textTransform: "uppercase" }],
      },
      fontWeight: {
        300: "300",
        400: "400",
        500: "500",
        600: "600",
        700: "700",
        800: "800",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
  ],
}
