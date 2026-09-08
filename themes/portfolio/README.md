# @openforge/theme-portfolio

A complete, installable OpenForge CMS theme for a **portfolio / creative professional** site — one person (plus a couple of collaborators) showing work, saying what they do, and making it easy to hire them.

It ships the three standard templates (`page`, `post`, `notFound`), a curated block palette per region, an editorial set of design-token overrides, and a full six-page example site so the theme installs as a working website rather than an empty shell.

## Visual identity

Stark and editorial: near-black ink on bone-coloured paper, with exactly one loud thing in the whole system — an electric lime accent that carries every link, button, and focus ring. Corners are effectively square, the card "elevation" is a hard offset block rather than a soft blur, and section spacing is generous enough that the work has room to be looked at. The result reads like a well-printed exhibition catalogue: quiet surfaces, oversized type, and one colour doing all the shouting. Nothing here is trying to look like a SaaS dashboard.

## Token overrides

Block components are shared across every OpenForge theme, so `defaultTokenOverrides` in `src/manifest.js` is where the theme's look actually lives.

| Token                | Value                                                            | Why                                                                            |
| -------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `color.ink`          | `#0b0b0c`                                                        | Near-black rather than pure `#000`, so photography and proofs sit on it cleanly |
| `color.paper`        | `#f4f2ed`                                                        | Warm bone paper instead of screen white — the page reads as printed stock       |
| `color.background`   | `#f4f2ed`                                                        | Page ground matches the paper                                                   |
| `color.orange-500`   | `#d7ff3c`                                                        | Electric lime replaces the OpenForge orange as the single global accent         |
| `color.action`       | `#d7ff3c`                                                        | Links, buttons, and focus rings all inherit that one accent                     |
| `radius.card`        | `0.125rem`                                                       | A hairline, not a curve — cards should look cut, not rounded                    |
| `radius.control`     | `0`                                                              | Buttons and inputs are true rectangles                                          |
| `font.body`          | `"Space Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif` | A grotesque with real character, with a safe system fallback stack              |
| `font.size-body`     | `1.0625rem`                                                      | A touch larger than default; this theme is read, not scanned                    |
| `font.weight-strong` | `800`                                                            | Headline weight, for the type-led hierarchy the theme leans on                  |
| `line-height.body`   | `1.5`                                                            | Tighter than the default 1.6 to keep long copy dense and editorial              |
| `shadow.card`        | `0 0.375rem 0 rgb(11 11 12 / 1)`                                 | A hard offset shadow — printed panel, not floating glass                        |
| `space.section`      | `7rem`                                                           | Generous section rhythm so images and case studies get air                      |

## Regions

- **`page-body`** — 26 blocks curated for portfolio work: `hero`, `gradient-heading`, `marquee-text`, `carousel`, `spotlight-card`, `feature-list`, `testimonial`, `avatar-group`, `team-member`, `logo-cloud`, `stats-row`, `timeline`, `accordion`, plus the general-purpose set (`heading`, `rich-text`, `image`, `video`, `columns`, `card`, `icon-box`, `alert`, `cta`, `button`, `badge`, `divider`, `spacer`).
- **`post-body`** — a tighter reading set for journal entries and case-study write-ups.
- **`footer`** — `footer`.

Blocks that only ever live inside another block's slot (`carousel-slide`, `avatar-item`, `logo-item`, `stat`, `timeline-step`, `faq-item`) are deliberately **not** listed in a region. The editor offers those from their parent's `slot.acceptedTypes`; listing them at region level would only let an author strand an orphan slide at the top of a page.

## `src/example-site.js`

`exampleSite` is a real, renderable site for a fictional independent brand designer, Marlowe Ashgrove. Every node is a valid content-tree entry (`{ blockId, blockVersion, props, slots }`) that satisfies each block's `required: true` fields, and all imagery is generated inline as SVG data URIs, so the example renders offline with no asset pipeline.

| Page                              | What it demonstrates                                                                                          |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `/` — Marlowe Ashgrove            | Hero, tagline marquee, a four-slide project carousel, three spotlight cards, client avatar row, testimonial, CTA |
| `/work` — Selected Work           | Gradient heading, a five-slide case-study carousel, four written project summaries, and a stats row             |
| `/about` — About Marlowe          | Portrait image, long-form bio, a skills feature list, a five-step career timeline, two team members, columns    |
| `/services` — Services            | Availability badge, three service spotlight cards, an inclusions checklist, a five-item FAQ accordion, an alert |
| `/clients` — Clients and Praise   | A six-logo client cloud, three long testimonials, the returning-client avatar group, and headline numbers       |
| `/contact` — Contact              | Studio details, a "what to send" checklist, an availability alert, two buttons, and a closing CTA               |

It also ships one journal post (`/journal/the-logo-is-the-last-thing`) that exercises the `post` template and the `post-body` region, and `exampleFooter`, a ready content tree for the `footer` region.

## Usage

```js
import {
  exampleSite,
  portfolioTheme,
  portfolioThemeBlockRegistry,
} from "@openforge/theme-portfolio";
import { createRenderer } from "@openforge/renderer";

const renderer = createRenderer({
  theme: portfolioTheme,
  blockRegistry: portfolioThemeBlockRegistry,
});

const home = exampleSite.pages.find((page) => page.slug === "/");
const body = renderer.renderTree(home.blocks);
```
