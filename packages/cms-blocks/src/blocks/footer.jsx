import { createCmsBlock } from "../block.js";

function Footer({ copyrightText, slots }) {
  const links = slots?.links ?? [];

  return (
    <footer className="of-block of-footer">
      {links.length > 0 ? (
        <nav className="of-footer-links" aria-label="Footer">
          {links.map((link, index) => (
            <span className="of-footer-link" key={index}>
              {link}
            </span>
          ))}
        </nav>
      ) : null}
      <p className="of-footer-copyright">{copyrightText}</p>
    </footer>
  );
}

export const footerBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.footer",
    version: 1,
    name: "Footer",
    description: "A site footer with optional links and a copyright line.",
    tags: ["footer", "navigation"],
    defaultProps: {},
    editableFields: [
      {
        path: "copyrightText",
        label: "Copyright text",
        control: "text",
        required: true,
      },
    ],
    slots: [
      {
        name: "links",
        label: "Footer links",
        acceptedTypes: ["openforge-cms.rich-text"],
        min: 0,
        max: null,
      },
    ],
    accessibility: ["Footer links render inside a labeled <nav> landmark."],
    migrations: [],
  },
  component: Footer,
});
