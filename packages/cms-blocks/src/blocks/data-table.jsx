import { createCmsBlock } from "../block.js";

function DataTable({ heading, headers, rows }) {
  const headerCells = (headers ?? "")
    .split(",")
    .map((cell) => cell.trim())
    .filter(Boolean);
  const bodyRows = (rows ?? "")
    .split("\n")
    .filter(Boolean)
    .map((row) => row.split("|").map((cell) => cell.trim()));

  return (
    <div className="of-block">
      {heading ? (
        <h2 className="mb-4 text-2xl font-semibold text-slate-900 dark:text-slate-50">
          {heading}
        </h2>
      ) : null}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full border-collapse text-left text-sm">
          {headerCells.length > 0 ? (
            <thead>
              <tr className="bg-slate-900 text-slate-50 dark:bg-slate-800">
                {headerCells.map((cell, index) => (
                  <th className="px-4 py-3 font-medium" key={index} scope="col">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
          ) : null}
          <tbody>
            {bodyRows.map((row, rowIndex) => (
              <tr
                className="border-t border-slate-200 even:bg-slate-50 dark:border-slate-800 dark:even:bg-slate-900"
                key={rowIndex}
              >
                {row.map((cell, cellIndex) => (
                  <td
                    className="px-4 py-3 text-slate-700 dark:text-slate-300"
                    key={cellIndex}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const dataTableBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.data-table",
    version: 1,
    name: "Data Table",
    description:
      "A simple data table with comma-separated headers and piped rows.",
    tags: ["content", "table", "tailwind"],
    defaultProps: {},
    editableFields: [
      { path: "heading", label: "Heading", control: "text", required: false },
      {
        path: "headers",
        label: "Column headers (comma-separated)",
        control: "text",
        required: false,
      },
      {
        path: "rows",
        label: "Rows (one per line, cells separated by |)",
        control: "textarea",
        required: true,
      },
    ],
    slots: [],
    accessibility: [
      'Uses real <table>/<th scope="col">/<td> markup, so screen readers announce column headers for each cell.',
    ],
    migrations: [],
  },
  component: DataTable,
});
