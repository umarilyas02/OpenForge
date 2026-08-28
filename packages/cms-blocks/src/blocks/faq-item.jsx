import { createCmsBlock } from "../block.js";

function FaqItem({ question, answer }) {
  return (
    <details className="of-block of-faq-item">
      <summary className="of-faq-item-question">{question}</summary>
      <p className="of-faq-item-answer">{answer}</p>
    </details>
  );
}

export const faqItemBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.faq-item",
    version: 1,
    name: "FAQ Item",
    description: "A single question and answer. Used inside Accordion.",
    tags: ["faq"],
    defaultProps: {},
    editableFields: [
      { path: "question", label: "Question", control: "text", required: true },
      { path: "answer", label: "Answer", control: "textarea", required: true },
    ],
    slots: [],
    accessibility: [
      "Uses the native <details>/<summary> elements, so it is keyboard-operable and announced correctly without any JavaScript.",
    ],
    migrations: [],
  },
  component: FaqItem,
});
