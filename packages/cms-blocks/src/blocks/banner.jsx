import { createCmsBlock } from "../block.js";

function Banner({ message, ctaLabel, ctaHref, tone }) {
  return (
    <div className={`of-block of-banner of-banner-${tone ?? "brand"}`}>
      <p className="of-banner-message">{message}</p>
      {ctaLabel && ctaHref ? (
        <a className="of-button of-button-secondary" href={ctaHref}>
          {ctaLabel}
        </a>
      ) : null}
    </div>
  );
}

export const bannerBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.banner",
    version: 1,
    name: "Banner",
    description:
      "A full-width announcement bar with an optional call to action.",
    tags: ["layout", "banner", "conversion"],
    defaultProps: { tone: "brand" },
    editableFields: [
      { path: "message", label: "Message", control: "text", required: true },
      {
        path: "ctaLabel",
        label: "Button label",
        control: "text",
        required: false,
      },
      {
        path: "ctaHref",
        label: "Button link",
        control: "url",
        required: false,
      },
      {
        path: "tone",
        label: "Tone",
        control: "select",
        required: false,
        options: [
          { value: "brand", label: "Brand" },
          { value: "dark", label: "Dark" },
          { value: "light", label: "Light" },
        ],
      },
    ],
    slots: [],
    accessibility: [
      "The button is a real anchor, always keyboard-reachable independent of banner tone.",
    ],
    migrations: [],
  },
  component: Banner,
});
