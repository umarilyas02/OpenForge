/**
 * A complete example site for the Magazine theme.
 *
 * "Grain & Signal" is a fictional independent monthly about design,
 * technology, and the culture around them. Nothing here describes a real
 * publication, person, company, or event — it exists so the theme can be
 * installed and previewed with realistic editorial content instead of
 * placeholder text.
 *
 * Every page's `blocks` array is a valid renderer content tree: an array of
 * `{ blockId, blockVersion, props, slots }` nodes using only official
 * OpenForge CMS blocks, with every required prop supplied.
 */

/** A flat colour placeholder, in the same inline-SVG form the blocks default to. */
const swatch = (width, height, hex) =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Crect width='${width}' height='${height}' fill='%23${hex}'/%3E%3C/svg%3E`;

const INK = "0b0b0c";
const RED = "d6002a";
const NEWSPRINT = "ece7dd";
const SLATE = "3b4252";

/** Rich Text splits on blank lines, so paragraphs are joined with one. */
const paragraphs = (...items) => items.join("\n\n");

/** Feature List and Data Table both split on single newlines. */
const lines = (...items) => items.join("\n");

/** Build one content node. `blockVersion` is 1 for every official block. */
const node = (blockId, props = {}, slots = {}) => ({
  blockId,
  blockVersion: 1,
  props,
  slots,
});

/** A fresh footer node per page, so no two pages share one object. */
const siteFooter = () =>
  node(
    "openforge-cms.footer",
    {
      copyrightText:
        "© 2026 Grain & Signal — a fictional publication, shipped as OpenForge example content.",
    },
    {
      links: [
        node("openforge-cms.rich-text", { content: "Culture" }),
        node("openforge-cms.rich-text", { content: "Systems" }),
        node("openforge-cms.rich-text", { content: "Field Notes" }),
        node("openforge-cms.rich-text", { content: "The Dispatch" }),
        node("openforge-cms.rich-text", { content: "Masthead" }),
        node("openforge-cms.rich-text", { content: "Contact & advertise" }),
      ],
    },
  );

const homePage = {
  slug: "/",
  title: "Grain & Signal",
  template: "page",
  kicker: "Issue 14 · The Repair Issue",
  description:
    "A monthly on design, technology, and the culture that grows around them.",
  blocks: [
    node("openforge-cms.banner", {
      message: "Issue 14, The Repair Issue, ships to members on 12 September.",
      ctaLabel: "See what is in it",
      ctaHref: "/issues/14",
      tone: "dark",
    }),
    node("openforge-cms.marquee-text", {
      text: "In this issue · The typeface that outlived its foundry · The repair café that keeps better records than the manufacturer · A field guide to the last analogue colour labs · Letters from the copy desk",
      speed: "slow",
    }),
    node("openforge-cms.hero", {
      heading: "Grain & Signal",
      subheading:
        "A monthly on design, technology, and the culture that grows around them. Slow reporting about fast machines.",
      ctaLabel: "Start with Issue 14",
      ctaHref: "/issues/14",
    }),
    node("openforge-cms.divider", { style: "solid" }),
    node("openforge-cms.heading", {
      text: "The lead story",
      level: "h2",
      align: "left",
    }),
    node("openforge-cms.image", {
      src: swatch(1200, 675, INK),
      alt: "A compositor's wooden tray of metal type, photographed from directly above.",
      caption:
        "The Kestrel & Co. working tray, still sorted the way the last compositor left it. Photograph by Devi Okonkwo.",
    }),
    node("openforge-cms.rich-text", {
      content: paragraphs(
        "The typeface that outlived its foundry",
        "When Kestrel & Co. closed in 1994, its drawings went into a storage unit behind a tyre yard and stayed there. The family that inherited them has spent two years deciding what a typeface owes the people still setting it — and discovering that nobody, the lawyers included, entirely agrees.",
      ),
    }),
    node("openforge-cms.button", {
      label: "Read the full story",
      href: "/stories/the-typeface-that-outlived-its-foundry",
      variant: "primary",
    }),
    node("openforge-cms.spacer", { size: "lg" }),
    node("openforge-cms.divider", { style: "solid" }),
    node("openforge-cms.heading", {
      text: "Also in Issue 14",
      level: "h2",
      align: "left",
    }),
    node("openforge-cms.card", {
      image: swatch(800, 500, RED),
      title: "The repair café that keeps better records than the manufacturer",
      description:
        "Volunteers in a converted laundrette have logged 4,100 repairs in six years. Their spreadsheet is now the most complete failure record anyone holds for three discontinued appliance lines.",
      linkLabel: "Read in Systems",
      linkHref: "/stories/the-repair-cafe-ledger",
    }),
    node("openforge-cms.card", {
      image: swatch(800, 500, NEWSPRINT),
      title: "A field guide to the last analogue colour labs",
      description:
        "Nine rooms in six cities where film is still developed by people who can smell a bad batch. We spent a month photographing the photographers.",
      linkLabel: "Read in Field Notes",
      linkHref: "/stories/the-last-colour-labs",
    }),
    node("openforge-cms.card", {
      image: swatch(800, 500, SLATE),
      title: "Interview: the archivist who versions everything",
      description:
        "A conversation about naming conventions, institutional memory, and why she thinks the folder is a dying literary form.",
      linkLabel: "Read the interview",
      linkHref: "/stories/the-archivist-who-versions-everything",
    }),
    node("openforge-cms.divider", { style: "dashed" }),
    node(
      "openforge-cms.columns",
      { heading: "From the desks" },
      {
        items: [
          node("openforge-cms.rich-text", {
            content: paragraphs(
              "CULTURE",
              "Objects, typefaces, buildings, and habits that outlast the companies that made them — and the people who decide what happens to them next.",
            ),
          }),
          node("openforge-cms.rich-text", {
            content: paragraphs(
              "SYSTEMS",
              "Maintenance, infrastructure, and the unglamorous work that keeps software and hardware standing up long after the launch post.",
            ),
          }),
          node("openforge-cms.rich-text", {
            content: paragraphs(
              "FIELD NOTES",
              "Short dispatches from workshops, labs, and back rooms. Usually one room, one process, and one person who knows it cold.",
            ),
          }),
        ],
      },
    ),
    node(
      "openforge-cms.avatar-group",
      { caption: "Twelve contributors made this issue." },
      {
        items: [
          node("openforge-cms.avatar-item", {
            image: swatch(160, 160, INK),
            name: "Marisol Trent",
          }),
          node("openforge-cms.avatar-item", {
            image: swatch(160, 160, RED),
            name: "Devi Okonkwo",
          }),
          node("openforge-cms.avatar-item", {
            image: swatch(160, 160, SLATE),
            name: "Aaron Vale",
          }),
          node("openforge-cms.avatar-item", {
            image: swatch(160, 160, NEWSPRINT),
            name: "Rowan Petrakis",
          }),
        ],
      },
    ),
    node("openforge-cms.cta", {
      heading: "The Dispatch: one letter, every other Thursday",
      buttonLabel: "Subscribe free",
      buttonHref: "/newsletter",
    }),
    siteFooter(),
  ],
};

const articlePage = {
  slug: "/stories/the-typeface-that-outlived-its-foundry",
  title: "The typeface that outlived its foundry",
  template: "post",
  section: "Culture",
  author: "Marisol Trent",
  publishedAt: "2026-08-18T00:00:00.000Z",
  description:
    "Kestrel & Co. shut its doors in 1994 and put its drawings into storage. Thirty-two years later, the family that inherited them is deciding what a typeface owes the people still setting it.",
  blocks: [
    node("openforge-cms.badge", { text: "Culture", tone: "accent" }),
    node("openforge-cms.avatar-item", {
      image: swatch(160, 160, INK),
      name: "Marisol Trent",
    }),
    node("openforge-cms.rich-text", {
      content:
        "By Marisol Trent · Photographs by Devi Okonkwo · 14 minutes · 18 August 2026",
    }),
    node("openforge-cms.rich-text", {
      content: paragraphs(
        "The storage unit is climate-controlled now, which was not true for the first nineteen years. Between 1994 and 2013 the drawings for every face Kestrel & Co. ever cut sat in a corrugated shed behind a tyre yard, through summers that warmed the shed to the temperature of a parked car. The paper survived anyway. Tracing vellum is tougher than the people who worry about it.",
        "There are 41 flat files. Thirty-eight of them hold what you would expect: outlines drawn at a ten-inch cap height, pencilled and inked over, one letter to a sheet, each sheet initialled in the bottom right corner by whoever cut it. The other three hold the argument — memos, invoices, and two decades of correspondence with a licensee who kept asking for a lighter weight and kept being told no.",
        "Everyone who writes about a closed foundry writes about the drawings. Almost nobody writes about the memos, and the memos are where the story is.",
      ),
    }),
    node("openforge-cms.image", {
      src: swatch(1200, 800, NEWSPRINT),
      alt: "An open flat-file drawer showing inked letter drawings on sheets of tracing vellum.",
      caption:
        "Drawer 12: the lowercase of the text weight, initialled and dated between March and July 1971.",
    }),
    node("openforge-cms.rich-text", {
      content: paragraphs(
        "What the family inherited, legally, is a box of paper. What people mean when they say someone inherited a typeface is something else entirely, and the gap between those two things is where the last two years have gone.",
        "The face itself was digitised twice without anyone's permission. The first attempt, in 1998, was an honest and clumsy autotrace: someone scanned a specimen book at 300 dots per inch and shipped the result. The second, around 2009, was careful. It repaired the joins, rebuilt the italic, added a Greek, and it is the version most working designers have installed today. Neither version's author has ever been publicly named.",
        "So this is the situation the family walked into: a well-loved face, in wide use, in a form nobody at Kestrel ever drew, licensed by nobody, maintained by nobody, and improving slowly through the same anonymous care that keeps old software compiling.",
      ),
    }),
    node("openforge-cms.testimonial", {
      quote:
        "A typeface stops belonging to its foundry the moment somebody sets a book in it. The question was never who owns the drawings. It is who is willing to keep the thing alive once the drawings stop being enough.",
      author: "Ines Haddad",
      role: "type designer and former Kestrel licensee",
    }),
    node("openforge-cms.rich-text", {
      content: paragraphs(
        "Haddad's position is not the family's. Across three meetings this spring, two of the four siblings argued for releasing the outlines under a licence that would let anyone extend them; the other two argued that doing so would make the 2009 revival permanent by default, enshrining one anonymous interpretation as the thing everybody builds on next.",
        "The compromise they are circling is unusual and, if it holds, worth watching. Release scans of all 41 drawers, unrestricted, as a historical record. Keep the name. Commission a single authorised revival, done in the open, with the drawer scans as the reference and the 2009 version explicitly consulted rather than ignored. Anyone may make their own; only one may use the name.",
        "Whether that survives contact with a lawyer is another matter. It is, at least, the first proposal any of them has made that treats the anonymous 2009 revivalist as a contributor rather than an infringement.",
      ),
    }),
    node("openforge-cms.feature-list", {
      heading: "What is actually in the 41 drawers",
      items: lines(
        "Complete inked outlines for the text weight, roman and italic, drawn 1969 to 1973",
        "Two unreleased weights: a heavy display cut, and a bold that was drawn and rejected twice",
        "Every rejected alternate, filed with a dated note explaining the rejection",
        "Correspondence with fourteen licensees, including the one that ran for nineteen years",
        "Three drawers of specimen printing, the only colour reference anybody has",
      ),
    }),
    node("openforge-cms.divider", { style: "solid" }),
    node("openforge-cms.heading", {
      text: "What happens next",
      level: "h2",
      align: "left",
    }),
    node("openforge-cms.rich-text", {
      content: paragraphs(
        "The scans are being made now, on a copy stand borrowed from a university library, at roughly forty sheets a week. The family has said the historical release will not be paywalled and will not be exclusive to any platform. Nobody has said who will do the authorised revival, and at least three people we spoke to assume they are being considered.",
        "Meanwhile the face keeps being set. It is on the spine of a novel published this month, on the menu of a restaurant two streets from the storage unit, and in the wordmark of a company whose founders were born after the foundry closed. None of them licensed it. All of them are, in the only sense that has ever mattered to a typeface, keeping it in print.",
      ),
    }),
    node("openforge-cms.alert", {
      message:
        "Example content. Grain & Signal, Kestrel & Co., and everyone quoted here are inventions shipped with the OpenForge Magazine theme. Nothing on this page reports on real people, companies, or events.",
      tone: "info",
    }),
    node("openforge-cms.cta", {
      heading: "More from the Culture desk",
      buttonLabel: "Read Culture",
      buttonHref: "/culture",
    }),
    siteFooter(),
  ],
};

const culturePage = {
  slug: "/culture",
  title: "Culture",
  template: "page",
  kicker: "Section",
  description: "What we keep, what we let go, and who gets to decide.",
  blocks: [
    node("openforge-cms.gradient-heading", {
      text: "Culture",
      level: "h1",
      tone: "sunset",
    }),
    node("openforge-cms.rich-text", {
      content: paragraphs(
        "The Culture desk covers objects, typefaces, buildings, and working habits that outlast the companies that made them — and the people who end up deciding what happens to them next.",
        "Roughly six long features a year, plus short pieces whenever an argument on the letters page deserves more room than the letters page has.",
      ),
    }),
    node("openforge-cms.divider", { style: "solid" }),
    node("openforge-cms.heading", {
      text: "Editor's picks",
      level: "h2",
      align: "left",
    }),
    node("openforge-cms.card", {
      image: swatch(800, 500, INK),
      title: "The typeface that outlived its foundry",
      description:
        "Thirty-two years in a storage unit, two anonymous digitisations, and four siblings trying to decide what a typeface owes the people still setting it.",
      linkLabel: "Read the feature",
      linkHref: "/stories/the-typeface-that-outlived-its-foundry",
    }),
    node("openforge-cms.card", {
      image: swatch(800, 500, RED),
      title: "The building that has been finished four times",
      description:
        "A civic hall re-clad by four practices in sixty years. We asked all four to defend their version; three of them agreed, and one brought drawings.",
      linkLabel: "Read the feature",
      linkHref: "/stories/the-building-finished-four-times",
    }),
    node("openforge-cms.card", {
      image: swatch(800, 500, NEWSPRINT),
      title: "Nobody agrees what a reissue is",
      description:
        "Furniture, records, and software all use the word. In each industry it promises something different, and in one of them it promises almost nothing at all.",
      linkLabel: "Read the feature",
      linkHref: "/stories/what-a-reissue-means",
    }),
    node("openforge-cms.card", {
      image: swatch(800, 500, SLATE),
      title: "Interview: the archivist who versions everything",
      description:
        "On naming conventions, institutional memory, and why she thinks the folder is a dying literary form.",
      linkLabel: "Read the interview",
      linkHref: "/stories/the-archivist-who-versions-everything",
    }),
    node("openforge-cms.spacer", { size: "md" }),
    node("openforge-cms.divider", { style: "dashed" }),
    node("openforge-cms.feature-list", {
      heading: "What this desk is looking for",
      items: lines(
        "One object, one process, or one decision — not a survey of a whole industry",
        "Access we do not already have: a room, an archive, a person who was there",
        "A disagreement with at least two defensible sides",
        "Reporting you can actually finish, with the travel budget written into the pitch",
      ),
    }),
    node("openforge-cms.cta", {
      heading: "Pitching the Culture desk",
      buttonLabel: "Read the pitch guide",
      buttonHref: "/contact",
    }),
    siteFooter(),
  ],
};

const mastheadPage = {
  slug: "/about",
  title: "Masthead",
  template: "page",
  kicker: "About",
  description:
    "Who makes Grain & Signal, how it is paid for, and what we will and will not do.",
  blocks: [
    node("openforge-cms.hero", {
      heading: "The masthead",
      subheading:
        "Grain & Signal is an independent monthly about design, technology, and the culture that grows around them. Six people, one printer, no ad network.",
      ctaLabel: "Read the standards page",
      ctaHref: "/about/standards",
    }),
    node("openforge-cms.rich-text", {
      content: paragraphs(
        "We publish one issue a month: three long features, four short field notes, and a letters page we actually read. Members pay for the reporting. Print advertising, clearly marked and never inside a feature, pays for the paper.",
        "Nothing stays behind the membership wall for more than thirty days. The archive, including the photography, is free and stays free — what membership buys is the issue on publication day, the printed edition in the post, and the letters page in full.",
      ),
    }),
    node(
      "openforge-cms.stats-row",
      { heading: "The publication in numbers" },
      {
        items: [
          node("openforge-cms.stat", { value: "14", label: "Issues printed" }),
          node("openforge-cms.stat", {
            value: "62",
            label: "Contributors paid",
          }),
          node("openforge-cms.stat", { value: "9,400", label: "Members" }),
          node("openforge-cms.stat", {
            value: "18 min",
            label: "Median feature",
          }),
        ],
      },
    ),
    node("openforge-cms.divider", { style: "solid" }),
    node("openforge-cms.heading", {
      text: "Who makes it",
      level: "h2",
      align: "left",
    }),
    node("openforge-cms.team-member", {
      name: "Marisol Trent",
      role: "Editor",
      bio: "Started the letters page as a photocopied zine in 2021 and has spent every issue since trying to keep the rest of the magazine as argumentative as that first page was.",
      photo: swatch(320, 320, INK),
    }),
    node("openforge-cms.team-member", {
      name: "Devi Okonkwo",
      role: "Photo editor",
      bio: "Shoots the features, commissions the rest, and runs the darkroom at the back of the office that pays for itself twice a year in workshop fees.",
      photo: swatch(320, 320, RED),
    }),
    node("openforge-cms.team-member", {
      name: "Aaron Vale",
      role: "Systems desk",
      bio: "Writes about maintenance, infrastructure, and the unglamorous half of every launch. Keeps this site's build under a minute, on principle.",
      photo: swatch(320, 320, SLATE),
    }),
    node(
      "openforge-cms.timeline",
      { heading: "How we got here" },
      {
        items: [
          node("openforge-cms.timeline-step", {
            date: "2021",
            title: "A photocopied letters page",
            description:
              "Forty copies, stapled by hand, left face-up in three bookshops and one launderette.",
          }),
          node("openforge-cms.timeline-step", {
            date: "2023",
            title: "The first printed issue",
            description:
              "Sixty-four pages, funded by eight hundred founding members who paid before seeing a single page of it.",
          }),
          node("openforge-cms.timeline-step", {
            date: "2025",
            title: "The archive goes free",
            description:
              "Everything older than thirty days moved out from behind the membership wall, permanently.",
          }),
          node("openforge-cms.timeline-step", {
            date: "2026",
            title: "Issue 14, The Repair Issue",
            description:
              "Our largest issue yet: three features, a fold-out field guide, and the first fully commissioned photo essay.",
          }),
        ],
      },
    ),
    node("openforge-cms.feature-list", {
      heading: "How we work",
      items: lines(
        "Every contributor is paid before publication, at the same per-word rate regardless of byline",
        "Sources see the sentences that quote them before we print, never the whole draft",
        "Corrections stay on the page, dated, directly above the sentence they correct",
        "No sponsored features, no affiliate links, and no reviews of anything sent to us free",
        "The membership list is never sold, rented, or used to train anything",
      ),
    }),
    node("openforge-cms.cta", {
      heading: "Standards, ethics, and the corrections log",
      buttonLabel: "Open the standards page",
      buttonHref: "/about/standards",
    }),
    siteFooter(),
  ],
};

const newsletterPage = {
  slug: "/newsletter",
  title: "The Dispatch",
  template: "page",
  kicker: "Newsletter",
  description:
    "One letter, every other Thursday. Free, and short enough to finish.",
  blocks: [
    node("openforge-cms.banner", {
      message:
        "The Dispatch goes out every other Thursday: four links, one object, no tracking pixel.",
      ctaLabel: "Subscribe",
      ctaHref: "/newsletter/subscribe",
      tone: "brand",
    }),
    node("openforge-cms.gradient-heading", {
      text: "The Dispatch",
      level: "h1",
      tone: "sunset",
    }),
    node("openforge-cms.rich-text", {
      content: paragraphs(
        "The Dispatch is the free half of Grain & Signal. It is written by whoever is closest to finishing something, it goes out every other Thursday morning, and it is deliberately short — four links, one paragraph of editorial throat-clearing, and one thing pulled out of the archive.",
        "It is not a drip campaign and it is not a funnel. If you never upgrade to a membership, you will keep getting exactly the same letter as everybody else.",
      ),
    }),
    node("openforge-cms.feature-list", {
      heading: "What is in every letter",
      items: lines(
        "A paragraph from the editor on what we are working on, including the pieces that fell through",
        "Four links worth your Thursday, each with a sentence explaining why",
        "One object, drawing, or screenshot pulled out of the archive",
        "The correction log, whenever there is one",
        "Nothing else: no tracking pixel, no recommendations, no sponsor slot",
      ),
    }),
    node("openforge-cms.data-table", {
      heading: "Ways to read us",
      headers: "Tier, Price, What you get",
      rows: lines(
        "The Dispatch|Free|The letter every other Thursday, plus the whole archive after thirty days",
        "Digital member|£5 a month|Every issue on publication day, the archive immediately, the letters page in full",
        "Print member|£11 a month|Everything above, plus the printed issue posted to you and the fold-out field guides",
        "Studio or library|£95 a year|Up to twelve readers on one account, with a shared archive login",
      ),
    }),
    node(
      "openforge-cms.accordion",
      { heading: "Before you subscribe" },
      {
        items: [
          node("openforge-cms.faq-item", {
            question: "Can I read the archive without paying?",
            answer:
              "Yes. Everything older than thirty days is free and stays free, photography included. Membership buys the issue on publication day and the printed edition, not access to the past.",
          }),
          node("openforge-cms.faq-item", {
            question: "What happens to my email address?",
            answer:
              "It goes to our mail provider and nowhere else. It is never sold, rented, or used to train anything, and one click unsubscribes you with no retention offer in the way.",
          }),
          node("openforge-cms.faq-item", {
            question: "Can I cancel a membership?",
            answer:
              "From the account page, in one click, at any time. We refund the remainder of a print membership pro rata and we do not ask why.",
          }),
          node("openforge-cms.faq-item", {
            question: "Do you take advertising in the letter?",
            answer:
              "No. Advertising runs in the printed issue only, clearly marked, never in the Dispatch and never inside a feature. The rate card is on the contact page.",
          }),
        ],
      },
    ),
    node("openforge-cms.cta", {
      heading: "Start with the next letter",
      buttonLabel: "Subscribe free",
      buttonHref: "/newsletter/subscribe",
    }),
    siteFooter(),
  ],
};

const contactPage = {
  slug: "/contact",
  title: "Contact & advertise",
  template: "page",
  kicker: "Contact",
  description:
    "Pitches, corrections, the rate card, and the postal address of a very small office.",
  blocks: [
    node("openforge-cms.heading", {
      text: "How to reach the desks",
      level: "h2",
      align: "left",
    }),
    node("openforge-cms.rich-text", {
      content: paragraphs(
        "Three people read the inbox and all three of them answer. Pick the address that matches what you are sending — it is the difference between a reply in two weeks and a reply in two months.",
        "Every address below is an example address on the reserved .example domain; this is demonstration content, so nothing sent to it arrives anywhere.",
      ),
    }),
    node(
      "openforge-cms.columns",
      { heading: "Where to send it" },
      {
        items: [
          node("openforge-cms.rich-text", {
            content: paragraphs(
              "PITCHES",
              "pitches@grainandsignal.example",
              "One paragraph on the story, one on why now, and one on why you. We answer everything within two weeks, including the noes.",
            ),
          }),
          node("openforge-cms.rich-text", {
            content: paragraphs(
              "CORRECTIONS",
              "corrections@grainandsignal.example",
              "Tell us what is wrong and how you know. Corrections are published on the page they belong to, dated, and never quietly.",
            ),
          }),
          node("openforge-cms.rich-text", {
            content: paragraphs(
              "ADVERTISING",
              "ads@grainandsignal.example",
              "Print only, four formats, rate card below. We do not run advertising in the Dispatch or inside a feature.",
            ),
          }),
        ],
      },
    ),
    node("openforge-cms.data-table", {
      heading: "Print rate card, Issue 15 onward",
      headers: "Placement, Format, Rate",
      rows: lines(
        "Inside front cover|Full page, full bleed|£1,400",
        "Full page|Full page, 5mm margin|£950",
        "Half page|Horizontal, lower half|£560",
        "Field guide sponsor|Colophon credit and one panel|£1,900",
      ),
    }),
    node("openforge-cms.icon-box", {
      icon: "✉",
      title: "By post",
      description:
        "Grain & Signal, Unit 4, Ferrous Yard, Northbank. Anything sent to us unsolicited is donated locally; we do not run reviews.",
      layout: "icon-left",
    }),
    node("openforge-cms.icon-box", {
      icon: "⏱",
      title: "Response times",
      description:
        "Pitches within two weeks. Corrections the same day. Advertising enquiries within three working days.",
      layout: "icon-left",
    }),
    node(
      "openforge-cms.accordion",
      { heading: "Common questions" },
      {
        items: [
          node("openforge-cms.faq-item", {
            question: "Do you accept finished drafts?",
            answer:
              "We would rather have three paragraphs. A pitch lets us commission the piece properly, agree a rate before you write it, and tell you quickly if we already have something similar in the issue.",
          }),
          node("openforge-cms.faq-item", {
            question: "Will you review my product?",
            answer:
              "We do not run reviews at all. We do run reporting about how things are made, maintained, and repaired, and that occasionally involves a product. Access is worth more to us than a sample.",
          }),
          node("openforge-cms.faq-item", {
            question: "Can I reprint a piece?",
            answer:
              "Usually yes, for non-commercial use, with the byline and a link back. Write to the corrections address and say where it is going; commercial syndication is priced case by case.",
          }),
        ],
      },
    ),
    node("openforge-cms.cta", {
      heading: "Send us the story you cannot stop thinking about",
      buttonLabel: "Read the pitch guide",
      buttonHref: "/contact/pitch",
    }),
    siteFooter(),
  ],
};

export const exampleSite = {
  name: "Grain & Signal",
  tagline: "Slow reporting about fast machines.",
  description:
    "A fictional independent monthly on design, technology, and the culture that grows around them, used as the Magazine theme's example site.",
  themeId: "openforge-theme.magazine",
  pages: [
    homePage,
    articlePage,
    culturePage,
    mastheadPage,
    newsletterPage,
    contactPage,
  ],
};
