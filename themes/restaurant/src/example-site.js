/**
 * A complete, installable example site for the Restaurant theme.
 *
 * Every page's `blocks` array is a real OpenForge content tree — the exact
 * shape `@openforge/renderer`'s `parseContentTree` accepts — so a fresh
 * install can seed a working six-page restaurant site without anyone
 * hand-building a single block. The imagined tenant is Ember & Alder, a
 * forty-two seat wood-fired restaurant in a converted grain mill. Swap the
 * copy and the artwork; the structure is the point.
 */

/**
 * One content-tree node. Every official CMS block is at version 1.
 *
 * @param {string} blockId
 * @param {Record<string, unknown>} [props]
 * @param {Record<string, object[]>} [slots]
 */
const block = (blockId, props = {}, slots = {}) => ({
  blockId,
  blockVersion: 1,
  props,
  slots,
});

/**
 * Inline placeholder artwork, so the example site renders with no external
 * asset dependency and no broken images. Replace every `src` with real
 * photography before publishing — these are flat colour fields with a
 * label, not pictures of food.
 *
 * @param {{ label: string, background: string, width?: number, height?: number }} options
 */
function artwork({ label, background, width = 1200, height = 800 }) {
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    `<rect width="${width}" height="${height}" fill="${background}"/>`,
    `<text x="50%" y="50%" fill="#faf3ea" font-family="Georgia, serif" font-size="42" text-anchor="middle" dominant-baseline="middle">${label}</text>`,
    "</svg>",
  ].join("");

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/** A wordmark placeholder for the press logo strip. */
const pressMark = (label) =>
  artwork({ label, background: "#5c3a2e", width: 320, height: 120 });

const EMBER = "#8a3324";
const BARK = "#5c3a2e";
const COAL = "#3c2a22";
const CLAY = "#a3552f";
const OAK = "#6f4a2f";

const homePage = {
  slug: "/",
  title: "Ember & Alder",
  eyebrow: "Wood-fired kitchen, Harbour Mill District",
  template: "page",
  description:
    "A forty-two seat hearth kitchen cooking over alder, oak and apple wood, six nights a week.",
  blocks: [
    block("openforge-cms.banner", {
      message:
        "The autumn hearth menu is now serving, Wednesday to Sunday from 5pm.",
      ctaLabel: "Book a table",
      ctaHref: "/reservations",
      tone: "brand",
    }),
    block("openforge-cms.hero", {
      heading: "Cooked over live fire, grown ten miles away",
      subheading:
        "Ember & Alder is a forty-two seat hearth kitchen in the old grain mill on Millrace Lane. One fire, one menu, and whatever the farms sent us that morning.",
      ctaLabel: "Reserve a table",
      ctaHref: "/reservations",
    }),
    block("openforge-cms.marquee-text", {
      text: "Alder, oak and apple wood — no gas line, no induction hob, no freezer",
      speed: "slow",
    }),
    block("openforge-cms.heading", {
      text: "One fire, and everything that touches it",
      level: "h2",
      align: "center",
    }),
    block("openforge-cms.rich-text", {
      content:
        "Everything on the menu passes over the same hearth. Bread goes onto the stone at six in the morning; by service the coals are deep enough to bury a whole celeriac, and the grill bars over them carry the sirloin and the hake. Nothing is finished in a pan out of sight.\n\nThe menu changes when the growers change it. Wren Hollow Farm is nine miles east, Fallow Creek Dairy is four, and the boats we buy from land at the harbour before seven. If a dish is not written up tonight, it is because the ingredient was not good enough this morning.",
    }),
    block(
      "openforge-cms.stats-row",
      { heading: "The kitchen in numbers" },
      {
        items: [
          block("openforge-cms.stat", {
            value: "42",
            label: "Seats in the room",
          }),
          block("openforge-cms.stat", {
            value: "1",
            label: "Hearth, and no gas line",
          }),
          block("openforge-cms.stat", {
            value: "9 miles",
            label: "Average distance to our growers",
          }),
          block("openforge-cms.stat", {
            value: "21 days",
            label: "We dry-age the duck",
          }),
        ],
      },
    ),
    block("openforge-cms.divider", { style: "solid" }),
    block(
      "openforge-cms.carousel",
      { heading: "Tonight at the hearth" },
      {
        items: [
          block("openforge-cms.carousel-slide", {
            image: artwork({
              label: "Duck over embers",
              background: EMBER,
            }),
            caption:
              "The twenty-one-day duck going onto the bars at half past four",
          }),
          block("openforge-cms.carousel-slide", {
            image: artwork({ label: "Celeriac in ash", background: COAL }),
            caption: "A whole celeriac coming out of the coals, four hours in",
          }),
          block("openforge-cms.carousel-slide", {
            image: artwork({ label: "Hearth bread", background: OAK }),
            caption: "Two-day sourdough on the stone, baked before we open",
          }),
          block("openforge-cms.carousel-slide", {
            image: artwork({ label: "Charred leeks", background: BARK }),
            caption: "Charred leeks and hazelnut picada, plated at the pass",
          }),
        ],
      },
    ),
    block("openforge-cms.heading", {
      text: "Where to find us",
      level: "h2",
      align: "center",
    }),
    block("openforge-cms.icon-box", {
      icon: "🔥",
      title: "Kitchen hours",
      description:
        "Wednesday to Saturday, 5pm until 10pm. Sunday lunch, noon until 4pm. Closed Monday and Tuesday while the fire is banked and the growers restock us.",
      layout: "icon-left",
    }),
    block("openforge-cms.icon-box", {
      icon: "📍",
      title: "The old grain mill",
      description:
        "12 Millrace Lane, Harbour Mill District. Twelve minutes on foot from the north quay, and street parking is free after 6pm.",
      layout: "icon-left",
    }),
    block("openforge-cms.icon-box", {
      icon: "📖",
      title: "Reservations",
      description:
        "Tables open thirty days ahead at 9am. Six seats at the hearth counter are held back for walk-ins every single night.",
      layout: "icon-left",
    }),
    block(
      "openforge-cms.logo-cloud",
      { heading: "Written up in" },
      {
        items: [
          block("openforge-cms.logo-item", {
            image: pressMark("Harbourline"),
            name: "The Harbourline Review",
          }),
          block("openforge-cms.logo-item", {
            image: pressMark("Meridian Table"),
            name: "Meridian Table Quarterly",
          }),
          block("openforge-cms.logo-item", {
            image: pressMark("Northgate"),
            name: "Northgate Weekly",
          }),
          block("openforge-cms.logo-item", {
            image: pressMark("Slow Fire"),
            name: "The Slow Fire Guide",
          }),
          block("openforge-cms.logo-item", {
            image: pressMark("Cask + Cellar"),
            name: "Cask & Cellar Journal",
          }),
        ],
      },
    ),
    block("openforge-cms.testimonial", {
      quote:
        "We ordered the celeriac to be polite about the vegetarian option, then argued over the last spoonful of it. I have thought about that black garlic caramel roughly once a week since.",
      author: "Priya Raman",
      role: "The Harbourline Review",
    }),
    block("openforge-cms.rating", {
      value: "5",
      label: "4.8 out of 5 across 612 guest reviews",
    }),
    block("openforge-cms.cta", {
      heading: "Autumn seatings are open through the end of November",
      buttonLabel: "Book a table",
      buttonHref: "/reservations",
    }),
  ],
};

const menuPage = {
  slug: "/menu",
  title: "The autumn hearth menu",
  eyebrow: "Served Wednesday to Sunday",
  template: "page",
  description:
    "Course-by-course pricing for the current wood-fired menu, plus what is open by the glass.",
  blocks: [
    block("openforge-cms.alert", {
      message:
        "This is what we served last night. The menu moves most days — expect a dish or two to have changed by the time you sit down.",
      tone: "info",
    }),
    block("openforge-cms.rich-text", {
      content:
        "Order however you like. Most tables of two take one thing to begin, one thing from the fire to share, and something sweet. Everything is cooked to order over wood, so a dish that needs forty minutes takes forty minutes.",
    }),
    block("openforge-cms.heading", { text: "To begin", level: "h2" }),
    block("openforge-cms.pricing", {
      planName: "Hearth bread and cultured butter",
      price: "$9",
      features:
        "Two-day sourdough, baked straight on the hearth stone\nButter churned from Fallow Creek cream and salted with alder ash",
    }),
    block("openforge-cms.pricing", {
      planName: "Charred leeks, hazelnut, aged tomme",
      price: "$14",
      features:
        "Whole leeks buried in the embers until they go sweet\nToasted hazelnut picada, six-month tomme from Wren Hollow",
    }),
    block("openforge-cms.pricing", {
      planName: "Smoked trout, russet apple, horseradish",
      price: "$16",
      features:
        "Alder-smoked in the chimney each morning\nRusset apple, lovage oil, and a rye crisp for scooping",
    }),
    block("openforge-cms.heading", { text: "From the fire", level: "h2" }),
    block("openforge-cms.pricing", {
      planName: "Whole hearth-roasted duck, for two",
      price: "$68",
      features:
        "Dry-aged twenty-one days, lacquered in cider and juniper\nCarved at your table with burnt honey and pickled damson\nDripping-roasted potatoes and bitter leaves alongside",
      buttonLabel: "Reserve a table for two",
      buttonHref: "/reservations",
      featured: true,
    }),
    block("openforge-cms.pricing", {
      planName: "Ember-cooked celeriac, black garlic, walnut",
      price: "$26",
      features:
        "One whole celeriac, buried in coals for four hours\nBlack garlic caramel, walnut cream, crisped kale\nOn the menu every night since we opened",
    }),
    block("openforge-cms.pricing", {
      planName: "Dry-aged sirloin over oak, marrow butter",
      price: "$42",
      features:
        "Grass-fed and thirty-five days on the bone\nGrilled over oak, then rested in bone marrow butter\nCharred onion and watercress",
    }),
    block("openforge-cms.pricing", {
      planName: "Line-caught hake, mussels, alder cream",
      price: "$34",
      features:
        "Fillet grilled skin-down directly on the bars\nMussel and alder-smoke cream, sea herbs from the dunes",
    }),
    block("openforge-cms.heading", { text: "Sweet", level: "h2" }),
    block("openforge-cms.pricing", {
      planName: "Burnt honey tart, creme fraiche",
      price: "$11",
      features:
        "Honey caught right at the edge of catching\nCold creme fraiche, and a pinch of sea salt",
    }),
    block("openforge-cms.pricing", {
      planName: "Fire-roasted quince, oat crumble, malt ice cream",
      price: "$10",
      features:
        "Quince roasted whole in the dying coals overnight\nToasted oat crumble, malt ice cream churned at the pass",
    }),
    block("openforge-cms.heading", { text: "The hearth table", level: "h2" }),
    block("openforge-cms.pricing", {
      planName: "Five courses at the hearth counter",
      price: "$85 per guest",
      features:
        "Six seats facing the fire, cooked and served by the chefs\nFive courses chosen that afternoon, no menu printed\nWine or non-alcoholic pairing, add $45\nWednesday to Saturday, one sitting at 6:30pm",
      buttonLabel: "Book the hearth table",
      buttonHref: "/reservations",
      featured: true,
    }),
    block("openforge-cms.data-table", {
      heading: "By the glass",
      headers: "Pour, Grower, Glass",
      rows: [
        "Skin-contact Ribolla, 2023|Vinebrook Slope|$14",
        "Chilled Trousseau, 2024|Marl Hill Vineyard|$12",
        "Oak-aged Chenin, 2022|Fallow Creek Ridge|$13",
        "Dry alder-smoked cider|Pressed in our own yard|$9",
        "Damson shrub soda, no alcohol|Made here each Tuesday|$7",
      ].join("\n"),
    }),
    block("openforge-cms.feature-list", {
      heading: "Good to know",
      items:
        "Every price includes service; there is no separate charge added\nThe vegetarian menu is the same length as the main one, not a footnote\nWe cook to order over wood, so the duck takes forty minutes\nCorkage is $25 a bottle, waived if it came from a grower we buy from",
    }),
    block(
      "openforge-cms.accordion",
      { heading: "Dietary questions" },
      {
        items: [
          block("openforge-cms.faq-item", {
            question: "Can you cook for a gluten-free guest?",
            answer:
              "Yes, and we will tell you honestly which dishes change. The bread course cannot be made gluten-free, so we swap it for the charred leeks. Tell us when you book so the pass has it in front of them.",
          }),
          block("openforge-cms.faq-item", {
            question: "Is the vegetarian menu an afterthought?",
            answer:
              "No. The ember-cooked celeriac has been the centrepiece since our first night, and there is a full vegetarian run of the five-course hearth table. Vegan needs more notice — please give us forty-eight hours.",
          }),
          block("openforge-cms.faq-item", {
            question: "Does everything taste of smoke?",
            answer:
              "Less than people expect. Alder is a soft, sweet wood and most dishes cook over clean coals rather than in flame. The trout and the cider are the two things we genuinely smoke.",
          }),
        ],
      },
    ),
    block("openforge-cms.cta", {
      heading: "Come and eat it while the season is still on",
      buttonLabel: "Book a table",
      buttonHref: "/reservations",
    }),
  ],
};

const galleryPage = {
  slug: "/gallery",
  title: "Inside the mill",
  eyebrow: "The room, the fire, the work",
  template: "page",
  description:
    "A look at the dining room, the open hearth, and a service from prep through to the last plate.",
  blocks: [
    block("openforge-cms.rich-text", {
      content:
        "The mill ground grain until 1974 and then sat empty for a very long time. We kept the brick, the iron tie-rods and the timber hoist beam, and put a single hearth where the millstones used to sit. Forty-two seats fit around it, and every one of them can see the fire.",
    }),
    block(
      "openforge-cms.carousel",
      { heading: "The room" },
      {
        items: [
          block("openforge-cms.carousel-slide", {
            image: artwork({ label: "The long room", background: BARK }),
            caption:
              "The main room at five o'clock, before the first table arrives",
          }),
          block("openforge-cms.carousel-slide", {
            image: artwork({ label: "Hearth counter", background: EMBER }),
            caption: "The six-seat hearth counter, close enough to feel it",
          }),
          block("openforge-cms.carousel-slide", {
            image: artwork({ label: "Hoist beam", background: OAK }),
            caption: "The original timber hoist beam, left exactly as found",
          }),
          block("openforge-cms.carousel-slide", {
            image: artwork({ label: "The loft", background: COAL }),
            caption: "The loft, which seats fourteen for private dinners",
          }),
        ],
      },
    ),
    block(
      "openforge-cms.carousel",
      { heading: "The fire" },
      {
        items: [
          block("openforge-cms.carousel-slide", {
            image: artwork({ label: "Lighting the hearth", background: EMBER }),
            caption: "The hearth is lit at half past two, every service day",
          }),
          block("openforge-cms.carousel-slide", {
            image: artwork({ label: "Coal bed", background: COAL }),
            caption: "Alder burned down to a coal bed deep enough to bury in",
          }),
          block("openforge-cms.carousel-slide", {
            image: artwork({ label: "Grill bars", background: CLAY }),
            caption: "Sirloin on the bars, marrow butter waiting on the rest",
          }),
          block("openforge-cms.carousel-slide", {
            image: artwork({ label: "Wood store", background: OAK }),
            caption: "A season of alder, oak and apple, stacked in the yard",
          }),
        ],
      },
    ),
    block("openforge-cms.divider", { style: "dashed" }),
    block("openforge-cms.image", {
      src: artwork({
        label: "Service, half past eight",
        background: BARK,
        width: 1600,
        height: 900,
      }),
      alt: "The dining room mid-service, full, with the open hearth glowing at the far end",
      caption:
        "Saturday, half past eight. Every table is on a different course and the fire is still doing the work.",
    }),
    block("openforge-cms.rich-text", {
      content:
        "Photographs by Ines Kovac, taken across four services in October. If you would like to shoot in the room, write to us — we say yes more often than not, as long as it is before the doors open.",
    }),
    block("openforge-cms.cta", {
      heading: "The best view of the fire is from the counter",
      buttonLabel: "Book the hearth table",
      buttonHref: "/reservations",
    }),
  ],
};

const storyPage = {
  slug: "/our-story",
  title: "Our story",
  eyebrow: "Since 2019",
  template: "page",
  description:
    "How a derelict grain mill became a forty-two seat restaurant with one fire and no gas line.",
  blocks: [
    block("openforge-cms.rich-text", {
      content:
        "Nadia Oyelaran spent eleven years cooking on gas in rooms where the kitchen was hidden behind a wall. She left the last of them in 2018 with a stubborn idea: that a restaurant could run on one fire, in front of everybody, and be better for it.\n\nThe grain mill on Millrace Lane had no roof over the west end, a flooded basement, and a landlord who thought the whole thing was a joke. It also had a chimney breast four feet wide. That was the entire reason we signed the lease.\n\nWe opened in November 2019 with thirty covers, one menu, and a wood delivery that arrived two hours late. Six years on, the fire has been lit for every service since — the only exception being the eleven days in 2021 when the chimney was relined.",
    }),
    block("openforge-cms.image", {
      src: artwork({
        label: "The mill before the build",
        background: COAL,
        width: 1400,
        height: 900,
      }),
      alt: "The derelict grain mill interior before renovation, with bare brick and a wide open chimney breast",
      caption:
        "Millrace Lane in early 2019. The chimney breast on the right is now the hearth.",
    }),
    block(
      "openforge-cms.timeline",
      { heading: "From grain store to hearth kitchen" },
      {
        items: [
          block("openforge-cms.timeline-step", {
            date: "February 2019",
            title: "We sign for a building with no roof",
            description:
              "Four feet of chimney breast and a flooded basement. The survey used the phrase 'not currently habitable' twice.",
          }),
          block("openforge-cms.timeline-step", {
            date: "August 2019",
            title: "The hearth is built by hand",
            description:
              "Firebrick, a steel hood, and grill bars made by a fabricator two streets away who still services them every spring.",
          }),
          block("openforge-cms.timeline-step", {
            date: "November 2019",
            title: "Thirty covers on the first night",
            description:
              "One menu, no printed wine list, and a wood delivery that turned up two hours after we lit the fire anyway.",
          }),
          block("openforge-cms.timeline-step", {
            date: "March 2022",
            title: "The loft opens for private dinners",
            description:
              "Fourteen seats under the old hoist beam, served from the same fire as the room below.",
          }),
          block("openforge-cms.timeline-step", {
            date: "September 2024",
            title: "We start growing some of it ourselves",
            description:
              "Half an acre behind Wren Hollow, planted with the alliums, herbs and quince the menu leans on hardest.",
          }),
        ],
      },
    ),
    block("openforge-cms.heading", {
      text: "The people at the fire",
      level: "h2",
    }),
    block("openforge-cms.team-member", {
      name: "Nadia Oyelaran",
      role: "Chef and owner",
      bio: "Eleven years cooking on gas before deciding she would rather not. Writes the menu each morning after the growers call, and still works the hearth four nights a week.",
      photo: artwork({
        label: "Nadia",
        background: EMBER,
        width: 600,
        height: 600,
      }),
    }),
    block("openforge-cms.team-member", {
      name: "Tomas Beck",
      role: "Head baker",
      bio: "In at half past five to get the sourdough onto the stone before the room warms up. Also responsible for the alder-ash butter, which was originally an accident.",
      photo: artwork({
        label: "Tomas",
        background: OAK,
        width: 600,
        height: 600,
      }),
    }),
    block("openforge-cms.team-member", {
      name: "Ines Kovac",
      role: "Sommelier and floor manager",
      bio: "Buys almost entirely from growers within a day's drive, and will happily talk you out of the expensive bottle if the cheaper one suits the duck better.",
      photo: artwork({
        label: "Ines",
        background: BARK,
        width: 600,
        height: 600,
      }),
    }),
    block("openforge-cms.feature-list", {
      heading: "What we commit to",
      items:
        "One fire, no gas line, and no freezer in the building\nEvery grower named on the menu, not just the pretty ones\nService included in the price, and split evenly across the whole team\nA vegetarian centrepiece with the same care as the duck\nClosed Monday and Tuesday, because six-day weeks are not a virtue",
    }),
    block("openforge-cms.testimonial", {
      quote:
        "I have eaten here in every season now. The menu is unrecognisable each time and somehow it always tastes like the same restaurant.",
      author: "Daniel Ashworth",
      role: "Regular since the second week",
    }),
    block("openforge-cms.cta", {
      heading: "Come and see the fire for yourself",
      buttonLabel: "Reserve a table",
      buttonHref: "/reservations",
    }),
  ],
};

const reservationsPage = {
  slug: "/reservations",
  title: "Reservations",
  eyebrow: "Wednesday to Sunday",
  template: "page",
  description:
    "Service times, how bookings open, and everything worth knowing before you reserve a table.",
  blocks: [
    block("openforge-cms.rich-text", {
      content:
        "Tables open thirty days ahead at 9am and the popular Saturday slots do go within the hour. If nothing shows for the date you want, put your name on the waiting list — we release around eight tables a week from cancellations, usually the day before.",
    }),
    block("openforge-cms.icon-box", {
      icon: "🕕",
      title: "Service times",
      description:
        "Dinner Wednesday to Saturday from 5pm. Sunday lunch from noon until 4pm. The kitchen takes its last order forty-five minutes before close.",
      layout: "icon-left",
    }),
    block("openforge-cms.icon-box", {
      icon: "🪑",
      title: "Walk-ins",
      description:
        "Six seats at the hearth counter are kept back every night and given out in person from 5pm. We do not take names for them by phone.",
      layout: "icon-left",
    }),
    block("openforge-cms.icon-box", {
      icon: "☎️",
      title: "Large parties",
      description:
        "Seven or more people is a private booking rather than a table. Call (555) 018-2244 or write to hello@emberandalder.example and we will find you a date.",
      layout: "icon-left",
    }),
    block("openforge-cms.data-table", {
      heading: "When the kitchen is open",
      headers: "Day, Kitchen, Last seating",
      rows: [
        "Wednesday|5pm to 10pm|8:45pm",
        "Thursday|5pm to 10pm|8:45pm",
        "Friday|5pm to 11pm|9:30pm",
        "Saturday|5pm to 11pm|9:30pm",
        "Sunday|Noon to 4pm|2:30pm",
        "Monday and Tuesday|Closed|Closed",
      ].join("\n"),
    }),
    block(
      "openforge-cms.accordion",
      { heading: "Before you book" },
      {
        items: [
          block("openforge-cms.faq-item", {
            question: "What is your cancellation policy?",
            answer:
              "Cancel or change any table free of charge up to 24 hours ahead. Inside 24 hours we charge $20 a seat, because a forty-two seat room cannot absorb a late no-show. The hearth counter is $40 a seat inside 48 hours.",
          }),
          block("openforge-cms.faq-item", {
            question: "How long do we have the table for?",
            answer:
              "Two hours for a table of two, two and a half for four or more, and the full evening at the hearth counter. If the table after you has not booked, nobody will move you.",
          }),
          block("openforge-cms.faq-item", {
            question: "Is the room accessible?",
            answer:
              "The ground floor, the bar and the accessible toilet are all step-free through the Millrace Lane entrance, and two tables have removable chairs. The loft is reached by stairs only — tell us when you book and we will seat your party downstairs.",
          }),
          block("openforge-cms.faq-item", {
            question: "Can we bring children?",
            answer:
              "Very much so at Sunday lunch, where there are half portions of everything and high chairs. Evening service runs late and loud near an open fire, so we ask that under-tens join us at lunch instead.",
          }),
        ],
      },
    ),
    block("openforge-cms.alert", {
      message:
        "Allergies: tell us when you book, not on the night. We cook over one shared fire, so we would rather plan a dish around you than promise something at the pass we cannot guarantee.",
      tone: "warning",
    }),
    block("openforge-cms.cta", {
      heading: "Thirty days of tables are open right now",
      buttonLabel: "Check availability",
      buttonHref: "/reservations#book",
    }),
    block("openforge-cms.rich-text", {
      content:
        "Ember & Alder, 12 Millrace Lane, Harbour Mill District.\n\nPhone (555) 018-2244, Wednesday to Sunday from 11am. Email hello@emberandalder.example and we answer within a day. Street parking is free after 6pm and the north quay bus stops two minutes away.",
    }),
  ],
};

const privateEventsPage = {
  slug: "/private-events",
  title: "Private events",
  eyebrow: "The loft, the room, the whole mill",
  template: "page",
  description:
    "Private dining for fourteen in the loft, full buyouts of the mill, and harvest lunches on our closed days.",
  blocks: [
    block("openforge-cms.rich-text", {
      content:
        "Everything private comes off the same hearth as a normal service, cooked by the same chefs. We do not run a separate events menu, we run a shorter version of the real one — which is why we can only take one private booking a night.",
    }),
    block(
      "openforge-cms.columns",
      { heading: "Three ways to take the room" },
      {
        items: [
          block("openforge-cms.rich-text", {
            content:
              "The loft. Fourteen seats under the original hoist beam, up one flight of stairs, with its own service. The most-booked option, and the quietest.",
          }),
          block("openforge-cms.rich-text", {
            content:
              "The whole mill. Forty-two seats across both floors, the hearth counter included. Available Wednesday and Thursday evenings, and all day Monday and Tuesday.",
          }),
          block("openforge-cms.rich-text", {
            content:
              "Harvest lunch. A long table for up to twenty on a Monday or Tuesday, when the room is otherwise dark and the kitchen cooks whatever came in that morning.",
          }),
        ],
      },
    ),
    block("openforge-cms.pricing", {
      planName: "The loft",
      price: "$95 per guest",
      features:
        "Up to fourteen seats, one flight up, with dedicated service\nFour courses from the current menu, chosen with you beforehand\nYour own sommelier for the evening\nNo room hire, minimum spend of $1,400",
      buttonLabel: "Enquire about the loft",
      buttonHref: "/private-events#enquire",
    }),
    block("openforge-cms.pricing", {
      planName: "Whole-mill buyout",
      price: "$130 per guest",
      features:
        "All forty-two seats across both floors, hearth counter included\nFive courses, plus bread and butter on arrival\nWine or non-alcoholic pairing included throughout\nWednesday and Thursday evenings, or any Monday and Tuesday\nMinimum spend of $4,200",
      buttonLabel: "Enquire about a buyout",
      buttonHref: "/private-events#enquire",
      featured: true,
    }),
    block("openforge-cms.pricing", {
      planName: "Harvest lunch",
      price: "$70 per guest",
      features:
        "One long table for up to twenty, Monday or Tuesday only\nThree courses, decided the morning of, from what arrived\nRuns noon until half past three\nMinimum spend of $900",
      buttonLabel: "Enquire about a harvest lunch",
      buttonHref: "/private-events#enquire",
    }),
    block("openforge-cms.feature-list", {
      heading: "Included with every private booking",
      items:
        "A tasting for two, at cost, before you confirm the menu\nMenus printed with your party's name on them\nA dedicated floor lead who is with you all evening\nCandles, linen and glassware; no styling fee\nParking held for two cars in the mill yard",
    }),
    block("openforge-cms.testimonial", {
      quote:
        "We took the loft for my father's seventieth. Nadia came up between courses to explain the quince, which he then talked about for the rest of the year. Nothing about it felt like an events package.",
      author: "Marguerite Sowande",
      role: "Loft booking, March",
    }),
    block(
      "openforge-cms.accordion",
      { heading: "Practical questions" },
      {
        items: [
          block("openforge-cms.faq-item", {
            question: "How far ahead should we book?",
            answer:
              "Six to eight weeks for the loft, and three months for a whole-mill buyout in November or December. Harvest lunches on a Monday can sometimes be arranged inside a fortnight.",
          }),
          block("openforge-cms.faq-item", {
            question: "Can we bring our own wine?",
            answer:
              "Yes, up to six bottles, at $25 corkage each. Corkage is waived on anything from a grower already on our list — Ines will tell you which of your bottles qualify.",
          }),
          block("openforge-cms.faq-item", {
            question: "Is there a deposit?",
            answer:
              "A quarter of the minimum spend confirms the date and comes off the final bill. It is refundable up to thirty days ahead, and transferable to another date once after that.",
          }),
        ],
      },
    ),
    block("openforge-cms.cta", {
      heading: "Tell us the date and how many of you there are",
      buttonLabel: "Start an enquiry",
      buttonHref: "/private-events#enquire",
    }),
  ],
};

/** The site-wide footer content tree, rendered in the `footer` region. */
const footerBlocks = [
  block(
    "openforge-cms.footer",
    {
      copyrightText:
        "© 2026 Ember & Alder, 12 Millrace Lane, Harbour Mill District. All rights reserved.",
    },
    {
      links: [
        block("openforge-cms.rich-text", { content: "Menu" }),
        block("openforge-cms.rich-text", { content: "Reservations" }),
        block("openforge-cms.rich-text", { content: "Private events" }),
        block("openforge-cms.rich-text", { content: "Our story" }),
        block("openforge-cms.rich-text", { content: "Gallery" }),
      ],
    },
  ),
];

export const exampleSite = {
  themeId: "openforge-theme.restaurant",
  name: "Ember & Alder",
  tagline: "A forty-two seat hearth kitchen in the old grain mill",
  description:
    "An example restaurant site for the OpenForge Restaurant theme: home, menu, gallery, story, reservations, and private events, all built from official CMS blocks.",
  pages: [
    homePage,
    menuPage,
    galleryPage,
    storyPage,
    reservationsPage,
    privateEventsPage,
  ],
  footer: footerBlocks,
};
