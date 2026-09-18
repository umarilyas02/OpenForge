import { createCmsBlock } from "../block.js";

function TagList({ heading, tags }) {
  const items = (tags ?? "")
    .split(/[\n,]/)
    .map((tag) => tag.trim())
    .filter(Boolean);

  return (
    <div className="of-block">
      {heading ? (
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {heading}
        </h2>
      ) : null}
      <ul className="flex flex-wrap gap-2">
        {items.map((tag, index) => (
          <li key={index}>
            <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {tag}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const tagListBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.tag-list",
    version: 1,
    name: "Tag List",
    description: "A row of small pill tags, e.g. blog post categories or topics.",
    tags: ["content", "list", "tailwind"],
    defaultProps: {
      heading: "Filed under",
      tags: "Design, Development, Marketing",
    },
    editableFields: [
      { path: "heading", label: "Heading", control: "text", required: false },
      {
        path: "tags",
        label: "Tags (comma or newline separated)",
        control: "textarea",
        required: true,
      },
    ],
    slots: [],
    accessibility: [
      "Tags render as plain static text pills inside a list; no interactive semantics are implied.",
    ],
    migrations: [],
  },
  component: TagList,
});
