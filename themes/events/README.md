# @openforge/theme-events

An event-planning / conference theme for the OpenForge CMS. It ships the
three standard templates (`page`, `post`, `notFound`), four curated block
regions, a full violet-and-gold token palette, and a five-page example site
you can load as real content.

## Visual identity

Festive and premium: a deep plum-violet interactive color drives every
button, link, and call to action, paired with a warm gold accent for
highlights and badges, on a warm champagne-ivory page ground rather than
stark white. Cards stay pure white so they lift cleanly off that warmer
ground, corners are generously rounded for a gala-invitation feel, and body
text carries an extra-bold strong weight so headings read with confidence
next to long agenda and ticket copy.

## Token overrides

Every key below is a real token `name` from `@openforge/design-tokens`, so
each one actually lands in the generated `:root` CSS.

| Token                | Value                                              | Why                                                                      |
| -------------------- | --------------------------------------------------- | ------------------------------------------------------------------------- |
| `color.orange-500`   | `#caa63d`                                          | The gold accent token; warm gold replaces OpenForge orange.               |
| `color.action`       | `#4a1942`                                          | Deep plum for buttons and links — the "base" of the violet identity.      |
| `color.ink`          | `#1f1320`                                          | Plum-cast near-black, warmer than pure grey next to the gold accent.      |
| `color.paper`        | `#ffffff`                                          | Cards and surfaces stay pure white against the tinted page ground.        |
| `color.background`   | `#faf6ef`                                          | Warm champagne-ivory page ground so white cards read as elevated.         |
| `space.section`      | `6rem`                                             | Long agenda and ticket pages need air between sections.                   |
| `radius.card`        | `1.5rem`                                           | Generously rounded, gala-invitation feel rather than a boxy SaaS card.    |
| `radius.control`     | `0.75rem`                                          | Buttons and inputs echo the card radius at a smaller scale.               |
| `font.body`          | `Manrope, Segoe UI, Helvetica Neue, Arial, sans-serif` | A confident geometric sans with real system fallbacks.                |
| `font.size-body`     | `1.0625rem`                                        | A nudge up from 16px for longer agenda and bio copy.                      |
| `font.weight-strong` | `800`                                              | Extra-bold rather than semibold, so headings feel confident and bold.     |
| `line-height.body`   | `1.65`                                             | Looser leading for multi-line schedule and bio copy.                      |
| `shadow.card`        | `0 1.5rem 3rem rgb(31 19 32 / 0.16)`                | A large, soft, plum-tinted lift instead of a hard grey drop shadow.       |

## Regions

- **header** — announcement-strip blocks only (`banner`, `marquee-text`,
  `badge`, `button`), so a registration deadline or venue-change notice can
  sit above the page without editors rebuilding it per page.
- **page-body** — the full marketing kit saas ships, plus two blocks suited
  to an in-person event: `location-card` (venue address, hours, and phone)
  and `image-gallery` (a static grid of event photos). See "Deviations"
  below for why these two are added.
- **post-body** — a narrower, article-appropriate set, unchanged from the
  reference theme.
- **footer** — the `footer` block plus `social-links`.

## `src/example-site.js`

`exampleSite` is an array of five page fixtures — `{ path, title, blocks }`
— where `blocks` is a real content tree (`{ blockId, blockVersion, props,
slots }`) for the fictional annual conference **The Aurum Summit**,
produced by the fictional company **Vantage Events Group**:

| Path         | What it demonstrates                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------------------- |
| `/`          | Announcement banner, hero, logo cloud, stats row, feature list, three spotlight cards, two testimonials, a photo gallery, a countdown to next year's Summit, a newsletter signup, and a closing CTA. |
| `/schedule`  | Breadcrumbs, hero, a three-day-at-a-glance data table, two timelines (Day One and Day Two) built from timeline-step blocks, and a tabs block for choosing a Day Two track. |
| `/speakers`  | Breadcrumbs, hero, an avatar-group social-proof row, and six team-member speaker profiles.               |
| `/tickets`   | Breadcrumbs, hero, a badge, three pricing cards (the middle plan featured), a plan comparison table, a group-discount alert, and a four-item FAQ accordion. |
| `/contact`   | Breadcrumbs, hero, a venue location card, a three-column "who to write to" layout, a contact form, a support-hours alert, and a short pre-Summit FAQ. |

The test suite parses every page with `parseContentTree` and renders every
node through `createRenderer`, which runs each block's required-prop
validation — so the example site is proven renderable content, not just
plausible-looking JSON.

## Deviations from `@openforge/theme-saas`'s exact shape

- **Page count**: the brief for this theme named five specific pages (Home,
  Schedule/Agenda, Speakers, Tickets, Contact) rather than asking for six
  like the SaaS theme's Home/Features/Pricing/About/Blog/Contact set, so
  `exampleSite` has five entries instead of six. The test file's page-count
  assertion is adjusted to match (`toHaveLength(5)`).
- **`page-body` region gains two blocks saas's region doesn't allow**:
  `location-card` and `image-gallery`. Both are existing official blocks
  from `@openforge/cms-blocks` (not invented), just ones the SaaS theme's
  curated region list happens to omit. They are a natural fit for an
  in-person conference site — a venue location card on the Contact page and
  a "moments from last year" photo gallery on the Home page — so this
  theme's manifest adds them to `page-body`'s `allowedBlockIds` the same
  way SaaS curates its own list to fit its own content.
- **No separate "Footer" page**: the task brief mentioned "plus a Footer"
  alongside the named pages. Like the SaaS theme, the footer here is a
  theme-level region (`footer`, containing the `footer` and `social-links`
  blocks) rendered by the app shell across every page — it is not a
  per-page content-tree entry, since `exampleSite`'s fixtures are
  page-body-only content (mirroring saas's exact fixture shape and the
  region test's "top level" check). The footer requirement is satisfied
  architecturally through the `footer` region rather than as a sixth
  `exampleSite` page.

Everything else — `package.json`'s scripts/dependencies, `manifest.js`'s
shape, the three templates' structure, `index.js`'s exports, and the test
file's structure — mirrors `themes/saas` exactly, renamed for this theme.
