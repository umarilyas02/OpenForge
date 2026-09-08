# @openforge/theme-saas

A SaaS / startup marketing theme for the OpenForge CMS. It ships the three
standard templates (`page`, `post`, `notFound`), four curated block regions,
a full indigo-violet token palette, and a six-page example site you can load
as real content.

## Visual identity

Energetic, modern, and unmistakably product-led: a saturated indigo-violet
brand color on a soft lavender-grey page ground, near-black ink with a cool
blue cast rather than pure black, generously rounded cards, and a slightly
larger, looser body setting so long feature copy stays readable. Section
padding is opened up from the default `4rem` to `6rem` so a long marketing
page breathes between sections instead of running together.

## Token overrides

Every key below is a real token `name` from `@openforge/design-tokens`, so
each one actually lands in the generated `:root` CSS.

| Token               | Value                                          | Why                                                                   |
| ------------------- | ---------------------------------------------- | --------------------------------------------------------------------- |
| `color.orange-500`  | `#6d5efc`                                      | The brand accent token; indigo-violet replaces OpenForge orange.        |
| `color.action`      | `#5a4bf0`                                      | A slightly deeper indigo for links and buttons, ~5.7:1 on white.        |
| `color.ink`         | `#14142b`                                      | Blue-cast near-black, warmer with the violet accent than pure grey.     |
| `color.paper`       | `#ffffff`                                      | Cards and surfaces stay pure white against the tinted page ground.      |
| `color.background`  | `#f7f7fb`                                      | Soft lavender-grey page ground so white cards read as elevated.         |
| `space.section`     | `6rem`                                         | Long marketing pages need more air between sections.                    |
| `radius.card`       | `1rem`                                         | Rounded but not pill-shaped — current SaaS product-site convention.     |
| `radius.control`    | `0.5rem`                                       | Buttons and inputs echo the card radius at a smaller scale.             |
| `font.body`         | `Inter, Segoe UI, Helvetica Neue, Arial, sans-serif` | A neutral geometric UI stack with real system fallbacks.          |
| `font.size-body`    | `1.0625rem`                                    | A nudge up from 16px for marketing-length paragraphs.                   |
| `font.weight-strong`| `600`                                          | Semibold rather than bold; less shouty next to large headings.          |
| `line-height.body`  | `1.65`                                         | Looser leading for multi-line benefit copy.                             |
| `shadow.card`       | `0 1.5rem 3rem rgb(20 20 43 / 0.1)`            | A large, soft, blue-tinted lift instead of a hard grey drop shadow.     |

## Regions

- **header** — announcement-strip blocks only (`banner`, `marquee-text`,
  `badge`, `button`), so a launch or pricing-change notice can sit above the
  page without editors rebuilding it per page.
- **page-body** — the full marketing kit: hero, feature-list, icon-box,
  spotlight-card, pricing, testimonial, stats-row, logo-cloud, accordion,
  timeline, carousel, cta, plus the general-purpose blocks (heading,
  rich-text, image, button, columns, divider, spacer) so an editor is never
  boxed in.
- **post-body** — a narrower, article-appropriate set.
- **footer** — the `footer` block.

## `src/example-site.js`

`exampleSite` is an array of six page fixtures — `{ path, title, blocks }` —
where `blocks` is a real content tree (`{ blockId, blockVersion, props,
slots }`) for the fictional customer-operations product **Klarion**:

| Path        | What it demonstrates                                                                     |
| ----------- | ---------------------------------------------------------------------------------------- |
| `/`         | Announcement banner, hero, logo cloud, stats row, feature list, spotlight cards, two testimonials, closing CTA. |
| `/features` | Hero, four icon boxes, a four-step timeline of how a playbook runs, an integrations data table, a feature list. |
| `/pricing`  | Three pricing cards (with the middle plan featured), a discount alert, a five-item FAQ accordion. |
| `/about`    | Narrative rich text, a stats row, a company milestone timeline, three team members, a hiring CTA. |
| `/blog`     | A blog index built from four article cards plus a newsletter CTA.                          |
| `/contact`  | A three-column contact layout, a support-hours alert, and a short pre-sales FAQ.            |

The test suite parses every page with `parseContentTree` and renders every
node through `createRenderer`, which runs each block's required-prop
validation — so the example site is proven renderable content, not just
plausible-looking JSON.
