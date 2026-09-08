# AGENTS.md

Instructions for AI coding agents working in this repository (Codex, Cursor,
Amp, Claude Code, or any other tool that reads this file). See `CLAUDE.md`
for the same facts framed for Claude Code specifically; `agents/progress.md`
and `agents/IMPLEMENTATION_PLAN.md` are the sources of truth for what is
actually built.

## Agent context files (`agents/`)

Durable reference docs for any agent working in this repo — read the
relevant one before nontrivial work rather than re-deriving it from scratch:

- [`agents/progress.md`](agents/progress.md) — the durable handoff/progress
  tracker. Updated in the same change that completes or changes a task; the
  single most current source of "what's actually built."
- [`agents/IMPLEMENTATION_PLAN.md`](agents/IMPLEMENTATION_PLAN.md) — the
  phased implementation plan `agents/progress.md` tracks against.
- [`agents/FOLDER_STRUCTURE.md`](agents/FOLDER_STRUCTURE.md) — the intended
  monorepo layout.
- [`agents/STACK.md`](agents/STACK.md) — a fast, factual tech-stack
  reference (exact versions and configuration, not narrative).

## What this repo is

Two mostly-separate products in one pnpm/turbo monorepo:

1. **The CMS** (`apps/cms-admin`) — a self-hosted, single-user,
   WordPress+Elementor-style CMS. This is the actively developed, working
   half of the project. `future-work/cms-renderer` (public multi-tenant
   site serving) is deliberately shelved, not active — see
   `future-work/README.md`.
2. **The visual Next.js project editor** (`apps/web`, `apps/api`,
   `apps/worker`, `apps/preview`) — a separate, much earlier-stage product
   for visually editing a real Next.js codebase you own and
   exporting/git-pushing/deploying it. `apps/api` and `apps/worker` are
   currently empty (`.gitkeep` only — verified). `apps/preview` has a
   started implementation (`src/index.js`, `src/preview-policy.js`, its own
   test).

See "Agent context files" below before nontrivial work.

## Commands

A bare `pnpm` is **not** on PATH in this environment (confirmed: fails with
"not recognized"/"command not found" in both PowerShell and bash). Use
`corepack pnpm` instead — confirmed working (`corepack pnpm --version` →
`11.17.0`, matching the `packageManager` field in the root `package.json`).

- Install: `corepack pnpm install`
- Build everything: `corepack pnpm build` (turbo, respects the dependency
  graph via `turbo.json`)
- Lint everything: `corepack pnpm lint`
- Test everything: `corepack pnpm test`
- Full check (what CI-equivalent local verification looks like):
  `corepack pnpm check` → `prettier --check .` then `turbo run lint test build`
- Format: `corepack pnpm format` / check only: `corepack pnpm format:check`
- Scope any script to one package/app:
  `corepack pnpm --filter "@openforge/<name>" <script>` (e.g.
  `corepack pnpm --filter "@openforge/cms-admin" test`)
- Run a single Vitest file:
  `corepack pnpm --filter "@openforge/<name>" exec vitest run test/<file>.test.js`
- Local infra (Postgres/Redis/MinIO): from `docker/compose/`,
  `docker compose up -d`
- Drizzle migrations (`packages/db`, needs `DATABASE_URL` set):
  `corepack pnpm --filter "@openforge/db" run generate` to create a
  migration from schema changes, then `run migrate` to apply pending ones.

## Coding conventions actually enforced

- **JavaScript/JSX only — no TypeScript.** Confirmed: the only `.ts`/`.tsx`
  files in the tree outside `node_modules` are Next.js's own generated
  `.next/types/*.d.ts` build artifacts, not hand-written source.
- ESLint flat config (`eslint.config.js`): `@eslint/js` recommended rules,
  `ecmaVersion: "latest"`, JSX parsing enabled for every `.js`/`.jsx` file
  (not just `.jsx`), both browser and node globals available everywhere,
  `"no-console": "warn"`. `coverage/`, `dist/`, `node_modules/`, and
  `openforge-docs/` are excluded.
- Prettier is used (`corepack pnpm format` / `format:check`) but there is
  **no `.prettierrc`** and no `prettier` key in `package.json` — it runs on
  its own defaults. `.prettierignore` excludes `openforge-docs/`,
  `coverage/`, `dist/`, `node_modules/`, `pnpm-lock.yaml`, `README.md`,
  `.impeccable/`.
- ESM throughout (`"type": "module"`), JSDoc for public APIs, runtime
  validation at boundaries — see `CLAUDE.md` for the full architectural
  rationale.

## Testing conventions

- Vitest per package/app — nearly every `package.json` under `apps/*` and
  `packages/*` defines `"test": "vitest run"`, and tests live in a `test/`
  directory alongside that package's `src/`.
- This repo favors real integration-style tests over heavy mocking where
  feasible. Example: `apps/cms-admin/test/site-git.test.js` runs real `git`
  operations (via `execFile`) against a throwaway directory
  (`./data/test-site-git`), created and torn down in `beforeAll`/`afterAll`,
  rather than mocking git. `packages/component-library/test/registry.test.js`
  is another example of testing against the real registry data rather than
  stubs.
- Run one file with `corepack pnpm --filter "@openforge/<name>" exec vitest run test/<file>.test.js`.

## Git / commit expectations

`agents/progress.md` documents a "Delivery rule" for how this project's own
maintainers deliver work: commit and push per completed, independently
useful milestone rather than batching unrelated work, using a clear,
imperative commit message describing the completed outcome, and not
marking something delivered until the push is confirmed. Follow the same
spirit as a general agent working here: focused commits, one logical
change per commit, imperative messages — but decide commit-trailer/co-author
conventions per the instructions given to you for a given task, since that
is a workflow detail rather than a fixed repo-wide rule.

## Security-sensitive patterns to respect

- **No regex-based JSX editing.** Structural changes to a site's real page
  source go through `@openforge/compiler`'s AST transforms
  (`packages/compiler`). Unsupported source should fall back to a
  code-only mode rather than being rewritten unsafely.
- **Secrets at rest** (e.g. connected GitHub tokens) go through
  `@openforge/integration-security`'s encrypted secret vault
  (`packages/integration-security`, AES-256-GCM envelope encryption) —
  never store or log them in plaintext.
- **Multi-tenant/site authorization must be checked explicitly inside
  Next.js Route Handlers.** Route Handlers are not wrapped by parent
  layouts the way pages are, so a layout-level session gate does not
  protect them. See the comment in
  `apps/cms-admin/app/assets/[...key]/route.js`, which documents exactly
  this: that route is deliberately placed as a sibling of the `(admin)`
  route group so it does *not* inherit `(admin)/(app)/layout.jsx`'s
  `requireUser()` gate, and instead authorizes via an HMAC signature in the
  URL query string.

## Architecture pointers (kept short — see `CLAUDE.md`/`agents/progress.md` for depth)

- Each CMS site is a real on-disk Next.js project, not a JSON blob; the
  block editor parses/writes real JSX via `@openforge/compiler`.
- `packages/renderer`'s block-tree → React pipeline is shared by the live
  canvas and the read-only preview — changes to block rendering usually
  touch both call sites.
- For "what's actually built vs. planned," trust `agents/progress.md`
  (updated per completed task) and `agents/IMPLEMENTATION_PLAN.md` (the
  phased plan) over any prose summary, including this one.
