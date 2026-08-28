import { createCmsBlock } from "../block.js";

function Stat({ value, label }) {
  return (
    <div className="of-block of-stat">
      <span className="of-stat-value">{value}</span>
      <span className="of-stat-label">{label}</span>
    </div>
  );
}

export const statBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.stat",
    version: 1,
    name: "Stat",
    description: "A single number-and-label statistic. Used inside Stats Row.",
    tags: ["stats"],
    defaultProps: {},
    editableFields: [
      { path: "value", label: "Value", control: "text", required: true },
      { path: "label", label: "Label", control: "text", required: true },
    ],
    slots: [],
    accessibility: ["The value and label are both plain readable text."],
    migrations: [],
  },
  component: Stat,
});
