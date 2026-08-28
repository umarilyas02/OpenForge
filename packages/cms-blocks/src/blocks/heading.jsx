import { createCmsBlock } from "../block.js";

function Heading({ text, level, align }) {
  const Tag = level === "h3" ? "h3" : level === "h4" ? "h4" : "h2";
  return (
    <Tag className={`of-block of-heading of-heading-${align ?? "left"}`}>
      {text}
    </Tag>
  );
}

export const headingBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.heading",
    version: 1,
    name: "Heading",
    description: "A standalone section heading.",
    tags: ["text", "heading"],
    defaultProps: { level: "h2", align: "left" },
    editableFields: [
      { path: "text", label: "Text", control: "text", required: true },
      {
        path: "level",
        label: "Level",
        control: "select",
        required: false,
        options: [
          { value: "h2", label: "Heading 2" },
          { value: "h3", label: "Heading 3" },
          { value: "h4", label: "Heading 4" },
        ],
      },
      {
        path: "align",
        label: "Alignment",
        control: "select",
        required: false,
        options: [
          { value: "left", label: "Left" },
          { value: "center", label: "Center" },
        ],
      },
    ],
    slots: [],
    accessibility: [
      "Renders a real semantic heading level, never styled text.",
    ],
    migrations: [],
  },
  component: Heading,
});
