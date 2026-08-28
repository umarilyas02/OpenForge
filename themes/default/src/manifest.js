export const manifest = {
  schemaVersion: 1,
  id: "openforge-theme.default",
  name: "Default",
  version: "1.0.0",
  description:
    "The default OpenForge CMS theme: a clean, accessible starting point.",
  regions: [
    {
      key: "page-body",
      label: "Page body",
      allowedBlockIds: [
        "openforge-cms.hero",
        "openforge-cms.rich-text",
        "openforge-cms.image",
        "openforge-cms.cta",
        "openforge-cms.columns",
      ],
    },
    {
      key: "post-body",
      label: "Post body",
      allowedBlockIds: [
        "openforge-cms.rich-text",
        "openforge-cms.image",
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
  defaultTokenOverrides: {},
};
