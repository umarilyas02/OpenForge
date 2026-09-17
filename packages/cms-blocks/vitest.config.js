import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // The real-browser axe-core accessibility scan (playwright launch,
    // real page render) is deliberately excluded from the default `test`
    // script -- it's much slower than everything else here and its
    // devDependencies (playwright, axe-core) exist only for it. Run it
    // explicitly: `pnpm --filter @openforge/cms-blocks run test:a11y`.
    exclude: ["**/node_modules/**", "**/.git/**", "test/accessibility-axe.manual.test.js"],
  },
});
