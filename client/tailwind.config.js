/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // алиасы к токенам из src/styles/tokens.css
        "brand-deep": "var(--color-deep-blue)",
        "brand-light": "var(--color-light-blue)",
        "brand-white": "var(--color-white)",
        "brand-yellow": "var(--color-yellow)",
        "brand-gray-blue": "var(--color-gray-blue)",
        "brand-dark": "var(--color-dark-gray)",
      },
      boxShadow: {
        // можно использовать класс: shadow-card / shadow-soft
        card: "var(--shadow-card)",
        soft: "var(--shadow-soft)",
      },
      borderRadius: {
        "2xl": "1rem", // это дефолт Tailwind
      },
      maxWidth: {
        container: "var(--container-max)",
      },
      fontFamily: {
        // --font-sans в tokens.css
        sans: ["var(--font-sans)"],
      },
      container: {
        center: true,
        padding: "1.5rem",
        screens: { "2xl": "1400px" },
      },
    },
  },
  safelist: ["bg-yellow-100", "border-yellow-400"],
  plugins: [],
};
