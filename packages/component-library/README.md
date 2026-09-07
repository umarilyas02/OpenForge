# `@openforge/component-library`

A local, portable catalog of reusable UI component variants — navs,
footers, heroes, blog sections, product pages, grids, and custom
one-offs — harvested and generalized from real reference projects on disk
(under `E:\Projects\CODE`, `E:\Projects\ERPS`, `E:\Projects\SEO`, etc.) so
OpenForge can offer proven, varied starting points instead of a single
generic block per category.

This package is intentionally a static, in-repo catalog for now. Later, a
separate service will read from a package shaped exactly like this one (or
replace it) to serve components on demand — so keep entries here
self-contained and served-ready.

## Layout

Each category lives in its own file and exports an array of component
definitions:

- `src/nav.js` — `navComponents`
- `src/footer.js` — `footerComponents`
- `src/hero.js` — `heroComponents`
- `src/blog.js` — `blogComponents`
- `src/product.js` — `productComponents`
- `src/grid.js` — `gridComponents` (features, stats, testimonials, pricing,
  FAQ, CTA, team, gallery — supporting sections that aren't nav/footer/hero)
- `src/custom.js` — `customComponents` (distinctive, project-specific
  patterns that don't fit elsewhere: dashboards, catalogs, trackers, chat
  widgets, forms, etc.)

`src/index.js` aggregates every category into `allLibraryComponents` and
exposes `libraryRegistry` (list/get/byCategory/search/createInsertion),
built the same way `@openforge/blocks` builds its official registry.

## Definition shape

Every entry must satisfy `libraryComponentSchema` (see `src/schema.js`):

```js
{
  schemaVersion: 1,
  id: "nav.simple-centered",        // "<category>.<kebab-slug>", unique
  name: "Simple Centered Nav",
  category: "nav",                   // one of libraryCategories
  description: "...",
  tags: ["nav", "centered", "minimal"],
  sourceProject: "portfolio",        // which project on disk this came from
  exportName: "SimpleCenteredNav",   // PascalCase, matches the component fn
  fileName: "SimpleCenteredNav.jsx", // PascalCase file name
  dependencies: [],                  // npm deps beyond react (keep empty when possible)
  defaultProps: { brand: "Acme" },
  accessibility: ["..."],            // at least one concrete a11y note
  source: `...self-contained JSX component source as a string...`,
  styles: `...scoped CSS as a string...`,
}
```

## Authoring rules

1. **Self-contained.** `source` is the full contents of a standalone
   `.jsx` file: only `react` as a runtime dependency (no project-specific
   imports, no relative imports back into the source project, no CMS
   coupling). Prefer inline SVG over icon libraries so the component has
   zero extra dependencies; if a dependency is unavoidable, declare it in
   `dependencies`.
2. **Props-driven, with sane defaults.** Every component must render
   sensible placeholder content with zero props (default parameter values
   mirroring `defaultProps`), exactly like the blocks in
   `@openforge/cms-blocks` and `@openforge/blocks`.
3. **Scoped styles.** `styles` is plain CSS (no Tailwind, no CSS-in-JS) with
   every rule scoped under a root class unique to that component (e.g.
   `.ofl-nav-simple-centered`) so many variants can be previewed on one page
   without collisions. Namespace prefix: `ofl-` (OpenForge Library).
4. **No secrets, no real customer data, no copyrighted imagery.** Replace
   real logos/photos/copy from the source project with generic placeholder
   text, initials, or simple CSS/SVG shapes. The goal is the *pattern*
   (layout, interaction, structure), not the original brand.
5. **Real variety per category.** Each category should have several
   genuinely different layouts/structures (not the same component with
   different copy) — pull from as many distinct source projects as
   reasonably apply.
6. **Attribution.** Set `sourceProject` to the folder name the pattern was
   adapted from (e.g. `"FitGrips-Frontend"`, `"aqsurgical"`), so provenance
   stays traceable.
7. **Validated.** `pnpm --filter @openforge/component-library test` must
   pass: unique ids, unique file names per category, schema-valid shape.
