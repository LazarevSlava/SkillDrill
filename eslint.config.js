import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        ignores: ['**/node_modules/**', '**/dist/**'],
        files: ['client/**/*.{js,ts,tsx}', 'server/**/*.{js,ts}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parser: tseslint.parser,
            parserOptions: {
                project: [
                    './client/tsconfig.app.json',
                ],
            },
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: {},
    },
];
