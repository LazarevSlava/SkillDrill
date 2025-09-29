// eslint.config.mjs
import js from "@eslint/js";
import ts from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default [
  // Глобальные игноры
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.vite/**",
      "**/.next/**",
      "**/coverage/**",
      "**/*.log",
      ".DS_Store",
      ".env",
      "server/.env",
    ],
  },

  // База JS
  js.configs.recommended,

  // База TS (быстро, без type-aware правил)
  ...ts.configs.recommended,

  // FRONTEND: React + TS/JS
  {
    files: ["client/**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        React: true,
        JSX: true,
      },
      // важно: не требуем project для скорости и чтобы не падать без tsconfig references
      parserOptions: { project: false },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
    },
    settings: {
      react: { version: "detect" },
    },
  },

  // BACKEND: Node.js CommonJS (JS)
  {
    files: ["server/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs", // <-- разрешаем require/exports
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // только для сервера отключаем запрет require()
      "@typescript-eslint/no-require-imports": "off",
    },
  },
];
