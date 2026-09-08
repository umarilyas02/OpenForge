import { createCmsBlock } from "../block.js";

function SocialLinks({ label, slots }) {
  const items = slots?.items ?? [];

  return (
    <nav
      aria-label={
        typeof label === "string" && label.trim() ? label : "Social media"
      }
      className="of-block of-social-links"
    >
      <ul className="of-social-links-list">
        {items.map((item, index) => (
          <li className="of-social-links-item" key={index}>
            {item}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export const socialLinksBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.social-links",
    version: 1,
    name: "Social Links",
    description:
      "A row of social-media icon links — X, Instagram, Facebook, LinkedIn, YouTube, TikTok, GitHub or any other profile.",
    tags: ["navigation", "social"],
    defaultProps: {},
    editableFields: [
      {
        path: "label",
        label: "Navigation label",
        control: "text",
        required: false,
      },
    ],
    slots: [
      {
        name: "items",
        label: "Links",
        acceptedTypes: ["openforge-cms.social-link-item"],
        min: 1,
        max: 10,
      },
    ],
    accessibility: [
      'The row is a real <nav> landmark with an aria-label ("Social media" unless the author renames it), so screen-reader users can tell it apart from the site\'s main navigation.',
      "The links sit in a real <ul>/<li> list, so assistive technology announces how many social profiles there are.",
      "Each child link carries its own aria-label, because the icon is its only visible content.",
    ],
    migrations: [],
  },
  component: SocialLinks,
});
