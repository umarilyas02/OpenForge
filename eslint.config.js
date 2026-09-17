import eslint from "@eslint/js";
import jsxA11y from "eslint-plugin-jsx-a11y";
import globals from "globals";

export default [
  {
    ignores: [
      "**/coverage/**",
      "**/dist/**",
      "**/node_modules/**",
      "openforge-docs/**",
    ],
  },
  eslint.configs.recommended,
  {
    files: ["**/*.js", "**/*.jsx"],
    languageOptions: {
      ecmaVersion: "latest",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      sourceType: "module",
    },
    rules: {
      "no-console": "warn",
    },
  },
  {
    // Scoped to apps/cms-admin's own admin UI for now (the interface a
    // real user directly operates every session) -- packages/cms-blocks
    // and themes/* render real JSX too and deserve the same pass, tracked
    // separately in agents/progress.md rather than folded in unreviewed
    // here.
    files: ["apps/cms-admin/**/*.jsx"],
    plugins: { "jsx-a11y": jsxA11y },
    rules: jsxA11y.flatConfigs.recommended.rules,
  },
];
