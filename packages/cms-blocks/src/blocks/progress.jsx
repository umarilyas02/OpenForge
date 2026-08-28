import { createCmsBlock } from "../block.js";

function clampPercent(value) {
  const number = Number(value);
  if (Number.isNaN(number)) return 0;
  return Math.min(100, Math.max(0, number));
}

function Progress({ label, percent }) {
  const clamped = clampPercent(percent);

  return (
    <div className="of-block of-progress">
      <div className="of-progress-header">
        <span className="of-progress-label">{label}</span>
        <span className="of-progress-value">{clamped}%</span>
      </div>
      <div
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={clamped}
        className="of-progress-track"
        role="progressbar"
      >
        <div className="of-progress-fill" style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}

export const progressBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.progress",
    version: 1,
    name: "Progress",
    description: "A labeled progress bar for a skill, goal, or funding target.",
    tags: ["content", "progress"],
    defaultProps: { percent: "50" },
    editableFields: [
      { path: "label", label: "Label", control: "text", required: true },
      {
        path: "percent",
        label: "Percent complete",
        control: "select",
        required: true,
        options: [
          { value: "10", label: "10%" },
          { value: "20", label: "20%" },
          { value: "30", label: "30%" },
          { value: "40", label: "40%" },
          { value: "50", label: "50%" },
          { value: "60", label: "60%" },
          { value: "70", label: "70%" },
          { value: "80", label: "80%" },
          { value: "90", label: "90%" },
          { value: "100", label: "100%" },
        ],
      },
    ],
    slots: [],
    accessibility: [
      "Uses a real progressbar role with aria-valuenow/min/max; the numeric value is also shown as visible text.",
    ],
    migrations: [],
  },
  component: Progress,
});
