# @openforge/theme-magazine

An OpenForge CMS theme for magazines, journals, and long-form blogs: content
first, chrome last. It ships the three standard templates (`page`, `post`,
`notFound`), four curated block regions, and a complete six-page example site
so a new install has something real to look at.

## Visual identity

Newsprint, not marketing page. Near-black ink on pure white paper, one
assertive editorial red, hard corners, no shadows, and a reading column that
is deliberately denser than the default theme's.

| Token               | Value                          | Why                                                                             |
| ------------------- | ------------------------------ | ------------------------------------------------------------------------------- |
| `color.ink`         | `#0b0b0c`                      | Near-black rather than pure black: full contrast without the glare on long text. |
| `color.paper`       | `#ffffff`                      | Pure white ground. Nothing tinted, nothing "warm".                              |
| `color.background`  | `#ffffff`                      | Page background follows paper, so features run edge to edge.                    |
| `color.orange-500`  | `#d6002a`                      | The one accent: section kickers, rules, badges. 5.4:1 on white.                 |
| `color.action`      | `#c40026`                      | A half-step deeper for link text and focus rings — 6.2:1 on white.              |
| `font.body`         | Iowan Old Style / Charter / Georgia / serif | Serif-leaning stack for reading stamina; all real system fallbacks. |
| `font.size-body`    | `1.0625rem`                    | A touch above 16px, which serifs need to hold up.                              |
| `font.weight-strong`| `800`                          | Headlines that can carry a front page.                                          |
| `line-height.body`  | `1.45`                         | Tighter than the 1.6 default: a magazine column, not a landing page.            |
| `radius.card`       | `0`                            | Print sensibility. Nothing on the page is a rounded rectangle.                  |
| `radius.control`    | `0`                            | Buttons and inputs match the square grid.                                       |
| `shadow.card`       | `none`                         | Cards are separated by rules and whitespace, never elevation.                   |
| `space.section`     | `3.25rem`                      | Denser vertical rhythm so more stories reach the fold.                          |

Because blocks are shared across all OpenForge themes rather than
reimplemented per theme, these token overrides are the whole differentiation
mechanism — change them and every block on every page follows.

## Regions

- **masthead** — banner, ticker, badges, and rules for the top of the site.
- **page-body** — the full editorial toolkit for section fronts and standing pages.
- **post-body** — a narrower reading set: text, images, pull quotes, bylines, tables.
- **footer** — the site footer.

## The example site

`src/example-site.js` exports `exampleSite`, a complete demo publication —
_Grain & Signal_, a **fictional** monthly on design, technology, and the
culture around them. Everything in it (the magazine, its writers, the foundry
in the lead feature) is invented; nothing there reports on real people,
companies, or events.

| Page                            | Template | What it demonstrates                                                                              |
| ------------------------------- | -------- | ------------------------------------------------------------------------------------------------ |
| `/` — front page                | `page`   | Issue banner, marquee ticker, hero masthead, lead story with captioned image, three story cards, desk columns, contributor avatars, newsletter CTA. |
| `/stories/the-typeface-that-outlived-its-foundry` | `post` | Long-form article: category badge, avatar byline, multi-paragraph reporting, captioned photo, pull quote, feature list, closing CTA. |
| `/culture` — section front      | `page`   | Gradient section title, desk description, four editor's picks as cards, submission checklist.       |
| `/about` — masthead             | `page`   | Publication hero, stats row, three staff bios, a four-step history timeline, editorial standards list. |
| `/newsletter` — The Dispatch    | `page`   | Subscribe banner, what's-in-every-letter list, a membership-tier data table, and a pre-subscribe FAQ accordion. |
| `/contact` — contact & advertise| `page`   | Desk-by-desk contact columns, a print rate-card table, icon boxes for post and response times, FAQ. |

Every page's `blocks` array is a valid renderer content tree — an array of
`{ blockId, blockVersion, props, slots }` nodes using only official CMS blocks,
with every required prop supplied and every slot within its declared min/max.
The test suite parses and renders all of them.

## Usage

```js
import {
  exampleSite,
  magazineTheme,
  magazineThemeBlockRegistry,
} from "@openforge/theme-magazine";
import { createRenderer } from "@openforge/renderer";

const renderer = createRenderer({
  theme: magazineTheme,
  blockRegistry: magazineThemeBlockRegistry,
});

const [home] = exampleSite.pages;
const tree = renderer.renderTree(home.blocks);
```
