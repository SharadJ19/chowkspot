import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

// Zero-dependency flat config helper matching modern tseslint.config syntax
const defineConfig = (...configs) => configs.flat(Infinity);

export default defineConfig(
  // =========================================================================
  // 1. Global Ignores
  // Excludes build artifacts (dist), external dependencies (node_modules),
  // and auto-generated Drizzle ORM SQL migration files from linter scans.
  // =========================================================================
  {
    ignores: ['dist/**', 'node_modules/**', 'src/db/migrations/**'],
  },

  // =========================================================================
  // 2. Base Recommended JavaScript Rules
  // Applies standard JS best practices across all target files.
  // =========================================================================
  js.configs.recommended,

  // =========================================================================
  // 3. ChowkSpot Modular Architecture & Node.js Runtime Rules
  // Configures rules for Express controllers, services, repositories, Zod
  // schemas, Drizzle ORM definitions, Socket.io handlers, and JWT utilities.
  // =========================================================================
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',

      // Explicitly defines Node.js runtime globals without needing the 'globals' package
      globals: {
        node: true,
        process: true,
        console: true,
        Buffer: true,
        setTimeout: true,
        clearTimeout: true,
        setInterval: true,
        clearInterval: true,
        global: true,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      // ---------------------------------------------------------------------
      // Base JS Overrides
      // Disable base rules that conflict with native TypeScript compiler checks.
      // ---------------------------------------------------------------------
      'no-unused-vars': 'off',
      'no-undef': 'off', // TypeScript handles undefined global variables natively

      // ---------------------------------------------------------------------
      // TypeScript Specific Rules
      // ---------------------------------------------------------------------
      // Allows unused Express/Socket parameters & catch block errors starting with '_'
      // (e.g., '_req', '_res', 'next', or catch clause '_err')
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      // Warns on explicit 'any' usage to encourage strict Zod type inference and Drizzle ORM typing
      '@typescript-eslint/no-explicit-any': 'warn',

      // ---------------------------------------------------------------------
      // Express, Node.js & Production Code Standards
      // ---------------------------------------------------------------------
      // Encourages Pino logger usage over standard console logs
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // Modern ES2022+ Code Integrity & Clean Syntax Rules
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
      eqeqeq: ['error', 'always'],
    },
  },
);
