import { createCmsBlock } from "../block.js";

/**
 * A tabbed content switcher with zero client-side JavaScript.
 *
 * The mechanism is the classic CSS-only radio technique: one hidden
 * `<input type="radio">` per tab, all sharing a single `name`, rendered as
 * siblings *before* the tab strip and the panel list so a `:checked ~` sibling
 * selector in tabs.block.css can reveal exactly one panel.
 *
 * Why the labels live on this block rather than on Tab Panel: a block
 * component receives `slots.<name>` as an array of already-rendered React
 * elements (see `renderNode` in packages/renderer), not as raw prop data, so
 * Tabs has no way to read each child's own `label` prop when it builds the tab
 * strip. The tab text therefore has to be Tabs' own prop, one per line, in the
 * same order as the panels.
 */

const MAX_TABS = 8;

/** Reduce an author-supplied group id to something safe for `id`/`name`. */
function toGroupId(value) {
  const slug = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-+|-+$/gu, "");

  return slug || "tabs";
}

function Tabs({ heading, labels, groupId, slots }) {
  const panels = (slots?.items ?? []).slice(0, MAX_TABS);
  const tabLabels = String(labels ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const group = `of-tabs-${toGroupId(groupId)}`;
  const inputId = (index) => `${group}-${index + 1}`;
  const tabId = (index) => `${group}-${index + 1}-tab`;

  return (
    <section className="of-block of-tabs">
      {heading ? <h2 className="of-tabs-heading">{heading}</h2> : null}
      {panels.length > 0 ? (
        <div className="of-tabs-shell">
          {panels.map((_, index) => (
            <input
              className="of-tabs-input"
              data-index={String(index + 1)}
              defaultChecked={index === 0}
              id={inputId(index)}
              key={`input-${index}`}
              name={group}
              type="radio"
            />
          ))}
          <div className="of-tabs-list">
            {panels.map((_, index) => (
              <label
                className="of-tabs-tab"
                data-index={String(index + 1)}
                htmlFor={inputId(index)}
                id={tabId(index)}
                key={`tab-${index}`}
              >
                {tabLabels[index] ?? `Tab ${index + 1}`}
              </label>
            ))}
          </div>
          <div className="of-tabs-panels">
            {panels.map((panel, index) => (
              <div
                aria-labelledby={tabId(index)}
                className="of-tabs-panel"
                data-index={String(index + 1)}
                key={`panel-${index}`}
                role="group"
              >
                {panel}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

export const tabsBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.tabs",
    version: 1,
    name: "Tabs",
    description:
      "A tabbed content switcher that shows one panel at a time using CSS only, with no JavaScript. Add one Tab Panel per tab, then list the tab labels one per line in the same order as the panels — the first line labels the first panel, and so on. If a page uses more than one Tabs block, give each a distinct Group ID so their tabs do not switch each other.",
    tags: ["content", "tabs"],
    defaultProps: {
      labels: "Overview\nFeatures\nPricing",
      groupId: "tabs",
    },
    editableFields: [
      { path: "heading", label: "Heading", control: "text", required: false },
      {
        path: "labels",
        label: "Tab labels (one per line, in panel order)",
        control: "textarea",
        required: true,
      },
      {
        path: "groupId",
        label: "Group ID (unique per Tabs block on a page)",
        control: "text",
        required: false,
      },
    ],
    slots: [
      {
        name: "items",
        label: "Tabs",
        acceptedTypes: ["openforge-cms.tab-panel"],
        min: 1,
        max: MAX_TABS,
      },
    ],
    accessibility: [
      "Each tab is a real <label> bound to a focusable radio input, so tabs can be reached with Tab and switched with the arrow keys without any JavaScript.",
      "The focused tab keeps a visible focus ring, forwarded from its hidden input via :focus-visible.",
      "Each panel is named by its own tab through aria-labelledby.",
    ],
    migrations: [],
  },
  component: Tabs,
});
