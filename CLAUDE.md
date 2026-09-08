# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo actually is

OpenForge is two mostly-separate products sharing one monorepo:

1. **The CMS** (`apps/cms-admin` + `apps/cms-renderer`) — a self-hosted,
   single-user, WordPress+Elementor-style CMS. This is the actively
   developed, genuinely working half of the project. `cms-admin` is the
   authenticated admin (sites, the live-canvas drag-and-drop block editor,
   media, settings); `cms-renderer` is a separate, stateless, multi-tenant
   Next.js app that resolves a site by Host header (a custom domain, or a
   `<slug>.` subdomain) and renders its published content at request time
   straight from Postgres.
2. **The visual Next.js project editor** (`apps/web`, `apps/api`,
   `apps/worker`, `apps/preview`) — a separate, much earlier-stage product
   for visually editing a real, arbitrary Next.js codebase you own (not
   database content) and exporting/git-pushing/deploying it. `apps/api`
   and `apps/worker` are currently empty (`.gitkeep` only) — do not assume
   they have any implementation.

Read [`agents/progress.md`](agents/progress.md) before starting nontrivial
work — it's the authoritative, actively maintained record of what's
actually built vs. planned, updated in the same change that completes a
task. [`agents/IMPLEMENTATION_PLAN.md`](agents/IMPLEMENTATION_PLAN.md) is
the phased plan it tracks against.
[`agents/FOLDER_STRUCTURE.md`](agents/FOLDER_STRUCTURE.md) documents the
intended monorepo layout, and [`agents/STACK.md`](agents/STACK.md) is a
fast, factual tech-stack reference.

## Key architectural fact about the CMS

Each CMS site is a **real, on-disk Next.js project** (its own
`package.json`, an `app/` directory of real `.jsx` page files) — not a JSON
blob rendered by a template. See `starter-template.js`'s own comment: "the
project IS the site; there is no separate database representation of its
content." The block editor works by parsing a page's real JSX source into
an editable tree (`source-content-tree.js`'s `parsePageToBlockTree`, backed
by `@openforge/compiler`'s AST tooling) and writes edits back as real AST
transforms, never regex. `packages/workspace`'s `WorkspaceManager` owns
each site's files on disk (under `SITES_STORAGE_PATH`, one subdirectory per
site slug) and needs to sit on a persistent volume in production — the same
durability requirement as the database.

`packages/renderer` (`createRenderer` + `renderSiteStyles`) is the
block-tree → React pipeline shared by three call sites that each obtain the
tree a different way: the live canvas (`app/(canvas)/canvas/page.jsx`, tree
pushed over `postMessage` from the parent editor), the read-only site
preview (`app/(preview)/preview/[siteId]/page.jsx`, tree computed
server-side straight from the real source file), and `apps/cms-renderer` in
production (tree loaded from Postgres). Changing block rendering usually
means checking all three.

## Hard constraints

- **JavaScript/JSX only, no TypeScript**, ESM throughout, JSDoc for public
  APIs, runtime validation at boundaries.
- **No regex-based JSX editing.** Structural changes go through
  `@openforge/compiler`'s AST transforms. Unsupported source falls back to
  code-only mode instead of being rewritten unsafely.
- AI assistance is optional and BYOK (bring your own provider key); it
  proposes diffs a user must explicitly approve, never silently edits
  active files.
- Multi-tenant/multi-site authorization (`assertSiteAccess`,
  `assertOrgMembership` from `@openforge/auth`) is enforced server-side on
  every site-scoped route — check it explicitly inside Route Handlers,
  since Next.js layouts do **not** wrap Route Handlers (see the comment in
  `apps/cms-admin/app/assets/[...key]/route.js`).
- A route param used to query a Postgres `uuid` column must be validated as
  a UUID first (`apps/cms-admin/src/lib/uuid.js`'s `isUuid`) — Postgres
  throws a raw driver error on a malformed value instead of returning no
  rows, which otherwise surfaces as a 500 instead of a clean 404.
- Secrets at rest (currently: connected GitHub tokens) go through
  `@openforge/integration-security`'s `createSecretVault` (AES-256-GCM
  envelope encryption) — never stored or logged in plaintext. A `git push`
  token is passed as a one-off `-c http.extraheader`, never written to
  `.git/config`.
- The full self-hosted stack is meant to run through Docker Compose.
  `docker/compose/docker-compose.yml` currently provisions Redis and MinIO
  only (no Postgres service — check its current state before relying on
  this, it has changed during development). Per-app Dockerfiles are mostly
  unbuilt; `apps/cms-renderer/Dockerfile` is the one real, complete one.
  See `STACK.md` for the exact current state of local infra and Docker.

## Commands

A bare `pnpm` is not on PATH in this environment — use `corepack pnpm`
instead (confirmed working; plain `pnpm ...` fails with "not recognized").

- Install: `corepack pnpm install`
- Build everything: `corepack pnpm build` (turbo, respects the dependency
  graph)
- Lint everything: `corepack pnpm lint`
- Test everything: `corepack pnpm test`
- Format: `corepack pnpm format` / `corepack pnpm format:check`
- Scope any of the above to one package/app:
  `corepack pnpm --filter "@openforge/<name>" <script>` (e.g.
  `corepack pnpm --filter "@openforge/cms-admin" test`)
- Run a single test file:
  `corepack pnpm --filter "@openforge/<name>" exec vitest run test/<file>.test.js`
- Local infra (Postgres/Redis/MinIO): from `docker/compose/`,
  `docker compose up -d`
- Drizzle migrations (`packages/db`, needs `DATABASE_URL` set):
  `corepack pnpm --filter "@openforge/db" run generate` to create a
  migration from schema changes, then `run migrate` to apply pending
  migrations.

## Where things live

- `packages/db` — Drizzle schema (`src/schema/*.js`) and migrations
  (`migrations/`) for the CMS's Postgres tables.
- `packages/cms-blocks` — the real, importable React block components
  (with prop/slot/migration schemas) the CMS editor and renderer both use.
- `packages/blocks` — a separate, small, versioned "official" block
  registry for the visual-editor product line — not the CMS block library
  above; don't confuse the two.
- `packages/component-library` — a static catalog (nav/footer/hero/blog/
  product/grid/custom) of portable component *variants* harvested from
  reference projects, meant to be served by a future standalone service.
  Has its own README with the authoring contract — read it before adding
  to it.
- `packages/ai`, `packages/blocks`, `packages/component-library`,
  `packages/design-tokens`, `packages/github`, `packages/integration-security`,
  `packages/storage`, `packages/vercel` have their own README; the rest
  don't yet.
- `docs/*.md` — deep technical write-ups (compiler read/write pipelines, AI
  credential lifecycle, GitHub connection, secure preview, workspace
  lifecycle, canvas mapping, etc.), mostly about the visual-editor product
  line's subsystems.
- `openforge-docs/` — a separate, more formal documentation-site corpus
  (product vision/PRD, full architecture write-ups, contributor
  governance, RFCs) — see `openforge-docs/INDEX.md`. **Gitignored and
  local-only** — it will not exist in a fresh clone of the public repo,
  only in local working copies that already have it. Its `SECURITY.md` is
  the full vulnerability-reporting policy; `.github/SECURITY.md` is a
  short pointer to it, kept under `.github/` for GitHub's own tooling.
