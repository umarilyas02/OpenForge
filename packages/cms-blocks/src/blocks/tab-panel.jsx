import { createCmsBlock } from "../block.js";

/**
 * One panel of a Tabs block.
 *
 * It deliberately does NOT render its own tab button. The parent Tabs block
 * receives its slot children as already-rendered React elements (see
 * `renderNode` in packages/renderer), so it cannot read this block's props to
 * build the tab strip — Tabs therefore owns the visible tab text via its own
 * `labels` prop. The `label` here is the panel's own accessible/no-CSS title:
 * it is visually hidden, but it names the panel for assistive technology and
 * is the only thing that distinguishes the panels when the stylesheet is
 * missing (at which point every panel is visible at once).
 */
function TabPanel({ label, content }) {
  const paragraphs = (content ?? "").split(/\n{2,}/u).filter(Boolean);

  return (
    <div className="of-block of-tab-panel">
      <h3 className="of-tab-panel-title">{label}</h3>
      {paragraphs.map((paragraph, index) => (
        <p className="of-tab-panel-text" key={index}>
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export const tabPanelBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.tab-panel",
    version: 1,
    name: "Tab Panel",
    description:
      "A single panel of a Tabs block. The visible tab text comes from the parent Tabs block's \"Tab labels\" list; the label here titles the panel for screen readers and for readers with no stylesheet.",
    tags: ["content", "tabs"],
    defaultProps: {
      label: "Overview",
      content: "Describe this tab's content here.",
    },
    editableFields: [
      { path: "label", label: "Tab label", control: "text", required: true },
      { path: "content", label: "Content", control: "textarea", required: true },
    ],
    slots: [],
    accessibility: [
      "The panel's label is a real heading, only visually hidden, so the panel is named and reachable in a screen reader's heading list.",
      "Content is rendered as semantic paragraphs, never raw HTML.",
    ],
    migrations: [],
  },
  component: TabPanel,
});
