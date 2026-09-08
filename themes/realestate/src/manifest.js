export const manifest = {
  schemaVersion: 1,
  id: "openforge-theme.realestate",
  name: "Realestate",
  version: "1.0.0",
  description:
    "An upscale property theme for brokerages and agents: listing grids, photo carousels, market stats, agent profiles, and tour-booking calls to action in navy and brass.",
  regions: [
    {
      key: "page-body",
      label: "Page body",
      allowedBlockIds: [
        // Above the fold: the property or the market, stated plainly.
        "openforge-cms.hero",
        "openforge-cms.banner",
        "openforge-cms.heading",
        "openforge-cms.rich-text",
        // Property photography.
        "openforge-cms.image",
        "openforge-cms.carousel",
        "openforge-cms.video",
        // Listing grids are `card` blocks inside `columns` — there is no
        // dedicated listing-grid block, and this composes out of what exists.
        "openforge-cms.columns",
        "openforge-cms.card",
        // Neighborhood and amenity highlights.
        "openforge-cms.icon-box",
        "openforge-cms.feature-list",
        // Market numbers and proof.
        "openforge-cms.stats-row",
        "openforge-cms.data-table",
        "openforge-cms.progress",
        "openforge-cms.testimonial",
        "openforge-cms.rating",
        "openforge-cms.logo-cloud",
        // The people doing the selling.
        "openforge-cms.team-member",
        "openforge-cms.avatar-group",
        "openforge-cms.timeline",
        // Buyer and seller questions.
        "openforge-cms.accordion",
        "openforge-cms.alert",
        // Book a showing.
        "openforge-cms.cta",
        "openforge-cms.button",
        "openforge-cms.badge",
        // Layout utilities.
        "openforge-cms.divider",
        "openforge-cms.spacer",
      ],
    },
    {
      key: "post-body",
      label: "Post body",
      allowedBlockIds: [
        // Market reports and neighborhood guides.
        "openforge-cms.rich-text",
        "openforge-cms.heading",
        "openforge-cms.image",
        "openforge-cms.carousel",
        "openforge-cms.columns",
        "openforge-cms.card",
        "openforge-cms.data-table",
        "openforge-cms.stats-row",
        "openforge-cms.feature-list",
        "openforge-cms.testimonial",
        "openforge-cms.accordion",
        "openforge-cms.alert",
        "openforge-cms.badge",
        "openforge-cms.cta",
        "openforge-cms.button",
        "openforge-cms.divider",
        "openforge-cms.spacer",
      ],
    },
    {
      key: "footer",
      label: "Footer",
      allowedBlockIds: ["openforge-cms.footer"],
    },
  ],
  templateNames: ["page", "post", "notFound"],
  defaultTokenOverrides: {
    // Deep harbor navy. Every muted border, caption, and tint in blocks.css
    // is a color-mix against color.ink, so setting it here turns the whole
    // neutral scale navy-tinted instead of grey.
    "color.ink": "#12233f",
    // Kept pure white: color.paper is the label color printed on top of the
    // action-colored CTA button, so it has to stay maximally light.
    "color.paper": "#ffffff",
    // Warm alabaster page ground instead of clinical white. Card and panel
    // surfaces are color-mixed against it, so the whole page sits on
    // limestone rather than on a lightbox.
    "color.background": "#f7f4ee",
    // Brand display gold (brass) — the identity hue.
    "color.orange-500": "#c9a24b",
    // A deeper brass for anything that has to be *read*: link text and the
    // filled CTA. #c9a24b on white is only ~1.9:1; #8a6a24 is ~5.0:1.
    "color.action": "#8a6a24",
    // Restrained corners: property photography, not app chrome.
    "radius.card": "0.5rem",
    "radius.control": "0.25rem",
    // A transitional serif for body copy — estate-agency stationery.
    "font.body":
      '"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, "Times New Roman", serif',
    "font.size-body": "1.0625rem",
    "line-height.body": "1.7",
    "font.weight-strong": "600",
    // Softer, navy-tinted elevation instead of neutral black.
    "shadow.card": "0 1.25rem 2.5rem rgb(18 35 63 / 0.10)",
    "space.section": "5rem",
  },
};
