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
      maxWidth: {
        container: "var(--container-max)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
      },
      container: {
        center: true,
        padding: "1.5rem",
        screens: { "2xl": "1400px" },
      },
    },
  },
};
