import { createCmsBlock } from "../block.js";

function Alert({ message, tone }) {
  return (
    <div className={`of-block of-alert of-alert-${tone ?? "info"}`} role="note">
      {message}
    </div>
  );
}

export const alertBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.alert",
    version: 1,
    name: "Alert",
    description: "A short highlighted message or callout.",
    tags: ["content", "alert"],
    defaultProps: { tone: "info" },
    editableFields: [
      {
        path: "message",
        label: "Message",
        control: "textarea",
        required: true,
      },
      {
        path: "tone",
        label: "Tone",
        control: "select",
        required: false,
        options: [
          { value: "info", label: "Info" },
          { value: "success", label: "Success" },
          { value: "warning", label: "Warning" },
          { value: "danger", label: "Danger" },
        ],
      },
    ],
    slots: [],
    accessibility: [
      'Rendered with role="note" so assistive tech announces it as a callout.',
    ],
    migrations: [],
  },
  component: Alert,
});
