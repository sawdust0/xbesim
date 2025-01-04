import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

const config = [
  {
    ignores: ["**/node_modules/*", "dist/*", ".next/*", "out/*"],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: "./tsconfig.json",
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-function-return-type": ["warn", { 
        "allowExpressions": true 
      }],
      "@typescript-eslint/strict-null-checks": "error",
      "@typescript-eslint/no-floating-promises": "error",
      // Next.js özel kuralları
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn"
    },
    extends: [
      "next/core-web-vitals",
      "plugin:@typescript-eslint/recommended",
      "plugin:@typescript-eslint/recommended-requiring-type-checking"
    ]
  }
] as const;

export default config; 