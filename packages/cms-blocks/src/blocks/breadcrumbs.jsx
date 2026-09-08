import { createCmsBlock } from "../block.js";

/**
 * Parse the `items` textarea into a breadcrumb trail.
 *
 * One crumb per line. A crumb is `Label|href` (split on the FIRST pipe, so a
 * href may itself contain no pipe but a label may contain any other
 * character), or just `Label` with no pipe for a crumb that is not a link.
 * The final crumb is always rendered as plain, non-linked current-page text.
 *
 * @param {string | undefined} items
 * @returns {{ label: string, href: string }[]}
 */
function parseCrumbs(items) {
  return (items ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separatorIndex = line.indexOf("|");
      if (separatorIndex === -1) {
        return { label: line, href: "" };
      }
      return {
        label: line.slice(0, separatorIndex).trim(),
        href: line.slice(separatorIndex + 1).trim(),
      };
    })
    .filter((crumb) => crumb.label !== "");
}

function Breadcrumbs({ items }) {
  const crumbs = parseCrumbs(items);

  if (crumbs.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="of-block of-breadcrumbs">
      <ol className="of-breadcrumbs-list">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;

          if (isLast) {
            return (
              <li
                aria-current="page"
                className="of-breadcrumbs-item of-breadcrumbs-current"
                key={index}
              >
                {crumb.label}
              </li>
            );
          }

          return (
            <li className="of-breadcrumbs-item" key={index}>
              {crumb.href ? (
                <a className="of-breadcrumbs-link" href={crumb.href}>
                  {crumb.label}
                </a>
              ) : (
                <span className="of-breadcrumbs-text">{crumb.label}</span>
              )}
              <span aria-hidden="true" className="of-breadcrumbs-separator">
                /
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export const breadcrumbsBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.breadcrumbs",
    version: 1,
    name: "Breadcrumbs",
    description:
      "A compact breadcrumb trail showing where the current page sits in the site hierarchy. One crumb per line, written as Label|href for linked crumbs and Label alone for the current page.",
    tags: ["navigation"],
    defaultProps: {
      items:
        "Home|/\nProducts|/products\nAccessories|/products/accessories\nWidget Pro",
    },
    editableFields: [
      {
        path: "items",
        label:
          "Crumbs (one per line, Label|href; last line is the current page)",
        control: "textarea",
        required: true,
      },
    ],
    slots: [],
    accessibility: [
      'The trail is wrapped in <nav aria-label="Breadcrumb"> containing an ordered list, so screen readers announce it as a named navigation landmark with the hierarchy order intact.',
      'The final crumb is rendered as plain text carrying aria-current="page" rather than a link, because it points at the page the visitor is already on.',
      'The "/" glyph between crumbs is a decorative aria-hidden span, so it is never read aloud between crumb labels.',
    ],
    migrations: [],
  },
  component: Breadcrumbs,
});
