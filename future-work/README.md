# Future work

Code that isn't part of the active build/lint/test pipeline right now, kept
for later rather than deleted. Nothing under `future-work/` is included in
`pnpm-workspace.yaml`'s globs, so it's invisible to `pnpm install`, `turbo
run build/test/lint`, and every other root script.

## `cms-renderer/`

The multi-tenant, public-facing Next.js app that resolves a site by Host
header and renders its published content from Postgres (originally
`apps/cms-renderer`). Moved here because the CMS's current focus is the
admin experience — building, previewing, exporting, and pushing a site's
real project to your own GitHub repo — not OpenForge hosting sites
publicly itself.

To bring it back: `git mv future-work/cms-renderer apps/cms-renderer`, then
`corepack pnpm install`. Nothing else in the workspace depends on its code
(only `NEXT_PUBLIC_CMS_RENDERER_ORIGIN`/`viewSiteHref` in `apps/cms-admin`
reference its URL as a plain string, not an import), so nothing else needs
to change to restore it.
