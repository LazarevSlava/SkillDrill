/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "deep-blue": "#3B5A72", // Глубокий синий
        "light-blue": "#AFC2D5", // Светло-голубой
        white: "#FFFFFF", // Белый
        yellow: "#EFB94C", // Жёлтый (тёплый)
        "gray-blue": "#6E8A9F", // Серо-голубой
        "dark-gray": "#2B2B2B", // Тёмно-серый
      },
      borderRadius: {
        "2xl": "1rem",
      },
    },
  },
  plugins: [],
};
