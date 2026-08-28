import { createCmsBlock } from "../block.js";

function Spacer({ size }) {
  return (
    <div
      aria-hidden="true"
      className={`of-block of-spacer of-spacer-${size ?? "md"}`}
    />
  );
}

export const spacerBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.spacer",
    version: 1,
    name: "Spacer",
    description: "Adds vertical space between blocks.",
    tags: ["layout", "spacer"],
    defaultProps: { size: "md" },
    editableFields: [
      {
        path: "size",
        label: "Size",
        control: "select",
        required: false,
        options: [
          { value: "sm", label: "Small" },
          { value: "md", label: "Medium" },
          { value: "lg", label: "Large" },
          { value: "xl", label: "Extra large" },
        ],
      },
    ],
    slots: [],
    accessibility: [
      "Purely decorative spacing; hidden from assistive technology.",
    ],
    migrations: [],
  },
  component: Spacer,
});
