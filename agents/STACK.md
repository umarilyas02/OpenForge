# Stack

A fast, factual reference for the exact technology that runs OpenForge — versions and configuration only. For the "why" behind these choices, see the root [README.md](../README.md#architecture) Architecture section, [`openforge-docs/docs/architecture/`](../openforge-docs/docs/architecture/) (local-only — gitignored, not present in a fresh clone of the public repo), the deep-dive write-ups in [`docs/`](../docs/), and individual package READMEs linked below.

## Language & runtime

| | |
|---|---|
| Language | JavaScript / JSX only — no TypeScript. Confirmed: no `.ts`/`.tsx` source files anywhere in the repo outside `node_modules`; the only `.ts` files present are Next.js auto-generated `.next/types/*` build artifacts. |
| Module system | ESM (`"type": "module"` in every `package.json`) |
| Node engine | `>=24.11.0` (root `package.json` `engines`, repeated in every app/package) |
| Linting | ESLint flat config (`eslint.config.js`), `@eslint/js` recommended rules + `no-console: warn`, applied to `**/*.js`/`**/*.jsx`; `openforge-docs/` is excluded |
| Formatting | Prettier `3.9.6`, no dedicated config file (repo relies on Prettier defaults), invoked via `prettier --check .` / `--write .` |

## Monorepo tooling

| | |
|---|---|
| Package manager | pnpm `11.17.0` (pinned via `packageManager: "pnpm@11.17.0"`, `engines.pnpm: ">=11.17.0"`) |
| Workspaces (`pnpm-workspace.yaml`) | `apps/*`, `packages/*`, `plugins/*`, `plugins/*/*`, `templates/*`, `themes/*`, `tooling/*` — active workspace is `apps/cms-admin` plus the `packages/*`/`themes/*` it actually depends on; `future-work/` is a sibling directory deliberately excluded from these globs (see `future-work/README.md`) |
| Build orchestration | Turborepo `2.10.7` (`turbo.json`) |
| Turbo tasks | `build` (depends on upstream `^build`), `dev` (uncached, persistent), `lint` (depends on upstream `^lint`), `test` (depends on upstream `^build`) |
| Root scripts | `build`, `dev` (`turbo run dev --parallel`), `lint`, `test`, `format`/`format:check`, `check` (prettier + turbo lint/test/build) |
| Special pnpm config | `allowBuilds`: `sharp`, `esbuild`, `protobufjs` allowed; `@google/genai` disallowed. `minimumReleaseAgeExclude`: `postcss@8.5.24`, `openai@7.0.0` |

## Apps

| App | Status | Framework/stack |
|---|---|---|
| `apps/cms-admin` | Implemented, active | Next.js `16.2.12`, React `19.2.8`, Drizzle ORM `0.45.2`, `@primer/react` `38.34.0` + `@primer/octicons-react` `19.31.0`, `lucide-react`, `geist` fonts. Tailwind CSS `4.3.3` (`@tailwindcss/postcss`) used only in the `(canvas)` route group (Preflight-free, scoped — see below) |
| `future-work/apps/web` | Implemented, shelved | Next.js `16.2.12`, React `19.2.8`, `@primer/react` `38.34.0`, `geist` fonts. No Tailwind. Visual Next.js project editor product line, not the CMS — see `future-work/README.md` |
| `future-work/apps/preview` | Implemented (non-Next.js), shelved | Plain Node package (`parse5` `8.0.1`, `zod` `4.4.3`) for isolated preview session handling — no framework |
| `future-work/apps/api`, `future-work/apps/worker`, `future-work/apps/docs` | **Placeholder, shelved** | Directories contain only `.gitkeep` — not implemented |
| `future-work/cms-renderer` | Implemented, shelved | Next.js `16.2.12`, React `19.2.8`, Drizzle ORM `0.45.2`. Tailwind CSS `4.3.3`. Not part of the active `pnpm-workspace.yaml` globs — see `future-work/README.md` |

### Tailwind vs. design-token CSS

Most of the CMS block library (`packages/cms-blocks`) is styled with the `--of-*` design-token CSS system (`packages/design-tokens`), not Tailwind. Tailwind CSS `4.3.3` is used in two Preflight-free, explicitly scoped places:
- `future-work/cms-renderer` (site rendering, shelved — not part of the active workspace)
- `apps/cms-admin/app/(canvas)/tailwind.css` — the live-canvas editor preview route, which renders the same `cms-blocks` components and carries the identical "no Preflight, blocks.css already resets" reasoning

A subset of blocks (Spotlight Card, Gradient Heading, Marquee Text, Feature List, Data Table, Carousel) are Tailwind-styled by design, coexisting with the token-CSS-styled majority (see [README.md](../README.md#cms-surface)).

## Database / data layer

| | |
|---|---|
| Package | `packages/db` — "Drizzle schema, migrations, and a thin PostgreSQL client for OpenForge" |
| ORM | `drizzle-orm` `0.45.2` |
| Driver | `pg` `8.23.0` |
| Migration tooling | `drizzle-kit` `0.31.10` (devDependency) |
| Migration scripts | `pnpm --filter @openforge/db generate` (drizzle-kit generate) → `pnpm --filter @openforge/db migrate` (drizzle-kit migrate) |
| Connection | `DATABASE_URL` (root `.env.example`); local Postgres credentials via `envs/examples/infrastructure.env.example` (`POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_PORT`) |

## Testing

| | |
|---|---|
| Test runner | Vitest `4.1.10` (root devDependency), run per-package via `vitest run` (e.g. `apps/cms-admin`, `packages/db`, `packages/workspace`) and orchestrated repo-wide via `turbo run test` |

## Local infrastructure

`docker/compose/docker-compose.yml` currently provisions:

| Service | Image | Notes |
|---|---|---|
| Redis | `redis:7-alpine` | port `${REDIS_PORT:-6379}`, healthcheck via `redis-cli ping` |
| MinIO | `minio/minio:latest` | S3-compatible object storage, API port `${MINIO_API_PORT:-9000}`, console `${MINIO_CONSOLE_PORT:-9001}` |

**Postgres is not defined as a service in this compose file** even though `envs/examples/infrastructure.env.example` includes `POSTGRES_DB`/`POSTGRES_USER`/`POSTGRES_PASSWORD`/`POSTGRES_PORT` — despite this, a populated `docker/volumes/postgres-data/` exists on disk, so Postgres is evidently run some other way in this environment (not this compose file as currently committed).

Per-app Dockerfiles are mostly unbuilt. The only real one is
`future-work/cms-renderer/Dockerfile` — a genuine multi-stage build
(`node:24-alpine`, corepack/pnpm install → `pnpm --filter
@openforge/cms-renderer build` → standalone Next.js runner on port 3000),
now shelved along with the app it belongs to. No app currently in
`apps/*` has a Dockerfile.

Note: `docker/README.md` still states Dockerfiles/Compose manifests are "Phase 0 implementation work and are intentionally absent" — that note is stale relative to `docker-compose.yml`, which exists.

## First-party packages (`packages/*`)

One line each, from the package's own README where one exists, otherwise from its `package.json` `description`:

| Package | Purpose |
|---|---|
| `packages/auth` | Password hashing, hashed-token sessions, and cross-tenant authorization *(no README)* |
| `packages/cms-blocks` | Real, importable React block components and their prop/slot schemas for the CMS — 51 official blocks across 11 themes *(no README)* |
| `packages/compiler` | Compatibility analysis and deterministic source transforms *(no README)* |
| `packages/component-library` | Local, portable catalog of reusable UI component variants harvested/generalized from reference projects, for template starting points |
| `packages/config` | Runtime environment schemas, safe startup validation, and public/secret redaction *(no README)* |
| `packages/db` | Drizzle schema, migrations, and a thin PostgreSQL client *(no README)* |
| `packages/design-tokens` | Portable, versioned design-token contracts — validates/resolves tokens and emits standalone CSS custom properties |
| `packages/integration-security` | Security primitives (envelope-encrypted secrets, scope policies, webhook verification, idempotency, audit events) used by the CMS's own GitHub PAT connector |
| `packages/renderer` | Server-side block-tree renderer and per-site token CSS injection for the CMS *(no README)* |
| `packages/storage` | Asset lifecycle and signed-access contracts (validated uploads, dedup, WebP variants, HMAC-signed access) |
| `packages/theme-sdk` | Theme manifest schema (`createTheme`) and runtime registry (`createThemeRegistry`) backing the 11 themes under `themes/*` *(no README)* |
| `packages/workspace` | Isolated project workspace lifecycle — owns each site's real on-disk Next.js project *(no README)* |

The active workspace is just `apps/cms-admin` plus these packages, `themes/*`,
and `services/python-analysis` (external, shelled out to for media-library
image analysis). Everything else that used to live under `packages/*`
(`ai`, `blocks`, `cli`, `editor`, `events`, `github`, `logger`,
`plugin-runtime`, `plugin-sdk`, `schemas`, `ui`, `vercel`) belonged to the
now-shelved visual-editor product line and has moved to
`future-work/packages/` — see `future-work/README.md` for what each one
did and how to restore it.

## External / optional integrations

**GitHub** — the CMS's own connector
(`apps/cms-admin/src/lib/github-connection.js`) uses a personal access
token (PAT), supplied by the operator, to push a site's real project files
to their own repo — a plain GitHub REST call verifies the token can
read+push the target repo before saving. This is deliberately lighter than
`future-work/packages/github`'s GitHub App + OAuth installation flow,
which targeted a hosted, multi-tenant integration that doesn't fit a
single self-hosted operator with no public callback URL.

## Further reading

- [`README.md`](../README.md) — project overview, principles, and the [Architecture](../README.md#architecture) / [CMS surface](../README.md#cms-surface) sections
- [`FOLDER_STRUCTURE.md`](./FOLDER_STRUCTURE.md) — directory-by-directory layout
- [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md) / [`progress.md`](./progress.md) — build phases and status
- [`docs/`](../docs/) — deep technical write-ups; some predate the `future-work/` shelving, so check which app/package a doc refers to before trusting it as current
- [`openforge-docs/docs/architecture/`](../openforge-docs/docs/architecture/) — system architecture, monorepo layout, data model, Python services, security (local-only, gitignored)
- [`docker/README.md`](../docker/README.md) — Docker layout notes
- [`../future-work/README.md`](../future-work/README.md) — full inventory of shelved apps/packages/plugins/templates and how to restore any of them
