/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#1f2532",
        yellow: "#F4BA51",
        light: "#F5F3EC",
        white: "#FFFFFF",
        secondary: "#1f2532",
      },
      fontFamily: {
        sans: ["'Instrument Sans'", "sans-serif"],
        accent: ["'Instrument Serif'", "serif"],
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
