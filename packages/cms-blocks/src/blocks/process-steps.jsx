import { createCmsBlock } from "../block.js";

function ProcessSteps({ heading, steps }) {
  const rows = (steps ?? "").split("\n").filter(Boolean);

  return (
    <div className="of-block">
      {heading ? (
        <h2 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-slate-50">
          {heading}
        </h2>
      ) : null}
      <ol className="space-y-4">
        {rows.map((row, index) => (
          <li
            className="flex items-start gap-4 text-slate-700 dark:text-slate-300"
            key={index}
          >
            <span
              aria-hidden="true"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white"
            >
              {index + 1}
            </span>
            <span className="mt-1">{row}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export const processStepsBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.process-steps",
    version: 1,
    name: "Process Steps",
    description:
      "A numbered 'How it works' list of steps, each shown with a visible number badge.",
    tags: ["content", "list", "tailwind"],
    defaultProps: {
      heading: "How it works",
      steps: "Sign up for an account\nConnect your site\nGo live in minutes",
    },
    editableFields: [
      { path: "heading", label: "Heading", control: "text", required: false },
      {
        path: "steps",
        label: "Steps (one per line)",
        control: "textarea",
        required: true,
      },
    ],
    slots: [],
    accessibility: [
      "Each numbered badge is decorative (aria-hidden); the ordered list markup conveys sequence to assistive technology.",
    ],
    migrations: [],
  },
  component: ProcessSteps,
});
