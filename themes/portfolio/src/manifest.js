// Region lists are the *top-level* block palette for a content item. Blocks
// that only ever live inside another block's slot (carousel-slide,
// avatar-item, logo-item, stat, timeline-step, faq-item) are deliberately
// absent: the editor offers those from their parent's `slot.acceptedTypes`,
// so listing them here would only let an author strand an orphan slide or a
// lone avatar at the top of a page.
export const manifest = {
  schemaVersion: 1,
  id: "openforge-theme.portfolio",
  name: "Portfolio",
  version: "1.0.0",
  description:
    "A stark, type-led portfolio theme for an independent creative: near-black on bone paper, one electric accent, and square corners.",
  regions: [
    {
      key: "page-body",
      label: "Page body",
      allowedBlockIds: [
        "openforge-cms.hero",
        "openforge-cms.gradient-heading",
        "openforge-cms.heading",
        "openforge-cms.marquee-text",
        "openforge-cms.rich-text",
        "openforge-cms.image",
        "openforge-cms.video",
        "openforge-cms.carousel",
        "openforge-cms.spotlight-card",
        "openforge-cms.card",
        "openforge-cms.icon-box",
        "openforge-cms.feature-list",
        "openforge-cms.columns",
        "openforge-cms.testimonial",
        "openforge-cms.avatar-group",
        "openforge-cms.team-member",
        "openforge-cms.logo-cloud",
        "openforge-cms.stats-row",
        "openforge-cms.timeline",
        "openforge-cms.accordion",
        "openforge-cms.alert",
        "openforge-cms.cta",
        "openforge-cms.button",
        "openforge-cms.badge",
        "openforge-cms.divider",
        "openforge-cms.spacer",
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
        "openforge-cms.spotlight-card",
        "openforge-cms.feature-list",
        "openforge-cms.stats-row",
        "openforge-cms.testimonial",
        "openforge-cms.badge",
        "openforge-cms.divider",
        "openforge-cms.spacer",
        "openforge-cms.button",
        "openforge-cms.cta",
      ],
    },
    {
      key: "footer",
      label: "Footer",
      allowedBlockIds: ["openforge-cms.footer"],
    },
  ],
  templateNames: ["page", "post", "notFound"],
  // Editorial identity: near-black ink on bone paper, one electric lime
  // accent doing all the shouting, square corners, and a hard offset shadow
  // instead of a soft blur so cards read as printed panels rather than
  // floating glass.
  defaultTokenOverrides: {
    "color.ink": "#0b0b0c",
    "color.paper": "#f4f2ed",
    "color.orange-500": "#d7ff3c",
    "color.action": "#d7ff3c",
    "color.background": "#f4f2ed",
    "radius.card": "0.125rem",
    "radius.control": "0",
    "font.body":
      '"Space Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
    "font.size-body": "1.0625rem",
    "font.weight-strong": "800",
    "line-height.body": "1.5",
    "shadow.card": "0 0.375rem 0 rgb(11 11 12 / 1)",
    "space.section": "7rem",
  },
};
