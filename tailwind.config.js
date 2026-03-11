/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0F",
        card: "#16161F",
        cardAlt: "#1E1E2A",
        border: "#2A2A3A",
        borderAlt: "#1E1E2A",
        primary: "#F0F0F5",
        secondary: "#8888A0",
        accent: "#6C5CE7",
        danger: "#FF4757",
        success: "#00D68F",
        income: "#00D68F",
        bills: "#FF4757",
        savings: "#4DA6FF",
      },
    },
  },
  plugins: [],
};
