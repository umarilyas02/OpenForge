/**
 * Fitness theme manifest.
 *
 * Region lists intentionally contain only blocks that make sense as a
 * *top-level* choice in the admin's block picker. Container children
 * (`openforge-cms.timeline-step`, `.stat`, `.logo-item`, `.faq-item`,
 * `.carousel-slide`, `.gallery-item`, `.social-link-item`) are deliberately
 * absent: they are placed inside their parent block's slot, not dropped
 * straight onto a page. The theme still registers every official block
 * component, so those children render correctly wherever a parent nests
 * them.
 */
export const manifest = {
  schemaVersion: 1,
  id: "openforge-theme.fitness",
  name: "Fitness",
  version: "1.0.0",
  description:
    "A bold, high-energy theme for gyms, personal-training studios, and boutique fitness brands: deep charcoal-black surfaces, one hot crimson accent, heavy display headings, and a block set built around classes, coaches, membership pricing, and drop-in conversion.",
  regions: [
    {
      key: "header",
      label: "Header",
      allowedBlockIds: [
        "openforge-cms.navbar",
        "openforge-cms.banner",
        "openforge-cms.marquee-text",
        "openforge-cms.badge",
        "openforge-cms.button",
      ],
    },
    {
      key: "page-body",
      label: "Page body",
      allowedBlockIds: [
        "openforge-cms.hero",
        "openforge-cms.gradient-heading",
        "openforge-cms.heading",
        "openforge-cms.rich-text",
        "openforge-cms.feature-list",
        "openforge-cms.icon-box",
        "openforge-cms.spotlight-card",
        "openforge-cms.card",
        "openforge-cms.columns",
        "openforge-cms.pricing",
        "openforge-cms.comparison-table",
        "openforge-cms.testimonial",
        "openforge-cms.avatar-group",
        "openforge-cms.rating",
        "openforge-cms.stats-row",
        "openforge-cms.logo-cloud",
        "openforge-cms.accordion",
        "openforge-cms.timeline",
        "openforge-cms.team-member",
        "openforge-cms.data-table",
        "openforge-cms.carousel",
        "openforge-cms.image-gallery",
        "openforge-cms.location-card",
        "openforge-cms.social-links",
        "openforge-cms.cta",
        "openforge-cms.banner",
        "openforge-cms.marquee-text",
        "openforge-cms.button",
        "openforge-cms.image",
        "openforge-cms.video",
        "openforge-cms.badge",
        "openforge-cms.alert",
        "openforge-cms.progress",
        "openforge-cms.countdown-timer",
        "openforge-cms.divider",
        "openforge-cms.spacer",
        "openforge-cms.breadcrumbs",
        "openforge-cms.tabs",
        "openforge-cms.contact-form",
        "openforge-cms.newsletter-signup",
      ],
    },
    {
      key: "post-body",
      label: "Post body",
      allowedBlockIds: [
        "openforge-cms.heading",
        "openforge-cms.rich-text",
        "openforge-cms.image",
        "openforge-cms.video",
        "openforge-cms.feature-list",
        "openforge-cms.data-table",
        "openforge-cms.card",
        "openforge-cms.testimonial",
        "openforge-cms.accordion",
        "openforge-cms.alert",
        "openforge-cms.badge",
        "openforge-cms.button",
        "openforge-cms.cta",
        "openforge-cms.divider",
        "openforge-cms.spacer",
      ],
    },
    {
      key: "footer",
      label: "Footer",
      allowedBlockIds: ["openforge-cms.footer", "openforge-cms.social-links"],
    },
  ],
  templateNames: ["page", "post", "notFound"],
  /**
   * The theme's whole visual argument. Blocks are shared across every
   * OpenForge theme, so the identity lives here: a genuinely dark
   * charcoal-black page ground with off-white ink text (rather than the
   * usual light-page/dark-ink pairing), one hot crimson accent doing all of
   * the shouting, heavier display weight, and a hard offset accent shadow
   * instead of a soft diffuse one.
   *
   * Every key below is a real token `name` from
   * `packages/design-tokens/src/default-tokens.js`; unknown keys would be
   * silently ignored by `renderSiteStyles`, so typos here are a real bug.
   * Every block's CSS derives surfaces and borders from `color.ink` and
   * `color.background` with `color-mix()` rather than hardcoding a light
   * background, so inverting those two tokens produces a correctly
   * contrasted dark theme throughout, not just on the hero.
   */
  defaultTokenOverrides: {
    "color.ink": "#f5f4f1",
    "color.paper": "#ffffff",
    "color.background": "#0e0d0f",
    "color.orange-500": "#ff2140",
    "color.action": "#ff3b57",
    "space.section": "6rem",
    "radius.card": "0.5rem",
    "radius.control": "0.25rem",
    "font.body":
      "'Archivo', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    "font.size-body": "1.0625rem",
    "font.weight-strong": "800",
    "line-height.body": "1.55",
    "shadow.card": "0.5rem 0.5rem 0 rgb(255 33 64 / 0.35)",
  },
};
