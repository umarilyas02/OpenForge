# OpenForge Implementation Plan

Status: planning baseline plus an executed CMS vertical slice and admin UI
Last updated: 2026-09-08
Execution tracker: [`progress.md`](progress.md)

## 1. Purpose

This plan converts the OpenForge product, architecture, platform, security,
design, testing, and roadmap documents into an implementation sequence.

OpenForge will be an open-source, self-hostable, AI-assisted visual development
environment for standard Next.js App Router projects written in JavaScript and
JSX. The generated project source remains authoritative and must stay readable,
portable, editable, and runnable without OpenForge.

This document is intentionally an implementation plan only. The repository
scaffolding created with it contains no application or service implementation.

## 2. Non-negotiable product constraints

1. First-party web, API, worker, compiler, and npm package code uses JavaScript
   or JSX, ESM, JSDoc, and runtime validation—not TypeScript.
2. Source files are authoritative. Editor metadata and indexes are derived and
   rebuildable.
3. Visual changes use deterministic AST transformations. Regex is not the
   structural JSX editing engine.
4. Unsupported source is preserved and falls back to code-only mode.
5. AI is optional, uses server-side BYOK credentials, proposes changes, and
   cannot silently modify active project files.
6. Project code, extensions, archives, AI output, and provider input are
   untrusted.
7. Preview/build execution is isolated from the control plane and its secrets.
8. Git writes, production deployments, destructive actions, and high-risk
   extension capabilities require explicit user approval.
9. Multi-tenant authorization is enforced server-side on every tenant-owned
   resource.
10. The editor and generated official blocks target WCAG 2.2 AA.
11. The complete community stack must run through Docker Compose.
12. MVP scope stays focused on compatible Next.js marketing and static sites.

## 3. Architecture baseline

### Control plane

- `apps/web`: Next.js editor, dashboard, integrations, deployment and extension UI.
- `apps/api`: Express REST API, authorization, metadata, webhooks, secrets and jobs.
- `apps/worker`: BullMQ consumers for Git, builds, indexing, deployments and cleanup.

### Project plane

- `apps/preview`: preview session gateway and isolated runtime coordination.
- `packages/compiler`: compatibility analysis and deterministic JavaScript/JSX transforms.
- object storage: archives, assets, snapshots, logs, screenshots and exports.

### Extension plane

- `packages/plugin-sdk`: public contracts, schemas and test utilities.
- `packages/plugin-runtime`: capability enforcement and isolated extension execution.
- `plugins`: official and example extensions.

### Integration plane

- `packages/ai`, `packages/github`, `packages/vercel`, and `packages/storage`.
- `services/python-analysis`: bounded imaging, screenshot, accessibility and
  repository-analysis tasks.

### Shared infrastructure

- PostgreSQL: authoritative application metadata.
- Redis/BullMQ: jobs, locks, ephemeral state, rate limits and notifications.
- S3-compatible storage; MinIO for local development.
- versioned JSON schemas and stable error codes at all boundaries.

## 4. Delivery strategy

Every phase is gated. A later phase may begin only when the earlier phase's
contracts and exit criteria are stable enough to support it. Security,
accessibility, tests, observability, migrations, and documentation are part of
each phase rather than deferred wholesale to hardening.

For each subphase:

1. confirm requirements and unresolved decisions;
2. add or approve an RFC/ADR when the contract is architectural;
3. define schemas and public boundaries before dependent implementations;
4. implement the smallest vertical slice;
5. add unit, contract, integration, security, accessibility, or end-to-end tests;
6. update documentation and `progress.md`;
7. record concrete verification evidence.

## Phase 0 — Repository and platform foundation

Goal: contributors can run, test, and understand the empty-to-foundation stack.

### 0.1 Project identity and governance

- select and add the final open-source license;
- verify the project name, npm scope, repository name, domains, and trademarks;
- adopt a complete recognized code of conduct;
- configure security contact and private vulnerability reporting;
- decide DCO versus CLA and add contribution checks;
- define maintainership, CODEOWNERS, protected areas, issue forms, and PR template.

Gate:

- legal/community decisions are recorded;
- no substantial external contribution is accepted before licensing is settled.

### 0.2 Monorepo bootstrap

- initialize Git at the monorepo root;
- create the pnpm workspace and root package manifest;
- pin supported Node, pnpm, and Python versions;
- configure Turborepo task graph;
- add Changesets;
- establish ESM, JavaScript/JSX, JSDoc, formatting, linting, and naming rules;
- prevent circular dependencies and private deep imports;
- add shared test utilities and fixture conventions.

Gate:

- clean checkout installs deterministically;
- root format, lint, test, and build commands execute successfully.

### 0.3 Configuration and environment contracts

- implement service-specific runtime schemas;
- document precedence for process environment, root local env, and service env;
- keep browser-public variables explicitly allowlisted;
- reject missing or malformed required variables at startup;
- define encryption-key rotation and secret-reference contracts;
- implement redaction rules for logs, diagnostics, errors, AI context and exports.

Gate:

- each service starts with valid config and fails safely with actionable errors;
- secret scanning fixtures prove common credentials are not logged or committed.

### 0.4 Local infrastructure

- compose PostgreSQL, Redis, MinIO and the Python service;
- add health/readiness checks and persistent local volumes;
- add database migration workflow and seed strategy;
- add object-storage buckets/prefix conventions;
- document backup, reset, and local recovery without destructive defaults.

Gate:

- infrastructure reaches healthy state from a clean machine;
- API/worker/Python connectivity checks pass.

### 0.5 Shared platform primitives

- implement schemas, configuration, logger, trace IDs, error envelopes and events;
- establish authentication/session package boundaries;
- define organization/project authorization primitives;
- define job payload/result and audit-event contracts;
- expose health and readiness endpoints.

Gate:

- API, worker and Python contract tests cover success and failure envelopes;
- cross-tenant denial tests exist before tenant features.

### 0.6 Application and service skeletons

- create minimal web, API, worker, preview and Python processes;
- establish package public exports without placeholder business behavior;
- implement the application shell using approved design tokens;
- add baseline error boundaries and diagnostics surfaces.

Gate:

- all processes run concurrently and report health;
- no browser bundle includes server-only modules or secrets.

### 0.7 CI and supply-chain baseline

- add formatting, lint, unit, schema, build, license and secret-scan jobs;
- add dependency and container scanning;
- cache pnpm and Python dependencies safely;
- generate SBOM/provenance where supported;
- configure branch protection and required reviews for sensitive paths.

Phase 0 exit:

- a contributor can clone, configure and run the documented local stack;
- CI reproduces the local quality gates;
- architecture and setup documentation are discoverable.

## Phase CMS — Multi-tenant CMS surface (added 2026-08-28)

Goal: organizations can create a database-backed site, install a theme, and
build pages from reusable blocks within that theme's declared regions —
WordPress plus Gutenberg, not a plain WordPress template model — as a
product surface that coexists with the static-source visual editor above.
Content is database-authoritative and rendered at request time; this is a
deliberate, documented exception to the "source is authoritative" principle
for this one surface (see `openforge-docs/docs/product/01-vision.md`,
"Multi-tenant CMS surface"), not a change to it for the rest of the product.

This phase only builds the Phase 0 primitives it actually needs. Phase 0's
governance (0.1) and CI (0.7) work is untouched by it.

### CMS.1 Data model and tenancy

- `packages/db`: Drizzle schema for users/sessions/organizations/
  organization_members/audit_events plus sites/content_items (pages and
  posts unified via a `type` column)/content_revisions/assets/
  asset_variants/menus/menu_items/theme_installations;
- `packages/auth`: password hashing, hashed-token sessions, cross-tenant
  authorization helpers.

### CMS.2 Theme and block model

- `packages/theme-sdk`: manifest schema (regions, allowed block IDs per
  region, declared templates, token overrides) and a runtime registry;
- `packages/cms-blocks`: real, importable React block components (not JSX
  source text — that's `packages/blocks`' AST-compiler-only concern) with
  prop/slot/migration schemas;
- `themes/default`: the first real theme, built on both of the above.

### CMS.3 Rendering

- `packages/renderer`: recursive block-tree schema, props
  migration/validation through the block registry, component resolution
  through the active theme, per-site design-token CSS override injection;
- `apps/cms-renderer`: multi-tenant Next.js app resolving the site from the
  request's Host header (custom domain, then slug-as-subdomain), loading
  published content, and rendering it.

### CMS.4 Content authoring

- MVP: a seed script (`tooling/scripts/seed-cms-demo.js`) creates demo
  content directly through `packages/db`.
- Superseded by CMS.5 below: `apps/cms-admin` now provides real
  login-gated authoring instead of the seed script being the only path.

### CMS.5 Admin UI (`apps/cms-admin`, added 2026-08-29)

- Login/logout: Server Actions, Drizzle-backed sessions
  (`createDrizzleSessionStore`), native Next `cookies()` API (not
  `packages/auth`'s header-string cookie builder, which targets a future
  raw-HTTP `apps/api`), an auth-gated `(app)` route group layout.
- Sites: list (the actor's first active organization membership — no org
  switcher yet), create (auto-installs `openforge-theme.default`, the only
  theme that exists), overview (per-site content list). First real caller
  of `packages/auth`'s `assertOrgMembership`/`assertSiteAccess` — denied
  cross-tenant access 404s rather than 403s, so it doesn't leak whether the
  resource exists.
- Content: list/create (title, slug, type, empty tree, draft status), and
  the actual point of this app — a recursive block-tree editor
  (`BlockList`/`BlockPropsForm`/`ContentEditor`) with add/remove/reorder
  per block, a props form generated from each block's `editableFields`,
  and nested slots scoped to each slot's `acceptedTypes`. Save calls a
  Server Action directly as an async function (payload is a tree, not
  `FormData`) that authorizes, then delegates to
  `src/lib/content-tree-ops.js`: recursively migrate/validate every node
  through the block registry, reassemble slots (`migrateInstance` drops
  them), and run the result through `packages/renderer`'s
  `parseContentTree` before writing.
- Deferred, explicitly: user registration UI (users stay seed-script-only),
  media/asset upload (image blocks take a raw URL), theme switching (only
  one theme exists), an org switcher/org-creation UI, menus UI,
  `content_revisions` browsing/restore, authenticated CRUD through
  `apps/api` (still empty — Phase 0.6; the admin UI writes directly
  through `packages/db` instead), custom-domain SSL automation,
  multi-language content, a theme/template marketplace, and a production
  Dockerfile for `apps/cms-admin` (only `apps/cms-renderer` has one).

### CMS.6 Redesign, Elementor-style block library, WordPress-style admin
    sections (`apps/cms-admin`/`apps/cms-renderer`, added 2026-08-29)

- Full visual redesign of `apps/cms-admin`: OKLCH product-register design
  system, responsive app shell (collapsible sidebar, off-canvas below
  900px), native HTML5 drag-and-drop block reordering (keyboard ↑/↓ kept
  as fallback), a starter-template picker for new content, and a per-site
  Appearance page overriding design-token colors through
  `theme_installations.config`.
- `select` block control (`options: [{value, label}]`), and 14 new blocks
  in `packages/cms-blocks` — Heading, Button, Spacer, Divider, Icon Box,
  Alert, Video, Testimonial, Pricing, Team Member, plus two
  container/item slot pairs (Stats Row+Stat, Accordion+FAQ Item) — 20
  official blocks total, up from 6.
- A real stylesheet for `apps/cms-renderer` (`app/blocks.css`): found the
  app had none at all, so every rendered CMS site was unstyled and the
  Appearance page's overrides changed variable values nothing visually
  consumed. Added rules for all 20 blocks and the theme templates, built
  on the already-injected `--of-*` custom properties.
- A site-scoped nested layout (`sites/[siteId]/layout.jsx`) replacing
  duplicated per-page site-fetch/authorization checks, with a persistent
  sub-nav (Overview/Appearance/Menus/Settings) and a "View site ↗" button
  linking to the real public URL.
- Menus (`sites/[siteId]/menus`): create, add items, drag-reorder — the
  `menus`/`menu_items` tables, migrated since CMS.1 but unused until now.
  Item nesting (`parentId`) stays flat/unused, explicitly deferred.
- Team (`/team`, top-level nav — `organization_members` is org-scoped,
  not site-scoped, so this doesn't force a mismatched per-site Users
  page): list members, add an existing account by email, change role,
  remove — gated to owner/admin via `packages/auth`'s `assertRole`, its
  first real caller.
- Settings (`sites/[siteId]/settings`): edit form over the sites table's
  own fields. The site-overview page becomes a real per-site dashboard —
  a stats row (pages, posts, published, draft) plus quick links to
  Appearance/Menus/Settings.
- 11 more blocks, added the same day after the user asked for
  shadcn/MUI/ReactBits components: Badge, Card, Rating, Progress, Banner,
  plus three more container/item slot pairs (Logo Cloud+Logo Item,
  Timeline+Timeline Step, Avatar Group+Avatar Item) — 31 official blocks
  total. Reimplemented natively on the existing `--of-*` token CSS rather
  than pulling in the real packages, since those use three incompatible
  styling systems (Tailwind+Radix, Emotion, Tailwind+Framer Motion) not
  present in this codebase and some need client hydration this
  server-rendered block tree doesn't support; MIT licensing was
  confirmed not to be the actual blocker.
- Deferred, explicitly (supersedes the CMS.5 deferred list above where it
  overlaps): user registration UI, media/asset upload, multi-theme
  *package* switching (vs. per-site token overrides, which exist), an org
  switcher/org-creation UI, menu item nesting, `content_revisions`
  browsing/restore, authenticated CRUD through `apps/api`, custom-domain
  SSL automation, multi-language content, a theme/template marketplace,
  and a production Dockerfile for `apps/cms-admin`.
- 7 more blocks, added the same day once the user accepted adding
  Tailwind CSS as a real dependency: Spotlight Card, Gradient Heading,
  Marquee Text, Feature List, Data Table, plus a Carousel+Carousel Slide
  slot pair (CSS scroll-snap, no JS library) — 38 official blocks total.
  `tailwindcss`/`@tailwindcss/postcss` are devDependencies of
  `apps/cms-renderer` only (the only app that renders live block
  components); Preflight is excluded so it coexists with `blocks.css`'s
  own reset rather than fighting it, and an `@source` directive reaches
  across the workspace boundary into `packages/cms-blocks`.

### CMS.7 Single-user product shape + live-canvas drag-and-drop editor
    (2026-09-04)

User pushback: "its nothing like wordpress." Two real problems, not a
reskin — (1) the admin UI was multi-tenant SaaS shaped when the actual
need is one person running it locally or deployed; (2) the editor was a
flat block-list-plus-form, never showing the rendered page while editing
it, which is the real reason it didn't feel like WordPress/Elementor.

- Removed the Team/organization surface from the product entirely
  (`organizations`/`organization_members` and `packages/auth`'s org-scoped
  authorization stay untouched underneath — no destructive migration, the
  UI just never exposes "organization" as a concept). New
  `tooling/scripts/create-user.js` provisions a fresh install's one user
  (+ a personal organization behind the scenes), idempotent.
- `AppShell.jsx` rebuilt into a WordPress-style grouped left sidebar
  (collapsible groups, pill active state, a site switcher in the header),
  matching a visual reference the user pointed to in a sibling local
  project. Replaces the old icon-rail sidebar and the separate
  `SiteTabNav.jsx` tab strip.
- A real live-canvas editor. `packages/renderer`'s `createRenderer()`
  gained an optional `wrapNode(element, path, migrated)` hook (every
  existing caller, including `apps/cms-renderer` in production, passes
  none — behavior there is unchanged, proven by the existing test suite
  passing unmodified). A new `apps/cms-admin/app/(canvas)/canvas` route
  lives in its own Next.js root-layout group — Next.js allows only one
  root layout per top-level group, and the canvas needed to load zero of
  the admin app's own CSS — renders the exact same renderer/theme/blocks
  pipeline production uses, driven by `postMessage` instead of a database
  query. `blocks.css` moved into `packages/cms-blocks` (new
  `"./blocks.css"` export) so both apps import the same file.
  `ContentEditor.jsx` gained a Canvas/Layers toggle (Canvas is now
  default; Layers/`BlockList.jsx` stays as the non-visual fallback for
  deep slot nesting). New `CanvasEditor.jsx` is the 3-pane view — palette,
  canvas iframe, and `BlockPropsForm.jsx` reused unmodified as the
  inspector.
- Native drag-and-drop directly on the canvas for reordering top-level
  blocks (nested slot reordering stays Layers-view-only, explicitly
  scoped out). Visual feedback uses a CSS attribute selector targeting
  each wrapper's child element, since wrapNode's wrappers are
  `display:contents` (preserving CSS adjacency like `.of-block +
  .of-block` across them) and generate no box of their own to style.
- Two real bugs found via live browser testing, not caught by reasoning
  alone: a postMessage race (the iframe can load and run before the
  parent has hydrated its listener — fixed with a retry-until-
  acknowledged handshake instead of a single post-on-load), and a false
  alarm (Playwright couldn't simulate the native drag gesture in headless
  Chromium — confirmed via manually dispatched DragEvents that the actual
  handler logic was correct and the reordered tree persisted to Postgres
  correctly).
- Deferred, explicitly: drag-to-insert directly from the canvas palette
  (cross-iframe native-drag reliability wasn't verifiable — inserting
  still works via a click, then drag-to-reorder into position), nested-
  slot drag reorder on the canvas (Layers view only).

Note: between CMS.7 above and CMS.8 below, site content storage moved
from database JSON to real, on-disk Next.js project files (git-backed
workspaces, compiled through the same AST pipeline as the static
editor), and the admin UI had a WordPress-familiar nav/theme rebuild, a
real Media Library, a Users > Add New flow, an icon pass, and a merged
mobile topbar. That work landed on `main` (2026-09-04 through
2026-09-07) but does not yet have its own plan/progress entry — see
`progress.md`'s "Current handoff" for the flag. CMS.8 below assumes
file-backed sites are already in place.

### CMS.8 Component library, deeper block editor, preview/export/GitHub
    push (2026-09-07 to 2026-09-08)

- A new workspace package, `packages/component-library`
  (`@openforge/component-library`): a static, portable catalog of 47
  self-contained React component variants across seven categories (nav,
  footer, hero, blog, product, grid, custom), harvested and generalized
  from real reference projects on disk, validated by a schema + registry
  + test suite mirroring `@openforge/blocks`. Intentionally a static,
  in-repo catalog for now — a later service may read from (or replace)
  a package shaped like this one. Declared as an `apps/cms-admin`
  dependency with initial `LibraryPalette` wiring into the canvas
  underway; treat that wiring as unverified until it has its own tests
  and is committed.
- Fixed the root cause of "adding a block doesn't work": 27 of the 38
  official `packages/cms-blocks` blocks had `defaultProps` that failed
  their own required-field validation, and `apps/cms-admin`'s `/canvas`
  route wrapped the entire block tree in one `try`/`catch`, so any one
  invalid block blanked the whole canvas. Fixed both — every block now
  defaults its required fields to real placeholder content, and
  `/canvas` renders each top-level block in its own `try`/`catch`.
- Deepened the live-canvas block editor toward Elementor-depth editing:
  a universal per-block style/className override that round-trips
  through the site's real source file (new nested-object support in
  `packages/compiler`'s `set-jsx-attribute` operation and
  `apps/cms-admin`'s source-tree parser) and renders identically in the
  admin canvas and production `apps/cms-renderer`; a real Content/Style/
  Advanced inspector (`BlockPropsForm.jsx`); block duplication wired to
  the compiler's existing `duplicate-jsx` operation; a Desktop/Tablet/
  Mobile device-preview toggle; a visible on-canvas selection overlay
  (outline, label, drag/remove toolbar); a redesigned searchable,
  categorized element palette; and real multi-step undo/redo
  implemented as whole-file source-snapshot restore (compiler operations
  don't yet produce reliable inverses). Fixed a broken Remove button
  (wrong button class for a text label) and laggy/lossy inspector edits
  (no local state, out-of-order server responses) along the way, plus
  four ambiguous/generic palette icons (Button, Badge, Spacer, Carousel
  Slide).
- Added site preview, project export, and GitHub push, none requiring a
  public URL or separate hosting service: a chrome-free
  `/preview/[siteId]` route reusing the same block-tree renderer as the
  live canvas and `apps/cms-renderer`; a working Export button on the
  Tools page streaming a real `.tar.gz` of a site's on-disk Next.js
  project via the existing `WorkspaceManager.export()`; and a GitHub
  connection in Settings using a personal-access-token flow (verified
  against the GitHub API before saving, not an OAuth App, since this
  self-hosted app has no public callback URL) with the token encrypted
  at rest via `@openforge/integration-security`'s secret vault (new
  `secrets` table) and pushed via a one-off git `http.extraheader` never
  written to `.git/config` (new `site_git_connections` table). Added
  migration `0002_watery_thunderbolts.sql` (purely additive). Fixed a
  raw Postgres-error 500 on a malformed `siteId` route param (new
  `isUuid()` guard) with a matching custom not-found page for the
  preview route group.
- Deferred, explicitly: verifying `0002_watery_thunderbolts.sql` against
  a live dev database in this pass, a real push against a live
  github.com repository, and completing/verifying the component-
  library's canvas-palette wiring (in progress, uncommitted, as of
  2026-09-08).

CMS exit:

- a created site's page renders correctly end to end, from a cold local
  infrastructure start through a real HTTP request, without code editing;
- unknown-block, prop-validation-failure, and cross-tenant-access-denial
  cases are all rejected with stable error codes and covered by tests;
- the static-source visual editor (Phases 1–4) continues to work unchanged;
- content authored through `apps/cms-admin`'s editor and content rendered
  by `apps/cms-renderer` agree on the same data — verified live, not just
  by each app's own isolated tests.

## Phase 1 — Compatible Next.js project model

Goal: a JavaScript Next.js starter can be opened, edited in code, previewed,
exported and restored.

### 1.1 Compatibility specification and fixtures

- publish the exact supported Next.js App Router source profile;
- define compatibility levels: supported, partially supported, and code-only;
- build fixtures for JavaScript/JSX, server/client components, Tailwind, CSS
  Modules, nested routes, manual edits, and unsafe dynamic patterns;
- define preservation guarantees for unsupported code.

### 1.2 Compiler read pipeline

- parse with Babel-compatible tooling;
- normalize paths and reject traversal;
- build stable component/node mappings and dependency indexes;
- emit compatibility diagnostics with confidence and source locations;
- ensure derived indexes can be rebuilt.

### 1.3 Compiler write pipeline

- define versioned editor operation schemas;
- implement minimal-diff AST printing and import management;
- add temporary-workspace application, format, lint and validation stages;
- implement inverse operations where safe;
- reject ambiguous or low-confidence writes;
- produce file diffs and semantic operation summaries.

### 1.4 Official JavaScript starter

- create a normal standalone Next.js JavaScript project;
- support Tailwind and CSS Modules within the approved profile;
- include design-token integration without runtime dependence on OpenForge;
- validate normal install, dev and production build outside OpenForge.

### 1.5 Project workspace lifecycle

- create/import a project into an isolated workspace;
- index files incrementally;
- journal revisions and autosave workspace state;
- create and restore snapshots;
- export a complete source archive;
- implement cleanup, quotas and recovery.

### 1.6 Embedded code workspace

- add file tree, Monaco-compatible code editor, formatting and diagnostics;
- show exact changed files and diffs;
- define save states and external-change boundaries;
- preserve code-only files without visual rewrites.

### 1.7 Secure preview runtime

- allocate disposable preview sessions on a separate origin;
- enforce iframe sandbox, CSP, origin-checked schema-validated messages;
- strip development-only selection metadata from production output;
- apply CPU, memory, time, disk and egress limits;
- collect logs/errors without leaking credentials.

Phase 1 exit:

- the official starter round-trips through import, manual edit, preview, export
  and snapshot recovery;
- unsupported fixture code remains intact;
- preview isolation and path-safety tests pass.

## Phase 2 — Visual editor MVP

Goal: users can build a complete static landing page without direct code editing.

### 2.1 Editor state and operation protocol

- implement revision-aware selection, operation dispatch and optimistic state;
- journal validated operations;
- implement undo/redo with inverse operations and snapshot fallback;
- handle stale revisions and external Git boundaries.

### 2.2 Editor shell

- top application bar;
- pages/layers/blocks/assets navigation;
- central responsive canvas;
- context-sensitive inspector;
- problems/logs/diff/activity panel;
- command palette and keyboard navigation.

### 2.3 Canvas mapping and selection

- inject development-only source metadata;
- render hover, selected, parent, component, slot and invalid-drop states;
- provide non-pointer selection paths;
- keep overlays from obscuring content.

### 2.4 Official block registry

- define block schema, props, editable fields, slots, dependencies, defaults,
  accessibility notes and migrations;
- implement at least ten official blocks sufficient for a landing page;
- add registry search, preview and insertion;
- add block golden fixtures and independent starter builds.

### 2.5 Core visual operations

- insert, remove, move, wrap/unwrap and duplicate;
- edit text and links;
- set/remove props and token-aware classes;
- replace assets;
- add/rename/delete pages and update metadata;
- expose exact source diff for every operation.

### 2.6 Inspector and design tokens

- content, layout, spacing, size, typography, background, border and responsive controls;
- distinguish inherited, global token, semantic token, local and breakpoint values;
- show affected usage before global token changes;
- enforce valid units and safe values.

### 2.7 Responsive editing

- viewport presets for mobile, tablet, laptop and desktop;
- breakpoint-specific overrides with inheritance/reset;
- overflow and responsive diagnostics;
- narrow-screen review mode for the desktop-first editor.

### 2.8 Asset MVP

- upload with size/type validation;
- metadata, alt text, duplicate detection and usage references;
- signed storage access;
- bounded Python analysis and derivative generation;
- unused-asset reporting.

### 2.9 Accessibility and recovery

- keyboard-operable major workflows and visible focus;
- automated accessibility diagnostics for official blocks;
- reduced-motion and high-contrast checks;
- restore snapshot, discard operation, reset from source and safe mode.

Phase 2 exit:

- a keyboard-capable user can create and recover a static landing page from at
  least ten official blocks;
- reload preserves the source result;
- each visual operation has a readable diff and golden/inverse coverage.

## Phase 3 — GitHub and Vercel

Goal: a created site can be committed to GitHub and preview-deployed to Vercel.

### 3.1 Integration security foundation

- encrypted connection/secret references;
- least-privilege OAuth/GitHub App scopes;
- webhook signature verification and delivery deduplication;
- idempotency for repository creation/import and deployments;
- audit events and log redaction.

### 3.2 GitHub authentication and connection

- GitHub login;
- installation selection;
- repository creation and connection;
- branch selection and protected-branch detection;
- compatibility inspection in an isolated workspace.

### 3.3 Git synchronization

- ahead/behind status;
- diff/check/commit/push workflow with explicit target confirmation;
- protected-branch feature branch and pull request flow;
- pull/fetch/merge in isolation;
- supported conflict display and code-only fallback.

### 3.4 Vercel connection

- OAuth/integration connection;
- team and project selection/creation;
- development/preview/production environment names;
- secret values write-only or reveal-limited.

### 3.5 Deployment lifecycle

- pre-deployment validation and secret scan;
- preview deployment job;
- status/log collection and safe error UX;
- preview URL;
- explicit, authorized production promotion.

Phase 3 exit:

- a project can be created or connected, committed, pushed and preview-deployed;
- retries do not duplicate external resources;
- protected branch, webhook, cross-tenant and redaction tests pass.

## Phase 4 — Optional BYOK AI

Goal: provider-assisted changes are optional, reviewable and validated.

### 4.1 Provider-neutral contracts

- provider/model capability schema;
- normalized streaming, tool, structured-output, usage and error interfaces;
- explicit provider selection and opt-in fallback policy;
- fake provider for deterministic tests.

### 4.2 Credential lifecycle

- organization, project, environment and session-only credential modes;
- envelope encryption, rotation and deletion;
- decrypt only in trusted server/worker contexts;
- never return stored secret values.

### 4.3 Context and policy controls

- least-context selection;
- `.openforgeignore`;
- included-file manifest;
- secret detection/redaction;
- retention and deletion policies;
- administrator provider/capability restrictions.

### 4.4 Initial adapters

- OpenAI;
- Anthropic Claude;
- Google Gemini;
- current official API contract tests and capability discovery where available.

### 4.5 Proposal pipeline

- structured intent/patch schema;
- temporary workspace and path safety;
- format, lint, test/build, security and compatibility validation;
- file-selective diff approval;
- apply only after explicit user action;
- AI run and approval audit records.

### 4.6 Official skills

- page/section proposal;
- accessibility review;
- responsive review;
- SEO metadata/copy assistance;
- clear instructions, context, permissions, schemas, fixtures and evaluations.

Phase 4 exit:

- at least one configured provider can propose a valid change that remains
  unapplied until approval;
- the editor remains fully useful with all AI configuration absent;
- prompt/context leakage and invalid-patch tests pass.

## Phase 5 — Plugin and skills SDK

Goal: an external developer can publish a working third-party skill and block.

### 5.1 Versioned extension schemas

- manifest, contribution, capability, compatibility and migration schemas;
- separate read/write permissions;
- usage-scoped secret capabilities;
- human-readable permission report.

### 5.2 SDK public API

- commands, panels, inspector sections, blocks, validators, transformers,
  providers, skills and workflow hooks;
- documented stable exports with no deep imports;
- mock editor context and fixture projects.

### 5.3 Isolated extension host

- browser worker and server isolation profiles;
- message schema validation;
- capability enforcement at every host boundary;
- resource, network and lifecycle limits;
- safe disable/uninstall/recovery.

### 5.4 CLI workflows

- create/doctor/validate/export;
- plugin and skill scaffolding/validation/testing;
- registry validation;
- self-host initialization and migrations.

### 5.5 Curated registry

- Git-backed registry metadata;
- checksums/signatures, licenses, compatibility, permissions and security state;
- automated validation and maintainer review;
- quality levels and block/deprecation process.

### 5.6 Contributor profiles

- public opt-in profiles;
- self-reported human skills with evidence links;
- verification and badges without implying unverified claims are verified.

Phase 5 exit:

- a developer outside the core repository can scaffold, test, publish, install,
  update, disable and uninstall a sample extension;
- sandbox escape and permission-denial suites pass.

## Phase 6 — Production hardening and v1 release

Goal: satisfy reliability, security, performance, accessibility and operational
requirements for a stable release.

### 6.1 Reliability and recovery

- durable retry/dead-letter behavior;
- idempotent external operations;
- backup/restore drills;
- project/snapshot and database migration recovery;
- orphan workspace/artifact cleanup.

### 6.2 Security review

- formal threat models for preview, build, secrets, auth, plugins, AI and webhooks;
- authorization, CSRF, SSRF, XSS, traversal, command injection and archive tests;
- dependency/container scans, SBOM and signed artifacts;
- independent review or audit where feasible.

### 6.3 Performance and scale

- meet editor shell, canvas operation and compiler latency budgets;
- incremental indexing for large repositories;
- queue throughput and backpressure tests;
- asset/preview/build resource limits;
- package-size and browser-performance budgets.

### 6.4 Accessibility completion

- WCAG 2.2 AA audit;
- keyboard and screen-reader workflow tests;
- focus, contrast, status announcement and reduced-motion verification;
- official block accessibility contract.

### 6.5 Observability and operations

- structured logs, traces, metrics and alerting;
- health/readiness and dependency status;
- audit log retention;
- runbooks for queues, storage, database, integrations and incidents.

### 6.6 Release and documentation

- stable public API inventory;
- version/support/deprecation policy;
- migration and upgrade tooling;
- complete self-host, contributor, SDK, security and recovery documentation;
- provenance, changelog and release artifacts.

Phase 6 exit:

- all PRD MVP acceptance criteria pass in a release candidate environment;
- the full stack is reproducibly self-hostable;
- no unresolved critical security/accessibility issues remain.

## Phase 7 — Collaboration after deterministic operations mature

Goal: add review collaboration without weakening source or operation integrity.

### 7.1 Asynchronous collaboration

- comments anchored to files, nodes, operations and deployments;
- review requests and approval state;
- notifications and audit history.

### 7.2 Presence

- project/page/selection presence with privacy controls;
- ephemeral state through Redis;
- graceful degradation without presence.

### 7.3 Operation synchronization

- conflict-free or server-serialized strategy selected through RFC;
- revision reconciliation and offline/reconnect behavior;
- deterministic undo boundaries;
- load, race and recovery tests.

### 7.4 Organization libraries

- private blocks, templates and policy-managed extensions;
- role-aware publishing and versioning.

Phase 7 exit:

- concurrent editing cannot corrupt source or operation history;
- collaboration remains optional and recoverable.

## 5. Cross-phase workstreams

These are tracked inside every phase:

- security and privacy;
- accessibility;
- observability and audit;
- migrations and backward compatibility;
- documentation and examples;
- runtime schemas and stable error codes;
- unit, golden, contract, integration, end-to-end and adversarial tests;
- performance budgets;
- contributor experience and release notes.

## 6. MVP acceptance traceability

| PRD acceptance outcome | Primary phase |
|---|---|
| GitHub auth and JavaScript Next.js project creation | 1 and 3 |
| Add and reorder at least ten official blocks | 2 |
| Persist content and styling edits across reload | 2 |
| Readable source diff for every visual change | 1 and 2 |
| Export runs outside OpenForge | 1 |
| Connect at least one BYOK provider | 4 |
| AI changes require approval and checks | 4 |
| Create/connect GitHub repository and push | 3 |
| Trigger Vercel preview deployment | 3 |
| Third party can scaffold and run a skill | 5 |
| Complete stack runs with Docker Compose | 0, validated in 6 |
| Core packages published under chosen license | 0, 5 and 6 |

## 7. Explicit MVP exclusions

- real-time multiplayer;
- public hosted marketplace;
- billing;
- Figma import;
- WordPress import;
- advanced automatic merge-conflict resolution;
- full mobile editor;
- enterprise SSO;
- Kubernetes operator;
- general native-mobile or multi-framework generation;
- autonomous, unapproved software changes.

## 8. Decisions required before implementation

The following must be resolved in Phase 0 and recorded in RFCs/ADRs where needed:

- npm scope, product/repository name, domain/trademark checks and security contact;
- exact supported Node, pnpm and Python versions;
- authentication/session library and optional self-host password strategy;
- PostgreSQL access layer and migration tool;
- runtime schema-validation library;
- formatter/linter/test stack;
- preview/build isolation technology for local and production profiles;
- secret encryption/KMS abstraction;
- object-storage SDK and signed URL policy;
- editor/code-editor libraries and drag/drop model;
- AST printer/formatter strategy and stable node identity;
- OpenAPI generation approach;
- plugin host isolation model;
- initial official block inventory;
- data retention defaults.

## 9. Definition of done

A task is complete only when:

- acceptance behavior is implemented;
- relevant tests pass;
- security and accessibility impact is addressed;
- public/runtime contracts and migrations are updated;
- documentation is current;
- no secret or private fixture data is included;
- verification evidence is recorded in `progress.md`;
- deferred work is explicitly listed with an owner or phase.
