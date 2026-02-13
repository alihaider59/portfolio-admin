/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        light: "#EAEFEF",       // priority 1
        secondary: "#BFC9D1",   // priority 2
        dark: "#25343F",        // priority 3
        accent: "#FF9B51",      // priority 4
      },
    },
  },
  plugins: [],
};