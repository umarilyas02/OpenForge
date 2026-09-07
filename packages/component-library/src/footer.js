// Footer component variants harvested from reference projects.
// Populated by an authoring pass — see README.md for the sourcing process.

export const footerComponents = [
  {
    schemaVersion: 1,
    id: "footer.newsletter-accordion",
    name: "Newsletter Accordion Footer",
    category: "footer",
    description:
      "Dark e-commerce footer with collapsible link columns on mobile, a newsletter signup row, and a social-icon strip.",
    tags: ["footer", "ecommerce", "newsletter", "accordion", "dark", "social"],
    sourceProject: "FitGrips-Frontend",
    exportName: "NewsletterAccordionFooter",
    fileName: "NewsletterAccordionFooter.jsx",
    dependencies: [],
    defaultProps: {
      brand: "Northline",
      groups: [
        {
          id: "shop",
          title: "Shop",
          links: [
            { label: "New Arrivals", href: "#" },
            { label: "Best Sellers", href: "#" },
            { label: "Accessories", href: "#" },
          ],
        },
        {
          id: "company",
          title: "Company",
          links: [
            { label: "About Us", href: "#" },
            { label: "Careers", href: "#" },
          ],
        },
        {
          id: "policies",
          title: "Policies",
          links: [
            { label: "Shipping Policy", href: "#" },
            { label: "Returns & Refunds", href: "#" },
            { label: "Privacy Policy", href: "#" },
          ],
        },
        {
          id: "account",
          title: "My Account",
          links: [
            { label: "Orders", href: "#" },
            { label: "Profile", href: "#" },
          ],
        },
      ],
      newsletterHeading: "Join the list. Tips, drops, no spam.",
      newsletterCopy: "Subscribe for early access to new releases and offers.",
      copyright: "Northline. All rights reserved.",
    },
    accessibility: [
      "Mobile accordion headings use aria-expanded and aria-controls so link groups announce their open/closed state to assistive tech.",
      "The newsletter form input has an associated aria-label since no visible <label> element is rendered.",
    ],
    source: `import { useState } from "react";

const defaultGroups = [
  {
    id: "shop",
    title: "Shop",
    links: [
      { label: "New Arrivals", href: "#" },
      { label: "Best Sellers", href: "#" },
      { label: "Accessories", href: "#" },
    ],
  },
  {
    id: "company",
    title: "Company",
    links: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "#" },
    ],
  },
  {
    id: "policies",
    title: "Policies",
    links: [
      { label: "Shipping Policy", href: "#" },
      { label: "Returns & Refunds", href: "#" },
      { label: "Privacy Policy", href: "#" },
    ],
  },
  {
    id: "account",
    title: "My Account",
    links: [
      { label: "Orders", href: "#" },
      { label: "Profile", href: "#" },
    ],
  },
];

const socialLinks = [
  {
    name: "Instagram",
    href: "#",
    path: "M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6Zm9.5 1.5a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z",
  },
  {
    name: "Facebook",
    href: "#",
    path: "M13.5 21v-7h2.3l.4-2.8h-2.7V9.4c0-.8.2-1.4 1.4-1.4H16V5.6c-.2 0-.9-.1-1.8-.1-1.8 0-3 1.1-3 3.2v2.5H9V14h2.4v7h2.1Z",
  },
  {
    name: "Pinterest",
    href: "#",
    path: "M12 2a10 10 0 0 0-3.6 19.3c0-.8-.1-2 .1-2.9l1.4-6s-.3-.7-.3-1.7c0-1.6.9-2.8 2.1-2.8 1 0 1.5.7 1.5 1.6 0 1-.6 2.4-1 3.8-.3 1.1.6 2 1.7 2 2 0 3.5-2.1 3.5-5.2 0-2.7-2-4.6-4.7-4.6-3.2 0-5.1 2.4-5.1 4.9 0 1 .4 2 .8 2.6.1.1.1.2.1.3l-.4 1.4c0 .2-.1.2-.3.1-1.2-.5-1.9-2.2-1.9-3.5 0-2.9 2.1-5.5 6-5.5 3.2 0 5.6 2.2 5.6 5.2 0 3.1-2 5.6-4.7 5.6-.9 0-1.8-.5-2.1-1l-.6 2.2c-.2.8-.8 1.9-1.2 2.5A10 10 0 1 0 12 2Z",
  },
  {
    name: "LinkedIn",
    href: "#",
    path: "M6.9 8.5H4V20h2.9V8.5ZM5.5 3.9a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4ZM20 12.7c0-3-1.6-4.4-3.8-4.4-1.7 0-2.5 1-2.9 1.6v-1.4h-2.9V20h2.9v-6.4c0-.3 0-.7.1-.9.2-.7.8-1.5 1.8-1.5 1.3 0 1.8 1 1.8 2.4V20H20v-7.3Z",
  },
];

function SocialIcon({ path }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor">
      <path d={path} />
    </svg>
  );
}

export function NewsletterAccordionFooter({
  brand = "Northline",
  groups = defaultGroups,
  newsletterHeading = "Join the list. Tips, drops, no spam.",
  newsletterCopy = "Subscribe for early access to new releases and offers.",
  copyright = "Northline. All rights reserved.",
}) {
  const initialOpen = groups.reduce((acc, group) => {
    acc[group.id] = false;
    return acc;
  }, {});
  const [openSections, setOpenSections] = useState(initialOpen);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const year = new Date().getFullYear();

  const toggle = (id) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <footer className="ofl-footer-newsletter-accordion">
      <div className="ofl-footer-newsletter-accordion__inner">
        <div className="ofl-footer-newsletter-accordion__top">
          <div className="ofl-footer-newsletter-accordion__brand">
            <span className="ofl-footer-newsletter-accordion__brand-mark">{brand}</span>
          </div>

          <div className="ofl-footer-newsletter-accordion__groups">
            {groups.map((group) => (
              <div className="ofl-footer-newsletter-accordion__group" key={group.id}>
                <button
                  type="button"
                  className="ofl-footer-newsletter-accordion__group-heading"
                  onClick={() => toggle(group.id)}
                  aria-expanded={!!openSections[group.id]}
                  aria-controls={"footer-group-" + group.id}
                >
                  {group.title}
                  <span className="ofl-footer-newsletter-accordion__chevron" aria-hidden="true">
                    {openSections[group.id] ? "−" : "+"}
                  </span>
                </button>
                <div
                  id={"footer-group-" + group.id}
                  className={
                    "ofl-footer-newsletter-accordion__links" +
                    (openSections[group.id] ? " ofl-footer-newsletter-accordion__links--open" : "")
                  }
                >
                  <ul>
                    {group.links.map((link) => (
                      <li key={link.label}>
                        <a href={link.href}>{link.label}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="ofl-footer-newsletter-accordion__newsletter">
          <p className="ofl-footer-newsletter-accordion__newsletter-heading">{newsletterHeading}</p>
          <p className="ofl-footer-newsletter-accordion__newsletter-copy">{newsletterCopy}</p>
          <form className="ofl-footer-newsletter-accordion__form" onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              aria-label="Email address for newsletter"
              required
            />
            <button type="submit">Subscribe</button>
          </form>
          {submitted && (
            <p role="status" className="ofl-footer-newsletter-accordion__confirm">
              Thanks — you are on the list.
            </p>
          )}
        </div>

        <div className="ofl-footer-newsletter-accordion__bottom">
          <p>&copy; {year} {copyright}</p>
          <div className="ofl-footer-newsletter-accordion__social">
            {socialLinks.map((social) => (
              <a key={social.name} href={social.href} aria-label={social.name}>
                <SocialIcon path={social.path} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
`,
    styles: `.ofl-footer-newsletter-accordion {
  background: #0b0b0d;
  color: #e6e6e9;
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
}

.ofl-footer-newsletter-accordion__inner {
  max-width: 1180px;
  margin: 0 auto;
  padding: 3rem 1.5rem 2rem;
}

.ofl-footer-newsletter-accordion__top {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  padding-bottom: 2rem;
}

.ofl-footer-newsletter-accordion__brand-mark {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #fff;
}

.ofl-footer-newsletter-accordion__groups {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  border-top: 1px solid #232327;
}

.ofl-footer-newsletter-accordion__group {
  border-bottom: 1px solid #232327;
}

.ofl-footer-newsletter-accordion__group-heading {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: none;
  border: none;
  color: #fff;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 1rem 0;
  cursor: pointer;
}

.ofl-footer-newsletter-accordion__chevron {
  font-size: 1.1rem;
  color: #9a9aa2;
}

.ofl-footer-newsletter-accordion__links {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.25s ease;
}

.ofl-footer-newsletter-accordion__links--open {
  grid-template-rows: 1fr;
}

.ofl-footer-newsletter-accordion__links > ul {
  list-style: none;
  margin: 0;
  padding: 0 0 1rem;
  overflow: hidden;
}

.ofl-footer-newsletter-accordion__links li + li {
  margin-top: 0.5rem;
}

.ofl-footer-newsletter-accordion__links a {
  color: #9a9aa2;
  text-decoration: none;
  font-size: 0.9rem;
}

.ofl-footer-newsletter-accordion__links a:hover {
  color: #fff;
  text-decoration: underline;
}

.ofl-footer-newsletter-accordion__newsletter {
  border-top: 1px solid #232327;
  padding: 2rem 0;
}

.ofl-footer-newsletter-accordion__newsletter-heading {
  font-size: 1.05rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 0.4rem;
}

.ofl-footer-newsletter-accordion__newsletter-copy {
  font-size: 0.85rem;
  color: #9a9aa2;
  margin: 0 0 1rem;
}

.ofl-footer-newsletter-accordion__form {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.ofl-footer-newsletter-accordion__form input {
  flex: 1 1 220px;
  padding: 0.65rem 1rem;
  border-radius: 999px;
  border: 1px solid #333338;
  background: #17171a;
  color: #fff;
  font-size: 0.85rem;
}

.ofl-footer-newsletter-accordion__form button {
  padding: 0.65rem 1.4rem;
  border-radius: 999px;
  border: 1px solid #fff;
  background: #fff;
  color: #0b0b0d;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
}

.ofl-footer-newsletter-accordion__confirm {
  margin-top: 0.6rem;
  font-size: 0.8rem;
  color: #7be0a8;
}

.ofl-footer-newsletter-accordion__bottom {
  border-top: 1px solid #232327;
  padding-top: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #9a9aa2;
}

.ofl-footer-newsletter-accordion__bottom p {
  margin: 0;
}

.ofl-footer-newsletter-accordion__social {
  display: flex;
  gap: 0.9rem;
}

.ofl-footer-newsletter-accordion__social a {
  color: #9a9aa2;
}

.ofl-footer-newsletter-accordion__social a:hover {
  color: #fff;
}

@media (min-width: 700px) {
  .ofl-footer-newsletter-accordion__top {
    grid-template-columns: 1fr 2fr;
  }

  .ofl-footer-newsletter-accordion__groups {
    grid-template-columns: repeat(4, 1fr);
    border-top: none;
    gap: 1.5rem;
  }

  .ofl-footer-newsletter-accordion__group {
    border-bottom: none;
  }

  .ofl-footer-newsletter-accordion__group-heading {
    cursor: default;
    pointer-events: none;
  }

  .ofl-footer-newsletter-accordion__chevron {
    display: none;
  }

  .ofl-footer-newsletter-accordion__links {
    grid-template-rows: 1fr;
  }

  .ofl-footer-newsletter-accordion__links > ul {
    overflow: visible;
  }
}
`,
  },

  {
    schemaVersion: 1,
    id: "footer.service-cta-bar",
    name: "Service CTA Bar Footer",
    category: "footer",
    description:
      "Multi-column service-business footer with a brand and contact column, followed by a full-width call-to-action bar and a closing credit line.",
    tags: ["footer", "service", "cta", "contact", "b2b"],
    sourceProject: "X4",
    exportName: "ServiceCtaBarFooter",
    fileName: "ServiceCtaBarFooter.jsx",
    dependencies: [],
    defaultProps: {
      brand: "Meridian Freight",
      tagline: "Global logistics, in motion.",
      navGroups: [
        {
          title: "Navigate",
          links: [
            { label: "Services", href: "#" },
            { label: "Tracking", href: "#" },
            { label: "About", href: "#" },
            { label: "FAQ", href: "#" },
          ],
        },
        {
          title: "Core Services",
          links: [
            { label: "Ocean Freight", href: "#" },
            { label: "Air Freight", href: "#" },
            { label: "Warehousing", href: "#" },
            { label: "Customs Brokerage", href: "#" },
          ],
        },
      ],
      contactEmail: "hello@example.com",
      contactPhone: "+1 555 010 2200",
      contactLocation: "USA / Remote",
      ctaText: "© 2026 Meridian Freight",
      ctaMiddle: "International freight coordination",
      ctaLabel: "Start a shipment",
      creditLabel: "Site by Studio Somewhere",
    },
    accessibility: [
      "Each footer navigation column is a labelled <nav> landmark, so screen reader users can jump directly to Navigate or Core Services.",
      "Contact details are real interactive links (mailto:/tel:) rather than plain text, so they are reachable by keyboard and announced as links.",
    ],
    source: `const defaultNavGroups = [
  {
    title: "Navigate",
    links: [
      { label: "Services", href: "#" },
      { label: "Tracking", href: "#" },
      { label: "About", href: "#" },
      { label: "FAQ", href: "#" },
    ],
  },
  {
    title: "Core Services",
    links: [
      { label: "Ocean Freight", href: "#" },
      { label: "Air Freight", href: "#" },
      { label: "Warehousing", href: "#" },
      { label: "Customs Brokerage", href: "#" },
    ],
  },
];

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 5 5L14 13l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.3" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

export function ServiceCtaBarFooter({
  brand = "Meridian Freight",
  tagline = "Global logistics, in motion.",
  navGroups = defaultNavGroups,
  contactEmail = "hello@example.com",
  contactPhone = "+1 555 010 2200",
  contactLocation = "USA / Remote",
  ctaText = "© 2026 Meridian Freight",
  ctaMiddle = "International freight coordination",
  ctaLabel = "Start a shipment",
  creditLabel = "Site by Studio Somewhere",
}) {
  return (
    <footer className="ofl-footer-service-cta">
      <div className="ofl-footer-service-cta__top">
        <div className="ofl-footer-service-cta__brand">
          <span className="ofl-footer-service-cta__mark">{brand}</span>
          <p>{tagline}</p>
        </div>

        {navGroups.map((group) => (
          <nav aria-label={group.title} className="ofl-footer-service-cta__column" key={group.title}>
            <span className="ofl-footer-service-cta__column-title">{group.title}</span>
            {group.links.map((link) => (
              <a key={link.label} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
        ))}

        <div className="ofl-footer-service-cta__column ofl-footer-service-cta__contact">
          <span className="ofl-footer-service-cta__column-title">Contact</span>
          <a href={"mailto:" + contactEmail}>
            <MailIcon /> {contactEmail}
          </a>
          <a href={"tel:" + contactPhone.replace(/\\s/g, "")}>
            <PhoneIcon /> {contactPhone}
          </a>
          <span className="ofl-footer-service-cta__location">
            <PinIcon /> {contactLocation}
          </span>
        </div>
      </div>

      <div className="ofl-footer-service-cta__bar">
        <span>{ctaText}</span>
        <span>{ctaMiddle}</span>
        <a href="#" className="ofl-footer-service-cta__cta-link">
          {ctaLabel} <ArrowIcon />
        </a>
      </div>

      <div className="ofl-footer-service-cta__credit">{creditLabel}</div>
    </footer>
  );
}
`,
    styles: `.ofl-footer-service-cta {
  background: #ffffff;
  color: #1c2430;
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  border-top: 1px solid #e4e8ee;
}

.ofl-footer-service-cta__top {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3.5rem 1.5rem 2.5rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.25rem;
}

.ofl-footer-service-cta__brand .ofl-footer-service-cta__mark {
  font-size: 1.3rem;
  font-weight: 700;
  color: #101722;
}

.ofl-footer-service-cta__brand p {
  margin: 0.5rem 0 0;
  color: #5c6b7d;
  font-size: 0.9rem;
}

.ofl-footer-service-cta__column {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.ofl-footer-service-cta__column-title {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #97a3b3;
  margin-bottom: 0.2rem;
}

.ofl-footer-service-cta__column a {
  color: #2c3a4d;
  text-decoration: none;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

.ofl-footer-service-cta__column a:hover {
  color: #0f6fff;
}

.ofl-footer-service-cta__location {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: #5c6b7d;
  font-size: 0.9rem;
}

.ofl-footer-service-cta__bar {
  background: #101722;
  color: #fff;
  padding: 1.4rem 1.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  font-size: 0.85rem;
}

.ofl-footer-service-cta__bar span {
  color: #c4cddb;
}

.ofl-footer-service-cta__cta-link {
  color: #fff;
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.ofl-footer-service-cta__cta-link:hover {
  text-decoration: underline;
}

.ofl-footer-service-cta__credit {
  text-align: center;
  font-size: 0.75rem;
  color: #97a3b3;
  padding: 0.9rem;
  border-top: 1px solid #e4e8ee;
}

@media (min-width: 860px) {
  .ofl-footer-service-cta__top {
    grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
  }
}
`,
  },

  {
    schemaVersion: 1,
    id: "footer.institute-directory",
    name: "Institute Directory Footer",
    category: "footer",
    description:
      "Dark institutional footer with a logo/tagline banner, four labelled columns (including a visit-us block with icons), and a closing legal row.",
    tags: ["footer", "institutional", "directory", "contact", "dark"],
    sourceProject: "archtech",
    exportName: "InstituteDirectoryFooter",
    fileName: "InstituteDirectoryFooter.jsx",
    dependencies: [],
    defaultProps: {
      brand: "Ashford Institute",
      tagline: "Practical training, real outcomes.",
      legalName: "Ashford Institute",
      navLinks: [
        { label: "Home", href: "#" },
        { label: "Programs", href: "#" },
        { label: "Admissions", href: "#" },
        { label: "Contact", href: "#" },
      ],
      programLinks: [
        { label: "Design", href: "#" },
        { label: "Engineering", href: "#" },
        { label: "Business", href: "#" },
        { label: "All programs", href: "#" },
      ],
      address: "48 Market Street, Riverside",
      phone: "+1 555 020 4477",
      email: "info@example.edu",
      hours: "Mon-Fri, 9am-5pm",
      socialLinks: [
        { label: "Facebook", href: "#" },
        { label: "Instagram", href: "#" },
        { label: "YouTube", href: "#" },
      ],
    },
    accessibility: [
      "Contact details (address, phone, email, hours) are paired with decorative icons marked aria-hidden, so the icons never duplicate content for screen readers.",
      "Phone and email entries render as tel: and mailto: links, keeping them operable via keyboard and assistive tech.",
    ],
    source: `const defaultNavLinks = [
  { label: "Home", href: "#" },
  { label: "Programs", href: "#" },
  { label: "Admissions", href: "#" },
  { label: "Contact", href: "#" },
];

const defaultProgramLinks = [
  { label: "Design", href: "#" },
  { label: "Engineering", href: "#" },
  { label: "Business", href: "#" },
  { label: "All programs", href: "#" },
];

const defaultSocialLinks = [
  { label: "Facebook", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "YouTube", href: "#" },
];

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.3" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 5 5L14 13l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function InstituteDirectoryFooter({
  brand = "Ashford Institute",
  tagline = "Practical training, real outcomes.",
  legalName = "Ashford Institute",
  navLinks = defaultNavLinks,
  programLinks = defaultProgramLinks,
  address = "48 Market Street, Riverside",
  phone = "+1 555 020 4477",
  email = "info@example.edu",
  hours = "Mon-Fri, 9am-5pm",
  socialLinks = defaultSocialLinks,
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="ofl-footer-institute">
      <div className="ofl-footer-institute__inner">
        <div className="ofl-footer-institute__banner">
          <span className="ofl-footer-institute__brand">{brand}</span>
          <p>{tagline}</p>
        </div>

        <div className="ofl-footer-institute__columns">
          <nav aria-label="Institute" className="ofl-footer-institute__column">
            <h2>Institute</h2>
            <ul>
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Programs" className="ofl-footer-institute__column">
            <h2>Programs</h2>
            <ul>
              {programLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ofl-footer-institute__column">
            <h2>Visit Us</h2>
            <ul className="ofl-footer-institute__contact-list">
              <li>
                <PinIcon />
                <span>{address}</span>
              </li>
              <li>
                <PhoneIcon />
                <a href={"tel:" + phone.replace(/\\s/g, "")}>{phone}</a>
              </li>
              <li>
                <MailIcon />
                <a href={"mailto:" + email}>{email}</a>
              </li>
              <li>
                <ClockIcon />
                <span>{hours}</span>
              </li>
            </ul>
          </div>

          <nav aria-label="Follow" className="ofl-footer-institute__column">
            <h2>Follow</h2>
            <ul>
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="ofl-footer-institute__legal">
          <p>&copy; {year} {legalName}. All rights reserved.</p>
          <div className="ofl-footer-institute__legal-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
`,
    styles: `.ofl-footer-institute {
  background: #0e1116;
  color: #9aa4b2;
  font-family: Georgia, "Times New Roman", serif;
}

.ofl-footer-institute__inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 4rem 1.75rem 1.5rem;
}

.ofl-footer-institute__banner {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border-bottom: 1px solid #232a35;
  padding-bottom: 2.25rem;
}

.ofl-footer-institute__brand {
  font-size: 1.5rem;
  color: #f4f1ea;
  letter-spacing: 0.01em;
}

.ofl-footer-institute__banner p {
  margin: 0;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #6d7686;
}

.ofl-footer-institute__columns {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.25rem;
  padding: 2.75rem 0;
}

.ofl-footer-institute__column h2 {
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #d8ceb4;
  margin: 0 0 1.1rem;
  font-family: system-ui, sans-serif;
}

.ofl-footer-institute__column ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.ofl-footer-institute__column a {
  color: inherit;
  text-decoration: none;
  font-size: 0.9rem;
  font-family: system-ui, sans-serif;
}

.ofl-footer-institute__column a:hover {
  color: #d8ceb4;
}

.ofl-footer-institute__contact-list li {
  display: flex;
  gap: 0.65rem;
  align-items: flex-start;
  font-size: 0.9rem;
  font-family: system-ui, sans-serif;
}

.ofl-footer-institute__contact-list svg {
  flex-shrink: 0;
  margin-top: 0.15rem;
  color: #6d7686;
}

.ofl-footer-institute__legal {
  border-top: 1px solid #232a35;
  padding-top: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-between;
  font-size: 0.78rem;
  font-family: system-ui, sans-serif;
}

.ofl-footer-institute__legal p {
  margin: 0;
}

.ofl-footer-institute__legal-links {
  display: flex;
  gap: 1.25rem;
}

.ofl-footer-institute__legal-links a {
  color: inherit;
  text-decoration: none;
}

.ofl-footer-institute__legal-links a:hover {
  color: #d8ceb4;
}

@media (min-width: 780px) {
  .ofl-footer-institute__columns {
    grid-template-columns: repeat(4, 1fr);
  }
}
`,
  },

  {
    schemaVersion: 1,
    id: "footer.big-statement",
    name: "Big Statement Footer",
    category: "footer",
    description:
      "Full-bleed portfolio/agency footer built around one oversized headline, a copy-to-clipboard email row, and a minimal bottom bar with a back-to-top control.",
    tags: ["footer", "portfolio", "big-type", "cta", "minimal"],
    sourceProject: "portfolio-v2",
    exportName: "BigStatementFooter",
    fileName: "BigStatementFooter.jsx",
    dependencies: [],
    defaultProps: {
      eyebrow: "GOT A PROJECT IN MIND?",
      headlineTop: "Let's work",
      headlineBottom: "together",
      email: "hello@example.com",
      copyrightName: "Jordan Rivers",
      socialLinks: [
        { label: "GitHub", href: "#" },
        { label: "LinkedIn", href: "#" },
      ],
    },
    accessibility: [
      "The copy-email button announces its result to assistive tech via an aria-live status region rather than only a visual change.",
      "The back-to-top control is a real <button> with a text label, not an icon-only clickable div.",
    ],
    source: `import { useEffect, useRef, useState } from "react";

const defaultSocialLinks = [
  { label: "GitHub", href: "#" },
  { label: "LinkedIn", href: "#" },
];

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M4 16V6a2 2 0 0 1 2-2h10" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 12l5 5L19 7" />
    </svg>
  );
}

export function BigStatementFooter({
  eyebrow = "GOT A PROJECT IN MIND?",
  headlineTop = "Let's work",
  headlineBottom = "together",
  email = "hello@example.com",
  copyrightName = "Jordan Rivers",
  socialLinks = defaultSocialLinks,
}) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(null);
  const year = new Date().getFullYear();

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const copyEmail = async () => {
    try {
      if (navigator && navigator.clipboard) {
        await navigator.clipboard.writeText(email);
      }
      setCopied(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — leave the button as-is */
    }
  };

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="ofl-footer-big-statement">
      <div className="ofl-footer-big-statement__inner">
        <p className="ofl-footer-big-statement__eyebrow">{eyebrow}</p>

        <h2 className="ofl-footer-big-statement__headline">
          <span className="ofl-footer-big-statement__line">{headlineTop}</span>
          <span className="ofl-footer-big-statement__line ofl-footer-big-statement__line--indent">
            {headlineBottom}
            <span className="ofl-footer-big-statement__dot">.</span>
          </span>
        </h2>

        <div className="ofl-footer-big-statement__email-row">
          <p>Drop an email:</p>
          <div className="ofl-footer-big-statement__email-line">
            <a href={"mailto:" + email} className="ofl-footer-big-statement__email">
              {email}
            </a>
            <button
              type="button"
              onClick={copyEmail}
              aria-label="Copy email address"
              className={
                "ofl-footer-big-statement__copy" +
                (copied ? " ofl-footer-big-statement__copy--done" : "")
              }
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
            </button>
            <span aria-live="polite" className="ofl-footer-big-statement__sr-only">
              {copied ? "Email address copied to clipboard" : ""}
            </span>
          </div>
        </div>

        <div className="ofl-footer-big-statement__bottom">
          <p>&copy; {year} {copyrightName}</p>
          <div className="ofl-footer-big-statement__social">
            {socialLinks.map((social) => (
              <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer">
                {social.label}
              </a>
            ))}
          </div>
          <button type="button" className="ofl-footer-big-statement__top" onClick={scrollToTop}>
            Back to top <span aria-hidden="true">&uarr;</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
`,
    styles: `.ofl-footer-big-statement {
  background: #111114;
  color: #f2efe9;
  border-radius: 2.5rem 2.5rem 0 0;
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
}

.ofl-footer-big-statement__inner {
  max-width: 1300px;
  margin: 0 auto;
  padding: 5rem 1.5rem 2.5rem;
}

.ofl-footer-big-statement__eyebrow {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: #c8ff5c;
  margin: 0;
}

.ofl-footer-big-statement__headline {
  margin: 1.5rem 0 0;
  font-weight: 600;
  line-height: 0.98;
  letter-spacing: -0.03em;
  font-size: clamp(2.5rem, 10vw, 7rem);
}

.ofl-footer-big-statement__line {
  display: block;
}

.ofl-footer-big-statement__line--indent {
  padding-left: 10vw;
}

.ofl-footer-big-statement__dot {
  color: #c8ff5c;
}

.ofl-footer-big-statement__email-row {
  margin-top: 3.5rem;
}

.ofl-footer-big-statement__email-row p {
  margin: 0 0 0.5rem;
  font-size: 0.85rem;
  color: #a9a49a;
}

.ofl-footer-big-statement__email-line {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
}

.ofl-footer-big-statement__email {
  color: inherit;
  text-decoration: none;
  font-size: clamp(1.2rem, 4vw, 2rem);
  letter-spacing: -0.01em;
  border-bottom: 1px solid transparent;
}

.ofl-footer-big-statement__email:hover {
  color: #c8ff5c;
  border-color: #c8ff5c;
}

.ofl-footer-big-statement__copy {
  border-radius: 999px;
  border: 1px solid rgba(242, 239, 233, 0.25);
  background: transparent;
  color: #a9a49a;
  padding: 0.6rem;
  cursor: pointer;
  display: inline-flex;
}

.ofl-footer-big-statement__copy:hover,
.ofl-footer-big-statement__copy--done {
  border-color: #c8ff5c;
  color: #c8ff5c;
}

.ofl-footer-big-statement__sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}

.ofl-footer-big-statement__bottom {
  margin-top: 4rem;
  border-top: 1px solid rgba(242, 239, 233, 0.15);
  padding-top: 1.75rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  align-items: center;
  justify-content: space-between;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: #a9a49a;
}

.ofl-footer-big-statement__bottom p {
  margin: 0;
}

.ofl-footer-big-statement__social {
  display: flex;
  gap: 1.5rem;
}

.ofl-footer-big-statement__social a {
  color: #a9a49a;
  text-decoration: none;
}

.ofl-footer-big-statement__social a:hover {
  color: #c8ff5c;
}

.ofl-footer-big-statement__top {
  background: none;
  border: none;
  color: #a9a49a;
  font: inherit;
  letter-spacing: inherit;
  cursor: pointer;
}

.ofl-footer-big-statement__top:hover {
  color: #c8ff5c;
}
`,
  },

  {
    schemaVersion: 1,
    id: "footer.simple-conditional",
    name: "Simple Conditional Footer",
    category: "footer",
    description:
      "Light, minimal footer with a short brand blurb next to a small set of nav groups; the account group can be hidden once a visitor is signed in.",
    tags: ["footer", "minimal", "simple", "conditional", "light"],
    sourceProject: "smartadmissionguide",
    exportName: "SimpleConditionalFooter",
    fileName: "SimpleConditionalFooter.jsx",
    dependencies: [],
    defaultProps: {
      brand: "Guidewell",
      description: "Straightforward guidance and planning tools, built for people making one big decision.",
      isSignedIn: false,
      groups: [
        {
          heading: "Tools",
          items: [
            { label: "Guidance Quiz", href: "#" },
            { label: "Directory Search", href: "#" },
            { label: "Application Pack", href: "#" },
          ],
        },
        {
          heading: "Company",
          items: [
            { label: "About", href: "#" },
            { label: "Dashboard", href: "#" },
          ],
        },
        {
          heading: "Account",
          items: [
            { label: "Log in", href: "#" },
            { label: "Register", href: "#" },
          ],
        },
      ],
      footnote: "Guidewell — student project.",
    },
    accessibility: [
      "The footer root carries aria-label=\"Site footer\" and each column is its own labelled <nav>, giving screen reader users quick landmark navigation.",
      "Removing the Account group when isSignedIn is true happens before render, so no hidden or disabled links are left in the accessibility tree.",
    ],
    source: `const defaultGroups = [
  {
    heading: "Tools",
    items: [
      { label: "Guidance Quiz", href: "#" },
      { label: "Directory Search", href: "#" },
      { label: "Application Pack", href: "#" },
    ],
  },
  {
    heading: "Company",
    items: [
      { label: "About", href: "#" },
      { label: "Dashboard", href: "#" },
    ],
  },
  {
    heading: "Account",
    items: [
      { label: "Log in", href: "#" },
      { label: "Register", href: "#" },
    ],
  },
];

export function SimpleConditionalFooter({
  brand = "Guidewell",
  description = "Straightforward guidance and planning tools, built for people making one big decision.",
  isSignedIn = false,
  groups = defaultGroups,
  footnote = "Guidewell — student project.",
}) {
  const visibleGroups = isSignedIn
    ? groups.filter((group) => group.heading !== "Account")
    : groups;
  const year = new Date().getFullYear();

  return (
    <footer className="ofl-footer-simple-conditional" aria-label="Site footer">
      <div className="ofl-footer-simple-conditional__inner">
        <div className="ofl-footer-simple-conditional__brand">
          <span className="ofl-footer-simple-conditional__mark">{brand}</span>
          <p>{description}</p>
        </div>

        {visibleGroups.map((group) => (
          <nav aria-label={group.heading + " links"} key={group.heading} className="ofl-footer-simple-conditional__group">
            <h2>{group.heading}</h2>
            <ul>
              {group.items.map((item) => (
                <li key={item.label}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="ofl-footer-simple-conditional__bottom">
        &copy; {year} {footnote}
      </div>
    </footer>
  );
}
`,
    styles: `.ofl-footer-simple-conditional {
  background: #fafafa;
  color: #55606b;
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  border-top: 1px solid #e6e8eb;
}

.ofl-footer-simple-conditional__inner {
  max-width: 1080px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.ofl-footer-simple-conditional__brand {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.ofl-footer-simple-conditional__mark {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1c2430;
}

.ofl-footer-simple-conditional__brand p {
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.5;
  max-width: 32ch;
}

.ofl-footer-simple-conditional__group h2 {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #1c2430;
  margin: 0 0 0.85rem;
}

.ofl-footer-simple-conditional__group ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.ofl-footer-simple-conditional__group a {
  color: #55606b;
  text-decoration: none;
  font-size: 0.88rem;
}

.ofl-footer-simple-conditional__group a:hover {
  color: #1c2430;
  text-decoration: underline;
}

.ofl-footer-simple-conditional__bottom {
  border-top: 1px solid #e6e8eb;
  text-align: center;
  padding: 1.1rem;
  font-size: 0.75rem;
  color: #8993a1;
}

@media (min-width: 700px) {
  .ofl-footer-simple-conditional__inner {
    grid-template-columns: 1.4fr repeat(3, 1fr);
  }
}
`,
  },

  {
    schemaVersion: 1,
    id: "footer.wordmark-banner",
    name: "Wordmark Banner Footer",
    category: "footer",
    description:
      "E-commerce footer with plain link columns and an underline-style newsletter field, capped by a giant CSS wordmark banner and a slim tagline bar.",
    tags: ["footer", "ecommerce", "newsletter", "brand", "typographic"],
    sourceProject: "collars",
    exportName: "WordmarkBannerFooter",
    fileName: "WordmarkBannerFooter.jsx",
    dependencies: [],
    defaultProps: {
      wordmark: "COLLARS CO",
      groups: [
        {
          title: "Shop",
          links: [
            { label: "All Products", href: "#" },
            { label: "New Arrivals", href: "#" },
            { label: "Best Sellers", href: "#" },
          ],
        },
        {
          title: "Company",
          links: [
            { label: "About", href: "#" },
            { label: "Contact", href: "#" },
            { label: "Size Guide", href: "#" },
          ],
        },
        {
          title: "Support",
          links: [
            { label: "Track Order", href: "#" },
            { label: "Returns", href: "#" },
            { label: "Shipping Policy", href: "#" },
          ],
        },
      ],
      newsletterHeading: "Stay in the loop",
      newsletterCopy: "Priority access to new drops, styling tips and offers.",
      copyright: "Collars Co. All rights reserved.",
      tagline: "1 Year Warranty | Made to Last.",
    },
    accessibility: [
      "The giant wordmark banner is marked aria-hidden and the brand name is announced separately at the top of the footer, avoiding duplicate/confusing announcements.",
      "The newsletter field has a visually hidden <label> tied to the input via htmlFor/id, not only a placeholder.",
    ],
    source: `import { useState } from "react";

const defaultGroups = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "#" },
      { label: "New Arrivals", href: "#" },
      { label: "Best Sellers", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Size Guide", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Track Order", href: "#" },
      { label: "Returns", href: "#" },
      { label: "Shipping Policy", href: "#" },
    ],
  },
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function WordmarkBannerFooter({
  wordmark = "COLLARS CO",
  groups = defaultGroups,
  newsletterHeading = "Stay in the loop",
  newsletterCopy = "Priority access to new drops, styling tips and offers.",
  copyright = "Collars Co. All rights reserved.",
  tagline = "1 Year Warranty | Made to Last.",
}) {
  const [email, setEmail] = useState("");
  const year = new Date().getFullYear();

  return (
    <footer className="ofl-footer-wordmark-banner">
      <div className="ofl-footer-wordmark-banner__top">
        <div className="ofl-footer-wordmark-banner__columns">
          {groups.map((group) => (
            <nav aria-label={group.title} key={group.title}>
              <h2>{group.title}</h2>
              <ul>
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="ofl-footer-wordmark-banner__newsletter">
          <h2>{newsletterHeading}</h2>
          <p>{newsletterCopy}</p>
          <form
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <label htmlFor="wordmark-banner-email" className="ofl-footer-wordmark-banner__sr-only">
              Email address
            </label>
            <input
              id="wordmark-banner-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email address"
              required
            />
            <button type="submit" aria-label="Subscribe">
              <ArrowIcon />
            </button>
          </form>
        </div>
      </div>

      <div className="ofl-footer-wordmark-banner__wordmark" aria-hidden="true">
        {wordmark}
      </div>

      <div className="ofl-footer-wordmark-banner__bottom">
        <p>&copy; {year} {copyright}</p>
        <p className="ofl-footer-wordmark-banner__tagline">{tagline}</p>
      </div>
    </footer>
  );
}
`,
    styles: `.ofl-footer-wordmark-banner {
  background: #14151a;
  color: #d7d7dc;
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  overflow: hidden;
}

.ofl-footer-wordmark-banner__top {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 1.5rem 2.5rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
}

.ofl-footer-wordmark-banner__columns {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.ofl-footer-wordmark-banner__columns h2 {
  font-size: 0.85rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 1rem;
  letter-spacing: 0.02em;
}

.ofl-footer-wordmark-banner__columns ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ofl-footer-wordmark-banner__columns a {
  color: #9a9aa2;
  text-decoration: none;
  font-size: 0.85rem;
}

.ofl-footer-wordmark-banner__columns a:hover {
  color: #fff;
}

.ofl-footer-wordmark-banner__newsletter h2 {
  color: #fff;
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0 0 0.6rem;
}

.ofl-footer-wordmark-banner__newsletter p {
  font-size: 0.82rem;
  color: #9a9aa2;
  margin: 0 0 1rem;
  line-height: 1.5;
}

.ofl-footer-wordmark-banner__newsletter form {
  position: relative;
  max-width: 22rem;
}

.ofl-footer-wordmark-banner__newsletter input {
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1px solid #3a3a42;
  color: #fff;
  padding: 0.7rem 2.2rem 0.7rem 0;
  font-size: 0.9rem;
}

.ofl-footer-wordmark-banner__newsletter input:focus {
  outline: none;
  border-color: #fff;
}

.ofl-footer-wordmark-banner__newsletter button {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9a9aa2;
  cursor: pointer;
}

.ofl-footer-wordmark-banner__newsletter button:hover {
  color: #fff;
}

.ofl-footer-wordmark-banner__sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}

.ofl-footer-wordmark-banner__wordmark {
  font-size: clamp(3rem, 16vw, 11rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  text-align: center;
  color: #1f2027;
  line-height: 1;
  padding: 0 0.5rem;
  white-space: nowrap;
}

.ofl-footer-wordmark-banner__bottom {
  border-top: 1px solid #232329;
  padding: 1.1rem 1.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  font-size: 0.75rem;
  color: #6f6f78;
}

.ofl-footer-wordmark-banner__bottom p {
  margin: 0;
}

@media (min-width: 800px) {
  .ofl-footer-wordmark-banner__top {
    grid-template-columns: 2fr 1fr;
  }
}
`,
  },
];
