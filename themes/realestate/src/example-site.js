/**
 * A complete example site for the Realestate theme.
 *
 * Every page's `blocks` array is a real OpenForge content tree: an array of
 * `{ blockId, blockVersion, props, slots }` nodes that satisfies
 * `parseContentTree` from `@openforge/renderer` and renders through
 * `createRenderer` without any block reporting a missing required prop.
 *
 * The agency, the coastline, the neighborhoods, the agents, and the homes are
 * all invented. Nothing here refers to a real brokerage or a real address —
 * it is demonstration copy, written specifically enough to show what the
 * theme looks like with real sentences in it.
 */

const NAVY = "#12233f";
const HARBOR = "#22415f";
const SEAGRASS = "#3c5a4a";
const BRASS = "#8a6a24";
const STONE = "#5c5348";

/**
 * A self-contained SVG placeholder, so the example site renders with no
 * network access and no binary assets checked into the repo. Replace these
 * with real photography when you seed a live site.
 *
 * @param {{ width: number, height: number, tone: string, label: string }} options
 * @returns {string} a `data:image/svg+xml,...` URL
 */
function placeholder({ width, height, tone, label }) {
  const fontSize = Math.max(14, Math.round(height / 12));
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" ` +
    `viewBox="0 0 ${width} ${height}">` +
    `<rect width="${width}" height="${height}" fill="${tone}"/>` +
    `<text x="50%" y="50%" fill="#f7f4ee" font-family="Georgia, serif" ` +
    `font-size="${fontSize}" text-anchor="middle" dominant-baseline="middle">` +
    `${label}</text>` +
    `</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const photo = (label, tone = NAVY) =>
  placeholder({ width: 1200, height: 800, tone, label });

const portrait = (label, tone = HARBOR) =>
  placeholder({ width: 600, height: 600, tone, label });

/**
 * @param {string} blockId
 * @param {Record<string, unknown>} [props]
 * @param {Record<string, object[]>} [slots]
 */
function block(blockId, props = {}, slots = {}) {
  return { blockId, blockVersion: 1, props, slots };
}

// --- Listing cards, reused between the home page and the listings page. ---
// There is no dedicated "listing grid" block in the official set, so a grid
// is `card` blocks nested in a `columns` block. That is the honest way to
// build one out of what actually exists.

const ridgeHouseCard = block("openforge-cms.card", {
  image: photo("Kestrel Bluff - Ridge House"),
  title: "The Ridge House at Kestrel Bluff",
  description:
    "$2,395,000 - 4 bed, 3.5 bath, 3,410 sq ft on 0.61 acres. A 1974 post-and-beam taken back to the studs in 2023, with west-facing glass across the whole main floor and a bluff-edge terrace.",
  linkLabel: "View this home",
  linkHref: "/listings/ridge-house-kestrel-bluff",
});

const saltmeadowCard = block("openforge-cms.card", {
  image: photo("Saltmeadow Reach - Cottage", SEAGRASS),
  title: "Saltmeadow Reach Cottage",
  description:
    "$845,000 - 3 bed, 2 bath, 1,620 sq ft. A cedar-shingled cottage two lots back from the marsh boardwalk, with a wood stove, a mudroom built for wet boots, and a fenced south garden.",
  linkLabel: "View this home",
  linkHref: "/listings/saltmeadow-reach-cottage",
});

const copperlineCard = block("openforge-cms.card", {
  image: photo("Copperline Hill - Farmhouse", STONE),
  title: "Copperline Hill Farmhouse",
  description:
    "$1,150,000 - 4 bed, 2.5 bath, 2,480 sq ft on 3.2 acres. An 1898 farmhouse with a rebuilt foundation, a working orchard of 40 trees, and a barn already wired for a studio or workshop.",
  linkLabel: "View this home",
  linkHref: "/listings/copperline-hill-farmhouse",
});

const tidewellCard = block("openforge-cms.card", {
  image: photo("Tidewell Harbor - Loft", HARBOR),
  title: "Tidewell Harbor Loft",
  description:
    "$612,000 - 2 bed, 2 bath, 1,180 sq ft. A top-floor conversion in the old cannery building, with 12-foot ceilings, original roof trusses, and a deeded parking space one block from the ferry.",
  linkLabel: "View this home",
  linkHref: "/listings/tidewell-harbor-loft",
});

const larkspurCard = block("openforge-cms.card", {
  image: photo("Larkspur Wharf - Boathouse", BRASS),
  title: "Larkspur Wharf Boathouse",
  description:
    "$1,780,000 - 3 bed, 3 bath, 2,050 sq ft with a deep-water slip. A 1930s boathouse rebuilt as a year-round residence, with the original marine rail kept as the entry stair.",
  linkLabel: "View this home",
  linkHref: "/listings/larkspur-wharf-boathouse",
});

const oldTownCard = block("openforge-cms.card", {
  image: photo("Alderport - Old Town Row House", STONE),
  title: "Alderport Old Town Row House",
  description:
    "$729,000 - 3 bed, 1.5 bath, 1,940 sq ft. An 1902 brick row house on the pedestrian side of Old Town, with restored plaster mouldings, a slate roof replaced in 2021, and a walled rear courtyard.",
  linkLabel: "View this home",
  linkHref: "/listings/alderport-old-town-row-house",
});

// --- Pages ---

const homePage = {
  slug: "/",
  title: "Halcyon Bay Property Group",
  template: "page",
  description:
    "The brokerage home page: positioning, market numbers, three featured listings, a property photo carousel, and a seller call to action.",
  blocks: [
    block("openforge-cms.hero", {
      heading: "Coastal homes, handled properly.",
      subheading:
        "We have represented buyers and sellers along this stretch of the north shore for nineteen years. We take fewer listings than the large brokerages do, and we have walked every one of them before it goes live.",
      ctaLabel: "Browse current listings",
      ctaHref: "/listings",
    }),
    block(
      "openforge-cms.stats-row",
      { heading: "The market we actually work in" },
      {
        items: [
          block("openforge-cms.stat", {
            value: "312",
            label: "Homes closed in the last 24 months",
          }),
          block("openforge-cms.stat", {
            value: "17 days",
            label: "Median time to an accepted offer",
          }),
          block("openforge-cms.stat", {
            value: "98.4%",
            label: "Median sale price against list price",
          }),
          block("openforge-cms.stat", {
            value: "19 years",
            label: "Working this coastline",
          }),
        ],
      },
    ),
    block("openforge-cms.heading", {
      text: "This week's featured homes",
      level: "h2",
      align: "center",
    }),
    block(
      "openforge-cms.columns",
      {},
      { items: [ridgeHouseCard, saltmeadowCard, tidewellCard] },
    ),
    block("openforge-cms.button", {
      label: "See all 24 homes for sale",
      href: "/listings",
      variant: "outline",
    }),
    block("openforge-cms.divider", {}),
    block(
      "openforge-cms.carousel",
      { heading: "Inside the Ridge House at Kestrel Bluff" },
      {
        items: [
          block("openforge-cms.carousel-slide", {
            image: photo("Ridge House - main floor"),
            caption:
              "The main floor after the 2023 renovation: original beams, new west glazing.",
          }),
          block("openforge-cms.carousel-slide", {
            image: photo("Ridge House - kitchen", HARBOR),
            caption: "Kitchen rebuilt around the existing chimney mass.",
          }),
          block("openforge-cms.carousel-slide", {
            image: photo("Ridge House - terrace", SEAGRASS),
            caption: "The bluff-edge terrace, roughly 40 feet above the water.",
          }),
          block("openforge-cms.carousel-slide", {
            image: photo("Ridge House - approach", STONE),
            caption: "The approach from the lane, with the 2023 cedar siding.",
          }),
        ],
      },
    ),
    block("openforge-cms.divider", {}),
    block(
      "openforge-cms.columns",
      { heading: "What listing with us actually involves" },
      {
        items: [
          block("openforge-cms.icon-box", {
            icon: "\u{1F4D0}",
            title: "A pricing meeting, not a pitch",
            description:
              "We bring the last 18 months of comparable closings for your specific block and show you the range we can defend in an appraisal. If we think you should wait a season, we say so.",
            layout: "icon-top",
          }),
          block("openforge-cms.icon-box", {
            icon: "\u{1F4F7}",
            title: "Photography scheduled around the light",
            description:
              "Every listing is shot by the same photographer, and waterfront homes are shot in the two hours before sunset. Floor plans and a measured square footage come as standard.",
            layout: "icon-top",
          }),
          block("openforge-cms.icon-box", {
            icon: "\u{1F5DD}",
            title: "One agent from listing to closing",
            description:
              "The agent who prices your home runs your open houses, negotiates your offers, and sits at your closing table. Nothing is handed to a junior partway through.",
            layout: "icon-top",
          }),
        ],
      },
    ),
    block("openforge-cms.testimonial", {
      quote:
        "We had been told our house needed a full kitchen renovation before it could list. Nadia walked it, disagreed, and suggested we spend a tenth of that on paint, the front steps, and better lighting. It went under contract in eleven days, over asking.",
      author: "Marguerite and Owen Dalby",
      role: "Sold on Copperline Hill",
      avatar: portrait("MD", SEAGRASS),
    }),
    block("openforge-cms.cta", {
      heading: "Thinking about selling this spring?",
      buttonLabel: "Request a valuation",
      buttonHref: "/contact",
    }),
  ],
};

const listingsPage = {
  slug: "/listings",
  title: "Homes for sale",
  template: "page",
  description:
    "The listing index: an announcement banner, two card grids of six homes, a price-band table, and what every listing page includes.",
  blocks: [
    block("openforge-cms.banner", {
      message:
        "New listings are posted here on Thursday mornings, before they reach the syndicated portals.",
      ctaLabel: "Get the Thursday email",
      ctaHref: "/contact",
      tone: "dark",
    }),
    block("openforge-cms.rich-text", {
      content:
        "Twenty-four homes are for sale with us right now, from a two-bedroom cannery loft to a bluff-edge house on six-tenths of an acre. Six of them are shown below.\n\nEverything on this page is priced against closed comparables from the last eighteen months, not against wishful asking prices. Where we think a home is priced ahead of the market, we tell buyers that during the showing.",
    }),
    block("openforge-cms.heading", {
      text: "Waterfront and bluff",
      level: "h2",
      align: "left",
    }),
    block(
      "openforge-cms.columns",
      {},
      { items: [ridgeHouseCard, larkspurCard, tidewellCard] },
    ),
    block("openforge-cms.spacer", { size: "lg" }),
    block("openforge-cms.heading", {
      text: "Village, hill, and marsh",
      level: "h2",
      align: "left",
    }),
    block(
      "openforge-cms.columns",
      {},
      { items: [saltmeadowCard, copperlineCard, oldTownCard] },
    ),
    block("openforge-cms.divider", {}),
    block("openforge-cms.data-table", {
      heading: "What the current inventory looks like",
      headers:
        "Price band, Homes available, Median days on market, Typical type",
      rows: [
        "Under $700,000|5|31|Cottages and village flats",
        "$700,000 - $1.2M|9|22|Row houses and hill farmhouses",
        "$1.2M - $2M|7|26|Water-view and harbor-front",
        "Above $2M|3|48|Bluff-edge and deep-water",
      ].join("\n"),
    }),
    block("openforge-cms.feature-list", {
      heading: "On every listing page",
      items: [
        "A measured floor plan with stated square footage, not an estimate from the tax record",
        "The full disclosure packet, downloadable before you book a showing",
        "Flood zone, septic or sewer, and well or municipal water stated plainly",
        "Heating system, its age, and last year's average monthly cost",
        "What the sellers are including, down to the appliances and window treatments",
      ].join("\n"),
    }),
    block("openforge-cms.cta", {
      heading: "Want to see two or three of these in one afternoon?",
      buttonLabel: "Schedule a tour",
      buttonHref: "/contact",
    }),
  ],
};

const featuredPropertyPage = {
  slug: "/listings/ridge-house-kestrel-bluff",
  title: "The Ridge House at Kestrel Bluff",
  template: "page",
  description:
    "A single-property detail page: photo carousel, key specs as a stats row, description, feature list, full detail table, floor plan, buyer FAQ, listing agent, and a tour CTA.",
  blocks: [
    block("openforge-cms.badge", { text: "For sale", tone: "accent" }),
    block("openforge-cms.rich-text", {
      content:
        "$2,395,000. Four bedrooms, three and a half baths, 3,410 square feet on 0.61 acres, with roughly 180 feet of bluff frontage facing west across the sound.",
    }),
    block(
      "openforge-cms.carousel",
      { heading: "The house" },
      {
        items: [
          block("openforge-cms.carousel-slide", {
            image: photo("Ridge House - west elevation"),
            caption: "West elevation from the terrace lawn.",
          }),
          block("openforge-cms.carousel-slide", {
            image: photo("Ridge House - living room", HARBOR),
            caption:
              "The main room, with the original 1974 post-and-beam frame left exposed.",
          }),
          block("openforge-cms.carousel-slide", {
            image: photo("Ridge House - kitchen", SEAGRASS),
            caption: "Kitchen and pantry, rebuilt in 2023.",
          }),
          block("openforge-cms.carousel-slide", {
            image: photo("Ridge House - primary bedroom", STONE),
            caption:
              "Primary bedroom, east wing, with its own stair to the garden.",
          }),
          block("openforge-cms.carousel-slide", {
            image: photo("Ridge House - bluff terrace"),
            caption: "The bluff terrace at the end of the afternoon.",
          }),
        ],
      },
    ),
    block(
      "openforge-cms.stats-row",
      {},
      {
        items: [
          block("openforge-cms.stat", { value: "4", label: "Bedrooms" }),
          block("openforge-cms.stat", { value: "3.5", label: "Bathrooms" }),
          block("openforge-cms.stat", {
            value: "3,410",
            label: "Square feet, measured",
          }),
          block("openforge-cms.stat", { value: "0.61", label: "Acres" }),
        ],
      },
    ),
    block("openforge-cms.rich-text", {
      content:
        "The Ridge House was built in 1974 by a regional architect who worked almost exclusively in post-and-beam, and it kept its original frame through a full renovation in 2023. The work took the house back to the studs: new insulation throughout, a new roof, new cedar siding, rewired to current code, and a heat pump system that replaced the original electric baseboard.\n\nWhat the renovation did not do is rearrange the plan. The main floor is still one long west-facing room stepping down to the terrace, with the kitchen tucked behind the chimney mass and the bedrooms held in a quieter east wing. The glass is new and much larger, but the sequence of rooms is the one the architect drew.\n\nThe lot runs to the bluff edge and is planted almost entirely in native grasses and shore pine, which means no irrigation and very little mowing. A survey from 2022 and a geotechnical assessment of the bluff face are both in the disclosure packet.",
    }),
    block("openforge-cms.feature-list", {
      heading: "Notable",
      items: [
        "Original 1974 post-and-beam frame, exposed throughout the main floor",
        "Full 2023 renovation: roof, siding, insulation, wiring, and mechanicals",
        "Ducted heat pump with backup, replacing the original electric baseboard",
        "Roughly 180 feet of west-facing bluff frontage",
        "Detached two-car garage with an unfinished 480 sq ft room above",
        "Native planting throughout, with no irrigation system to maintain",
      ].join("\n"),
    }),
    block("openforge-cms.data-table", {
      heading: "Property details",
      headers: "Detail, Value",
      rows: [
        "Year built|1974, renovated to the studs in 2023",
        "Lot|0.61 acres, surveyed in 2022",
        "Heating and cooling|Ducted heat pump, installed 2023",
        "Water and sewer|Municipal water, private septic, inspected 2024",
        "Roof|Standing seam metal, 2023",
        "Parking|Detached two-car garage plus a gravel court",
        "Annual property tax|$18,420 for the most recent assessed year",
        "Association|None",
      ].join("\n"),
    }),
    block("openforge-cms.image", {
      src: placeholder({
        width: 1200,
        height: 850,
        tone: HARBOR,
        label: "Ridge House - measured floor plan",
      }),
      alt:
        "Measured floor plan of the Ridge House showing the main floor, east bedroom wing, and terrace.",
      caption:
        "Measured floor plan. Square footage is taken from this drawing, not from the tax record.",
    }),
    block(
      "openforge-cms.accordion",
      { heading: "What buyers have asked about this house" },
      {
        items: [
          block("openforge-cms.faq-item", {
            question: "How stable is the bluff?",
            answer:
              "A geotechnical firm assessed the bluff face in 2022 and recommended no structural work, only that the native planting on the slope be left in place. Their full report is in the disclosure packet, and we will send it before a showing rather than after.",
          }),
          block("openforge-cms.faq-item", {
            question:
              "What did the 2023 renovation actually cost, and what is left to do?",
            answer:
              "The sellers have shared the contractor's final invoices, which are in the packet. The one unfinished item is the 480 square foot room above the garage: it is framed, roofed, and roughed in for plumbing, but not insulated or finished.",
          }),
          block("openforge-cms.faq-item", {
            question: "Is the house comfortable in winter?",
            answer:
              "The 2023 work added continuous exterior insulation and triple-glazed units on the west wall, which is the exposed side. Last winter's heating cost averaged $186 a month across December through February. The sellers will provide the full year of utility statements.",
          }),
          block("openforge-cms.faq-item", {
            question: "Can we bring our own inspector and surveyor?",
            answer:
              "Yes, and we would encourage it. The sellers have agreed to a ten-day inspection period with access for any licensed inspector, surveyor, or geotechnical engineer the buyer chooses.",
          }),
        ],
      },
    ),
    block("openforge-cms.heading", {
      text: "Listing agent",
      level: "h2",
      align: "left",
    }),
    block("openforge-cms.team-member", {
      name: "Nadia Okonkwo",
      role: "Principal broker",
      bio:
        "Nadia has listed bluff and waterfront property here since 2011 and handled the sale of this house the last time it changed hands. She will walk it with you herself, including the parts of the lot the photographs do not show.",
      photo: portrait("NO"),
    }),
    block("openforge-cms.cta", {
      heading: "See the Ridge House in person",
      buttonLabel: "Schedule a private tour",
      buttonHref: "/contact",
    }),
  ],
};

const aboutPage = {
  slug: "/about",
  title: "About the firm and our agents",
  template: "page",
  description:
    "The firm's story: a hero, a founding timeline, four agent profiles in a columns grid, client testimonials, and a rating.",
  blocks: [
    block("openforge-cms.hero", {
      heading: "A small brokerage, on purpose.",
      subheading:
        "Four agents, one office above the chandlery in Alderport, and a deliberate cap on how many listings we carry at once. We would rather turn work away than run a house we have not walked.",
      ctaLabel: "Talk to an agent",
      ctaHref: "/contact",
    }),
    block("openforge-cms.rich-text", {
      content:
        "Halcyon Bay Property Group started in 2007 with two agents and a filing cabinet of hand-typed comparables. The coastline has changed a great deal since then. Old Town went from half-empty to fully occupied, the cannery became lofts, and the bluff lots that nobody wanted in 2009 now set the top of the market.\n\nWhat has not changed is how we work. We still price from closed comparables rather than from what the neighbors are asking. We still write our own listing copy. And the agent who takes your call on the first day is the agent sitting beside you at the closing table.",
    }),
    block(
      "openforge-cms.timeline",
      { heading: "How the firm grew" },
      {
        items: [
          block("openforge-cms.timeline-step", {
            date: "2007",
            title: "Two agents, one office",
            description:
              "Opened above the chandlery in Alderport with a single listing: a marsh-side cottage that took nine months to sell.",
          }),
          block("openforge-cms.timeline-step", {
            date: "2012",
            title: "The bluff comes back",
            description:
              "Handled eleven bluff-lot sales in eighteen months as the market for west-facing land recovered, and began keeping our own comparable database for the bluff specifically.",
          }),
          block("openforge-cms.timeline-step", {
            date: "2018",
            title: "The cannery conversion",
            description:
              "Represented buyers on nineteen of the thirty-one units in the Tidewell cannery conversion, which reshaped what an entry-level home means in this market.",
          }),
          block("openforge-cms.timeline-step", {
            date: "2024",
            title: "Four agents, and a cap",
            description:
              "Grew to four agents and set a firm limit of thirty active listings, so that every home still gets a full pricing meeting and a walked inspection before it goes live.",
          }),
        ],
      },
    ),
    block("openforge-cms.heading", {
      text: "The agents",
      level: "h2",
      align: "center",
    }),
    block(
      "openforge-cms.columns",
      {},
      {
        items: [
          block("openforge-cms.team-member", {
            name: "Nadia Okonkwo",
            role: "Principal broker, bluff and waterfront",
            bio:
              "Founded the firm in 2007. Handles the bluff-edge and deep-water listings, and keeps the comparable database the rest of us price from.",
            photo: portrait("NO"),
          }),
          block("openforge-cms.team-member", {
            name: "Theo Marsden",
            role: "Associate broker, harbor and Old Town",
            bio:
              "Grew up two streets from the Old Town square and has sold most of the row houses on it at least once. Best person to ask about slate roofs and party walls.",
            photo: portrait("TM", SEAGRASS),
          }),
          block("openforge-cms.team-member", {
            name: "Priya Raghunathan",
            role: "Buyer representation lead",
            bio:
              "Works only with buyers, which means she has no listing of her own to steer you toward. Reads a disclosure packet faster than anyone in the office.",
            photo: portrait("PR", STONE),
          }),
          block("openforge-cms.team-member", {
            name: "Callum Whitmore",
            role: "Land, new construction, and rural",
            bio:
              "Handles bare land, septic and well questions, and anything that needs a surveyor before it needs a photographer. Licensed since 2014.",
            photo: portrait("CW", HARBOR),
          }),
        ],
      },
    ),
    block("openforge-cms.divider", {}),
    block(
      "openforge-cms.columns",
      { heading: "What clients said afterward" },
      {
        items: [
          block("openforge-cms.testimonial", {
            quote:
              "Priya talked us out of the first house we fell in love with. She had read the septic report properly and we had not. The house we did buy, two months later, was better in every way and cheaper.",
            author: "Ines Fournier-Barrow",
            role: "Bought in Saltmeadow Reach",
            avatar: portrait("IF", SEAGRASS),
          }),
          block("openforge-cms.testimonial", {
            quote:
              "Theo told us our row house would sell for less than the agent down the street had promised. He was right, and he sold it in three weeks at the number he gave us on day one. I would rather be told the truth early.",
            author: "Desmond Achterberg",
            role: "Sold in Alderport Old Town",
            avatar: portrait("DA", STONE),
          }),
        ],
      },
    ),
    block("openforge-cms.rating", {
      value: "5",
      label:
        "4.9 out of 5 across 148 client reviews collected after closing, 2022 to 2025",
    }),
    block("openforge-cms.cta", {
      heading: "Start with a conversation, not a contract",
      buttonLabel: "Book a call with an agent",
      buttonHref: "/contact",
    }),
  ],
};

const neighborhoodsPage = {
  slug: "/neighborhoods",
  title: "Neighborhoods on the north shore",
  template: "page",
  description:
    "A neighborhood guide: what to weigh when choosing, six area profiles as cards, a comparison table, and answers to the questions buyers ask when deciding.",
  blocks: [
    block("openforge-cms.rich-text", {
      content:
        "Six distinct places sit within twenty minutes of each other on this stretch of coast, and they behave like six different markets. A house on the bluff and a row house in Old Town can carry the same price and almost nothing else in common.\n\nThis page is what we would tell you over coffee before we started showing you anything.",
    }),
    block(
      "openforge-cms.columns",
      { heading: "What actually decides it" },
      {
        items: [
          block("openforge-cms.icon-box", {
            icon: "\u{1F6A2}",
            title: "The ferry timetable",
            description:
              "Tidewell and Larkspur run on the ferry. If you commute, the difference between the 6:40 and the 7:25 sailing shapes your morning more than any floor plan will.",
            layout: "icon-top",
          }),
          block("openforge-cms.icon-box", {
            icon: "\u{1F30A}",
            title: "Exposure and weather",
            description:
              "West-facing bluff homes get the light and the wind together. Marsh-side and hill properties are calmer, darker in winter, and considerably cheaper to heat.",
            layout: "icon-top",
          }),
          block("openforge-cms.icon-box", {
            icon: "\u{1F6B6}",
            title: "What you can reach on foot",
            description:
              "Old Town and the harbor are genuinely walkable to a grocer, a school, and a doctor. Copperline Hill and Kestrel Bluff are not, and no amount of view changes that.",
            layout: "icon-top",
          }),
        ],
      },
    ),
    block("openforge-cms.heading", {
      text: "The six areas",
      level: "h2",
      align: "left",
    }),
    block(
      "openforge-cms.columns",
      {},
      {
        items: [
          block("openforge-cms.card", {
            image: photo("Kestrel Bluff"),
            title: "Kestrel Bluff",
            description:
              "Large west-facing lots along the bluff road, mostly built between 1965 and 1985 and mostly renovated since. The top of the market, and the windiest place to live here. Nothing within walking distance.",
            linkLabel: "Homes in Kestrel Bluff",
            linkHref: "/listings",
          }),
          block("openforge-cms.card", {
            image: photo("Tidewell Harbor", HARBOR),
            title: "Tidewell Harbor",
            description:
              "The working harbor, the ferry terminal, and the cannery lofts. The entry point to this market for most buyers, and the only place here with real one- and two-bedroom inventory.",
            linkLabel: "Homes in Tidewell Harbor",
            linkHref: "/listings",
          }),
          block("openforge-cms.card", {
            image: photo("Alderport Old Town", STONE),
            title: "Alderport Old Town",
            description:
              "Brick row houses from the 1890s and 1900s around a pedestrian square. Slate roofs, party walls, and the shortest walk to a school and a grocer of anywhere on the shore.",
            linkLabel: "Homes in Old Town",
            linkHref: "/listings",
          }),
        ],
      },
    ),
    block("openforge-cms.spacer", { size: "md" }),
    block(
      "openforge-cms.columns",
      {},
      {
        items: [
          block("openforge-cms.card", {
            image: photo("Saltmeadow Reach", SEAGRASS),
            title: "Saltmeadow Reach",
            description:
              "Cedar cottages set back from the marsh boardwalk, sheltered from the west wind and cheap to heat. Quiet, buggy in August, and the best value per square foot on the shore.",
            linkLabel: "Homes in Saltmeadow Reach",
            linkHref: "/listings",
          }),
          block("openforge-cms.card", {
            image: photo("Copperline Hill", STONE),
            title: "Copperline Hill",
            description:
              "Farmhouses and orchard parcels of one to five acres, ten minutes inland and about four degrees colder. Well water and septic almost everywhere, so budget for the inspections.",
            linkLabel: "Homes on Copperline Hill",
            linkHref: "/listings",
          }),
          block("openforge-cms.card", {
            image: photo("Larkspur Wharf", BRASS),
            title: "Larkspur Wharf",
            description:
              "Converted boathouses and a short row of newer builds along the deep-water channel. Slips convey with several of the properties, which is what sets the pricing here.",
            linkLabel: "Homes at Larkspur Wharf",
            linkHref: "/listings",
          }),
        ],
      },
    ),
    block("openforge-cms.divider", {}),
    block("openforge-cms.data-table", {
      heading: "Side by side, over the last twelve months",
      headers:
        "Area, Median sale price, Median days on market, Walk to a grocer",
      rows: [
        "Kestrel Bluff|$2,140,000|48|No",
        "Larkspur Wharf|$1,690,000|39|No",
        "Copperline Hill|$1,085,000|29|No",
        "Alderport Old Town|$742,000|19|Yes, under five minutes",
        "Saltmeadow Reach|$688,000|24|No, ten minutes by car",
        "Tidewell Harbor|$596,000|16|Yes, under ten minutes",
      ].join("\n"),
    }),
    block(
      "openforge-cms.accordion",
      { heading: "Deciding between them" },
      {
        items: [
          block("openforge-cms.faq-item", {
            question: "Which areas are on municipal water and sewer?",
            answer:
              "Tidewell Harbor and Alderport Old Town are on both. Saltmeadow Reach and Kestrel Bluff are on municipal water with private septic. Copperline Hill is almost entirely well and septic, and Larkspur Wharf is mixed, parcel by parcel.",
          }),
          block("openforge-cms.faq-item", {
            question: "What does flood insurance look like here?",
            answer:
              "It varies by parcel, not by area. We pull the current flood zone determination for any home before you write an offer, and we will tell you what the last owner actually paid rather than quoting you a range.",
          }),
          block("openforge-cms.faq-item", {
            question:
              "Are there year-round residents, or is this a summer market?",
            answer:
              "Old Town, Tidewell, and Copperline Hill are predominantly year-round. Kestrel Bluff runs closer to half seasonal, which affects how lively the road feels in February and how quickly homes there sell.",
          }),
        ],
      },
    ),
    block("openforge-cms.cta", {
      heading: "Not sure which of these fits you yet?",
      buttonLabel: "Spend an afternoon with an agent",
      buttonHref: "/contact",
    }),
  ],
};

const contactPage = {
  slug: "/contact",
  title: "Schedule a tour",
  template: "page",
  description:
    "The contact and booking page: how to reach the office, what to bring to a first showing, an availability note, a short FAQ, and the booking CTA.",
  blocks: [
    block("openforge-cms.rich-text", {
      content:
        "Tell us which homes you want to see and roughly when, and we will put an afternoon together for you. If you are earlier than that and just want to know what your own house is worth, say so and we will come to you instead.",
    }),
    block(
      "openforge-cms.columns",
      { heading: "Reaching us" },
      {
        items: [
          block("openforge-cms.icon-box", {
            icon: "\u{1F3E2}",
            title: "The office",
            description:
              "Above the chandlery on the Alderport harbor front. Come up the outside stair; the door is usually open between nine and five.",
            layout: "icon-left",
          }),
          block("openforge-cms.icon-box", {
            icon: "\u{2709}",
            title: "Email and phone",
            description:
              "Email reaches all four agents and is answered within one business day. Calls go to whoever is not out at a showing, and they can pull up any listing while you talk.",
            layout: "icon-left",
          }),
          block("openforge-cms.icon-box", {
            icon: "\u{1F553}",
            title: "Showing hours",
            description:
              "Tuesday through Saturday, nine to six, plus Sunday afternoons by arrangement. Bluff and waterfront homes we try to show in the last two hours of daylight.",
            layout: "icon-left",
          }),
        ],
      },
    ),
    block("openforge-cms.alert", {
      message:
        "Ferry-dependent showings at Tidewell Harbor and Larkspur Wharf need about 48 hours' notice, so we can book the sailing around your appointment rather than the other way around.",
      tone: "info",
    }),
    block("openforge-cms.feature-list", {
      heading: "Worth bringing to a first showing",
      items: [
        "A mortgage pre-approval letter, if you have one - it changes what we can show you",
        "A tape measure, if any furniture you own is non-negotiable",
        "Boots for the bluff and marsh properties, which we will walk to the lot line",
        "Any questions from the disclosure packet, which we send before the appointment",
        "A second person, if a second person has to agree - it saves an entire trip",
      ].join("\n"),
    }),
    block(
      "openforge-cms.accordion",
      { heading: "Before you book" },
      {
        items: [
          block("openforge-cms.faq-item", {
            question: "Do I need to be pre-approved to book a tour?",
            answer:
              "No. For homes above two million the sellers typically ask for proof of funds or a pre-approval before a private showing, and we will tell you in advance when that applies.",
          }),
          block("openforge-cms.faq-item", {
            question:
              "Can you show me a home that another brokerage has listed?",
            answer:
              "Yes. We show anything on the market here, not only our own listings, and Priya works exclusively with buyers precisely so that there is no listing of her own to steer you toward.",
          }),
          block("openforge-cms.faq-item", {
            question: "How long does a valuation appointment take?",
            answer:
              "About an hour at the house, then two to three business days for us to come back with comparables and a price range. There is no charge and no listing agreement attached to it.",
          }),
          block("openforge-cms.faq-item", {
            question:
              "We are moving from out of the region. Can you tour for us?",
            answer:
              "We can walk a home on a video call and send you the parts a photographer would not shoot: the crawl space, the road noise, the view from the neighbor's fence. Several of our sales start that way.",
          }),
        ],
      },
    ),
    block("openforge-cms.cta", {
      heading: "Pick an afternoon and we will build the route",
      buttonLabel: "Request a showing time",
      buttonHref: "/contact",
    }),
  ],
};

/** The site footer, a `footer` region content tree. */
const footer = [
  block(
    "openforge-cms.footer",
    {
      copyrightText:
        "© 2026 Halcyon Bay Property Group. Licensed real estate brokerage. All information deemed reliable but not guaranteed.",
    },
    {
      links: [
        block("openforge-cms.rich-text", { content: "Homes for sale" }),
        block("openforge-cms.rich-text", { content: "Neighborhoods" }),
        block("openforge-cms.rich-text", { content: "About the firm" }),
        block("openforge-cms.rich-text", { content: "Schedule a tour" }),
        block("openforge-cms.rich-text", { content: "Fair housing notice" }),
      ],
    },
  ),
];

export const exampleSite = {
  name: "Halcyon Bay Property Group",
  description:
    "A demonstration brokerage site for the Realestate theme: a home page, a listing index, a full property detail page, the firm and its agents, a neighborhood guide, and a tour-booking page.",
  themeId: "openforge-theme.realestate",
  pages: [
    homePage,
    listingsPage,
    featuredPropertyPage,
    aboutPage,
    neighborhoodsPage,
    contactPage,
  ],
  footer,
};
