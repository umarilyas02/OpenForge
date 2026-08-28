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
    defaultProps: {},
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
