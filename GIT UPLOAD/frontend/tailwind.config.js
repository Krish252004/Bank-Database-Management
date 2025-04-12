/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    darkMode: "class",
    theme: {
      extend: {
        colors: {
          primary: {
            50: "#fff7ed",
            100: "#ffedd5",
            200: "#fed7aa",
            300: "#fdba74",
            400: "#fb923c",
            500: "#f97316",
            600: "#ea580c",
            700: "#c2410c",
            800: "#9a3412",
            900: "#7c2d12",
            950: "#431407",
          },
          secondary: {
            50: "#f0fdfa",
            100: "#ccfbf1",
            200: "#99f6e4",
            300: "#5eead4",
            400: "#2dd4bf",
            500: "#14b8a6",
            600: "#0d9488",
            700: "#0f766e",
            800: "#115e59",
            900: "#134e4a",
            950: "#042f2e",
          },
          accent: {
            50: "#f0f9ff",
            100: "#e0f2fe",
            200: "#bae6fd",
            300: "#7dd3fc",
            400: "#38bdf8",
            500: "#0ea5e9",
            600: "#0284c7",
            700: "#0369a1",
            800: "#075985",
            900: "#0c4a6e",
            950: "#082f49",
          },
          dark: {
            100: "#d5d5d5",
            200: "#aaaaaa",
            300: "#808080",
            400: "#555555",
            500: "#2b2b2b",
            600: "#222222",
            700: "#1a1a1a",
            800: "#111111",
            900: "#090909",
            950: "#000000",
          },
          indian: {
            saffron: "#FF9933",
            white: "#FFFFFF",
            green: "#138808",
            blue: "#000080",
            chakra: "#0000FF",
          },
        },
        fontFamily: {
          sans: ["Poppins", "sans-serif"],
          display: ["Poppins", "sans-serif"],
          hindi: ["'Noto Sans Devanagari'", "sans-serif"],
        },
        boxShadow: {
          card: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          "card-hover": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        },
        animation: {
          "fade-in": "fadeIn 0.5s ease-in-out",
          "slide-up": "slideUp 0.5s ease-in-out",
          "slide-down": "slideDown 0.5s ease-in-out",
          "slide-left": "slideLeft 0.5s ease-in-out",
          "slide-right": "slideRight 0.5s ease-in-out",
          float: "float 3s ease-in-out infinite",
          "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        },
        keyframes: {
          fadeIn: {
            "0%": { opacity: 0 },
            "100%": { opacity: 1 },
          },
          slideUp: {
            "0%": { transform: "translateY(20px)", opacity: 0 },
            "100%": { transform: "translateY(0)", opacity: 1 },
          },
          slideDown: {
            "0%": { transform: "translateY(-20px)", opacity: 0 },
            "100%": { transform: "translateY(0)", opacity: 1 },
          },
          slideLeft: {
            "0%": { transform: "translateX(20px)", opacity: 0 },
            "100%": { transform: "translateX(0)", opacity: 1 },
          },
          slideRight: {
            "0%": { transform: "translateX(-20px)", opacity: 0 },
            "100%": { transform: "translateX(0)", opacity: 1 },
          },
          float: {
            "0%, 100%": { transform: "translateY(0)" },
            "50%": { transform: "translateY(-10px)" },
          },
          pulse: {
            "0%, 100%": { opacity: 1 },
            "50%": { opacity: 0.7 },
          },
        },
      },
    },
    plugins: [],
  }
  
  