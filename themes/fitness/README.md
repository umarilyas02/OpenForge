# @openforge/theme-fitness

A gym / personal-training / boutique-fitness-studio theme for the OpenForge
CMS. It ships the three standard templates (`page`, `post`, `notFound`),
four curated block regions, a full charcoal-and-crimson token palette, and a
six-page example site you can load as real content.

## Visual identity

Bold, energetic, and unmistakably a gym: a genuinely dark charcoal-black
page ground (rather than the usual light-page/dark-ink pairing most themes
use), off-white ink text for high contrast, one hot crimson accent doing
all of the shouting, heavier 800-weight display text, and a hard offset
accent-colored shadow instead of a soft diffuse one. Every block's CSS
derives its surfaces and borders from `color.ink` and `color.background`
with `color-mix()` rather than hardcoding a light background, so inverting
those two tokens produces a correctly contrasted dark theme throughout —
cards, footers, and borders all read cleanly on the dark ground without any
extra CSS.

## Token overrides

Every key below is a real token `name` from `@openforge/design-tokens`, so
each one actually lands in the generated `:root` CSS.

| Token                | Value                                                | Why                                                                     |
| -------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------ |
| `color.ink`           | `#f5f4f1`                                             | Off-white text — flipped from the usual near-black, since the page ground is dark. |
| `color.paper`         | `#ffffff`                                             | Kept white; still used for text on the solid-accent CTA/hero buttons.    |
| `color.background`    | `#0e0d0f`                                             | Deep charcoal-black page ground for the "bold and energetic" gym look.   |
| `color.orange-500`    | `#ff2140`                                             | The brand accent token; hot crimson replaces OpenForge orange.           |
| `color.action`        | `#ff3b57`                                             | A slightly lighter crimson for links and buttons, tuned for contrast on charcoal. |
| `space.section`       | `6rem`                                                | Long marketing pages need more air between sections.                     |
| `radius.card`         | `0.5rem`                                              | A small, purposeful radius — not soft, not fully brutalist.              |
| `radius.control`      | `0.25rem`                                             | Buttons and inputs echo the card radius at a smaller scale.              |
| `font.body`           | `'Archivo', 'Helvetica Neue', Helvetica, Arial, sans-serif` | A heavy grotesque with real system fallbacks, for confident headings. |
| `font.size-body`      | `1.0625rem`                                           | A nudge up from 16px for marketing-length paragraphs.                    |
| `font.weight-strong`  | `800`                                                 | Extra-bold rather than semibold, to match the theme's high-contrast, heavy-headline energy. |
| `line-height.body`    | `1.55`                                                | Tighter, punchier leading than a soft SaaS-style theme.                  |
| `shadow.card`         | `0.5rem 0.5rem 0 rgb(255 33 64 / 0.35)`               | A hard offset crimson shadow instead of a soft grey drop shadow.         |

## Regions

- **header** — announcement-strip and navigation blocks (`navbar`, `banner`,
  `marquee-text`, `badge`, `button`).
- **page-body** — the full marketing kit: hero, feature-list, icon-box,
  spotlight-card, pricing, comparison-table, testimonial, stats-row,
  logo-cloud, accordion, timeline, team-member, image-gallery,
  location-card, contact-form, social-links, carousel, cta, plus the
  general-purpose blocks (heading, rich-text, image, button, columns,
  divider, spacer) so an editor is never boxed in.
- **post-body** — a narrower, article-appropriate set.
- **footer** — the `footer` and `social-links` blocks.

## `src/example-site.js`

`exampleSite` is an array of six page fixtures — `{ path, title, blocks }` —
where `blocks` is a real content tree (`{ blockId, blockVersion, props,
slots }`) for the fictional gym **Ironclad Fitness Club**:

| Path           | What it demonstrates                                                                          |
| -------------- | ----------------------------------------------------------------------------------------------- |
| `/`            | Announcement banner, hero, stats row, feature list, three spotlight cards, a partner logo cloud, two member testimonials, closing CTA. |
| `/classes`     | Hero, four class-format icon boxes, a four-step "first week" timeline, a weekly class-schedule data table, a feature list. |
| `/membership`  | Three pricing cards (All-Access featured), a plan comparison table, a discount alert, a five-item FAQ accordion. |
| `/coaches`     | Hero, coaching-philosophy rich text, a staff stats row, four coach team-member cards.            |
| `/about`       | Founding-story rich text, a stats row, a four-step studio-history timeline, a four-photo facility image gallery. |
| `/contact`     | A find-us location card, a contact form, a social-links row, an hours alert, and a short pre-visit FAQ. |

The test suite (`test/fitness-theme.test.js`) parses every page with
`parseContentTree` and renders every node through `createRenderer`, which
runs each block's required-prop validation — so the example site is proven
renderable content, not just plausible-looking JSON.
