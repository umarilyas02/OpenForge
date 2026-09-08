import { createCmsBlock } from "../block.js";

/**
 * Parse the newline-delimited `Label|href` links string into real entries.
 *
 * A line with no `|` is treated as a label with no destination (rendered as
 * plain text) rather than crashing or emitting an empty anchor.
 *
 * @param {string | undefined} value
 */
function parseLinks(value) {
  return (value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separator = line.indexOf("|");

      if (separator === -1) {
        return { label: line, href: "" };
      }

      return {
        label: line.slice(0, separator).trim(),
        href: line.slice(separator + 1).trim(),
      };
    })
    .filter((link) => link.label.length > 0);
}

function Navbar({ brand, links, ctaLabel, ctaHref }) {
  const items = parseLinks(links);

  return (
    <header className="of-block of-navbar">
      <a className="of-navbar-brand" href="/">
        {brand}
      </a>
      {items.length > 0 ? (
        <nav aria-label="Primary" className="of-navbar-nav">
          <ul className="of-navbar-links">
            {items.map((link, index) => (
              <li className="of-navbar-item" key={index}>
                {link.href ? (
                  <a className="of-navbar-link" href={link.href}>
                    {link.label}
                  </a>
                ) : (
                  <span className="of-navbar-link">{link.label}</span>
                )}
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
      {ctaLabel && ctaHref ? (
        <a className="of-navbar-cta" href={ctaHref}>
          {ctaLabel}
        </a>
      ) : null}
    </header>
  );
}

export const navbarBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.navbar",
    version: 1,
    name: "Navbar",
    description:
      "A site header with a brand wordmark, primary navigation links (one Label|href pair per line) and an optional call-to-action button.",
    tags: ["navigation", "header"],
    defaultProps: {
      brand: "Acme",
      links: "Home|/\nFeatures|/features\nPricing|/pricing\nContact|/contact",
    },
    editableFields: [
      { path: "brand", label: "Brand name", control: "text", required: true },
      {
        path: "links",
        label: "Links (one per line, as Label|href)",
        control: "textarea",
        required: true,
      },
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
    ],
    slots: [],
    accessibility: [
      'Navigation links render inside a <nav> landmark labelled "Primary", so assistive technology can jump straight to the site navigation.',
      "Every link is real, always-visible text — never an icon on its own — and a line with no href renders as plain text instead of an empty, unfocusable anchor.",
    ],
    migrations: [],
  },
  component: Navbar,
});
