/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        explorer: {
          bg: "#ffffff",
          sidebar: "#f3f3f3",
          hover: "#e5f3ff",
          selected: "#cce8ff",
          border: "#e5e5e5",
          text: "#1a1a1a",
          "text-secondary": "#666666",
        },
      },
    },
  },
  plugins: [],
};
