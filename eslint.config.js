import js from "@eslint/js";
import ts from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default [
  // Глобальные игноры: не чекаем сборки и зависимости
  { ignores: ["**/dist/**", "**/node_modules/**"] },

  // База JS
  js.configs.recommended,

  // База TS (без project: ускоряет и не требует tsconfig для типа-правил)
  ...ts.configs.recommended,

  // Фронтенд (TS/TSX/JSX)
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
      parserOptions: { project: false }, // важно: не требуем tsconfig project
    },
    plugins: { react, "react-hooks": reactHooks },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
    settings: {
      react: { version: "detect" },
    },
  },

  // Бэкенд (Node, JS)
  {
    files: ["server/**/*.js"],
    languageOptions: {
      globals: globals.node,
    },
  },
];
