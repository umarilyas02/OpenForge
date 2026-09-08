# Future work

Code that isn't part of the active build/lint/test pipeline right now, kept
for later rather than deleted. Nothing under `future-work/` is included in
`pnpm-workspace.yaml`'s globs, so it's invisible to `pnpm install`, `turbo
run build/test/lint`, and every other root script.

**The active workspace is now just one product: `apps/cms-admin`** (plus
the packages/themes it actually depends on, and `services/python-analysis`
for real image analysis in the media library). Everything below is the
other, much earlier-stage product line — a visual editor for arbitrary,
exported Next.js codebases (not database/workspace content) — which isn't
the current focus. Nothing in the active workspace imports any of this
code; the only two exceptions are noted inline below.

## `apps/`

- **`web/`** — the visual Next.js project dashboard/editor for that other
  product line (this is what `EditorShell.jsx` belonged to).
- **`preview/`** — isolated preview-session policy/coordination for `web`.
- **`api/`**, **`worker/`**, **`docs/`** — were already empty (`.gitkeep`
  only) before this move; kept here as placeholders for the same
  not-current-focus product line rather than left scattered under `apps/`.
- **`cms-renderer/`** — the public, multi-tenant, database-content-driven
  site renderer, shelved earlier for a different reason (OpenForge hosting
  sites publicly isn't the current focus) — see the section below.

## `packages/`

All of these were part of the visual-editor product line's control/
extension/integration plane, with zero runtime dependents left in the
active workspace (verified by tracing `apps/cms-admin`'s actual
`dependencies` closure before moving anything):

- **`ai/`** — provider-neutral BYOK AI contracts (credential vault, context
  assembly, proposal pipeline) for that editor's AI-assisted patches.
- **`blocks/`** — a separate, small, versioned "official" block registry
  for exported landing pages — not `packages/cms-blocks`, which the CMS
  actually uses; don't confuse the two if this ever comes back.
- **`cli/`**, **`plugin-runtime/`**, **`plugin-sdk/`**, **`ui/`** — were
  already empty (`.gitkeep` only).
- **`editor/`** — canvas overlays and code-workspace exports for `apps/web`'s
  live editor (distinct from `apps/cms-admin`'s own, unrelated canvas).
- **`events/`** — in-process domain event publishing, unused by the CMS.
- **`github/`** — the heavier GitHub *App* + OAuth installation flow for a
  hosted, multi-tenant integration. The CMS has its own, much lighter
  personal-access-token connector (`apps/cms-admin/src/lib/
  github-connection.js`) built specifically because this package's
  installation-flow model doesn't fit a single self-hosted operator with no
  public callback URL — that file has a comment referencing this package
  for context; it's just a comment, not a real dependency.
- **`logger/`** — structured JSON logging, unused by the CMS directly.
- **`schemas/`** — shared runtime/error/audit/job contracts, unused by the
  CMS directly.
- **`vercel/`** — Vercel installation/deployment integration for the editor
  product line's own deploy workflow.

## `plugins/`

- **`examples/`**, **`official/`** (including `official/ai-skills`, the
  official BYOK AI skill definitions) — the plugin/skills SDK's example and
  official extensions, for the editor product line's extension host.

## `templates/`

- **`blank-next/`**, **`marketing/`**, **`portfolio/`** — starter Next.js
  projects a user of the *editor* product line would import/export from.
  Not used by the CMS, which generates each site's real project itself
  (`apps/cms-admin/src/lib/starter-template.js` and
  `theme-site-generator.js`) rather than starting from a checked-in
  template.

Removing these also meant deleting two tests in `packages/workspace/test/`
(`phase-one-roundtrip.test.js`, `phase-two-landing-page.test.js`) that
existed purely to exercise `templates/blank-next` + `packages/blocks` +
`packages/editor` together as an editor-product-line integration test —
and dropping `packages/workspace`'s now-dangling `devDependencies` on
`@openforge/blocks`/`@openforge/editor`. `packages/workspace`'s own
CMS-relevant tests (`workspace-manager.test.js`) are untouched.

## `cms-renderer/`

The multi-tenant, public-facing Next.js app that resolves a site by Host
header and renders its published content from Postgres (originally
`apps/cms-renderer`). Moved here first, separately from the batch above,
because the CMS's current focus is the admin experience — building,
previewing, exporting, and pushing a site's real project to your own
GitHub repo — not OpenForge hosting sites publicly itself.

## Bringing any of this back

`git mv future-work/<path> <original apps|packages|plugins|templates path>`,
then `corepack pnpm install`. For `packages/workspace` specifically, you'd
also want to re-add the `@openforge/blocks`/`@openforge/editor`
`devDependencies` and restore the two deleted test files from git history
if you bring `blocks`/`editor`/`templates/blank-next` back.
