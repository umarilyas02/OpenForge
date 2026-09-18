# @openforge/theme-automotive

A bold, mechanical theme for car dealerships and full-service auto-repair
shops on the OpenForge CMS. It ships the three standard templates (`page`,
`post`, `notFound`), four curated block regions, a deep-red-on-graphite
token palette, and a five-page example site you can load as real content.

## Visual identity

Bold and mechanical: a saturated deep red accent against a graphite-black
ink and a cool steel-grey page ground, sharp near-square corners instead of
soft rounding, a condensed sans-serif typeface for confident, technical-
looking headings, and tighter line spacing than a typical marketing theme
so spec sheets and service menus read like a shop board, not a blog post.

## Token overrides

Every key below is a real token `name` from `@openforge/design-tokens`, so
each one actually lands in the generated `:root` CSS.

| Token                | Value                                                | Why                                                                      |
| -------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------- |
| `color.orange-500`   | `#b3141f`                                             | The brand accent token; deep red replaces OpenForge orange.               |
| `color.action`       | `#8a0f18`                                             | A darker red for links and buttons, high contrast on white.               |
| `color.ink`          | `#15171a`                                             | Near-black graphite for body text and dark surfaces.                      |
| `color.paper`        | `#ffffff`                                             | Cards and surfaces stay pure white against the tinted page ground.        |
| `color.background`   | `#e9ebee`                                             | A cool steel-grey page ground with a mechanical, workshop feel.           |
| `space.section`      | `5rem`                                                | A tighter section rhythm than a typical soft marketing page.              |
| `radius.card`        | `0.25rem`                                             | Sharp, near-square corners instead of pillowy rounding.                   |
| `radius.control`     | `0.25rem`                                             | Buttons and inputs echo the card radius at a smaller scale.               |
| `font.body`          | `'Roboto Condensed', 'Arial Narrow', Arial, sans-serif` | A condensed stack for confident, technical-looking headings and copy.  |
| `font.size-body`     | `1rem`                                                | Standard body size; the condensed face carries the identity, not scale.   |
| `font.weight-strong` | `800`                                                 | Extra-bold rather than semibold; a heavier, more aggressive emphasis.     |
| `line-height.body`   | `1.5`                                                 | Tighter leading than a lifestyle marketing theme, closer to a spec sheet. |
| `shadow.card`        | `0 1rem 2rem rgb(21 23 26 / 0.25)`                    | A harder, darker card shadow instead of a soft colored glow.              |

## Regions

- **header** — announcement-strip blocks only (`banner`, `marquee-text`,
  `badge`, `button`), so a sale or service special can sit above the page
  without editors rebuilding it per page.
- **page-body** — the full kit: hero, feature-list, icon-box, spotlight-card,
  pricing, testimonial, rating, stats-row, logo-cloud, accordion, timeline,
  team-member, data-table, carousel, cta, location-card, social-links,
  footer, plus the general-purpose blocks (heading, rich-text, image,
  button, columns, divider, spacer, contact-form) so an editor is never
  boxed in. `location-card`, `social-links`, and `footer` are additions
  beyond the saas theme's page-body list — see "Deviations from saas"
  below.
- **post-body** — a narrower, article-appropriate set, for shop blog posts
  and service write-ups.
- **footer** — the `footer` and `social-links` blocks.

## `src/example-site.js`

`exampleSite` is an array of five page fixtures — `{ path, title, blocks }`
— where `blocks` is a real content tree (`{ blockId, blockVersion, props,
slots }`) for the fictional dealership and repair shop **Redline Auto
Group**:

| Path            | What it demonstrates                                                                              |
| --------------- | --------------------------------------------------------------------------------------------------- |
| `/`             | Service-special banner, hero, certified-brands logo cloud, stats row, feature list, three spotlight cards, two testimonials, closing CTA. |
| `/inventory`    | Hero, a used-vehicle data table, a features list, four service icon boxes, three flat-rate service-package pricing cards, a five-step service timeline. |
| `/about`        | Narrative rich text, a stats row, a company milestone timeline, three team members, a hiring CTA.  |
| `/testimonials` | A rating summary, four customer testimonials, a pre-purchase and pre-service FAQ accordion.          |
| `/contact`      | A location card with address/hours/phone, a contact form, a support-hours alert, social links, and a short FAQ. |

Every page ends with a shared `openforge-cms.footer` block instance. The
test suite parses every page with `parseContentTree` and renders every node
through `createRenderer`, which runs each block's required-prop
validation — so the example site is proven renderable content, not just
plausible-looking JSON.

## Deviations from saas

This theme mirrors `@openforge/theme-saas` structurally (package shape,
manifest shape, template shape, example-site export shape, and test
shape), with two deliberate content differences:

- **`page-body` allows `openforge-cms.footer`, `openforge-cms.location-card`,
  and `openforge-cms.social-links`.** saas's `page-body` region does not
  allow `footer` because saas's example site never places a footer block
  inside a page's own block list. This theme's brief asked for a shared
  footer as part of the example site, and `exampleSite`'s flat
  `{ path, title, blocks }[]` shape (matched exactly from saas, with no
  separate top-level `footer` field) has nowhere else to hold one — so a
  footer instance is appended to every page's `blocks` array instead, and
  the region allowlist was extended to permit it. `location-card` and
  `social-links` were added because they are the natural fit for a local
  business's address/hours and social presence, and both already exist in
  the official block set.
- **Five example pages instead of six** (`/`, `/inventory`, `/about`,
  `/testimonials`, `/contact`), per this theme's brief, rather than saas's
  six (`/`, `/features`, `/pricing`, `/about`, `/blog`, `/contact`).
