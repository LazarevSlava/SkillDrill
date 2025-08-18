// eslint.config.cjs — CommonJS, совместим с ESLint 9 flat-config и CI
const js = require('@eslint/js');
const globals = require('globals');
const tseslint = require('typescript-eslint');

module.exports = tseslint.config(
    // Глобальные игноры
    {
        ignores: ['**/node_modules/**', '**/dist/**'],
    },

    // Базовые JS правила
    js.configs.recommended,

    // Базовые TS правила без type-check (быстро и не требует tsconfig)
    ...tseslint.configs.recommended,

    // Type-aware правила для клиента (используем оба tsconfig)
    {
        files: ['client/**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parser: tseslint.parser,
            parserOptions: {
                project: [
                    './client/tsconfig.json',
                    './client/tsconfig.app.json',
                ],
                tsconfigRootDir: __dirname, // считать пути от корня репо
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

    // JS/конфиги (node окружение)
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
    // JS/конфиги (node окружение)
    {
        files: ['**/*.{js,cjs,mjs}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.node,
            },
        },
        rules: {
            // Разрешаем require() в JS-файлах
            '@typescript-eslint/no-require-imports': 'off',
        },
    }
);
