import { createCmsBlock } from "../block.js";

function ButtonBlock({ label, href, variant }) {
  return (
    <div className="of-block of-button-block">
      <a className={`of-button of-button-${variant ?? "primary"}`} href={href}>
        {label}
      </a>
    </div>
  );
}

export const buttonBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.button",
    version: 1,
    name: "Button",
    description: "A single standalone button.",
    tags: ["conversion", "button"],
    defaultProps: { variant: "primary" },
    editableFields: [
      { path: "label", label: "Label", control: "text", required: true },
      { path: "href", label: "Link", control: "url", required: true },
      {
        path: "variant",
        label: "Style",
        control: "select",
        required: false,
        options: [
          { value: "primary", label: "Primary" },
          { value: "secondary", label: "Secondary" },
          { value: "outline", label: "Outline" },
        ],
      },
    ],
    slots: [],
    accessibility: [
      "Renders as a real link, not a non-interactive styled span.",
    ],
    migrations: [],
  },
  component: ButtonBlock,
});
