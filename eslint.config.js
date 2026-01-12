import js from "@eslint/js";
import tseslint from "typescript-eslint";
import playwright from "eslint-plugin-playwright";

export default [
  js.configs.recommended,

  // Reglas TypeScript SIN type-check (rápidas)
  ...tseslint.configs.recommended,

  {
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname
      }
    },
    plugins: {
      playwright
    },
    rules: {
      // Playwright
      "playwright/no-focused-test": "error",
      "playwright/no-skipped-test": "warn",
      "playwright/no-page-pause": "warn",
      "playwright/no-wait-for-timeout": "warn",
      "playwright/expect-expect": "error",

      // TypeScript (requieren types)
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-explicit-any": "warn"
    }
  },

  {
    ignores: [
      "node_modules",
      "playwright-report",
      "test-results",
      "dist"
    ]
  }
];