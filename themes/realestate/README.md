# @openforge/theme-realestate

An OpenForge CMS theme for a real estate brokerage or an individual agent:
listing grids, property detail pages with photo carousels, market statistics,
agent profiles, neighborhood guides, and tour-booking calls to action.

Like every OpenForge theme, it renders the shared official block set rather
than reimplementing components. What makes it a *real estate* theme is the
curated block palette per region, the token identity, and the complete example
site that ships with it.

```js
import { exampleSite, realestateTheme } from "@openforge/theme-realestate";
```

## Visual identity

Upscale and restrained: deep harbor navy, warm alabaster paper, and two
weights of brass. Nothing bright, nothing rounded, nothing that competes with
the photography.

| Token              | Value                     | Why                                                                                                                             |
| ------------------ | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `color.ink`        | `#12233f`                 | Deep harbor navy. Every muted border, caption, and tint in `blocks.css` is a `color-mix` against `color.ink`, so setting it here turns the entire neutral scale navy-tinted rather than grey. |
| `color.paper`      | `#ffffff`                 | Deliberately left pure white: `color.paper` is the label color printed on top of the action-colored CTA, so it has to stay maximally light. |
| `color.background` | `#f7f4ee`                 | Warm alabaster page ground instead of clinical white. Card and panel surfaces are `color-mix`ed against it, so the whole page sits on limestone rather than on a lightbox. |
| `color.orange-500` | `#c9a24b`                 | The brand display gold — brass, the identity hue.                              |
| `color.action`     | `#8a6a24`                 | A deeper brass for anything that has to be *read*. `#c9a24b` on white is about 1.9:1 and fails WCAG AA for link text and button labels; `#8a6a24` is about 5.0:1 on white and 4.5:1 on the alabaster ground. Two weights of the same metal is how upscale print identities work anyway. |
| `radius.card`      | `0.5rem`                  | Moderate, not pill-shaped. Property photography, not app chrome.               |
| `radius.control`   | `0.25rem`                 | Near-square buttons, closer to estate-agency stationery.                       |
| `font.body`        | Iowan Old Style / Palatino / Georgia / Times New Roman / serif | A transitional serif stack that degrades through faces that actually exist on macOS, Windows, and Linux, with no webfont request. |
| `font.size-body`   | `1.0625rem`               | Nudged up to compensate for the serif's smaller x-height.                      |
| `line-height.body` | `1.7`                     | Longer measure for long-form property descriptions.                            |
| `font.weight-strong` | `600`                   | Semibold rather than 700; a serif at 700 shouts.                               |
| `shadow.card`      | `0 1.25rem 2.5rem rgb(18 35 63 / 0.10)` | Navy-tinted elevation instead of neutral black.                  |
| `space.section`    | `5rem`                    | Slightly tighter than the default 4rem-plus rhythm, so a six-listing grid does not turn into a scroll marathon. |

Every name above is a real token from
`@openforge/design-tokens`'s `defaultDesignTokens`; overrides for names that do
not exist are silently ignored by `renderSiteStyles`, so there are none here.

## Regions

- **`page-body`** — the full palette: `hero`, `banner`, `carousel`, `card`,
  `columns`, `icon-box`, `feature-list`, `stats-row`, `data-table`,
  `testimonial`, `rating`, `team-member`, `timeline`, `accordion`, `cta`, and
  the general-purpose text, media, and layout blocks.
- **`post-body`** — a narrower set for market reports and neighborhood
  guides: text, images, tables, stats, and a closing CTA.
- **`footer`** — `footer`.

There is no dedicated "listing grid" block in the official set, and this theme
does not invent one. A listing grid here is `card` blocks nested in a
`columns` block, which is what those two blocks are for.

## Templates

`page`, `post`, and `notFound`, wrapping their content in
`of-theme-realestate-*` class names so a site stylesheet can target this theme
specifically. The not-found page says the useful thing for this vertical —
the listing may have sold or gone under contract — rather than a generic
apology.

## `src/example-site.js`

A complete demonstration brokerage, exported as `exampleSite`. Every page's
`blocks` array is a real content tree that satisfies `parseContentTree` and
renders through `createRenderer` with no block missing a required prop; the
test suite asserts exactly that, page by page.

| Page                                     | What it demonstrates                                                                                                |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `/`                                      | Brokerage home: hero, a four-stat market row, a three-listing card grid, a property photo carousel, three seller value-props, a client testimonial, and a valuation CTA. |
| `/listings`                              | Listing index: an announcement banner, two card grids covering six homes, a price-band data table, and what every listing page includes. |
| `/listings/ridge-house-kestrel-bluff`    | A full property detail page: five-slide carousel, specs as a stats row, long-form description, feature list, a detail table, the measured floor plan, a buyer FAQ accordion, the listing agent, and a tour CTA. |
| `/about`                                 | The firm: hero, a four-step founding timeline, four agent profiles in a grid, two client testimonials, and a rating. |
| `/neighborhoods`                         | A neighborhood guide: what actually decides the choice, six area cards, a side-by-side comparison table, and a deciding-between-them FAQ. |
| `/contact`                               | Booking: how to reach the office, a ferry-timing notice, what to bring to a showing, a pre-booking FAQ, and the request-a-showing CTA. |

`exampleSite.footer` is a separate `footer`-region content tree.

Images are inline `data:image/svg+xml` placeholders generated in the file, so
the example site renders with no network access and no binary assets in the
repo. Replace them with real photography when seeding a live site.

The agency, the coastline, the neighborhoods, the agents, and the homes are
all invented. Nothing in this package refers to a real brokerage, a real
person, or a real address.

## Scripts

- `pnpm build` — bundle `src/index.js` to `dist/index.js`
- `pnpm lint`
- `pnpm test`
