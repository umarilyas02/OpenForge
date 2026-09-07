import { createCmsBlock } from "../block.js";

function AvatarItem({ image, name }) {
  return <img alt={name} className="of-block of-avatar-item" src={image} />;
}

export const avatarItemBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.avatar-item",
    version: 1,
    name: "Avatar",
    description: "A single person's photo. Used inside Avatar Group.",
    tags: ["social-proof", "avatar"],
    defaultProps: {
      image:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Crect width='96' height='96' fill='%23e2e2e2'/%3E%3C/svg%3E",
      name: "Person name",
    },
    editableFields: [
      { path: "image", label: "Photo", control: "image", required: true },
      { path: "name", label: "Name", control: "text", required: true },
    ],
    slots: [],
    accessibility: [
      "The image's alt text is the real person's name, not decorative.",
    ],
    migrations: [],
  },
  component: AvatarItem,
});
