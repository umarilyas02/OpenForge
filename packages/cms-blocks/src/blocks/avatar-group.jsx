import { createCmsBlock } from "../block.js";

function AvatarGroup({ caption, slots }) {
  const items = slots?.items ?? [];

  return (
    <div className="of-block of-avatar-group">
      <div className="of-avatar-group-stack">
        {items.map((item, index) => (
          <div className="of-avatar-group-slot" key={index}>
            {item}
          </div>
        ))}
      </div>
      {caption ? (
        <span className="of-avatar-group-caption">{caption}</span>
      ) : null}
    </div>
  );
}

export const avatarGroupBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.avatar-group",
    version: 1,
    name: "Avatar Group",
    description:
      'Overlapping avatar photos with a caption, e.g. "Trusted by 200+ teams".',
    tags: ["social-proof", "avatar"],
    defaultProps: {},
    editableFields: [
      { path: "caption", label: "Caption", control: "text", required: false },
    ],
    slots: [
      {
        name: "items",
        label: "Avatars",
        acceptedTypes: ["openforge-cms.avatar-item"],
        min: 2,
        max: 8,
      },
    ],
    accessibility: [
      "Each avatar keeps its own real alt text even though they overlap visually.",
    ],
    migrations: [],
  },
  component: AvatarGroup,
});
