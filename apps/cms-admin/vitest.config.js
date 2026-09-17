import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Several test files (source-content-actions.test.js, site-git.test.js,
    // block-add-smoke.test.js, theme-site-generator.test.js, ...) spawn a
    // real `git` subprocess per assertion against a real workspace on
    // disk. Confirmed by reproducing a real CI failure in a Linux
    // container (2026-09-17): vitest's 5000ms default is too tight under
    // real CI resource contention -- a test timing out mid-commit didn't
    // clean up its git subprocess, leaving a stale `.git/index.lock` that
    // then broke every subsequent test in the same file with "Unable to
    // create .../.git/index.lock: File exists". Raising the default gives
    // real git operations enough margin that they finish instead of being
    // abandoned mid-operation.
    testTimeout: 20000,
  },
});
