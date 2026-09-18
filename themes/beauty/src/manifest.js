export const manifest = {
  schemaVersion: 1,
  id: "openforge-theme.beauty",
  name: "Beauty",
  version: "1.0.0",
  description:
    "A soft, elegant theme for salons and day spas: hero, service, pricing, gallery, and booking sections in a blush-pink and cream identity.",
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
        "openforge-cms.cta",
        "openforge-cms.banner",
        "openforge-cms.marquee-text",
        "openforge-cms.button",
        "openforge-cms.image",
        "openforge-cms.video",
        "openforge-cms.badge",
        "openforge-cms.alert",
        "openforge-cms.progress",
        "openforge-cms.divider",
        "openforge-cms.spacer",
        "openforge-cms.breadcrumbs",
        "openforge-cms.tabs",
        "openforge-cms.comparison-table",
        "openforge-cms.countdown-timer",
        "openforge-cms.contact-form",
        "openforge-cms.newsletter-signup",
        "openforge-cms.location-card",
        "openforge-cms.image-gallery",
        "openforge-cms.social-links",
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
  defaultTokenOverrides: {
    // Warm plum-brown rather than pure black: softer next to a blush ground.
    "color.ink": "#3d2b2f",
    // Cards and surfaces: warm ivory, never a clinical stark white.
    "color.paper": "#fffbfa",
    // Page ground: soft blush cream, the theme's signature backdrop.
    "color.background": "#fdf1ee",
    // Brand accent: dusty rose, replacing OpenForge orange.
    "color.orange-500": "#d98fa2",
    // A deeper rose for links and buttons, ~5.7:1 against white surfaces.
    "color.action": "#a8445f",
    // Relaxed, spa-like breathing room between sections.
    "space.section": "5rem",
    // Fully rounded pill controls for a soft, unhurried feel.
    "radius.control": "999px",
    // Generously rounded cards to match the pill controls.
    "radius.card": "1.75rem",
    "font.body":
      '"Cormorant Garamond", Garamond, "Times New Roman", Georgia, serif',
    "font.size-body": "1.0625rem",
    // 600 keeps emphasis without turning a light serif heavy or shouty.
    "font.weight-strong": "600",
    // Loose leading so long treatment descriptions still feel unhurried.
    "line-height.body": "1.75",
    // A soft, warm rose-tinted lift instead of a hard grey drop shadow.
    "shadow.card": "0 1.5rem 3rem rgb(168 68 95 / 0.14)",
  },
};
