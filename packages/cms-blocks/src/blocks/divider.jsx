import { createCmsBlock } from "../block.js";

function Divider({ style }) {
  return (
    <hr
      aria-hidden="true"
      className={`of-block of-divider of-divider-${style ?? "solid"}`}
    />
  );
}

export const dividerBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.divider",
    version: 1,
    name: "Divider",
    description: "A horizontal rule separating sections.",
    tags: ["layout", "divider"],
    defaultProps: { style: "solid" },
    editableFields: [
      {
        path: "style",
        label: "Style",
        control: "select",
        required: false,
        options: [
          { value: "solid", label: "Solid" },
          { value: "dashed", label: "Dashed" },
        ],
      },
    ],
    slots: [],
    accessibility: ["Decorative rule; hidden from assistive technology."],
    migrations: [],
  },
  component: Divider,
});
