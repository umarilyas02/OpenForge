import { createCmsBlock } from "../block.js";

function RichText({ content }) {
  const paragraphs = (content ?? "").split(/\n{2,}/u).filter(Boolean);

  return (
    <div className="of-block of-rich-text">
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  );
}

export const richTextBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.rich-text",
    version: 1,
    name: "Rich Text",
    description: "Plain-text content rendered as paragraphs.",
    tags: ["content", "text"],
    defaultProps: { content: "" },
    editableFields: [
      {
        path: "content",
        label: "Content",
        control: "textarea",
        required: true,
      },
    ],
    slots: [],
    accessibility: [
      "Content is rendered as semantic paragraphs, never raw HTML.",
    ],
    migrations: [],
  },
  component: RichText,
});
