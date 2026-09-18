/**
 * A complete example marketing site for the Photography theme, expressed as
 * real content trees (`{ blockId, blockVersion, props, slots }`) built from
 * the official CMS block set. Every block instance below supplies each of
 * its block's required editable fields, so the whole site parses, validates,
 * and renders without a single missing prop.
 *
 * The fictional subject is "Halden Studio", the editorial and portrait
 * photography practice of Odette Halden, working out of a converted print
 * works in Copenhagen.
 */

const INK = "#050505";
const PAPER = "#f5f3ee";
const ACCENT = "#cbb896";
const SANS = "Helvetica, Arial, sans-serif";

/**
 * @param {string} value
 */
function escapeXml(value) {
  return String(value)
    .replace(/&/gu, "&amp;")
    .replace(/</gu, "&lt;")
    .replace(/>/gu, "&gt;")
    .replace(/"/gu, "&quot;");
}

/**
 * @param {string} svg
 */
function svgDataUri(svg) {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/**
 * A large near-black "photograph" placeholder with a hairline frame and a
 * small-caps caption, standing in for a real photo with no external asset
 * dependency, so the example site renders identically offline.
 *
 * @param {{ label: string, width?: number, height?: number }} options
 */
function frame({ label, width = 1600, height = 1000 }) {
  const text = escapeXml(label);
  const inset = Math.round(width * 0.035);
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${text}">`,
    `<rect width="${width}" height="${height}" fill="${INK}"/>`,
    `<rect x="${inset}" y="${inset}" width="${width - inset * 2}" height="${height - inset * 2}" fill="none" stroke="${ACCENT}" stroke-width="1"/>`,
    `<text x="50%" y="94%" fill="${ACCENT}" font-family="${SANS}" font-size="${Math.round(height / 28)}" letter-spacing="3" text-anchor="middle">${text.toUpperCase()}</text>`,
    `</svg>`,
  ].join("");
  return svgDataUri(svg);
}

/**
 * A square portrait placeholder for a team member or client: a warm accent
 * disc with initials, set on the studio's near-black ground.
 *
 * @param {{ initials: string, size?: number }} options
 */
function portrait({ initials, size = 480 }) {
  const label = escapeXml(initials);
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="${label}">`,
    `<rect width="${size}" height="${size}" fill="${INK}"/>`,
    `<circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.34}" fill="${ACCENT}"/>`,
    `<text x="50%" y="52%" fill="${INK}" font-family="${SANS}" font-size="${Math.round(size / 4.2)}" font-weight="700" text-anchor="middle" dominant-baseline="middle">${label}</text>`,
    `</svg>`,
  ].join("");
  return svgDataUri(svg);
}

/**
 * A flat wordmark placeholder for a publication logo strip.
 *
 * @param {string} name
 */
function wordmark(name) {
  const label = escapeXml(name);
  const display = escapeXml(name.toUpperCase());
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="72" viewBox="0 0 240 72" role="img" aria-label="${label}">`,
    `<rect width="240" height="72" fill="${INK}"/>`,
    `<text x="50%" y="50%" fill="${PAPER}" font-family="${SANS}" font-size="17" font-weight="700" letter-spacing="2" text-anchor="middle" dominant-baseline="middle">${display}</text>`,
    `</svg>`,
  ].join("");
  return svgDataUri(svg);
}

/**
 * Build one content-tree node. Every official CMS block referenced below is
 * at version 1.
 *
 * @param {string} blockId
 * @param {Record<string, unknown>} [props]
 * @param {Record<string, object[]>} [slots]
 */
function block(blockId, props = {}, slots = {}) {
  return { blockId, blockVersion: 1, props, slots };
}

const home = {
  path: "/",
  title: "Halden Studio — editorial & portrait photography, Copenhagen",
  blocks: [
    block("openforge-cms.banner", {
      message:
        "Spring editorial dates are open — four sessions left before June.",
      ctaLabel: "Check availability",
      ctaHref: "/contact",
      tone: "dark",
    }),
    block("openforge-cms.hero", {
      heading: "Portraits that hold still long enough to mean something.",
      subheading:
        "Halden Studio is Odette Halden's editorial and portrait practice, working out of a converted print works in Copenhagen. No sets, very little retouching, and a camera that stays out of the way.",
      ctaLabel: "See the portfolio",
      ctaHref: "/portfolio",
    }),
    block("openforge-cms.marquee-text", {
      text: "Editorial portraits — Brand campaigns — Elopements — Location work — Available worldwide",
      speed: "slow",
    }),
    block("openforge-cms.spotlight-card", {
      icon: "◐",
      title: "Editorial portraits",
      description:
        "Magazine and profile work built around one real conversation instead of a shot list.",
      tone: "amber",
    }),
    block("openforge-cms.spotlight-card", {
      icon: "▣",
      title: "Brand campaigns",
      description:
        "Founders, teams, and product photographed the way the brand actually talks, not the way stock photography does.",
      tone: "violet",
    }),
    block("openforge-cms.spotlight-card", {
      icon: "◇",
      title: "Elopements & small weddings",
      description:
        "Full-day coverage for couples who want one photographer, natural light, and no posed receiving line.",
      tone: "rose",
    }),
    block(
      "openforge-cms.stats-row",
      { heading: "Eleven years behind the camera" },
      {
        items: [
          block("openforge-cms.stat", {
            value: "11",
            label: "years in practice",
          }),
          block("openforge-cms.stat", {
            value: "340+",
            label: "sessions delivered",
          }),
          block("openforge-cms.stat", {
            value: "9",
            label: "countries shot on location",
          }),
          block("openforge-cms.stat", {
            value: "48 hrs",
            label: "typical gallery turnaround",
          }),
        ],
      },
    ),
    block("openforge-cms.testimonial", {
      quote:
        "Odette spent twenty minutes just talking to me before she picked up a camera. The portraits are the only ones of myself I have ever not hated.",
      author: "Freya Lindberg",
      role: "Ceramicist, subject of 'Hands That Work' (Kinfolk)",
      avatar: portrait({ initials: "FL" }),
    }),
    block("openforge-cms.testimonial", {
      quote:
        "We hired Halden Studio for a founder shoot expecting the usual grey backdrop. We got eleven usable portraits and not one of them looks like it was taken for a website.",
      author: "Mateus Bissa",
      role: "Co-founder, Loam & Co.",
      avatar: portrait({ initials: "MB" }),
    }),
    block(
      "openforge-cms.logo-cloud",
      { heading: "Work has appeared in" },
      {
        items: [
          block("openforge-cms.logo-item", {
            image: wordmark("Kinfolk"),
            name: "Kinfolk",
          }),
          block("openforge-cms.logo-item", {
            image: wordmark("Cereal"),
            name: "Cereal Magazine",
          }),
          block("openforge-cms.logo-item", {
            image: wordmark("Wallpaper"),
            name: "Wallpaper*",
          }),
          block("openforge-cms.logo-item", {
            image: wordmark("Monocle"),
            name: "Monocle",
          }),
          block("openforge-cms.logo-item", {
            image: wordmark("Its Nice That"),
            name: "It's Nice That",
          }),
        ],
      },
    ),
    block("openforge-cms.cta", {
      heading: "See the full portfolio before you book.",
      buttonLabel: "View the portfolio",
      buttonHref: "/portfolio",
    }),
  ],
};

const portfolioPage = {
  path: "/portfolio",
  title: "Portfolio",
  blocks: [
    block("openforge-cms.heading", {
      text: "Selected work",
      level: "h2",
      align: "left",
    }),
    block("openforge-cms.rich-text", {
      content:
        "A working selection from the last three years: editorial portraits, brand campaigns, and a handful of elopements. Everything here is a single frame, not a composite — what the light was doing that afternoon is part of the photograph.",
    }),
    block(
      "openforge-cms.image-gallery",
      { heading: "Portraits and editorial" },
      {
        items: [
          block("openforge-cms.gallery-item", {
            image: frame({ label: "Freya, Ceramicist" }),
            alt: "Portrait of ceramicist Freya Lindberg lit by a north-facing studio window.",
            caption: "Freya, for Kinfolk",
          }),
          block("openforge-cms.gallery-item", {
            image: frame({ label: "Loam & Co Founders" }),
            alt: "The two founders of Loam & Co. standing back to back in their workshop.",
            caption: "Loam & Co., founder portraits",
          }),
          block("openforge-cms.gallery-item", {
            image: frame({ label: "Harbour Light" }),
            alt: "A cargo ship departing Copenhagen harbour at dawn, shot on location.",
            caption: "Harbour series, no. 4",
          }),
          block("openforge-cms.gallery-item", {
            image: frame({ label: "Mateus, Studio Portrait" }),
            alt: "Close, unlit portrait of Mateus Bissa against a plain plaster wall.",
            caption: "Mateus, for Loam & Co.",
          }),
          block("openforge-cms.gallery-item", {
            image: frame({ label: "Print Works Interior" }),
            alt: "The studio's converted print works, shot at midday with the roller doors open.",
            caption: "The studio, midday",
          }),
          block("openforge-cms.gallery-item", {
            image: frame({ label: "Elopement, Bornholm" }),
            alt: "A couple standing at a cliff edge on Bornholm during their elopement.",
            caption: "Bornholm elopement",
          }),
          block("openforge-cms.gallery-item", {
            image: frame({ label: "Hands, Workshop" }),
            alt: "A close study of a ceramicist's hands mid-throw at the wheel.",
            caption: "Hands That Work, no. 2",
          }),
          block("openforge-cms.gallery-item", {
            image: frame({ label: "Rooftop, Copenhagen" }),
            alt: "A wide rooftop portrait overlooking Copenhagen's rooftops at last light.",
            caption: "Rooftop series, no. 1",
          }),
        ],
      },
    ),
    block("openforge-cms.divider", {}),
    block("openforge-cms.heading", {
      text: "From the contact sheet",
      level: "h2",
      align: "left",
    }),
    block("openforge-cms.rich-text", {
      content:
        "A handful of frames that never made a final edit but earn a place here anyway — the ones taken between the ones anyone asked for.",
    }),
    block(
      "openforge-cms.carousel",
      { heading: "Between the frames" },
      {
        items: [
          block("openforge-cms.carousel-slide", {
            image: frame({
              label: "Contact Sheet 04",
              width: 1200,
              height: 800,
            }),
            caption: "Loading film between setups, Loam & Co. shoot.",
          }),
          block("openforge-cms.carousel-slide", {
            image: frame({
              label: "Waiting Light",
              width: 1200,
              height: 800,
            }),
            caption:
              "The light we were actually waiting for, four minutes before it left.",
          }),
          block("openforge-cms.carousel-slide", {
            image: frame({
              label: "Second Shooter",
              width: 1200,
              height: 800,
            }),
            caption: "Jonas on second camera, Bornholm elopement.",
          }),
          block("openforge-cms.carousel-slide", {
            image: frame({
              label: "Proof Wall",
              width: 1200,
              height: 800,
            }),
            caption: "Proofs pinned to the print works wall before an edit.",
          }),
        ],
      },
    ),
    block("openforge-cms.cta", {
      heading: "Want to see a full gallery from one of these?",
      buttonLabel: "Ask for a sample gallery",
      buttonHref: "/contact",
    }),
  ],
};

const about = {
  path: "/about",
  title: "About Halden Studio",
  blocks: [
    block("openforge-cms.hero", {
      heading:
        "I got into photography to stop losing the ordinary version of people",
      subheading:
        "Odette Halden trained as a photojournalist, spent six years shooting for regional newspapers in Jutland, and started Halden Studio in 2015 because the portraits she cared most about never made the paper.",
    }),
    block("openforge-cms.image", {
      src: portrait({ initials: "OH", size: 900 }),
      alt: "Odette Halden standing at a large-format camera in the Halden Studio print works, Copenhagen.",
      caption: "Odette, in the studio. Photograph by Jonas Reyes.",
    }),
    block("openforge-cms.rich-text", {
      content:
        "Newspaper work teaches you to shoot fast and trust very little of what a subject does when they know the camera is on them. The best frame is almost always the one taken while everyone thinks the shoot is over.\n\nHalden Studio keeps that instinct and drops the deadline. A session runs for as long as it needs to: sometimes forty minutes, sometimes most of a day. There is no shot list handed to a subject in advance, because the moment someone starts posing for a shot list is the moment the portrait stops being of them.\n\nThe studio is a converted print works on the edge of Nørrebro — one large north-facing window, a single roller door for location light, and no permanent set. Most sessions still happen outdoors or in the subject's own space.",
    }),
    block(
      "openforge-cms.stats-row",
      { heading: "In practice" },
      {
        items: [
          block("openforge-cms.stat", {
            value: "2015",
            label: "studio founded",
          }),
          block("openforge-cms.stat", {
            value: "6 yrs",
            label: "prior newspaper work",
          }),
          block("openforge-cms.stat", {
            value: "1",
            label: "photographer on every shoot",
          }),
        ],
      },
    ),
    block(
      "openforge-cms.timeline",
      { heading: "How the studio got here" },
      {
        items: [
          block("openforge-cms.timeline-step", {
            date: "2009",
            title: "Staff photographer, Jyllands-Posten regional desk",
            description:
              "Six years shooting news, portraits, and the occasional flower show, on a deadline measured in hours.",
          }),
          block("openforge-cms.timeline-step", {
            date: "2015",
            title: "Halden Studio opens",
            description:
              "One room above a bakery in Aarhus, a single client from the newspaper days, and a decision to shoot only portraits.",
          }),
          block("openforge-cms.timeline-step", {
            date: "2019",
            title: "Move to Copenhagen",
            description:
              "The studio relocates to the current print works, and editorial commissions start arriving from further afield.",
          }),
          block("openforge-cms.timeline-step", {
            date: "2023",
            title: "First international campaign",
            description:
              "A five-city founder portrait series for a European hardware brand, shot entirely on location.",
          }),
        ],
      },
    ),
    block("openforge-cms.heading", {
      text: "The rest of the studio",
      level: "h2",
      align: "left",
    }),
    block("openforge-cms.team-member", {
      name: "Jonas Reyes",
      role: "Studio manager & second photographer",
      bio: "Runs the studio's schedule and shoots second camera on every wedding and multi-day campaign. Handles the location scouting Odette doesn't have time for.",
      photo: portrait({ initials: "JR" }),
    }),
    block("openforge-cms.team-member", {
      name: "Mireille Sato",
      role: "Retoucher",
      bio: "Does exactly one pass of retouching per frame and refuses a second. Has final say on which images leave the studio.",
      photo: portrait({ initials: "MS" }),
    }),
    block("openforge-cms.cta", {
      heading: "Curious whether the studio is right for your project?",
      buttonLabel: "Get in touch",
      buttonHref: "/contact",
    }),
  ],
};

const services = {
  path: "/services",
  title: "Services & Pricing",
  blocks: [
    block("openforge-cms.hero", {
      heading: "Three ways to book the studio",
      subheading:
        "Every session is priced flat, includes a private online gallery, and comes with full usage rights for the images you choose to keep.",
    }),
    block("openforge-cms.feature-list", {
      heading: "Every session includes",
      items:
        "A pre-shoot call to talk through what the images are actually for\nFull usage rights on every delivered image, no licensing back-and-forth\nA private, password-protected online gallery\nOne round of retouching on every selected frame\nDelivery in web and full-resolution print formats",
    }),
    block("openforge-cms.pricing", {
      planName: "Portrait Session",
      price: "€650",
      features:
        "Up to 90 minutes, one location\n25 edited images delivered\nGallery live within 5 business days\nOne subject or small group",
      buttonLabel: "Book a portrait session",
      buttonHref: "/contact",
      featured: false,
    }),
    block("openforge-cms.pricing", {
      planName: "Editorial Day Rate",
      price: "€1,900",
      features:
        "Full day, up to two locations\nUnlimited setups, 60+ edited images\nSecond photographer included\nUsage rights for editorial and commercial run",
      buttonLabel: "Book an editorial day",
      buttonHref: "/contact",
      featured: true,
    }),
    block("openforge-cms.pricing", {
      planName: "Elopement & Small Wedding",
      price: "From €2,400",
      features:
        "Up to 8 hours of coverage\nSecond photographer (Jonas) included\n300+ edited images, gallery within 2 weeks\nOne pre-wedding planning call",
      buttonLabel: "Check wedding dates",
      buttonHref: "/contact",
      featured: false,
    }),
    block("openforge-cms.alert", {
      message:
        "Spring 2026 has four editorial dates and two wedding dates remaining. Portrait sessions book roughly two weeks out.",
      tone: "info",
    }),
    block(
      "openforge-cms.accordion",
      { heading: "Before you book" },
      {
        items: [
          block("openforge-cms.faq-item", {
            question: "Do you shoot outside Copenhagen?",
            answer:
              "Yes — travel is included within Denmark and billed at cost for anything further. About a third of the studio's work happens on location abroad.",
          }),
          block("openforge-cms.faq-item", {
            question: "How many images do we actually get?",
            answer:
              "The numbers above are typical, not a hard cap. You get every frame worth keeping, which is usually a narrower set than most studios deliver.",
          }),
          block("openforge-cms.faq-item", {
            question: "Can we choose which images get retouched?",
            answer:
              "You choose the final selects from the gallery, and each one gets one full retouching pass from Mireille. Unselected frames stay unedited in the archive.",
          }),
          block("openforge-cms.faq-item", {
            question: "What if the weather ruins an outdoor session?",
            answer:
              "Every outdoor booking gets one no-cost reschedule for weather. We would rather move the date than hand you flat, grey-sky portraits.",
          }),
          block("openforge-cms.faq-item", {
            question: "Do you offer prints?",
            answer:
              "Yes, through a small run of archival prints on request. Framing and larger runs are quoted separately once you have seen the gallery.",
          }),
        ],
      },
    ),
    block("openforge-cms.cta", {
      heading: "Ready to find a date?",
      buttonLabel: "Start a booking",
      buttonHref: "/contact",
    }),
  ],
};

const contact = {
  path: "/contact",
  title: "Contact",
  blocks: [
    block("openforge-cms.hero", {
      heading: "Tell us what you actually need photographed",
      subheading:
        "A date, a place, and a sentence about the project is enough to start. Odette replies to every enquiry herself, usually within two working days.",
    }),
    block("openforge-cms.location-card", {
      name: "Halden Studio",
      address: "Rådmandsgade 42\n2200 København N\nDenmark",
      hours: "Tue–Fri: 10:00–17:00\nSat: by appointment\nSun–Mon: Closed",
      phone: "+45 32 11 04 88",
    }),
    block("openforge-cms.contact-form", {
      heading: "Send an enquiry",
      body: "Include the date, location, and the kind of session you're after — portrait, editorial, brand, or wedding.",
      action: "mailto:studio@haldenphotography.example",
      submitLabel: "Send enquiry",
    }),
    block("openforge-cms.alert", {
      message:
        "Enquiries about spring 2026 wedding dates should come in at least eight weeks ahead — only two dates remain.",
      tone: "warning",
    }),
    block("openforge-cms.cta", {
      heading: "Prefer to see the work first?",
      buttonLabel: "Back to the portfolio",
      buttonHref: "/portfolio",
    }),
  ],
};

export const exampleSite = [home, portfolioPage, about, services, contact];

/**
 * The theme's `footer` region content: a copyright/links footer plus a row
 * of social links. Kept as a separate export (rather than a sixth entry in
 * `exampleSite`) because `footer` and `social-links` only belong in the
 * `footer` region, not `page-body` — mirroring how the manifest keeps those
 * two block ids out of every page's own allowed block list.
 */
export const exampleFooter = [
  block(
    "openforge-cms.footer",
    {
      copyrightText: "© 2026 Halden Studio. Site built with OpenForge.",
    },
    {
      links: [
        block("openforge-cms.rich-text", { content: "Portfolio" }),
        block("openforge-cms.rich-text", { content: "Services" }),
        block("openforge-cms.rich-text", { content: "About" }),
        block("openforge-cms.rich-text", { content: "Contact" }),
      ],
    },
  ),
  block(
    "openforge-cms.social-links",
    { label: "Halden Studio on social media" },
    {
      items: [
        block("openforge-cms.social-link-item", {
          platform: "instagram",
          href: "https://instagram.com/haldenstudio",
        }),
        block("openforge-cms.social-link-item", {
          platform: "twitter",
          href: "https://x.com/haldenstudio",
        }),
        block("openforge-cms.social-link-item", {
          platform: "generic",
          href: "https://haldenphotography.example",
          label: "Halden Studio website",
        }),
      ],
    },
  ),
];
