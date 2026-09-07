// Hero / masthead component variants harvested from reference projects.
// Populated by an authoring pass — see README.md for the sourcing process.

export const heroComponents = [
  {
    schemaVersion: 1,
    id: "hero.split-image-blobs",
    name: "Split Image Hero with Decorative Blobs",
    category: "hero",
    description:
      "Two-column hero with a headline and CTA on the left and a framed image placeholder floating over soft blurred color blobs on the right.",
    tags: ["hero", "split", "image", "gradient", "product"],
    sourceProject: "FitGrips-Frontend",
    exportName: "SplitImageHero",
    fileName: "SplitImageHero.jsx",
    dependencies: [],
    defaultProps: {
      kicker: "New arrivals",
      heading: "A product page that finally matches the product.",
      body: "Pair a confident headline with a real photo of what you sell. This layout keeps the pitch and the proof side by side, so visitors never have to scroll to see the payoff.",
      ctaLabel: "Get a quote",
      ctaHref: "#contact",
      imageAlt: "Placeholder product photo",
    },
    accessibility: [
      "Renders a single page-level h1 for the headline and describes the decorative image frame with an accessible role and label instead of leaving it silent.",
      "The two soft background blobs are marked aria-hidden since they carry no information.",
    ],
    source: `export function SplitImageHero({
  kicker = "New arrivals",
  heading = "A product page that finally matches the product.",
  body = "Pair a confident headline with a real photo of what you sell. This layout keeps the pitch and the proof side by side, so visitors never have to scroll to see the payoff.",
  ctaLabel = "Get a quote",
  ctaHref = "#contact",
  imageAlt = "Placeholder product photo",
}) {
  return (
    <section className="ofl-hero-split-image-blobs">
      <div className="ofl-hero-split-image-blobs__inner">
        <div className="ofl-hero-split-image-blobs__copy">
          <p className="ofl-hero-split-image-blobs__kicker">{kicker}</p>
          <h1 className="ofl-hero-split-image-blobs__heading">{heading}</h1>
          <p className="ofl-hero-split-image-blobs__body">{body}</p>
          <a className="ofl-hero-split-image-blobs__cta" href={ctaHref}>
            {ctaLabel}
          </a>
        </div>
        <div className="ofl-hero-split-image-blobs__media">
          <span
            className="ofl-hero-split-image-blobs__blob ofl-hero-split-image-blobs__blob--one"
            aria-hidden="true"
          />
          <span
            className="ofl-hero-split-image-blobs__blob ofl-hero-split-image-blobs__blob--two"
            aria-hidden="true"
          />
          <div
            className="ofl-hero-split-image-blobs__frame"
            role="img"
            aria-label={imageAlt}
          >
            <svg
              viewBox="0 0 120 120"
              width="72"
              height="72"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect x="14" y="30" width="92" height="64" rx="8" stroke="currentColor" strokeWidth="4" />
              <circle cx="40" cy="54" r="8" stroke="currentColor" strokeWidth="4" />
              <path
                d="M14 84L44 58L66 76L84 60L106 80"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
`,
    styles: `.ofl-hero-split-image-blobs {
  background: linear-gradient(120deg, #f3f4f6 0%, #ffffff 60%);
  padding: clamp(2.5rem, 6vw, 5rem) clamp(1.25rem, 5vw, 4rem);
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  color: #111827;
}

.ofl-hero-split-image-blobs__inner {
  max-width: 1120px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: clamp(2rem, 5vw, 4rem);
  align-items: center;
}

.ofl-hero-split-image-blobs__kicker {
  margin: 0 0 0.75rem;
  font-size: 0.95rem;
  color: #4b5563;
}

.ofl-hero-split-image-blobs__heading {
  margin: 0 0 1rem;
  font-size: clamp(2rem, 3.6vw, 3.25rem);
  font-weight: 800;
  line-height: 1.1;
  color: #111827;
}

.ofl-hero-split-image-blobs__body {
  margin: 0 0 1.75rem;
  font-size: 1rem;
  line-height: 1.6;
  color: #374151;
  max-width: 46ch;
}

.ofl-hero-split-image-blobs__cta {
  display: inline-flex;
  align-items: center;
  padding: 0.85rem 1.75rem;
  border-radius: 999px;
  background: #111827;
  color: #ffffff;
  font-weight: 600;
  text-decoration: none;
}

.ofl-hero-split-image-blobs__cta:hover {
  background: #1f2937;
}

.ofl-hero-split-image-blobs__media {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 280px;
}

.ofl-hero-split-image-blobs__blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(2px);
  opacity: 0.55;
  z-index: 0;
}

.ofl-hero-split-image-blobs__blob--one {
  width: 130px;
  height: 130px;
  background: #bfdbfe;
  bottom: -1rem;
  left: 0;
}

.ofl-hero-split-image-blobs__blob--two {
  width: 90px;
  height: 90px;
  background: #fde68a;
  top: -0.5rem;
  right: 1rem;
}

.ofl-hero-split-image-blobs__frame {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 380px;
  aspect-ratio: 4 / 3;
  border-radius: 1.25rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 20px 45px -20px rgba(17, 24, 39, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
}

@media (max-width: 760px) {
  .ofl-hero-split-image-blobs__inner {
    grid-template-columns: 1fr;
    text-align: left;
  }

  .ofl-hero-split-image-blobs__media {
    order: -1;
  }
}
`,
  },

  {
    schemaVersion: 1,
    id: "hero.gradient-stat-panel",
    name: "Warm Gradient Hero with Floating Stat and Panel",
    category: "hero",
    description:
      "Full-bleed dark warm-gradient hero with a large light headline, a floating stat card, orbiting decorative dots, and a light secondary panel anchored to the bottom edge.",
    tags: ["hero", "gradient", "dark", "stats", "editorial"],
    sourceProject: "archtech",
    exportName: "GradientStatPanelHero",
    fileName: "GradientStatPanelHero.jsx",
    dependencies: [],
    defaultProps: {
      heading: "Build skills that shape what comes next.",
      ctaLabel: "Browse programs",
      ctaHref: "#programs",
      statValue: "12,000+",
      statLabel: "People trained",
      statBlurb: "Practical, project-based programs built around real-world tools.",
      panelHeading: "Your learning journey",
      panelBody: "Small cohorts, structured milestones, and mentors who review your work.",
      panelLinkLabel: "Join the community",
      panelLinkHref: "#community",
    },
    accessibility: [
      "Keeps a single page-level h1 and pairs the stat value with a visible text label rather than relying on color or size alone.",
      "White and near-white text sits on a dark gradient background chosen for sufficient contrast.",
    ],
    source: `export function GradientStatPanelHero({
  heading = "Build skills that shape what comes next.",
  ctaLabel = "Browse programs",
  ctaHref = "#programs",
  statValue = "12,000+",
  statLabel = "People trained",
  statBlurb = "Practical, project-based programs built around real-world tools.",
  panelHeading = "Your learning journey",
  panelBody = "Small cohorts, structured milestones, and mentors who review your work.",
  panelLinkLabel = "Join the community",
  panelLinkHref = "#community",
}) {
  return (
    <section className="ofl-hero-gradient-stat-panel">
      <span className="ofl-hero-gradient-stat-panel__dot ofl-hero-gradient-stat-panel__dot--a" aria-hidden="true" />
      <span className="ofl-hero-gradient-stat-panel__dot ofl-hero-gradient-stat-panel__dot--b" aria-hidden="true" />
      <span className="ofl-hero-gradient-stat-panel__dot ofl-hero-gradient-stat-panel__dot--c" aria-hidden="true" />

      <div className="ofl-hero-gradient-stat-panel__content">
        <h1 className="ofl-hero-gradient-stat-panel__heading">{heading}</h1>
        <a className="ofl-hero-gradient-stat-panel__cta" href={ctaHref}>
          {ctaLabel}
        </a>
      </div>

      <aside className="ofl-hero-gradient-stat-panel__stat">
        <p className="ofl-hero-gradient-stat-panel__stat-value">{statValue}</p>
        <p className="ofl-hero-gradient-stat-panel__stat-label">{statLabel}</p>
        <p className="ofl-hero-gradient-stat-panel__stat-blurb">{statBlurb}</p>
      </aside>

      <div className="ofl-hero-gradient-stat-panel__panel">
        <div className="ofl-hero-gradient-stat-panel__panel-copy">
          <h2 className="ofl-hero-gradient-stat-panel__panel-heading">{panelHeading}</h2>
          <p className="ofl-hero-gradient-stat-panel__panel-body">{panelBody}</p>
          <a className="ofl-hero-gradient-stat-panel__panel-link" href={panelLinkHref}>
            {panelLinkLabel}
          </a>
        </div>
        <div className="ofl-hero-gradient-stat-panel__panel-art" aria-hidden="true" />
      </div>
    </section>
  );
}
`,
    styles: `.ofl-hero-gradient-stat-panel {
  position: relative;
  overflow: hidden;
  min-height: 640px;
  padding: clamp(3rem, 8vw, 6rem) clamp(1.5rem, 6vw, 5rem) 14rem;
  background:
    radial-gradient(circle at 48% 35%, rgba(120, 70, 50, 0.4), transparent 32%),
    radial-gradient(circle at 8% 50%, rgba(120, 70, 50, 0.2), transparent 30%),
    linear-gradient(115deg, #1a0e0c 0%, #2a1815 55%, #180c0a 100%);
  color: #ffffff;
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
}

.ofl-hero-gradient-stat-panel__dot {
  position: absolute;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: grid;
  place-items: center;
}

.ofl-hero-gradient-stat-panel__dot::after {
  content: "";
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 14px 4px rgba(255, 255, 255, 0.25);
}

.ofl-hero-gradient-stat-panel__dot--a {
  left: 6%;
  top: 62%;
}

.ofl-hero-gradient-stat-panel__dot--b {
  right: 10%;
  top: 30%;
}

.ofl-hero-gradient-stat-panel__dot--c {
  right: 30%;
  top: 12%;
}

.ofl-hero-gradient-stat-panel__content {
  position: relative;
  z-index: 2;
  max-width: 420px;
}

.ofl-hero-gradient-stat-panel__heading {
  margin: 0 0 1.5rem;
  font-size: clamp(2.2rem, 4vw, 3.6rem);
  font-weight: 300;
  line-height: 1.08;
  letter-spacing: -0.02em;
}

.ofl-hero-gradient-stat-panel__cta {
  display: inline-flex;
  align-items: center;
  height: 2.75rem;
  padding: 0 1.25rem;
  border-radius: 0.5rem;
  background: #ffffff;
  color: #211512;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
}

.ofl-hero-gradient-stat-panel__stat {
  position: absolute;
  right: clamp(1.5rem, 6vw, 5rem);
  top: clamp(6rem, 14vw, 9rem);
  z-index: 2;
  width: 220px;
  text-align: right;
}

.ofl-hero-gradient-stat-panel__stat-value {
  margin: 0;
  font-size: 2rem;
  font-weight: 300;
  letter-spacing: -0.03em;
}

.ofl-hero-gradient-stat-panel__stat-label {
  margin: 0.15rem 0 0.75rem;
  font-size: 0.8rem;
  font-weight: 600;
}

.ofl-hero-gradient-stat-panel__stat-blurb {
  margin: 0;
  font-size: 0.75rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.6);
}

.ofl-hero-gradient-stat-panel__panel {
  position: absolute;
  left: clamp(0.75rem, 4vw, 2rem);
  right: clamp(0.75rem, 4vw, 2rem);
  bottom: clamp(0.75rem, 3vw, 1.5rem);
  z-index: 3;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  min-height: 200px;
  border-radius: 1.1rem;
  overflow: hidden;
  background: #f7f4ef;
  color: #241b19;
}

.ofl-hero-gradient-stat-panel__panel-copy {
  padding: clamp(1.5rem, 3vw, 2.5rem);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.ofl-hero-gradient-stat-panel__panel-heading {
  margin: 0 0 0.6rem;
  font-size: clamp(1.4rem, 2vw, 1.9rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: -0.03em;
}

.ofl-hero-gradient-stat-panel__panel-body {
  margin: 0 0 1rem;
  max-width: 32ch;
  font-size: 0.85rem;
  line-height: 1.6;
  color: #6b615d;
}

.ofl-hero-gradient-stat-panel__panel-link {
  font-size: 0.8rem;
  font-weight: 600;
  color: #b0492f;
  text-decoration: underline;
  text-underline-offset: 3px;
  width: fit-content;
}

.ofl-hero-gradient-stat-panel__panel-art {
  background:
    radial-gradient(circle at 30% 30%, rgba(176, 73, 47, 0.35), transparent 60%),
    #e9dfd8;
}

@media (max-width: 760px) {
  .ofl-hero-gradient-stat-panel {
    padding-bottom: 20rem;
  }

  .ofl-hero-gradient-stat-panel__stat {
    position: static;
    width: auto;
    text-align: left;
    margin-top: 2rem;
  }

  .ofl-hero-gradient-stat-panel__panel {
    grid-template-columns: 1fr;
  }

  .ofl-hero-gradient-stat-panel__panel-art {
    min-height: 120px;
  }
}
`,
  },

  {
    schemaVersion: 1,
    id: "hero.split-collage-grid",
    name: "Split Hero with Product Collage Grid",
    category: "hero",
    description:
      "Split hero pairing a headline, size chips, and dual CTAs on the left with a four-column vertical collage grid of product tiles on the right.",
    tags: ["hero", "split", "collage", "grid", "product", "ecommerce"],
    sourceProject: "stitchmarkuniform",
    exportName: "SplitCollageGridHero",
    fileName: "SplitCollageGridHero.jsx",
    dependencies: [],
    defaultProps: {
      kicker: "Custom uniform solutions",
      heading: "Uniforms built for scale, styled for pride.",
      body: "Adaptive packaging and finishing options mapped across every size run, so every team looks sharp on day one.",
      sizes: ["XS", "S", "M", "L", "XL", "2XL"],
      primaryCtaLabel: "Request a quote",
      primaryCtaHref: "#quote",
      secondaryCtaLabel: "Explore catalog",
      secondaryCtaHref: "#catalog",
    },
    accessibility: [
      "Uses a single h1 and a labelled list for the size chips instead of a purely visual chip row.",
      "The decorative collage tiles are marked aria-hidden since they stand in for product photography and carry no information.",
    ],
    source: `export function SplitCollageGridHero({
  kicker = "Custom uniform solutions",
  heading = "Uniforms built for scale, styled for pride.",
  body = "Adaptive packaging and finishing options mapped across every size run, so every team looks sharp on day one.",
  sizes = ["XS", "S", "M", "L", "XL", "2XL"],
  primaryCtaLabel = "Request a quote",
  primaryCtaHref = "#quote",
  secondaryCtaLabel = "Explore catalog",
  secondaryCtaHref = "#catalog",
}) {
  const tileCount = 4;

  return (
    <section className="ofl-hero-split-collage-grid">
      <div className="ofl-hero-split-collage-grid__copy">
        <span className="ofl-hero-split-collage-grid__kicker">{kicker}</span>
        <h1 className="ofl-hero-split-collage-grid__heading">{heading}</h1>
        <p className="ofl-hero-split-collage-grid__body">{body}</p>

        <ul className="ofl-hero-split-collage-grid__sizes" aria-label="Available sizes">
          {sizes.map((size) => (
            <li key={size}>{size}</li>
          ))}
        </ul>

        <div className="ofl-hero-split-collage-grid__actions">
          <a className="ofl-hero-split-collage-grid__primary" href={primaryCtaHref}>
            {primaryCtaLabel}
          </a>
          <a className="ofl-hero-split-collage-grid__secondary" href={secondaryCtaHref}>
            {secondaryCtaLabel}
          </a>
        </div>
      </div>

      <div className="ofl-hero-split-collage-grid__collage" aria-hidden="true">
        {Array.from({ length: tileCount }).map((_, index) => (
          <div className="ofl-hero-split-collage-grid__tile" key={index} />
        ))}
      </div>
    </section>
  );
}
`,
    styles: `.ofl-hero-split-collage-grid {
  background: #ffffff;
  padding: clamp(2rem, 5vw, 3.5rem) clamp(1.25rem, 5vw, 4rem);
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  color: #111827;
}

.ofl-hero-split-collage-grid {
  display: grid;
  grid-template-columns: 5fr 7fr;
  gap: clamp(1.5rem, 4vw, 3rem);
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.ofl-hero-split-collage-grid__kicker {
  display: inline-block;
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #6b7280;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  padding: 0.35rem 0.85rem;
  margin-bottom: 1rem;
}

.ofl-hero-split-collage-grid__heading {
  margin: 0 0 0.85rem;
  font-size: clamp(1.75rem, 3.2vw, 2.75rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.01em;
}

.ofl-hero-split-collage-grid__body {
  margin: 0 0 1.25rem;
  max-width: 40ch;
  font-size: 0.9rem;
  line-height: 1.6;
  color: #4b5563;
}

.ofl-hero-split-collage-grid__sizes {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0 0 1.5rem;
  padding: 0;
}

.ofl-hero-split-collage-grid__sizes li {
  font-size: 0.75rem;
  padding: 0.3rem 0.9rem;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  color: #374151;
}

.ofl-hero-split-collage-grid__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.ofl-hero-split-collage-grid__primary,
.ofl-hero-split-collage-grid__secondary {
  display: inline-flex;
  align-items: center;
  height: 2.65rem;
  padding: 0 1.4rem;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
}

.ofl-hero-split-collage-grid__primary {
  background: #111827;
  color: #ffffff;
}

.ofl-hero-split-collage-grid__secondary {
  border: 1px solid #d1d5db;
  color: #111827;
}

.ofl-hero-split-collage-grid__collage {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: clamp(0.4rem, 1vw, 0.85rem);
  height: clamp(260px, 34vw, 420px);
}

.ofl-hero-split-collage-grid__tile {
  border-radius: 0.85rem;
  background: linear-gradient(160deg, #e5e7eb, #f3f4f6);
}

.ofl-hero-split-collage-grid__tile:nth-child(2) {
  background: linear-gradient(160deg, #dbeafe, #eff6ff);
  transform: translateY(10%);
}

.ofl-hero-split-collage-grid__tile:nth-child(3) {
  background: linear-gradient(160deg, #fef3c7, #fffbeb);
}

.ofl-hero-split-collage-grid__tile:nth-child(4) {
  background: linear-gradient(160deg, #e5e7eb, #f3f4f6);
  transform: translateY(10%);
}

@media (max-width: 760px) {
  .ofl-hero-split-collage-grid {
    grid-template-columns: 1fr;
  }

  .ofl-hero-split-collage-grid__collage {
    height: 260px;
  }

  .ofl-hero-split-collage-grid__tile:nth-child(2),
  .ofl-hero-split-collage-grid__tile:nth-child(4) {
    transform: none;
  }
}
`,
  },

  {
    schemaVersion: 1,
    id: "hero.full-bleed-badge-stats",
    name: "Full-Bleed Hero with Trust Badge and Stat Row",
    category: "hero",
    description:
      "Full-bleed corporate hero over a dark gradient backdrop with a certification-style badge, a highlighted headline, dual CTAs, and a stat row anchored at the bottom.",
    tags: ["hero", "full-bleed", "corporate", "stats", "gradient"],
    sourceProject: "allahrakhaandco",
    exportName: "FullBleedBadgeStatsHero",
    fileName: "FullBleedBadgeStatsHero.jsx",
    dependencies: [],
    defaultProps: {
      badgeLabel: "Certified quality process",
      heading: "Precision manufacturing for",
      highlight: "global institutions",
      body: "From first sample to final shipment, we manufacture durable, comfortable goods engineered for institutional-scale demand across dozens of countries.",
      primaryCtaLabel: "Explore catalog",
      primaryCtaHref: "#catalog",
      secondaryCtaLabel: "Start an inquiry",
      secondaryCtaHref: "#inquiry",
      stats: [
        { value: "25+", label: "Countries served" },
        { value: "500+", label: "Institutions" },
        { value: "15+", label: "Years experience" },
      ],
    },
    accessibility: [
      "Keeps a single page-level h1 and sufficient contrast for white text over the dark gradient background treatment.",
      "Every stat value is paired with a visible text label rather than depending on layout alone.",
    ],
    source: `const defaultStats = [
  { value: "25+", label: "Countries served" },
  { value: "500+", label: "Institutions" },
  { value: "15+", label: "Years experience" },
];

export function FullBleedBadgeStatsHero({
  badgeLabel = "Certified quality process",
  heading = "Precision manufacturing for",
  highlight = "global institutions",
  body = "From first sample to final shipment, we manufacture durable, comfortable goods engineered for institutional-scale demand across dozens of countries.",
  primaryCtaLabel = "Explore catalog",
  primaryCtaHref = "#catalog",
  secondaryCtaLabel = "Start an inquiry",
  secondaryCtaHref = "#inquiry",
  stats = defaultStats,
}) {
  return (
    <section className="ofl-hero-full-bleed-badge-stats">
      <div className="ofl-hero-full-bleed-badge-stats__glow ofl-hero-full-bleed-badge-stats__glow--a" aria-hidden="true" />
      <div className="ofl-hero-full-bleed-badge-stats__glow ofl-hero-full-bleed-badge-stats__glow--b" aria-hidden="true" />

      <div className="ofl-hero-full-bleed-badge-stats__content">
        <span className="ofl-hero-full-bleed-badge-stats__badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 2L20 5V11C20 16 16.5 20 12 22C7.5 20 4 16 4 11V5L12 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M8.5 12L11 14.5L16 9.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {badgeLabel}
        </span>

        <h1 className="ofl-hero-full-bleed-badge-stats__heading">
          {heading}{" "}
          <span className="ofl-hero-full-bleed-badge-stats__highlight">{highlight}</span>
        </h1>

        <p className="ofl-hero-full-bleed-badge-stats__body">{body}</p>

        <div className="ofl-hero-full-bleed-badge-stats__actions">
          <a className="ofl-hero-full-bleed-badge-stats__primary" href={primaryCtaHref}>
            {primaryCtaLabel}
          </a>
          <a className="ofl-hero-full-bleed-badge-stats__secondary" href={secondaryCtaHref}>
            {secondaryCtaLabel}
          </a>
        </div>

        <div className="ofl-hero-full-bleed-badge-stats__stats">
          {stats.map((stat) => (
            <div className="ofl-hero-full-bleed-badge-stats__stat" key={stat.label}>
              <span className="ofl-hero-full-bleed-badge-stats__stat-value">{stat.value}</span>
              <span className="ofl-hero-full-bleed-badge-stats__stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`,
    styles: `.ofl-hero-full-bleed-badge-stats {
  position: relative;
  overflow: hidden;
  min-height: 90vh;
  display: flex;
  align-items: center;
  padding: clamp(3rem, 8vw, 6rem) clamp(1.25rem, 6vw, 5rem);
  background: linear-gradient(160deg, #0b1220 0%, #101a2e 45%, #1a2540 100%);
  color: #ffffff;
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
}

.ofl-hero-full-bleed-badge-stats__glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.5;
  z-index: 0;
}

.ofl-hero-full-bleed-badge-stats__glow--a {
  width: 320px;
  height: 320px;
  top: 5rem;
  right: 2rem;
  background: rgba(212, 175, 55, 0.18);
}

.ofl-hero-full-bleed-badge-stats__glow--b {
  width: 380px;
  height: 380px;
  bottom: -6rem;
  left: -4rem;
  background: rgba(59, 91, 168, 0.25);
}

.ofl-hero-full-bleed-badge-stats__content {
  position: relative;
  z-index: 1;
  max-width: 760px;
}

.ofl-hero-full-bleed-badge-stats__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.18);
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 1.75rem;
}

.ofl-hero-full-bleed-badge-stats__heading {
  margin: 0 0 1.25rem;
  font-size: clamp(2.1rem, 4.5vw, 3.8rem);
  font-weight: 700;
  line-height: 1.12;
  color: #ffffff;
}

.ofl-hero-full-bleed-badge-stats__highlight {
  background: linear-gradient(90deg, #f1d68a, #d4af37);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.ofl-hero-full-bleed-badge-stats__body {
  margin: 0 0 2.25rem;
  max-width: 56ch;
  font-size: 1.05rem;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.7);
}

.ofl-hero-full-bleed-badge-stats__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2.75rem;
}

.ofl-hero-full-bleed-badge-stats__primary,
.ofl-hero-full-bleed-badge-stats__secondary {
  display: inline-flex;
  align-items: center;
  height: 3rem;
  padding: 0 1.75rem;
  border-radius: 0.6rem;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
}

.ofl-hero-full-bleed-badge-stats__primary {
  background: #ffffff;
  color: #0b1220;
}

.ofl-hero-full-bleed-badge-stats__secondary {
  background: linear-gradient(90deg, #d4af37, #b8912c);
  color: #1a1200;
}

.ofl-hero-full-bleed-badge-stats__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 2.5rem;
}

.ofl-hero-full-bleed-badge-stats__stat {
  display: flex;
  flex-direction: column;
}

.ofl-hero-full-bleed-badge-stats__stat-value {
  font-size: 1.6rem;
  font-weight: 700;
  color: #ffffff;
}

.ofl-hero-full-bleed-badge-stats__stat-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.5);
}
`,
  },

  {
    schemaVersion: 1,
    id: "hero.full-bleed-giant-type",
    name: "Full-Bleed Giant Type Hero with Proof Corners",
    category: "hero",
    description:
      "Agency-style full-bleed hero dominated by oversized two-line type over an animated-looking gradient media panel, with an eyebrow, proof-point pairs, a scroll cue, and a live-status line pinned to the corners.",
    tags: ["hero", "full-bleed", "typography", "agency", "saas"],
    sourceProject: "x4shipping",
    exportName: "FullBleedGiantTypeHero",
    fileName: "FullBleedGiantTypeHero.jsx",
    dependencies: [],
    defaultProps: {
      eyebrowLabel: "Freight, coordinated",
      eyebrowBody: "Ocean / Air / Road / Rail",
      headingTop: "Global",
      headingBottom: "Motion",
      proofItems: [
        { value: "24/7", label: "Freight support" },
        { value: "FCL + LCL", label: "Built for every load" },
      ],
      scrollLabel: "Discover",
      statusLabel: "Routes active worldwide",
    },
    accessibility: [
      "The two-line headline is built from adjacent block-level spans with a real space between them, so assistive tech announces one continuous phrase rather than two run-together words.",
      "Every proof point pairs a bold value with an explicit text label, and the animated-looking media panel is purely decorative and marked aria-hidden.",
    ],
    source: `const defaultProofItems = [
  { value: "24/7", label: "Freight support" },
  { value: "FCL + LCL", label: "Built for every load" },
];

export function FullBleedGiantTypeHero({
  eyebrowLabel = "Freight, coordinated",
  eyebrowBody = "Ocean / Air / Road / Rail",
  headingTop = "Global",
  headingBottom = "Motion",
  proofItems = defaultProofItems,
  scrollLabel = "Discover",
  statusLabel = "Routes active worldwide",
}) {
  return (
    <section className="ofl-hero-full-bleed-giant-type">
      <div className="ofl-hero-full-bleed-giant-type__media" aria-hidden="true" />

      <h1 className="ofl-hero-full-bleed-giant-type__heading">
        <span>{headingTop}</span> <span>{headingBottom}</span>
      </h1>

      <div className="ofl-hero-full-bleed-giant-type__kicker">
        <span className="ofl-hero-full-bleed-giant-type__eyebrow">{eyebrowLabel}</span>
        <p>{eyebrowBody}</p>
      </div>

      <div className="ofl-hero-full-bleed-giant-type__proof">
        {proofItems.map((item) => (
          <div key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      <a className="ofl-hero-full-bleed-giant-type__action" href="#next">
        <span>{scrollLabel}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 4V20M12 20L6 14M12 20L18 14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>

      <div className="ofl-hero-full-bleed-giant-type__status">
        <span aria-hidden="true" />
        {statusLabel}
      </div>
    </section>
  );
}
`,
    styles: `.ofl-hero-full-bleed-giant-type {
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  background: #05060a;
  color: #ffffff;
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
}

.ofl-hero-full-bleed-giant-type__media {
  position: absolute;
  inset: 8% 6%;
  border-radius: 1.5rem;
  background: conic-gradient(from 200deg at 50% 50%, #1c2536, #05060a 35%, #2a1f3d 70%, #1c2536);
  opacity: 0.85;
  z-index: 0;
}

.ofl-hero-full-bleed-giant-type__heading {
  position: relative;
  z-index: 1;
  margin: 0;
  padding-top: clamp(4rem, 14vw, 7rem);
  text-align: center;
  font-size: clamp(3.5rem, 14vw, 10rem);
  font-weight: 800;
  line-height: 0.92;
  letter-spacing: -0.03em;
}

.ofl-hero-full-bleed-giant-type__heading span {
  display: block;
}

.ofl-hero-full-bleed-giant-type__kicker {
  position: absolute;
  z-index: 2;
  left: clamp(1.25rem, 5vw, 3rem);
  bottom: clamp(6.5rem, 14vw, 8rem);
  max-width: 220px;
}

.ofl-hero-full-bleed-giant-type__eyebrow {
  display: block;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #ffffff;
}

.ofl-hero-full-bleed-giant-type__kicker p {
  margin: 0.4rem 0 0;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
}

.ofl-hero-full-bleed-giant-type__proof {
  position: absolute;
  z-index: 2;
  right: clamp(1.25rem, 5vw, 3rem);
  bottom: clamp(6.5rem, 14vw, 8rem);
  display: flex;
  gap: 1.75rem;
  text-align: right;
}

.ofl-hero-full-bleed-giant-type__proof div {
  display: flex;
  flex-direction: column;
}

.ofl-hero-full-bleed-giant-type__proof strong {
  font-size: 1rem;
  font-weight: 700;
}

.ofl-hero-full-bleed-giant-type__proof span {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.55);
}

.ofl-hero-full-bleed-giant-type__action {
  position: absolute;
  z-index: 2;
  left: 50%;
  bottom: clamp(2rem, 5vw, 3rem);
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.1rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 600;
  text-decoration: none;
}

.ofl-hero-full-bleed-giant-type__status {
  position: absolute;
  z-index: 2;
  top: clamp(1.25rem, 4vw, 2rem);
  right: clamp(1.25rem, 5vw, 3rem);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.6);
}

.ofl-hero-full-bleed-giant-type__status span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #34d399;
  box-shadow: 0 0 0 4px rgba(52, 211, 153, 0.25);
}

@media (max-width: 760px) {
  .ofl-hero-full-bleed-giant-type__kicker,
  .ofl-hero-full-bleed-giant-type__proof {
    position: static;
    text-align: left;
    max-width: none;
    margin: 1.5rem clamp(1.25rem, 5vw, 3rem) 0;
  }

  .ofl-hero-full-bleed-giant-type__status {
    position: static;
    justify-content: flex-end;
    margin: 1rem clamp(1.25rem, 5vw, 3rem) 0;
  }

  .ofl-hero-full-bleed-giant-type__action {
    position: static;
    transform: none;
    margin: 2rem auto;
    width: fit-content;
  }
}
`,
  },

  {
    schemaVersion: 1,
    id: "hero.minimal-editorial",
    name: "Minimal Editorial Hero with Work Index",
    category: "hero",
    description:
      "Text-only, generously spaced editorial hero with a centered serif headline, an understated arrow CTA, and a numbered index of selected work links beneath it.",
    tags: ["hero", "minimal", "editorial", "portfolio", "typography"],
    sourceProject: "portfolio",
    exportName: "MinimalEditorialHero",
    fileName: "MinimalEditorialHero.jsx",
    dependencies: [],
    defaultProps: {
      kicker: "Selected work, 2024–2026",
      heading: "I design and build interfaces that feel inevitable.",
      body: "A small, focused practice covering product design, front-end engineering, and the occasional illustration.",
      ctaLabel: "Get in touch",
      ctaHref: "#contact",
      workItems: [
        { label: "Commerce platform redesign", href: "#work-1" },
        { label: "Field operations dashboard", href: "#work-2" },
        { label: "Admissions guidance app", href: "#work-3" },
      ],
    },
    accessibility: [
      "Uses a single centered h1, a monochrome palette with high text contrast, and an ordered list (rather than styling alone) to convey the ranked work index.",
      "The CTA and every work-index link remain plain anchor elements, so they stay keyboard-focusable with a visible underline affordance.",
    ],
    source: `const defaultWorkItems = [
  { label: "Commerce platform redesign", href: "#work-1" },
  { label: "Field operations dashboard", href: "#work-2" },
  { label: "Admissions guidance app", href: "#work-3" },
];

export function MinimalEditorialHero({
  kicker = "Selected work, 2024\\u20132026",
  heading = "I design and build interfaces that feel inevitable.",
  body = "A small, focused practice covering product design, front-end engineering, and the occasional illustration.",
  ctaLabel = "Get in touch",
  ctaHref = "#contact",
  workItems = defaultWorkItems,
}) {
  return (
    <section className="ofl-hero-minimal-editorial">
      <div className="ofl-hero-minimal-editorial__inner">
        <p className="ofl-hero-minimal-editorial__kicker">{kicker}</p>
        <h1 className="ofl-hero-minimal-editorial__heading">{heading}</h1>
        <p className="ofl-hero-minimal-editorial__body">{body}</p>

        <a className="ofl-hero-minimal-editorial__cta" href={ctaHref}>
          {ctaLabel}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 12H19M19 12L13 6M19 12L13 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>

        <ol className="ofl-hero-minimal-editorial__work" aria-label="Selected work">
          {workItems.map((item, index) => (
            <li key={item.href}>
              <span className="ofl-hero-minimal-editorial__work-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
`,
    styles: `.ofl-hero-minimal-editorial {
  background: #fdfcfb;
  color: #1a1a1a;
  padding: clamp(4rem, 12vw, 8rem) clamp(1.25rem, 6vw, 3rem);
  font-family: Georgia, "Times New Roman", serif;
}

.ofl-hero-minimal-editorial__inner {
  max-width: 640px;
  margin: 0 auto;
  text-align: center;
}

.ofl-hero-minimal-editorial__kicker {
  margin: 0 0 1.5rem;
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: #6b6b6b;
}

.ofl-hero-minimal-editorial__heading {
  margin: 0 0 1.25rem;
  font-size: clamp(1.9rem, 4vw, 2.9rem);
  font-weight: 400;
  line-height: 1.3;
  letter-spacing: -0.01em;
}

.ofl-hero-minimal-editorial__body {
  margin: 0 auto 2rem;
  max-width: 46ch;
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  font-size: 1rem;
  line-height: 1.7;
  color: #4d4d4d;
}

.ofl-hero-minimal-editorial__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: #1a1a1a;
  text-decoration: underline;
  text-underline-offset: 4px;
  margin-bottom: 3.5rem;
}

.ofl-hero-minimal-editorial__work {
  list-style: none;
  margin: 0;
  padding: 1.75rem 0 0;
  border-top: 1px solid #e4e0da;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  text-align: left;
}

.ofl-hero-minimal-editorial__work li {
  display: flex;
  align-items: baseline;
  gap: 0.9rem;
}

.ofl-hero-minimal-editorial__work-index {
  font-size: 0.75rem;
  color: #a3a3a3;
  font-variant-numeric: tabular-nums;
}

.ofl-hero-minimal-editorial__work a {
  font-size: 0.95rem;
  color: #1a1a1a;
  text-decoration: none;
  border-bottom: 1px solid transparent;
}

.ofl-hero-minimal-editorial__work a:hover {
  border-bottom-color: #1a1a1a;
}
`,
  },
];
