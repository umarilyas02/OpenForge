/**
 * A complete example storefront for the ecommerce theme.
 *
 * The store is "Hearthline", an invented cast-iron and carbon-steel cookware
 * maker. Every page below is a real `@openforge/renderer` content tree: an
 * array of `{ blockId, blockVersion, props, slots }` nodes using only blocks
 * that exist in `OFFICIAL_CMS_BLOCKS`, with every required prop filled in.
 *
 * There is no dedicated product-grid block in the official set, so product
 * grids are built the honest way: a `columns` block whose items are one
 * nested `columns` per product. Because the columns grid is
 * `repeat(auto-fit, minmax(220px, 1fr))`, a nested grid inside a single
 * outer column resolves to one column, which stacks the product `card`, its
 * `rating`, and its `badge` into a single tile.
 */

/**
 * A block instance. Every official block is at version 1.
 *
 * @param {string} blockId
 * @param {Record<string, unknown>} [props]
 * @param {Record<string, object[]>} [slots]
 */
function block(blockId, props = {}, slots = {}) {
  return { blockId, blockVersion: 1, props, slots };
}

/**
 * A flat colour placeholder, matching the inline-SVG convention the official
 * blocks use for their own default images. Swap these for real photography.
 *
 * @param {string} hex six hex digits, without the leading "#"
 * @param {number} [width]
 * @param {number} [height]
 */
function swatch(hex, width = 640, height = 480) {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Crect width='${width}' height='${height}' fill='%23${hex}'/%3E%3C/svg%3E`;
}

/**
 * One product tile: a card with its star rating and stock badge stacked
 * underneath, ready to drop into a `columns` grid.
 */
function productTile({
  name,
  blurb,
  href,
  fill,
  shortName,
  stars,
  ratingLabel,
  badgeText,
  badgeTone,
}) {
  return block(
    "openforge-cms.columns",
    {},
    {
      items: [
        block("openforge-cms.card", {
          image: swatch(fill),
          title: name,
          description: blurb,
          linkLabel: `View the ${shortName}`,
          linkHref: href,
        }),
        block("openforge-cms.rating", {
          value: stars,
          label: ratingLabel,
        }),
        block("openforge-cms.badge", {
          text: badgeText,
          tone: badgeTone,
        }),
      ],
    },
  );
}

function stat(value, label) {
  return block("openforge-cms.stat", { value, label });
}

function faqItem(question, answer) {
  return block("openforge-cms.faq-item", { question, answer });
}

function pressLogo(name, fill) {
  return block("openforge-cms.logo-item", {
    image: swatch(fill, 200, 72),
    name,
  });
}

function review(quote, author, role) {
  return block("openforge-cms.testimonial", { quote, author, role });
}

function serviceIcon(icon, title, description) {
  return block("openforge-cms.icon-box", {
    icon,
    title,
    description,
    layout: "icon-top",
  });
}

function footerLink(label) {
  return block("openforge-cms.rich-text", { content: label });
}

const homePage = {
  slug: "/",
  title: "Hearthline",
  template: "page",
  description:
    "Storefront landing page: announcement bar, hero, proof stats, a three-product bestseller grid, press strip, and a closing call to action.",
  blocks: [
    block("openforge-cms.banner", {
      message:
        "Free shipping over $75. Every pan leaves the foundry seasoned and ready for heat.",
      ctaLabel: "Shop cast iron",
      ctaHref: "/shop",
      tone: "brand",
    }),
    block("openforge-cms.hero", {
      heading: "Pans you will hand down.",
      subheading:
        "Hearthline pours every skillet, griddle, and Dutch oven in a single sand mould outside Zanesville, Ohio, then seasons it six times in flaxseed oil before it ships. No coating to flake off, no rivets to work loose.",
      ctaLabel: "Shop the collection",
      ctaHref: "/shop",
    }),
    block("openforge-cms.marquee-text", {
      text: "Single-pour sand casting · Six flaxseed seasonings · Cast in Ohio since 2014 · 100-year transferable guarantee",
      speed: "slow",
    }),
    block(
      "openforge-cms.stats-row",
      { heading: "Why cooks come back for a second pan" },
      {
        items: [
          stat("6", "Flaxseed seasoning passes before shipping"),
          stat("4.1 lb", "Weight of the No. 8 skillet"),
          stat("100 yr", "Guarantee, transferable with the pan"),
          stat("38,400", "Kitchens cooking on Hearthline"),
        ],
      },
    ),
    block(
      "openforge-cms.columns",
      { heading: "On the shelf this month" },
      {
        items: [
          productTile({
            name: "The No. 8 Everyday Skillet",
            blurb:
              "$94 — a 10.25-inch cooking surface milled smooth at the face, so it takes an egg in the morning and a hard steak sear the same night.",
            href: "/shop/no-8-everyday-skillet",
            fill: "8a5a44",
            shortName: "No. 8 Everyday Skillet",
            stars: "5",
            ratingLabel: "4.8 out of 5 — 1,204 reviews",
            badgeText: "Back in stock",
            badgeTone: "success",
          }),
          productTile({
            name: "Ridgeback Dutch Oven, 5.5 qt",
            blurb:
              "$186 — ash-glaze enamel over cast iron, with a ridged lid that drips condensation back onto the roast instead of down the side wall.",
            href: "/shop/ridgeback-dutch-oven",
            fill: "b0563a",
            shortName: "Ridgeback Dutch Oven",
            stars: "5",
            ratingLabel: "4.9 out of 5 — 617 reviews",
            badgeText: "Ships in 2 days",
            badgeTone: "neutral",
          }),
          productTile({
            name: "Bellows Carbon-Steel Wok, 14 in",
            blurb:
              "$88 — spun from 1.8 mm carbon steel: light enough to toss one-handed, thin enough to come back to temperature between batches.",
            href: "/shop/bellows-wok",
            fill: "5c5148",
            shortName: "Bellows Carbon-Steel Wok",
            stars: "4",
            ratingLabel: "4.6 out of 5 — 389 reviews",
            badgeText: "New this season",
            badgeTone: "accent",
          }),
        ],
      },
    ),
    block("openforge-cms.feature-list", {
      heading: "Every order includes",
      items:
        "A pan seasoned six times in flaxseed oil, ready to cook the night it lands\nA printed care card with the three-line version of seasoning, and the long version online\nFree returns for 60 days, even on a pan you have already cooked in\nA 100-year guarantee that travels with the pan, not with the receipt",
    }),
    block(
      "openforge-cms.logo-cloud",
      { heading: "Written up in" },
      {
        items: [
          pressLogo("The Slow Table", "e3d7c6"),
          pressLogo("Field & Flame", "d8c9b4"),
          pressLogo("Modern Pantry Quarterly", "cbbda8"),
          pressLogo("Copper & Ash", "e6dccb"),
        ],
      },
    ),
    review(
      "I bought the No. 8 for my daughter's first apartment and ordered a second for myself the same week. Three years on, the face is glassier than the day it arrived and it has never once been near a dishwasher.",
      "Denise Vargas",
      "Home cook, Portland",
    ),
    block("openforge-cms.cta", {
      heading: "Start with the pan you will use tonight.",
      buttonLabel: "Shop cast iron",
      buttonHref: "/shop",
    }),
  ],
};

const shopPage = {
  slug: "/shop",
  title: "Shop cast iron and carbon steel",
  template: "page",
  description:
    "Category page: three product grids (skillets, ovens and woks, care goods) plus a size-and-weight comparison table.",
  blocks: [
    block("openforge-cms.rich-text", {
      content:
        "Nine pieces, cast and finished in one building. We keep the range small on purpose: each shape has to earn its place on the pouring floor, and anything we would not cook on ourselves does not get a mould.\n\nPrices are what we charge everywhere — there is no outlet channel and no seasonal markdown cycle. If a piece is out of stock it is because the moulds are running behind, and the restock date on the product page is the real one.",
    }),
    block("openforge-cms.alert", {
      message:
        "Pans arrive matte grey-black and darken toward gloss over the first dozen meals. That is the seasoning building, not wear.",
      tone: "info",
    }),
    block(
      "openforge-cms.columns",
      { heading: "Skillets and griddles" },
      {
        items: [
          productTile({
            name: "The No. 8 Everyday Skillet",
            blurb:
              "$94 — 10.25-inch surface, 4.1 lb. The one pan most kitchens end up reaching for first.",
            href: "/shop/no-8-everyday-skillet",
            fill: "8a5a44",
            shortName: "No. 8 Everyday Skillet",
            stars: "5",
            ratingLabel: "4.8 out of 5 — 1,204 reviews",
            badgeText: "Back in stock",
            badgeTone: "success",
          }),
          productTile({
            name: "The No. 12 Sunday Skillet",
            blurb:
              "$128 — 13-inch surface, 8.3 lb, with a second helper handle. Cornbread, spatchcocked chicken, a full pound of onions.",
            href: "/shop/no-12-sunday-skillet",
            fill: "77503c",
            shortName: "No. 12 Sunday Skillet",
            stars: "5",
            ratingLabel: "4.9 out of 5 — 486 reviews",
            badgeText: "Ships in 2 days",
            badgeTone: "neutral",
          }),
          productTile({
            name: "The Long Griddle, 18 × 10 in",
            blurb:
              "$142 — spans two burners, one face ridged and one flat, so pancakes and smashburgers share a pan.",
            href: "/shop/long-griddle",
            fill: "6d5f52",
            shortName: "Long Griddle",
            stars: "4",
            ratingLabel: "4.5 out of 5 — 212 reviews",
            badgeText: "Restocking March 4",
            badgeTone: "warning",
          }),
        ],
      },
    ),
    block(
      "openforge-cms.columns",
      { heading: "Ovens, woks, and pots" },
      {
        items: [
          productTile({
            name: "Ridgeback Dutch Oven, 5.5 qt",
            blurb:
              "$186 — enamelled in ash glaze, oven safe to 500°F, and heavy enough in the lid to hold a low simmer without a lid prop.",
            href: "/shop/ridgeback-dutch-oven",
            fill: "b0563a",
            shortName: "Ridgeback Dutch Oven",
            stars: "5",
            ratingLabel: "4.9 out of 5 — 617 reviews",
            badgeText: "Ships in 2 days",
            badgeTone: "neutral",
          }),
          productTile({
            name: "Bellows Carbon-Steel Wok, 14 in",
            blurb:
              "$88 — 1.8 mm carbon steel with a flat 5-inch base, so it sits still on an electric coil as well as a gas ring.",
            href: "/shop/bellows-wok",
            fill: "5c5148",
            shortName: "Bellows Carbon-Steel Wok",
            stars: "4",
            ratingLabel: "4.6 out of 5 — 389 reviews",
            badgeText: "New this season",
            badgeTone: "accent",
          }),
          productTile({
            name: "Hearth Loaf Cloche",
            blurb:
              "$164 — a lidded cast-iron dome that traps a loaf's own steam for the first 20 minutes, for an oven-spring crust without a spray bottle.",
            href: "/shop/hearth-loaf-cloche",
            fill: "8e7a63",
            shortName: "Hearth Loaf Cloche",
            stars: "5",
            ratingLabel: "4.7 out of 5 — 158 reviews",
            badgeText: "Baker favourite",
            badgeTone: "accent",
          }),
        ],
      },
    ),
    block(
      "openforge-cms.columns",
      { heading: "Care and everyday extras" },
      {
        items: [
          productTile({
            name: "Seasoning Kit",
            blurb:
              "$34 — 8 oz of cold-pressed flaxseed oil, two lint-free buffing cloths, and the card that explains how thin a coat should actually be.",
            href: "/shop/seasoning-kit",
            fill: "c4a882",
            shortName: "Seasoning Kit",
            stars: "5",
            ratingLabel: "4.8 out of 5 — 940 reviews",
            badgeText: "Pairs with any pan",
            badgeTone: "neutral",
          }),
          productTile({
            name: "Chainmail Scrubber",
            blurb:
              "$19 — 316 stainless rings that lift stuck-on fond without stripping seasoning. Dishwasher safe, unlike the pan it cleans.",
            href: "/shop/chainmail-scrubber",
            fill: "8f8f89",
            shortName: "Chainmail Scrubber",
            stars: "5",
            ratingLabel: "4.7 out of 5 — 1,388 reviews",
            badgeText: "Best seller",
            badgeTone: "success",
          }),
          productTile({
            name: "Waxed Canvas Apron, Clay",
            blurb:
              "$72 — 10 oz waxed canvas with a leather neck strap and a towel loop that sits where your hand already goes.",
            href: "/shop/waxed-canvas-apron",
            fill: "9c8266",
            shortName: "Waxed Canvas Apron",
            stars: "4",
            ratingLabel: "4.4 out of 5 — 271 reviews",
            badgeText: "Two sizes",
            badgeTone: "neutral",
          }),
        ],
      },
    ),
    block("openforge-cms.divider", { style: "solid" }),
    block("openforge-cms.data-table", {
      heading: "Size and weight at a glance",
      headers: "Piece, Cooking surface, Weight, Oven safe to",
      rows: "The No. 8 Everyday Skillet|10.25 in|4.1 lb|650°F\nThe No. 12 Sunday Skillet|13 in|8.3 lb|650°F\nThe Long Griddle|18 × 10 in|9.7 lb|650°F\nRidgeback Dutch Oven|5.5 qt|11.2 lb|500°F\nBellows Carbon-Steel Wok|14 in|3.4 lb|600°F\nHearth Loaf Cloche|9 in round|10.1 lb|650°F",
    }),
    block("openforge-cms.cta", {
      heading: "Not sure which pan to start with?",
      buttonLabel: "Read the sizing guide",
      buttonHref: "/shop/sizing-guide",
    }),
  ],
};

const productPage = {
  slug: "/shop/no-8-everyday-skillet",
  title: "The No. 8 Everyday Skillet",
  template: "page",
  description:
    "Product detail page: stock badge, product image, star rating, specification list, add-to-cart button, service icons, an FAQ accordion, and a review.",
  blocks: [
    block("openforge-cms.badge", { text: "Back in stock", tone: "success" }),
    block("openforge-cms.image", {
      src: swatch("8a5a44", 960, 720),
      alt: "The No. 8 Everyday Skillet: a 10.25-inch cast-iron pan with a milled cooking face, a long handle, and a looped helper handle opposite.",
      caption: "The No. 8 after roughly two years of daily use.",
    }),
    block("openforge-cms.rating", {
      value: "5",
      label: "4.8 out of 5 — 1,204 verified reviews",
    }),
    block("openforge-cms.rich-text", {
      content:
        "$94. The No. 8 is the pan we designed first and have changed least. It is poured in a single sand mould, which means the handle is the same piece of iron as the body — nothing riveted, nothing welded, nothing to loosen after a decade of oven cycles.\n\nThe cooking face is machined flat and then milled to 220 grit before seasoning, so it starts closer to the glassy surface an inherited pan takes twenty years to earn. Six passes of flaxseed oil go on before it is boxed; you can fry an egg the night it arrives.\n\nAt 4.1 lb it is light enough to move one-handed off a hot burner, and the 10.25-inch face fits two chicken thighs with room to baste. If you are cooking for four or more on a regular basis, look at the No. 12 instead.",
    }),
    block("openforge-cms.feature-list", {
      heading: "Specifications",
      items:
        "10.25 in cooking surface, 12 in rim to rim\n4.1 lb bare, 4.6 lb with the walnut handle sleeve\n1.9 qt to the rim: deep enough for a short braise\nMachined flat, milled to 220 grit, then seasoned six times in flaxseed oil\nCast in a single pour — no rivets, no welded handle\nOven, grill, and open-fire safe to 650°F",
    }),
    block("openforge-cms.button", {
      label: "Add to cart — $94",
      href: "/cart/add/no-8-everyday-skillet",
      variant: "primary",
    }),
    block(
      "openforge-cms.columns",
      {},
      {
        items: [
          serviceIcon(
            "◷",
            "Ships in 1–2 days",
            "Packed in Ohio and handed to the carrier the same weekday when you order before 2 p.m. Eastern.",
          ),
          serviceIcon(
            "↩",
            "60-day returns",
            "Cook on it first. If it is not the pan for your kitchen, send it back inside 60 days and we pay the label.",
          ),
          serviceIcon(
            "∞",
            "100-year guarantee",
            "Cracks, warps, and casting flaws are ours to fix or replace, for whoever owns the pan a decade from now.",
          ),
        ],
      },
    ),
    block(
      "openforge-cms.accordion",
      { heading: "Questions about this pan" },
      {
        items: [
          faqItem(
            "Does it work on an induction hob?",
            "Yes. Cast iron is fully ferrous, so the No. 8 couples with any induction surface. The base is machined flat, which matters more on induction than on gas — a rocking pan reads as an intermittent load.",
          ),
          faqItem(
            "Do I need to season it before the first use?",
            "No. It leaves the foundry with six baked-on coats. Cook something fatty for the first meal — bacon, potatoes in oil — and you are adding to that layer rather than starting one.",
          ),
          faqItem(
            "Can I use soap on it?",
            "You can. Modern dish soap is not lye and will not strip polymerised seasoning. What does strip it is a long soak, so wash it warm, dry it on the burner, and wipe a fingertip of oil over the face.",
          ),
          faqItem(
            "What if it rusts?",
            "Scrub the rust back with the chainmail scrubber, wash, dry on heat, and re-season once. If it rusted through a casting void rather than neglect, that is a warranty case — send us a photo and we will replace it.",
          ),
        ],
      },
    ),
    review(
      "We run six of these on the line and they take a beating no clad pan would survive. The milled face is the difference — fish releases from it, which I did not expect from raw cast iron.",
      "Marcus Oyelaran",
      "Chef de cuisine, Little Kettle",
    ),
    block("openforge-cms.cta", {
      heading: "Pair it with the seasoning kit.",
      buttonLabel: "Add the seasoning kit — $34",
      buttonHref: "/shop/seasoning-kit",
    }),
  ],
};

const aboutPage = {
  slug: "/about",
  title: "Our foundry",
  template: "page",
  description:
    "Brand story page: foundry image, origin narrative, a four-step timeline, foundry stats, three value cards, and a recycled-iron progress bar.",
  blocks: [
    block("openforge-cms.image", {
      src: swatch("6b5245", 960, 540),
      alt: "The pouring floor at the Hearthline foundry, with a ladle of molten iron tipped over a row of green sand moulds.",
      caption: "Pour day runs Tuesday and Thursday, 5 a.m. to noon.",
    }),
    block("openforge-cms.rich-text", {
      content:
        "Hearthline started in 2014 in a rented bay with two furnaces, a borrowed pattern, and a stubborn conviction that a skillet should not need twenty years of use before it cooks well.\n\nThe cast-iron pans most people inherit were machined smooth on the inside. Somewhere in the middle of the last century that step was dropped, because a rough face is cheaper and the customer will sand it themselves over a decade of frying. We put the milling step back and priced it in.\n\nEverything ships from the same building it is poured in. The people who cast the iron are on the same floor as the people who pack the boxes, which is the shortest possible distance between a casting flaw and someone noticing it.",
    }),
    block(
      "openforge-cms.timeline",
      { heading: "How Hearthline got here" },
      {
        items: [
          block("openforge-cms.timeline-step", {
            date: "2014",
            title: "Two furnaces and a rented bay",
            description:
              "The first 140 skillets were poured, milled, and seasoned by four people, and sold at three farmers markets in a single autumn.",
          }),
          block("openforge-cms.timeline-step", {
            date: "2017",
            title: "The milled face becomes standard",
            description:
              "We bought the CNC bed that lets every pan get a machined cooking surface, not just the ones from a good mould. Returns dropped by two thirds the following year.",
          }),
          block("openforge-cms.timeline-step", {
            date: "2021",
            title: "Enamel, in house",
            description:
              "The Ridgeback Dutch Oven launched after three years of glaze trials. Bringing enamelling in house meant we stopped shipping raw castings overseas and back.",
          }),
          block("openforge-cms.timeline-step", {
            date: "2025",
            title: "The repair bench",
            description:
              "Two people now do nothing but re-machine and re-season pans sent back under the guarantee, including pans older than the company.",
          }),
        ],
      },
    ),
    block(
      "openforge-cms.stats-row",
      { heading: "The foundry today" },
      {
        items: [
          stat("37", "People on the floor"),
          stat("1,900", "Pieces poured each week"),
          stat("90%", "Recycled iron in every pour"),
        ],
      },
    ),
    block(
      "openforge-cms.columns",
      { heading: "What we will not compromise on" },
      {
        items: [
          block("openforge-cms.spotlight-card", {
            icon: "⬗",
            title: "One pour, one piece",
            description:
              "Handles are cast with the body. A riveted handle is a hinge waiting to happen, and we have never shipped one.",
            tone: "amber",
          }),
          block("openforge-cms.spotlight-card", {
            icon: "◎",
            title: "Milled, not tumbled",
            description:
              "Every cooking face is machined and milled to 220 grit. It is the slowest step we do and the one customers notice first.",
            tone: "rose",
          }),
          block("openforge-cms.spotlight-card", {
            icon: "⟲",
            title: "Repair before replace",
            description:
              "A warped or pitted pan comes back to the bench, not the scrap bin. Roughly seven in ten go home re-machined instead of replaced.",
            tone: "violet",
          }),
        ],
      },
    ),
    block("openforge-cms.progress", {
      label: "Scrap and returned iron in every new pour",
      percent: "90",
    }),
    block("openforge-cms.cta", {
      heading: "Come and watch a pour.",
      buttonLabel: "Book a foundry tour",
      buttonHref: "/visit",
    }),
  ],
};

const reviewsPage = {
  slug: "/reviews",
  title: "What cooks say",
  template: "page",
  description:
    "Social-proof page: headline rating, review-programme explainer, service stats, two grids of customer and professional reviews, and per-product ratings.",
  blocks: [
    block("openforge-cms.gradient-heading", {
      text: "4.8 out of 5, across 3,412 kitchens",
      level: "h2",
      tone: "sunset",
    }),
    block("openforge-cms.rating", {
      value: "5",
      label: "4.8 out of 5 — 3,412 verified reviews collected since 2014",
    }),
    block("openforge-cms.rich-text", {
      content:
        "Every review below comes from an order we shipped, and the request goes out 30 days after delivery rather than the morning the box lands — a pan is not worth reviewing until you have cooked on it a dozen times.\n\nWe do not delete one-star reviews. If you find one, you will also find the reply from the person on the care desk who dealt with it.",
    }),
    block(
      "openforge-cms.stats-row",
      { heading: "Beyond the star count" },
      {
        items: [
          stat("1.9%", "Orders returned"),
          stat("41%", "Buyers who order a second piece within a year"),
          stat("6 hr", "Median first reply from the care desk"),
        ],
      },
    ),
    block(
      "openforge-cms.columns",
      { heading: "Recent reviews" },
      {
        items: [
          review(
            "The No. 8 replaced a nonstick pan I had been replacing every eighteen months. Two years in, it has cost me nothing but a bottle of flaxseed oil and it sears better than it did new.",
            "Priya Raman",
            "Verified buyer — No. 8 Everyday Skillet",
          ),
          review(
            "The Ridgeback holds a 200°F oven overnight for stock without so much as a rattle from the lid. The ridged underside really does drip back onto the meat instead of the wall of the pot.",
            "Tom Whitaker",
            "Verified buyer — Ridgeback Dutch Oven",
          ),
          review(
            "I was sceptical about paying for a scrubber. It got eight months of neglected fond off a pan I had almost given up on, in about four minutes, without touching the seasoning underneath.",
            "Ana Cardoso",
            "Verified buyer — Chainmail Scrubber",
          ),
        ],
      },
    ),
    block(
      "openforge-cms.columns",
      { heading: "From professional kitchens" },
      {
        items: [
          review(
            "We put four Long Griddles on the brunch line in 2023 and have not pulled one for repair since. On a service that turns 300 covers, that is the whole review.",
            "Hannah Beaulieu",
            "Owner, Marrow & Rye",
          ),
          review(
            "The woks are the only carbon steel my crew has not warped. Thin enough to recover between batches, thick enough at the base that nobody has put a hot spot through one.",
            "Wei-Lin Ho",
            "Head chef, Nine Bridges",
          ),
          review(
            "Their repair bench re-machined a skillet my grandmother bought from someone else entirely. They charged me for shipping and nothing else. That is why we buy new ones from them.",
            "Gerald Amoah",
            "Pastry chef, Foldhouse Bakery",
          ),
        ],
      },
    ),
    block("openforge-cms.data-table", {
      heading: "Ratings by piece",
      headers: "Piece, Rating, Reviews",
      rows: "The No. 8 Everyday Skillet|4.8|1,204\nThe No. 12 Sunday Skillet|4.9|486\nThe Long Griddle|4.5|212\nRidgeback Dutch Oven|4.9|617\nBellows Carbon-Steel Wok|4.6|389\nChainmail Scrubber|4.7|1,388",
    }),
    block("openforge-cms.cta", {
      heading: "Add yours after the first good meal.",
      buttonLabel: "Shop cast iron",
      buttonHref: "/shop",
    }),
  ],
};

const shippingPage = {
  slug: "/shipping-and-contact",
  title: "Shipping, returns, and reaching us",
  template: "page",
  description:
    "Service page: dispatch notice, three service promises, a delivery-cost table, the returns policy, an FAQ accordion, and how to reach a human.",
  blocks: [
    block("openforge-cms.alert", {
      message:
        "Orders placed before 2 p.m. Eastern go out the same weekday. Anything after that ships the next morning, and we do not dispatch on Sundays.",
      tone: "info",
    }),
    block(
      "openforge-cms.columns",
      {},
      {
        items: [
          serviceIcon(
            "◷",
            "Dispatched in 1–2 days",
            "Every piece ships from the foundry in Ohio. Nothing is drop-shipped, so stock counts on the site are real counts.",
          ),
          serviceIcon(
            "✉",
            "Free over $75",
            "Ground shipping is free on US orders over $75. Under that it is a flat $9, however heavy the box turns out to be.",
          ),
          serviceIcon(
            "∞",
            "Guaranteed for 100 years",
            "Casting flaws, warps, and cracks are ours to fix. The guarantee follows the pan, so an inherited one is still covered.",
          ),
        ],
      },
    ),
    block("openforge-cms.data-table", {
      heading: "Delivery estimates",
      headers: "Destination, Method, Estimate, Cost",
      rows: "United States|Ground|3–5 business days|Free over $75, otherwise $9\nUnited States|Express|2 business days|$24\nCanada|Ground|6–9 business days|$18, duties prepaid\nUnited Kingdom and EU|Air|7–11 business days|$32, duties prepaid\nAustralia and New Zealand|Air|10–16 business days|$46, duties at the border",
    }),
    block("openforge-cms.heading", {
      text: "Returns",
      level: "h2",
      align: "left",
    }),
    block("openforge-cms.rich-text", {
      content:
        "Cook on it. If the pan is not right for your kitchen, tell us within 60 days and we will email a prepaid label — a seasoned, used pan is fine, and so is one you have already scrubbed back to grey.\n\nRefunds land on the original card within five business days of the pan reaching the foundry. Engraved pieces and gift cards are the only two exceptions, and both are flagged as final sale before you check out.",
    }),
    block(
      "openforge-cms.accordion",
      { heading: "Shipping and returns questions" },
      {
        items: [
          faqItem(
            "My box arrived dented. Is the pan damaged?",
            "Almost certainly not — a 9 lb casting will dent a carton long before the carton hurts the casting. Check the cooking face for chips and photograph anything you find; we will replace it same day rather than ask you to ship it back first.",
          ),
          faqItem(
            "Can I change the address after ordering?",
            "Yes, up until the label prints. Reply to your confirmation email and the care desk will catch it if the box has not left the packing bench.",
          ),
          faqItem(
            "Do you ship enamelled pieces in winter?",
            "We do. Enamel does not mind cold, but we hold enamelled orders at the depot rather than leaving them on a porch below freezing when the forecast calls for it.",
          ),
          faqItem(
            "Is the guarantee transferable if I give the pan away?",
            "It is. There is no registration and no receipt requirement — send a photo of the pan and its casting mark and the repair bench will take it from there.",
          ),
        ],
      },
    ),
    block("openforge-cms.heading", {
      text: "Reaching a person",
      level: "h2",
      align: "left",
    }),
    block("openforge-cms.rich-text", {
      content:
        "The care desk is four people in the same building as the furnaces, reachable at care@hearthline.example or (614) 555-0147, Monday to Friday, 8 a.m. to 6 p.m. Eastern.\n\nFor wholesale, press, or a foundry tour, write to the same address with the subject line spelled out and it will be routed the same day.",
    }),
    block("openforge-cms.cta", {
      heading: "Still stuck? Write to the care desk.",
      buttonLabel: "Email the care desk",
      buttonHref: "mailto:care@hearthline.example",
    }),
  ],
};

export const exampleSite = {
  name: "Hearthline",
  tagline: "Cast-iron and carbon-steel cookware, poured and milled in Ohio.",
  description:
    "A six-page example storefront demonstrating the ecommerce theme: product grids assembled from card, rating, and badge blocks inside nested columns, plus social proof, service, and policy pages.",
  themeId: "openforge-theme.ecommerce",
  pages: [
    homePage,
    shopPage,
    productPage,
    aboutPage,
    reviewsPage,
    shippingPage,
  ],
  footer: [
    block(
      "openforge-cms.footer",
      {
        copyrightText:
          "© 2026 Hearthline Cast Goods. Poured, milled, and seasoned in Ohio.",
      },
      {
        links: [
          footerLink("Shop"),
          footerLink("Our foundry"),
          footerLink("Reviews"),
          footerLink("Shipping and returns"),
        ],
      },
    ),
  ],
};
