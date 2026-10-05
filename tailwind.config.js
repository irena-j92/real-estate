/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#071525",
        yellow: "#F4CF67",
        light: "#F5F3EC",
        white: "#FFFFFF",
        secondary: "#122B42",
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
