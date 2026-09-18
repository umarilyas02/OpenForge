# @openforge/theme-music

A band / musician / record-label theme for the OpenForge CMS. It ships the
three standard templates (`page`, `post`, `notFound`), four curated block
regions, a full dark neon purple-magenta token palette, and a five-page
example site you can load as real content.

## Visual identity

Dark and high-energy: a near-black page ground, a vivid neon
purple-magenta accent used for links, buttons, and glowing card shadows,
and a bold geometric display typeface pushed to extra-bold weight for
headings and emphasis. Section padding is tightened from the default
`4rem` to `5rem` and body copy is set a touch looser (`1.55` line height)
so long tour and bio copy stays readable against the dark ground.

## Token overrides

Every key below is a real token `name` from `@openforge/design-tokens`, so
each one actually lands in the generated `:root` CSS.

| Token                | Value                                                             | Why                                                                          |
| -------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| `color.ink`          | `#f5eefc`                                                          | Near-white text with a faint lavender cast, for high contrast on the dark ground. |
| `color.paper`        | `#140a1d`                                                          | A near-black surface used as text-on-accent color (button labels, ghost surfaces). |
| `color.background`   | `#0a0710`                                                          | Near-black page ground with a violet cast, the theme's defining surface.      |
| `color.orange-500`   | `#c026d3`                                                          | The brand accent token; neon purple-magenta replaces OpenForge orange.        |
| `color.action`       | `#e94ff5`                                                          | A brighter neon magenta for links, buttons, and focus states — ~8:1 on the near-black ground. |
| `space.section`      | `5rem`                                                             | Tighter than the default so pages feel punchy rather than airy.               |
| `radius.card`        | `0.75rem`                                                          | Moderately rounded — modern, not soft.                                       |
| `radius.control`     | `0.375rem`                                                         | Sharper than the card radius so buttons read as more aggressive controls.     |
| `font.body`          | `Space Grotesk, Inter, Segoe UI, Helvetica Neue, Arial, sans-serif` | A bold geometric sans that still reads well at body size.                    |
| `font.size-body`     | `1.0625rem`                                                        | A nudge up from 16px for comfortable long-form reading.                       |
| `font.weight-strong` | `800`                                                              | Extra-bold rather than semibold, for loud, poster-style headings.             |
| `line-height.body`   | `1.55`                                                             | Slightly looser leading so multi-line copy stays readable on a dark ground.    |
| `shadow.card`        | `0 0 2.5rem rgb(233 79 245 / 0.35)`                                | A soft neon magenta glow instead of a dark drop shadow, which would vanish on a near-black page. |

## Regions

- **header** — announcement and navigation blocks (`navbar`, `banner`,
  `marquee-text`, `badge`, `button`).
- **page-body** — the full kit: hero, feature-list, icon-box,
  spotlight-card, pricing, comparison-table, testimonial, stats-row,
  logo-cloud, accordion, timeline, carousel, image-gallery, location-card,
  tabs, cta, plus the general-purpose blocks (heading, rich-text, image,
  button, columns, divider, spacer, footer, social-links) so an editor is
  never boxed in.
- **post-body** — a narrower, article-appropriate set.
- **footer** — the `footer` and `social-links` blocks.

## `src/example-site.js`

`exampleSite` is an array of five page fixtures — `{ path, title, blocks }`
— where `blocks` is a real content tree (`{ blockId, blockVersion, props,
slots }`) for the fictional dark electro-rock band **Neon Requiem**, on
their own label, Requiem Sound:

| Path       | What it demonstrates                                                                                          |
| ---------- | ---------------------------------------------------------------------------------------------------------------- |
| `/`        | Announcement banner, hero, a marquee ticker, press logo cloud, stats row, spotlight cards for three eras, a pre-save progress bar, feature list, two press testimonials, closing CTA, footer, and social links. |
| `/tour`    | Countdown timer to the tour's opening night, an upcoming-dates table, a tour-history timeline, a flagship venue location card, and a tour FAQ accordion. |
| `/music`   | Video embed, album art, a press rating, tabs for tracklist/credits/story, a "where to listen" columns block, a behind-the-scenes carousel, a press photo gallery, three merch/vinyl pricing tiers, and a format comparison table. |
| `/about`   | Narrative rich text, a stats row, a band-history timeline, four team members, and a crew avatar group.            |
| `/contact` | A three-column contact layout, a booking contact form, a label-office location card, a booking FAQ accordion, and a newsletter signup. |

The test suite parses every page with `parseContentTree` and renders every
node through `createRenderer`, which runs each block's required-prop
validation — so the example site is proven renderable content, not just
plausible-looking JSON.
