import { createCmsBlock } from "../block.js";

function LocationCard({ name, address, hours, phone, embedUrl }) {
  const addressLines = (address ?? "").split("\n").filter(Boolean);
  const hourRows = (hours ?? "").split("\n").filter(Boolean);
  const telHref = phone ? `tel:${phone.replace(/[^\d+]/gu, "")}` : null;

  return (
    <section className="of-block of-location-card">
      <div className="of-location-card-body">
        <h2 className="of-location-card-name">{name}</h2>

        <address className="of-location-card-address">
          {addressLines.map((line, index) => (
            <span className="of-location-card-address-line" key={index}>
              {line}
            </span>
          ))}
        </address>

        {hourRows.length > 0 ? (
          <ul className="of-location-card-hours">
            {hourRows.map((row, index) => (
              <li className="of-location-card-hours-row" key={index}>
                {row}
              </li>
            ))}
          </ul>
        ) : null}

        {telHref ? (
          <a className="of-location-card-phone" href={telHref}>
            {phone}
          </a>
        ) : null}
      </div>

      {embedUrl ? (
        <div className="of-location-card-map">
          <iframe
            className="of-location-card-map-frame"
            loading="lazy"
            src={embedUrl}
            title={`Map of ${name}`}
          />
        </div>
      ) : null}
    </section>
  );
}

export const locationCardBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.location-card",
    version: 1,
    name: "Location Card",
    description:
      "A find-us card with a location name, postal address, opening hours, and phone number. Paste an embeddable map URL to show a map beside it; leave it empty and the card renders the address details on their own.",
    tags: ["contact", "location"],
    defaultProps: {
      name: "Your location name",
      address: "123 Example Street\nSuite 100\nExampleville, ST 00000",
      hours: "Mon-Fri: 9am-6pm\nSat: 10am-4pm\nSun: Closed",
      phone: "+1 (555) 010-0199",
    },
    editableFields: [
      { path: "name", label: "Location name", control: "text", required: true },
      {
        path: "address",
        label: "Address (one line per row)",
        control: "textarea",
        required: true,
      },
      {
        path: "hours",
        label: "Opening hours (one per line)",
        control: "textarea",
        required: false,
      },
      { path: "phone", label: "Phone", control: "text", required: false },
      {
        path: "embedUrl",
        label: "Map embed URL (optional)",
        control: "url",
        required: false,
      },
    ],
    slots: [],
    accessibility: [
      "The postal address uses the semantic <address> element, so assistive technology announces it as contact information.",
      "The optional map iframe carries a descriptive title naming the location; the card stays complete and readable when no map URL is set.",
    ],
    migrations: [],
  },
  component: LocationCard,
});
