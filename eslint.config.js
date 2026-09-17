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
    // apps/cms-admin's own admin UI, plus packages/cms-blocks and
    // themes/* -- the real block components and theme example content
    // rendered on every live site, not just the admin interface.
    files: [
      "apps/cms-admin/**/*.jsx",
      "packages/cms-blocks/**/*.jsx",
      "themes/*/**/*.jsx",
    ],
    plugins: { "jsx-a11y": jsxA11y },
    rules: jsxA11y.flatConfigs.recommended.rules,
  },
];
