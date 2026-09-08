# @openforge/theme-healthcare

An OpenForge CMS theme for clinics, medical practices, and other care providers. It ships the same three templates as the default theme — `page`, `post`, `notFound` — a block palette curated for clinic sites, a calm token identity, and a complete six-page example site you can import and adapt.

```js
import { healthcareTheme, exampleSite } from "@openforge/theme-healthcare";
```

## Visual identity

Clinic sites have to look trustworthy and stay readable for people who are worried, in a hurry, or reading on a phone in a waiting room. The identity is therefore quiet rather than loud: one deep teal accent, a lot of white space, soft corners, and generous line height.

| Token               | Value                                          | Why                                                                                                                                                        |
| ------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `color.action`      | `#0b7a69`                                      | A deep clinical teal. Dark enough to hit **5.2:1** against `color.paper` and **4.9:1** against `color.background`, so links, buttons, and focus rings clear WCAG AA for normal text without a separate "accessible" variant. |
| `color.ink`         | `#122a31`                                      | Slate with a teal cast rather than pure black — 14.6:1 on paper, softer under waiting-room lighting.                                                          |
| `color.paper`       | `#ffffff`                                      | Cards, panels, and tables stay pure white so they lift off the page.                                                                                          |
| `color.background`  | `#f4f9f8`                                      | A barely-there mint tint on the page ground, which separates content cards from the page without adding borders.                                              |
| `radius.card`       | `1rem`                                         | Softly rounded cards — friendlier than the default `1.25rem` pill-ness, still clearly not a sharp "enterprise" corner.                                        |
| `radius.control`    | `0.5rem`                                       | Buttons and inputs match the card language at a smaller scale.                                                                                                |
| `font.body`         | `Inter, Segoe UI, Helvetica Neue, Arial, sans-serif` | A neutral, high-legibility UI stack with real fallbacks on every platform.                                                                          |
| `font.size-body`    | `1.0625rem`                                    | A nudge above 16px, because a lot of clinic traffic is older readers.                                                                                          |
| `line-height.body`  | `1.7`                                          | Long logistical paragraphs (insurance, what to bring) stay scannable.                                                                                         |
| `font.weight-strong`| `600`                                          | Semibold instead of bold keeps emphasis calm.                                                                                                                 |
| `space.section`     | `5rem`                                         | Extra breathing room between sections so notices are not crowded by the content around them.                                                                  |
| `shadow.card`       | `0 0.75rem 2rem rgb(11 122 105 / 0.12)`        | A teal-tinted shadow, so elevation reads as part of the palette rather than a grey wash.                                                                       |

Every key above is a real token name from `@openforge/design-tokens`; nothing here invents a token. Blocks are shared across all themes, so these overrides — not forked components — are what make the theme feel like a clinic.

## Regions

- **`page-body`** — the full clinic palette: `hero`, `banner`, `alert` (important notices), `icon-box` (services and specialties), `team-member` (clinicians and staff), `testimonial` and `rating` (patient experience), `accordion` (patient FAQs), `stats-row`, `timeline` (how a visit runs), `data-table` (hours, visit lengths, billing steps), `logo-cloud` (accepted plans), `pricing` (self-pay rates), `cta` (book an appointment), plus the general-purpose `heading`, `rich-text`, `image`, `card`, `feature-list`, `columns`, `button`, `badge`, `video`, `divider`, and `spacer`.
- **`post-body`** — a narrower set for clinic news and patient-education posts.
- **`footer`** — the `footer` block.

## `src/example-site.js`

`exampleSite` is a full six-page site for **Northbridge Family Health**, a fictional family medicine practice. Every page's `blocks` array is a valid content tree (`{ blockId, blockVersion, props, slots }`) that satisfies `parseContentTree()` and every block's required props, so it renders as-is through `createRenderer()`.

| Page                      | What it demonstrates                                                                                                    |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `/`                       | Home: announcement banner, hero, emergency notice, practice stats, four service icon boxes, first-visit checklist, patient quotes, appointment CTA. |
| `/services`               | Services and specialties: primary-care icon boxes, in-clinic service list, a visit-length table, and a services FAQ.        |
| `/care-team`              | Five clinician `team-member` profiles plus support-team cards and a clinician-matching notice.                             |
| `/patient-information`    | What to bring, a five-step `timeline` of how a visit runs, how to reach a nurse, and a six-question patient FAQ.           |
| `/appointments`           | Four ways to book, a clinic/lab hours table, a `columns` contact block, a booking FAQ, and a new-patient CTA.               |
| `/insurance-and-billing`  | Accepted-plan `logo-cloud`, three self-pay `pricing` cards, a post-visit billing table, and a billing FAQ.                  |

`exampleSite.footer` is the matching footer content tree, and `exampleSite.navigation` is the site nav.

### Content safety

All content is deliberately logistical: hours, booking, insurance, what to bring, how records requests work. There are no diagnoses, treatment advice, efficacy claims, or outcome promises, and patient quotes speak only about scheduling and communication. Every clinician, insurance plan, address, and phone number is invented — the phone numbers use the reserved `555-01xx` fictional range. Replace all of it before publishing a real clinic site.

## Tests

`test/healthcare-theme.test.js` checks that all three templates resolve, that every block referenced by a region exists, that the templates render, and — for the example site — that every page's content tree parses and every top-level node renders through `createRenderer(...).renderNode()` without throwing.
