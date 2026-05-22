/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        /* Brand palette — priority 1 → 4 */
        primary: "#17153B",
        secondary: "#2E236C",
        muted: "#433D8B",
        accent: "#C8ACD6",
        /* Derived surfaces */
        surface: "#F0EBF5",
        "surface-card": "#FFFFFF",
      },
    },
  },
  plugins: [],
};
