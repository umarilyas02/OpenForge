# @openforge/theme-legal

A law firm / legal practice theme for the OpenForge CMS. It ships the three
standard templates (`page`, `post`, `notFound`), four curated block regions,
a full navy-and-gold token palette, and a five-page example site you can
load as real content.

## Visual identity

Formal and trust-first: a deep navy ink on a warm ivory page ground, a
muted antique-gold accent used sparingly rather than as a loud brand color,
a single classic serif typeface carried through both headings and body
copy, restrained corner radii (no pill shapes, nothing that reads as
playful), and generous section spacing so long practice-area and case
copy has room to breathe.

## Token overrides

Every key below is a real token `name` from `@openforge/design-tokens`, so
each one actually lands in the generated `:root` CSS.

| Token                | Value                                                | Why                                                                     |
| -------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------ |
| `color.ink`          | `#101d33`                                             | Deep navy near-black, the firm's primary text and dark-surface color.    |
| `color.paper`        | `#ffffff`                                             | Cards and surfaces stay pure white against the warm ivory page ground.   |
| `color.background`   | `#f6f4ee`                                             | A warm, understated ivory ground instead of stark white or cool grey.    |
| `color.orange-500`   | `#b3922f`                                             | The brand accent token; a muted antique gold replaces OpenForge orange.  |
| `color.action`       | `#8a6a1a`                                             | A deeper bronze-gold for links and buttons, ~5:1 contrast on white.      |
| `space.section`      | `5.5rem`                                              | Generous whitespace between sections on long practice-area/case pages.   |
| `radius.card`        | `0.375rem`                                            | A slight, formal edge softening — never pill-shaped or playful.          |
| `radius.control`     | `0.25rem`                                             | Buttons and inputs echo the card radius at a smaller, crisper scale.     |
| `font.body`          | `'Source Serif 4', Georgia, 'Times New Roman', Times, serif` | A classic serif carried through headings and body for a traditional-firm feel. |
| `font.size-body`     | `1.0625rem`                                           | A nudge up from 16px for comfortable reading of longer legal copy.        |
| `font.weight-strong` | `700`                                                 | Bold rather than semibold, for a more authoritative emphasis weight.      |
| `line-height.body`   | `1.7`                                                 | Loose leading for multi-paragraph practice descriptions and bios.         |
| `shadow.card`        | `0 0.75rem 2rem rgb(16 29 51 / 0.12)`                 | A soft, navy-tinted lift instead of a hard grey drop shadow.              |

## Regions

- **header** — announcement-strip blocks only (`banner`, `marquee-text`,
  `badge`, `button`), so a firm can post a case win or office update above
  the page without editors rebuilding it per page.
- **page-body** — the full kit: hero, feature-list, icon-box,
  spotlight-card, testimonial, stats-row, logo-cloud, accordion, timeline,
  team-member, data-table, location-card, contact-form, cta, plus the
  general-purpose blocks (heading, rich-text, image, button, columns,
  divider, spacer). `footer` and `social-links` are additionally allowed
  here so the site footer can be placed at the end of a page's own content,
  the way the example site does on every page.
- **post-body** — a narrower, article-appropriate set for firm updates.
- **footer** — the `footer` block, as its own dedicated region.

## `src/example-site.js`

`exampleSite` is an array of five page fixtures — `{ path, title, blocks }`
— where `blocks` is a real content tree (`{ blockId, blockVersion, props,
slots }`) for the fictional full-service firm **Meridian & Cole LLP**:

| Path               | What it demonstrates                                                                           |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| `/`                | Announcement banner, hero, "recognized by" logo cloud, firm stats, feature list, three practice-pillar spotlight cards, two client testimonials, closing CTA. |
| `/about`           | Firm-history rich text, a firm-scale stats row, a four-milestone timeline, and four partner profiles. |
| `/practice-areas`  | Six practice-area icon boxes, a "what each group handles" data table, and an "every engagement includes" feature list. |
| `/results`         | Case-result stats, three client testimonials, a results FAQ accordion, and the required "prior results do not guarantee" disclaimer alert. |
| `/contact`         | Two office location cards, a consultation request form, a pre-contact FAQ, and the attorney-client-relationship disclaimer alert. |

Every page ends with the same `openforge-cms.footer` block instance (a
shared `siteFooter` fixture with a copyright line and three footer links),
so the site's legal notices appear consistently across the whole example
site, the way a real firm site's global footer would.

The test suite parses every page with `parseContentTree` and renders every
node through `createRenderer`, which runs each block's required-prop
validation — so the example site is proven renderable content, not just
plausible-looking JSON.
