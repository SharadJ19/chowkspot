import { defineConfig } from 'vitest/config';
import path from 'path';
import { loadEnvFile } from 'node:process';

// Natively load .env.test using Node 26 built-in core API before config evaluation
try {
  loadEnvFile('./.env.test');
} catch {
  // Fallback gracefully if .env.test isn't bundled locally
}

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
});
