// Grid, feature, stats, testimonial, pricing, and other supporting-section
// component variants harvested from reference projects. Each entry is a
// self-contained React component (react-only, inline SVG icons, scoped CSS)
// covering a distinct supporting-section pattern: icon feature grids,
// alternating feature rows, a bento showcase, animated stat counters, a
// horizontally-scrolling team rail, a testimonial carousel, a pricing table,
// a two-column FAQ accordion, a dark CTA banner, and a certification/logo
// cloud strip.
import { LIBRARY_SCHEMA_VERSION } from "./schema.js";

export const gridComponents = [
  {
    schemaVersion: LIBRARY_SCHEMA_VERSION,
    id: "grid.feature-icon-cards",
    name: "Feature Icon Cards",
    category: "grid",
    description:
      "Four-column 'why choose us' feature grid with an icon badge, title, and supporting copy inside bordered cards.",
    tags: ["features", "icon-grid", "why-choose-us", "benefits"],
    sourceProject: "archtech",
    exportName: "FeatureIconGrid",
    fileName: "FeatureIconGrid.jsx",
    dependencies: [],
    defaultProps: {
      eyebrow: "WHY CHOOSE US",
      heading: "Built like the teams you want to join",
      items: [
        {
          id: "lab",
          icon: "monitor",
          title: "Real tools, real files",
          description:
            "Every workspace runs licensed software against real project files, not textbook samples.",
        },
        {
          id: "mentors",
          icon: "users",
          title: "Practitioner mentors",
          description:
            "Sessions are led by people who ship this work for clients, not only teach it.",
        },
        {
          id: "proof",
          icon: "badge",
          title: "Proof, not just a certificate",
          description:
            "You leave with a reviewable deliverable an interviewer can actually open.",
        },
        {
          id: "placement",
          icon: "briefcase",
          title: "Placement support",
          description:
            "A partner hiring list, mock interviews, and an alumni network that refers.",
        },
      ],
    },
    accessibility: [
      "Features are marked up as a semantic ul/li list with role=\"list\" so assistive tech announces the total count.",
      "Icons are purely decorative and carry aria-hidden=\"true\"; each card's title and description already convey the full meaning.",
    ],
    source: `import React from "react";

const ICONS = {
  monitor: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <path d="M8 20h8M12 16v4" strokeLinecap="round" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round" />
      <circle cx="17" cy="9" r="2.4" />
      <path d="M15.5 14.2c2.6.4 4.5 2.5 4.5 5.3" strokeLinecap="round" />
    </svg>
  ),
  badge: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="10" r="7" />
      <path d="M9 10l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.5 16.5L7 21l5-2 5 2-1.5-4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  briefcase: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3" y="8" width="18" height="11" rx="1.5" />
      <path d="M8 8V6a2 2 0 012-2h4a2 2 0 012 2v2" />
      <path d="M3 13h18" />
    </svg>
  ),
};

const defaultItems = [
  { id: "lab", icon: "monitor", title: "Real tools, real files", description: "Every workspace runs licensed software against real project files, not textbook samples." },
  { id: "mentors", icon: "users", title: "Practitioner mentors", description: "Sessions are led by people who ship this work for clients, not only teach it." },
  { id: "proof", icon: "badge", title: "Proof, not just a certificate", description: "You leave with a reviewable deliverable an interviewer can actually open." },
  { id: "placement", icon: "briefcase", title: "Placement support", description: "A partner hiring list, mock interviews, and an alumni network that refers." },
];

export function FeatureIconGrid({
  eyebrow = "WHY CHOOSE US",
  heading = "Built like the teams you want to join",
  items = defaultItems,
}) {
  return (
    <section className="ofl-grid-feature-icon-cards" aria-labelledby="feature-icon-cards-heading">
      <div className="ofl-grid-feature-icon-cards__head">
        <p className="ofl-grid-feature-icon-cards__eyebrow">{eyebrow}</p>
        <h2 className="ofl-grid-feature-icon-cards__heading" id="feature-icon-cards-heading">{heading}</h2>
      </div>
      <ul className="ofl-grid-feature-icon-cards__list" role="list">
        {items.map((item) => (
          <li className="ofl-grid-feature-icon-cards__card" key={item.id}>
            <span className="ofl-grid-feature-icon-cards__icon" aria-hidden="true">{ICONS[item.icon] || ICONS.monitor}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
`,
    styles: `.ofl-grid-feature-icon-cards {
  padding: 4rem 1.5rem;
  background: #faf7f2;
  color: #241f18;
  font-family: -apple-system, "Segoe UI", sans-serif;
}
.ofl-grid-feature-icon-cards__head {
  max-width: 40rem;
  margin: 0 auto 2.5rem;
  text-align: center;
}
.ofl-grid-feature-icon-cards__eyebrow {
  margin: 0 0 0.5rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  color: #b5792a;
}
.ofl-grid-feature-icon-cards__heading {
  margin: 0;
  font-size: clamp(1.5rem, 2.4vw, 2.1rem);
  font-weight: 700;
  line-height: 1.2;
}
.ofl-grid-feature-icon-cards__list {
  list-style: none;
  margin: 0 auto;
  padding: 0;
  max-width: 72rem;
  display: grid;
  gap: 1.25rem;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}
@media (max-width: 900px) {
  .ofl-grid-feature-icon-cards__list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 520px) {
  .ofl-grid-feature-icon-cards__list {
    grid-template-columns: 1fr;
  }
}
.ofl-grid-feature-icon-cards__card {
  position: relative;
  padding: 1.5rem;
  border: 1px solid #e7dfd2;
  border-radius: 0.25rem;
  background: #fffdf9;
}
.ofl-grid-feature-icon-cards__card::before,
.ofl-grid-feature-icon-cards__card::after {
  content: "";
  position: absolute;
  width: 0.6rem;
  height: 0.6rem;
  border-top: 2px solid #b5792a;
  border-left: 2px solid #b5792a;
  top: -1px;
  left: -1px;
}
.ofl-grid-feature-icon-cards__card::after {
  top: auto;
  left: auto;
  bottom: -1px;
  right: -1px;
  border-top: none;
  border-left: none;
  border-bottom: 2px solid #b5792a;
  border-right: 2px solid #b5792a;
}
.ofl-grid-feature-icon-cards__icon {
  display: inline-flex;
  color: #b5792a;
  margin-bottom: 0.9rem;
}
.ofl-grid-feature-icon-cards__card h3 {
  margin: 0 0 0.4rem;
  font-size: 1rem;
  font-weight: 700;
}
.ofl-grid-feature-icon-cards__card p {
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.55;
  color: #5c5346;
}
`,
  },
  {
    schemaVersion: LIBRARY_SCHEMA_VERSION,
    id: "grid.feature-alternating-rows",
    name: "Feature Alternating Rows",
    category: "grid",
    description:
      "Full-width feature rows that alternate media left/right, pairing a placeholder media block with a heading and description for each capability.",
    tags: ["features", "alternating", "product", "marketing"],
    sourceProject: "FitGrips-Frontend",
    exportName: "FeatureAlternatingRows",
    fileName: "FeatureAlternatingRows.jsx",
    dependencies: [],
    defaultProps: {
      heading: "A closer look at what makes it different",
      items: [
        {
          id: "row-1",
          title: "Built for everyday training",
          description:
            "Grips are shaped from the wear patterns of real athletes, then reinforced for years of daily use.",
        },
        {
          id: "row-2",
          title: "Sized for a true fit",
          description:
            "Every batch is checked against a fit guide so the strap sits flat instead of sliding mid-set.",
        },
        {
          id: "row-3",
          title: "Branding that survives the wash",
          description:
            "Prints are heat-pressed into the fabric so a logo still looks new after a full season.",
        },
      ],
    },
    accessibility: [
      "Placeholder media blocks are marked aria-hidden so screen readers skip straight to the heading and description that carry the real content.",
      "Visual reversal of a row uses CSS order only; the underlying DOM keeps heading-before-media reading order for assistive tech and keyboard users.",
    ],
    source: `import React from "react";

const defaultItems = [
  { id: "row-1", title: "Built for everyday training", description: "Grips are shaped from the wear patterns of real athletes, then reinforced for years of daily use." },
  { id: "row-2", title: "Sized for a true fit", description: "Every batch is checked against a fit guide so the strap sits flat instead of sliding mid-set." },
  { id: "row-3", title: "Branding that survives the wash", description: "Prints are heat-pressed into the fabric so a logo still looks new after a full season." },
];

export function FeatureAlternatingRows({
  heading = "A closer look at what makes it different",
  items = defaultItems,
}) {
  return (
    <section className="ofl-grid-feature-alt-rows" aria-labelledby="feature-alt-rows-heading">
      <h2 className="ofl-grid-feature-alt-rows__heading" id="feature-alt-rows-heading">{heading}</h2>
      <div className="ofl-grid-feature-alt-rows__list">
        {items.map((item, index) => (
          <div
            className={
              index % 2 === 1
                ? "ofl-grid-feature-alt-rows__row ofl-grid-feature-alt-rows__row--reverse"
                : "ofl-grid-feature-alt-rows__row"
            }
            key={item.id}
          >
            <div className="ofl-grid-feature-alt-rows__media" aria-hidden="true">
              <span className="ofl-grid-feature-alt-rows__media-mark">{String(index + 1).padStart(2, "0")}</span>
            </div>
            <div className="ofl-grid-feature-alt-rows__copy">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
`,
    styles: `.ofl-grid-feature-alt-rows {
  padding: 4rem 1.5rem;
  background: #ffffff;
  color: #171717;
  font-family: -apple-system, "Segoe UI", sans-serif;
}
.ofl-grid-feature-alt-rows__heading {
  max-width: 48rem;
  margin: 0 auto 2.75rem;
  text-align: center;
  font-size: clamp(1.6rem, 2.6vw, 2.3rem);
  font-weight: 700;
  line-height: 1.2;
}
.ofl-grid-feature-alt-rows__list {
  max-width: 64rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}
.ofl-grid-feature-alt-rows__row {
  display: flex;
  align-items: center;
  gap: 2.5rem;
}
.ofl-grid-feature-alt-rows__row--reverse {
  flex-direction: row-reverse;
}
@media (max-width: 720px) {
  .ofl-grid-feature-alt-rows__row,
  .ofl-grid-feature-alt-rows__row--reverse {
    flex-direction: column;
    text-align: center;
  }
}
.ofl-grid-feature-alt-rows__media {
  flex: 0 0 40%;
  aspect-ratio: 4 / 3;
  border-radius: 1.5rem;
  background: linear-gradient(135deg, #ececec, #d9d9d9);
  display: flex;
  align-items: center;
  justify-content: center;
}
.ofl-grid-feature-alt-rows__media-mark {
  font-size: 3.5rem;
  font-weight: 800;
  color: #bdbdbd;
}
.ofl-grid-feature-alt-rows__copy {
  flex: 1;
}
.ofl-grid-feature-alt-rows__copy h3 {
  margin: 0 0 0.6rem;
  font-size: 1.4rem;
  font-weight: 700;
}
.ofl-grid-feature-alt-rows__copy p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.65;
  color: #545454;
  max-width: 32rem;
}
`,
  },
  {
    schemaVersion: LIBRARY_SCHEMA_VERSION,
    id: "grid.bento-showcase",
    name: "Bento Showcase",
    category: "grid",
    description:
      "Asymmetric bento grid mixing one large highlight tile with several small capability tiles, for a dashboard-flavored product overview.",
    tags: ["bento", "dashboard", "asymmetric-grid", "features"],
    sourceProject: "gmr",
    exportName: "BentoShowcase",
    fileName: "BentoShowcase.jsx",
    dependencies: [],
    defaultProps: {
      eyebrow: "PLATFORM",
      heading: "Everything the back office needs, in one board",
      tiles: [
        {
          id: "control",
          size: "large",
          tone: "dark",
          title: "One control center for every trip",
          description:
            "Trips, invoices, and driver pay stay in a single live board instead of five spreadsheets.",
        },
        {
          id: "uptime",
          size: "small",
          tone: "light",
          title: "99.9% uptime",
          description: "Built on infrastructure that keeps running through peak dispatch hours.",
        },
        {
          id: "reports",
          size: "small",
          tone: "light",
          title: "Reports in one click",
          description: "Financial and trip reports export as a finished PDF, ready to send.",
        },
        {
          id: "roles",
          size: "small",
          tone: "light",
          title: "Role-based access",
          description: "Managers, drivers, and accounts each see only what they need.",
        },
        {
          id: "support",
          size: "small",
          tone: "accent",
          title: "Real support",
          description: "A team that answers before your next trip leaves the yard.",
        },
      ],
    },
    accessibility: [
      "Tiles are wrapped in role=\"list\"/role=\"listitem\" so the varying visual sizes still read as one collection of the same length to assistive tech.",
      "Each tile's tone (dark, light, accent) is reinforced by its own heading and description text, so meaning never depends on color alone.",
    ],
    source: `import React from "react";

const defaultTiles = [
  { id: "control", size: "large", tone: "dark", title: "One control center for every trip", description: "Trips, invoices, and driver pay stay in a single live board instead of five spreadsheets." },
  { id: "uptime", size: "small", tone: "light", title: "99.9% uptime", description: "Built on infrastructure that keeps running through peak dispatch hours." },
  { id: "reports", size: "small", tone: "light", title: "Reports in one click", description: "Financial and trip reports export as a finished PDF, ready to send." },
  { id: "roles", size: "small", tone: "light", title: "Role-based access", description: "Managers, drivers, and accounts each see only what they need." },
  { id: "support", size: "small", tone: "accent", title: "Real support", description: "A team that answers before your next trip leaves the yard." },
];

export function BentoShowcase({
  eyebrow = "PLATFORM",
  heading = "Everything the back office needs, in one board",
  tiles = defaultTiles,
}) {
  return (
    <section className="ofl-grid-bento" aria-labelledby="bento-heading">
      <div className="ofl-grid-bento__head">
        <p className="ofl-grid-bento__eyebrow">{eyebrow}</p>
        <h2 className="ofl-grid-bento__heading" id="bento-heading">{heading}</h2>
      </div>
      <div className="ofl-grid-bento__grid" role="list">
        {tiles.map((tile) => (
          <article
            className={"ofl-grid-bento__tile ofl-grid-bento__tile--" + tile.size + " ofl-grid-bento__tile--" + tile.tone}
            role="listitem"
            key={tile.id}
          >
            <h3>{tile.title}</h3>
            <p>{tile.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
`,
    styles: `.ofl-grid-bento {
  padding: 4rem 1.5rem;
  background: #0b1220;
  color: #e7ecf5;
  font-family: -apple-system, "Segoe UI", sans-serif;
}
.ofl-grid-bento__head {
  max-width: 40rem;
  margin: 0 auto 2.5rem;
  text-align: center;
}
.ofl-grid-bento__eyebrow {
  margin: 0 0 0.5rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  color: #7dd3fc;
}
.ofl-grid-bento__heading {
  margin: 0;
  font-size: clamp(1.5rem, 2.4vw, 2.1rem);
  font-weight: 700;
}
.ofl-grid-bento__grid {
  max-width: 64rem;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-auto-rows: minmax(9rem, auto);
  gap: 1rem;
}
@media (max-width: 720px) {
  .ofl-grid-bento__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
.ofl-grid-bento__tile {
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
}
.ofl-grid-bento__tile--large {
  grid-column: span 2;
  grid-row: span 2;
}
@media (max-width: 720px) {
  .ofl-grid-bento__tile--large {
    grid-column: span 2;
    grid-row: span 1;
  }
}
.ofl-grid-bento__tile--dark {
  background: linear-gradient(155deg, #1b2740, #0f1626);
  border: 1px solid #29365a;
}
.ofl-grid-bento__tile--light {
  background: #131c30;
  border: 1px solid #23304d;
}
.ofl-grid-bento__tile--accent {
  background: linear-gradient(155deg, #2a2110, #191307);
  border: 1px solid #6b5220;
}
.ofl-grid-bento__tile h3 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
}
.ofl-grid-bento__tile--large h3 {
  font-size: 1.35rem;
}
.ofl-grid-bento__tile p {
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.55;
  color: #aab4c8;
}
`,
  },
  {
    schemaVersion: LIBRARY_SCHEMA_VERSION,
    id: "grid.stats-counters",
    name: "Stats Counters",
    category: "grid",
    description:
      "Dark gradient band of animated numeric counters, each paired with an inline icon and label, for headline metrics.",
    tags: ["stats", "metrics", "counters", "social-proof"],
    sourceProject: "allahrakhaandco",
    exportName: "StatsCounters",
    fileName: "StatsCounters.jsx",
    dependencies: [],
    defaultProps: {
      heading: "Numbers that back up the promise",
      stats: [
        { id: "countries", icon: "globe", value: 25, suffix: "+", label: "Countries served" },
        { id: "clients", icon: "building", value: 500, suffix: "+", label: "Clients outfitted" },
        { id: "years", icon: "star", value: 15, suffix: "+", label: "Years running" },
        { id: "units", icon: "package", value: 1, suffix: "M+", label: "Units shipped yearly" },
      ],
    },
    accessibility: [
      "The animating digits are aria-hidden; a visually-hidden span next to each counter exposes the final value and label immediately for screen reader users instead of a ticking count.",
      "Icons are decorative (aria-hidden) and never the sole carrier of meaning — every stat has a visible text label.",
    ],
    source: `import React, { useEffect, useRef, useState } from "react";

const ICONS = {
  globe: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.8 2.4 4.3 5.6 4.3 9s-1.5 6.6-4.3 9c-2.8-2.4-4.3-5.6-4.3-9S9.2 5.4 12 3z" />
    </svg>
  ),
  building: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="4" y="3" width="12" height="18" rx="1" />
      <path d="M16 21h4V9h-4M7.5 7h1M11.5 7h1M7.5 11h1M11.5 11h1M7.5 15h1M11.5 15h1" strokeLinecap="round" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
      <path d="M12 2.5l2.9 6 6.6.7-4.9 4.5 1.3 6.5L12 16.9 6.1 20.2l1.3-6.5-4.9-4.5 6.6-.7L12 2.5z" />
    </svg>
  ),
  package: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
      <path d="M4.5 7.5L12 12l7.5-4.5M12 12v9" />
    </svg>
  ),
};

const defaultStats = [
  { id: "countries", icon: "globe", value: 25, suffix: "+", label: "Countries served" },
  { id: "clients", icon: "building", value: 500, suffix: "+", label: "Clients outfitted" },
  { id: "years", icon: "star", value: 15, suffix: "+", label: "Years running" },
  { id: "units", icon: "package", value: 1, suffix: "M+", label: "Units shipped yearly" },
];

function Counter({ target, suffix, duration = 1400 }) {
  const [count, setCount] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return undefined;
    startedRef.current = true;
    const start = Date.now();
    let frame;
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return <span>{count}{suffix}</span>;
}

export function StatsCounters({
  heading = "Numbers that back up the promise",
  stats = defaultStats,
}) {
  return (
    <section className="ofl-grid-stats-counters" aria-labelledby="stats-counters-heading">
      <h2 className="ofl-grid-stats-counters__heading" id="stats-counters-heading">{heading}</h2>
      <ul className="ofl-grid-stats-counters__list" role="list">
        {stats.map((stat) => (
          <li className="ofl-grid-stats-counters__item" key={stat.id}>
            <span className="ofl-grid-stats-counters__icon" aria-hidden="true">{ICONS[stat.icon] || ICONS.star}</span>
            <p className="ofl-grid-stats-counters__value">
              <span aria-hidden="true"><Counter target={stat.value} suffix={stat.suffix} /></span>
              <span className="ofl-grid-stats-counters__sr-only">{stat.value}{stat.suffix} {stat.label}</span>
            </p>
            <p className="ofl-grid-stats-counters__label" aria-hidden="true">{stat.label}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
`,
    styles: `.ofl-grid-stats-counters {
  padding: 4rem 1.5rem;
  background: linear-gradient(120deg, #0c1930, #16264a);
  color: #ffffff;
  font-family: -apple-system, "Segoe UI", sans-serif;
  position: relative;
}
.ofl-grid-stats-counters::before,
.ofl-grid-stats-counters::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 100, 0.4), transparent);
}
.ofl-grid-stats-counters::before {
  top: 0;
}
.ofl-grid-stats-counters::after {
  bottom: 0;
}
.ofl-grid-stats-counters__heading {
  max-width: 40rem;
  margin: 0 auto 2.5rem;
  text-align: center;
  font-size: clamp(1.4rem, 2.2vw, 2rem);
  font-weight: 700;
}
.ofl-grid-stats-counters__list {
  list-style: none;
  margin: 0 auto;
  padding: 0;
  max-width: 60rem;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 2rem;
  text-align: center;
}
@media (max-width: 640px) {
  .ofl-grid-stats-counters__list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
.ofl-grid-stats-counters__icon {
  display: inline-flex;
  color: #d4af64;
  margin-bottom: 0.75rem;
}
.ofl-grid-stats-counters__value {
  margin: 0 0 0.4rem;
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  font-weight: 800;
}
.ofl-grid-stats-counters__label {
  margin: 0;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.6);
}
.ofl-grid-stats-counters__sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
`,
  },
  {
    schemaVersion: LIBRARY_SCHEMA_VERSION,
    id: "grid.team-rail",
    name: "Team Rail",
    category: "grid",
    description:
      "Horizontally scrolling rail of team/instructor cards with an initials avatar, role, short bio, and expertise tags.",
    tags: ["team", "staff", "instructors", "horizontal-scroll"],
    sourceProject: "archtech",
    exportName: "TeamRail",
    fileName: "TeamRail.jsx",
    dependencies: [],
    defaultProps: {
      eyebrow: "TEAM",
      heading: "Learn from people who do the work",
      members: [
        {
          id: "person-1",
          initials: "AM",
          name: "Amara Musa",
          title: "Lead Structural Engineer",
          bio: "Twelve years reviewing steel and concrete drawings before they reach a site crew.",
          tags: ["Structures", "Site Review"],
        },
        {
          id: "person-2",
          initials: "JK",
          name: "Jonah Kessler",
          title: "BIM Coordinator",
          bio: "Keeps architecture, MEP, and structural models clash-free before construction starts.",
          tags: ["BIM", "Coordination"],
        },
        {
          id: "person-3",
          initials: "RS",
          name: "Rhea Sato",
          title: "Electrical Design Lead",
          bio: "Designs power and lighting layouts that pass inspection on the first submission.",
          tags: ["Electrical", "Compliance"],
        },
        {
          id: "person-4",
          initials: "TD",
          name: "Tomas Duval",
          title: "Visualization Artist",
          bio: "Turns approved drawings into renders a client can actually picture living in.",
          tags: ["Rendering", "3D"],
        },
      ],
    },
    accessibility: [
      "Avatars show initials and are aria-hidden since the adjacent name text already identifies each person.",
      "The rail keeps native ul/li list semantics under horizontal scroll, so assistive tech still reports the item count and order correctly.",
    ],
    source: `import React from "react";

const defaultMembers = [
  { id: "person-1", initials: "AM", name: "Amara Musa", title: "Lead Structural Engineer", bio: "Twelve years reviewing steel and concrete drawings before they reach a site crew.", tags: ["Structures", "Site Review"] },
  { id: "person-2", initials: "JK", name: "Jonah Kessler", title: "BIM Coordinator", bio: "Keeps architecture, MEP, and structural models clash-free before construction starts.", tags: ["BIM", "Coordination"] },
  { id: "person-3", initials: "RS", name: "Rhea Sato", title: "Electrical Design Lead", bio: "Designs power and lighting layouts that pass inspection on the first submission.", tags: ["Electrical", "Compliance"] },
  { id: "person-4", initials: "TD", name: "Tomas Duval", title: "Visualization Artist", bio: "Turns approved drawings into renders a client can actually picture living in.", tags: ["Rendering", "3D"] },
];

export function TeamRail({
  eyebrow = "TEAM",
  heading = "Learn from people who do the work",
  members = defaultMembers,
}) {
  return (
    <section className="ofl-grid-team-rail" aria-labelledby="team-rail-heading">
      <div className="ofl-grid-team-rail__head">
        <p className="ofl-grid-team-rail__eyebrow">{eyebrow}</p>
        <h2 className="ofl-grid-team-rail__heading" id="team-rail-heading">{heading}</h2>
      </div>
      <ul className="ofl-grid-team-rail__list" role="list">
        {members.map((person) => (
          <li className="ofl-grid-team-rail__card" key={person.id}>
            <span className="ofl-grid-team-rail__avatar" aria-hidden="true">{person.initials}</span>
            <h3>{person.name}</h3>
            <p className="ofl-grid-team-rail__title">{person.title}</p>
            <p className="ofl-grid-team-rail__bio">{person.bio}</p>
            <ul className="ofl-grid-team-rail__tags" role="list">
              {person.tags.map((tag) => (
                <li className="ofl-grid-team-rail__tag" key={tag}>{tag}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}
`,
    styles: `.ofl-grid-team-rail {
  padding: 4rem 0;
  background: #fbf9f5;
  color: #201b12;
  font-family: -apple-system, "Segoe UI", sans-serif;
}
.ofl-grid-team-rail__head {
  max-width: 40rem;
  margin: 0 auto 2.25rem;
  padding: 0 1.5rem;
  text-align: center;
}
.ofl-grid-team-rail__eyebrow {
  margin: 0 0 0.5rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  color: #a9762c;
}
.ofl-grid-team-rail__heading {
  margin: 0;
  font-size: clamp(1.4rem, 2.2vw, 2rem);
  font-weight: 700;
}
.ofl-grid-team-rail__list {
  list-style: none;
  margin: 0;
  padding: 0 1.5rem 0.5rem;
  display: flex;
  gap: 1.25rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}
.ofl-grid-team-rail__card {
  scroll-snap-align: start;
  flex: 0 0 17rem;
  border: 1px solid #e7dfd0;
  border-radius: 1rem;
  padding: 1.5rem;
  background: #ffffff;
}
.ofl-grid-team-rail__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 999px;
  background: #201b12;
  color: #e9b949;
  font-weight: 700;
  margin-bottom: 0.9rem;
}
.ofl-grid-team-rail__card h3 {
  margin: 0 0 0.15rem;
  font-size: 1.05rem;
  font-weight: 700;
}
.ofl-grid-team-rail__title {
  margin: 0 0 0.75rem;
  font-size: 0.78rem;
  color: #8a7a5c;
}
.ofl-grid-team-rail__bio {
  margin: 0 0 1rem;
  font-size: 0.85rem;
  line-height: 1.55;
  color: #4c4433;
}
.ofl-grid-team-rail__tags {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
.ofl-grid-team-rail__tag {
  font-size: 0.68rem;
  border: 1px solid #e2d7bf;
  border-radius: 999px;
  padding: 0.2rem 0.6rem;
  color: #6a5c3f;
}
`,
  },
  {
    schemaVersion: LIBRARY_SCHEMA_VERSION,
    id: "grid.testimonial-carousel",
    name: "Testimonial Carousel",
    category: "grid",
    description:
      "Single-quote testimonial carousel with previous/next controls, a star rating, initials avatar, and dot navigation.",
    tags: ["testimonials", "carousel", "reviews", "social-proof"],
    sourceProject: "FitGrips-Frontend",
    exportName: "TestimonialCarousel",
    fileName: "TestimonialCarousel.jsx",
    dependencies: [],
    defaultProps: {
      heading: "What customers are saying",
      testimonials: [
        { id: "t1", name: "Priya N.", role: "Gym owner", rating: 5, quote: "Our members stopped complaining about slipping grips within the first shipment." },
        { id: "t2", name: "Marcus O.", role: "Team captain", rating: 5, quote: "Branding held up through an entire season of daily washes." },
        { id: "t3", name: "Elena R.", role: "Studio manager", rating: 4, quote: "Sizing guide was spot on, exchanges were almost zero." },
      ],
    },
    accessibility: [
      "Uses blockquote and cite semantics for the active quote and its attribution.",
      "The visible card is an aria-live=\"polite\" region and both arrow buttons carry explicit aria-labels naming their action, so the slide change is announced without relying on icon shape alone.",
    ],
    source: `import React, { useState } from "react";

const defaultTestimonials = [
  { id: "t1", name: "Priya N.", role: "Gym owner", rating: 5, quote: "Our members stopped complaining about slipping grips within the first shipment." },
  { id: "t2", name: "Marcus O.", role: "Team captain", rating: 5, quote: "Branding held up through an entire season of daily washes." },
  { id: "t3", name: "Elena R.", role: "Studio manager", rating: 4, quote: "Sizing guide was spot on, exchanges were almost zero." },
];

function Stars({ rating }) {
  return (
    <span className="ofl-grid-testimonial-carousel__stars" aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index} className={index < rating ? "is-filled" : ""}>&#9733;</span>
      ))}
    </span>
  );
}

export function TestimonialCarousel({
  heading = "What customers are saying",
  testimonials = defaultTestimonials,
}) {
  const [index, setIndex] = useState(0);
  const total = testimonials.length;
  const current = testimonials[index] || testimonials[0];

  const goPrev = () => setIndex((prev) => (prev - 1 + total) % total);
  const goNext = () => setIndex((prev) => (prev + 1) % total);

  return (
    <section className="ofl-grid-testimonial-carousel" aria-labelledby="testimonial-carousel-heading">
      <h2 className="ofl-grid-testimonial-carousel__heading" id="testimonial-carousel-heading">{heading}</h2>
      <div className="ofl-grid-testimonial-carousel__viewport">
        <button type="button" className="ofl-grid-testimonial-carousel__nav" onClick={goPrev} aria-label="Show previous testimonial">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <figure className="ofl-grid-testimonial-carousel__card" aria-live="polite">
          <span className="ofl-grid-testimonial-carousel__avatar" aria-hidden="true">{current.name.charAt(0)}</span>
          <Stars rating={current.rating} />
          <blockquote className="ofl-grid-testimonial-carousel__quote">&#8220;{current.quote}&#8221;</blockquote>
          <figcaption>
            <strong>{current.name}</strong>
            <cite> &mdash; {current.role}</cite>
          </figcaption>
        </figure>
        <button type="button" className="ofl-grid-testimonial-carousel__nav" onClick={goNext} aria-label="Show next testimonial">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      <div className="ofl-grid-testimonial-carousel__dots" role="tablist" aria-label="Testimonial navigation">
        {testimonials.map((item, dotIndex) => (
          <button
            type="button"
            key={item.id}
            role="tab"
            aria-selected={dotIndex === index}
            aria-label={"Show testimonial from " + item.name}
            className={dotIndex === index ? "is-active" : ""}
            onClick={() => setIndex(dotIndex)}
          />
        ))}
      </div>
    </section>
  );
}
`,
    styles: `.ofl-grid-testimonial-carousel {
  padding: 4rem 1.5rem;
  background: #f6f5f2;
  color: #1e1e1e;
  font-family: -apple-system, "Segoe UI", sans-serif;
  text-align: center;
}
.ofl-grid-testimonial-carousel__heading {
  margin: 0 0 2.25rem;
  font-size: clamp(1.4rem, 2.2vw, 2rem);
  font-weight: 700;
}
.ofl-grid-testimonial-carousel__viewport {
  max-width: 34rem;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 1rem;
}
.ofl-grid-testimonial-carousel__nav {
  flex: 0 0 auto;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 999px;
  border: 1px solid #d8d5cc;
  background: #ffffff;
  color: #1e1e1e;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.ofl-grid-testimonial-carousel__card {
  flex: 1;
  margin: 0;
  padding: 2rem 1.5rem;
  border-radius: 1.5rem;
  background: #ffffff;
  border: 1px solid #e7e4da;
}
.ofl-grid-testimonial-carousel__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 999px;
  background: #1e1e1e;
  color: #ffffff;
  font-weight: 700;
  margin-bottom: 0.75rem;
}
.ofl-grid-testimonial-carousel__stars {
  display: block;
  color: #d9d4c6;
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
}
.ofl-grid-testimonial-carousel__stars .is-filled {
  color: #eab308;
}
.ofl-grid-testimonial-carousel__quote {
  margin: 0 0 1rem;
  font-size: 1.05rem;
  line-height: 1.6;
}
.ofl-grid-testimonial-carousel__card figcaption {
  font-size: 0.85rem;
  color: #6b6b6b;
}
.ofl-grid-testimonial-carousel__dots {
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}
.ofl-grid-testimonial-carousel__dots button {
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 999px;
  border: none;
  background: #d8d5cc;
  cursor: pointer;
  padding: 0;
}
.ofl-grid-testimonial-carousel__dots button.is-active {
  background: #1e1e1e;
  width: 1.4rem;
  border-radius: 999px;
}
`,
  },
  {
    schemaVersion: LIBRARY_SCHEMA_VERSION,
    id: "grid.pricing-tiers",
    name: "Pricing Tiers",
    category: "grid",
    description:
      "Three-column pricing table with a highlighted middle plan, feature checklists, and per-plan call-to-action links.",
    tags: ["pricing", "plans", "tiers", "conversion"],
    sourceProject: "archtech",
    exportName: "PricingTiers",
    fileName: "PricingTiers.jsx",
    dependencies: [],
    defaultProps: {
      heading: "Plans that grow with your team",
      plans: [
        {
          id: "starter",
          name: "Starter",
          price: "$29",
          period: "/mo",
          description: "For a single site getting off the ground.",
          features: ["1 workspace", "Core component library", "Community support"],
          highlighted: false,
          actionLabel: "Choose Starter",
        },
        {
          id: "studio",
          name: "Studio",
          price: "$79",
          period: "/mo",
          description: "For small teams shipping client work.",
          features: ["Unlimited workspaces", "Shared component libraries", "Priority support", "Version history"],
          highlighted: true,
          actionLabel: "Choose Studio",
        },
        {
          id: "scale",
          name: "Scale",
          price: "Custom",
          period: "",
          description: "For organizations with compliance needs.",
          features: ["SSO and audit logs", "Dedicated success manager", "Custom contracts"],
          highlighted: false,
          actionLabel: "Contact sales",
        },
      ],
    },
    accessibility: [
      "Every plan action link's accessible label includes the plan name, so the links remain distinguishable when a screen reader lists them out of context.",
      "The highlighted plan is marked with a visible 'Most popular' text badge rather than color alone.",
    ],
    source: `import React from "react";

const defaultPlans = [
  { id: "starter", name: "Starter", price: "$29", period: "/mo", description: "For a single site getting off the ground.", features: ["1 workspace", "Core component library", "Community support"], highlighted: false, actionLabel: "Choose Starter" },
  { id: "studio", name: "Studio", price: "$79", period: "/mo", description: "For small teams shipping client work.", features: ["Unlimited workspaces", "Shared component libraries", "Priority support", "Version history"], highlighted: true, actionLabel: "Choose Studio" },
  { id: "scale", name: "Scale", price: "Custom", period: "", description: "For organizations with compliance needs.", features: ["SSO and audit logs", "Dedicated success manager", "Custom contracts"], highlighted: false, actionLabel: "Contact sales" },
];

export function PricingTiers({
  heading = "Plans that grow with your team",
  plans = defaultPlans,
}) {
  return (
    <section className="ofl-grid-pricing-tiers" aria-labelledby="pricing-tiers-heading">
      <h2 className="ofl-grid-pricing-tiers__heading" id="pricing-tiers-heading">{heading}</h2>
      <div className="ofl-grid-pricing-tiers__list">
        {plans.map((plan) => (
          <article
            className={plan.highlighted ? "ofl-grid-pricing-tiers__card is-highlighted" : "ofl-grid-pricing-tiers__card"}
            key={plan.id}
          >
            {plan.highlighted ? <span className="ofl-grid-pricing-tiers__badge">Most popular</span> : null}
            <h3>{plan.name}</h3>
            <p className="ofl-grid-pricing-tiers__price">
              <span className="ofl-grid-pricing-tiers__price-value">{plan.price}</span>
              <span className="ofl-grid-pricing-tiers__price-period">{plan.period}</span>
            </p>
            <p className="ofl-grid-pricing-tiers__description">{plan.description}</p>
            <ul className="ofl-grid-pricing-tiers__features" role="list">
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <a
              className="ofl-grid-pricing-tiers__cta"
              href="#contact"
              aria-label={plan.actionLabel + ", " + plan.name + " plan"}
            >
              {plan.actionLabel}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
`,
    styles: `.ofl-grid-pricing-tiers {
  padding: 4rem 1.5rem;
  background: #f8f8fb;
  color: #16161c;
  font-family: -apple-system, "Segoe UI", sans-serif;
}
.ofl-grid-pricing-tiers__heading {
  max-width: 40rem;
  margin: 0 auto 2.5rem;
  text-align: center;
  font-size: clamp(1.5rem, 2.4vw, 2.1rem);
  font-weight: 700;
}
.ofl-grid-pricing-tiers__list {
  max-width: 64rem;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;
  align-items: start;
}
@media (max-width: 800px) {
  .ofl-grid-pricing-tiers__list {
    grid-template-columns: 1fr;
  }
}
.ofl-grid-pricing-tiers__card {
  position: relative;
  border: 1px solid #e2e2ea;
  border-radius: 1rem;
  padding: 2rem 1.75rem;
  background: #ffffff;
}
.ofl-grid-pricing-tiers__card.is-highlighted {
  border-color: #6d5ef1;
  box-shadow: 0 20px 40px -20px rgba(109, 94, 241, 0.45);
  transform: translateY(-0.5rem);
}
@media (max-width: 800px) {
  .ofl-grid-pricing-tiers__card.is-highlighted {
    transform: none;
  }
}
.ofl-grid-pricing-tiers__badge {
  position: absolute;
  top: -0.7rem;
  left: 1.75rem;
  background: #6d5ef1;
  color: #ffffff;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 0.25rem 0.7rem;
  border-radius: 999px;
}
.ofl-grid-pricing-tiers__card h3 {
  margin: 0 0 0.75rem;
  font-size: 1.1rem;
  font-weight: 700;
}
.ofl-grid-pricing-tiers__price {
  margin: 0 0 0.5rem;
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
}
.ofl-grid-pricing-tiers__price-value {
  font-size: 2.1rem;
  font-weight: 800;
}
.ofl-grid-pricing-tiers__price-period {
  font-size: 0.85rem;
  color: #6b6b76;
}
.ofl-grid-pricing-tiers__description {
  margin: 0 0 1.25rem;
  font-size: 0.85rem;
  color: #595964;
}
.ofl-grid-pricing-tiers__features {
  list-style: none;
  margin: 0 0 1.5rem;
  padding: 1rem 0 0;
  border-top: 1px solid #ececf2;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  font-size: 0.85rem;
}
.ofl-grid-pricing-tiers__features li::before {
  content: "\\2713";
  margin-right: 0.5rem;
  color: #6d5ef1;
  font-weight: 700;
}
.ofl-grid-pricing-tiers__cta {
  display: block;
  text-align: center;
  padding: 0.75rem 1rem;
  border-radius: 0.6rem;
  background: #16161c;
  color: #ffffff;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
}
.ofl-grid-pricing-tiers__card.is-highlighted .ofl-grid-pricing-tiers__cta {
  background: #6d5ef1;
}
`,
  },
  {
    schemaVersion: LIBRARY_SCHEMA_VERSION,
    id: "grid.faq-two-column",
    name: "FAQ Two Column",
    category: "grid",
    description:
      "Two-column FAQ section pairing an intro with a support call-to-action on the left and a native disclosure accordion on the right.",
    tags: ["faq", "accordion", "support", "questions"],
    sourceProject: "FitGrips-Frontend",
    exportName: "FaqTwoColumn",
    fileName: "FaqTwoColumn.jsx",
    dependencies: [],
    defaultProps: {
      heading: "Questions, answered clearly",
      content:
        "Can't find what you're looking for? Reach out and a real person will get back to you within a business day.",
      actionLabel: "Contact support",
      actionHref: "#contact",
      faqs: [
        { id: "f1", question: "Can I change the content later?", answer: "Yes. Every field stays editable and the generated source remains yours to modify." },
        { id: "f2", question: "Do you offer bulk pricing?", answer: "Yes, bulk and reseller pricing kicks in automatically past a set order quantity." },
        { id: "f3", question: "What is the typical turnaround?", answer: "Most orders ship within 5 to 7 business days after artwork approval." },
        { id: "f4", question: "Can I request a custom size?", answer: "Yes, send your measurements and we will confirm fit before production starts." },
      ],
    },
    accessibility: [
      "Uses native details/summary elements so every question is keyboard-operable, has built-in expanded/collapsed semantics, and works even without JavaScript.",
      "The plus icon inside each summary is decorative (aria-hidden); the browser's native disclosure state communicates open/closed to assistive tech.",
    ],
    source: `import React from "react";

const defaultFaqs = [
  { id: "f1", question: "Can I change the content later?", answer: "Yes. Every field stays editable and the generated source remains yours to modify." },
  { id: "f2", question: "Do you offer bulk pricing?", answer: "Yes, bulk and reseller pricing kicks in automatically past a set order quantity." },
  { id: "f3", question: "What is the typical turnaround?", answer: "Most orders ship within 5 to 7 business days after artwork approval." },
  { id: "f4", question: "Can I request a custom size?", answer: "Yes, send your measurements and we will confirm fit before production starts." },
];

export function FaqTwoColumn({
  heading = "Questions, answered clearly",
  content = "Can't find what you're looking for? Reach out and a real person will get back to you within a business day.",
  actionLabel = "Contact support",
  actionHref = "#contact",
  faqs = defaultFaqs,
}) {
  return (
    <section className="ofl-grid-faq-two-column" aria-labelledby="faq-two-column-heading">
      <div className="ofl-grid-faq-two-column__intro">
        <h2 id="faq-two-column-heading">{heading}</h2>
        <p>{content}</p>
        <a className="ofl-grid-faq-two-column__cta" href={actionHref}>{actionLabel}</a>
      </div>
      <div className="ofl-grid-faq-two-column__list">
        {faqs.map((faq) => (
          <details className="ofl-grid-faq-two-column__item" key={faq.id}>
            <summary>
              <span>{faq.question}</span>
              <span className="ofl-grid-faq-two-column__icon" aria-hidden="true">+</span>
            </summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
`,
    styles: `.ofl-grid-faq-two-column {
  padding: 4rem 1.5rem;
  background: #ffffff;
  color: #191919;
  font-family: -apple-system, "Segoe UI", sans-serif;
}
.ofl-grid-faq-two-column {
  max-width: 68rem;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
  gap: 3rem;
}
@media (max-width: 760px) {
  .ofl-grid-faq-two-column {
    grid-template-columns: 1fr;
  }
}
.ofl-grid-faq-two-column__intro h2 {
  margin: 0 0 1rem;
  font-size: clamp(1.4rem, 2.2vw, 1.9rem);
  font-weight: 700;
}
.ofl-grid-faq-two-column__intro p {
  margin: 0 0 1.5rem;
  font-size: 0.9rem;
  line-height: 1.6;
  color: #5b5b5b;
  max-width: 26rem;
}
.ofl-grid-faq-two-column__cta {
  display: inline-block;
  padding: 0.7rem 1.4rem;
  border-radius: 999px;
  background: #191919;
  color: #ffffff;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
}
.ofl-grid-faq-two-column__list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.ofl-grid-faq-two-column__item {
  background: #f4f3f0;
  border-radius: 1.25rem;
  padding: 1rem 1.25rem;
}
.ofl-grid-faq-two-column__item summary {
  list-style: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  font-weight: 600;
  font-size: 0.95rem;
}
.ofl-grid-faq-two-column__item summary::-webkit-details-marker {
  display: none;
}
.ofl-grid-faq-two-column__icon {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 999px;
  background: #191919;
  color: #ffffff;
  transition: transform 0.2s ease;
}
.ofl-grid-faq-two-column__item[open] .ofl-grid-faq-two-column__icon {
  transform: rotate(45deg);
}
.ofl-grid-faq-two-column__item p {
  margin: 0.75rem 0 0;
  padding-top: 0.75rem;
  border-top: 1px solid #e3e1da;
  font-size: 0.85rem;
  line-height: 1.6;
  color: #4c4c4c;
}
`,
  },
  {
    schemaVersion: LIBRARY_SCHEMA_VERSION,
    id: "grid.cta-banner-dark",
    name: "CTA Banner Dark",
    category: "grid",
    description:
      "Dark gradient closing call-to-action banner with soft decorative glows, a primary and secondary button, and a reassurance footnote.",
    tags: ["cta", "conversion", "dark", "banner"],
    sourceProject: "allahrakhaandco",
    exportName: "CtaBannerDark",
    fileName: "CtaBannerDark.jsx",
    dependencies: [],
    defaultProps: {
      eyebrow: "Ready to get started?",
      heading: "Ready to bring your next project to life?",
      body: "From first inquiry to final delivery, our team manages every detail. Start today and get a full proposal within 48 hours.",
      primaryLabel: "Start a project",
      primaryHref: "#contact",
      secondaryLabel: "View our work",
      secondaryHref: "#work",
      footnote: "No commitment required - response within 48 hours",
    },
    accessibility: [
      "Body and heading text keep a high-contrast white-on-dark treatment so copy stays readable against the gradient background.",
      "The decorative glow shapes are aria-hidden so they are never announced as content by assistive tech.",
    ],
    source: `import React from "react";

export function CtaBannerDark({
  eyebrow = "Ready to get started?",
  heading = "Ready to bring your next project to life?",
  body = "From first inquiry to final delivery, our team manages every detail. Start today and get a full proposal within 48 hours.",
  primaryLabel = "Start a project",
  primaryHref = "#contact",
  secondaryLabel = "View our work",
  secondaryHref = "#work",
  footnote = "No commitment required - response within 48 hours",
}) {
  return (
    <section className="ofl-grid-cta-banner-dark" aria-labelledby="cta-banner-dark-heading">
      <div className="ofl-grid-cta-banner-dark__glow ofl-grid-cta-banner-dark__glow--one" aria-hidden="true" />
      <div className="ofl-grid-cta-banner-dark__glow ofl-grid-cta-banner-dark__glow--two" aria-hidden="true" />
      <div className="ofl-grid-cta-banner-dark__content">
        <p className="ofl-grid-cta-banner-dark__eyebrow">{eyebrow}</p>
        <h2 id="cta-banner-dark-heading">{heading}</h2>
        <p className="ofl-grid-cta-banner-dark__body">{body}</p>
        <div className="ofl-grid-cta-banner-dark__actions">
          <a className="ofl-grid-cta-banner-dark__primary" href={primaryHref}>{primaryLabel}</a>
          <a className="ofl-grid-cta-banner-dark__secondary" href={secondaryHref}>{secondaryLabel}</a>
        </div>
        <p className="ofl-grid-cta-banner-dark__footnote">{footnote}</p>
      </div>
    </section>
  );
}
`,
    styles: `.ofl-grid-cta-banner-dark {
  position: relative;
  overflow: hidden;
  padding: 5rem 1.5rem;
  background: linear-gradient(160deg, #0d1830, #182a4d);
  color: #ffffff;
  font-family: -apple-system, "Segoe UI", sans-serif;
  text-align: center;
}
.ofl-grid-cta-banner-dark__glow {
  position: absolute;
  border-radius: 999px;
  filter: blur(70px);
  pointer-events: none;
}
.ofl-grid-cta-banner-dark__glow--one {
  width: 16rem;
  height: 16rem;
  top: -4rem;
  right: -2rem;
  background: rgba(212, 175, 100, 0.18);
}
.ofl-grid-cta-banner-dark__glow--two {
  width: 22rem;
  height: 22rem;
  bottom: -6rem;
  left: -4rem;
  background: rgba(255, 255, 255, 0.05);
}
.ofl-grid-cta-banner-dark__content {
  position: relative;
  max-width: 40rem;
  margin: 0 auto;
}
.ofl-grid-cta-banner-dark__eyebrow {
  margin: 0 0 0.9rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #d4af64;
}
.ofl-grid-cta-banner-dark__content h2 {
  margin: 0 0 1rem;
  font-size: clamp(1.7rem, 3vw, 2.4rem);
  font-weight: 700;
  line-height: 1.2;
}
.ofl-grid-cta-banner-dark__body {
  margin: 0 auto 2rem;
  max-width: 32rem;
  font-size: 0.95rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
}
.ofl-grid-cta-banner-dark__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.9rem;
  justify-content: center;
  margin-bottom: 1.75rem;
}
.ofl-grid-cta-banner-dark__primary,
.ofl-grid-cta-banner-dark__secondary {
  padding: 0.8rem 1.6rem;
  border-radius: 999px;
  font-size: 0.88rem;
  font-weight: 700;
  text-decoration: none;
}
.ofl-grid-cta-banner-dark__primary {
  background: #d4af64;
  color: #16223c;
}
.ofl-grid-cta-banner-dark__secondary {
  background: transparent;
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.35);
}
.ofl-grid-cta-banner-dark__footnote {
  margin: 0;
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.4);
}
`,
  },
  {
    schemaVersion: LIBRARY_SCHEMA_VERSION,
    id: "grid.logo-cloud-trust",
    name: "Logo Cloud Trust",
    category: "grid",
    description:
      "Trust strip pairing a row of certification badges with a wrapping cloud of text-based partner/customer names.",
    tags: ["logo-cloud", "trust", "certifications", "social-proof"],
    sourceProject: "allahrakhaandco",
    exportName: "LogoCloudTrust",
    fileName: "LogoCloudTrust.jsx",
    dependencies: [],
    defaultProps: {
      heading: "Certified, and trusted by teams worldwide",
      badges: [
        { id: "iso", label: "ISO 9001:2015" },
        { id: "brc", label: "BRC Certified" },
        { id: "fair", label: "Fair Trade Verified" },
      ],
      logos: ["Northwind", "Vertex Group", "Arclight", "Merit Co", "Solace", "Kestrel"],
    },
    accessibility: [
      "Certification badges and partner names are rendered as plain text, so nothing here depends on image alt text or ever fails to load.",
      "The partner-name list carries an explicit aria-label describing its purpose, since its section heading sits visually above an unrelated badge row.",
    ],
    source: `import React from "react";

const defaultBadges = [
  { id: "iso", label: "ISO 9001:2015" },
  { id: "brc", label: "BRC Certified" },
  { id: "fair", label: "Fair Trade Verified" },
];

const defaultLogos = ["Northwind", "Vertex Group", "Arclight", "Merit Co", "Solace", "Kestrel"];

export function LogoCloudTrust({
  heading = "Certified, and trusted by teams worldwide",
  badges = defaultBadges,
  logos = defaultLogos,
}) {
  return (
    <section className="ofl-grid-logo-cloud-trust" aria-labelledby="logo-cloud-trust-heading">
      <h2 className="ofl-grid-logo-cloud-trust__heading" id="logo-cloud-trust-heading">{heading}</h2>
      <ul className="ofl-grid-logo-cloud-trust__badges" role="list">
        {badges.map((badge) => (
          <li className="ofl-grid-logo-cloud-trust__badge" key={badge.id}>
            <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor" aria-hidden="true">
              <path d="M10 2l2.2 1.6 2.7-.3 1 2.5 2.3 1.4-.9 2.6.9 2.6-2.3 1.4-1 2.5-2.7-.3L10 18l-2.2-1.6-2.7.3-1-2.5-2.3-1.4.9-2.6-.9-2.6 2.3-1.4 1-2.5 2.7.3L10 2z" />
            </svg>
            <span>{badge.label}</span>
          </li>
        ))}
      </ul>
      <div className="ofl-grid-logo-cloud-trust__divider" role="presentation" />
      <ul className="ofl-grid-logo-cloud-trust__logos" role="list" aria-label="Partner and customer names">
        {logos.map((logo) => (
          <li className="ofl-grid-logo-cloud-trust__logo" key={logo}>{logo}</li>
        ))}
      </ul>
    </section>
  );
}
`,
    styles: `.ofl-grid-logo-cloud-trust {
  padding: 3.5rem 1.5rem;
  background: #fafaf8;
  color: #26261f;
  font-family: -apple-system, "Segoe UI", sans-serif;
  text-align: center;
}
.ofl-grid-logo-cloud-trust__heading {
  margin: 0 0 1.5rem;
  font-size: 1.1rem;
  font-weight: 700;
}
.ofl-grid-logo-cloud-trust__badges {
  list-style: none;
  margin: 0 auto 2rem;
  padding: 0;
  max-width: 40rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
}
.ofl-grid-logo-cloud-trust__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border: 1px solid #ddd6c4;
  background: #fbf6e9;
  color: #a9762c;
  border-radius: 999px;
  padding: 0.4rem 0.9rem;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.ofl-grid-logo-cloud-trust__divider {
  max-width: 12rem;
  height: 1px;
  margin: 0 auto 2rem;
  background: #e3e1d8;
}
.ofl-grid-logo-cloud-trust__logos {
  list-style: none;
  margin: 0 auto;
  padding: 0;
  max-width: 48rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}
.ofl-grid-logo-cloud-trust__logo {
  padding: 0.9rem 1.6rem;
  border-radius: 0.6rem;
  border: 1px solid #e6e4da;
  background: #ffffff;
  color: #5c5747;
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: 0.02em;
}
`,
  },
];
