<div align="center">

# OpenForge

### Build visually. Keep the code.

OpenForge is an open-source visual development environment for building,
editing, exporting, and deploying production-grade Next.js applications
without giving up source-code ownership. Alongside that, it also ships a
multi-tenant, database-backed CMS surface — closer to WordPress plus
Gutenberg — for teams that want installable themes and block-based page
building instead of an exported codebase.

[![License: Apache 2.0](https://img.shields.io/badge/license-Apache%202.0-4169e1.svg)](LICENSE)
![Project status: Pre-alpha](https://img.shields.io/badge/status-pre--alpha-d97706.svg)
![JavaScript first](https://img.shields.io/badge/code-JavaScript%20%2F%20JSX-f7df1e.svg)
![Self-hostable](https://img.shields.io/badge/deployment-self--hostable-16a34a.svg)

[Why OpenForge?](#why-openforge) ·
[What we're building](#what-were-building) ·
[Architecture](#architecture) ·
[Roadmap](#roadmap) ·
[Contributing](#contributing)

</div>

> [!IMPORTANT]
> OpenForge is in pre-alpha planning and foundation work. The product is not
> ready for production use yet. The repository is being opened early so its
> architecture, security model, extension APIs, and contributor experience can
> be developed in public.

## Why OpenForge?

Visual builders make it fast to create. Traditional development makes it
possible to own, understand, and maintain the result. OpenForge is being built
to bring those workflows together.

The source code is the product format—not a proprietary document model.

A project created with OpenForge should remain a normal Next.js project that
you can clone, run, edit, test, commit, deploy, and maintain with standard
developer tools. OpenForge may add editor metadata and derived indexes, but
they must never become the only usable representation of your application.

## What we're building

OpenForge is designed around seven connected capabilities:

| Capability | Direction |
|---|---|
| **Visual editor** | Build responsive pages on a canvas while every supported action produces a readable source change. |
| **Real code workspace** | Edit JavaScript, JSX, styles, and project files with diagnostics, formatting, previews, and source diffs. |
| **Deterministic compiler** | Parse and transform supported Next.js code through AST tooling while preserving unsupported code safely. |
| **Multi-tenant CMS** | Create a database-backed site, install a theme, and build pages from reusable blocks within that theme's regions — content renders at request time and coexists with the source-owning editor above. |
| **Optional AI assistance** | Bring your own OpenAI, Anthropic, Gemini, local, or compatible provider and approve every proposed patch. |
| **GitHub and Vercel workflows** | Connect repositories, review changes, commit, push, create pull requests, and deploy previews. |
| **Plugin and skills SDK** | Extend the editor with blocks, templates, validators, integrations, provider adapters, workflows, and focused AI skills. |

### The OpenForge principles

- **You own the code.** Projects remain readable and runnable outside OpenForge.
- **JavaScript first.** First-party web and Node.js code uses JavaScript and JSX.
- **Visual and source editing stay synchronized.** Supported canvas operations
  map to deterministic code changes.
- **AI is optional.** Core editing, export, Git, and deployment workflows do not
  require an AI provider.
- **Bring your own key.** Provider credentials stay server-side and under the
  user's control.
- **Extensions are permission-scoped.** Plugins receive explicit capabilities,
  not unrestricted access.
- **Self-hosting is a first-class path.** The community edition is intended to
  run through Docker Compose.
- **Safety comes before automation.** Project code, plugins, archives, preview
  runtimes, and AI output are treated as untrusted.
- **Accessibility is part of the product.** The editor and official generated
  blocks target WCAG 2.2 AA.

## Who OpenForge is for

- Developers who want visual speed without unmaintainable generated code.
- Agencies building reusable site systems, blocks, and templates.
- Designer-developers working across canvas, responsive layout, and source.
- Teams that need GitHub-native review and deployment workflows.
- Companies that want self-hosted development infrastructure and controlled AI.
- Open-source contributors building reusable editor and automation capabilities.

## Architecture

OpenForge is planned as a modular JavaScript monorepo with independently
deployable services.

```text
Browser
  |
  v
Next.js web application
  |
  +--------------------+--------------------+
  |                    |                    |
  v                    v                    v
Express API       Preview gateway      Extension host
  |
  +--> PostgreSQL
  +--> Redis / BullMQ --> Node.js workers
  +--> Object storage
  +--> Python analysis service
  |
  +--> GitHub, Vercel, and AI provider adapters
```

### Core boundaries

| Area | Responsibility |
|---|---|
| `apps/web` | Project dashboard, visual editor, code workspace, integrations, and deployment UI. |
| `apps/api` | Authentication, authorization, project metadata, webhooks, audit events, secrets, and job coordination. |
| `apps/worker` | Git operations, builds, indexing, exports, deployments, and cleanup jobs. |
| `apps/preview` | Isolated preview sessions, runtime communication, logs, and lifecycle management. |
| `packages/compiler` | JavaScript/JSX compatibility analysis and deterministic AST transformations. |
| `packages/plugin-sdk` | Public extension contracts, manifests, schemas, mocks, and test utilities. |
| `packages/plugin-runtime` | Capability enforcement and isolated extension execution. |
| `services/python-analysis` | Bounded image, screenshot, accessibility, and repository-analysis tasks. |

The initial supported project profile targets Next.js App Router, React,
JavaScript/JSX, Tailwind CSS, CSS Modules, server and client components, GitHub,
and Vercel.

### CMS surface

The CMS is a separate, coexisting stack: content is database-authoritative
and rendered at request time, rather than compiled into exported source.

```text
Request (Host header)
  |
  v
apps/cms-renderer (Next.js, multi-tenant)
  |
  +--> resolve site by custom domain or slug subdomain
  +--> load published content            --> PostgreSQL (packages/db)
  +--> resolve theme + block components   --> packages/theme-sdk
  +--> render block tree + token CSS      --> packages/renderer,
                                               packages/cms-blocks,
                                               packages/design-tokens
```

| Area | Responsibility |
|---|---|
| `apps/cms-renderer` | Multi-tenant Next.js app: resolves the requesting site and renders its published content. |
| `apps/cms-admin` | Login-gated admin UI: sites, content templates, a drag-and-drop block-tree editor, and per-site appearance customization. |
| `packages/db` | Drizzle schema/migrations for tenancy, sessions, sites, content, assets, menus, and theme installations. |
| `packages/auth` | Password hashing, hashed-token sessions, and cross-tenant authorization. |
| `packages/theme-sdk` | Theme manifest schema and the runtime registry that resolves a theme's templates and block components. |
| `packages/cms-blocks` | Real, importable React block components with prop/slot/migration schemas. |
| `packages/renderer` | Block-tree rendering and per-site design-token CSS. |
| `themes/*` | Installable themes built on `theme-sdk` and `cms-blocks` (starts with `themes/default`). |

`apps/cms-admin` covers login, sites, content (starter templates plus a
drag-and-drop block-tree editor), and per-site appearance (color-token
overrides). A media library, multi-theme switching, and org management UI
are not built yet — the seed script (`tooling/scripts/seed-cms-demo.js`) or
direct `packages/db` access still covers what the UI doesn't.

## How source editing works

OpenForge connects three representations:

1. **Source files** — authoritative.
2. **Parsed component model** — derived and rebuildable.
3. **Rendered preview** — isolated and disposable.

Supported visual operations become validated, revision-aware editor operations.
They are applied through AST transformations, formatted, checked, and shown as
a source diff. Ambiguous or unsupported structures fall back to code-only mode
instead of being rewritten unsafely.

AI-assisted changes follow the same principle: generate a proposal, validate it
in a temporary workspace, show the diff, and apply it only after explicit user
approval.

## Roadmap

The roadmap is milestone-based rather than date-promised.

- [ ] **Phase 0 — Foundation:** monorepo, standards, CI, authentication,
  infrastructure, service skeletons, design tokens, and architecture decisions.
- [ ] **Phase 1 — Compatible project model:** JavaScript starter, compiler,
  workspace lifecycle, code editor, snapshots, export, and secure preview.
- [ ] **Phase 2 — Visual editor MVP:** component mapping, layer tree, official
  blocks, inspector, responsive editing, undo/redo, and source diffs.
- [ ] **Phase 3 — GitHub and Vercel:** repository workflows, pull requests,
  preview deployments, logs, and deployment status.
- [ ] **Phase 4 — BYOK AI:** provider-neutral interfaces, encrypted credentials,
  context controls, proposal validation, and official skills.
- [ ] **Phase 5 — Plugin and skills SDK:** manifests, permissions, extension
  host, CLI scaffolding, testing utilities, and curated registry.
- [ ] **Phase 6 — Production hardening:** security, performance, accessibility,
  backup and restore, migrations, signed artifacts, and release documentation.
- [ ] **Phase 7 — Collaboration:** comments, reviews, presence, synchronized
  operations, and organization libraries.

Real-time multiplayer, a public marketplace, billing, Figma import, WordPress
import, enterprise SSO, and Kubernetes support are intentionally outside the
initial MVP.

Alongside those phases, a first vertical slice of the multi-tenant CMS (site
resolution, theme rendering, starter blocks, and a production Docker image
for `apps/cms-renderer`) has been built and verified end to end. Its admin
UI, an authenticated CRUD API, and a theme/template marketplace are not built
yet — see `progress.md` for exact status and evidence.

## Project status

OpenForge is currently establishing its repository, architecture boundaries,
configuration contracts, security model, and contributor workflow for the
visual-editor product. There is no installable release or published package
for that side yet.

The CMS surface is further along: `apps/cms-renderer` builds a real
production Docker image (`apps/cms-renderer/Dockerfile`) and has been run
against a live PostgreSQL database, correctly rendering seeded content by
Host header, and `apps/cms-admin` now provides real login-gated site and
content management, including the block-tree page editor. It is still
pre-alpha — no media library, no theme customizer, no versioned release —
but it is genuinely runnable today, not a placeholder.

If you want to help shape the project now:

- open a [feature discussion or proposal](https://github.com/umarilyas02/OpenForge/issues);
- review existing [issues](https://github.com/umarilyas02/OpenForge/issues);
- propose architectural changes before starting a large implementation;
- share experience with AST tooling, preview isolation, extension sandboxes,
  Next.js internals, accessibility, or self-hosted developer platforms.

## Contributing

OpenForge welcomes focused, reviewable contributions.

Before starting:

1. Search the [issue tracker](https://github.com/umarilyas02/OpenForge/issues).
2. Open or join an issue for the problem you want to solve.
3. Discuss large features and architectural changes before implementation.
4. Keep pull requests narrow and include tests, documentation, security impact,
   accessibility impact, and migrations where applicable.
5. Never include credentials, private repositories, or private source code in
   examples or fixtures.

First-party web, API, worker, and package code will use JavaScript/JSX, ESM,
JSDoc for public APIs, runtime validation at boundaries, stable errors, and
tests for public contracts.

## Security

Please do not open a public issue for suspected vulnerabilities.

Until a dedicated security contact is published, use
[GitHub's private security channel](https://github.com/umarilyas02/OpenForge/security)
when available. Include the affected component, reproduction steps, impact, and
a safe proof of concept when possible.

High-priority security areas include authentication, cross-tenant access,
secret handling, preview and build isolation, plugin permissions, provider
context leakage, webhook verification, SSRF, path traversal, malicious
archives, and arbitrary code execution.

## License

OpenForge is licensed under the
[Apache License 2.0](LICENSE).

Copyright and trademark rights are separate from the open-source license. A
formal trademark policy will be published before the project reaches a stable
public release.

---

<div align="center">

**OpenForge is being built in the open.**

If the mission resonates with you, consider starring the repository and
joining the conversation.

</div>
