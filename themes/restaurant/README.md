# @openforge/theme-restaurant

A warm, hearth-toned OpenForge CMS theme for restaurants, bars, and
hospitality sites — and a complete six-page example site to install with it.

Blocks are shared across every OpenForge theme, so this package does not
reimplement any of them. What makes it a *restaurant* theme is three
things: which blocks each region offers, the design tokens it overrides,
and a worked example that shows how the shared blocks map onto restaurant
content.

## Visual identity

Warm cream, fired clay, generous corners, and a serif body face. The intent
is a printed menu on unbleached paper, not a SaaS landing page.

| Token                | Value                                          | Why                                                                                             |
| -------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `color.ink`          | `#2c1a15`                                      | Roasted-cocoa brown rather than near-black — 15:1 on cream, but warm instead of clinical.        |
| `color.paper`        | `#fffaf3`                                      | Card and surface white, faintly warm so raised surfaces still read as paper.                     |
| `color.background`   | `#faf3ea`                                      | The page ground: warm cream, the colour of unbleached linen.                                     |
| `color.orange-500`   | `#8a3324`                                      | Deep terracotta — the brand colour. 7.4:1 on the cream ground, so it is safe for headings.       |
| `color.action`       | `#a34530`                                      | A brighter ember for links and buttons, distinct from terracotta surfaces. 5.4:1 on cream (AA).  |
| `space.section`      | `5rem`                                         | More air between sections; menus and galleries need room to breathe.                             |
| `radius.control`     | `0.75rem`                                      | Softly rounded buttons and inputs.                                                               |
| `radius.card`        | `1.75rem`                                      | Generously rounded cards — the single strongest signal that this is hospitality, not enterprise. |
| `font.body`          | `Georgia, "Iowan Old Style", "Times New Roman", serif` | A serif body face, for the printed-menu feel. All system fonts; nothing to download.  |
| `font.size-body`     | `1.0625rem`                                    | A touch larger, because serif text at 16px reads small.                                          |
| `font.weight-strong` | `600`                                          | 700 is shouty in a serif; 600 emphasises without going slab.                                     |
| `line-height.body`   | `1.7`                                          | Long menu descriptions stay readable.                                                            |
| `shadow.card`        | `0 1.25rem 3rem rgb(44 26 21 / 0.16)`          | The card shadow is tinted brown rather than grey, so nothing looks cold against the cream.       |

## Regions

- **`page-body`** — the full restaurant set: `hero`, `banner`, `pricing`
  (used for menu courses), `carousel` + `carousel-slide` (food and room
  galleries), `icon-box` (hours, location, reservations), `logo-cloud` +
  `logo-item` (press mentions), `testimonial`, `rating`, `accordion` +
  `faq-item`, `timeline` + `timeline-step`, `stats-row` + `stat`,
  `team-member`, `data-table`, `feature-list`, `marquee-text`, plus the
  general-purpose `heading`, `rich-text`, `image`, `button`, `cta`,
  `columns`, `divider`, and `spacer`.
- **`post-body`** — a narrower editorial set for the journal.
- **`footer`** — `footer` plus the `rich-text` its links slot accepts.

Container blocks are always listed alongside the child block their slot
accepts, so the editor can actually add a slide to a gallery or a course to
a timeline.

## Templates

`page`, `post`, and `notFound`, wrapped in `of-theme-restaurant-*` class
names. The page template renders an optional `page.eyebrow` above the
title (used by the example site for lines like "Served Wednesday to
Sunday"). The not-found page offers the three routes someone who mistyped a
URL actually wants: home, the menu, and a booking.

Note that the page template already renders the page `<h1>`, so the example
site uses `hero` only on the home page and `heading` (an `<h2>`) elsewhere —
one `<h1>` per page.

## The example site

`src/example-site.js` exports `exampleSite`, a full working site for an
invented tenant: **Ember & Alder**, a forty-two seat wood-fired restaurant
in a converted grain mill. Every page's `blocks` array is a real content
tree in exactly the shape `@openforge/renderer`'s `parseContentTree`
accepts, with every required prop on every block supplied.

| Page              | What it demonstrates                                                                                         |
| ----------------- | ------------------------------------------------------------------------------------------------------------ |
| `/`               | Announcement banner, hero, kitchen stats, a food carousel, hours/location/reservation icon boxes, press logo cloud, testimonial, rating, and a booking CTA. |
| `/menu`           | `pricing` blocks used as menu courses — dish name, price, and description lines — grouped by heading, with a by-the-glass `data-table` and a dietary FAQ.   |
| `/gallery`        | Two carousels (the room, the fire), a full-width feature image with a caption, and a photo credit.                                                          |
| `/our-story`      | Long-form narrative, a `timeline` of the mill's conversion, three `team-member` cards, and a commitments checklist.                                         |
| `/reservations`   | Service-hours `data-table`, walk-in and large-party icon boxes, a four-item booking FAQ, an allergen `alert`, and contact details.                          |
| `/private-events` | `columns` comparing three ways to take the room, three `pricing` packages (one featured), an inclusions list, and an enquiry CTA.                           |

`exampleSite.footer` is a separate content tree for the `footer` region.

Images are inline SVG placeholders generated by a local `artwork()` helper,
so the example renders with no external asset dependency and no broken
images. Replace every `src` with real photography before publishing.

## Usage

```js
import {
  restaurantTheme,
  restaurantThemeBlockRegistry,
  exampleSite,
} from "@openforge/theme-restaurant";
import { createRenderer } from "@openforge/renderer";

const renderer = createRenderer({
  theme: restaurantTheme,
  blockRegistry: restaurantThemeBlockRegistry,
});

const home = exampleSite.pages[0];
const body = renderer.renderTree(home.blocks);
```
