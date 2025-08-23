/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // переключение тем через класс .dark на <html> или <body>
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // семантические цвета, читаются из CSS-переменных (см. tokens.css)
        bg: "rgb(var(--color-bg) / <alpha-value>)",
        fg: "rgb(var(--color-fg) / <alpha-value>)",
        card: "rgb(var(--color-card) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        input: "rgb(var(--color-input) / <alpha-value>)",

        primary: "rgb(var(--color-primary) / <alpha-value>)",
        "primary-foreground": "rgb(var(--color-primary-fg) / <alpha-value>)",

        accent: "rgb(var(--color-accent) / <alpha-value>)",

        destructive: "rgb(var(--color-destructive) / <alpha-value>)",
        "destructive-foreground":
          "rgb(var(--color-destructive-fg) / <alpha-value>)",
      },
      ringColor: {
        DEFAULT: "rgb(var(--color-ring) / <alpha-value>)",
        primary: "rgb(var(--color-ring) / <alpha-value>)",
      },
      borderColor: {
        DEFAULT: "rgb(var(--color-border) / <alpha-value>)",
      },
      // опционально: контейнер по умолчанию
      container: {
        center: true,
        padding: "1rem",
        screens: { sm: "640px", md: "768px", lg: "1024px", xl: "1280px" },
      },
    },
  },
  plugins: [],
};
