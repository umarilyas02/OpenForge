import { createCmsBlock } from "../block.js";

function TimelineStep({ date, title, description }) {
  return (
    <div className="of-block of-timeline-step">
      <div className="of-timeline-step-marker" aria-hidden="true" />
      <div className="of-timeline-step-body">
        {date ? <span className="of-timeline-step-date">{date}</span> : null}
        <h3 className="of-timeline-step-title">{title}</h3>
        {description ? (
          <p className="of-timeline-step-desc">{description}</p>
        ) : null}
      </div>
    </div>
  );
}

export const timelineStepBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.timeline-step",
    version: 1,
    name: "Timeline Step",
    description: "A single dated milestone. Used inside Timeline.",
    tags: ["timeline"],
    defaultProps: {},
    editableFields: [
      {
        path: "date",
        label: "Date or stage",
        control: "text",
        required: false,
      },
      { path: "title", label: "Title", control: "text", required: true },
      {
        path: "description",
        label: "Description",
        control: "textarea",
        required: false,
      },
    ],
    slots: [],
    accessibility: [
      "The marker is decorative; the date, title, and description are all real readable text in source order.",
    ],
    migrations: [],
  },
  component: TimelineStep,
});
