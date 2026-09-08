/**
 * A complete, ready-to-render example site for the Nonprofit theme.
 *
 * "Harvest Row" is a fictional neighborhood food-security nonprofit,
 * invented for this theme so the example content reads like a real site
 * instead of placeholder text. Every organization, person, partner, place,
 * and figure below is illustrative sample content, not a real entity or a
 * verified result — replace all of it when you build a real site on this
 * theme.
 *
 * Every entry in `pages` and `posts` carries a `blocks` array that is a
 * valid renderer content tree: an array of
 * `{ blockId, blockVersion, props, slots }` nodes whose props satisfy every
 * required field of the matching official CMS block definition.
 */

/**
 * A flat-color placeholder image, inline as a data URI so the example site
 * renders with no network access and no binary assets in the package.
 *
 * @param {number} width
 * @param {number} height
 * @param {string} fill Six-digit hex color, without the leading "#".
 */
function swatch(width, height, fill) {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Crect width='${width}' height='${height}' fill='%23${fill}'/%3E%3C/svg%3E`;
}

/**
 * @param {string} blockId
 * @param {Record<string, unknown>} props
 * @param {Record<string, object[]>} [slots]
 */
function block(blockId, props, slots) {
  return slots
    ? { blockId, blockVersion: 1, props, slots }
    : { blockId, blockVersion: 1, props };
}

const PHOTO_GREEN = "cfe0c3";
const PHOTO_AMBER = "f6e3b8";
const LOGO_GREY = "e6e2d8";

const ILLUSTRATIVE_FIGURES_NOTE =
  "Every number on this site is illustrative sample content for the Nonprofit theme, not a reported result.";

const partnerLogos = [
  "Eastbrook Community Trust",
  "Bell Creek Credit Union",
  "Marlow Street Neighborhood Association",
  "Riverfield Family Health Clinic",
  "Owens Family Foundation",
].map((name) =>
  block("openforge-cms.logo-item", {
    image: swatch(160, 60, LOGO_GREY),
    name,
  }),
);

const homePage = {
  slug: "/",
  title: "Harvest Row",
  template: "page",
  summary:
    "A neighborhood food project in Eastbrook: three growing sites, a teaching kitchen, and a weekly produce share.",
  blocks: [
    block("openforge-cms.hero", {
      heading: "Good food should not depend on which block you live on.",
      subheading:
        "Harvest Row grows vegetables on three formerly vacant lots in Eastbrook, teaches neighbors to cook and preserve them, and packs a free weekly produce share for families on our list.",
      ctaLabel: "Give to this season",
      ctaHref: "/get-involved#donate",
    }),
    block(
      "openforge-cms.stats-row",
      { heading: "Our 2025 growing season, in plain numbers" },
      {
        items: [
          block("openforge-cms.stat", {
            value: "3",
            label: "Growing sites in the neighborhood",
          }),
          block("openforge-cms.stat", {
            value: "1,240",
            label: "Produce shares packed",
          }),
          block("openforge-cms.stat", {
            value: "62",
            label: "Volunteers in a typical month",
          }),
          block("openforge-cms.stat", {
            value: "9",
            label: "Partner schools and clinics",
          }),
        ],
      },
    ),
    block("openforge-cms.rich-text", {
      content: `Eastbrook had two grocery stores for nineteen thousand people. The nearer one closed in 2019, and everything we do starts from that fact: if fresh food is a forty-minute bus ride away, then it is expensive whether or not it is cheap.

So we grow it here instead. Volunteers and paid neighborhood staff work three sites from April through October, the teaching kitchen on Marlow Street runs year round, and the share goes out every Thursday afternoon to anyone who signs up — no income paperwork, no questions.

${ILLUSTRATIVE_FIGURES_NOTE}`,
    }),
    block("openforge-cms.heading", {
      text: "How the work actually happens",
      level: "h2",
      align: "center",
    }),
    block("openforge-cms.icon-box", {
      icon: "🌱",
      title: "Three growing sites",
      description:
        "Raised beds and a small hoop house on lots the city had written off. Neighbors hold the keys; two part-time growers keep the schedule.",
      layout: "icon-top",
    }),
    block("openforge-cms.icon-box", {
      icon: "🍲",
      title: "A teaching kitchen",
      description:
        "Free Tuesday-evening classes on cooking, canning, and stretching a food budget, taught mostly by people who came through the classes themselves.",
      layout: "icon-top",
    }),
    block("openforge-cms.icon-box", {
      icon: "🧺",
      title: "A weekly produce share",
      description:
        "A bag of whatever is ripe, packed Thursday morning and picked up Thursday afternoon at the clinic, the library, or the Marlow Street lot.",
      layout: "icon-top",
    }),
    block("openforge-cms.testimonial", {
      quote:
        "I came for the free tomatoes and stayed because somebody finally showed me what to do with a whole cabbage. Now I teach the Tuesday class twice a month.",
      author: "Yolanda Breese",
      role: "Share member and kitchen volunteer",
      avatar: swatch(96, 96, PHOTO_GREEN),
    }),
    block(
      "openforge-cms.logo-cloud",
      { heading: "Partners and funders who make the season possible" },
      { items: partnerLogos },
    ),
    block("openforge-cms.cta", {
      heading:
        "About $18 covers the seed, soil, and packing behind one weekly share.",
      buttonLabel: "Give monthly",
      buttonHref: "/get-involved#donate",
    }),
  ],
};

const missionPage = {
  slug: "/about",
  title: "Our mission",
  template: "page",
  summary:
    "Why Harvest Row exists, what we hold ourselves to, and the people doing the work.",
  blocks: [
    block("openforge-cms.hero", {
      heading: "We started with one vacant lot and a borrowed rototiller.",
      subheading:
        "Harvest Row exists so that a family in Eastbrook can eat fresh food this week without a car, a bus transfer, or an explanation.",
    }),
    block("openforge-cms.rich-text", {
      content: `In 2018, six neighbors asked the city for permission to plant the lot at Marlow and Ninth, which had been empty since the building came down. We got a one-year lease, a hose bib, and no money. The first season produced about four hundred pounds of vegetables and a very long list of things we had done wrong.

What we learned that year still shapes the work. Growing food is the easy part. The hard parts are the ones nobody funds: a reliable pickup time, a kitchen where people are not embarrassed to ask basic questions, and staff who live within walking distance and can be trusted with a key.

We are small on purpose. Three sites is what our volunteers, our two part-time growers, and our single van can serve well. Before we add a fourth, the first three have to run a full season without anyone burning out.`,
    }),
    block("openforge-cms.feature-list", {
      heading: "What we hold ourselves to",
      items: `No means test — anyone who signs up for the share gets the share.
Neighborhood hiring first: our growers and kitchen staff live in Eastbrook.
Free food is never traded for attendance, a photo, or a signature.
We publish our budget and our growing numbers every February.
Nothing edible gets composted while somebody on the list is waiting.`,
    }),
    block(
      "openforge-cms.timeline",
      { heading: "How we got here" },
      {
        items: [
          block("openforge-cms.timeline-step", {
            date: "2018",
            title: "One lot, one lease",
            description:
              "Six neighbors take a one-year lease on the empty lot at Marlow and Ninth and plant sixteen raised beds.",
          }),
          block("openforge-cms.timeline-step", {
            date: "2020",
            title: "The share begins",
            description:
              "With the grocery store on Ninth closed, we start packing free weekly bags and delivering to households that cannot travel.",
          }),
          block("openforge-cms.timeline-step", {
            date: "2022",
            title: "A kitchen of our own",
            description:
              "The Marlow Street church basement becomes a licensed teaching kitchen, and Tuesday classes start running year round.",
          }),
          block("openforge-cms.timeline-step", {
            date: "2024",
            title: "Two more sites",
            description:
              "Bell Creek and the Fifth Ward hoop house come online, roughly tripling what we can grow in a season.",
          }),
          block("openforge-cms.timeline-step", {
            date: "2026",
            title: "Making it durable",
            description:
              "Our current focus: multi-year site leases, paid neighborhood staff instead of grant-funded temporary roles, and a repaired greenhouse that extends the season by six weeks.",
          }),
        ],
      },
    ),
    block("openforge-cms.heading", {
      text: "The people doing the work",
      level: "h2",
      align: "left",
    }),
    block("openforge-cms.team-member", {
      name: "Nadia Osei",
      role: "Executive director",
      bio: "Ran the Marlow Street food pantry for nine years before helping start Harvest Row. Handles the budget, the leases, and the arguments with the water department.",
      photo: swatch(320, 320, PHOTO_GREEN),
    }),
    block("openforge-cms.team-member", {
      name: "Marcus Delgado",
      role: "Growing sites lead",
      bio: "Grew up two streets from the Bell Creek plots. Plans the crop rotation, trains new volunteers, and decides what gets planted when the forecast changes.",
      photo: swatch(320, 320, PHOTO_AMBER),
    }),
    block("openforge-cms.team-member", {
      name: "Priya Raman",
      role: "Kitchen coordinator",
      bio: "Teaches the Tuesday classes and runs Thursday packing. Keeps the recipe cards short, translated, and honest about what things cost.",
      photo: swatch(320, 320, PHOTO_GREEN),
    }),
    block("openforge-cms.cta", {
      heading: "Come see a growing site before you decide anything.",
      buttonLabel: "Visit on a Saturday",
      buttonHref: "/get-involved#volunteer",
    }),
  ],
};

const programsPage = {
  slug: "/programs",
  title: "What we do",
  template: "page",
  summary:
    "Three programs — the growing sites, the teaching kitchen, and the Thursday share — and how to take part in each.",
  blocks: [
    block("openforge-cms.heading", {
      text: "Three programs, and the partners around them",
      level: "h2",
      align: "center",
    }),
    block("openforge-cms.rich-text", {
      content:
        "Everything we run is meant to put fresh food within walking distance of the people who need it, and to keep it there after the grant cycle ends. The three core programs are open to anyone in Eastbrook and none of them require paperwork; the fourth is how schools and clinics plug into them.",
    }),
    block("openforge-cms.icon-box", {
      icon: "🌱",
      title: "Growing sites",
      description:
        "Marlow Street, Bell Creek, and the Fifth Ward hoop house. Open volunteer mornings run Saturdays from April through October, 9 to 11.",
      layout: "icon-left",
    }),
    block("openforge-cms.icon-box", {
      icon: "🍲",
      title: "Teaching kitchen",
      description:
        "Tuesday evenings, 6 to 7:30, in the Marlow Street basement. Cooking, canning, freezing, and food-budget sessions. Free, drop-in, childcare in the next room.",
      layout: "icon-left",
    }),
    block("openforge-cms.icon-box", {
      icon: "🧺",
      title: "Thursday produce share",
      description:
        "Sign up once and pick up every Thursday between 3 and 6 at the clinic, the library, or the Marlow Street lot. Home delivery for neighbors who cannot travel.",
      layout: "icon-left",
    }),
    block("openforge-cms.icon-box", {
      icon: "🚸",
      title: "School and clinic partnerships",
      description:
        "We supply produce and run short growing sessions with nine partner schools and clinics, who also refer families to the share.",
      layout: "icon-left",
    }),
    block("openforge-cms.divider", { style: "solid" }),
    block("openforge-cms.data-table", {
      heading: "When each program runs",
      headers: "Program, Season, Where, Sign-up needed",
      rows: `Growing sites|April to October|Marlow Street, Bell Creek, Fifth Ward|No, just show up
Teaching kitchen|Year round, Tuesdays|Marlow Street basement|No, drop in
Thursday share|Year round, lighter in winter|Clinic, library, Marlow Street|Yes, one short form
School sessions|September to May|At the partner school|Arranged by the school`,
    }),
    block(
      "openforge-cms.accordion",
      { heading: "Questions people actually ask" },
      {
        items: [
          block("openforge-cms.faq-item", {
            question: "Do I have to prove I need the food?",
            answer:
              "No. There is no income check and no documentation. You fill in a name, a pickup site, and how many people you are feeding, so we pack the right number of bags.",
          }),
          block("openforge-cms.faq-item", {
            question: "What is actually in the share?",
            answer:
              "Whatever is ripe that week, which in midsummer means a lot of tomatoes, greens, beans, and squash. We include a short recipe card, and the kitchen class that Tuesday usually cooks the same thing.",
          }),
          block("openforge-cms.faq-item", {
            question: "Can I volunteer if I have never grown anything?",
            answer:
              "Yes, and most people have not. Saturday mornings start with a ten-minute walkthrough, and there is always work that needs hands more than experience.",
          }),
          block("openforge-cms.faq-item", {
            question: "Do you take food donations from home gardens?",
            answer:
              "Yes, if it is clean, whole, and dropped at Marlow Street on a Wednesday. We cannot accept cooked food or anything from an unlicensed kitchen.",
          }),
        ],
      },
    ),
    block("openforge-cms.cta", {
      heading: "Saturday mornings are the easiest way to start.",
      buttonLabel: "Volunteer with us",
      buttonHref: "/get-involved#volunteer",
    }),
  ],
};

const impactPage = {
  slug: "/impact",
  title: "Impact and stories",
  template: "page",
  summary:
    "What last season added up to, in numbers we can count and in the words of the people who use the share.",
  blocks: [
    block("openforge-cms.heading", {
      text: "What last season added up to",
      level: "h2",
      align: "left",
    }),
    block(
      "openforge-cms.stats-row",
      { heading: "2025 growing season" },
      {
        items: [
          block("openforge-cms.stat", {
            value: "11,600 lb",
            label: "Vegetables harvested across three sites",
          }),
          block("openforge-cms.stat", {
            value: "1,240",
            label: "Weekly shares packed and picked up",
          }),
          block("openforge-cms.stat", {
            value: "38",
            label: "Kitchen classes held on Marlow Street",
          }),
          block("openforge-cms.stat", {
            value: "2,900",
            label: "Volunteer hours logged",
          }),
        ],
      },
    ),
    block("openforge-cms.alert", {
      message: `${ILLUSTRATIVE_FIGURES_NOTE} A real site should publish counts it can trace to its own records, and say plainly how each one was measured.`,
      tone: "info",
    }),
    block("openforge-cms.testimonial", {
      quote:
        "The bus to the nearest store and back takes most of a morning. Thursday pickup is four minutes from my door, and I stopped choosing between fresh food and the electric bill.",
      author: "Denise Whitaker",
      role: "Share member since 2021",
      avatar: swatch(96, 96, PHOTO_AMBER),
    }),
    block("openforge-cms.testimonial", {
      quote:
        "I refer families to the share almost every week. What matters clinically is that it is predictable — same day, same place, no paperwork that makes anyone feel screened.",
      author: "Samuel Ekwueme",
      role: "Nurse practitioner, Riverfield Family Health Clinic",
      avatar: swatch(96, 96, PHOTO_GREEN),
    }),
    block("openforge-cms.image", {
      src: swatch(960, 540, PHOTO_GREEN),
      alt: "Volunteers packing paper bags of vegetables at long folding tables",
      caption:
        "Thursday packing at Marlow Street. Bags go out between 3 and 6 the same afternoon.",
    }),
    block("openforge-cms.heading", {
      text: "What we are working on now",
      level: "h3",
      align: "left",
    }),
    block("openforge-cms.progress", {
      label: "2026 growing-season fund",
      percent: "60",
    }),
    block("openforge-cms.progress", {
      label: "Fifth Ward greenhouse repair",
      percent: "40",
    }),
    block("openforge-cms.rich-text", {
      content:
        "The greenhouse repair is the one that changes the most: new glazing and a working vent would add roughly six weeks to each end of the season, which is the difference between a share that thins out in November and one that keeps going into December.",
    }),
    block("openforge-cms.cta", {
      heading: "Help us keep the beds full through the winter.",
      buttonLabel: "Give to the season fund",
      buttonHref: "/get-involved#donate",
    }),
  ],
};

const getInvolvedPage = {
  slug: "/get-involved",
  title: "Get involved",
  template: "page",
  summary:
    "Give, volunteer, or lend a space — and see exactly what each one pays for.",
  blocks: [
    block("openforge-cms.hero", {
      heading: "There is a job here for whatever you have to give.",
      subheading:
        "Money, a Saturday morning, a truck, a spare fridge, or an hour of Spanish translation on Thursday afternoons — all of it is useful, and none of it is more welcome than the rest.",
      ctaLabel: "Give monthly",
      ctaHref: "/get-involved#donate",
    }),
    block("openforge-cms.banner", {
      message:
        "Volunteer mornings run every Saturday, April through October, 9 to 11 at the Marlow Street lot. No sign-up, no experience.",
      ctaLabel: "Ask us anything first",
      ctaHref: "/contact",
      tone: "brand",
    }),
    block(
      "openforge-cms.columns",
      { heading: "Three ways to help" },
      {
        items: [
          block("openforge-cms.rich-text", {
            content: `Give

A monthly gift is worth far more to us than the same amount once a year, because it lets us commit to seed orders and staff hours before the season starts. About $18 covers one weekly share; $50 a month keeps a household in produce all year.`,
          }),
          block("openforge-cms.rich-text", {
            content: `Volunteer

Saturday mornings at the sites, Tuesday evenings in the kitchen, Thursday afternoons packing and driving. Come once to see whether it suits you — most people who stay started that way.`,
          }),
          block("openforge-cms.rich-text", {
            content: `Lend something

Cold storage, a pickup truck on Thursdays, a licensed kitchen when ours is full, an accountant's afternoon in January. Tell us what you have and we will tell you honestly whether we can use it.`,
          }),
        ],
      },
    ),
    block("openforge-cms.heading", {
      text: "Where your gift goes",
      level: "h2",
      align: "left",
    }),
    block("openforge-cms.progress", {
      label: "2026 growing-season fund",
      percent: "60",
    }),
    block("openforge-cms.feature-list", {
      heading: "What a monthly gift covers",
      items: `Seed, compost, and soil amendment for the spring planting
Hourly wages for two part-time neighborhood growers
Bags, crates, and fuel for the Thursday share route
Ingredients and childcare for the Tuesday kitchen classes
Water, tools, and repairs across all three sites`,
    }),
    block(
      "openforge-cms.accordion",
      { heading: "Before you give" },
      {
        items: [
          block("openforge-cms.faq-item", {
            question: "Can I say what my gift is for?",
            answer:
              "Yes. You can restrict a gift to the season fund, the greenhouse repair, or the kitchen. Unrestricted gifts are the most useful, because they cover the parts that are hardest to fund — wages, fuel, and repairs.",
          }),
          block("openforge-cms.faq-item", {
            question: "How much of my gift reaches the food?",
            answer:
              "We publish a full budget every February showing what went to program costs, wages, and administration. Ask for last year's copy before you give and we will send it.",
          }),
          block("openforge-cms.faq-item", {
            question: "Can my employer match it?",
            answer:
              "Many can. Send us the name of your employer's matching program and we will fill in whatever forms it needs, including our registration details.",
          }),
        ],
      },
    ),
    block("openforge-cms.cta", {
      heading: "Set up a monthly gift and we will stop asking you in April.",
      buttonLabel: "Give monthly",
      buttonHref: "/get-involved#donate",
    }),
  ],
};

const contactPage = {
  slug: "/contact",
  title: "Contact us",
  template: "page",
  summary:
    "Where the sites are, when they are open, and how to reach a person who can answer.",
  blocks: [
    block("openforge-cms.heading", {
      text: "Come find us",
      level: "h2",
      align: "left",
    }),
    block("openforge-cms.rich-text", {
      content: `The fastest way to reach us is email — one of three people reads it, usually within a working day. Phone messages left after Thursday afternoon tend to wait until Monday, because that is when everyone is packing.

Office and teaching kitchen: 940 Marlow Street, Eastbrook.
Email: hello@harvestrow.example
Phone: (555) 0142`,
    }),
    block("openforge-cms.data-table", {
      heading: "Sites and open hours",
      headers: "Site, Address, Open to visitors",
      rows: `Marlow Street lot|940 Marlow Street|Saturdays 9-11, April to October
Bell Creek plots|The corner of Bell Creek Road and Ninth|Saturdays 9-11, April to October
Fifth Ward hoop house|1600 Ward Avenue, behind the rec center|By arrangement, year round
Teaching kitchen|940 Marlow Street, lower level|Tuesdays 6-7:30, year round
Thursday pickup|Clinic, library, and Marlow Street|Thursdays 3-6, year round`,
    }),
    block("openforge-cms.alert", {
      message:
        "The Marlow Street lot and the teaching kitchen are step-free. The Bell Creek plots have a gravel path that is difficult in a wheelchair — tell us before you come and we will meet you at the road entrance.",
      tone: "info",
    }),
    block("openforge-cms.heading", {
      text: "Who to write to",
      level: "h3",
      align: "left",
    }),
    block("openforge-cms.feature-list", {
      items: `Share sign-ups, pickup changes, and deliveries: Priya Raman
Volunteering, sites, and group workdays: Marcus Delgado
Giving, partnerships, and press: Nadia Osei
Anything you are not sure about: hello@harvestrow.example`,
    }),
    block("openforge-cms.cta", {
      heading: "Not sure who to ask? Write to all of us at once.",
      buttonLabel: "Email the team",
      buttonHref: "mailto:hello@harvestrow.example",
    }),
  ],
};

const fieldNotesPost = {
  slug: "/stories/the-week-the-beans-came-in",
  title: "Field notes: the week the beans came in all at once",
  template: "post",
  publishedAt: "2026-08-14T00:00:00.000Z",
  author: "Marcus Delgado",
  summary:
    "What happens at a small growing site when nine hundred feet of pole beans decide to ripen on the same Tuesday.",
  blocks: [
    block("openforge-cms.rich-text", {
      content: `Every season there is one week where the plan stops mattering. This year it was the second week of August, when the pole beans at Bell Creek and the Fifth Ward hoop house came in within about thirty-six hours of each other.

We picked on Tuesday evening after the kitchen class let out, and again Wednesday morning before it got hot. By Wednesday afternoon we had more beans than the Thursday share could absorb without becoming a bean share.`,
    }),
    block("openforge-cms.image", {
      src: swatch(960, 540, PHOTO_AMBER),
      alt: "Crates of freshly picked green beans stacked on a folding table",
      caption:
        "Wednesday's second pick at Bell Creek, staged for sorting before the Thursday route.",
    }),
    block("openforge-cms.rich-text", {
      content: `So we added a Wednesday canning session on top of the Tuesday class, which is the sort of improvisation a small operation can actually make. Eleven people came, most of whom had never used a water-bath canner, and left with jars.

The rest went into the share, to the clinic, and to two of the partner schools that had just started their term. Nothing edible went to the compost pile, which is the only benchmark that matters in a week like that.`,
    }),
    block("openforge-cms.testimonial", {
      quote:
        "I took home six jars and gave four of them away. My mother has been asking me to learn this since I was nineteen.",
      author: "Yolanda Breese",
      role: "Kitchen volunteer",
    }),
    block("openforge-cms.cta", {
      heading: "Weeks like this run on volunteers who show up unannounced.",
      buttonLabel: "Volunteer with us",
      buttonHref: "/get-involved#volunteer",
    }),
  ],
};

const footerBlocks = [
  block(
    "openforge-cms.footer",
    {
      copyrightText:
        "© 2026 Harvest Row (a fictional organization used as example content). All rights reserved.",
    },
    {
      links: [
        block("openforge-cms.rich-text", { content: "Our mission" }),
        block("openforge-cms.rich-text", { content: "What we do" }),
        block("openforge-cms.rich-text", { content: "Impact and stories" }),
        block("openforge-cms.rich-text", { content: "Get involved" }),
        block("openforge-cms.rich-text", { content: "Contact us" }),
      ],
    },
  ),
];

export const exampleSite = {
  name: "Harvest Row",
  tagline: "Good food should not depend on which block you live on.",
  description:
    "Example content for the Nonprofit theme: a fictional neighborhood food-security organization with growing sites, a teaching kitchen, and a free weekly produce share. All names, places, and figures are illustrative.",
  themeId: "openforge-theme.nonprofit",
  pages: [
    homePage,
    missionPage,
    programsPage,
    impactPage,
    getInvolvedPage,
    contactPage,
  ],
  posts: [fieldNotesPost],
  footer: footerBlocks,
};
