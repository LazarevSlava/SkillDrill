/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // добавляем только СВОИ цвета, не трогаем стандартные white/yellow
      colors: {
        "deep-blue": "#3B5A72",
        "light-blue": "#AFC2D5",
        "gray-blue": "#6E8A9F",
        "dark-gray": "#2B2B2B",
        "brand-yellow": "#EFB94C",
      },
      borderRadius: {
        "2xl": "1rem",
      },
    },
  },
  // фиксируем «обязательные» классы подсветки
  safelist: ["bg-yellow-100", "border-yellow-400"],
  plugins: [],
};
