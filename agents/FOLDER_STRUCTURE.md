# Repository Folder Structure

The actual current monorepo layout. The active workspace is one product —
`apps/cms-admin` — plus the `packages/*`/`themes/*` it depends on and the
external `services/python-analysis` service. Everything belonging to a
separate, much-earlier-stage visual Next.js project editor product line
has been moved to `future-work/`, which is deliberately excluded from
`pnpm-workspace.yaml`'s globs (see `future-work/README.md` for the full
inventory and how to restore any of it).

```text
openforge/
|-- apps/
|   `-- cms-admin/           self-hosted, single-user CMS (the active product)
|-- services/
|   `-- python-analysis/     external dependency: real image analysis for the media library
|       |-- app/
|       |   |-- api/
|       |   |-- core/
|       |   |-- jobs/
|       |   |-- models/
|       |   |-- processors/
|       |   `-- schemas/
|       `-- tests/
|-- packages/
|   |-- auth/                password hashing, hashed-token sessions, cross-tenant authorization
|   |-- cms-blocks/          51 official CMS block components (prop/slot/migration schemas)
|   |-- compiler/            AST-based JS/JSX compatibility analysis and source transforms
|   |-- component-library/   portable component-variant catalog (nav/footer/hero/blog/product/grid/custom)
|   |-- config/              runtime environment schemas, startup validation, secret redaction
|   |-- db/                  Drizzle schema, migrations, Postgres client
|   |-- design-tokens/       portable design-token contracts and CSS custom-property emission
|   |-- integration-security/ envelope-encrypted secrets, scope policies, webhook verification
|   |-- renderer/            block-tree -> React rendering, per-site token CSS injection
|   |-- storage/             asset lifecycle, dedup, WebP variants, signed access
|   |-- theme-sdk/           theme manifest schema and runtime registry
|   `-- workspace/           isolated, on-disk Next.js project lifecycle for each site
|-- themes/                  11 installable themes (default + 10 full kits): agency, default,
|                            ecommerce, education, healthcare, magazine, nonprofit, portfolio,
|                            realestate, restaurant, saas
|-- plugins/                 empty (only a README) - contents shelved, see future-work/
|-- templates/                empty (only a README) - contents shelved, see future-work/
|-- tooling/
|   |-- eslint/
|   |-- scripts/
|   `-- test-utils/
|       `-- fixtures/
|-- future-work/             shelved visual-editor product line - excluded from workspace globs
|   |-- apps/                web/, api/, worker/, preview/, docs/
|   |-- cms-renderer/        shelved public multi-tenant site renderer
|   |-- packages/            ai/, blocks/, cli/, editor/, events/, github/, logger/,
|   |                        plugin-runtime/, plugin-sdk/, schemas/, ui/, vercel/
|   |-- plugins/             examples/, official/
|   |-- templates/           blank-next/, marketing/, portfolio/
|   `-- README.md            full inventory and restore instructions
|-- docker/
|   |-- compose/
|   |-- config/
|   `-- images/
|-- envs/
|   |-- examples/
|   `-- local/               ignored except for .gitkeep
|-- docs/                    deep technical write-ups; some predate the future-work/ shelving,
|                             so check which app/package a doc refers to before trusting it
|-- openforge-docs/           formal documentation-site corpus (gitignored, local-only)
|-- agents/                   durable agent reference docs: progress.md, IMPLEMENTATION_PLAN.md,
|                             STACK.md, this file
|-- .github/
|   `-- workflows/
|-- CLAUDE.md
|-- AGENTS.md
|-- README.md
|-- .env.example
`-- .gitignore
```

## Dependency direction

- `apps/cms-admin` composes `packages/*`; packages do not import
  application internals;
- `packages/compiler` stays independent of editor UI and provider
  integrations;
- Python (`services/python-analysis`) never performs JavaScript/JSX
  structural mutation — it's shelled out to for analysis only, and
  `packages/compiler` is the only thing that mutates site source;
- no circular workspace dependencies or private deep imports;
- nothing in the active workspace imports from `future-work/`.

## Further reading

- [`STACK.md`](./STACK.md) — exact versions/configuration and the current
  package-purpose table
- [`progress.md`](./progress.md) / [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md) — what's built vs. planned
- [`../future-work/README.md`](../future-work/README.md) — what moved out of the active workspace, why, and how to restore it
