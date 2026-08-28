import { createCmsBlock } from "../block.js";

function Pricing({
  planName,
  price,
  features,
  buttonLabel,
  buttonHref,
  featured,
}) {
  const items = (features ?? "").split("\n").filter(Boolean);

  return (
    <div
      className={`of-block of-pricing${featured ? " of-pricing-featured" : ""}`}
    >
      <h3 className="of-pricing-name">{planName}</h3>
      <p className="of-pricing-price">{price}</p>
      {items.length > 0 ? (
        <ul className="of-pricing-features">
          {items.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      ) : null}
      {buttonLabel && buttonHref ? (
        <a className="of-button of-button-primary" href={buttonHref}>
          {buttonLabel}
        </a>
      ) : null}
    </div>
  );
}

export const pricingBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.pricing",
    version: 1,
    name: "Pricing",
    description: "A single pricing plan card.",
    tags: ["pricing", "conversion"],
    defaultProps: { featured: false },
    editableFields: [
      { path: "planName", label: "Plan name", control: "text", required: true },
      { path: "price", label: "Price", control: "text", required: true },
      {
        path: "features",
        label: "Features (one per line)",
        control: "textarea",
        required: false,
      },
      {
        path: "buttonLabel",
        label: "Button label",
        control: "text",
        required: false,
      },
      {
        path: "buttonHref",
        label: "Button link",
        control: "url",
        required: false,
      },
      {
        path: "featured",
        label: "Highlight this plan",
        control: "boolean",
        required: false,
      },
    ],
    slots: [],
    accessibility: [
      "Features render as a real list, not visually-faked line breaks.",
    ],
    migrations: [],
  },
  component: Pricing,
});
