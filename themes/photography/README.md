# @openforge/theme-photography

An image-forward, minimal theme for a photography studio or portfolio
site on the OpenForge CMS. It ships the three standard templates (`page`,
`post`, `notFound`), four curated block regions, a near-black token
palette, and a five-page example site you can load as real content.

## Visual identity

Huge imagery and very little chrome: a near-black page ground, white type,
square corners, and a single warm sand accent used sparingly for icons and
highlights rather than a saturated brand color. Section padding is opened
up to `7rem` so large photographs and their captions get room to breathe,
and card "elevation" is a hairline border instead of a soft shadow — the
photograph is the surface, not a floating panel on top of one.

## Token overrides

Every key below is a real token `name` from `@openforge/design-tokens`, so
each one actually lands in the generated `:root` CSS.

| Token                | Value                                                          | Why                                                                     |
| -------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `color.ink`          | `#f5f3ee`                                                        | Warm off-white type, readable on a near-black ground without glaring.     |
| `color.paper`        | `#101010`                                                        | Card and surface color: a hair lighter than the page ground.              |
| `color.background`   | `#050505`                                                        | Near-black page ground so full-bleed photographs read edge to edge.       |
| `color.orange-500`   | `#cbb896`                                                        | The brand accent token; a muted warm sand replaces OpenForge orange.      |
| `color.action`       | `#f5f3ee`                                                        | Buttons and links stay near-white for maximum contrast on dark surfaces. |
| `space.section`      | `7rem`                                                           | Large photographs and captions need generous room between sections.       |
| `radius.card`        | `0`                                                              | Square corners — a print, not a rounded app card.                        |
| `radius.control`     | `0`                                                              | Buttons and inputs echo the same square corners.                          |
| `font.body`          | `"Neue Haas Grotesk Text", "Helvetica Neue", Helvetica, Arial, sans-serif` | A neutral, editorial grotesk stack with real system fallbacks.  |
| `font.size-body`     | `0.9375rem`                                                      | A slightly tighter body size keeps captions and copy out of the way.      |
| `font.weight-strong` | `500`                                                            | Medium rather than bold; text stays quiet next to the photography.       |
| `line-height.body`   | `1.6`                                                            | Loose leading for long-form bios and shoot notes.                        |
| `shadow.card`        | `0 0 0 1px rgb(245 243 238 / 0.08)`                              | A hairline border instead of a drop shadow — minimal chrome by design.   |

## Regions

- **header** — announcement-strip blocks only (`banner`, `marquee-text`,
  `badge`, `button`), so a booking notice can sit above the page without
  editors rebuilding it per page.
- **page-body** — the full kit, including `image-gallery` and
  `location-card` alongside the general marketing set (hero, feature-list,
  spotlight-card, pricing, testimonial, stats-row, logo-cloud, accordion,
  timeline, carousel, cta, contact-form, plus the general-purpose blocks)
  so a portfolio, pricing, and contact page can all be built from it.
- **post-body** — a narrower, article-appropriate set for behind-the-scenes
  writing about a shoot, including `image-gallery` for a shoot's contact
  sheet.
- **footer** — `footer` and `social-links`.

## `src/example-site.js`

`exampleSite` is an array of five page fixtures — `{ path, title, blocks }`
— where `blocks` is a real content tree (`{ blockId, blockVersion, props,
slots }`) for the fictional editorial and portrait practice **Halden
Studio**, run by photographer Odette Halden out of a converted print works
in Copenhagen:

| Path         | What it demonstrates                                                                                  |
| ------------ | -------------------------------------------------------------------------------------------------------- |
| `/`          | Announcement banner, hero, tagline marquee, three spotlight cards, a stats row, two testimonials, a scrolling "as featured in" logo cloud, closing CTA. |
| `/portfolio` | An eight-photo `image-gallery`/`gallery-item` grid of portrait and editorial work, plus a four-slide `carousel`/`carousel-slide` of behind-the-scenes frames. |
| `/about`     | Narrative rich text, a portrait image, a stats row, a four-step career timeline, and two team members. |
| `/services`  | Three pricing cards (with the editorial day rate featured), a booking alert, and a five-item FAQ accordion. |
| `/contact`   | A studio `location-card`, a `contact-form`, and a booking-deadline alert. |

`exampleFooter` is a separate export — a `footer` block with four footer
links plus a `social-links` block with three `social-link-item` entries.
It is kept apart from `exampleSite` because `footer` and `social-links`
only belong in the theme's `footer` region, never at the top level of a
page's own `page-body` content.

The test suite parses every page (and the footer) with `parseContentTree`
and renders every node through `createRenderer`, which runs each block's
required-prop validation — so the example site is proven renderable
content, not just plausible-looking JSON.
