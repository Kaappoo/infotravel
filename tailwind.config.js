import {heroui} from "@heroui/react";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    "@node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [heroui()],
};