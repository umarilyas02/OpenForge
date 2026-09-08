/**
 * Agency theme manifest.
 *
 * Region lists intentionally contain only blocks that make sense as a
 * *top-level* choice in the admin's block picker. Container children
 * (`openforge-cms.timeline-step`, `.stat`, `.logo-item`, `.avatar-item`,
 * `.faq-item`, `.carousel-slide`) are deliberately absent: they are placed
 * inside their parent block's slot, not dropped straight onto a page. The
 * theme still registers every official block component, so those children
 * render correctly wherever a parent nests them.
 */
export const manifest = {
  schemaVersion: 1,
  id: "openforge-theme.agency",
  name: "Agency",
  version: "1.0.0",
  description:
    "A bold, high-contrast theme for creative agencies and design studios: near-black ink, one electric vermilion accent, square corners, and a block set built around case studies, process, team, and client proof.",
  regions: [
    {
      key: "page-body",
      label: "Page body",
      allowedBlockIds: [
        // Statement openers
        "openforge-cms.hero",
        "openforge-cms.gradient-heading",
        "openforge-cms.marquee-text",
        "openforge-cms.heading",
        // Narrative
        "openforge-cms.rich-text",
        "openforge-cms.image",
        "openforge-cms.video",
        "openforge-cms.carousel",
        // Proof
        "openforge-cms.logo-cloud",
        "openforge-cms.stats-row",
        "openforge-cms.testimonial",
        "openforge-cms.avatar-group",
        // Process and people
        "openforge-cms.timeline",
        "openforge-cms.team-member",
        // Work and capability
        "openforge-cms.card",
        "openforge-cms.spotlight-card",
        "openforge-cms.icon-box",
        "openforge-cms.feature-list",
        "openforge-cms.data-table",
        "openforge-cms.accordion",
        // Layout and conversion
        "openforge-cms.columns",
        "openforge-cms.banner",
        "openforge-cms.cta",
        "openforge-cms.button",
        "openforge-cms.badge",
        "openforge-cms.divider",
        "openforge-cms.spacer",
        // Additions
        "openforge-cms.navbar",
        "openforge-cms.breadcrumbs",
        "openforge-cms.image-gallery",
        "openforge-cms.tabs",
        "openforge-cms.comparison-table",
        "openforge-cms.contact-form",
      ],
    },
    {
      key: "post-body",
      label: "Post body",
      allowedBlockIds: [
        "openforge-cms.heading",
        "openforge-cms.gradient-heading",
        "openforge-cms.rich-text",
        "openforge-cms.image",
        "openforge-cms.video",
        "openforge-cms.carousel",
        "openforge-cms.stats-row",
        "openforge-cms.testimonial",
        "openforge-cms.feature-list",
        "openforge-cms.data-table",
        "openforge-cms.card",
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
   * OpenForge theme, so the identity lives here: a near-black ink on warm
   * gallery bone, a single electric vermilion doing all of the shouting,
   * zero corner radius everywhere, and a hard offset shadow instead of a
   * soft diffuse one.
   *
   * Every key below is a real token `name` from
   * `packages/design-tokens/src/default-tokens.js`; unknown keys would be
   * silently ignored by `renderSiteStyles`, so typos here are a real bug.
   */
  defaultTokenOverrides: {
    "color.ink": "#0b0b0c",
    "color.background": "#f4f2ed",
    "color.orange-500": "#ff3d00",
    "radius.card": "0",
    "radius.control": "0",
    "font.body": "Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif",
    "font.size-body": "1.0625rem",
    "font.weight-strong": "800",
    "line-height.body": "1.45",
    "space.section": "6rem",
    "shadow.card": "0.5rem 0.5rem 0 rgb(11 11 12 / 0.92)",
  },
};
