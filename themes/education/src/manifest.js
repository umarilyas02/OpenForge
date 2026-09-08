export const manifest = {
  schemaVersion: 1,
  id: "openforge-theme.education",
  name: "Education",
  version: "1.0.0",
  description:
    "A calm, trustworthy theme for schools, academies, and online course sites: navy-and-amber identity with curriculum, tuition, instructor, and student-story sections.",
  regions: [
    {
      key: "page-body",
      label: "Page body",
      allowedBlockIds: [
        // Course-site workhorses, in the order a course page usually needs
        // them: sell the programme, show the curriculum, price it, prove
        // it, answer the objections, then ask for the enrolment.
        "openforge-cms.hero",
        "openforge-cms.banner",
        "openforge-cms.stats-row",
        "openforge-cms.feature-list",
        "openforge-cms.timeline",
        "openforge-cms.data-table",
        "openforge-cms.pricing",
        "openforge-cms.testimonial",
        "openforge-cms.rating",
        "openforge-cms.accordion",
        "openforge-cms.team-member",
        "openforge-cms.cta",
        // General-purpose blocks every page still needs.
        "openforge-cms.heading",
        "openforge-cms.rich-text",
        "openforge-cms.image",
        "openforge-cms.video",
        "openforge-cms.button",
        "openforge-cms.columns",
        "openforge-cms.card",
        "openforge-cms.icon-box",
        "openforge-cms.alert",
        "openforge-cms.badge",
        "openforge-cms.progress",
        "openforge-cms.logo-cloud",
        "openforge-cms.spotlight-card",
        "openforge-cms.divider",
        "openforge-cms.spacer",
        "openforge-cms.navbar",
        "openforge-cms.breadcrumbs",
        "openforge-cms.tabs",
        "openforge-cms.comparison-table",
        "openforge-cms.countdown-timer",
        "openforge-cms.newsletter-signup",
        "openforge-cms.contact-form",
      ],
    },
    {
      key: "post-body",
      label: "Post body",
      allowedBlockIds: [
        // Course-notes / announcement posts: prose first, with room for a
        // recorded session, a syllabus table, and an enrolment nudge.
        "openforge-cms.rich-text",
        "openforge-cms.heading",
        "openforge-cms.image",
        "openforge-cms.video",
        "openforge-cms.alert",
        "openforge-cms.feature-list",
        "openforge-cms.data-table",
        "openforge-cms.accordion",
        "openforge-cms.testimonial",
        "openforge-cms.badge",
        "openforge-cms.card",
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
  // Navy carries the institutional trust, amber is the single warm accent
  // that keeps it from reading as corporate/cold, and the softened radii
  // plus taller line height are tuned for long syllabus-style reading.
  defaultTokenOverrides: {
    "color.ink": "#101f33",
    "color.paper": "#ffffff",
    "color.background": "#f6f8fb",
    "color.action": "#1e3a5f",
    "color.orange-500": "#f2a71b",
    "radius.card": "0.75rem",
    "radius.control": "0.5rem",
    "font.body":
      '"Source Sans 3", "Segoe UI", system-ui, -apple-system, Helvetica, Arial, sans-serif',
    "font.size-body": "1.0625rem",
    "font.weight-strong": "600",
    "line-height.body": "1.7",
    "space.section": "5rem",
    "shadow.card": "0 0.75rem 2rem rgb(16 31 51 / 0.1)",
  },
};
