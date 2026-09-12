## Summary

<!-- What does this change do, and why? Link an issue if one exists. -->

## Scope

<!--
This repo's delivery rule (see agents/progress.md) is one focused,
independently useful change per PR/commit. If this PR bundles unrelated
milestones, split it.
-->

## Checklist

- [ ] Ran the relevant test suite locally and it passes
      (`corepack pnpm --filter "@openforge/<name>" test`, or
      `corepack pnpm test` for a repo-wide change).
- [ ] Ran lint and it passes (`corepack pnpm lint`, or scoped with
      `--filter`).
- [ ] Ran the build and it passes (`corepack pnpm build`, or scoped with
      `--filter`).
- [ ] No regex-based JSX editing was introduced — structural source edits
      go through `@openforge/compiler`'s AST transforms.
- [ ] Site-scoped routes enforce `assertSiteAccess`/`assertOrgMembership`
      server-side inside the Route Handler itself (Next.js layouts do not
      wrap Route Handlers).
- [ ] Any UUID route param used in a Postgres `uuid` query is validated
      with `isUuid` first.
- [ ] Any new or changed secret at rest goes through
      `@openforge/integration-security`'s `createSecretVault` — never
      stored or logged in plaintext.
- [ ] `agents/progress.md` is updated in this same PR if it completes,
      advances, or changes a tracked task — the status marker, an
      evidence note (command/test/artifact that proves it), and the
      "Current handoff" section if relevant.
- [ ] Commit message(s) are clear and imperative, and do not include a
      `Co-authored-by` or other co-author trailer.

## Test plan

<!-- Commands you ran and their results. Be specific — "tests pass" alone isn't enough. -->
