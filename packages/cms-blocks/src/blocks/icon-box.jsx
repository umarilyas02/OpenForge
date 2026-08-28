import { createCmsBlock } from "../block.js";

function IconBox({ icon, title, description, layout }) {
  return (
    <div className={`of-block of-icon-box of-icon-box-${layout ?? "icon-top"}`}>
      <span aria-hidden="true" className="of-icon-box-icon">
        {icon}
      </span>
      <div className="of-icon-box-body">
        <h3 className="of-icon-box-title">{title}</h3>
        {description ? <p className="of-icon-box-desc">{description}</p> : null}
      </div>
    </div>
  );
}

export const iconBoxBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.icon-box",
    version: 1,
    name: "Icon Box",
    description: "An icon or emoji with a title and short description.",
    tags: ["content", "icon"],
    defaultProps: { layout: "icon-top" },
    editableFields: [
      { path: "icon", label: "Icon (emoji)", control: "text", required: true },
      { path: "title", label: "Title", control: "text", required: true },
      {
        path: "description",
        label: "Description",
        control: "textarea",
        required: false,
      },
      {
        path: "layout",
        label: "Layout",
        control: "select",
        required: false,
        options: [
          { value: "icon-top", label: "Icon on top" },
          { value: "icon-left", label: "Icon on the left" },
        ],
      },
    ],
    slots: [],
    accessibility: ["The icon is decorative; the title carries the meaning."],
    migrations: [],
  },
  component: IconBox,
});
