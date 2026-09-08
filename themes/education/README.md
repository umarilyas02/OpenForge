# @openforge/theme-education

An OpenForge CMS theme for schools, academies, bootcamps, and online course
sites. It ships the three standard templates (`page`, `post`, `notFound`),
a block palette curated for a course site, an academic token identity, and
a complete six-page example site you can seed a demo from.

## Visual identity

Blocks are shared across every OpenForge theme, so a theme differentiates
itself through design tokens rather than by reimplementing components.
`manifest.js`'s `defaultTokenOverrides` sets:

| Token               | Value                                       | Why                                                                                                                |
| ------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `color.action`      | `#1e3a5f`                                   | A deep institutional navy for links, buttons, and focus rings — roughly 11.5:1 against white, so it stays readable. |
| `color.orange-500`  | `#f2a71b`                                   | One warm amber accent. Navy alone reads cold and corporate; amber is what makes it feel like a place people learn.  |
| `color.ink`         | `#101f33`                                   | Body text as a near-black navy rather than pure black, so long syllabus pages are less harsh.                       |
| `color.paper`       | `#ffffff`                                   | Cards and content surfaces stay pure white for contrast against the tinted page.                                    |
| `color.background`  | `#f6f8fb`                                   | A very light cool tint behind the page, so white cards read as raised.                                              |
| `radius.card`       | `0.75rem`                                   | Moderately rounded — friendly, but not the pill-shaped consumer look.                                               |
| `radius.control`    | `0.5rem`                                    | Slightly tighter than cards, so buttons stay crisp.                                                                 |
| `font.body`         | Source Sans 3 → Segoe UI → system fallbacks | A humanist sans that holds up at paragraph length, with a real fallback stack.                                      |
| `font.size-body`    | `1.0625rem`                                 | 17px: these pages are read, not skimmed.                                                                            |
| `font.weight-strong`| `600`                                       | Semibold instead of bold, which keeps headings calm next to the navy.                                               |
| `line-height.body`  | `1.7`                                       | Extra leading for long-form course descriptions and FAQ answers.                                                    |
| `space.section`     | `5rem`                                      | Generous section rhythm so a long curriculum page still has air.                                                    |
| `shadow.card`       | `0 0.75rem 2rem rgb(16 31 51 / 0.1)`        | A soft navy-tinted shadow rather than a neutral grey one.                                                           |

Only token names that actually exist in `@openforge/design-tokens`'
`defaultDesignTokens` are overridden; unknown keys would be silently ignored
by `renderSiteStyles`.

## Regions

- **`page-body`** — the course-site workhorses first (hero, banner,
  stats-row, feature-list, timeline, data-table, pricing, testimonial,
  rating, accordion, team-member, cta), then the general-purpose blocks
  every page still needs (heading, rich-text, image, video, button,
  columns, card, icon-box, alert, badge, progress, logo-cloud,
  spotlight-card, divider, spacer).
- **`post-body`** — prose-first, for course notes and cohort
  announcements, with room for a recorded session, a syllabus table, and an
  enrollment nudge.
- **`footer`** — the footer block.

Child-only blocks (`stat`, `faq-item`, `timeline-step`, `logo-item`) are
deliberately absent from the region lists, exactly as in the default theme:
they are inserted into their parent's slot, not at the top level. They still
resolve through the registry, so the example site's nested content renders.

## Templates

`page`, `post`, and `notFound`, each wrapped in a theme-specific class
(`of-theme-education-page`, `of-theme-education-post`,
`of-theme-education-not-found`) so a site stylesheet can target them. The
page template also renders an optional `page.description` under the title —
useful for a course subtitle.

## `src/example-site.js`

A full, valid content kit for a fictional part-time online school,
"Brightfield Academy". Every node is a real `{ blockId, blockVersion,
props, slots }` content-tree node that satisfies `parseContentTree` and
every block's required `editableFields`, and every top-level block is one
this theme's `page-body` region actually allows.

| Page               | What it demonstrates                                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------------------------- |
| `/`                | Announcement banner, hero, a stats row of programme facts, feature list, and a timeline of one week in a cohort.     |
| `/courses`         | Four course cards, a week-by-week syllabus data table, prerequisites feature list, and an enrollment call to action. |
| `/enrollment`      | Three pricing tiers (one featured), a side-by-side comparison table, and a four-step application timeline.           |
| `/instructors`     | Four team-member profiles plus a feature list explaining how mentoring is structured.                                |
| `/student-stories` | Four testimonials, three project cards, and a `columns` block of nested rich text on the hardest weeks.              |
| `/questions`       | An eight-item accordion of FAQ items, contact prose, and two button variants.                                        |

`exampleFooter` is exported separately as a one-node content tree for the
`footer` region.

All names, quotes, and prices are invented. The copy describes how the
programme is structured — hours, weeks, what you hand in — and explicitly
avoids outcome or placement claims; the student-stories page carries a note
saying so.

Images are inline `data:` URI colour swatches, so the example renders with
no network access and no binary assets in the package. Replace them when
seeding a real site.

## Scripts

Same as every other theme package: `build` (esbuild bundle), `lint`, and
`test` (Vitest).
