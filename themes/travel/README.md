# @openforge/theme-travel

A travel agency / tourism theme for the OpenForge CMS. It ships the three
standard templates (`page`, `post`, `notFound`), four curated block regions,
a full sunset-coral and cream-teal token palette, and a five-page example
site you can load as real content.

## Visual identity

Warm and adventurous: a saturated sunset-coral brand color on a soft cream
page ground, deep warm-teal ink instead of pure black, generously rounded
cards, and pill-shaped buttons and controls that echo the roundness of a
sun on the horizon. Section padding is opened up from the default `4rem` to
`6rem` so destination photography and long itinerary copy get room to
breathe.

## Token overrides

Every key below is a real token `name` from `@openforge/design-tokens`, so
each one actually lands in the generated `:root` CSS.

| Token               | Value                                          | Why                                                                   |
| ------------------- | ---------------------------------------------- | --------------------------------------------------------------------- |
| `color.orange-500`  | `#ff6b45`                                      | The brand accent token; sunset coral replaces OpenForge orange.       |
| `color.action`      | `#e8532c`                                      | A slightly deeper coral for links and buttons, with strong contrast on cream. |
| `color.ink`         | `#1f3d3a`                                      | Deep warm-teal near-black instead of pure grey.                       |
| `color.paper`       | `#fffaf3`                                      | Warm ivory cards and surfaces, never stark white against the cream ground. |
| `color.background`  | `#fdf3e7`                                      | Warm cream page ground that lets coral accents and photography pop.   |
| `space.section`     | `6rem`                                         | Destination imagery and itinerary copy need room between sections.    |
| `radius.card`       | `1.5rem`                                       | Rounder than the default — a softer, more breezy card shape.          |
| `radius.control`    | `999px`                                        | Fully pill-shaped buttons and controls for a friendly, adventurous feel. |
| `font.body`         | `Poppins, Segoe UI, Helvetica Neue, Arial, sans-serif` | A warm, rounded UI stack with real system fallbacks.           |
| `font.size-body`    | `1.0625rem`                                    | A nudge up from 16px for readable itinerary and story copy.           |
| `font.weight-strong`| `700`                                          | Bold rather than semibold; punchier next to big destination photos.   |
| `line-height.body`  | `1.65`                                         | Looser leading for multi-paragraph trip descriptions.                 |
| `shadow.card`       | `0 1.5rem 3rem rgb(31 61 58 / 0.14)`           | A large, soft, teal-tinted lift instead of a hard grey drop shadow.    |

## Regions

- **header** — announcement-strip blocks only (`navbar`, `banner`,
  `marquee-text`, `badge`, `button`), so a seasonal sale or booking notice
  can sit above the page without editors rebuilding it per page.
- **page-body** — the full travel kit: hero, feature-list, icon-box,
  spotlight-card, pricing, testimonial, stats-row, logo-cloud, accordion,
  timeline, carousel, image-gallery, location-card, cta, plus the
  general-purpose blocks (heading, rich-text, image, button, columns,
  divider, spacer) so an editor is never boxed in.
- **post-body** — a narrower, article-appropriate set.
- **footer** — the `footer` block plus `social-links`.

## `src/example-site.js`

`exampleSite` is an array of five page fixtures — `{ path, title, blocks }`
— where `blocks` is a real content tree (`{ blockId, blockVersion, props,
slots }`) for the fictional boutique travel agency **Sundrift Travel Co.**:

| Path            | What it demonstrates                                                                             |
| --------------- | -------------------------------------------------------------------------------------------------- |
| `/`             | Announcement banner, hero, "as featured in" logo cloud, stats row, feature list, three spotlight cards, two testimonials, closing CTA. |
| `/destinations` | Hero, a six-photo image gallery of destinations, a four-slide tour carousel, four regional icon boxes, a four-step planning timeline, a destination comparison data table, a feature list. |
| `/packages`     | Three pricing cards (with the middle plan featured), an early-bird discount alert, a five-item FAQ accordion. |
| `/about`        | Narrative rich text, a stats row, a company milestone timeline, three team members, a hiring CTA. |
| `/contact`      | A location card with the main office's address/hours/phone, a real contact form, a support-hours alert, and a short pre-booking FAQ. |

The test suite parses every page with `parseContentTree` and renders every
node through `createRenderer`, which runs each block's required-prop
validation — so the example site is proven renderable content, not just
plausible-looking JSON.
