import { BLOCK_SCHEMA_VERSION } from "./schema.js";

export const OFFICIAL_BLOCK_STYLES = `:root {
  --of-ink: #111318;
  --of-muted: #616773;
  --of-line: #dfe2e7;
  --of-surface: #f5f6f7;
  --of-brand: #ff5a1f;
  --of-radius: 1.25rem;
}

.of-block { box-sizing: border-box; color: var(--of-ink); font-family: Arial, sans-serif; padding: 5rem max(1.5rem, calc((100vw - 72rem) / 2)); }
.of-block * { box-sizing: border-box; }
.of-dark { background: var(--of-ink); color: white; }
.of-soft { background: var(--of-surface); }
.of-kicker { color: var(--of-brand); font-size: .78rem; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
.of-title { font-size: clamp(2rem, 5vw, 4.75rem); letter-spacing: -.055em; line-height: .98; margin: .8rem 0 1.25rem; max-width: 13ch; }
.of-copy { color: var(--of-muted); font-size: 1.08rem; line-height: 1.7; max-width: 42rem; }
.of-dark .of-copy { color: #b9bec8; }
.of-button { align-items: center; background: var(--of-brand); border-radius: 999px; color: white; display: inline-flex; font-weight: 800; min-height: 3rem; padding: 0 1.25rem; text-decoration: none; }
.of-button-secondary { background: transparent; border: 1px solid currentColor; color: inherit; }
.of-actions { display: flex; flex-wrap: wrap; gap: .75rem; margin-top: 2rem; }
.of-grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr)); margin-top: 2.5rem; }
.of-card { border: 1px solid var(--of-line); border-radius: var(--of-radius); padding: 1.5rem; }
.of-dark .of-card { border-color: #343944; }
.of-card h3 { margin: 0 0 .65rem; }
.of-card p { color: var(--of-muted); line-height: 1.6; }
.of-dark .of-card p { color: #b9bec8; }
.of-nav { align-items: center; display: flex; gap: 1rem; justify-content: space-between; padding-block: 1.25rem; }
.of-nav-links { display: flex; flex-wrap: wrap; gap: 1.25rem; list-style: none; margin: 0; padding: 0; }
.of-nav a { color: inherit; text-decoration: none; }
.of-brand { font-size: 1.1rem; font-weight: 900; letter-spacing: -.03em; }
.of-logos { align-items: center; display: flex; flex-wrap: wrap; gap: 2rem; justify-content: space-between; margin-top: 2rem; }
.of-logo { color: var(--of-muted); font-size: 1.1rem; font-weight: 800; }
.of-stat { font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 900; letter-spacing: -.05em; }
.of-price { font-size: 2.5rem; font-weight: 900; letter-spacing: -.04em; }
.of-list { line-height: 1.9; padding-left: 1.2rem; }
.of-quote { font-size: 1.2rem; line-height: 1.6; margin: 0 0 1.5rem; }
.of-faq { border-top: 1px solid var(--of-line); padding: 1.25rem 0; }
.of-faq summary { cursor: pointer; font-weight: 800; }
.of-faq p { color: var(--of-muted); line-height: 1.6; }
.of-cta { align-items: center; display: flex; flex-wrap: wrap; gap: 2rem; justify-content: space-between; }
.of-footer { display: grid; gap: 2rem; grid-template-columns: 2fr repeat(3, 1fr); }
.of-footer ul { list-style: none; margin: 0; padding: 0; }
.of-footer li { margin-top: .75rem; }
.of-footer a { color: inherit; text-decoration: none; }
@media (max-width: 700px) { .of-block { padding-block: 3.5rem; } .of-nav-links { display: none; } .of-footer { grid-template-columns: 1fr 1fr; } }
@media (prefers-reduced-motion: reduce) { .of-block * { scroll-behavior: auto !important; } }
`;

function source(body) {
  return `import "./openforge-blocks.css";

${body}
`;
}

function field(path, label, control = "text", required = false) {
  return { path, label, control, required };
}

function slot(name, label, acceptedTypes, min = 0, max = null) {
  return { name, label, acceptedTypes, min, max };
}

function block(definition) {
  return {
    schemaVersion: BLOCK_SCHEMA_VERSION,
    dependencies: [],
    slots: [],
    migrations: [],
    styles: OFFICIAL_BLOCK_STYLES,
    ...definition,
  };
}

export const officialBlocks = [
  block({
    id: "openforge.header",
    version: 1,
    name: "Header",
    description: "Responsive brand navigation with a primary action.",
    category: "navigation",
    tags: ["navigation", "menu", "brand", "cta"],
    exportName: "Header",
    fileName: "Header.jsx",
    defaultProps: { brand: "Northstar", actionLabel: "Get started" },
    editableFields: [
      field("brand", "Brand", "text", true),
      field("actionLabel", "Action label", "text", true),
      field("actionHref", "Action link", "url", true),
    ],
    slots: [slot("navigation", "Navigation", ["link"], 1, 6)],
    accessibility: [
      "Uses a labelled primary navigation landmark.",
      "Keeps visible link text and a keyboard-reachable primary action.",
    ],
    preview: { label: "Brand navigation", viewport: "wide", tone: "light" },
    source: source(`const defaultLinks = [
  { label: "Product", href: "#product" },
  { label: "Customers", href: "#customers" },
  { label: "Pricing", href: "#pricing" },
];

export function Header({
  brand = "Northstar",
  links = defaultLinks,
  actionLabel = "Get started",
  actionHref = "#contact",
}) {
  return (
    <header className="of-block of-nav">
      <a className="of-brand" href="/" aria-label={\`\${brand} home\`}>{brand}</a>
      <nav aria-label="Primary">
        <ul className="of-nav-links">
          {links.map((link) => <li key={link.href}><a href={link.href}>{link.label}</a></li>)}
        </ul>
      </nav>
      <a className="of-button" href={actionHref}>{actionLabel}</a>
    </header>
  );
}`),
  }),
  block({
    id: "openforge.hero",
    version: 2,
    name: "Hero",
    description: "High-impact opening statement with two actions.",
    category: "hero",
    tags: ["hero", "headline", "intro", "conversion"],
    exportName: "Hero",
    fileName: "Hero.jsx",
    defaultProps: {
      eyebrow: "Built for ambitious teams",
      heading: "Turn a clear idea into a remarkable product.",
      primaryActionLabel: "Start building",
    },
    editableFields: [
      field("eyebrow", "Eyebrow"),
      field("heading", "Heading", "textarea", true),
      field("body", "Body", "textarea", true),
      field("primaryActionLabel", "Primary action", "text", true),
      field("primaryActionHref", "Primary link", "url", true),
    ],
    slots: [
      slot("heading", "Heading", ["text"], 1, 1),
      slot("body", "Body", ["text"], 0, 1),
      slot("actions", "Actions", ["link", "button"], 1, 2),
    ],
    accessibility: [
      "Keeps the page heading as a single semantic h1.",
      "Action labels describe their destination without relying on context.",
    ],
    migrations: [
      {
        fromVersion: 1,
        toVersion: 2,
        description: "Rename the primary CTA label for inspector consistency.",
        changes: [
          {
            type: "rename-prop",
            from: "ctaText",
            to: "primaryActionLabel",
          },
          {
            type: "set-default",
            path: "secondaryActionLabel",
            value: "See how it works",
          },
        ],
      },
    ],
    preview: { label: "Editorial hero", viewport: "full", tone: "light" },
    source: source(`export function Hero({
  eyebrow = "Built for ambitious teams",
  heading = "Turn a clear idea into a remarkable product.",
  body = "A focused foundation for teams that care about craft, speed, and complete ownership.",
  primaryActionLabel = "Start building",
  primaryActionHref = "#contact",
  secondaryActionLabel = "See how it works",
  secondaryActionHref = "#product",
}) {
  return (
    <section className="of-block" aria-labelledby="hero-heading">
      <p className="of-kicker">{eyebrow}</p>
      <h1 className="of-title" id="hero-heading">{heading}</h1>
      <p className="of-copy">{body}</p>
      <div className="of-actions">
        <a className="of-button" href={primaryActionHref}>{primaryActionLabel}</a>
        <a className="of-button of-button-secondary" href={secondaryActionHref}>{secondaryActionLabel}</a>
      </div>
    </section>
  );
}`),
  }),
  block({
    id: "openforge.logo-cloud",
    version: 1,
    name: "Logo Cloud",
    description: "Compact customer and partner proof strip.",
    category: "social-proof",
    tags: ["logos", "customers", "partners", "trust"],
    exportName: "LogoCloud",
    fileName: "LogoCloud.jsx",
    defaultProps: { heading: "Trusted by teams moving with intent" },
    editableFields: [field("heading", "Heading", "text", true)],
    slots: [slot("logos", "Logos", ["text", "image"], 2, 8)],
    accessibility: [
      "Text logos remain readable when images are unavailable.",
      "The group has a descriptive accessible label.",
    ],
    preview: { label: "Customer proof", viewport: "wide", tone: "light" },
    source:
      source(`const defaultLogos = ["Acme", "Vertex", "Arc", "Relay", "North"];

export function LogoCloud({
  heading = "Trusted by teams moving with intent",
  logos = defaultLogos,
}) {
  return (
    <section className="of-block of-soft" aria-labelledby="logos-heading">
      <h2 id="logos-heading">{heading}</h2>
      <div className="of-logos" aria-label="Customer logos">
        {logos.map((logo) => <span className="of-logo" key={logo}>{logo}</span>)}
      </div>
    </section>
  );
}`),
  }),
  block({
    id: "openforge.features",
    version: 1,
    name: "Features",
    description: "Scannable capability grid with outcome-led copy.",
    category: "content",
    tags: ["features", "benefits", "grid", "product"],
    exportName: "Features",
    fileName: "Features.jsx",
    defaultProps: { heading: "Everything needed to move from idea to impact" },
    editableFields: [
      field("heading", "Heading", "textarea", true),
      field("items[].title", "Feature titles"),
      field("items[].body", "Feature descriptions", "textarea"),
    ],
    slots: [slot("items", "Features", ["feature"], 2, 8)],
    accessibility: [
      "Uses a semantic list for grouped features.",
      "Maintains logical heading order inside each feature.",
    ],
    preview: { label: "Feature grid", viewport: "full", tone: "light" },
    source: source(`const defaultItems = [
  { title: "Clear by design", body: "A system that keeps the important decisions visible." },
  { title: "Fast by default", body: "Focused workflows remove friction without hiding control." },
  { title: "Yours completely", body: "Portable output stays readable, editable, and dependable." },
];

export function Features({
  eyebrow = "The product",
  heading = "Everything needed to move from idea to impact",
  items = defaultItems,
}) {
  return (
    <section className="of-block" id="product" aria-labelledby="features-heading">
      <p className="of-kicker">{eyebrow}</p>
      <h2 className="of-title" id="features-heading">{heading}</h2>
      <ul className="of-grid" role="list">
        {items.map((item) => <li className="of-card" key={item.title}><h3>{item.title}</h3><p>{item.body}</p></li>)}
      </ul>
    </section>
  );
}`),
  }),
  block({
    id: "openforge.stats",
    version: 1,
    name: "Stats",
    description: "Outcome metrics presented with concise context.",
    category: "social-proof",
    tags: ["stats", "metrics", "results", "numbers"],
    exportName: "Stats",
    fileName: "Stats.jsx",
    defaultProps: { heading: "Progress you can measure" },
    editableFields: [
      field("heading", "Heading", "text", true),
      field("items[].value", "Metric values"),
      field("items[].label", "Metric labels"),
    ],
    slots: [slot("items", "Metrics", ["stat"], 2, 6)],
    accessibility: [
      "Pairs every metric value with a visible text label.",
      "Uses list semantics instead of a visual-only data layout.",
    ],
    preview: { label: "Outcome metrics", viewport: "wide", tone: "dark" },
    source: source(`const defaultItems = [
  { value: "3.2×", label: "faster delivery" },
  { value: "98%", label: "team adoption" },
  { value: "24/7", label: "source ownership" },
];

export function Stats({ heading = "Progress you can measure", items = defaultItems }) {
  return (
    <section className="of-block of-dark" aria-labelledby="stats-heading">
      <h2 id="stats-heading">{heading}</h2>
      <ul className="of-grid" role="list">
        {items.map((item) => <li className="of-card" key={item.label}><div className="of-stat">{item.value}</div><p>{item.label}</p></li>)}
      </ul>
    </section>
  );
}`),
  }),
  block({
    id: "openforge.testimonials",
    version: 1,
    name: "Testimonials",
    description: "Customer quotes with clear attribution.",
    category: "social-proof",
    tags: ["testimonials", "quotes", "customers", "reviews"],
    exportName: "Testimonials",
    fileName: "Testimonials.jsx",
    defaultProps: { heading: "Loved by people who care about the details" },
    editableFields: [
      field("heading", "Heading", "textarea", true),
      field("items[].quote", "Quote", "textarea"),
      field("items[].name", "Customer name"),
      field("items[].role", "Customer role"),
    ],
    slots: [slot("items", "Testimonials", ["testimonial"], 1, 6)],
    accessibility: [
      "Uses blockquote and cite semantics for every testimonial.",
      "Does not rely on portraits to communicate attribution.",
    ],
    preview: { label: "Customer stories", viewport: "full", tone: "light" },
    source: source(`const defaultItems = [
  { quote: "We moved from scattered decisions to one confident direction.", name: "Maya Chen", role: "Product lead" },
  { quote: "The result feels considered, but the workflow never felt heavy.", name: "Jon Bell", role: "Studio founder" },
];

export function Testimonials({
  heading = "Loved by people who care about the details",
  items = defaultItems,
}) {
  return (
    <section className="of-block of-soft" id="customers" aria-labelledby="testimonials-heading">
      <h2 className="of-title" id="testimonials-heading">{heading}</h2>
      <div className="of-grid">
        {items.map((item) => <figure className="of-card" key={item.name}><blockquote className="of-quote">“{item.quote}”</blockquote><figcaption><strong>{item.name}</strong><br /><cite>{item.role}</cite></figcaption></figure>)}
      </div>
    </section>
  );
}`),
  }),
  block({
    id: "openforge.pricing",
    version: 1,
    name: "Pricing",
    description: "Comparable pricing tiers with explicit plan actions.",
    category: "pricing",
    tags: ["pricing", "plans", "tiers", "conversion"],
    exportName: "Pricing",
    fileName: "Pricing.jsx",
    defaultProps: { heading: "Simple plans that scale with your ambition" },
    editableFields: [
      field("heading", "Heading", "textarea", true),
      field("plans[].name", "Plan names"),
      field("plans[].price", "Plan prices"),
      field("plans[].actionLabel", "Plan actions"),
    ],
    slots: [slot("plans", "Plans", ["pricing-plan"], 1, 4)],
    accessibility: [
      "Every plan action includes its plan name in the accessible label.",
      "Feature lists use semantic list markup.",
    ],
    preview: { label: "Pricing tiers", viewport: "full", tone: "light" },
    source: source(`const defaultPlans = [
  { name: "Starter", price: "$19", description: "For focused personal projects.", features: ["One project", "Core blocks", "Source export"], actionLabel: "Choose Starter" },
  { name: "Studio", price: "$59", description: "For teams shipping client work.", features: ["Unlimited projects", "Shared libraries", "Priority support"], actionLabel: "Choose Studio" },
  { name: "Scale", price: "Custom", description: "For organizations with advanced needs.", features: ["Policy controls", "Private libraries", "Dedicated support"], actionLabel: "Contact sales" },
];

export function Pricing({
  heading = "Simple plans that scale with your ambition",
  plans = defaultPlans,
}) {
  return (
    <section className="of-block" id="pricing" aria-labelledby="pricing-heading">
      <h2 className="of-title" id="pricing-heading">{heading}</h2>
      <div className="of-grid">
        {plans.map((plan) => <article className="of-card" key={plan.name}><h3>{plan.name}</h3><div className="of-price">{plan.price}</div><p>{plan.description}</p><ul className="of-list">{plan.features.map((feature) => <li key={feature}>{feature}</li>)}</ul><a className="of-button" href="#contact" aria-label={\`\${plan.actionLabel}, \${plan.name} plan\`}>{plan.actionLabel}</a></article>)}
      </div>
    </section>
  );
}`),
  }),
  block({
    id: "openforge.faq",
    version: 1,
    name: "FAQ",
    description: "Native disclosure list for common buying questions.",
    category: "content",
    tags: ["faq", "questions", "support", "accordion"],
    exportName: "Faq",
    fileName: "Faq.jsx",
    defaultProps: { heading: "Questions, answered clearly" },
    editableFields: [
      field("heading", "Heading", "text", true),
      field("items[].question", "Questions"),
      field("items[].answer", "Answers", "textarea"),
    ],
    slots: [slot("items", "Questions", ["faq-item"], 1, 12)],
    accessibility: [
      "Uses native details and summary controls for keyboard support.",
      "Questions remain visible without requiring pointer interaction.",
    ],
    preview: { label: "Question list", viewport: "wide", tone: "light" },
    source: source(`const defaultItems = [
  { question: "Can I change the content later?", answer: "Yes. Every field remains editable and the generated source stays yours." },
  { question: "Does this work on smaller screens?", answer: "Yes. The layout adapts across common viewport sizes." },
  { question: "Can my team extend it?", answer: "Yes. The components are ordinary JavaScript and JSX." },
];

export function Faq({ heading = "Questions, answered clearly", items = defaultItems }) {
  return (
    <section className="of-block of-soft" aria-labelledby="faq-heading">
      <h2 className="of-title" id="faq-heading">{heading}</h2>
      <div>{items.map((item) => <details className="of-faq" key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div>
    </section>
  );
}`),
  }),
  block({
    id: "openforge.cta",
    version: 1,
    name: "Call to Action",
    description: "Focused closing invitation with one primary next step.",
    category: "conversion",
    tags: ["cta", "conversion", "contact", "signup"],
    exportName: "CallToAction",
    fileName: "CallToAction.jsx",
    defaultProps: {
      heading: "Ready to make the next release your best one?",
      actionLabel: "Start a conversation",
    },
    editableFields: [
      field("heading", "Heading", "textarea", true),
      field("body", "Body", "textarea"),
      field("actionLabel", "Action label", "text", true),
      field("actionHref", "Action link", "url", true),
    ],
    slots: [slot("actions", "Actions", ["link", "button"], 1, 2)],
    accessibility: [
      "Uses a section label connected to its heading.",
      "Maintains strong text contrast in the dark treatment.",
    ],
    preview: { label: "Closing invitation", viewport: "wide", tone: "dark" },
    source: source(`export function CallToAction({
  heading = "Ready to make the next release your best one?",
  body = "Bring your idea. Keep your standards. We will help with the path between them.",
  actionLabel = "Start a conversation",
  actionHref = "mailto:hello@example.com",
}) {
  return (
    <section className="of-block of-dark of-cta" id="contact" aria-labelledby="cta-heading">
      <div><h2 className="of-title" id="cta-heading">{heading}</h2><p className="of-copy">{body}</p></div>
      <a className="of-button" href={actionHref}>{actionLabel}</a>
    </section>
  );
}`),
  }),
  block({
    id: "openforge.footer",
    version: 1,
    name: "Footer",
    description: "Brand summary and organized closing navigation.",
    category: "footer",
    tags: ["footer", "sitemap", "legal", "navigation"],
    exportName: "Footer",
    fileName: "Footer.jsx",
    defaultProps: { brand: "Northstar", summary: "Build with clarity." },
    editableFields: [
      field("brand", "Brand", "text", true),
      field("summary", "Summary", "textarea"),
    ],
    slots: [slot("groups", "Link groups", ["link-group"], 1, 5)],
    accessibility: [
      "Uses a labelled footer navigation landmark.",
      "Link groups have visible headings and descriptive labels.",
    ],
    preview: { label: "Closing navigation", viewport: "full", tone: "dark" },
    source: source(`const defaultGroups = [
  { title: "Product", links: [{ label: "Features", href: "#product" }, { label: "Pricing", href: "#pricing" }] },
  { title: "Company", links: [{ label: "About", href: "/about" }, { label: "Contact", href: "#contact" }] },
  { title: "Legal", links: [{ label: "Privacy", href: "/privacy" }, { label: "Terms", href: "/terms" }] },
];

export function Footer({
  brand = "Northstar",
  summary = "Build with clarity.",
  groups = defaultGroups,
}) {
  return (
    <footer className="of-block of-dark of-footer">
      <div><div className="of-brand">{brand}</div><p className="of-copy">{summary}</p></div>
      {groups.map((group) => <nav aria-label={group.title} key={group.title}><strong>{group.title}</strong><ul>{group.links.map((link) => <li key={link.href}><a href={link.href}>{link.label}</a></li>)}</ul></nav>)}
    </footer>
  );
}`),
  }),
];
