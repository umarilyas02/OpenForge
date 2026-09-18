# @openforge/theme-finance

A financial-consulting / fintech advisory theme for the OpenForge CMS. It
ships the three standard templates (`page`, `post`, `notFound`), four curated
block regions, a full deep blue-teal token palette, and a five-page example
site you can load as real content.

## Visual identity

Professional and data-driven: a deep teal brand accent against a deep navy
ink, crisp near-white surfaces, tighter body type and line-height than a
consumer marketing site, and sharper (less rounded) card and control corners
than the SaaS reference theme — a deliberately more formal, tabular feel
suited to advisory and market copy. Section padding is opened up from the
default `4rem` to `5rem`, enough to separate dense sections without the extra
air a consumer landing page would use.

## Token overrides

Every key below is a real token `name` from `@openforge/design-tokens`, so
each one actually lands in the generated `:root` CSS.

| Token                | Value                                                    | Why                                                                     |
| -------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------ |
| `color.orange-500`   | `#0e7490`                                                  | The brand accent token; deep teal replaces OpenForge orange.             |
| `color.action`       | `#0b4f6c`                                                  | A darker, more conservative blue for links and buttons, high contrast on white. |
| `color.ink`          | `#0a1f2b`                                                  | Deep blue-black ink, cooler and darker than pure grey — a financial-print feel. |
| `color.paper`        | `#ffffff`                                                  | Cards and surfaces stay pure white for a crisp, printed-statement look.   |
| `color.background`   | `#f4f7f8`                                                  | A near-white, cool-cast page ground so white cards and tables still read as elevated. |
| `space.section`      | `5rem`                                                     | Enough separation for dense, data-heavy sections without excess air.     |
| `radius.card`        | `0.5rem`                                                   | Sharper than a consumer marketing card — a more formal, official look.   |
| `radius.control`     | `0.25rem`                                                  | Crisp, understated buttons and inputs to match the card radius.          |
| `font.body`          | `IBM Plex Sans, Segoe UI, Helvetica Neue, Arial, sans-serif` | A neutral, highly legible typeface associated with financial/data UIs, with real system fallbacks. |
| `font.size-body`     | `0.9375rem`                                                | A touch below 16px, favoring a denser, tabular reading experience.        |
| `font.weight-strong` | `800`                                                       | Extra-bold emphasis so statistics and figures stand out from body copy.  |
| `line-height.body`   | `1.5`                                                       | Tighter leading than a consumer site, matching a more clinical layout.    |
| `shadow.card`        | `0 1rem 2.5rem rgb(10 31 43 / 0.12)`                       | A restrained, blue-tinted lift rather than a large soft consumer shadow. |

## Regions

- **header** — announcement-strip blocks only (`banner`, `marquee-text`,
  `badge`, `button`), so a market update or outlook release can sit above the
  page without editors rebuilding it per page.
- **page-body** — the full advisory kit: hero, feature-list, icon-box,
  spotlight-card, pricing, comparison-table, testimonial, stats-row,
  data-table, logo-cloud, accordion, timeline, tabs, cta, location-card,
  footer, contact-form, newsletter-signup, plus the general-purpose blocks
  (heading, rich-text, image, button, columns, divider, spacer) so an editor
  is never boxed in. `location-card` and `footer` are additions beyond the
  SaaS reference theme's page-body set — see **Deviations from the SaaS
  theme** below.
- **post-body** — a narrower, article-appropriate set, unchanged from the
  SaaS reference theme.
- **footer** — the `footer` block plus `social-links`.

## `src/example-site.js`

`exampleSite` is an array of five page fixtures — `{ path, title, blocks }` —
where `blocks` is a real content tree (`{ blockId, blockVersion, props,
slots }`) for the fictional financial-consulting firm **Northgate Capital
Partners**:

| Path         | What it demonstrates                                                                                          |
| ------------ | -------------------------------------------------------------------------------------------------------------- |
| `/`          | Market-update banner, hero, a scrolling market-ticker (marquee-text), logo cloud, stats row, feature list, three spotlight cards, two testimonials, a before/after data table, closing CTA. |
| `/services`  | Hero, four icon boxes, a four-tab engagement-process breakdown, an engagement-metrics data table, three pricing tiers, a tier comparison table, a fiduciary-disclosure alert, a four-item FAQ accordion. |
| `/about`     | Narrative rich text, a firm-at-a-glance stats row, a company milestone timeline, three named advisors, a hiring CTA. |
| `/insights`  | A market-commentary blog index built from four article cards, a live-style market-snapshot data table, and a newsletter signup. |
| `/contact`   | Two office location cards, a contact form, a support-hours alert, and a short pre-engagement FAQ.               |

Every page ends with a shared footer block (with a compliance-style
copyright line and three footer link placeholders), reused across all five
pages from a single fixture in `example-site.js`.

The test suite parses every page with `parseContentTree` and renders every
node through `createRenderer`, which runs each block's required-prop
validation — so the example site is proven renderable content, not just
plausible-looking JSON.

## Deviations from the SaaS theme

- **`page-body` allows `openforge-cms.footer` and `openforge-cms.location-card`.**
  The SaaS reference theme's page-body region does not permit either block —
  its footer only ever renders through the separate `footer` region, and it
  never uses `location-card` at all. This theme's brief called for an
  explicit footer as part of the example site's pages and for a
  finance/consulting-appropriate "find our office" section, so both blocks
  are added to `page-body` and a shared footer fixture is appended to every
  page in `example-site.js`. Everything else in `page-body` mirrors the SaaS
  theme's set exactly.
- **Five example pages instead of six.** The brief specified Home, Services,
  About, Insights, and Contact; there is no separate features/pricing split
  the way the SaaS theme has `/features` and `/pricing` as different pages —
  pricing lives on `/services` instead, alongside the rest of the service
  catalog.
