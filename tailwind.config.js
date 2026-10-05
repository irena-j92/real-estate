/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#151717",
        yellow: "#FFC522",
        light: "#EBEBEB",
        white: "#FFFFFF",
        secondary: "#2F2F2F",
      },
      fontFamily: {
        sans: ["'Inter Tight'", "sans-serif"],
        accent: ["'Merriweather'", "serif"],
      },
      maxWidth: {
        site: "1440px",
      },
      transitionTimingFunction: {
        cinematic: "cubic-bezier(0.76, 0, 0.24, 1)",
      },
    },
  },
  plugins: [],
};
