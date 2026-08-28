import { createCmsBlock } from "../block.js";

function FeatureList({ heading, items }) {
  const rows = (items ?? "").split("\n").filter(Boolean);

  return (
    <div className="of-block">
      {heading ? (
        <h2 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-slate-50">
          {heading}
        </h2>
      ) : null}
      <ul className="space-y-3">
        {rows.map((row, index) => (
          <li
            className="flex items-start gap-3 text-slate-700 dark:text-slate-300"
            key={index}
          >
            <svg
              aria-hidden="true"
              className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                d="M4 10.5l3.5 3.5L16 6"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span>{row}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const featureListBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.feature-list",
    version: 1,
    name: "Feature List",
    description: "A checklist of features or benefits, one per line.",
    tags: ["content", "list", "tailwind"],
    defaultProps: {},
    editableFields: [
      { path: "heading", label: "Heading", control: "text", required: false },
      {
        path: "items",
        label: "Items (one per line)",
        control: "textarea",
        required: true,
      },
    ],
    slots: [],
    accessibility: [
      "The check icon is decorative (aria-hidden); each item is real list-item text.",
    ],
    migrations: [],
  },
  component: FeatureList,
});
