import { defineConfig } from "vitest/config";

// Used only by the `test:a11y` script -- the default vitest.config.js
// excludes test/accessibility-axe.manual.test.js from ordinary `pnpm
// test` runs (see that file's comment for why); this config is the one
// exception that includes it.
export default defineConfig({
  test: {
    exclude: ["**/node_modules/**", "**/.git/**"],
  },
});
