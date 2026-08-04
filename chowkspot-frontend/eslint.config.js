import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default [
  // Global Ignores
  {
    ignores: ['dist/**', 'node_modules/**', '.vite/**'],
  },

  // Base JS Recommended
  js.configs.recommended,

  // ChowkSpot Frontend TSX/TS Rules
  {
    files: ['src/**/*.{ts,tsx}', 'vite.config.ts'],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 'latest',
      sourceType: 'module',

      // Explicitly defined browser & ES2022 runtime globals (No 'globals' package)
      globals: {
        // Browser Window & DOM Globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        fetch: 'readonly',
        FormData: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        HTMLButtonElement: 'readonly',
        HTMLInputElement: 'readonly',
        HTMLDivElement: 'readonly',
        HTMLFormElement: 'readonly',
        HTMLElement: 'readonly',
        Event: 'readonly',
        CustomEvent: 'readonly',
        MouseEvent: 'readonly',
        KeyboardEvent: 'readonly',

        // Timers & Async
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        Promise: 'readonly',

        // Node/Vite build env globals
        process: 'readonly',
        import: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // ---------------------------------------------------------------------
      // React & Hooks Rules
      // ---------------------------------------------------------------------
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // ---------------------------------------------------------------------
      // Base JS Overrides (TypeScript handles these natively)
      // ---------------------------------------------------------------------
      'no-unused-vars': 'off',
      'no-undef': 'off',

      // ---------------------------------------------------------------------
      // TypeScript Specific Rules (Matches ChowkSpot Backend)
      // ---------------------------------------------------------------------
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',

      // ---------------------------------------------------------------------
      // Code Integrity & Modern Standards
      // ---------------------------------------------------------------------
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
      eqeqeq: ['error', 'always'],
    },
  },
];
