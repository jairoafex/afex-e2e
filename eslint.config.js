import js from "@eslint/js";
import tseslint from "typescript-eslint";
import playwright from "eslint-plugin-playwright";

export default [
  // =========================
  // Base JavaScript
  // =========================
  js.configs.recommended,

  // =========================
  // FIX para archivos CommonJS (.cjs)
  // =========================
  {
    files: ["**/*.cjs"],
    languageOptions: {
      globals: {
        module: "readonly",
        require: "readonly",
        process: "readonly"
      }
    },
    rules: {
      "no-undef": "off"
    }
  },

  // =========================
  // TypeScript sin type-check (rápido)
  // =========================
  ...tseslint.configs.recommended,

  // =========================
  // TypeScript con type-check + Playwright
  // =========================
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

      // TypeScript (con types)
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-explicit-any": "warn"
    }
  },

  // =========================
  // Ignorados
  // =========================
  {
    ignores: [
      "node_modules",
      "playwright-report",
      "test-results",
      "dist"
    ]
  }
];
