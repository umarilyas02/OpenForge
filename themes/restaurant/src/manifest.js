/**
 * Region note: container blocks (carousel, logo-cloud, accordion,
 * stats-row, timeline) are listed alongside the child block each one
 * accepts in its slot (carousel-slide, logo-item, faq-item, stat,
 * timeline-step). A region gate that only allowed the container would
 * leave the editor unable to add a slide to a gallery or a course to a
 * timeline, which is the whole point of those blocks on a restaurant site.
 */
export const manifest = {
  schemaVersion: 1,
  id: "openforge-theme.restaurant",
  name: "Restaurant",
  version: "1.0.0",
  description:
    "A warm, hearth-toned theme for restaurants and hospitality: menus priced course by course, food and room galleries, hours and location cards, press mentions, and a reservation call to action.",
  regions: [
    {
      key: "page-body",
      label: "Page body",
      allowedBlockIds: [
        "openforge-cms.hero",
        "openforge-cms.banner",
        "openforge-cms.heading",
        "openforge-cms.rich-text",
        "openforge-cms.image",
        "openforge-cms.button",
        "openforge-cms.cta",
        "openforge-cms.columns",
        "openforge-cms.divider",
        "openforge-cms.spacer",
        "openforge-cms.icon-box",
        "openforge-cms.pricing",
        "openforge-cms.testimonial",
        "openforge-cms.rating",
        "openforge-cms.carousel",
        "openforge-cms.carousel-slide",
        "openforge-cms.logo-cloud",
        "openforge-cms.logo-item",
        "openforge-cms.card",
        "openforge-cms.badge",
        "openforge-cms.alert",
        "openforge-cms.feature-list",
        "openforge-cms.accordion",
        "openforge-cms.faq-item",
        "openforge-cms.stats-row",
        "openforge-cms.stat",
        "openforge-cms.team-member",
        "openforge-cms.timeline",
        "openforge-cms.timeline-step",
        "openforge-cms.data-table",
        "openforge-cms.marquee-text",
        "openforge-cms.video",
        "openforge-cms.navbar",
        "openforge-cms.breadcrumbs",
        "openforge-cms.location-card",
        "openforge-cms.image-gallery",
        "openforge-cms.gallery-item",
        "openforge-cms.contact-form",
      ],
    },
    {
      key: "post-body",
      label: "Post body",
      allowedBlockIds: [
        "openforge-cms.rich-text",
        "openforge-cms.heading",
        "openforge-cms.image",
        "openforge-cms.video",
        "openforge-cms.cta",
        "openforge-cms.button",
        "openforge-cms.divider",
        "openforge-cms.spacer",
        "openforge-cms.alert",
        "openforge-cms.badge",
        "openforge-cms.card",
        "openforge-cms.testimonial",
        "openforge-cms.pricing",
        "openforge-cms.feature-list",
        "openforge-cms.data-table",
        "openforge-cms.carousel",
        "openforge-cms.carousel-slide",
      ],
    },
    {
      key: "footer",
      label: "Footer",
      allowedBlockIds: [
        "openforge-cms.footer",
        "openforge-cms.rich-text",
        "openforge-cms.social-links",
      ],
    },
  ],
  templateNames: ["page", "post", "notFound"],
  /**
   * The theme's whole visual identity. Blocks are shared across every
   * OpenForge theme, so colour, corner radius, and typeface are what make
   * this one read as a restaurant rather than a SaaS landing page.
   */
  defaultTokenOverrides: {
    // Roasted-cocoa brown instead of near-black: warmer against cream.
    "color.ink": "#2c1a15",
    // Card/surface white, very slightly warm so it never looks clinical.
    "color.paper": "#fffaf3",
    // Page ground: warm cream, the colour of unbleached linen.
    "color.background": "#faf3ea",
    // Deep terracotta — fired clay, the brand colour.
    "color.orange-500": "#8a3324",
    // A brighter ember for links and buttons so interactive elements stay
    // distinguishable from terracotta surfaces (5.4:1 on the cream ground).
    "color.action": "#a34530",
    "space.section": "5rem",
    "radius.control": "0.75rem",
    "radius.card": "1.75rem",
    "font.body": 'Georgia, "Iowan Old Style", "Times New Roman", serif',
    "font.size-body": "1.0625rem",
    // 700 is shouty in a serif; 600 keeps emphasis without slab weight.
    "font.weight-strong": "600",
    "line-height.body": "1.7",
    "shadow.card": "0 1.25rem 3rem rgb(44 26 21 / 0.16)",
  },
};
