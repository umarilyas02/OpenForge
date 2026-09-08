# @openforge/theme-nonprofit

An OpenForge CMS theme for nonprofits, causes, and charities — the kind of
site that has to explain a mission, show what the money did, introduce the
people doing the work, and ask for a donation or a volunteer shift without
feeling like a sales page.

Like every OpenForge theme, it does not reimplement blocks. It curates the
official `@openforge/cms-blocks` set into regions, ships the three
templates (`page`, `post`, `notFound`), and expresses its identity through
design-token overrides.

## Visual identity

Warm, hopeful, and legible — a two-color system where the warmth and the
contrast are handled by different colors on purpose.

| Token               | Value                                          | Why                                                                                                                                    |
| ------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `color.orange-500`  | `#f2a71b`                                      | Sunflower amber. The optimism of the theme, used for accents, rules, and markers.                                                       |
| `color.action`      | `#2f7a4a`                                      | Deep field green for links and buttons — ~5.2:1 against white, ~4.9:1 against the cream paper, so it clears WCAG AA without a variant.  |
| `color.ink`         | `#22201b`                                      | A warm near-black instead of a cool one, so body text never reads corporate-cold.                                                       |
| `color.paper`       | `#fffdf7`                                      | Barely-there cream rather than pure white.                                                                                              |
| `color.background`  | `#fdf8ec`                                      | A slightly deeper cream so cards and sections separate without borders.                                                                 |
| `radius.card`       | `1rem`                                         | Moderately rounded — friendly, not playful.                                                                                             |
| `radius.control`    | `0.625rem`                                     | Softened buttons and inputs that still read as controls.                                                                                |
| `font.body`         | `Nunito Sans, Segoe UI, Helvetica Neue, Arial` | A humanist sans: approachable, with open counters that survive small sizes.                                                             |
| `font.size-body`    | `1.0625rem`                                    | A touch larger than default; this is a lot of reading.                                                                                  |
| `line-height.body`  | `1.7`                                          | Roomy paragraphs for long mission and story copy.                                                                                       |
| `font.weight-strong`| `700`                                          | Clear emphasis without shouting.                                                                                                        |
| `space.section`     | `4.5rem`                                       | Generous section rhythm so long pages stay scannable.                                                                                   |
| `shadow.card`       | `0 0.75rem 2rem rgb(34 32 27 / 0.10)`          | A soft, warm-tinted lift rather than a cool grey drop shadow.                                                                            |

The amber is deliberately *not* the action color: at that lightness it
cannot carry white text, so using it for buttons would force a second
"accessible amber" everywhere. Green does the interactive work; amber does
the emotional work.

## Regions

- **`page-body`** — the full cause toolkit: hero, stats row (impact
  numbers), icon boxes (programs), testimonials (stories from the people
  you serve), timeline (history and milestones), team members, logo cloud
  (partners and funders), progress bars (fundraising goals), accordion
  (donor and volunteer FAQs), plus the general-purpose blocks (heading,
  rich text, image, button, columns, card, banner, alert, badge, data
  table, video, divider, spacer).
- **`post-body`** — a narrower reading set for stories and field notes.
- **`footer`** — the footer block.

Blocks that only exist inside another block's slot (`stat`, `logo-item`,
`timeline-step`, `faq-item`, `avatar-item`) are intentionally absent from
the region lists: the admin offers them from the parent block's
`slot.acceptedTypes`, not from the region palette.

## `src/example-site.js`

A complete example site, not a fixture — six pages plus one story post and
a footer tree, all valid `{ blockId, blockVersion, props, slots }` content
trees whose props satisfy every required field of the matching block
definition.

| Page                 | Slug                                    | What it demonstrates                                                                            |
| -------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Home                 | `/`                                     | Hero, impact stats row, program icon boxes, a member story, partner logo cloud, donate CTA.      |
| Our mission          | `/about`                                | Origin narrative, commitments as a feature list, a five-step history timeline, three staff bios. |
| What we do           | `/programs`                             | Four programs as icon boxes, a schedule data table, and a real FAQ accordion.                    |
| Impact and stories   | `/impact`                               | Season numbers, two attributed stories, funding progress bars, and an honest "these figures are illustrative" note. |
| Get involved         | `/get-involved`                         | Volunteer banner, three-way columns (give / volunteer / lend), goal progress, donor FAQ, monthly-giving CTA. |
| Contact us           | `/contact`                              | Locations and hours as a data table, an accessibility note, and who to write to.                 |
| Field notes (post)   | `/stories/the-week-the-beans-came-in`   | The `post` template: narrative rich text, a captioned image, a pull quote, and a closing CTA.    |

The example organization ("Harvest Row", a neighborhood food-security
project), its staff, partners, addresses, and every number on those pages
are **fictional, illustrative sample content** — invented so the theme
reads like a real site. Replace all of it before publishing, and publish
only figures you can trace to your own records.

## Usage

```js
import {
  exampleSite,
  nonprofitTheme,
  nonprofitThemeBlockRegistry,
} from "@openforge/theme-nonprofit";
import { createRenderer } from "@openforge/renderer";

const renderer = createRenderer({
  theme: nonprofitTheme,
  blockRegistry: nonprofitThemeBlockRegistry,
});

const home = exampleSite.pages[0];
const element = renderer.renderTree(home.blocks);
```
