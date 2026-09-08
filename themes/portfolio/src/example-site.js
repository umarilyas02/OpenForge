/**
 * A complete, ready-to-import example site for the Portfolio theme: the
 * personal site of a fictional independent brand designer, Marlowe Ashgrove.
 *
 * Every entry in a page's `blocks` array is a real content-tree node
 * (`{ blockId, blockVersion, props, slots }`) that satisfies
 * `parseContentTree()` from `@openforge/renderer` and every `required: true`
 * editable field of the block it names, so the whole site can be rendered
 * without a single missing-prop error.
 */

const INK = "#0b0b0c";
const PAPER = "#f4f2ed";
const ACCENT = "#d7ff3c";

const SANS = "Helvetica, Arial, sans-serif";

/**
 * Build one content-tree node. Every official CMS block is at version 1.
 *
 * @param {string} blockId
 * @param {Record<string, unknown>} [props]
 * @param {Record<string, object[]>} [slots]
 */
function block(blockId, props = {}, slots = {}) {
  return { blockId, blockVersion: 1, props, slots };
}

function dataUri(svg) {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/**
 * A landscape "artboard" placeholder: ink field, hairline accent frame, and
 * the project name set large. Inline SVG so the example site renders offline
 * with no asset pipeline and no external requests.
 *
 * @param {{ label: string, width?: number, height?: number }} options
 */
function artboard({ label, width = 1200, height = 750 }) {
  const inset = Math.round(width * 0.05);
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    `<rect width="${width}" height="${height}" fill="${INK}"/>`,
    `<rect x="${inset}" y="${inset}" width="${width - inset * 2}" height="${height - inset * 2}" fill="none" stroke="${ACCENT}" stroke-width="2"/>`,
    `<text x="50%" y="50%" fill="${ACCENT}" font-family="${SANS}" font-size="${Math.round(height / 11)}" font-weight="700" text-anchor="middle" dominant-baseline="middle">${label}</text>`,
    `</svg>`,
  ].join("");
  return dataUri(svg);
}

/**
 * A square portrait placeholder: paper field, accent disc, initials in ink.
 *
 * @param {{ initials: string, size?: number }} options
 */
function portrait({ initials, size = 240 }) {
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`,
    `<rect width="${size}" height="${size}" fill="${PAPER}"/>`,
    `<circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.36}" fill="${ACCENT}"/>`,
    `<text x="50%" y="50%" fill="${INK}" font-family="${SANS}" font-size="${Math.round(size / 3.4)}" font-weight="700" text-anchor="middle" dominant-baseline="middle">${initials}</text>`,
    `</svg>`,
  ].join("");
  return dataUri(svg);
}

/**
 * A monochrome wordmark placeholder for the client logo strip.
 *
 * @param {{ name: string, width?: number, height?: number }} options
 */
function wordmark({ name, width = 320, height = 96 }) {
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    `<rect width="${width}" height="${height}" fill="${PAPER}"/>`,
    `<text x="50%" y="50%" fill="${INK}" font-family="${SANS}" font-size="26" font-weight="700" letter-spacing="2" text-anchor="middle" dominant-baseline="middle">${name.toUpperCase()}</text>`,
    `</svg>`,
  ].join("");
  return dataUri(svg);
}

const homePage = {
  slug: "/",
  title: "Marlowe Ashgrove",
  type: "page",
  template: "page",
  description:
    "The landing page: a plain-spoken hero, a tagline ticker, four recent projects in a scroll-snap carousel, three working principles, client proof, and one closing invitation.",
  blocks: [
    block("openforge-cms.hero", {
      heading: "Brand systems with a spine.",
      subheading:
        "I am Marlowe Ashgrove, an independent brand designer and art director in Lisbon. I build identities for cultural institutions and small-batch product companies: the kind that have to look certain of themselves long before anyone has heard of them.",
      ctaLabel: "See selected work",
      ctaHref: "/work",
    }),
    block("openforge-cms.marquee-text", {
      text:
        "Identity systems — Art direction — Editorial design — Packaging — Type-led everything",
      speed: "slow",
    }),
    block("openforge-cms.gradient-heading", {
      text: "Selected work",
      level: "h2",
      tone: "forest",
    }),
    block(
      "openforge-cms.carousel",
      { heading: "Four recent projects" },
      {
        items: [
          block("openforge-cms.carousel-slide", {
            image: artboard({ label: "Verdigris Roasters" }),
            caption:
              "Verdigris Roasters — a coffee identity built from one stencilled V and a green that misbehaves on purpose.",
          }),
          block("openforge-cms.carousel-slide", {
            image: artboard({ label: "Kestrel House" }),
            caption:
              "Kestrel House — identity and wayfinding for a maritime museum housed in a rope works from 1774.",
          }),
          block("openforge-cms.carousel-slide", {
            image: artboard({ label: "Halide Type" }),
            caption:
              "Halide Type — a foundry site where the specimen is the navigation and nothing else is.",
          }),
          block("openforge-cms.carousel-slide", {
            image: artboard({ label: "Fold Quarterly" }),
            caption:
              "Fold Quarterly — an editorial grid strict enough that four guest art directors could not break it.",
          }),
        ],
      },
    ),
    block("openforge-cms.heading", {
      text: "How the work goes",
      level: "h2",
      align: "left",
    }),
    block("openforge-cms.spotlight-card", {
      icon: "01",
      title: "One idea, held tightly",
      description:
        "Every identity I ship can be explained in a sentence to somebody in a hurry. If it needs a deck to survive, it is not finished yet.",
      tone: "amber",
    }),
    block("openforge-cms.spotlight-card", {
      icon: "02",
      title: "Built to be handed over",
      description:
        "You leave with the type licences in your name, the working files, the grid, and a usage guide short enough that your team will actually read it.",
      tone: "violet",
    }),
    block("openforge-cms.spotlight-card", {
      icon: "03",
      title: "Tested on the worst surface first",
      description:
        "A mark gets proofed at 14mm on a foil coffee bag and at six metres on a building wrap before it is ever allowed near a moodboard.",
      tone: "rose",
    }),
    block(
      "openforge-cms.avatar-group",
      { caption: "Twenty-two clients since 2019. Eleven of them came back." },
      {
        items: [
          block("openforge-cms.avatar-item", {
            image: portrait({ initials: "RB" }),
            name: "Rui Bettencourt, Verdigris Roasters",
          }),
          block("openforge-cms.avatar-item", {
            image: portrait({ initials: "HP" }),
            name: "Hana Petrelli, Kestrel House",
          }),
          block("openforge-cms.avatar-item", {
            image: portrait({ initials: "JA" }),
            name: "Joss Amara, Fold Quarterly",
          }),
          block("openforge-cms.avatar-item", {
            image: portrait({ initials: "MO" }),
            name: "Mira Oyelaran, Sonder Ceramics",
          }),
          block("openforge-cms.avatar-item", {
            image: portrait({ initials: "EK" }),
            name: "Elias Kron, Northline Records",
          }),
        ],
      },
    ),
    block("openforge-cms.testimonial", {
      quote:
        "We arrived with three years of mismatched labels and left with one system a shift worker can apply at six in the morning without asking anyone. Sales stopped being the reason people picked up the bag.",
      author: "Rui Bettencourt",
      role: "Founder, Verdigris Roasters",
      avatar: portrait({ initials: "RB" }),
    }),
    block("openforge-cms.divider", { style: "solid" }),
    block("openforge-cms.cta", {
      heading: "Something that needs a shape?",
      buttonLabel: "Start a project",
      buttonHref: "/contact",
    }),
  ],
};

const workPage = {
  slug: "/work",
  title: "Selected Work",
  type: "page",
  template: "page",
  description:
    "The portfolio proper: a five-slide case-study carousel, four written project summaries, and the numbers behind the practice.",
  blocks: [
    block("openforge-cms.gradient-heading", {
      text: "Selected work, 2019 to 2026",
      level: "h2",
      tone: "forest",
    }),
    block("openforge-cms.rich-text", {
      content:
        "Most of this is identity work: a mark, a typeface decision, a colour that has to survive a print run, and the rules that keep the whole thing standing once I am no longer in the room.\n\nProjects are shown in the order they shipped, not in the order I am proudest of them. Full case studies, including the versions that did not work, are available on request.",
    }),
    block(
      "openforge-cms.carousel",
      { heading: "Case studies" },
      {
        items: [
          block("openforge-cms.carousel-slide", {
            image: artboard({ label: "Verdigris Roasters" }),
            caption:
              "Identity, packaging system, and retail signage for a nine-person roastery in Porto.",
          }),
          block("openforge-cms.carousel-slide", {
            image: artboard({ label: "Kestrel House" }),
            caption:
              "Identity, wayfinding, and exhibition typography for a maritime museum on the Tagus.",
          }),
          block("openforge-cms.carousel-slide", {
            image: artboard({ label: "Halide Type" }),
            caption:
              "Website, specimen, and licensing collateral for an independent type foundry of two.",
          }),
          block("openforge-cms.carousel-slide", {
            image: artboard({ label: "Fold Quarterly" }),
            caption:
              "A four-column editorial system and cover language for an independent print journal.",
          }),
          block("openforge-cms.carousel-slide", {
            image: artboard({ label: "Sonder Ceramics" }),
            caption:
              "Brand, stamp, and photographic art direction for a studio potter selling direct.",
          }),
        ],
      },
    ),
    block("openforge-cms.heading", {
      text: "What each project actually was",
      level: "h2",
      align: "left",
    }),
    block("openforge-cms.spotlight-card", {
      icon: "☕",
      title: "Verdigris Roasters — identity and packaging",
      description:
        "Twelve single-origin bags that had to be told apart at arm's length on a dark shelf. One stencil letterform, six inks, and a rule that the origin name is always the largest thing on the bag.",
      tone: "amber",
    }),
    block("openforge-cms.spotlight-card", {
      icon: "⚓",
      title: "Kestrel House — identity and wayfinding",
      description:
        "A museum in a 1774 rope works with no straight corridors. The system leans on floor numerals and a single high-contrast sign family that never touches the original brick.",
      tone: "cyan",
    }),
    block("openforge-cms.spotlight-card", {
      icon: "Aa",
      title: "Halide Type — foundry site and specimen",
      description:
        "The whole site is one live specimen: type testers double as navigation, and the licence page is written in plain language rather than legalese nobody reads.",
      tone: "violet",
    }),
    block("openforge-cms.spotlight-card", {
      icon: "❖",
      title: "Fold Quarterly — editorial system",
      description:
        "Four columns, three text sizes, one rule for images. Guest art directors get real freedom inside it and the journal still reads as one publication across sixteen issues.",
      tone: "rose",
    }),
    block(
      "openforge-cms.stats-row",
      { heading: "The practice, in numbers" },
      {
        items: [
          block("openforge-cms.stat", {
            value: "42",
            label: "Identity systems shipped",
          }),
          block("openforge-cms.stat", {
            value: "9",
            label: "Years independent",
          }),
          block("openforge-cms.stat", {
            value: "6 wks",
            label: "Typical identity sprint",
          }),
          block("openforge-cms.stat", {
            value: "11",
            label: "Clients who came back",
          }),
        ],
      },
    ),
    block("openforge-cms.divider", { style: "dashed" }),
    block("openforge-cms.cta", {
      heading: "Want the long version of any of these?",
      buttonLabel: "Ask for the case study",
      buttonHref: "/contact",
    }),
  ],
};

const aboutPage = {
  slug: "/about",
  title: "About Marlowe",
  type: "page",
  template: "page",
  description:
    "The biography page: portrait, a three-paragraph plain-spoken bio, a skills checklist, a dated career timeline, and the two collaborators who make up the rest of the studio.",
  blocks: [
    block("openforge-cms.image", {
      src: artboard({ label: "Marlowe Ashgrove", width: 1000, height: 1000 }),
      alt:
        "Marlowe Ashgrove in the studio, standing beside a wall of pinned-up type proofs.",
      caption:
        "Studio on Rua da Boavista, Lisbon. Photograph by Tova Lindqvist.",
    }),
    block("openforge-cms.rich-text", {
      content:
        "I started as a compositor's apprentice in a letterpress shop that closed six months after I arrived, which turned out to be the most useful design education available. Everything I learned there was about constraint: how many characters fit, what the paper will take, and what happens when you are wrong at scale.\n\nI spent five years in studios in Rotterdam and Lisbon, mostly on cultural work, before going independent in 2017. Since then it has been one designer, two long-standing collaborators, and a deliberately small number of projects a year.\n\nI work directly with founders and directors. No account layer, no reshuffled team halfway through, and no strategy phase that produces a document instead of a decision.",
    }),
    block("openforge-cms.feature-list", {
      heading: "Where I am most useful",
      items:
        "Naming and identity for something that does not exist yet\nPackaging systems that have to hold twelve variants without collapsing\nWayfinding and environmental type for awkward, protected buildings\nEditorial systems for print that will outlive the art director\nType selection, licensing, and custom lettering\nArt direction for photography and product shoots",
    }),
    block(
      "openforge-cms.timeline",
      { heading: "A short history" },
      {
        items: [
          block("openforge-cms.timeline-step", {
            date: "2009",
            title: "Apprenticed at Hallward and Sons",
            description:
              "Two years setting metal type and cleaning presses in a letterpress shop in Norwich that shut in my first winter.",
          }),
          block("openforge-cms.timeline-step", {
            date: "2012",
            title: "Junior designer, Studio Merit, Rotterdam",
            description:
              "Cultural identity work: theatres, a photography biennial, and a lot of poster production.",
          }),
          block("openforge-cms.timeline-step", {
            date: "2015",
            title: "Design lead, Atelier Corvo, Lisbon",
            description:
              "Ran identity and print for museums and public institutions across Portugal and Spain.",
          }),
          block("openforge-cms.timeline-step", {
            date: "2017",
            title: "Went independent",
            description:
              "One desk, one client, and a rule that I would never take on more than four identity projects in a year.",
          }),
          block("openforge-cms.timeline-step", {
            date: "2024",
            title: "Kestrel House opened",
            description:
              "Three years of identity and wayfinding went live the week the museum opened its doors to the public.",
          }),
        ],
      },
    ),
    block("openforge-cms.heading", {
      text: "The two people I work with constantly",
      level: "h2",
      align: "left",
    }),
    block("openforge-cms.team-member", {
      name: "Tova Lindqvist",
      role: "Motion and 3D",
      bio:
        "Tova takes finished identities and works out how they behave when they move. She has built the motion language for every project on this site since 2021, and shoots most of the studio photography.",
      photo: portrait({ initials: "TL" }),
    }),
    block("openforge-cms.team-member", {
      name: "Deniz Aygun",
      role: "Print production and letterpress",
      bio:
        "Deniz runs the press work and rides every production run. If a colour is going to fail on uncoated stock, he says so at the proof stage rather than after the invoice.",
      photo: portrait({ initials: "DA" }),
    }),
    block(
      "openforge-cms.columns",
      { heading: "Two things worth knowing before we start" },
      {
        items: [
          block("openforge-cms.rich-text", {
            content:
              "I take four identity projects a year and turn down more than I accept. That is not scarcity marketing; it is the only way one person can be genuinely present for the whole of a project.",
          }),
          block("openforge-cms.rich-text", {
            content:
              "I do not do unpaid pitches or speculative rounds. If you want to see how I think before committing, I will happily walk you through a past project end to end, including the parts that failed.",
          }),
        ],
      },
    ),
    block("openforge-cms.cta", {
      heading: "Still reading? That is usually a good sign.",
      buttonLabel: "Get in touch",
      buttonHref: "/contact",
    }),
  ],
};

const servicesPage = {
  slug: "/services",
  title: "Services",
  type: "page",
  template: "page",
  description:
    "The three ways to engage, what every engagement includes, and an FAQ that answers the money and timeline questions before anyone has to ask them.",
  blocks: [
    block("openforge-cms.badge", {
      text: "Booking from March 2026",
      tone: "accent",
    }),
    block("openforge-cms.gradient-heading", {
      text: "Three ways to work together",
      level: "h2",
      tone: "forest",
    }),
    block("openforge-cms.rich-text", {
      content:
        "Every project starts the same way: a paid half-day session where we work out what the thing actually is. If it turns out you do not need me after that, you have still bought a useful afternoon.",
    }),
    block("openforge-cms.spotlight-card", {
      icon: "◆",
      title: "Identity system — 6 to 10 weeks",
      description:
        "Naming support, mark, type system, colour, and the applications that matter most to you. Ends with a usage guide, packaged files, and a handover session with whoever will be using it daily.",
      tone: "violet",
    }),
    block("openforge-cms.spotlight-card", {
      icon: "◈",
      title: "Art direction retainer — monthly",
      description:
        "For teams that already have an identity and keep drifting away from it. Two days a month reviewing, correcting, and art directing whatever is going out the door next.",
      tone: "cyan",
    }),
    block("openforge-cms.spotlight-card", {
      icon: "▣",
      title: "Editorial and print — per project",
      description:
        "Books, journals, catalogues, and specimens. Grid, typography, cover language, and production supervision through to the press check with Deniz.",
      tone: "amber",
    }),
    block("openforge-cms.feature-list", {
      heading: "Every engagement includes",
      items:
        "A fixed price agreed before any design work starts\nWeekly working sessions instead of monthly reveal meetings\nType licences purchased in your name, not sublicensed through me\nEditable source files, not just flattened exports\nA usage guide written in sentences, not diagrams\nThirty days of post-launch support at no extra cost",
    }),
    block(
      "openforge-cms.accordion",
      { heading: "Before you ask" },
      {
        items: [
          block("openforge-cms.faq-item", {
            question: "What does an identity system cost?",
            answer:
              "Identity projects have started at 18,000 EUR and the average lands near 26,000 EUR. The half-day discovery session is 850 EUR and is credited against the project if we go ahead.",
          }),
          block("openforge-cms.faq-item", {
            question: "How far ahead are you booked?",
            answer:
              "Usually eight to twelve weeks. Retainer work and small editorial projects can sometimes start sooner, because they slot around the identity work rather than replacing it.",
          }),
          block("openforge-cms.faq-item", {
            question: "Do you work with agencies as a subcontractor?",
            answer:
              "Occasionally, when I have direct access to the end client. Design by relay through an account manager produces work that nobody can defend three months later.",
          }),
          block("openforge-cms.faq-item", {
            question: "Can you build the website too?",
            answer:
              "I design it and art direct it, and I work with two developers I trust to build it. I will not pretend to be a front-end engineer to keep the invoice in one place.",
          }),
          block("openforge-cms.faq-item", {
            question: "What if we hate the first direction?",
            answer:
              "Then we did the first week wrong, and we go back to it at my cost. That has happened twice in nine years and both projects ended better for it.",
          }),
        ],
      },
    ),
    block("openforge-cms.alert", {
      message:
        "Non-profits and small cultural institutions: ask about the reduced rate. Two of the four slots each year are held for this kind of work.",
      tone: "info",
    }),
    block("openforge-cms.cta", {
      heading: "Book the half day and find out what you actually need.",
      buttonLabel: "Book a discovery session",
      buttonHref: "/contact",
    }),
  ],
};

const clientsPage = {
  slug: "/clients",
  title: "Clients and Praise",
  type: "page",
  template: "page",
  description:
    "Social proof: a scrolling client wordmark strip, three long-form testimonials from named clients, the returning-client avatar row, and the headline numbers.",
  blocks: [
    block("openforge-cms.rich-text", {
      content:
        "The list below is short on purpose. Four identity projects a year for nine years does not add up to a wall of logos, and I would rather show you people who will take your call than a grid of names I touched once.",
    }),
    block(
      "openforge-cms.logo-cloud",
      { heading: "Recently, for" },
      {
        items: [
          block("openforge-cms.logo-item", {
            image: wordmark({ name: "Verdigris" }),
            name: "Verdigris Roasters",
          }),
          block("openforge-cms.logo-item", {
            image: wordmark({ name: "Kestrel House" }),
            name: "Kestrel House Museum",
          }),
          block("openforge-cms.logo-item", {
            image: wordmark({ name: "Halide" }),
            name: "Halide Type Foundry",
          }),
          block("openforge-cms.logo-item", {
            image: wordmark({ name: "Fold" }),
            name: "Fold Quarterly",
          }),
          block("openforge-cms.logo-item", {
            image: wordmark({ name: "Sonder" }),
            name: "Sonder Ceramics",
          }),
          block("openforge-cms.logo-item", {
            image: wordmark({ name: "Northline" }),
            name: "Northline Records",
          }),
        ],
      },
    ),
    block("openforge-cms.heading", {
      text: "What they said afterwards",
      level: "h2",
      align: "left",
    }),
    block("openforge-cms.testimonial", {
      quote:
        "Marlowe spent the first week in the roastery rather than in front of a screen, and it shows. The system survives being applied at half past five in the morning by whoever is on shift, which is the only test that ever mattered to us.",
      author: "Rui Bettencourt",
      role: "Founder, Verdigris Roasters",
      avatar: portrait({ initials: "RB" }),
    }),
    block("openforge-cms.testimonial", {
      quote:
        "We are a listed building with no right angles and a conservation officer for every doorway. The wayfinding got approved on the first submission, which had not happened to us before and has not happened since.",
      author: "Hana Petrelli",
      role: "Director, Kestrel House Museum",
      avatar: portrait({ initials: "HP" }),
    }),
    block("openforge-cms.testimonial", {
      quote:
        "Sixteen issues in, four guest art directors later, and the journal still looks like one publication. The grid is strict and everybody who works inside it says they feel freer, not more constrained.",
      author: "Joss Amara",
      role: "Publisher, Fold Quarterly",
      avatar: portrait({ initials: "JA" }),
    }),
    block(
      "openforge-cms.avatar-group",
      { caption: "The eleven who came back for a second project." },
      {
        items: [
          block("openforge-cms.avatar-item", {
            image: portrait({ initials: "RB" }),
            name: "Rui Bettencourt, Verdigris Roasters",
          }),
          block("openforge-cms.avatar-item", {
            image: portrait({ initials: "HP" }),
            name: "Hana Petrelli, Kestrel House",
          }),
          block("openforge-cms.avatar-item", {
            image: portrait({ initials: "JA" }),
            name: "Joss Amara, Fold Quarterly",
          }),
          block("openforge-cms.avatar-item", {
            image: portrait({ initials: "MO" }),
            name: "Mira Oyelaran, Sonder Ceramics",
          }),
          block("openforge-cms.avatar-item", {
            image: portrait({ initials: "EK" }),
            name: "Elias Kron, Northline Records",
          }),
          block("openforge-cms.avatar-item", {
            image: portrait({ initials: "SV" }),
            name: "Sasha Verreault, Halide Type",
          }),
        ],
      },
    ),
    block(
      "openforge-cms.stats-row",
      { heading: "Nine years, counted honestly" },
      {
        items: [
          block("openforge-cms.stat", {
            value: "22",
            label: "Clients since 2019",
          }),
          block("openforge-cms.stat", {
            value: "11",
            label: "Returned for more",
          }),
          block("openforge-cms.stat", {
            value: "0",
            label: "Unpaid pitches entered",
          }),
        ],
      },
    ),
    block("openforge-cms.cta", {
      heading: "Happy to put you in touch with any of them.",
      buttonLabel: "Ask for a reference",
      buttonHref: "/contact",
    }),
  ],
};

const contactPage = {
  slug: "/contact",
  title: "Contact",
  type: "page",
  template: "page",
  description:
    "The close: how to reach the studio, exactly what to put in a first email, current availability, and two direct links.",
  blocks: [
    block("openforge-cms.rich-text", {
      content:
        "The fastest way in is a short email. I read everything myself and reply within two working days, including to the ones I have to turn down.\n\nStudio: Rua da Boavista 212, 1200-069 Lisbon. Visits by arrangement, usually on Thursdays.",
    }),
    block("openforge-cms.feature-list", {
      heading: "What to put in the first email",
      items:
        "What the organisation is, in one sentence\nWhat is going wrong with how it currently looks\nThe date something has to be finished by, and why that date\nA budget range, even a rough one — it saves us both a fortnight\nWho makes the final decision and whether they are on the email",
    }),
    block("openforge-cms.alert", {
      message:
        "Currently taking on two projects starting March 2026 and one editorial project for the autumn. Retainer availability opens again in June.",
      tone: "success",
    }),
    block("openforge-cms.button", {
      label: "hello@ashgrove.studio",
      href: "mailto:hello@ashgrove.studio",
      variant: "primary",
    }),
    block("openforge-cms.button", {
      label: "Download the studio one-pager (PDF)",
      href: "/downloads/ashgrove-studio-overview.pdf",
      variant: "outline",
    }),
    block("openforge-cms.divider", { style: "solid" }),
    block("openforge-cms.cta", {
      heading: "Prefer to talk it through first?",
      buttonLabel: "Book a 20-minute call",
      buttonHref: "mailto:hello@ashgrove.studio?subject=Intro%20call",
    }),
  ],
};

const journalPost = {
  slug: "/journal/the-logo-is-the-last-thing",
  title: "The logo is the last thing",
  type: "post",
  template: "post",
  publishedAt: "2026-04-17T09:00:00.000Z",
  description:
    "A journal entry rendered through the post template, exercising the post-body region: badge, prose, a full-bleed proof image, a checklist, and a closing invitation.",
  blocks: [
    block("openforge-cms.badge", { text: "Journal", tone: "accent" }),
    block("openforge-cms.rich-text", {
      content:
        "Clients almost always open with the mark. It is the part everyone can picture, so it is the part everyone wants to talk about on day one. It is also the last thing I draw, and there is a practical reason for that rather than a philosophical one.\n\nA mark is a compression of decisions you have not made yet. Draw it first and you spend the rest of the project defending a shape instead of building a system around a decision.",
    }),
    block("openforge-cms.heading", {
      text: "What comes before it",
      level: "h2",
      align: "left",
    }),
    block("openforge-cms.image", {
      src: artboard({ label: "Proof sheet 04" }),
      alt:
        "A proof sheet of forty stencilled letterform variants pinned to a studio wall.",
      caption:
        "Verdigris, proof sheet four of eleven. The mark that shipped is in the bottom row.",
    }),
    block("openforge-cms.feature-list", {
      heading: "The order I actually work in",
      items:
        "The sentence: what this is, said plainly enough to survive a stranger\nThe surfaces: where it will be seen, at what size, under what light\nThe typeface: the voice you will be using ten thousand more times than the mark\nThe colour: proofed on the real stock before anyone falls in love with it\nThe mark: last, and by then it has almost drawn itself",
    }),
    block("openforge-cms.rich-text", {
      content:
        "By the time I get to the mark, most of its constraints already exist. It has to sit next to the typeface without arguing, work in the one colour that survived the press proof, and hold at the smallest size on the list. That is not a limitation on the drawing. It is most of the drawing.",
    }),
    block("openforge-cms.divider", { style: "dashed" }),
    block("openforge-cms.cta", {
      heading: "Working on something where the order matters?",
      buttonLabel: "Start a project",
      buttonHref: "/contact",
    }),
  ],
};

/** The footer content tree, for the theme's `footer` region. */
export const exampleFooter = [
  block(
    "openforge-cms.footer",
    {
      copyrightText:
        "© 2026 Marlowe Ashgrove. Site set in Space Grotesk. Built with OpenForge.",
    },
    {
      links: [
        block("openforge-cms.rich-text", { content: "Work" }),
        block("openforge-cms.rich-text", { content: "About" }),
        block("openforge-cms.rich-text", { content: "Services" }),
        block("openforge-cms.rich-text", { content: "Contact" }),
      ],
    },
  ),
];

export const exampleSite = {
  themeId: "openforge-theme.portfolio",
  name: "Marlowe Ashgrove",
  tagline: "Independent brand designer and art director, Lisbon.",
  description:
    "A six-page personal site for an independent brand designer: home, work, about, services, clients, and contact, plus one journal post that exercises the post template.",
  pages: [
    homePage,
    workPage,
    aboutPage,
    servicesPage,
    clientsPage,
    contactPage,
  ],
  posts: [journalPost],
  footer: exampleFooter,
};
