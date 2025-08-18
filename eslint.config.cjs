// eslint.config.js (ESM, flat-config)
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
    // Игнор глобально
    {
        ignores: ['**/node_modules/**', '**/dist/**'],
    },

    // Базовые JS правила
    js.configs.recommended,

    // Клиент: TS/TSX с type-aware правилами
    {
        files: ['client/**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parser: tseslint.parser,
            parserOptions: {
                // ВАЖНО: путь к tsconfig из корня репо
                project: [
                    './client/tsconfig.json',
                    './client/tsconfig.app.json',
                ], // если у тебя tsconfig.json — поменяй здесь
                tsconfigRootDir: process.cwd(),
            },
            globals: {
                ...globals.browser,
            },
        },
        plugins: {
            '@typescript-eslint': tseslint.plugin,
        },
        rules: {
            // твои правила при желании
        },
    },

    // JS файлы (в т.ч. конфиги)
    {
        files: ['**/*.{js,cjs,mjs}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.node,
            },
        },
        rules: {},
    },
];
