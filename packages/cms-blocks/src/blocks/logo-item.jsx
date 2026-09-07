import { createCmsBlock } from "../block.js";

function LogoItem({ image, name }) {
  return (
    <div className="of-block of-logo-item">
      <img alt={name} className="of-logo-item-image" src={image} />
    </div>
  );
}

export const logoItemBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.logo-item",
    version: 1,
    name: "Logo",
    description: "A single logo image. Used inside Logo Cloud.",
    tags: ["social-proof", "logo"],
    defaultProps: {
      image:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='60'%3E%3Crect width='160' height='60' fill='%23e2e2e2'/%3E%3C/svg%3E",
      name: "Company name",
    },
    editableFields: [
      { path: "image", label: "Logo image", control: "image", required: true },
      { path: "name", label: "Company name", control: "text", required: true },
    ],
    slots: [],
    accessibility: [
      "The image's alt text is the real company name, not decorative.",
    ],
    migrations: [],
  },
  component: LogoItem,
});
