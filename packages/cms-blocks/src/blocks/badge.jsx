import { createCmsBlock } from "../block.js";

function Badge({ text, tone }) {
  return (
    <span className={`of-block of-badge of-badge-${tone ?? "neutral"}`}>
      {text}
    </span>
  );
}

export const badgeBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.badge",
    version: 1,
    name: "Badge",
    description: 'A small inline label, e.g. "New" or "Beta".',
    tags: ["content", "label"],
    defaultProps: { tone: "neutral" },
    editableFields: [
      { path: "text", label: "Text", control: "text", required: true },
      {
        path: "tone",
        label: "Tone",
        control: "select",
        required: false,
        options: [
          { value: "neutral", label: "Neutral" },
          { value: "accent", label: "Accent" },
          { value: "success", label: "Success" },
          { value: "warning", label: "Warning" },
          { value: "danger", label: "Danger" },
        ],
      },
    ],
    slots: [],
    accessibility: [
      "Renders as plain inline text with color as the only differentiator, so tone is reinforced by wording, not color alone.",
    ],
    migrations: [],
  },
  component: Badge,
});
