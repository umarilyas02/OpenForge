# @openforge/theme-agency

An OpenForge CMS theme for creative agencies, design studios, and production
companies — the kind of site whose job is to make a small team look
unarguable.

Blocks are shared across every OpenForge theme, so a theme differentiates
itself through its **manifest**: which blocks it puts in front of an editor,
and which design tokens it overrides. This one does both deliberately.

## Visual identity

Confident, high-contrast, and squared-off. Nothing here is soft.

| Token                | Value                                             | Why                                                                                                        |
| -------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `color.ink`          | `#0b0b0c`                                         | Near-black rather than the default blue-grey. ~18:1 against the page ground, and it lets one accent do all the work. |
| `color.background`   | `#f4f2ed`                                         | Warm gallery bone, not clinical white. Print-adjacent, and it stops large black type from vibrating.        |
| `color.orange-500`   | `#ff3d00`                                         | Electric vermilion. The single saturated colour in the system; `color.action` already aliases to it, so every button, link, and focus ring inherits it. |
| `radius.card`        | `0`                                               | Square corners everywhere. Cards, pricing, media — nothing rounded.                                        |
| `radius.control`     | `0`                                               | Buttons and inputs match. Rounded corners read as friendly; this theme is not going for friendly.           |
| `font.body`          | `Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif` | Neutral grotesque with a real fallback chain, so the identity survives a font that fails to load.      |
| `font.size-body`     | `1.0625rem`                                       | A notch up from the default. Fewer, larger words.                                                          |
| `font.weight-strong` | `800`                                             | Headings and emphasis land closer to poster weight than to bold body text.                                 |
| `line-height.body`   | `1.45`                                            | Tighter than the 1.6 default — copy sets as blocks, not as loose paragraphs.                                |
| `space.section`      | `6rem`                                            | More air between sections. Space is the cheapest way to look expensive.                                     |
| `shadow.card`        | `0.5rem 0.5rem 0 rgb(11 11 12 / 0.92)`            | A hard offset shadow with zero blur instead of a soft diffuse one — the only correct shadow for square corners. |

Every key above is a real token `name` from
`packages/design-tokens/src/default-tokens.js`. `renderSiteStyles` silently
ignores unknown keys, so `test/agency-theme.test.js` asserts the whole set
against the known token names.

## Regions

- **`page-body`** — the marketing surface: `hero`, `gradient-heading`,
  `marquee-text`, `logo-cloud`, `stats-row`, `testimonial`, `avatar-group`,
  `timeline`, `team-member`, `card`, `spotlight-card`, `icon-box`,
  `feature-list`, `data-table`, `accordion`, `carousel`, plus the
  general-purpose set (`heading`, `rich-text`, `image`, `video`, `columns`,
  `banner`, `cta`, `button`, `badge`, `divider`, `spacer`).
- **`post-body`** — a case-study surface: long-form blocks plus the proof
  blocks a case study actually needs (`stats-row`, `testimonial`,
  `data-table`, `feature-list`, `carousel`).
- **`footer`** — `footer`.

Container children (`timeline-step`, `stat`, `logo-item`, `avatar-item`,
`faq-item`, `carousel-slide`) are intentionally **not** listed in any region.
They belong in their parent block's slot, not loose on a page. The theme
still registers every official block component, so they render correctly
wherever a parent nests them.

## Templates

`page`, `post`, and `notFound`, wrapped in `of-theme-agency-*` class names so
a site can style this theme without colliding with another.

## `src/example-site.js`

A complete, renderable example site for **Rivetwork** — an invented
twelve-person brand and digital studio. It exists so the theme can be
evaluated carrying real, opinionated copy instead of placeholder text, and so
there is a worked reference for what a valid content tree looks like.

| Page                    | What it demonstrates                                                                                            |
| ----------------------- | --------------------------------------------------------------------------------------------------------------- |
| `/`                     | Statement hero, scrolling capability ticker, client logo cloud, four-stat results row, a three-column capability triptych, three case-study cards, a testimonial, and the team avatar group. |
| `/work`                 | A four-slide carousel of shipped work, case-study cards, an engagement data table, and portfolio-wide numbers.     |
| `/services`             | Three disciplines as spotlight cards, a priced engagement table, and a blunt FAQ accordion under a dark banner.    |
| `/process`              | A five-step timeline of a ten-week engagement, three icon boxes for the studio's working rules, and the deliverables list. |
| `/studio`               | Origin story, studio photography with a caption, four team members, the wider team as avatars, studio numbers, and a stated set of beliefs. |
| `/contact`              | What to send in the first email, studio locations as a table, a direct mail button, and engagement FAQs.          |
| `/work/kestrel-freight` | A case-study **post**, rendered through `post-body`: problem, scope, imagery, a results stats row, delivery table, and client proof. |

Plus a `footer` document for the `footer` region.

All imagery is inline SVG data URIs generated in the file itself, so the
example site renders identically offline, in CI, and on a fresh install with
no media library seeded. The studio, its people, and its clients are
fictional.

## Tests

`test/agency-theme.test.js` covers the usual theme contract (templates
resolve, every region block resolves, all three templates render) and then
validates the example site: every document parses through
`parseContentTree`, every top-level block is allowed in its declared region,
every node renders to static markup through `createRenderer`, and every
override key is a real design token.
