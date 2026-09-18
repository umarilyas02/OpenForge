# @openforge/theme-beauty

A salon / day-spa theme for the OpenForge CMS. It ships the three standard
templates (`page`, `post`, `notFound`), four curated block regions, a full
blush-pink-and-cream token palette, and a five-page example site you can
load as real content.

## Visual identity

Soft and unhurried: a dusty-rose brand accent on a warm blush-cream page
ground, a warm plum-brown ink rather than pure black, generously rounded
cards, fully pill-shaped buttons and controls, and a light, elegant serif
body face with loose leading so long treatment descriptions still feel
calm rather than clinical.

## Token overrides

Every key below is a real token `name` from `@openforge/design-tokens`, so
each one actually lands in the generated `:root` CSS.

| Token                | Value                                                    | Why                                                                   |
| -------------------- | --------------------------------------------------------- | ---------------------------------------------------------------------- |
| `color.orange-500`   | `#d98fa2`                                                  | The brand accent token; dusty rose replaces OpenForge orange.          |
| `color.action`       | `#a8445f`                                                  | A deeper rose for links and buttons, ~5.7:1 on white.                  |
| `color.ink`          | `#3d2b2f`                                                  | Warm plum-brown, softer than pure black next to a blush ground.        |
| `color.paper`        | `#fffbfa`                                                  | Cards and surfaces stay warm ivory, never a clinical stark white.      |
| `color.background`   | `#fdf1ee`                                                  | Soft blush-cream page ground, the theme's signature backdrop.          |
| `space.section`      | `5rem`                                                     | Relaxed, spa-like breathing room between sections.                     |
| `radius.control`     | `999px`                                                    | Fully rounded pill buttons and inputs for a soft, unhurried feel.      |
| `radius.card`        | `1.75rem`                                                  | Generously rounded cards to match the pill controls.                   |
| `font.body`          | `"Cormorant Garamond", Garamond, "Times New Roman", Georgia, serif` | A light, elegant serif with real system fallbacks.        |
| `font.size-body`     | `1.0625rem`                                                | A nudge up from 16px so treatment copy stays easy to read.             |
| `font.weight-strong` | `600`                                                      | Semibold rather than bold, so emphasis stays gentle in a light serif.  |
| `line-height.body`   | `1.75`                                                     | Loose leading for an unhurried, spa-like reading rhythm.                |
| `shadow.card`        | `0 1.5rem 3rem rgb(168 68 95 / 0.14)`                      | A soft, warm rose-tinted lift instead of a hard grey drop shadow.       |

## Regions

- **header** — announcement-strip blocks only (`navbar`, `banner`,
  `marquee-text`, `badge`, `button`), so a seasonal package or a booking
  notice can sit above the page without editors rebuilding it per page.
- **page-body** — the full salon/spa kit: hero, feature-list, icon-box,
  spotlight-card, pricing, testimonial, stats-row, team-member,
  location-card, image-gallery, contact-form, newsletter-signup,
  social-links, accordion, timeline, plus the general-purpose blocks
  (heading, rich-text, image, button, columns, divider, spacer) so an
  editor is never boxed in.
- **post-body** — a narrower, article-appropriate set.
- **footer** — the `footer` and `social-links` blocks.

## `src/example-site.js`

`exampleSite` is an array of five page fixtures — `{ path, title, blocks }`
— where `blocks` is a real content tree (`{ blockId, blockVersion, props,
slots }`) for the fictional salon and day spa **Petalwood Spa & Salon**:

| Path         | What it demonstrates                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------------------- |
| `/`          | Announcement banner, hero, press logo cloud, stats row, feature list, three spotlight service cards, an avatar group, two testimonials, a rating, a newsletter signup, and a closing CTA. |
| `/services`  | Hero, four icon boxes, three pricing packages (with the middle plan featured), an add-on price table, a feature list, a booking-policy alert, and a services FAQ accordion. |
| `/gallery`   | Hero, a six-photo image gallery of the space and results, narrative rich text, a standalone button, and a closing CTA. |
| `/about`     | Narrative hero and rich text, a founder portrait image, a stats row, a four-step company timeline, and three team members. |
| `/contact`   | Hero, a location card with hours and phone, a contact form, social links, a walk-in-policy alert, and a pre-booking FAQ. |

The test suite parses every page with `parseContentTree` and renders every
node through `createRenderer`, which runs each block's required-prop
validation — so the example site is proven renderable content, not just
plausible-looking JSON.
