# @openforge/theme-ecommerce

An OpenForge CMS theme for online stores. It ships the same three templates as
the default theme — `page`, `post`, and `notFound` — plus a region set curated
for retail, a warm token palette, and a complete six-page example storefront.

## Visual identity

Retail pages have to look appetising and make the next action obvious, so the
theme is built around one hot accent on a warm ground rather than the cool
neutral greys of the default theme.

| Token               | Value                                            | Why                                                                                            |
| ------------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| `color.orange-500`  | `#e8552f`                                        | A confident coral red-orange. Hot enough to drive an add-to-cart, distinct from OpenForge orange. |
| `color.action`      | `#c8431f`                                        | A deeper burn of the same hue. White text on it clears 4.5:1, which the brighter coral does not. |
| `color.ink`         | `#241b17`                                        | Warm near-black instead of blue-black, so text does not read cold next to product photography.   |
| `color.paper`       | `#fffaf6`                                        | Lightly toasted paper. `color.background` follows it automatically.                              |
| `radius.card`       | `0.75rem`                                        | Medium-rounded: softer than a dashboard, sharper than a lifestyle blog. Where product cards live. |
| `radius.control`    | `0.5rem`                                         | Buttons and inputs, kept a touch tighter than the cards they sit in.                             |
| `font.body`         | `"Inter", "Segoe UI", Helvetica, Arial, sans-serif` | A clean, high-legibility stack for specs, prices, and long policy copy.                       |
| `font.size-body`    | `1.0625rem`                                      | 17px: product descriptions and shipping tables are read, not skimmed.                            |
| `line-height.body`  | `1.65`                                           | Breathing room for multi-paragraph product and policy text.                                      |
| `shadow.card`       | `0 0.5rem 1.5rem rgb(36 27 23 / 0.10)`           | Tighter and warm-tinted, so a dense product grid does not become a wall of drop shadows.         |
| `space.section`     | `4.5rem`                                         | Slightly denser than the default, which suits grids of many small tiles.                         |

Token overrides are the theme's main differentiation mechanism: the blocks
themselves are shared across every OpenForge theme and are never reimplemented
per theme.

## Regions

- **`announcement-bar`** — `banner`, `marquee-text`. The promo strip above the
  page.
- **`page-body`** — the full retail set: `hero`, `card`, `rating`, `badge`,
  `logo-cloud`, `testimonial`, `stats-row`, `cta`, `feature-list`, plus the
  general-purpose blocks (`heading`, `rich-text`, `image`, `button`, `columns`,
  `divider`, `spacer`, and others).
- **`post-body`** — the subset that makes sense inside an article.
- **`footer`** — `footer`.

## `src/example-site.js`

`exampleSite` is a complete, renderable storefront for **Hearthline**, an
invented cast-iron and carbon-steel cookware maker. Every page is a real
content tree (`{ blockId, blockVersion, props, slots }`) using only official
blocks, with every required prop filled in.

| Page                     | What it demonstrates                                                                                                             |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `/`                      | Announcement banner, hero, marquee, proof stats, a three-product bestseller grid, press logo cloud, testimonial, closing CTA.       |
| `/shop`                  | A category page: three product grids, a seasoning notice, and a size-and-weight comparison table.                                   |
| `/shop/no-8-everyday-skillet` | Product detail: stock badge, product image, star rating, spec list, add-to-cart button, service icons, FAQ accordion, review. |
| `/about`                 | Brand story: foundry image, narrative, a four-step timeline, foundry stats, three value cards, a recycled-iron progress bar.        |
| `/reviews`               | Social proof: headline rating, review-programme explainer, service stats, two review grids, per-product ratings table.              |
| `/shipping-and-contact`  | Service and policy: dispatch notice, three service promises, delivery-cost table, returns policy, FAQ accordion, contact details.   |

`exampleSite.footer` is a separate one-node tree for the `footer` region.

### How product grids are built

There is no product-grid block in `OFFICIAL_CMS_BLOCKS`, and this theme does not
invent one. A grid is a `columns` block whose items are one nested `columns` per
product; each nested column holds a `card`, a `rating`, and a `badge`. Because
the columns grid is `repeat(auto-fit, minmax(220px, 1fr))`, the nested grid
resolves to a single column inside an outer column, which stacks those three
blocks into a product tile.

One caveat worth knowing: the `columns` slot declares `acceptedTypes` of
`rich-text`, `image`, and `cta`. The renderer does not enforce that list — it
only drives which blocks the admin's nested block palette offers — so these
trees render correctly, but building the same tile by hand in the admin needs
that slot's `acceptedTypes` widened in `@openforge/cms-blocks`.

## Usage

```js
import {
  ecommerceTheme,
  ecommerceThemeBlockRegistry,
  exampleSite,
} from "@openforge/theme-ecommerce";
import { createRenderer, parseContentTree } from "@openforge/renderer";

const renderer = createRenderer({
  theme: ecommerceTheme,
  blockRegistry: ecommerceThemeBlockRegistry,
});

const [home] = exampleSite.pages;
const element = renderer.renderTree(parseContentTree(home.blocks));
```
