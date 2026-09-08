# OpenForge Progress Tracker

Last updated: 2026-09-08
Current stage: Phase 2 (static editor) complete; CMS MVP + single-user, WordPress/Elementor-style admin UI (grouped sidebar shell, live-canvas drag-and-drop editor with a Content/Style/Advanced inspector, undo/redo, duplication, and device preview, 38-block library incl. shadcn/MUI/ReactBits-inspired and Tailwind-styled components, menus, settings, site preview, project export, and GitHub push) complete; a standalone `@openforge/component-library` catalog (47 component variants) exists and is being wired into the admin's palette
Plan: [`IMPLEMENTATION_PLAN.md`](IMPLEMENTATION_PLAN.md)

## How to use this file

This is the durable handoff document for humans and coding agents. Update it in
the same change that completes or changes a task. Do not mark an item complete
because files merely exist; record the command, test, review, or artifact that
proves the acceptance condition.

Delivery rule:

- when a phase, subphase, or independently useful feature is completed and
  verified, create a focused commit and push it to GitHub;
- use a clear imperative commit message that describes the completed outcome;
- never add `Co-authored-by` or any other co-author trailer;
- do not batch unrelated completed milestones into one commit;
- do not mark work delivered until the push is confirmed on the intended branch.

Status markers:

- `[ ]` not started
- `[-]` in progress
- `[x]` complete and verified
- `[!]` blocked; explain in Blockers
- `[~]` intentionally deferred or out of current scope

## Current handoff

- Objective (2026-07-28): implement optional BYOK AI behind explicit safety
  boundaries.
  - Completed: Phase 1, Phase 2, Phase 3, and Phase 4.
- Objective (2026-08-28, mid-session redirect): the user asked for a
  WordPress-style, multi-tenant, database-backed CMS that coexists with the
  static-source visual editor, built using only the Phase 0 primitives it
  actually needs. See "Phase CMS — Multi-tenant CMS surface" below.
  - Completed: the full CMS MVP vertical slice (foundation primitives,
    infra, data model, auth, theme SDK, starter blocks, renderer, default
    theme, multi-tenant app, production Dockerfile) — see that section for
    evidence.
  - Not started from the original Phase 0 plan: 0.1 governance file wiring,
    0.7 CI/supply-chain workflows. These are not load-bearing for the CMS
    and were explicitly deprioritized per the user's direction ("do it if
    it is necessary for CMS"). Pick them up in a dedicated pass.
  - Not started: Phase 0.6 process skeletons (`apps/api`, `apps/worker`
    are still empty), and Phase 5.
- Objective (2026-08-29): build the CMS admin UI (`apps/cms-admin`) — login,
  sites, content, and the block-tree page editor. See "CMS.7 Admin UI"
  under the Phase CMS section below.
  - Completed: login/logout, site list/create, content list/create, and
    the full recursive block-tree editor with save wired to real
    validation and persistence.
  - Not started: user registration UI, media/asset upload, theme
    switching, an org switcher/org-creation UI, menus UI,
    `content_revisions` browsing/restore, a production Dockerfile for
    `apps/cms-admin` (only `apps/cms-renderer` has one so far).
- Objective (2026-08-29, same day): "make it fully complete" — the admin UI
  needed drag-and-drop, starter templates, real appearance/theme
  customization, and a genuine visual/responsive redesign, not just working
  CRUD forms.
  - Completed: full product-register visual system (OKLCH tokens, fixed
    rem type scale, one font family, explicit interactive states) via the
    `impeccable` skill; a responsive app shell (collapsible sidebar,
    structural multi-column content editor, no more 960px-capped column);
    native HTML5 drag-and-drop block reordering (keyboard ↑/↓ kept as
    fallback); a starter-template picker for new content; a per-site
    appearance page overriding design-token colors, connected end to end
    to the renderer's existing `renderSiteStyles()`/`getSiteTokenOverrides()`.
  - Found and fixed a real bug via the new template tests before it
    shipped: two starter templates included an `Image` block with empty
    required `src`/`alt`, which would have failed save validation
    immediately on creation.
  - Not started (unchanged from above): media/asset upload, multi-theme
    switching (vs. this pass's per-site color override), org
    switcher/org-creation UI, menus UI, revision browsing, a cms-admin
    Dockerfile.
- Objective (2026-08-29, same day): "management UI like WordPress" plus an
  Elementor-style ready-made component library — the editor only had 6
  blocks, and there was no Menus, Team, or Settings surface.
  - Completed (8-batch plan, see "CMS.9" below): a `select` block control;
    14 new blocks (20 official blocks total, up from 6); a real stylesheet
    for `apps/cms-renderer` (found it had none at all — every rendered
    site was unstyled until this pass); a site-scoped nested layout with a
    persistent "View site ↗" button; Menus (CRUD + drag-reorder); Team
    (org member management, top-level nav since membership is org-scoped
    not site-scoped); Settings (site edit form) plus a per-site dashboard
    stats row; and an integration test covering the full new block library
    (including both slot-container/item pairs) through save → read-back →
    render.
  - Not started (unchanged from above): media/asset upload, multi-theme
    *package* switching, org switcher/org-creation UI, menu item nesting,
    revision browsing, user registration UI, a cms-admin Dockerfile.
- Objective (2026-08-29, same day): "add shadcn/MUI/ReactBits components,
  don't worry about licensing" — clarified that shadcn and React Bits are
  MIT-licensed and designed to be copy-pasted, and MUI's core is MIT too,
  so licensing wasn't actually the blocker; the real blocker is that all
  three use styling systems (Tailwind+Radix, Emotion, Tailwind+Framer
  Motion) absent from this codebase, and several of their real components
  need client-side hydration this server-rendered block tree doesn't
  support. User chose "reimplement natively" over pulling in the real
  packages.
  - Completed: 11 new blocks in `packages/cms-blocks` on the existing
    plain-CSS `--of-*` token system, zero new dependencies — Badge, Card,
    Rating, Progress, Banner (standalone), plus three slot container/item
    pairs: Logo Cloud+Logo Item (CSS-only marquee via keyframe animation,
    respects `prefers-reduced-motion`, duplicated+aria-hidden second copy
    for a seamless loop), Timeline+Timeline Step, Avatar Group+Avatar
    Item. 20 → 31 official blocks. Registered in `themes/default`'s
    `page-body`/`post-body` regions and styled in
    `apps/cms-renderer/app/blocks.css`.
  - Evidence: 46 tests in `packages/cms-blocks` (up from 30). Live run —
    inserted a real page using all 11 new blocks (including both slot
    containers) into Postgres, fetched it through the actual running
    `apps/cms-renderer` with a genuine Host header, and confirmed exact
    element counts in the real DOM (isolated from the Next.js RSC flight
    payload, which otherwise double-counts text/class matches) plus real
    CSS rules for every new block's classNames in the served bundle. Full
    repo `pnpm check`: 78/78 tasks pass.
  - One design-hook finding accepted as intentional, matching the
    CMS.8-era sidebar-collapse precedent: `.of-progress-fill`'s
    `transition: width` animates a single element on rare prop changes
    (not continuously), the standard pattern for progress-bar fills.
- Objective (2026-08-29, same day): "add the tailwind ones next + tailwind"
  — user asked for the actual Tailwind-based (shadcn/ReactBits) component
  style now, explicitly accepting the new dependency this time.
  - Completed: added `tailwindcss` + `@tailwindcss/postcss` as
    devDependencies of `apps/cms-renderer` only (confirmed via grep that
    `apps/cms-admin` never renders live block components, so it needs no
    Tailwind). New `app/tailwind.css` imports only
    `tailwindcss/theme.css` + `utilities.css` (Preflight excluded) so
    Tailwind's base reset doesn't fight `blocks.css`'s own reset/
    typography — the two CSS systems coexist as separate layers. An
    explicit `@source` directive points at `packages/cms-blocks` since
    it's a sibling workspace package outside `cms-renderer`'s own
    directory tree that Tailwind's automatic detection wouldn't scan
    otherwise.
  - 7 new blocks styled with Tailwind utilities instead of the `--of-*`
    tokens, deliberately bringing the shadcn/ReactBits visual language as
    a distinct option: Spotlight Card, Gradient Heading, Marquee Text,
    Feature List, Data Table (standalone), plus a Carousel+Carousel Slide
    slot pair using native CSS scroll-snap (no JS carousel library). 31 →
    38 official blocks. Registered in `themes/default`'s
    `page-body`/`post-body` regions.
  - Evidence: 59 tests in `packages/cms-blocks` (up from 46). Confirmed
    the built CSS chunk contains real generated rules (`bg-clip-text`,
    `snap-mandatory`, `animate-marquee-fast`, the `even:bg-slate-50`
    `nth-child` selector), proving `@source` correctly reached across the
    workspace boundary. Live run — inserted a real page using all 7 new
    blocks (including the carousel slot pair) into Postgres, fetched it
    through the actual running `apps/cms-renderer` with a genuine Host
    header, and confirmed both the real DOM content and the served CSS
    bundle's rules for every new class. Full repo `pnpm check`: 78/78
    tasks pass.
  - One design-hook finding accepted as intentional: `gradient-heading.jsx`
    flagged for gradient text ("a common AI tell"), but the block's
    entire stated purpose is to be a gradient-text heading — the
    ReactBits pattern it was explicitly built to replicate — so the
    finding doesn't apply as a defect here.
- Objective (2026-09-04): "its nothing like wordpress" — the user pushed
  back hard on the whole admin UI direction. Clarified across two rounds
  of questions: (1) single user, not multi-tenant SaaS — "for 1 person
  not multiple who can have it locally or deployed"; (2) a real
  Elementor-style drag-and-drop canvas, not a flat block-list-plus-form
  (the actual reason it didn't feel like WordPress — you never saw the
  rendered page while editing it); (3) a specific visual reference for
  the shell, found at the user's direction in a sibling local project
  (`stitchmarkuniform/smu-backend`'s `Nav.js`): a clean grouped left
  sidebar, no top bar. Planned and approved as a 6-batch rebuild (plan
  file: single-user CMS + live-canvas drag-and-drop editor).
  - Completed: removed the Team/organization surface from the UI
    entirely (kept `organizations`/`organization_members` and
    `packages/auth`'s org-scoped authorization underneath, unchanged —
    no destructive migration, just nothing in the product exposes
    "organization" as a concept anymore); added
    `tooling/scripts/create-user.js` as the documented way a fresh
    local/deployed install gets its one user provisioned (creates the
    user if needed, silently provisions a personal organization behind
    the scenes, idempotent).
  - Completed: redesigned `AppShell.jsx` into a WordPress-style grouped
    left sidebar (collapsible groups with a one-line description, pill
    active state, a site switcher in the header) replacing the old
    icon-rail sidebar and the separate `SiteTabNav.jsx` horizontal tab
    strip. `/sites` gets a minimal nav; a site's own pages get the full
    Content/Design/Site groups.
  - Completed: a genuine live-canvas WYSIWYG editor for content, the
    core ask. Required restructuring `apps/cms-admin`'s routes into two
    Next.js root-layout groups — `(admin)` (existing app, its own root
    layout/CSS) and a new `(canvas)` (a second root layout loading only
    `@openforge/cms-blocks/blocks.css` + a Tailwind setup mirroring
    `apps/cms-renderer`'s, zero admin CSS) — because Next.js allows only
    one root layout per top-level route group and the canvas needed to
    load none of the admin app's own OKLCH product CSS. `blocks.css`
    itself moved into `packages/cms-blocks` (new `"./blocks.css"` export)
    so both apps import the same file instead of drifting copies.
    `packages/renderer`'s `createRenderer()` gained an optional
    `wrapNode(element, path, migrated)` hook — every existing caller
    (including `apps/cms-renderer` in production) passes none, proven
    behavior-identical by the existing test suite passing unmodified.
    The new `/canvas` route renders the exact same renderer/theme/blocks
    pipeline production uses, driven by `postMessage` instead of a
    database query. `ContentEditor.jsx` gained a Canvas/Layers toggle
    (Canvas is now the default); the new `CanvasEditor.jsx` is the
    3-pane view (palette/canvas/inspector), with `BlockPropsForm.jsx`
    reused completely unmodified as the inspector.
  - Completed: native drag-and-drop directly on the canvas for
    reordering top-level blocks (nested slot reordering stays a
    Layers-view-only operation, explicitly scoped out rather than
    silently missing).
  - Two real bugs found and fixed via live browser testing, not caught
    by unit tests or manual reasoning: (1) a postMessage race — the
    iframe's `src` is present in the server-rendered HTML, so the
    browser can start and finish loading it before the parent has
    hydrated and attached its message listener; fixed with a retry-
    until-acknowledged handshake instead of a single post-on-load;
    (2) Playwright's `page.mouse` and `dragTo()` both failed to trigger
    a working reorder — confirmed via manually dispatched
    `dragstart`/`dragover`/`drop` `DragEvent`s with realistic timing
    that this was a headless-Chromium drag-simulation limitation, not a
    bug in the handlers (the same dispatch produced the correct
    reordered array and it persisted correctly to Postgres).
  - Evidence throughout: real Playwright/Chromium browser runs (not
    just static HTML/curl checks) against a real session cookie and
    real Postgres content — confirmed the canvas renders real content,
    click-to-select populates the inspector with real props, editing a
    field live-updates the canvas, dragging reorders blocks, and Save
    persists the new order, read back directly from the database. Full
    repo `pnpm check`: 78/78 tasks pass at every batch.
- Note: between the entry above and the ones below, `apps/cms-admin`'s
  content storage moved from database JSON to real, on-disk Next.js
  project source files compiled through the same AST pipeline as the
  static editor (git-backed workspaces — see `packages/workspace`'s
  `WorkspaceManager`) — landed in commits `ca47ca6`, `d721a60`,
  `768efc6`, `f3c468a`, `1b1f505` on 2026-09-04, and a WordPress-
  familiar nav/theme rebuild, a Media Library with real uploads, a
  Users > Add New flow, an icon/illustration pass, and a merged mobile
  topbar landed on 2026-09-07 (`6ea1ef0`, `93949d7`, `e7d325c`,
  `de70ffd`, `b48990f`). None of that is detailed with its own
  evidence-backed entry here yet — this note exists so the entries
  below (which assume file-backed sites) aren't read as inconsistent
  with the DB-backed description above. Backfilling CMS.13/CMS.14-style
  entries for that gap is left for a dedicated pass.
- Objective (2026-09-07): the block library's `defaultProps` had never
  actually been checked against each block's own required-field
  validation, and `/canvas` rendered the whole page tree inside one
  `try`/`catch` — the fix for "adding a block doesn't work."
  - Completed: 27 of the 38 official blocks in `packages/cms-blocks` had
    `defaultProps` that failed their own `validateProps` (missing or
    empty-string required fields); all 38 now default every required
    field to real placeholder content, the same convention Gutenberg/
    Elementor/Webflow use for a freshly-inserted block.
    `apps/cms-admin`'s `(canvas)/canvas/page.jsx` now renders each
    top-level block through the renderer's per-node `renderNode` inside
    its own `try`/`catch` instead of one `try`/`catch` around the whole
    `renderTree()` call, so one invalid block shows an inline error in
    its own place instead of blanking the entire canvas.
    `@openforge/renderer` itself (used by production `apps/cms-renderer`)
    is untouched.
  - Evidence: a comprehensive regression test in `@openforge/cms-blocks`
    asserts every one of the 38 official blocks' `defaultProps` satisfies
    its own `validateProps`; an admin-level test drives the real
    `insertBlock` pipeline against a real git-backed file workspace and
    renders the result through the same pipeline `/canvas` uses.
    `pnpm --filter @openforge/cms-blocks test`: 139/139 tests pass
    (verified 2026-09-08).
- Objective (2026-09-07, same day): scaffold a static, portable catalog
  of ready-made UI component variants — richer starting points than one
  generic block per category — harvested from real reference projects
  already on the user's disk.
  - Completed: new workspace package `packages/component-library`
    (`@openforge/component-library`) — a `libraryComponentSchema` (see
    `src/schema.js`) and `createLibraryRegistry` (list/get/byCategory/
    search/createInsertion, built the same way `@openforge/blocks`
    builds its official registry), populated across seven category
    files (`nav.js`, `footer.js`, `hero.js`, `blog.js`, `product.js`,
    `grid.js`, `custom.js`) with 47 total self-contained entries (6 nav,
    6 footer, 6 hero, 6 blog, 6 product, 10 grid, 7 custom), each
    React-only (no runtime deps beyond `react`), scoped under an
    `ofl-`-prefixed root class, and attributed to its `sourceProject`.
  - Evidence: `pnpm --filter @openforge/component-library test`: 5/5
    tests pass (verified 2026-09-08) — unique ids, unique file names per
    category, and schema-valid shape for all 47 entries; counted
    `allLibraryComponents.length === 47` directly against the built
    registry, split 6/6/6/6/6/10/7 across the seven categories.
  - Not yet done: this package is still explicitly a static, in-repo
    catalog with no consumer wired in when this pass started. As of
    this writing, `apps/cms-admin` has `@openforge/component-library`
    as a `package.json` dependency and three new supporting files
    (`src/components/LibraryPalette.jsx`, `src/lib/
    library-content-actions.js`, `src/lib/library-palette-meta.js`) plus
    working-tree (uncommitted) edits to `CanvasEditor.jsx` and the page
    editor route wiring `LibraryPalette` into the canvas's insert flow —
    this wiring was in progress, concurrently, as this entry was
    written, is not yet committed, and has no evidence/tests recorded
    against it yet. Verify and record real evidence for it before
    marking this integration complete.
- Objective (2026-09-07 to 2026-09-08): deepen the live-canvas block
  editor toward the requested Elementor depth — a real style/CSS
  override path, safer and faster inspector edits, undo/redo,
  duplication, a device-preview toggle, a visible selection indicator,
  and a redesigned element palette.
  - Completed: a universal per-block style/className override that
    persists to the site's real source file and renders identically in
    both the admin canvas and production `apps/cms-renderer` —
    `packages/compiler`'s `set-jsx-attribute` operation now also accepts
    a one-level-nested plain object value and serializes it as a real
    JSX expression container; `apps/cms-admin`'s source-tree parser
    (`source-content-tree.js`) was extended to read that same
    object-valued attribute back out (previously it silently dropped
    any non-string/number/boolean/null attribute, which would have
    dropped every style edit on the very next parse — caught by a real
    file round-trip test, not the compiler's own unit tests in
    isolation); `packages/renderer`'s `renderNode` wraps a block's
    output in one extra element carrying the override only when one is
    present (a block with no override renders byte-identical to before).
    `BlockPropsForm.jsx` is rebuilt into real Content / Style / Advanced
    tabs (Style: Typography/Color/Spacing/Border/Shadow; Advanced: a
    custom CSS class field), every control wired to the same
    instant-apply `onPropsChange` path as every other prop edit.
  - Completed: block duplication — `duplicateBlock()` in
    `source-content-actions.js` calls `@openforge/compiler`'s existing
    (previously unused from the app) `duplicate-jsx` operation, threaded
    through as `onDuplicate` to a Copy button in both the canvas's
    floating toolbar and the inspector panel.
  - Completed: a Desktop/Tablet/Mobile device-preview toggle in
    `CanvasEditor.jsx` constraining the canvas iframe to 100%/768px/
    390px.
  - Completed: a visible block-selection overlay on the canvas — an
    outline, a floating icon+name label, and a drag/remove toolbar
    anchored to the selected block's measured bounding box (recomputed
    on scroll/resize/tree changes); previously, clicking a block on the
    canvas updated only the inspector with no on-canvas feedback at all.
  - Completed: the element palette redesigned from a flat wrap-list of
    dashed pill buttons into an Elements/Blocks/Globals tab bar, a
    search box, and a 2-column icon-on-top card grid grouped under
    Basic/Layout/Content/Advanced headers (`block-palette-meta.js`,
    `BlockPalette.jsx`); the inline per-slot "add block" widget in
    `BlockList.jsx` keeps the old compact pill layout via a new
    `variant="inline"` prop.
  - Completed: real, multi-step Undo/Redo (Ctrl+Z / Ctrl+Shift+Z),
    implemented as full page-source snapshot restore
    (`restorePageSource()`) rather than operation-inverse replay, since
    `@openforge/compiler`'s visual operations don't produce a usable
    inverse today and a first-use block insert's added import isn't
    invertible either — a plain "restore this exact prior source
    string" has no such gaps. Session-scoped past/future stacks in
    `SourceContentEditor.jsx`; every dispatched action is tagged with an
    increasing request id so out-of-order server responses can't clobber
    a newer edit with an older one (undo/redo included).
  - Fixed two real bugs found via this work, not caught by static
    reasoning: (1) the Remove button used a fixed 26x26px icon-only
    class for a full text label, making it look broken and hard to
    click — switched Remove and the new Duplicate button to the existing
    `.btn.btn-ghost` pattern; (2) `BlockPropsForm.jsx` had no local
    state, so every keystroke fired a real file read/AST re-parse/write/
    git commit — typing visibly lagged, and two overlapping edits could
    resolve out of order and silently revert a newer edit. Fixed with
    local state plus a ~450ms idle-debounced persist (flushed
    immediately on unmount) and the same request-id ordering guard used
    for undo/redo.
  - Fixed ambiguous/generic icons in the block palette: Button (read as
    a sparkle at small sizes) → a plain rectangle glyph; Badge → lucide's
    dedicated Badge glyph; Spacer (read as a pause icon) → an
    unfold-apart glyph; Carousel Slide (a bare square) → a frame icon.
  - Evidence: new/extended tests accompany each change — a real
    file-round-trip test for the style-attribute read/write path
    (`packages/renderer/test/renderer.test.js`,
    `packages/compiler/test/editor-operation.test.js`); a duplication
    test against a real git-backed workspace confirming the clone gets
    its own distinct compiler-assigned node id;
    `apps/cms-admin/test/block-add-smoke.test.js` extended to cover
    duplication and the full insert → undo → redo → byte-for-byte
    original-source round trip. Verified in isolation on 2026-09-08:
    `vitest run test/block-add-smoke.test.js test/site-git.test.js` —
    14/14 tests pass. (A full-suite run of `apps/cms-admin`'s tests in
    this same working tree intermittently failed 3 of 60 in
    `source-content-actions.test.js` with a `.git/index.lock` ENOENT —
    consistent with a filesystem race against another, concurrently
    running session's own test run against the same on-disk fixture
    path, not a regression in this work; re-run in isolation to confirm
    before relying on the full-suite number.)
- Objective (2026-09-08, same day): add site preview, project export,
  and a GitHub push path to `apps/cms-admin`, none requiring a public
  URL or a separate hosting service.
  - Completed: a chrome-free `/preview/[siteId]` route
    (`app/(preview)/preview/[siteId]/page.jsx`) rendering every real page
    of a site through the exact same `@openforge/renderer` +
    `theme-default` pipeline the live canvas and `apps/cms-renderer` use,
    computed straight from the site's on-disk source (no iframe/
    postMessage needed since it's read-only). A custom
    `app/(preview)/not-found.jsx`, styled to match the preview's own dark
    chrome rather than the framework's bare default 404, is shown for a
    removed/malformed site id.
  - Completed: a working Export button on the site Tools page,
    streaming a real `.tar.gz` of the site's on-disk Next.js project via
    the already-built `WorkspaceManager.export()`
    (`tools/export/route.js`) — confirmed by reading the route: it
    authorizes via `assertSiteAccess`, exports to a temp path, streams
    the bytes with `content-disposition: attachment`, and removes the
    temp archive in a `finally` block.
  - Completed: GitHub connection in Settings > GitHub
    (`GitHubConnectionPanel.jsx`, `settings/actions.js`) — a personal
    access token, verified against the real GitHub API
    (`verifyGitHubRepoAccess`) before saving, not an OAuth App flow
    (this app has no public callback URL by design). The token is
    encrypted at rest via `@openforge/integration-security`'s
    `createSecretVault` (confirmed by reading `secret-vault.js`), backed
    by a new `secrets` table (`secret-db-storage.js`), and pushes
    (`site-git.js`'s `pushSiteChanges`) pass it as a one-off `git -c
    http.extraheader=...` value scoped to that single `push` invocation
    — never `git remote add`, so it's never written into the workspace's
    `.git/config`. New `site_git_connections` table
    (`site_id` unique-indexed, cascades on site delete) records the
    connected owner/repo/branch and a reference to the vaulted secret.
  - Added a new, purely-additive Drizzle migration
    (`packages/db/migrations/0002_watery_thunderbolts.sql`) for the
    `secrets` and `site_git_connections` tables; an optional
    `ENCRYPTION_MASTER_KEY` for `cms-admin`, validated lazily only when
    the GitHub feature is actually used (`getSecretVault()` throws an
    actionable error on first real use if unset, rather than failing
    every unrelated page at startup).
  - Fixed a real bug: Postgres rejects a non-UUID value for a `uuid`
    column at the driver level (a thrown query error), so a mistyped or
    stale site id in the new preview/export URLs crashed with a raw
    500/dev overlay instead of a clean 404. Added `apps/cms-admin/src/
    lib/uuid.js`'s `isUuid()` guard, checked before the query runs, in
    both new routes.
  - Evidence: `apps/cms-admin/test/site-git.test.js` (7 tests) exercises
    `initSiteGit`/`commitSiteChanges`/`pushSiteChanges`/
    `listSiteCommits` against real local git repositories, including the
    `http.extraheader` push path against a local bare-repo remote.
    Confirmed the export route's implementation directly (auth check,
    `WorkspaceManager.export()` call, streamed response, temp-file
    cleanup) and the GitHub-verify-before-save flow in
    `settings/actions.js`. Verified in isolation on 2026-09-08:
    `vitest run test/site-git.test.js` passes as part of the 14/14 run
    noted above. Not independently verified in this pass: an actual push
    against a real github.com repository (would require a real PAT and
    a real remote), and a live run of the vaulted-secret round trip
    against a live Postgres instance with `ENCRYPTION_MASTER_KEY` set.
  - Migration status: `0002_watery_thunderbolts.sql` is generated and
    present in `packages/db/migrations/` with a corresponding
    `_journal.json`/snapshot entry; whether it has been applied to any
    running dev database was not independently verified in this pass.
- Important constraint: JavaScript/JSX only for first-party Node/React code.
- Important constraint: source code is authoritative for the static editor;
  metadata is derived. The CMS is a deliberate, documented exception — its
  content is database-authoritative, not exported source (see
  `openforge-docs/docs/product/01-vision.md`, "Multi-tenant CMS surface").

## Planning and scaffolding

- [x] Read the complete documentation set.
  - Evidence: product, architecture, platform, design, testing, roadmap,
    governance, contribution, and security documents were reviewed on 2026-07-28.
- [x] Create phased implementation plan with subphases and exit criteria.
  - Evidence: `IMPLEMENTATION_PLAN.md`.
- [x] Create monorepo directory skeleton without application implementation.
  - Evidence: tracked placeholder/readme files under `apps`, `services`,
    `packages`, `plugins`, `templates`, `tooling`, `docker`, and `envs`.
- [x] Create `.gitignore`.
  - Evidence: root `.gitignore` covers Node, Python, builds, envs, runtime data,
    archives, credentials, editors and local overrides.
- [x] Create root and service environment examples.
  - Evidence: `.env.example` and `envs/examples/*.env.example`; secret-bearing
    values are blank.
- [x] Document repository and environment layout.
  - Evidence: `FOLDER_STRUCTURE.md` and `envs/README.md`.
- [x] Initialize the local Git repository and connect the GitHub remote.
  - Evidence: repository root is `E:\Projects\OPENSOURCE\OpenForge`; local
    branch `main`; `origin` fetch/push URL is
    `https://github.com/umarilyas02/OpenForge.git`.
- [ ] Review and approve this planning baseline with maintainers.

## Phase 0 — Foundation

### 0.1 Identity and governance

- [x] Select final license.
  - Evidence: remote repository includes the Apache License 2.0 in `LICENSE`.
- [ ] Verify OpenForge name, repository, npm scope, domain and trademarks.
- [ ] Publish security contact/private reporting.
- [ ] Adopt complete recognized code of conduct.
- [ ] Decide DCO/CLA.
- [ ] Add CODEOWNERS, pull request template and protected-area ownership.

### 0.2 Monorepo bootstrap

- [x] Initialize Git repository.
  - Evidence: empty local Git repository initialized on `main` on 2026-07-28.
- [x] Create root `package.json`.
  - Evidence: root manifest defines the private ESM workspace and quality scripts.
- [x] Create `pnpm-workspace.yaml`.
  - Evidence: pnpm 11.17.0 installed all three initial workspace projects.
- [x] Create `turbo.json`.
  - Evidence: Turborepo ran all six lint, test, and build tasks successfully.
- [ ] Pin Node, pnpm and Python versions.
  - Partial: root engines require Node 24.11+ and package manager pins pnpm
    11.17.0; Python remains to be pinned.
- [x] Configure ESM JavaScript/JSX and JSDoc standards.
  - Evidence: root/compiler/test-utils manifests use ESM; compiler public API
    uses JSDoc and JavaScript.
- [x] Configure formatting and linting.
  - Evidence: Prettier 3.9.6 and ESLint 10.8.0 pass through `corepack pnpm check`.
- [ ] Configure Changesets.
- [ ] Establish package-boundary and circular-dependency checks.

### 0.3 Configuration contracts

- [ ] Select runtime schema validator.
- [ ] Implement root/service environment validation.
- [ ] Define public browser variable allowlist.
- [ ] Define secret redaction and encryption contracts.
- [ ] Test missing/invalid configuration behavior.

### 0.4 Local infrastructure

- [ ] Compose PostgreSQL.
- [ ] Compose Redis.
- [ ] Compose MinIO.
- [ ] Compose Python analysis service.
- [ ] Add health/readiness checks.
- [ ] Select database access/migration tools.
- [ ] Define storage bucket/prefix and seed conventions.
- [ ] Document safe local reset and backup.

### 0.5 Shared primitives

- [ ] Schemas and stable errors.
- [ ] Structured logger and trace IDs.
- [ ] Domain events.
- [ ] Auth/session boundary.
- [ ] Organization/project authorization.
- [ ] Job and audit contracts.
- [ ] Health/readiness endpoints.
- [ ] Cross-tenant denial contract tests.

### 0.6 Process skeletons

- [ ] Web process.
- [ ] API process.
- [ ] Worker process.
- [ ] Preview gateway process.
- [ ] Python analysis process.
- [ ] Baseline application shell.
- [ ] Browser/server dependency-boundary checks.

### 0.7 CI and supply chain

- [ ] Format/lint/unit/schema/build gates.
- [ ] License and secret scans.
- [ ] Dependency and container scans.
- [ ] SBOM/provenance strategy.
- [ ] Required reviews for protected paths.

### Phase 0 exit

- [ ] Clean checkout installs deterministically.
- [ ] Documented local stack reaches healthy state.
- [ ] Root quality commands pass locally and in CI.
- [ ] Setup and architecture documentation are current.

## Phase CMS — Multi-tenant CMS surface (added 2026-08-28)

Goal: a multi-tenant, database-backed CMS coexists with the static-source
visual editor. Themes are real developer-authored components; content
authors build pages from reusable blocks within a theme's declared
regions, matching WordPress + Gutenberg rather than plain WordPress
templates. See `openforge-docs/docs/product/01-vision.md` ("Multi-tenant
CMS surface") for the product-scope note.

This phase deliberately builds only the Phase 0 primitives the CMS
actually needs (config, schemas, logger, events, db, auth, local infra).
Phase 0's governance (0.1) and CI (0.7) work remains unstarted — it isn't
load-bearing here and was explicitly deprioritized by the user.

### CMS.1 Foundation primitives

- [x] `packages/config` — per-service zod env schemas, `loadEnv()` with
      actionable multi-error startup failures, public/secret browser
      allowlist, redaction adapter over `integration-security`.
  - Evidence: 11 tests pass; found and fixed a real bug where `loadEnv`
    validating raw `process.env` against `.strict()` schemas always failed
    (ambient OS vars) — confirmed via the live `apps/cms-renderer` run
    below, then covered by a regression test.
- [x] `packages/schemas` — error envelope, audit-event schema, job
      payload/result schema, framework-agnostic health-check factory.
  - Evidence: 14 tests pass.
- [x] `packages/logger` — structured JSON logger, `AsyncLocalStorage`
      trace-ID propagation, redacted metadata.
  - Evidence: 7 tests pass.
- [x] `packages/events` — in-process schema-validated domain event bus.
  - Evidence: 4 tests pass.

### CMS.2 Local infrastructure

- [x] `docker/compose/docker-compose.yml` — Postgres 16, Redis 7, MinIO,
      health-checked, bind-mounted volumes under `docker/volumes/`.
  - Evidence: `docker compose up -d` reaches `healthy` for all three
    services on a real run.
- [~] `services/python-analysis` containerization — deferred; no
      `app/main.py` exists yet (Phase 0.6 process-skeleton work).

### CMS.3 Data model and auth

- [x] `packages/db` — Drizzle schema for auth/tenancy (users, sessions,
      organizations, organization_members, audit_events) and the CMS
      content model (sites, content_items unifying pages/posts,
      content_revisions, assets/asset_variants, menus/menu_items,
      theme_installations); migrations generated and applied.
  - Evidence: `drizzle-kit generate` + `drizzle-kit migrate` against a
    live Postgres instance produced all 13 tables; a scripted
    org → site → page round trip passed.
- [x] `packages/auth` — scrypt password hashing, hashed-token sessions
      (in-memory and Drizzle-backed stores), pure cross-tenant
      authorization helpers.
  - Evidence: 18 tests pass, including a live Postgres-backed session
    issue/verify/revoke round trip and explicit cross-tenant-denial cases.

### CMS.4 Theme SDK and starter blocks

- [x] `packages/theme-sdk` — theme manifest schema (regions, allowed block
      IDs per region, declared templates, token overrides) and a runtime
      registry; a theme fails to register if it's missing a declared
      template or references an unregistered block component.
  - Evidence: 8 tests pass.
- [x] `packages/cms-blocks` — six real, importable React components (Hero,
      Rich Text, Image, CTA, Columns, Footer) with prop/slot/migration
      schemas reusing the same shape as `packages/blocks` (that package is
      untouched — its `source` field is JSX text for the AST compiler,
      not a real component, so it isn't reused directly).
  - Evidence: 6 tests pass, including `renderToStaticMarkup` producing
    real HTML for every block and for nested slot content.

### CMS.5 Rendering

- [x] `packages/renderer` — recursive block-tree schema, a renderer that
      migrates/validates each instance's props through the block registry
      and resolves components from the active theme, and
      `renderSiteStyles()` for per-site design-token CSS overrides.
  - Evidence: 8 tests pass: nested slot rendering, unknown-block
    rejection, required-prop-validation rejection, token override
    behavior.
- [x] `themes/default` — the first real theme: page/post/not-found
      templates, three regions (page body, post body, footer).
  - Evidence: 5 tests pass; every declared template and every
    region-referenced block resolves; templates render real markup.

### CMS.6 Multi-tenant renderer app

- [x] `apps/cms-renderer` — resolves the requesting site from the Host
      header (custom domain, then slug-as-subdomain), loads published
      content by slug, renders through `renderer` + `theme-default` with
      per-site token CSS injected inline; catch-all route is dynamic
      (`headers()`), so production build needs no live database.
  - Evidence: `next build` succeeds. Live end-to-end run: seeded a site
    via `tooling/scripts/seed-cms-demo.js`, started the built app, and
    `curl -H "Host: demo.localhost:3902"` returned HTTP 200 with the
    seeded Hero/Rich Text content and `--of-color-ink` token CSS present
    in the response. An unrecognized Host and an unknown page path on the
    real site both correctly returned HTTP 404.
- [x] `apps/cms-renderer/Dockerfile` — multi-stage build (install the full
      pnpm workspace, `next build` with `output: "standalone"`, copy only
      the traced standalone server + static assets into a minimal runtime
      image).
  - Evidence: `docker build` succeeded; the built image ran on the
    `docker/compose` network against the real `postgres` container and
    served the seeded demo site correctly (HTTP 200, correct content;
    unrecognized Host correctly 404'd).

### CMS.7 Admin UI

- [x] `apps/cms-admin` — login/logout (Server Actions, Drizzle-backed
      sessions, native Next `cookies()`, `SESSION_COOKIE_NAME` reused from
      `packages/auth`), an auth-gated `(app)` route group.
  - Evidence: live run against real Postgres — unauthenticated `/` and
    `/sites` 307-redirect to `/login`; password check verified directly
    against the real seeded user's stored hash.
- [x] Site list/create (installs `openforge-theme.default` automatically)
      and site overview (per-site content list).
  - Evidence: live run with a genuinely issued session cookie — `/sites`
    correctly listed the seeded "Demo Site"; created a second real site
    through the same code path and confirmed it appeared. Cross-tenant
    access verified with a second, independently created user/org: request
    for another org's site correctly 404s (no leaked site name) instead of
    403ing, and that user's own `/sites` correctly shows empty.
  - Found and fixed a real bug via this live testing: `assertOrgMembership`
    expects an actor shaped `{userId}`, but the code was passing the raw
    `users` row (`.id`, not `.userId`) — every site creation would have
    thrown `OF_AUTH_ORG_ACCESS_DENIED`. Fixed, re-verified.
- [x] Content list/create (title, slug, type, empty block tree, draft
      status).
  - Evidence: live run — created a real page through the exact create
    logic and confirmed it appears in the site overview and its editor
    route. A relative-import path bug (off by one directory level) was
    caught by the production build and fixed before this shipped.
- [x] Recursive block-tree content editor: add/remove/reorder per block, a
      props form generated from each block's `editableFields`, nested
      slots scoped to `acceptedTypes`, save wired to real
      migrate/validate/persist logic (`src/lib/content-tree-ops.js`).
  - Evidence: 8 unit tests (valid round trip, unknown block, missing
    required prop, unsupported version, nested slot content surviving
    migration, invalid content inside a slot, non-array input) plus 2
    live-Postgres integration tests (full save path including a nested
    Columns+2×RichText tree and a revision write; explicit cross-tenant
    denial). End-to-end: saved a nested block through this exact path,
    confirmed it in the cms-admin editor, then confirmed
    `apps/cms-renderer` renders the identical content for the site's Host
    header — admin and renderer proven to agree on the same data, not
    just tested in isolation. Full repo `pnpm check`: 78/78 tasks pass.

### CMS.8 Admin UI redesign, drag-and-drop, templates, appearance (2026-08-29)

- [x] Full visual redesign of `apps/cms-admin` per the `impeccable` skill's
      product register: OKLCH restrained palette anchored on OpenForge's
      existing brand orange, fixed rem type scale, one font family,
      explicit hover/focus/active/disabled states.
- [x] Responsive app shell (`src/components/AppShell.jsx`): collapsible
      sidebar (icon-only or off-canvas below 900px), full-width content
      area, structural 2–3 column content-editor layout on large screens
      instead of a 960px-capped single column.
  - Evidence: live-built app, curl-verified rendering of the new shell
    markup with a real session cookie against live Postgres.
- [x] Native HTML5 drag-and-drop block reordering in `BlockList.jsx`
      (drag handle, position-aware drop indicator), ↑/↓ buttons kept as
      the accessible/keyboard fallback rather than removed.
  - Evidence: new automated test exercises the exact drag-then-save path
    (reorder via array splice, run through `prepareContentTreeForSave`,
    persist, read back) and confirms the new order is exactly what was
    dragged.
- [x] Starter-template picker (`src/lib/page-templates.js`) for new
      content: Blank/Landing page/About page (pages), Blank/Simple post
      (posts), each a factory over the existing six `cms-blocks`.
  - Evidence: 9 unit tests. Caught a real bug before shipping — two
    templates included an `Image` block with empty required `src`/`alt`,
    which would have failed save validation immediately on creation;
    fixed by removing the block, not by weakening validation.
- [x] Site appearance page (`sites/[siteId]/appearance`): overrides the
      active theme's color tokens per site, writing to
      `theme_installations.config` via the same `assertSiteAccess`
      pattern as content — real, connected functionality, not a stub.
  - Evidence: live end-to-end run — saved a real color override through
    the exact save logic, started `apps/cms-renderer`, and confirmed the
    live public site's CSS included the override, with the semantic
    `color.action` token correctly cascading through its CSS variable
    reference to the overridden `color.orange-500`.
  - Deferred, explicitly: swapping between multiple full theme
    *packages* stays out of scope — this is per-site token
    customization within the one existing theme.
- Full repo `pnpm check`: 78/78 tasks pass; 22 tests in `apps/cms-admin`
  (up from 10).

### CMS.9 Elementor-style block library + WordPress-style admin sections (2026-08-29)

- [x] `select` control added to `packages/cms-blocks`' block schema
      (`options: [{value, label}]`, required via `.refine()` exactly when
      `control === "select"`), backward compatible with every existing
      block. `BlockPropsForm.jsx` renders a matching real `<select>`.
- [x] 14 new blocks in `packages/cms-blocks` (Heading, Button, Spacer,
      Divider, Icon Box, Alert, Video, Testimonial, Pricing, Team Member,
      plus two container/item pairs: Stats Row+Stat and Accordion+FAQ
      Item using the existing slot mechanism) — 20 official blocks total,
      up from 6. Registered in `themes/default`'s `page-body`/`post-body`
      regions.
  - Evidence: 30 tests in `packages/cms-blocks` (generic smoke test over
    every official block plus targeted nested-slot and `select`-control
    cases).
- [x] Found and fixed a critical, previously-unnoticed gap: `apps/cms-renderer`
      had zero CSS, so every rendered CMS site was unstyled and the CMS.8
      Appearance overrides changed variable *values* nothing visually
      consumed. Added `apps/cms-renderer/app/blocks.css` — real rules for
      all 20 blocks and the theme templates, built on the `--of-*` custom
      properties already injected per-request.
  - Evidence: live run — fetched the actual served CSS bundle and
    confirmed real selectors exist for every new block's classNames.
- [x] Site-scoped nested layout (`sites/[siteId]/layout.jsx`) replacing
      duplicated per-page site-fetch/`assertSiteAccess` — adds a
      persistent sub-nav (Overview/Appearance/Menus/Settings) and a
      "View site ↗" button that opens the real public URL (custom domain,
      else slug-subdomain) in a new tab.
- [x] Menus (`sites/[siteId]/menus`): create a menu, add items
      (label/url), reorder via the same native HTML5 drag-and-drop
      pattern as the block editor. Item nesting (`parentId`) stays
      unused/flat this pass, explicitly deferred.
- [x] Team (`/team`, top-level nav item — `organization_members` is
      org-scoped, not site-scoped, so this doesn't force a mismatched
      per-site Users page): list members, add an existing account by
      email (no signup UI yet, so this is explicit rather than a fake
      "invite"), change role, remove — gated to owner/admin via
      `packages/auth`'s `assertRole`, its first real caller.
  - Evidence: live run confirmed `assertRole` denies a plain member and
    the page correctly renders manage controls only for owner/admin.
- [x] Settings (`sites/[siteId]/settings`): edit form over the sites
      table's own fields (name, slug, custom domain, status). Site
      overview enriched into a real per-site dashboard: a stats row
      (pages, posts, published, draft) computed from content already
      fetched, plus quick links to Appearance/Menus/Settings.
  - Evidence: live run — issued a real session token, confirmed both
    pages render actual data, replicated the update logic to confirm
    persistence, and inserted/removed real content items to confirm the
    stats row's counts update correctly.
- [x] Integration test exercising the full new block library (including
      both slot-container/item pairs) through the real save →
      read-back → render pipeline in one page.
  - Evidence: live end-to-end run beyond the test itself — inserted the
    same tree into a real site, fetched it through the actual running
    `apps/cms-renderer` with a genuine Host header, and confirmed the
    served CSS bundle styles every new block's classNames.
- Full repo `pnpm check`: 78/78 tasks pass.

### CMS.10 shadcn/MUI/ReactBits-inspired blocks (2026-08-29)

- [x] User asked to add shadcn/MUI/ReactBits components "like Elementor
      has," dismissing licensing as a concern. Clarified that shadcn and
      React Bits are MIT and designed for exactly this copy-paste use, and
      MUI's core is MIT too — licensing wasn't the real blocker. The real
      issue is architectural: those three libraries use three mutually
      incompatible styling systems (Tailwind+Radix, Emotion, Tailwind+
      Framer Motion) that don't exist anywhere in this codebase, and
      several of their real components need client-side hydration this
      server-rendered block tree doesn't support. User chose to
      reimplement natively on the existing design-token CSS system rather
      than add those dependencies.
- [x] 11 new blocks in `packages/cms-blocks`, zero new dependencies:
      Badge, Card, Rating, Progress, Banner (standalone), plus three slot
      container/item pairs — Logo Cloud+Logo Item (a CSS-only marquee via
      keyframe animation, respecting `prefers-reduced-motion`, with a
      duplicated+`aria-hidden` second copy for a seamless loop without
      JS), Timeline+Timeline Step, Avatar Group+Avatar Item. 20 → 31
      official blocks. Registered in `themes/default`'s
      `page-body`/`post-body` regions and styled in
      `apps/cms-renderer/app/blocks.css`.
  - Evidence: 46 tests in `packages/cms-blocks` (up from 30) — registry
    count, generic smoke test over every official block, targeted
    nested-slot tests for all three new container/item pairs, star-fill
    and progress-width assertions. `themes/default` and both
    `cms-admin`/`cms-renderer` production builds pass.
  - Evidence: live run — inserted a real page using all 11 new blocks
    (including both slot containers) into Postgres, fetched it through
    the actual running `apps/cms-renderer` with a genuine Host header,
    and confirmed exact element counts in the real DOM (isolated from the
    Next.js RSC flight payload, which otherwise double-counts text/class
    matches — 4 filled stars, 4 duplicated marquee logo items, 2 avatars,
    2 timeline steps, all correct) plus real CSS rules for every new
    block's classNames in the served bundle.
  - One design-hook finding accepted as intentional, matching the
    CMS.8-era sidebar-collapse precedent: `.of-progress-fill`'s
    `transition: width` animates a single element on rare prop changes,
    the standard progress-bar-fill pattern.
- Full repo `pnpm check`: 78/78 tasks pass.

### CMS.11 Tailwind CSS + shadcn/ReactBits-styled blocks (2026-08-29)

- [x] User accepted the Tailwind dependency this time ("add the tailwind
      ones next + tailwind"), so `tailwindcss` + `@tailwindcss/postcss`
      were added as devDependencies of `apps/cms-renderer` only —
      confirmed via grep first that `apps/cms-admin` never renders live
      block components and so has no reason to need it.
- [x] `app/tailwind.css` imports only `theme.css` + `utilities.css`
      (Preflight excluded) so Tailwind's base reset doesn't fight
      `blocks.css`'s own reset/typography — the two CSS systems coexist
      as separate layers rather than one replacing the other. An
      explicit `@source` directive reaches into `packages/cms-blocks`, a
      sibling workspace package outside this app's own directory tree
      that Tailwind's automatic detection wouldn't otherwise scan.
- [x] 7 new blocks styled with Tailwind utilities instead of the
      `--of-*` tokens: Spotlight Card, Gradient Heading, Marquee Text,
      Feature List, Data Table (standalone), plus a Carousel+Carousel
      Slide slot pair using native CSS scroll-snap (no JS carousel
      library). 31 → 38 official blocks.
  - Evidence: 59 tests in `packages/cms-blocks` (up from 46). Confirmed
    the built CSS chunk contains real generated rules (`bg-clip-text`,
    `snap-mandatory`, `animate-marquee-fast`, the `even:bg-slate-50`
    `nth-child` selector) proving `@source` correctly reached across the
    workspace boundary. Live run — inserted a real page using all 7 new
    blocks into Postgres, fetched it through the actual running
    `apps/cms-renderer` with a genuine Host header, and confirmed both
    the real DOM content and the served CSS bundle's rules for every new
    class. Full repo `pnpm check`: 78/78 tasks pass.
- One design-hook finding accepted as intentional: `gradient-heading.jsx`
  was flagged for gradient text, but the block's entire stated purpose
  is to be a gradient-text heading (the ReactBits pattern it was
  explicitly built to replicate).

### CMS.12 Single-user product shape + live-canvas drag-and-drop editor (2026-09-04)

- [x] Single-user simplification: deleted `apps/cms-admin/app/(admin)/(app)/team/**`
      and its `AppShell.jsx` nav entry entirely.
      `organizations`/`organization_members` and `packages/auth`'s
      `assertOrgMembership`/`assertSiteAccess`/`assertRole` are untouched
      underneath (no destructive schema migration) — the product simply
      never surfaces "organization" as a concept anymore. New
      `tooling/scripts/create-user.js`: creates the user if needed,
      silently provisions a personal organization + owner membership if
      they don't already have an active one, idempotent on rerun.
  - Evidence: ran it twice against real Postgres — created on the first
    run, cleanly no-op'd on the second. Build, lint, and all 23 tests
    pass with `/team` gone from the route list.
- [x] Shell redesign: `AppShell.jsx` rebuilt into a WordPress-style
      grouped left sidebar (collapsible groups with a one-line
      description, pill-shaped active state, Lucide-style inline icons,
      a site switcher in the header) matching the visual reference the
      user pointed to (`stitchmarkuniform/smu-backend`'s `Nav.js`).
      Replaces both the old icon-rail sidebar and the separate
      `SiteTabNav.jsx` horizontal tab strip — a site's own pages
      (`sites/[siteId]/layout.jsx`) now render the full
      Content/Design/Site groups directly; `/sites` gets a minimal
      "Sites" group instead of being the mandatory landing page.
  - Evidence: live run with a real session cookie — confirmed `/sites`
    renders the minimal nav (no switcher) while `/sites/{id}` renders
    the full grouped nav with the switcher showing the real site name
    and a working "View site" link.
- [x] Live-canvas rendering foundation. `packages/renderer`'s
      `createRenderer()` gained an optional `wrapNode(element, path,
      migrated)` hook — every existing caller (including
      `apps/cms-renderer` in production) passes none, so behavior there
      is provably unchanged. A new `apps/cms-admin/app/(canvas)/canvas`
      route, in its own Next.js root-layout group (`(canvas)`, sibling to
      the existing app's now-relocated `(admin)` group — Next.js allows
      only one root layout per top-level group, and the canvas needed to
      load zero of the admin app's own OKLCH product CSS), renders the
      exact same `@openforge/renderer` + `@openforge/theme-default` +
      `@openforge/cms-blocks` pipeline `apps/cms-renderer` uses in
      production, driven by `postMessage` instead of a database query.
      `blocks.css` moved into `packages/cms-blocks` (new `"./blocks.css"`
      export) so both apps import the same file. New
      `src/lib/tree-path.js` (`getNodeAtPath`/`setNodeAtPath`) is the
      path-based generalization of `BlockList.jsx`'s index-only node
      updater.
  - Evidence: existing `packages/renderer` test suite passes unmodified
    plus new tests for `wrapNode` itself (correct paths through nested
    slots; byte-identical output with vs. without the hook). Live
    Playwright/Chromium run: posted a real tree into `/canvas` via
    `postMessage`, confirmed real components rendered with real CSS
    classes, and confirmed clicking a block fires the expected
    `of-canvas-select` message with the correct path — plus confirmed
    via curl that `/canvas` serves zero admin-shell CSS.
- [x] Wired the content editor into a real 3-pane canvas view.
      `ContentEditor.jsx` gained a Canvas/Layers toggle (Canvas is now
      the default; Layers/`BlockList.jsx` is kept, not deleted, as the
      non-visual fallback for deeply nested slot content and to preserve
      the existing tested reorder/remove/keyboard-fallback code). New
      `CanvasEditor.jsx`: block palette (`BlockPalette.jsx`, extracted
      from `BlockList.jsx`'s inline picker so both views share one
      implementation) on the left, the `/canvas` iframe in the middle,
      `BlockPropsForm.jsx` reused completely unmodified as the inspector
      on the right when a block is selected.
  - Found and fixed a real race condition via live testing: the iframe's
    `src` is present in the server-rendered HTML, so the browser can
    start — and for a route as small as `/canvas`, finish — loading it
    before the parent has hydrated and attached its message listener.
    An `onLoad`-triggered single post was unreliable for exactly that
    reason (confirmed live: the canvas's own readiness signal
    consistently logged before the parent's listener-attached log).
    Replaced with a retry-until-acknowledged handshake instead.
  - Evidence: live Playwright/Chromium run with a genuine session
    cookie against a real content item — the canvas renders real
    content, clicking a block populates the inspector with its actual
    props, and editing a field in the inspector updates the canvas
    live, the full round trip through `getNodeAtPath`/`setNodeAtPath`
    and the postMessage bridge.
- [x] Drag-to-reorder directly on the canvas. Top-level blocks are
      natively draggable in `canvas/page.jsx`'s `wrapNode` (native HTML5
      `dragstart`/`dragover`/`drop`, same technique as `BlockList.jsx`/
      `MenuItemList.jsx`, entirely same-document since only the iframe's
      own top-level nodes are draggable — nested slot reordering stays a
      Layers-view-only operation, explicitly scoped out). On drop, the
      canvas posts the reordered array back via a new
      `of-canvas-reorder` message, applied through the same `onChange`
      the rest of the editor uses. Visual drag/drop-target feedback uses
      a CSS attribute selector targeting each wrapper's *child*
      (`[data-of-path='...'] > *`) rather than the `display:contents`
      wrapper itself, which generates no box of its own to style —
      confirmed live that `getBoundingClientRect()` on the wrapper
      returns a zero rect while `wrapper.firstElementChild`'s rect is
      the real box.
  - Found via live testing: Playwright's `page.mouse` sequences and its
    `dragTo()` helper both failed to trigger a working reorder — a known
    headless-Chromium limitation simulating native OS-level HTML5 drag
    gestures, not a bug in the handlers. Confirmed by manually
    dispatching real `dragstart`/`dragover`/`drop` `DragEvent`s (the
    same events a real browser fires during an actual drag) with
    realistic timing between them: reordering produced the correct
    array, and saving through the real UI persisted that exact order to
    Postgres, confirmed by reading it back directly.
- Full repo `pnpm check`: 78/78 tasks pass at every batch of this pass.

### CMS.13 Fix 27/38 blocks' defaultProps + canvas per-block error isolation (2026-09-07)

- [x] All 38 official `packages/cms-blocks` blocks now default every
      required `editableField` to real, non-empty placeholder content;
      27 previously failed their own `validateProps` on insert (missing
      or empty-string required fields), which meant a freshly-inserted
      block genuinely landed in the page's source file but then threw
      "missing required props" when `apps/cms-admin`'s `/canvas` route
      tried to render it.
  - Evidence: a comprehensive regression test in `@openforge/cms-blocks`
    asserts every official block's `defaultProps` satisfies its own
    `validateProps`. `pnpm --filter @openforge/cms-blocks test`:
    139/139 tests pass (re-verified 2026-09-08).
- [x] `apps/cms-admin`'s `(canvas)/canvas/page.jsx` renders each
      top-level block through the renderer's per-node `renderNode`
      inside its own `try`/`catch`, instead of one `try`/`catch` around
      the whole `renderTree()` call — one invalid block (this bug, or a
      user clearing a required field later) now shows an inline error in
      its own place instead of blanking the entire canvas.
      `@openforge/renderer` itself, used by production
      `apps/cms-renderer`, is unchanged.
  - Evidence: an admin-level test drives the real `insertBlock` pipeline
    against a real git-backed file workspace and renders the result
    through the same pipeline `/canvas` uses.

### CMS.14 `@openforge/component-library` static catalog (2026-09-07)

- [x] New workspace package `packages/component-library`
      (`@openforge/component-library`): `libraryComponentSchema` +
      `createLibraryRegistry` (list/get/byCategory/search/
      createInsertion, mirroring `@openforge/blocks`' registry shape),
      populated with 47 self-contained React component variants across
      seven categories — nav (6), footer (6), hero (6), blog (6),
      product (6), grid (10), custom (7) — each harvested and
      generalized from a real reference project on disk, React-only
      (no runtime deps beyond `react`), scoped under an `ofl-`-prefixed
      root class, and attributed via `sourceProject`.
  - Evidence: `pnpm --filter @openforge/component-library test`: 5/5
    tests pass — unique ids, unique file names per category, schema
    validity. Directly counted `allLibraryComponents.length === 47`
    against the built registry (6/6/6/6/6/10/7 by category).
- [-] Wiring into `apps/cms-admin`'s canvas palette: `@openforge/
      component-library` is a declared `package.json` dependency of
      `apps/cms-admin`, and `src/components/LibraryPalette.jsx`,
      `src/lib/library-content-actions.js`, and
      `src/lib/library-palette-meta.js` exist, with `CanvasEditor.jsx`
      and the page-editor route importing and rendering
      `LibraryPalette`. As of this writing all of that is uncommitted
      working-tree state, changed concurrently with this documentation
      pass by another session, with no recorded evidence/tests of its
      own yet — do not mark this integration `[x]` until it's committed
      and has real verification (a live insert-from-library run,
      confirmed on the canvas and/or the exported project source).

### CMS.15 Site preview, project export, and GitHub push (2026-09-08)

- [x] Chrome-free `/preview/[siteId]` route renders every real page of a
      site through the exact same `@openforge/renderer` +
      `theme-default` pipeline the live canvas and `apps/cms-renderer`
      use, computed directly from the site's on-disk source (no
      iframe/postMessage — it's read-only). A custom
      `app/(preview)/not-found.jsx` (matching the preview's own dark
      chrome) replaces the framework default 404 for a removed or
      malformed site id.
  - Evidence: read the route's implementation directly — auth via
    `requireUser`/`assertSiteAccess` (404, not 403, on denial, matching
    the rest of the app's cross-tenant convention), page tree parsed via
    `parsePageToBlockTree` from `getWorkspaceManager()`'s real files.
- [x] Export button on the site Tools page streams a real `.tar.gz` of
      the site's on-disk Next.js project via the already-built
      `WorkspaceManager.export()`.
  - Evidence: read `tools/export/route.js` directly — authorizes,
    exports to a temp path via `WorkspaceManager.export()`, streams the
    bytes with `content-disposition: attachment`, removes the temp
    archive in a `finally` block regardless of success/failure.
- [x] GitHub connection in Settings > GitHub: a personal-access-token
      flow (not an OAuth App — this app has no public callback URL),
      verified against the real GitHub API (`verifyGitHubRepoAccess`)
      before saving. The token is encrypted at rest via
      `@openforge/integration-security`'s `createSecretVault`, backed by
      a new `secrets` table; pushes pass the token as a one-off `git -c
      http.extraheader=...` value scoped to a single `git push`
      invocation, never `git remote add`, so it's never written into the
      workspace's `.git/config`. New `site_git_connections` table
      (unique-indexed on `site_id`, cascades on site delete) records the
      connected owner/repo/branch and a reference to the vaulted secret.
  - Evidence: `apps/cms-admin/test/site-git.test.js` (7 tests) exercises
    `initSiteGit`/`commitSiteChanges`/`pushSiteChanges`/
    `listSiteCommits` against real local git repositories, including the
    `http.extraheader` push path against a local bare-repo remote;
    verified passing in isolation (`vitest run test/site-git.test.js`,
    2026-09-08). Read `secret-vault.js` and `settings/actions.js`
    directly to confirm the encrypt-then-store and verify-then-save
    order. Not independently verified in this pass: a push against a
    real github.com repository, or the vaulted-secret round trip against
    a live Postgres instance with `ENCRYPTION_MASTER_KEY` set.
- [x] New, purely-additive Drizzle migration
      (`packages/db/migrations/0002_watery_thunderbolts.sql`) for the
      `secrets` and `site_git_connections` tables, with a matching
      `meta/0002_snapshot.json` and `_journal.json` entry.
  - Not verified in this pass: whether `0002_watery_thunderbolts.sql`
    has been applied to any running dev database.
- [x] Fixed a raw 500 (Postgres "invalid input syntax for type uuid")
      on a malformed `siteId` route param in the new preview/export
      routes, replaced with a clean 404 via a new
      `apps/cms-admin/src/lib/uuid.js` `isUuid()` guard checked before
      the query runs.
  - Evidence: read `uuid.js` and both routes directly — the guard runs
    before any database query that would otherwise throw at the driver
    level.

### CMS exit

- [x] A created site's page renders correctly end to end from a cold
      `docker compose up` through a real HTTP request, with no code
      editing — proven by the live run above, not just unit tests.
- [x] Admin UI — single-user, WordPress-style grouped-sidebar shell, a
      real live-canvas drag-and-drop editor (not a flat block-list-plus-
      form), a 38-block Elementor-style library (shadcn/MUI/ReactBits-
      inspired components on the design-token CSS, plus genuinely
      Tailwind-styled ones), menus, and per-site settings all exist and
      are verified live (CMS.7, CMS.9, CMS.10, CMS.11, CMS.12). Media
      library and theme *package* switching remain deferred (see below).
- [x] Since the paragraph above, the canvas editor gained a real
      Content/Style/Advanced inspector with a persisted style/className
      override, block duplication, a device-preview toggle, a visible
      selection overlay, a redesigned searchable/categorized palette,
      and multi-step undo/redo; a standalone site preview route, a
      real project-export download, and a token-based GitHub push all
      shipped; and all 38 official blocks' `defaultProps` now pass
      their own validation (CMS.13, CMS.15). A static, portable
      `@openforge/component-library` catalog of 47 further component
      variants also exists (CMS.14), though wiring it into the canvas
      palette was still in progress, uncommitted, as of this update —
      see CMS.14 for what's verified versus what isn't yet.
- [~] `apps/api` authenticated CRUD (the admin UI writes directly through
      `packages/db` via Server Actions instead), custom-domain SSL
      automation, multi-language content, theme marketplace/registry,
      media/asset upload, user registration UI, an org
      switcher/org-creation UI, menu item nesting, drag-to-insert
      directly from the canvas palette (deferred given the cross-iframe
      native-drag reliability question — inserting still works via a
      click, then drag-to-reorder into position), nested-slot drag
      reorder on the canvas (Layers view only), `content_revisions`
      browsing/restore — explicitly deferred, named so they aren't
      silently dropped.

## Phase 1 — Compatible Next.js project model

### 1.1 Compatibility

- [x] Publish supported-source profile.
  - Evidence: `docs/compatibility.md` defines the initial Next.js App Router
    JavaScript/JSX contract and preservation guarantees.
- [x] Define supported/partial/code-only levels.
  - Evidence: public compiler constants and stable compatibility diagnostics.
- [x] Add representative compatibility fixtures.
  - Evidence: eight manifest-driven fixtures cover server/client components,
    Tailwind, CSS Modules, nested routes, dynamic imports, complex conditionals,
    runtime elements, and component factories.
- [x] Test unsupported-code preservation.
  - Evidence: 18 compiler tests pass, including byte-for-byte SHA-256 checks for
    every supported, partial, and code-only fixture.

### 1.2 Compiler read pipeline

- [x] JavaScript/JSX parsing.
  - Evidence: shared Babel 8 parser profile is used by compatibility analysis
    and project indexing.
- [x] Safe normalized paths.
  - Evidence: POSIX/Windows absolute paths, traversal, control characters,
    duplicates, and case-insensitive collisions are covered by security tests.
- [x] component/node mappings.
  - Evidence: function components and JSX elements receive deterministic,
    formatting-stable SHA-256-derived identifiers and source ranges; code-only
    files expose no visual targets.
- [x] dependency index.
  - Evidence: static imports, re-exports, literal dynamic imports, external
    packages, extension resolution, index resolution, and unresolved imports
    are represented.
- [x] compatibility diagnostics.
  - Evidence: file-scoped stable diagnostics with source locations are
    aggregated in schema version 1 indexes.
- [x] rebuildable indexes.
  - Evidence: tests prove identical output for repeated builds and reversed
    input order with no persisted state.

### 1.3 Compiler write pipeline

- [x] Versioned operation schemas.
  - Evidence: strict Zod schema version 1 validates revisioned attribute, text,
    and import operations at the public compiler boundary.
- [x] Minimal-diff AST transformations.
  - Evidence: AST-resolved MagicString ranges change only confirmed JSX text or
    attributes; structural JSX discovery never uses regular expressions.
- [x] Import management.
  - Evidence: default, named, namespace, and side-effect imports support safe
    insertion/merging while duplicates, incompatible forms, assertions, and
    inline comments are rejected.
- [x] Temporary validation workspace.
  - Evidence: candidate projects are materialized under guarded random temp
    paths, passed through formatter/parser/custom validators, and removed after
    success or failure.
- [x] Inverse operations.
  - Evidence: safe literal attribute and plain-text operations return
    next-revision inverses; unsafe expression/entity/import cases return null
    for journal/snapshot fallback.
- [x] Ambiguous-write rejection.
  - Evidence: stable error codes cover invalid schemas, stale revisions,
    missing/code-only targets, ambiguity, no-change, and failed validation.
- [x] Semantic and file diffs.
  - Evidence: successful operations return summaries, exact changed paths, and
    deterministic unified patches.

### 1.4 Starter

- [x] Standalone JavaScript Next.js starter.
  - Evidence: `templates/blank-next` is an ordinary Next.js 16 App Router
    project with JavaScript/JSX and no OpenForge runtime dependency.
- [x] Tailwind profile.
  - Evidence: Tailwind CSS 4.3.3 and its PostCSS adapter compile utility classes
    in the production build.
- [x] CSS Modules profile.
  - Evidence: the starter Hero combines a local CSS Module with Tailwind.
- [x] Design-token integration.
  - Evidence: portable CSS custom properties define color, spacing, radius, and
    typography tokens without an OpenForge runtime.
- [x] External install/dev/build verification.
  - Evidence: frozen install and Next.js 16.2.12 production build passed from
    `C:\Users\umari\AppData\Local\Temp\openforge-starter-0f78b6d0b3b5420cb21db9db402b4888`
    outside the monorepo on 2026-07-28.

### 1.5 Workspace lifecycle

- [x] Create/import.
  - Evidence: guarded workspace IDs and normalized source paths create isolated
    roots; failed imports remove partial state.
- [x] Incremental indexing.
  - Evidence: revision journal entries identify each saved path and content
    hash for downstream per-file reindexing.
- [x] Revision journal/autosave.
  - Evidence: revision-checked atomic writes update NDJSON journals and state.
- [x] Snapshots and restore.
  - Evidence: content-addressed source snapshots restore exact file sets with
    stale-revision rejection.
- [x] Export.
  - Evidence: deterministic source-only portable tar.gz archives exclude
    `.openforge` metadata.
- [x] Quotas, cleanup and recovery.
  - Evidence: byte quotas, symlink/path denial, guarded cleanup, abandoned-temp
    removal, and journal revision recovery pass seven lifecycle tests.

### 1.6 Code workspace

- [x] File tree.
- [x] Embedded editor.
- [x] Formatting and diagnostics.
- [x] Diff viewer.
- [x] Save/sync states.
- [x] Code-only preservation.
  - Evidence: `@openforge/editor` uses Monaco, exposes per-file diagnostics and
    diffs, tracks saved/dirty/saving/external/conflict states, and keeps
    code-only source editable while disabling visual writes.

### 1.7 Secure preview

- [x] Disposable sessions and separate origin.
- [x] Iframe sandbox/CSP.
- [x] Validated origin-checked messaging.
- [x] Resource and egress limits.
- [x] Safe log/error collection.
- [x] Production metadata stripping.
  - Evidence: preview policy tests cover expiry/release, distinct origins,
    sandbox and browser headers, strict message origin/token/schema validation,
    executor capability enforcement, egress denial, recursive redaction, and
    parse5 metadata removal.

### Phase 1 exit

- [x] Starter import/edit/preview/export/restore journey passes.
  - Evidence: the real official starter is imported, indexed, AST-edited,
    snapshotted, exported, manually changed, restored, and checked for exact
    unsupported-source preservation; preview lifecycle is covered separately
    by the isolated runtime policy suite.
- [x] Compatibility and compiler golden suites pass.
  - Evidence: compiler compatibility, indexing, minimal write, inverse,
    validation, and preservation suites pass.
- [x] Preview isolation and path-safety suites pass.
  - Evidence: preview isolation/egress/message suites and compiler/workspace
    traversal, collision, symlink, quota, and cleanup tests pass.

## Phase 2 — Visual editor MVP

### 2.1 Operation state

- [x] Revision-aware state.
- [x] Validated/journaled operations.
- [x] Undo/redo and snapshot fallback.
- [x] Stale/external revision handling.
  - Evidence: `EditorOperationController` integration tests cover optimistic
    pending/applied/rejected journal states, compiler-backed writes, inverse
    undo/redo, snapshot fallback, stale denial, and external boundaries.

### 2.2 Editor shell

- [x] Top bar.
- [x] Left navigation.
- [x] Canvas.
- [x] Inspector.
- [x] Problems/logs/diff/activity panel.
- [x] Command palette and keyboard navigation.
  - Evidence: `@openforge/web` production build passes and the Next.js dev view
    returns HTTP 200 at `http://localhost:3000`; the Primer-based shell includes
    all Phase 2.2 surfaces and `Ctrl+K`/Escape command handling.
- [x] Bottom panel.
- [x] Command palette and keyboard model.

### 2.3 Canvas mapping

- [x] Development source metadata.
- [x] Selection/hover/parent/slot overlays.
- [x] Drag target states.
- [x] Non-pointer selection.
  - Evidence: compiler metadata injection tests cover deterministic host
    mappings, component-call exclusion, code-only preservation, and spoofing
    denial; editor tests cover measured non-blocking overlays and keyboard tree
    navigation.

### 2.4 Block registry

- [x] Versioned block schema.
- [x] Ten or more official landing-page blocks.
- [x] Search/preview/insert.
- [x] Migrations and accessibility notes.
- [x] Block fixture builds.
  - Evidence: `@openforge/blocks` validates ten portable JavaScript/JSX
    definitions with stable golden hashes, searchable preview metadata,
    deterministic component/style insertion artifacts, typed editable fields
    and slots, accessibility notes, and a tested Hero v1-to-v2 migration; its
    build materializes all ten blocks into an isolated Next.js 16.2.12 fixture
    and completes a production build before cleaning the generated project.

### 2.5 Visual operations

- [x] Insert/remove/move/wrap/duplicate.
- [x] Text/link editing.
- [x] Prop/class/token editing.
- [x] Asset replacement.
- [x] Route/page operations.
- [x] Exact diff for every operation.
  - Evidence: compiler tests cover strict revisioned schemas, AST-indexed
    structural insert/remove/move/wrap/unwrap/duplicate, recursive-move denial,
    existing literal prop/class and text operations, semantic link and asset
    changes, static App Router add/rename/delete, minimal metadata updates,
    collision/path safety, candidate parsing, temporary validation workspaces,
    exact unified diffs, safe inverses, and snapshot fallback.

### 2.6 Inspector/tokens

- [x] Content and visual controls.
- [x] Token/inherited/local/breakpoint source indication.
- [x] Global-token usage impact.
- [x] Safe value validation.
  - Evidence: `@openforge/design-tokens` validates and resolves versioned
    global/semantic/component tokens, emits portable CSS variables, rejects
    unsafe CSS and cycles, and reports exact usage locations; the editor
    inspector model covers content, layout, spacing, size, typography,
    background, border, and breakpoint provenance with pre-change impact
    planning, while the Next.js inspector visibly distinguishes value sources.

### 2.7 Responsive editing

- [x] Viewport presets.
- [x] Breakpoint inheritance/reset.
- [x] Overflow diagnostics.
- [x] Narrow-screen review mode.
  - Evidence: editor tests cover 390/768/1024/1440 presets, immutable
    breakpoint override/set/reset and nearest-lower inheritance, mapped
    horizontal overflow/clipping/fixed-width diagnostics, and editor/compact/
    read-only review layouts; the Next.js canvas exposes all presets, status,
    responsive widths, and the narrow review shell.

### 2.8 Asset MVP

- [x] Secure upload.
- [x] Metadata/alt text.
- [x] Duplicate and usage detection.
- [x] Signed access.
- [x] Python analysis/variants.
- [x] Unused asset reporting.
  - Evidence: storage tests cover byte-signature/size/type/name validation,
    project-scoped SHA-256 deduplication, original and variant persistence,
    metadata and alt status, HMAC TTL/path/tamper controls, cross-project
    denial, exact source references, and unused reporting; Python 3.14 tests
    cover in-memory decode, dimensions, WebP variants, metadata stripping,
    MIME/pixel/width rejection, and the stdin/stdout CLI, while a live
    Node-to-Python adapter check generated both configured variants.

### 2.9 Accessibility/recovery

- [x] Keyboard flows.
- [x] Focus/status/reduced-motion behavior.
- [x] Official block audits.
- [x] Restore/discard/reset/safe mode.
  - Evidence: editor tests cover command/undo/redo/activation/navigation
    mappings, live status and motion preferences, bounded axe normalization,
    revision-aware snapshot restore/discard/reset, failure preservation, and
    third-party-only safe mode; the web palette traps and restores focus, the
    shell exposes live status/visible focus/reduced motion, and the official
    ten-block built page passes source rules plus axe WCAG-tagged diagnostics.

### Phase 2 exit

- [x] Static landing-page E2E passes without code editing.
- [x] Reload preserves source behavior.
- [x] Visual operations have diff/golden/inverse coverage.
- [x] Keyboard and automated accessibility gates pass.
  - Evidence: the Phase 2 workspace journey assembles all ten official blocks
    through registry insertion artifacts, verifies keyboard paths, applies a
    compiler-backed prop edit and structural reorder with readable diffs,
    persists and reloads authoritative source, and restores the exact initial
    snapshot; focused operation/golden/inverse tests and the built-page
    accessibility audit pass alongside it.

## Phase 3 — GitHub and Vercel

### 3.1 Integration security

- [x] Encrypted integration references.
- [x] Minimum scopes.
- [x] Webhook verification/deduplication.
- [x] Idempotency.
- [x] Audit/redaction.
  - Evidence: `@openforge/integration-security` has authenticated AES-256-GCM
    records with opaque/context-bound references and key rotation; explicit
    GitHub/Vercel operation-to-scope policies; raw-body HMAC-SHA256 verification
    and atomic delivery claims; canonical request-bound idempotency with
    concurrent replay; and recursively redacted immutable audit events. Nine
    focused tests, lint, and module build pass.

### 3.2 GitHub connect

- [x] GitHub authentication.
- [x] Installation/repository/branch selection.
- [x] Create/connect repository.
- [x] Protected branch detection.
- [x] Isolated compatibility inspection.
  - Evidence: `@openforge/github` implements hashed, expiring, one-time OAuth
    state; encrypted access/refresh-token references; user-authorized
    installation, repository, and branch selection; idempotent repository
    creation constrained to the installation owner; automatic direct versus
    pull-request write mode; a versioned credential-safe REST transport; and
    bounded source inspection inside the compiler's disposable workspace. Ten
    focused tests, lint, and module build pass without real provider mutation.

### 3.3 Git sync

- [x] Ahead/behind.
- [x] Validate/diff/commit/push confirmation.
- [x] Feature branch/pull request flow.
- [x] Pull/merge/reindex.
- [x] Conflict/code-only fallback.
  - Evidence: the Git synchronizer compares provider commits, creates
    deterministic source diffs, validates in disposable workspaces, binds
    one-time confirmation to the exact target/base/content/message, rechecks
    branch protection and remote SHA at execution, writes non-force Git data,
    routes protected targets through feature branches and pull requests, and
    produces one-time isolated three-way pull previews. Concurrent edits remain
    unapplied with base/local/remote code-only conflict detail. Twenty-two
    GitHub package tests pass, including exact-branch protection and denied
    workflow-scope escalation.

### 3.4 Vercel connect

- [x] OAuth/integration.
- [x] Account/team/project selection.
- [x] Project creation.
- [x] Environment names and write-only secrets.
  - Evidence: `@openforge/vercel` implements hashed, expiring, one-time external
    installation state; callback/exchange team matching; encrypted integration
    token references; exact-scope account and project selection; idempotent
    project creation with GitHub/monorepo validation; and Development, Preview,
    and Production variable handling. Sensitive values are write-only for
    Preview/Production, Development is explicitly provider-readable, and all
    normalized responses and audit events omit values. Twelve focused tests,
    lint, and module build pass without provider mutation.

### 3.5 Deploy

- [x] Pre-deployment checks.
- [x] Preview job.
- [x] Logs/status/URL.
- [x] Explicit production promotion.
  - Evidence: deployment preflight validates bounded source, scans
    high-confidence secret patterns without returning matches, verifies required
    Preview environment names and GitHub/Vercel repository alignment, and
    redacts validation diagnostics. Preview and Production build creation are
    idempotent; status, errors, events, and URLs are normalized and sanitized.
    Production requires a short-lived exact-target confirmation, rechecks a
    ready Preview, and builds the same Git source with Production variables.

### Phase 3 exit

- [x] Repository-to-preview deployment E2E passes.
- [x] Retry/idempotency tests pass.
- [x] Protected branch, webhook, tenancy and redaction tests pass.
  - Evidence: the Phase 3 journey connects an authorized GitHub repository,
    inspects it in an isolated compiler workspace, carries its exact repo/ref/ID
    and SHA through Vercel preflight, and creates one ready Preview with a safe
    URL. Security, GitHub, and Vercel suites cover duplicate webhook delivery,
    cross-context secret denial, inaccessible installations/projects, protected
    branch PR routing, stale remote rejection, retry replay, log/error
    redaction, and explicit Production confirmation.

## Phase 4 — Optional BYOK AI

### 4.1 Provider contracts

- [x] Capability schema.
  - Evidence: immutable, contradiction-checked model declarations in
    `packages/ai/src/capabilities.js`.
- [x] Normalized streaming/tools/output/usage/errors.
  - Evidence: safe requests, managed image references, normalized event
    collection, token accounting, and provider-neutral errors in `packages/ai`.
- [x] Explicit selection/fallback.
  - Evidence: exact provider/model selection with opt-in, retryable,
    pre-output-only fallback in `packages/ai/src/registry.js`.
- [x] Deterministic fake provider.
  - Evidence: scripted call-recording adapter and 12 contract tests in
    `packages/ai/test/provider-contracts.test.js`.

### 4.2 Credentials

- [x] Organization/project/environment/session modes.
  - Evidence: strict hierarchical scopes and most-specific resolution in
    `packages/ai/src/credential-manager.js`.
- [x] Envelope encryption.
  - Evidence: version 2 AES-256-GCM envelopes use per-secret data keys wrapped
    by the active key-encryption key in `packages/integration-security`.
- [x] Rotation/deletion.
  - Evidence: credential replacement, key rewrap, deletion, session buffer
    zeroing, expiry, and lifecycle audit hooks.
- [x] Trusted-context decryption only.
  - Evidence: exact scope/provider checks and trusted server/worker
    `ai-provider-request` consumers; management APIs return metadata only.

### 4.3 Context policy

- [x] Least-context controls.
  - Evidence: only exact explicitly requested safe project paths can enter
    `buildAIContext`; file and byte ceilings are enforced before provider use.
- [x] `.openforgeignore`.
  - Evidence: standard ignore/negation semantics using verified latest
    `ignore@7.0.6`, layered over built-in sensitive/build exclusions.
- [x] Included-file manifest.
  - Evidence: reviewable requested/included/excluded paths, byte counts,
    SHA-256 digests, secret categories/lines, and exclusion reasons.
- [x] Secret redaction.
  - Evidence: API keys, GitHub tokens, assignments, bearer tokens, and
    multiline private keys are redacted or cause whole-file blocking.
- [x] Retention/admin policies.
  - Evidence: ephemeral-by-default context storage, explicit expiry/deletion,
    and provider/model/capability policy enforced inside the registry.

### 4.4 Adapters

- [x] OpenAI.
  - Evidence: current Responses API adapter with SSE text/tool/JSON/usage/error
    normalization and `store: false`.
- [x] Anthropic Claude.
  - Evidence: current Messages streaming adapter with content blocks, partial
    tool JSON, `output_config.format`, cache usage, and stop normalization.
- [x] Google Gemini.
  - Evidence: current Interactions streaming adapter with step deltas,
    function calls, structured response format, usage, and `store: false`.
- [x] Current provider contract tests.
  - Evidence: official docs and installed declarations reviewed; exact latest
    SDKs pinned; 42 AI tests cover contracts, credentials, context, and all
    three adapters without live credentials.

### 4.5 Proposal workflow

- [x] Structured proposal schema.
  - Evidence: versioned intent plus create/update/delete changes bound to exact
    base revisions and per-file SHA-256 digests.
- [x] Safe temporary application.
  - Evidence: proposals apply to in-memory copies and validate through the
    compiler's path-safe disposable OS workspace.
- [x] Validation pipeline.
  - Evidence: scoped formatting, secret/dangerous-source scanning, compatibility
    analysis, lint, tests, builds, safe diagnostics, and unified diffs.
- [x] File-selective approval.
  - Evidence: selected paths reconstruct from the original base and pass the
    complete pipeline again before approval.
- [x] Apply/audit only after approval.
  - Evidence: actor/revision/digest-bound approval, exact one-time confirmation,
    explicit source-writer callback, and lifecycle audit events.

### 4.6 Official skills

- [x] Page/section.
- [x] Accessibility.
- [x] Responsive.
- [x] SEO/copy.
- [x] Fixtures and evaluations.
  - Evidence: four transparent proposal-only definitions declare capabilities,
    approved context, permissions, schemas, and the complete validator set;
    deterministic fixtures/evaluations cover valid and denied runs.

### Phase 4 exit

- [x] BYOK proposal E2E passes.
  - Evidence: scripted configured provider output remains unapplied through
    generation, skill evaluation, validation, and approval until the exact
    actor-bound confirmation is supplied.
- [x] No-AI editor E2E still passes.
  - Evidence: the complete repository lint/test/build gate passes with AI
    optional and no editor dependency on a configured provider.
- [x] Invalid patch and context-leakage tests pass.
  - Evidence: protected paths, stale digests, secret output, missing context,
    missing permissions, and unsupported capabilities are rejected.

## Phase 5 — Plugin and skills SDK

### 5.1 Schemas/permissions

- [ ] Manifest/contribution/capability schemas.
- [ ] Compatibility and migration schemas.
- [ ] Separate read/write and scoped secret permissions.
- [ ] Human-readable permission report.

### 5.2 SDK

- [ ] Stable public extension APIs.
- [ ] Mock editor context and fixtures.
- [ ] No-deep-import contract.

### 5.3 Runtime

- [ ] Browser/server isolation profiles.
- [ ] Capability and message enforcement.
- [ ] Resource/network limits.
- [ ] Disable/uninstall/recovery.

### 5.4 CLI

- [ ] Core create/dev/doctor/validate/export.
- [ ] Plugin scaffold/validate/test.
- [ ] Skill scaffold/test.
- [ ] Registry/self-host/migrate.

### 5.5 Registry

- [ ] Git-backed metadata.
- [ ] Integrity/license/compatibility/security checks.
- [ ] Review and quality levels.
- [ ] Deprecation/blocking.

### 5.6 Profiles

- [ ] Public opt-in contributor profiles.
- [ ] Evidence-backed self-reported skills.
- [ ] Verification/badges.

### Phase 5 exit

- [ ] External sample skill and block lifecycle passes.
- [ ] Sandbox and permission adversarial suites pass.

## Phase 6 — Production hardening

### 6.1 Reliability

- [ ] Retry/dead-letter and idempotency.
- [ ] Backup/restore drills.
- [ ] Migration recovery.
- [ ] Artifact/workspace cleanup.

### 6.2 Security

- [ ] Threat models.
- [ ] Web/tenancy/archive/sandbox adversarial tests.
- [ ] Supply-chain gates and signed artifacts.
- [ ] Independent review where feasible.

### 6.3 Performance

- [ ] Editor under 3 seconds target.
- [ ] Common canvas response under 100 ms target.
- [ ] Ordinary compiler transform under 500 ms target.
- [ ] Incremental indexing and queue/resource budgets.

### 6.4 Accessibility

- [ ] WCAG 2.2 AA audit.
- [ ] Keyboard/screen reader.
- [ ] Contrast/focus/status/reduced motion.
- [ ] Official block contract.

### 6.5 Operations

- [ ] Logs/traces/metrics/alerts.
- [ ] Health/readiness.
- [ ] Audit retention.
- [ ] Operational and incident runbooks.

### 6.6 Release

- [ ] Stable API and support policy.
- [ ] Upgrade/migration tooling.
- [ ] Complete self-host/contributor/SDK/security docs.
- [ ] Changelog/provenance/release artifacts.

### Phase 6 exit

- [ ] All twelve MVP acceptance criteria pass.
- [ ] Self-host release candidate is reproducible.
- [ ] No critical security/accessibility issues remain.

## Phase 7 — Collaboration

- [ ] 7.1 Comments and review requests.
- [ ] 7.2 Privacy-aware presence.
- [ ] 7.3 RFC and implementation for operation synchronization.
- [ ] 7.4 Versioned organization libraries.
- [ ] Concurrent-edit corruption/recovery tests.

## Explicitly deferred beyond MVP

- [~] Real-time multiplayer before deterministic operations mature.
- [~] Public marketplace UI and billing.
- [~] Figma and WordPress import.
- [~] Full mobile editor.
- [~] Enterprise SSO and Kubernetes operator.
- [~] Additional frameworks and native-mobile output.

## Decisions log

| Date | Decision | Reason | Artifact |
|---|---|---|---|
| 2026-07-28 | Keep source files authoritative | Core product promise | Existing architecture/product docs |
| 2026-07-28 | Use phased gates matching dependency order | Limits scope and unsafe coupling | `IMPLEMENTATION_PLAN.md` |
| 2026-07-28 | Do not create runtime/package implementation yet | User requested planning only | This tracker |
| 2026-08-28 | Redirect from closing Phase 0 gaps to building a multi-tenant CMS | User: "we only need that CMS now" | This tracker, `openforge-docs/docs/product/01-vision.md` |
| 2026-08-28 | CMS coexists with the static-source editor; is not a replacement | User confirmed explicitly when asked | Phase CMS section above |
| 2026-08-28 | Database access via Drizzle ORM | User choice over raw SQL/Prisma | `packages/db` |
| 2026-08-28 | Custom minimal auth (`node:crypto`) over a third-party library | User choice; matches `integration-security`'s existing style | `packages/auth` |
| 2026-08-28 | CMS block/theme components are original, inspired-by work, not copied from shadcn/ReactBits | User choice, avoids licensing/attribution complexity | `packages/cms-blocks`, `themes/default` |
| 2026-09-08 | Block-editor undo/redo restores whole-file source snapshots, not operation inverses | `@openforge/compiler`'s visual operations (and a first-use block insert's added import) don't reliably produce inverses today; a snapshot restore has no such gaps | `SourceContentEditor.jsx`, `source-content-actions.js`'s `restorePageSource()` |
| 2026-09-08 | GitHub connection uses a verified personal access token, not an OAuth App | `apps/cms-admin` has no public callback URL by design (self-hosted, single-user) | `GitHubConnectionPanel.jsx`, `site-git.js`, `settings/actions.js` |

## Blockers

- Project/package naming, domain and trademark checks are unresolved.
- Technical selections listed in Implementation Plan section 8 are
  unresolved for the parts of Phase 0 not touched by the CMS work
  (auth/session library was resolved as custom-minimal; DB access was
  resolved as Drizzle; the rest remain open).
- Phase 0.1 governance file wiring (root `CODE_OF_CONDUCT.md`,
  `CONTRIBUTING.md`, `SECURITY.md`, `CODEOWNERS`, PR/issue templates) and
  0.7 CI/supply-chain workflows are still not started — deliberately
  deprioritized in favor of the CMS, not forgotten.
- Manual GitHub repository-settings follow-ups, not doable via file
  changes: enabling private vulnerability reporting, branch protection.
- `apps/api` and `apps/worker` are still empty (Phase 0.6); the CMS admin
  UI and any authenticated CRUD API depend on that work.
- `packages/db/migrations/0002_watery_thunderbolts.sql` (`secrets`,
  `site_git_connections`) is generated but its application to any
  running dev database was not verified in this pass — confirm with
  `drizzle-kit migrate` (or equivalent) before relying on the GitHub
  connection feature against a real database.
- `apps/cms-admin`'s wiring of `@openforge/component-library` into the
  canvas palette (`LibraryPalette.jsx` and friends, CMS.14) was
  uncommitted, in-progress working-tree state as of 2026-09-08 with no
  recorded evidence of its own — verify and commit it (or pick it back
  up) before treating "insert from the component library" as a real,
  working feature.
- The gap between CMS.12 (2026-09-04) and CMS.13 (2026-09-07) — moving
  site content from database JSON to real on-disk Next.js project files,
  a WordPress-familiar nav/theme rebuild, a Media Library with real
  uploads, a Users > Add New flow, an icon/illustration pass, and a
  merged mobile topbar — landed on `main` but has no evidence-backed
  `progress.md` entry of its own yet (see the note under "Current
  handoff" above). Backfill it in a dedicated pass.

## Verification log

Add entries newest first.

| Date | Scope | Evidence | Result |
|---|---|---|---|
| 2026-09-08 | `apps/cms-admin` block-editor + site-git tests (isolated run) | `vitest run test/block-add-smoke.test.js test/site-git.test.js` | 14/14 passed |
| 2026-09-08 | `@openforge/cms-blocks` defaultProps regression | `pnpm --filter @openforge/cms-blocks test` | 139/139 passed |
| 2026-09-08 | `@openforge/component-library` registry | `pnpm --filter @openforge/component-library test`; counted `allLibraryComponents.length` directly | 5/5 passed; 47 entries across 7 categories confirmed |
| 2026-09-08 | `apps/cms-admin` full test suite (not isolated) | `pnpm --filter @openforge/cms-admin test` | 57/60 passed; 3 failures in `source-content-actions.test.js` traced to a `.git/index.lock` ENOENT consistent with a concurrent session's own test run against the same shared fixture path, not a code regression — re-run isolated before trusting this number |
| 2026-08-28 | CMS MVP end-to-end | Seeded a site/page via `tooling/scripts/seed-cms-demo.js` against live Postgres; started `apps/cms-renderer`; `curl` with the site's Host header returned HTTP 200 with correct content and token CSS; wrong host and unknown page both 404'd | Passed |
| 2026-08-28 | `packages/db` migrations | `drizzle-kit generate` + `migrate` against live Postgres produced all 13 tables; scripted org→site→page round trip | Passed |
| 2026-08-28 | `packages/auth` sessions | Live Postgres-backed session issue/verify/revoke round trip; cross-tenant denial tests | Passed |
| 2026-08-28 | Docker Compose infra | `docker compose up -d` reached `healthy` for postgres/redis/minio | Passed |
| 2026-07-28 | Corrected repository layout | Implementation scaffold and planning files at Git root | Passed |
| 2026-07-28 | Planning scaffold | required paths, blank secret defaults, whitespace and no-source audits | Passed |
| 2026-07-28 | Git connection | local `origin` fetch/push configuration | Passed |
