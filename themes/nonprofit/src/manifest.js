export const manifest = {
  schemaVersion: 1,
  id: "openforge-theme.nonprofit",
  name: "Nonprofit",
  version: "1.0.0",
  description:
    "A warm, trust-building theme for nonprofits and causes: impact numbers, programs, stories from the people you serve, partner logos, and a donate or volunteer call to action.",
  regions: [
    {
      key: "page-body",
      label: "Page body",
      allowedBlockIds: [
        "openforge-cms.hero",
        "openforge-cms.heading",
        "openforge-cms.rich-text",
        "openforge-cms.image",
        "openforge-cms.stats-row",
        "openforge-cms.icon-box",
        "openforge-cms.testimonial",
        "openforge-cms.timeline",
        "openforge-cms.team-member",
        "openforge-cms.logo-cloud",
        "openforge-cms.cta",
        "openforge-cms.button",
        "openforge-cms.columns",
        "openforge-cms.card",
        "openforge-cms.feature-list",
        "openforge-cms.accordion",
        "openforge-cms.progress",
        "openforge-cms.banner",
        "openforge-cms.alert",
        "openforge-cms.badge",
        "openforge-cms.avatar-group",
        "openforge-cms.data-table",
        "openforge-cms.video",
        "openforge-cms.divider",
        "openforge-cms.spacer",
        "openforge-cms.navbar",
        "openforge-cms.breadcrumbs",
        "openforge-cms.image-gallery",
        "openforge-cms.countdown-timer",
        "openforge-cms.location-card",
        "openforge-cms.newsletter-signup",
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
        "openforge-cms.testimonial",
        "openforge-cms.stats-row",
        "openforge-cms.feature-list",
        "openforge-cms.alert",
        "openforge-cms.cta",
        "openforge-cms.button",
        "openforge-cms.video",
        "openforge-cms.divider",
      ],
    },
    {
      key: "footer",
      label: "Footer",
      allowedBlockIds: ["openforge-cms.footer", "openforge-cms.social-links"],
    },
  ],
  templateNames: ["page", "post", "notFound"],
  // Identity: sunflower amber as the highlight color, a deep field green as
  // the interactive/action color. The amber carries the warmth and optimism
  // a cause site needs, but it is far too light to sit under white text, so
  // the green does the load-bearing work: #2f7a4a is ~5.2:1 against white
  // and ~4.9:1 against the cream paper, clearing WCAG AA both ways, while
  // the amber stays a highlight (rules, markers, accents) rather than a
  // button fill. Ink is a warm near-black rather than a cool one so nothing
  // on the page reads as corporate-cold, paper is a barely-there cream, and
  // cards are moderately rounded (1rem) — friendly, not playful.
  defaultTokenOverrides: {
    "color.ink": "#22201b",
    "color.paper": "#fffdf7",
    "color.background": "#fdf8ec",
    "color.orange-500": "#f2a71b",
    "color.action": "#2f7a4a",
    "radius.card": "1rem",
    "radius.control": "0.625rem",
    "font.body": "Nunito Sans, Segoe UI, Helvetica Neue, Arial, sans-serif",
    "font.size-body": "1.0625rem",
    "line-height.body": "1.7",
    "font.weight-strong": "700",
    "space.section": "4.5rem",
    "shadow.card": "0 0.75rem 2rem rgb(34 32 27 / 0.10)",
  },
};
