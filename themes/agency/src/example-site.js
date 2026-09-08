/**
 * A complete example site for the Agency theme.
 *
 * Everything below is a real, valid content tree: each node is
 * `{ blockId, blockVersion, props, slots }` exactly as
 * `@openforge/renderer`'s `parseContentTree` expects, every block id is an
 * official CMS block, every `required: true` editable field is populated,
 * and every slot only contains block ids its parent actually accepts.
 *
 * The studio, its people, and its clients are invented. "Rivetwork" is a
 * fictional brand-and-digital studio used to show what the theme looks like
 * carrying opinionated, specific copy rather than placeholder text.
 */

const INK = "#0b0b0c";
const BONE = "#f4f2ed";
const VERMILION = "#ff3d00";

function escapeXml(value) {
  return String(value)
    .replace(/&/gu, "&amp;")
    .replace(/</gu, "&lt;")
    .replace(/>/gu, "&gt;")
    .replace(/"/gu, "&quot;");
}

/**
 * Inline SVG data URI. Self-contained on purpose: an example site should
 * render identically offline, in CI, and in a fresh install with no media
 * library seeded.
 *
 * @param {string} svg
 */
function svgDataUri(svg) {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/** A flat, high-contrast stand-in wordmark for a client logo. */
function wordmark(name) {
  // Escape *after* casing: uppercasing an escaped "&amp;" would produce the
  // invalid entity "&AMP;".
  const label = escapeXml(name);
  const display = escapeXml(name.toUpperCase());
  return svgDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="64" viewBox="0 0 220 64" role="img" aria-label="${label}"><rect width="220" height="64" fill="${INK}"/><rect x="16" y="28" width="10" height="10" fill="${VERMILION}"/><text x="38" y="38" fill="${BONE}" font-family="Helvetica, Arial, sans-serif" font-size="15" font-weight="700" letter-spacing="1.5" dominant-baseline="middle">${display}</text></svg>`,
  );
}

/** A square initials portrait, used for avatars and team photos. */
function portrait(name, background = INK, foreground = BONE) {
  const initials = name
    .split(/\s+/u)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const label = escapeXml(name);
  return svgDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256" role="img" aria-label="${label}"><rect width="256" height="256" fill="${background}"/><text x="128" y="140" fill="${foreground}" font-family="Helvetica, Arial, sans-serif" font-size="92" font-weight="800" letter-spacing="2" text-anchor="middle">${initials}</text></svg>`,
  );
}

/** A blocky poster-style stand-in for project photography. */
function artwork(label, width = 1200, height = 750, background = INK) {
  const text = escapeXml(label);
  const display = escapeXml(label.toUpperCase());
  const barWidth = Math.round(width * 0.42);
  return svgDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${text}"><rect width="${width}" height="${height}" fill="${background}"/><rect x="0" y="${height - 24}" width="${barWidth}" height="24" fill="${VERMILION}"/><rect x="${width - 120}" y="48" width="72" height="72" fill="${VERMILION}"/><text x="48" y="${height - 72}" fill="${BONE}" font-family="Helvetica, Arial, sans-serif" font-size="46" font-weight="800" letter-spacing="1">${display}</text></svg>`,
  );
}

/**
 * @param {string} blockId
 * @param {Record<string, unknown>} props
 * @param {Record<string, object[]>} [slots]
 */
function block(blockId, props = {}, slots = {}) {
  return { blockId, blockVersion: 1, props, slots };
}

const clients = [
  "Kestrel Freight",
  "Ninebark Health",
  "Pallas & Bright",
  "Sundial Athletic",
  "Coppersmith Cider",
  "Verdance Farms",
];

const clientLogos = clients.map((name) =>
  block("openforge-cms.logo-item", { image: wordmark(name), name }),
);

const studioCta = block("openforge-cms.cta", {
  heading: "Have something that needs to be undeniable?",
  buttonLabel: "Start a project",
  buttonHref: "/contact",
});

/* ------------------------------------------------------------------ */
/* Home                                                                */
/* ------------------------------------------------------------------ */

const homeBlocks = [
  block("openforge-cms.hero", {
    heading: "Brands that hold up under pressure.",
    subheading:
      "Rivetwork is an independent brand and digital studio. We build identities, websites, and product interfaces for companies whose next three years look nothing like their last three.",
    ctaLabel: "See the work",
    ctaHref: "/work",
  }),
  block("openforge-cms.marquee-text", {
    text: "Brand identity · Naming · Digital product · Motion · Packaging · Environmental graphics · Brand identity ·",
    speed: "slow",
  }),
  block(
    "openforge-cms.logo-cloud",
    { heading: "Six of the last twenty" },
    { items: clientLogos },
  ),
  block(
    "openforge-cms.stats-row",
    { heading: "Eleven years, measured" },
    {
      items: [
        block("openforge-cms.stat", {
          value: "11",
          label: "Years independent, unacquired, unmerged",
        }),
        block("openforge-cms.stat", {
          value: "$412M",
          label: "Raised by clients within a year of relaunch",
        }),
        block("openforge-cms.stat", {
          value: "3.4x",
          label: "Median lift in qualified inbound",
        }),
        block("openforge-cms.stat", {
          value: "9 wks",
          label: "Median kickoff to public launch",
        }),
      ],
    },
  ),
  block("openforge-cms.gradient-heading", {
    text: "Three things we are unreasonably good at",
    level: "h2",
    tone: "sunset",
  }),
  block(
    "openforge-cms.columns",
    {},
    {
      items: [
        block("openforge-cms.rich-text", {
          content:
            "Identity as a system. Names, marks, type, colour, motion, and packaging built as one argument with the reasoning written down — so the tenth person to use the brand makes the same call the first one did.\n\nWe hand over a live design system, not a 90-page PDF nobody opens twice.",
        }),
        block("openforge-cms.rich-text", {
          content:
            "Digital that ships. Marketing sites and product interfaces designed in the browser at real breakpoints, delivered as a component library your engineers are happy to inherit.\n\nWe pair with your team from week one. Nothing gets thrown over a wall.",
        }),
        block("openforge-cms.rich-text", {
          content:
            "The launch itself. Film, stills, environmental graphics, sales collateral, and the internal rollout deck.\n\nA rebrand nobody inside the company can explain is a rebrand that quietly dies in year two. We make sure yours gets defended in rooms we are not in.",
        }),
      ],
    },
  ),
  block("openforge-cms.divider", { style: "solid" }),
  block("openforge-cms.heading", {
    text: "Selected work",
    level: "h2",
    align: "left",
  }),
  block("openforge-cms.card", {
    image: artwork("Kestrel Freight"),
    title: "Kestrel Freight",
    description:
      "A forty-year-old regional carrier repositioned as a logistics technology company: identity, fleet livery, driver app interface, and an operations style guide covering everything from invoice type to trailer decals.",
    linkLabel: "Read the case study",
    linkHref: "/work/kestrel-freight",
  }),
  block("openforge-cms.card", {
    image: artwork("Ninebark Health", 1200, 750, "#14202b"),
    title: "Ninebark Health",
    description:
      "Clinical credibility that still sounds like a person. Naming, identity, and a patient portal redesign that cut first-visit drop-off by a third in the first quarter after launch.",
    linkLabel: "Read the case study",
    linkHref: "/work/ninebark-health",
  }),
  block("openforge-cms.card", {
    image: artwork("Pallas & Bright", 1200, 750, "#2a1d16"),
    title: "Pallas & Bright",
    description:
      "Packaging, art direction, and an e-commerce rebuild for a jeweller going from three boutiques to sixty countries without losing the feeling of the original shop.",
    linkLabel: "Read the case study",
    linkHref: "/work/pallas-and-bright",
  }),
  block("openforge-cms.testimonial", {
    quote:
      "We interviewed eleven studios. Rivetwork was the only one that opened with what our business was getting wrong instead of a moodboard. Six months after launch we stopped explaining who we are on every sales call — the brand does it before we open our mouths.",
    author: "Imani Vasquez",
    role: "Chief Executive, Kestrel Freight",
    avatar: portrait("Imani Vasquez"),
  }),
  block(
    "openforge-cms.avatar-group",
    {
      caption:
        "Twelve people, no account managers. You work with whoever is making the work.",
    },
    {
      items: [
        block("openforge-cms.avatar-item", {
          image: portrait("Dara Okonjo"),
          name: "Dara Okonjo",
        }),
        block("openforge-cms.avatar-item", {
          image: portrait("Milo Ferreira"),
          name: "Milo Ferreira",
        }),
        block("openforge-cms.avatar-item", {
          image: portrait("Sasha Reyne"),
          name: "Sasha Reyne",
        }),
        block("openforge-cms.avatar-item", {
          image: portrait("Tomas Halvard"),
          name: "Tomas Halvard",
        }),
        block("openforge-cms.avatar-item", {
          image: portrait("Junie Park"),
          name: "Junie Park",
        }),
      ],
    },
  ),
  studioCta,
];

/* ------------------------------------------------------------------ */
/* Work                                                                */
/* ------------------------------------------------------------------ */

const workBlocks = [
  block("openforge-cms.hero", {
    heading: "Work",
    subheading:
      "Eleven years of it. These are the projects we bring up unprompted — the ones where the brief changed halfway through and the answer got better for it.",
    ctaLabel: "Brief the studio",
    ctaHref: "/contact",
  }),
  block(
    "openforge-cms.carousel",
    { heading: "In the field" },
    {
      items: [
        block("openforge-cms.carousel-slide", {
          image: artwork("Kestrel livery", 1400, 900),
          caption:
            "Kestrel Freight — 1,200 trailers rewrapped over fourteen months, one depot at a time.",
        }),
        block("openforge-cms.carousel-slide", {
          image: artwork("Ninebark waiting room", 1400, 900, "#14202b"),
          caption:
            "Ninebark Health — wayfinding and environmental type across nine clinics.",
        }),
        block("openforge-cms.carousel-slide", {
          image: artwork("Pallas packaging", 1400, 900, "#2a1d16"),
          caption:
            "Pallas & Bright — a packaging system that survives being posted to sixty countries.",
        }),
        block("openforge-cms.carousel-slide", {
          image: artwork("Sundial campaign", 1400, 900, "#0f2118"),
          caption:
            "Sundial Athletic — launch film stills, shot over three days in the Cascades.",
        }),
      ],
    },
  ),
  block("openforge-cms.heading", {
    text: "Case studies",
    level: "h2",
    align: "left",
  }),
  block("openforge-cms.card", {
    image: artwork("Kestrel Freight"),
    title: "Kestrel Freight — from carrier to platform",
    description:
      "Identity, fleet livery, driver app, and an operations style guide. Twelve months on: inbound enterprise leads up 3.4x and a hiring pipeline that finally fills itself.",
    linkLabel: "Read the case study",
    linkHref: "/work/kestrel-freight",
  }),
  block("openforge-cms.card", {
    image: artwork("Ninebark Health", 1200, 750, "#14202b"),
    title: "Ninebark Health — trust without the beige",
    description:
      "Naming, identity, and a patient portal redesign for a nine-clinic primary care group. First-visit drop-off fell 34% in the first quarter.",
    linkLabel: "Read the case study",
    linkHref: "/work/ninebark-health",
  }),
  block("openforge-cms.card", {
    image: artwork("Sundial Athletic", 1200, 750, "#0f2118"),
    title: "Sundial Athletic — a launch with teeth",
    description:
      "Brand, packaging, launch film, and a direct-to-consumer storefront built in eight weeks for a trail running label with one product and no budget for a second attempt.",
    linkLabel: "Read the case study",
    linkHref: "/work/sundial-athletic",
  }),
  block("openforge-cms.data-table", {
    heading: "Engagements at a glance",
    headers: "Client,Sector,Scope,Year",
    rows: [
      "Kestrel Freight|Logistics|Identity, livery, product UI|2025",
      "Ninebark Health|Healthcare|Naming, identity, portal UX|2025",
      "Pallas & Bright|Retail|Packaging, art direction, commerce|2024",
      "Sundial Athletic|Consumer|Brand, film, storefront|2024",
      "Coppersmith Cider|Food & drink|Identity, packaging, labels|2023",
      "Verdance Farms|Agriculture|Naming, identity, wayfinding|2023",
    ].join("\n"),
  }),
  block(
    "openforge-cms.stats-row",
    { heading: "Across the portfolio" },
    {
      items: [
        block("openforge-cms.stat", {
          value: "68",
          label: "Full identity systems shipped",
        }),
        block("openforge-cms.stat", {
          value: "26",
          label: "Countries the work has launched in",
        }),
        block("openforge-cms.stat", {
          value: "81%",
          label: "Of revenue from repeat clients",
        }),
      ],
    },
  ),
  block("openforge-cms.testimonial", {
    quote:
      "They shipped our storefront the same week they shipped the packaging artwork, and both felt like the same company had made them. That sounds obvious. In nine years of hiring agencies it has happened exactly once.",
    author: "Ruth Oyelaran",
    role: "Founder, Sundial Athletic",
    avatar: portrait("Ruth Oyelaran"),
  }),
  studioCta,
];

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */

const servicesBlocks = [
  block("openforge-cms.hero", {
    heading: "Services",
    subheading:
      "We do three things and refuse the rest. If your problem is not on this page, we will tell you so on the first call and usually name someone better suited.",
    ctaLabel: "Check availability",
    ctaHref: "/contact",
  }),
  block("openforge-cms.feature-list", {
    heading: "How companies usually arrive here",
    items: [
      "The company outgrew the brand it started with and every new hire describes it differently.",
      "A funding round, merger, or new category is about to make the old positioning indefensible.",
      "The product got good but the website still sells the 2019 version of it.",
      "Marketing and product have quietly become two different brands wearing the same logo.",
      "A launch date is fixed, immovable, and closer than anyone is comfortable admitting.",
    ].join("\n"),
  }),
  block("openforge-cms.spotlight-card", {
    icon: "◆",
    title: "Brand identity",
    description:
      "Positioning, naming, verbal identity, marks, type systems, colour, motion, and packaging. Delivered as a living design system with the reasoning attached, plus the rollout plan for getting it past your own organisation.",
    tone: "amber",
  }),
  block("openforge-cms.spotlight-card", {
    icon: "▲",
    title: "Digital product and web",
    description:
      "Marketing sites, product interfaces, and design systems. Designed in the browser at real breakpoints with real content, built alongside your engineers, and handed over as components rather than screenshots.",
    tone: "cyan",
  }),
  block("openforge-cms.spotlight-card", {
    icon: "●",
    title: "Motion and launch",
    description:
      "Launch film, stills, environmental graphics, sales collateral, and the internal deck that makes your own team fluent in the new brand before the public sees a pixel of it.",
    tone: "rose",
  }),
  block("openforge-cms.data-table", {
    heading: "Engagement shapes",
    headers: "Engagement,Typical length,Team,Starts at",
    rows: [
      "Positioning sprint|3 weeks|Strategy lead + creative director|$28,000",
      "Full identity system|10-14 weeks|Five, including a writer|$140,000",
      "Website or product UI|8-12 weeks|Four, embedded with your engineers|$95,000",
      "Launch package|4-6 weeks|Motion lead + producer + director|$60,000",
      "Retained design partner|6 months minimum|Two to four, fractional|$18,000 / month",
    ].join("\n"),
  }),
  block(
    "openforge-cms.accordion",
    { heading: "Before you ask" },
    {
      items: [
        block("openforge-cms.faq-item", {
          question: "Do you pitch for free?",
          answer:
            "No. We will spend an hour on your problem at no charge, share references and a point of view, and quote a paid discovery week if the fit is right. Speculative creative is how studios go out of business and how clients end up buying the prettiest guess in the room.",
        }),
        block("openforge-cms.faq-item", {
          question: "Can you work with our in-house design team?",
          answer:
            "That is our favourite arrangement. Roughly half our engagements are co-owned with an internal team — we bring the outside view and the systems discipline, they bring context we could not buy, and the system stays alive after we leave.",
        }),
        block("openforge-cms.faq-item", {
          question: "What does the handover actually include?",
          answer:
            "Source files, a published design system with live components, written usage rationale, motion specs, production-ready artwork, and two half-day training sessions for whoever inherits it. Plus a standing invitation to send us work for a sanity check for a year afterwards.",
        }),
        block("openforge-cms.faq-item", {
          question: "How far out are you booked?",
          answer:
            "Usually six to ten weeks for a full engagement, and we cap the studio at four active projects. If your date is immovable and sooner than that, say so in the first email and we will tell you honestly whether it is possible.",
        }),
      ],
    },
  ),
  block("openforge-cms.banner", {
    message: "Two engagement slots open for next quarter.",
    ctaLabel: "Ask about dates",
    ctaHref: "/contact",
    tone: "dark",
  }),
  studioCta,
];

/* ------------------------------------------------------------------ */
/* Process                                                             */
/* ------------------------------------------------------------------ */

const processBlocks = [
  block("openforge-cms.hero", {
    heading: "Process",
    subheading:
      "No black box, no big reveal. You see the work every week, in the state it is actually in, and you make decisions with us rather than reacting to them afterwards.",
    ctaLabel: "Talk through your timeline",
    ctaHref: "/contact",
  }),
  block("openforge-cms.rich-text", {
    content:
      "The theatrical agency reveal exists to protect the agency, not the work. It concentrates every hard conversation into one ninety-minute meeting where the client has no context and the studio has no room to move.\n\nWe run the opposite way. Every Thursday you get the current state of the work, including the parts that are not working yet, and a short note on what we are deciding next. By the time anything is presented formally, nobody in the room is surprised by it.",
  }),
  block(
    "openforge-cms.timeline",
    { heading: "A typical ten-week identity engagement" },
    {
      items: [
        block("openforge-cms.timeline-step", {
          date: "Weeks 1-2",
          title: "Interrogate",
          description:
            "Stakeholder interviews, customer calls, a competitive teardown, and an audit of everything you currently ship. We end with a written point of view on what is actually holding the business back — which occasionally means telling you the brand is not the problem.",
        }),
        block("openforge-cms.timeline-step", {
          date: "Week 3",
          title: "Position",
          description:
            "One page: who you are for, what you are against, and the sentence you want repeated back to you in a sales call. Signed off before a single mark is drawn, because everything downstream is judged against it.",
        }),
        block("openforge-cms.timeline-step", {
          date: "Weeks 4-7",
          title: "Design",
          description:
            "Two territories developed in parallel, in the open. Marks, type, colour, motion, photography direction, and real applications — a pitch deck, an invoice, an app screen, a truck — because a logo on a white square proves nothing.",
        }),
        block("openforge-cms.timeline-step", {
          date: "Weeks 8-9",
          title: "Systematise",
          description:
            "The chosen direction becomes a system: tokens, components, grids, motion specs, and written rationale. Your engineers get a real library. Your marketing team gets templates they cannot break.",
        }),
        block("openforge-cms.timeline-step", {
          date: "Week 10",
          title: "Land it",
          description:
            "Rollout plan, launch assets, and the internal session that turns your own team into the brand's first defenders. We stay on call through the first month of the rollout at no extra charge.",
        }),
      ],
    },
  ),
  block("openforge-cms.icon-box", {
    icon: "◷",
    title: "Weekly, not milestone-based",
    description:
      "A working session every Thursday for the length of the engagement. Forty-five minutes, cameras on, no deck unless a deck is the deliverable.",
    layout: "icon-left",
  }),
  block("openforge-cms.icon-box", {
    icon: "✎",
    title: "One decision-maker",
    description:
      "We ask for a single person with authority to say yes. Committees do not choose bad work — they choose the work nobody objects to, which is worse.",
    layout: "icon-left",
  }),
  block("openforge-cms.icon-box", {
    icon: "⌁",
    title: "Built while it is designed",
    description:
      "An engineer from our side is in the file from week four. Nothing gets designed that cannot be built, and nothing gets built that nobody designed.",
    layout: "icon-left",
  }),
  block("openforge-cms.feature-list", {
    heading: "What is in your hands at the end",
    items: [
      "A written positioning page your sales team can quote from memory.",
      "Logo, type, and colour systems in production-ready formats, with usage rationale.",
      "A live design system: tokens, components, and motion specs, versioned in your repo.",
      "Photography and illustration direction with real shot lists, not mood collages.",
      "A rollout plan sequenced by cost and visibility, so the expensive changes wait.",
      "Two half-day training sessions and a year of on-call sanity checks.",
    ].join("\n"),
  }),
  block("openforge-cms.testimonial", {
    quote:
      "The Thursday sessions were the whole thing. We never once sat through a reveal, and we never once got a deliverable we had to argue with. By week ten our board approved the identity in eleven minutes because they had watched it get built.",
    author: "Callum Reidy",
    role: "Chief Marketing Officer, Ninebark Health",
    avatar: portrait("Callum Reidy"),
  }),
  studioCta,
];

/* ------------------------------------------------------------------ */
/* Studio                                                              */
/* ------------------------------------------------------------------ */

const studioBlocks = [
  block("openforge-cms.hero", {
    heading: "Studio",
    subheading:
      "Twelve people in a converted machine shop in Portland, Oregon. Independent since 2015 and intending to stay that way.",
    ctaLabel: "Work with us",
    ctaHref: "/contact",
  }),
  block("openforge-cms.rich-text", {
    content:
      "Rivetwork started in 2015 because two of us were tired of watching good strategy die between the deck and the build. The studio has stayed deliberately small ever since: twelve people, four active projects, no account layer between you and whoever is holding the pen.\n\nWe take on work where design changes the shape of the business, not just the surface of it. That usually means a company at an inflection point — a new category, a new owner, a product that finally outgrew its story.\n\nWe are not the cheapest option and we are rarely the fastest. We are very hard to argue with once the work is on the wall.",
  }),
  block("openforge-cms.image", {
    src: artwork("The machine shop", 1400, 800, "#1a1a1c"),
    alt: "The Rivetwork studio floor: long shared benches, pinned-up work on every wall, and a print table at the far end.",
    caption:
      "Everything gets printed and pinned. Work that only ever exists at 100% zoom on a retina display is work nobody has really looked at.",
  }),
  block("openforge-cms.heading", {
    text: "The people",
    level: "h2",
    align: "left",
  }),
  block("openforge-cms.team-member", {
    name: "Dara Okonjo",
    role: "Founder, Executive Creative Director",
    bio: "Twenty years across identity and editorial, six of them in-house at a freight company, which is why she can talk to a logistics board without flinching. Runs positioning on every engagement and draws far more than a founder should.",
    photo: portrait("Dara Okonjo"),
  }),
  block("openforge-cms.team-member", {
    name: "Milo Ferreira",
    role: "Design Director, Brand",
    bio: "Type-first, obsessively so. Built the Kestrel operations style guide and the Coppersmith label system. Keeps a drawer of failed logotypes he will show you if you ask, which is the most useful thing in the studio.",
    photo: portrait("Milo Ferreira"),
  }),
  block("openforge-cms.team-member", {
    name: "Sasha Reyne",
    role: "Design Director, Digital Product",
    bio: "Designs in the browser and writes enough code to be dangerous in a code review. Led the Ninebark portal redesign and owns the studio's component library practice.",
    photo: portrait("Sasha Reyne"),
  }),
  block("openforge-cms.team-member", {
    name: "Junie Park",
    role: "Strategy Director",
    bio: "Ex-journalist. Runs the customer interviews and writes the positioning page. Responsible for the studio's least popular and most valuable habit: telling clients when the brand is not the problem.",
    photo: portrait("Junie Park"),
  }),
  block(
    "openforge-cms.avatar-group",
    {
      caption:
        "Plus eight more: motion, production, writing, and the engineer who keeps us honest.",
    },
    {
      items: [
        block("openforge-cms.avatar-item", {
          image: portrait("Tomas Halvard"),
          name: "Tomas Halvard",
        }),
        block("openforge-cms.avatar-item", {
          image: portrait("Ade Balogun"),
          name: "Ade Balogun",
        }),
        block("openforge-cms.avatar-item", {
          image: portrait("Wren Castellano"),
          name: "Wren Castellano",
        }),
        block("openforge-cms.avatar-item", {
          image: portrait("Nils Boettcher"),
          name: "Nils Boettcher",
        }),
      ],
    },
  ),
  block(
    "openforge-cms.stats-row",
    { heading: "The studio, in numbers" },
    {
      items: [
        block("openforge-cms.stat", { value: "12", label: "People on staff" }),
        block("openforge-cms.stat", {
          value: "4",
          label: "Active projects, hard cap",
        }),
        block("openforge-cms.stat", {
          value: "2015",
          label: "Independent since",
        }),
        block("openforge-cms.stat", {
          value: "5.1 yrs",
          label: "Median tenure at the studio",
        }),
      ],
    },
  ),
  block("openforge-cms.feature-list", {
    heading: "What we believe, stated plainly",
    items: [
      "A brand is an argument, not a decoration. If you cannot say what it is against, it is not one.",
      "Systems beat artefacts. The tenth application matters more than the first.",
      "Show the work weekly and ugly. Reveals protect the studio, never the client.",
      "Design that cannot be built is a hobby. An engineer is in the file from week four.",
      "Say no to work we would do badly. We name a better studio roughly once a month.",
    ].join("\n"),
  }),
  block(
    "openforge-cms.logo-cloud",
    { heading: "People who have trusted us with it" },
    { items: clientLogos },
  ),
  studioCta,
];

/* ------------------------------------------------------------------ */
/* Contact                                                             */
/* ------------------------------------------------------------------ */

const contactBlocks = [
  block("openforge-cms.hero", {
    heading: "Tell us what is broken.",
    subheading:
      "One email, one hour, one honest answer about whether we are the right studio for it. We reply to everything within two working days, including the projects we turn down.",
    ctaLabel: "Email the studio",
    ctaHref: "mailto:studio@rivetwork.example",
  }),
  block("openforge-cms.feature-list", {
    heading: "Send us these five things and the first call will be useful",
    items: [
      "What the company does, in the words you would use to a stranger at a bar.",
      "What is going wrong now — internally, in sales, or in the product.",
      "The date that cannot move, and what happens if it does.",
      "Roughly what you have set aside. A range is fine; a blank is not.",
      "Who signs off, and whether they will be on the call.",
    ].join("\n"),
  }),
  block("openforge-cms.data-table", {
    heading: "Where we are",
    headers: "Studio,Address,Hours",
    rows: [
      "Portland (main)|418 SE Ankeny Street, Building C, Portland OR 97214|Mon-Thu 9-6 PT",
      "Chicago (satellite)|By appointment, West Loop|Tue-Thu 10-5 CT",
    ].join("\n"),
  }),
  block("openforge-cms.button", {
    label: "studio@rivetwork.example",
    href: "mailto:studio@rivetwork.example",
    variant: "primary",
  }),
  block(
    "openforge-cms.accordion",
    { heading: "Working together" },
    {
      items: [
        block("openforge-cms.faq-item", {
          question: "What is the smallest project you take?",
          answer:
            "A three-week positioning sprint at $28,000. Below that we are not adding enough to justify the disruption, and we will say so rather than take the work and under-serve it.",
        }),
        block("openforge-cms.faq-item", {
          question: "Do you work with early-stage companies?",
          answer:
            "Often, usually right after a raise and right before a category push. We are a poor fit pre-product — at that stage you need customers telling you what you are, not a studio.",
        }),
        block("openforge-cms.faq-item", {
          question: "Can you sign our NDA?",
          answer:
            "Yes, mutual NDAs same day. We do not sign non-competes covering entire sectors, since we would have to stop taking healthcare and logistics work altogether.",
        }),
      ],
    },
  ),
  block("openforge-cms.cta", {
    heading: "The first call is an hour and costs nothing.",
    buttonLabel: "Get in touch",
    buttonHref: "mailto:studio@rivetwork.example",
  }),
];

/* ------------------------------------------------------------------ */
/* Case study post                                                     */
/* ------------------------------------------------------------------ */

const kestrelCaseStudyBlocks = [
  block("openforge-cms.badge", { text: "Case study", tone: "accent" }),
  block("openforge-cms.gradient-heading", {
    text: "From regional carrier to logistics platform",
    level: "h2",
    tone: "sunset",
  }),
  block("openforge-cms.rich-text", {
    content:
      "Kestrel Freight moved forty years of freight on eleven hundred trucks and was still introducing itself as a trucking company. Meanwhile two thirds of its margin now came from the software its dispatchers had quietly built in-house — a routing and visibility platform its own customers were using daily without ever hearing it named.\n\nThe brand described the business Kestrel used to be. Enterprise buyers priced them like a carrier. Engineers would not apply. The board wanted a new logo. We told them the logo was the last problem on the list.",
  }),
  block("openforge-cms.image", {
    src: artwork("Kestrel livery", 1400, 800),
    alt: "A Kestrel Freight trailer in the new livery: matte black with a single vermilion mark and large-scale plate lettering.",
    caption:
      "The livery had to read at seventy miles an hour from three lanes over, and survive being washed four hundred times.",
  }),
  block("openforge-cms.heading", {
    text: "What we did",
    level: "h2",
    align: "left",
  }),
  block("openforge-cms.feature-list", {
    heading: "Ten weeks, five workstreams",
    items: [
      "Repositioned the company around visibility and reliability rather than capacity.",
      "Built a full identity system: mark, plate-inspired type family, motion, and photography direction.",
      "Designed the fleet livery for eleven hundred trailers, with a fourteen-month rollout sequenced by depot.",
      "Redesigned the driver application around one-handed use in a moving cab.",
      "Wrote a 900-page operations style guide covering invoices, decals, hi-vis, and depot signage.",
    ].join("\n"),
  }),
  block(
    "openforge-cms.stats-row",
    { heading: "Twelve months after launch" },
    {
      items: [
        block("openforge-cms.stat", {
          value: "3.4x",
          label: "Qualified enterprise inbound",
        }),
        block("openforge-cms.stat", {
          value: "-41%",
          label: "Time to fill engineering roles",
        }),
        block("openforge-cms.stat", {
          value: "$180M",
          label: "Growth round raised post-relaunch",
        }),
      ],
    },
  ),
  block("openforge-cms.data-table", {
    heading: "Scope and delivery",
    headers: "Workstream,Delivered,Owner after handover",
    rows: [
      "Positioning|Week 3|Kestrel marketing",
      "Identity system|Week 9|Kestrel brand team",
      "Fleet livery|Week 10, rollout to month 14|Fleet operations",
      "Driver app UI|Week 12|Kestrel product",
      "Operations style guide|Week 14|Kestrel brand team",
    ].join("\n"),
  }),
  block("openforge-cms.testimonial", {
    quote:
      "The trailers were the part everyone noticed. The part that changed the company was a single sentence on page one of the positioning document, which our sales team now uses verbatim.",
    author: "Imani Vasquez",
    role: "Chief Executive, Kestrel Freight",
    avatar: portrait("Imani Vasquez"),
  }),
  block("openforge-cms.divider", { style: "solid" }),
  block("openforge-cms.cta", {
    heading: "Similar problem, different industry?",
    buttonLabel: "Start a conversation",
    buttonHref: "/contact",
  }),
];

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

const footerBlocks = [
  block(
    "openforge-cms.footer",
    {
      copyrightText:
        "© 2026 Rivetwork Studio. 418 SE Ankeny Street, Portland, Oregon.",
    },
    {
      links: [
        block("openforge-cms.rich-text", { content: "Work" }),
        block("openforge-cms.rich-text", { content: "Services" }),
        block("openforge-cms.rich-text", { content: "Process" }),
        block("openforge-cms.rich-text", { content: "Studio" }),
        block("openforge-cms.rich-text", { content: "Contact" }),
      ],
    },
  ),
];

/* ------------------------------------------------------------------ */

export const exampleSite = {
  themeId: "openforge-theme.agency",
  name: "Rivetwork",
  tagline: "An independent brand and digital studio.",
  description:
    "A six-page example site for a fictional twelve-person brand and digital studio, showing the Agency theme carrying real, opinionated copy across marketing pages and a case-study post.",
  pages: [
    {
      slug: "/",
      title: "Rivetwork",
      template: "page",
      region: "page-body",
      summary:
        "Statement hero, client roster, results, capability triptych, three case-study cards, and a close.",
      blocks: homeBlocks,
    },
    {
      slug: "/work",
      title: "Work",
      template: "page",
      region: "page-body",
      summary:
        "A carousel of shipped work, three case-study cards, an engagement table, and portfolio-wide numbers.",
      blocks: workBlocks,
    },
    {
      slug: "/services",
      title: "Services",
      template: "page",
      region: "page-body",
      summary:
        "Three disciplines as spotlight cards, an engagement price table, and a straight-talking FAQ.",
      blocks: servicesBlocks,
    },
    {
      slug: "/process",
      title: "Process",
      template: "page",
      region: "page-body",
      summary:
        "A five-step ten-week timeline, the three rules the studio works by, and the full deliverables list.",
      blocks: processBlocks,
    },
    {
      slug: "/studio",
      title: "Studio",
      template: "page",
      region: "page-body",
      summary:
        "Origin story, four team members, the wider team, studio numbers, and a plainly stated set of beliefs.",
      blocks: studioBlocks,
    },
    {
      slug: "/contact",
      title: "Contact",
      template: "page",
      region: "page-body",
      summary:
        "What to send in the first email, studio locations, a direct mail link, and engagement FAQs.",
      blocks: contactBlocks,
    },
  ],
  posts: [
    {
      slug: "/work/kestrel-freight",
      title: "Kestrel Freight: from regional carrier to logistics platform",
      template: "post",
      region: "post-body",
      publishedAt: "2026-03-17T00:00:00.000Z",
      summary:
        "A full case-study post exercising the post-body region: problem, scope, imagery, results, and proof.",
      blocks: kestrelCaseStudyBlocks,
    },
  ],
  footer: {
    region: "footer",
    blocks: footerBlocks,
  },
};
