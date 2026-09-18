# @openforge/theme-construction

A general-contractor / home-services theme for the OpenForge CMS. It ships
the three standard templates (`page`, `post`, `notFound`), four curated
block regions, a full safety-orange-on-charcoal token palette, and a
five-page example site you can load as real content.

## Visual identity

Rugged and trustworthy: a high-visibility safety-orange brand accent on a
charcoal, near-black ink, over a cool steel-gray page ground rather than
saturated color. Cards keep a modest, boxy radius instead of a soft pill
shape, section padding is tightened from the default `4rem` to `5rem` so
pages read dense and businesslike rather than airy, and body copy leans
bold (`font.weight-strong` at `800`) to read as confident and industrial
rather than delicate.

## Token overrides

Every key below is a real token `name` from `@openforge/design-tokens`, so
each one actually lands in the generated `:root` CSS.

| Token                | Value                                             | Why                                                                     |
| -------------------- | -------------------------------------------------- | ------------------------------------------------------------------------ |
| `color.orange-500`   | `#ff6a00`                                          | A true high-visibility safety orange, warmer and more saturated than default OpenForge orange. |
| `color.action`       | `#b34700`                                          | A darker burnt-orange for links and buttons, ~5.5:1 contrast on white.   |
| `color.ink`          | `#1c1f22`                                          | Charcoal near-black, the grounded, industrial counterpart to pure black. |
| `color.paper`        | `#ffffff`                                          | Cards and surfaces stay pure white against the tinted steel page ground.|
| `color.background`   | `#eef0f1`                                          | Cool steel-gray page ground so white cards read as elevated plate steel.|
| `space.section`      | `5rem`                                             | Tighter than the default marketing rhythm — dense and businesslike.     |
| `radius.card`        | `0.5rem`                                           | A boxy, only lightly rounded corner instead of a soft pill shape.       |
| `radius.control`     | `0.25rem`                                          | Buttons and inputs read closer to a stamped-metal edge.                 |
| `font.body`          | `Barlow, Roboto, Helvetica Neue, Arial, sans-serif` | A grotesk with real system fallbacks that stays legible at bold weights.|
| `font.size-body`     | `1.0625rem`                                        | A nudge up from 16px for long project-description copy.                 |
| `font.weight-strong` | `800`                                              | Extra-bold rather than semibold — confident, not delicate.              |
| `line-height.body`   | `1.6`                                              | Standard leading, kept comfortable for longer scope-of-work copy.       |
| `shadow.card`        | `0 0.75rem 2rem rgb(20 20 20 / 0.35)`              | A heavier, darker, grounded shadow instead of a soft colored glow.      |

## Regions

- **header** — announcement-strip blocks only (`banner`, `marquee-text`,
  `badge`, `button`), so a seasonal-scheduling or storm-response notice can
  sit above the page without editors rebuilding it per page.
- **page-body** — the full marketing kit: hero, feature-list, icon-box,
  spotlight-card, pricing, testimonial, stats-row, logo-cloud, accordion,
  timeline, carousel, image-gallery, location-card, cta, plus the
  general-purpose blocks (heading, rich-text, image, button, columns,
  divider, spacer, contact-form) so an editor is never boxed in.
  `image-gallery` and `location-card` are included here in addition to the
  saas theme's page-body set, since a project gallery and a find-us card
  are core to a contractor site.
- **post-body** — a narrower, article-appropriate set (e.g. a single
  project write-up or a seasonal-maintenance post).
- **footer** — the `footer` and `social-links` blocks.

## `src/example-site.js`

`exampleSite` is an array of five page fixtures — `{ path, title, blocks }`
— where `blocks` is a real content tree (`{ blockId, blockVersion, props,
slots }`) for the fictional general contractor **Ironclad Construction**:

| Path            | What it demonstrates                                                                                 |
| --------------- | ------------------------------------------------------------------------------------------------------ |
| `/`             | Announcement banner, hero, stats row, feature list, four service icon boxes, three spotlight cards, two testimonials, closing CTA. |
| `/services`     | Hero, four detailed service icon boxes, a four-step project timeline, a trade-by-trade data table, three pricing tiers, a process FAQ accordion. |
| `/projects`     | Hero, project stats, a six-photo image gallery, a featured-project before/during/after carousel, a project testimonial. |
| `/testimonials` | Hero, an aggregate rating, an avatar group of reviewers, four testimonials, a certifications logo cloud. |
| `/contact`      | Hero, a three-column contact layout, a location card with hours and phone, a contact form, a response-time alert, a pre-contact FAQ. |

The footer region (`footer` + `social-links`) is available to every page
through the manifest, matching the saas theme's own convention of not
instantiating the footer as a page in the example-site fixture — a site's
actual footer content is authored once and shared across pages, not
duplicated into each page's content tree.

The test suite parses every page with `parseContentTree` and renders every
node through `createRenderer`, which runs each block's required-prop
validation — so the example site is proven renderable content, not just
plausible-looking JSON.
