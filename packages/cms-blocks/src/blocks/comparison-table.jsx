import { createCmsBlock } from "../block.js";

/**
 * Resolve the `featuredColumn` prop into a real column index.
 *
 * The prop is authored as a 1-based index into the comparison columns — the
 * headers AFTER the leading feature-name column. With headers
 * `"Feature, Starter, Pro, Enterprise"`, `"1"` is Starter, `"2"` is Pro and
 * `"3"` is Enterprise. Because column 0 is always the feature-name column, the
 * authored number happens to equal the 0-based index into `headerCells`, so
 * this returns that index directly.
 *
 * Anything that is not a whole number inside the available column range —
 * empty, blank, "abc", "0", "2.5", "99", a boolean, null — resolves to 0,
 * which the component treats as "no featured column". The editor only offers a
 * free-text control for this, so a bad value has to degrade quietly instead of
 * throwing.
 *
 * @param {unknown} featuredColumn Raw prop value, usually a string.
 * @param {number} columnCount Number of parsed header cells.
 * @returns {number} 0-based index into the header cells, or 0 for "none".
 */
function resolveFeaturedIndex(featuredColumn, columnCount) {
  const raw =
    typeof featuredColumn === "number"
      ? featuredColumn
      : Number(String(featuredColumn ?? "").trim());

  if (!Number.isInteger(raw) || raw < 1 || raw > columnCount - 1) {
    return 0;
  }

  return raw;
}

/**
 * Split the `headers` prop on commas.
 *
 * @param {string | undefined} headers
 * @returns {string[]}
 */
function parseHeaderCells(headers) {
  return (headers ?? "")
    .split(",")
    .map((cell) => cell.trim())
    .filter(Boolean);
}

/**
 * Split the `rows` prop into rows on newlines, then into cells on pipes.
 *
 * @param {string | undefined} rows
 * @returns {string[][]}
 */
function parseBodyRows(rows) {
  return (rows ?? "")
    .split("\n")
    .map((row) => row.trim())
    .filter(Boolean)
    .map((row) => row.split("|").map((cell) => cell.trim()));
}

function ComparisonTable({ heading, headers, rows, featuredColumn }) {
  const headerCells = parseHeaderCells(headers);
  const bodyRows = parseBodyRows(rows);
  const featuredIndex = resolveFeaturedIndex(featuredColumn, headerCells.length);
  const regionLabel = (heading ?? "").trim() || "Feature comparison";

  if (headerCells.length === 0 && bodyRows.length === 0) {
    return null;
  }

  return (
    <div className="of-block of-comparison-table">
      {heading ? (
        <h2 className="of-comparison-table-heading">{heading}</h2>
      ) : null}
      <div
        aria-label={regionLabel}
        className="of-comparison-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="of-comparison-table-grid">
          {headerCells.length > 0 ? (
            <thead>
              <tr>
                {headerCells.map((cell, index) => (
                  <th
                    className={
                      index === featuredIndex
                        ? "of-comparison-table-featured"
                        : undefined
                    }
                    key={index}
                    scope="col"
                  >
                    {cell}
                    {index === featuredIndex ? (
                      <span className="of-comparison-table-flag">
                        Recommended
                      </span>
                    ) : null}
                  </th>
                ))}
              </tr>
            </thead>
          ) : null}
          <tbody>
            {bodyRows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) =>
                  cellIndex === 0 ? (
                    <th
                      className="of-comparison-table-feature"
                      key={cellIndex}
                      scope="row"
                    >
                      {cell}
                    </th>
                  ) : (
                    <td
                      className={
                        cellIndex === featuredIndex
                          ? "of-comparison-table-featured"
                          : undefined
                      }
                      key={cellIndex}
                    >
                      {cell}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const comparisonTableBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.comparison-table",
    version: 1,
    name: "Comparison Table",
    description:
      "A side-by-side plan comparison grid: one row per feature, one column per plan. Columns come from a comma-separated header line whose first entry names the feature column, as in Feature, Starter, Pro, Enterprise. Rows are one per line, cells separated by |, with the first cell as the feature name. Featured column takes a 1-based number counting the plan columns only (2 highlights Pro in that example) to mark one plan as recommended; blank or out of range means no highlight.",
    tags: ["pricing", "comparison", "table"],
    defaultProps: {
      heading: "Compare plans",
      headers: "Feature, Starter, Pro, Enterprise",
      rows: "Team members|3|25|Unlimited\nProjects|5|Unlimited|Unlimited\nStorage|5 GB|100 GB|1 TB\nSupport|Email|Priority email|Dedicated manager\nSSO and audit log|Not included|Not included|Included",
      featuredColumn: "2",
    },
    editableFields: [
      { path: "heading", label: "Heading", control: "text", required: false },
      {
        path: "headers",
        label:
          "Column headers (comma-separated; first one names the feature column)",
        control: "text",
        required: true,
      },
      {
        path: "rows",
        label:
          "Feature rows (one per line, cells separated by |; first cell is the feature name)",
        control: "textarea",
        required: true,
      },
      {
        path: "featuredColumn",
        label:
          "Featured column (1-based, counting plan columns only; blank for none)",
        control: "text",
        required: false,
      },
    ],
    slots: [],
    accessibility: [
      'Real <table> markup with <th scope="col"> on every plan heading and <th scope="row"> on every feature name, so a screen reader announces both the feature and the plan a cell belongs to instead of reading bare values.',
      'The featured column is not signalled by color alone: its header also carries a visible "Recommended" text label that is read out with the column name.',
      "The table sits in a labelled, keyboard-focusable scroll region, so a narrow-viewport or zoomed-in visitor can scroll the extra plan columns into view with the keyboard rather than losing them off-screen.",
    ],
    migrations: [],
  },
  component: ComparisonTable,
});
