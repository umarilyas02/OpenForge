/**
 * A complete example site for the Travel theme, expressed as real content
 * trees (`{ blockId, blockVersion, props, slots }`) built from the official
 * CMS block set. Every block instance below supplies each of its block's
 * required editable fields, so the whole site parses, validates, and
 * renders without a single missing prop.
 *
 * The fictional business is "Sundrift Travel Co.", a boutique travel
 * agency and tour operator.
 */

/**
 * A tiny inline SVG placeholder, used wherever the example site needs a
 * real image URL (logos, avatars, destination photos, article art). Kept
 * as a data URI so the kit has no external asset dependencies.
 *
 * @param {number} width
 * @param {number} height
 * @param {string} fill Six-digit hex color, without the leading "#".
 */
const artwork = (width, height, fill) =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Crect width='${width}' height='${height}' fill='%23${fill}'/%3E%3C/svg%3E`;

const logoArt = (fill) => artwork(160, 48, fill);
const avatarArt = (fill) => artwork(96, 96, fill);
const destinationArt = (fill) => artwork(640, 480, fill);
const tourArt = (fill) => artwork(640, 360, fill);

const home = {
  path: "/",
  title: "Sundrift Travel Co. — adventures worth chasing the sun for",
  blocks: [
    {
      blockId: "openforge-cms.banner",
      blockVersion: 1,
      props: {
        message:
          "Flash sale: book any Mediterranean escape by Friday and save 15% on the trip price.",
        ctaLabel: "View the offer",
        ctaHref: "/packages",
        tone: "brand",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.hero",
      blockVersion: 1,
      props: {
        heading: "Go further than you planned to.",
        subheading:
          "Sundrift designs small-group and private trips to the coastlines, ruins, and trailheads you have been saving to a folder for years — handled end to end, from the first flight to the last sunset.",
        ctaLabel: "Explore destinations",
        ctaHref: "/destinations",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.logo-cloud",
      blockVersion: 1,
      props: {
        heading: "As featured in",
      },
      slots: {
        items: [
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("ffd9c4"), name: "Wanderlust Weekly" },
            slots: {},
          },
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("cdeee6"), name: "The Departure Board" },
            slots: {},
          },
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("ffd9c4"), name: "Coastal & Trail" },
            slots: {},
          },
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("cdeee6"), name: "Off-Season Magazine" },
            slots: {},
          },
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("ffd9c4"), name: "Longhaul Living" },
            slots: {},
          },
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("cdeee6"), name: "Field Notes Travel" },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.stats-row",
      blockVersion: 1,
      props: { heading: "Nine years of getting people out the door" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "38", label: "countries on the map" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "12,000+", label: "travelers sent off" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "4.9 / 5", label: "average trip rating" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "24/7", label: "support while you travel" },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.feature-list",
      blockVersion: 1,
      props: {
        heading: "Why people book their second trip with us too",
        items:
          "Every itinerary is built by a destination specialist who has actually been there, not assembled from a template\nLocal guides and drivers who live in the places you are visiting, not a rotating call center\nA single point of contact from your first question through the day you land back home\nReal-time trip support: flight changes, closures, and weather rerouted for you, not left for you to solve at 2am\nTransparent pricing with no surprise fees added after you have already said yes",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.spotlight-card",
      blockVersion: 1,
      props: {
        icon: "🗺️",
        title: "Personalized, not packaged",
        description:
          "Tell us your pace, your budget, and what you actually want to see. We build the route around you instead of fitting you into a bus schedule.",
        tone: "amber",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.spotlight-card",
      blockVersion: 1,
      props: {
        icon: "📞",
        title: "Someone answers at 2am too",
        description:
          "A missed connection or a closed trailhead does not have to ruin your trip. Our on-trip support line is staffed around the clock, in your time zone or theirs.",
        tone: "cyan",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.spotlight-card",
      blockVersion: 1,
      props: {
        icon: "🏷️",
        title: "Best price, or we cover the difference",
        description:
          "If you find the same itinerary cheaper elsewhere within 14 days of booking, we match it and credit the difference to your trip.",
        tone: "violet",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.testimonial",
      blockVersion: 1,
      props: {
        quote:
          "We told Sundrift we wanted Portugal without the tourist traps, and that is exactly what we got. Our specialist rerouted us around a rail strike before we even knew about it — we found out from her text, not the news.",
        author: "Renata Alves",
        role: "traveled the Douro Valley, 2025",
        avatar: avatarArt("ffd9c4"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.testimonial",
      blockVersion: 1,
      props: {
        quote:
          "Booked a solo trip to Japan with about six weeks' notice. They built a full three-week route around trains and ryokans I never would have found myself, and answered every panicked message within the hour.",
        author: "Devon Okafor",
        role: "traveled Honshu, solo, 2025",
        avatar: avatarArt("cdeee6"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.cta",
      blockVersion: 1,
      props: {
        heading: "Tell us where you keep meaning to go",
        buttonLabel: "Start planning your trip",
        buttonHref: "/contact",
      },
      slots: {},
    },
  ],
};

const destinations = {
  path: "/destinations",
  title: "Destinations & Tours",
  blocks: [
    {
      blockId: "openforge-cms.hero",
      blockVersion: 1,
      props: {
        heading: "Where you could be this year",
        subheading:
          "A working list, not a brochure: every destination below is a trip we run several times a season, with a specialist who knows it well enough to tell you when not to go.",
        ctaLabel: "See package pricing",
        ctaHref: "/packages",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.heading",
      blockVersion: 1,
      props: {
        text: "Six places our travelers keep coming back to",
        level: "h2",
        align: "center",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.image-gallery",
      blockVersion: 1,
      props: { heading: "" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.gallery-item",
            blockVersion: 1,
            props: {
              image: destinationArt("ff8a65"),
              alt: "Whitewashed cliffside village overlooking the sea in Santorini",
              caption: "Santorini, Greece",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.gallery-item",
            blockVersion: 1,
            props: {
              image: destinationArt("6fb3a8"),
              alt: "Lantern-lit temple street in Kyoto at dusk",
              caption: "Kyoto, Japan",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.gallery-item",
            blockVersion: 1,
            props: {
              image: destinationArt("e8c07d"),
              alt: "Golden savanna at sunrise with acacia trees in the Serengeti",
              caption: "Serengeti, Tanzania",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.gallery-item",
            blockVersion: 1,
            props: {
              image: destinationArt("7ea1c9"),
              alt: "Granite peaks reflected in a glacial lake in Patagonia",
              caption: "Torres del Paine, Patagonia",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.gallery-item",
            blockVersion: 1,
            props: {
              image: destinationArt("6fc19a"),
              alt: "Terraced rice paddies and a volcano in Bali",
              caption: "Ubud, Bali",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.gallery-item",
            blockVersion: 1,
            props: {
              image: destinationArt("ffb199"),
              alt: "Pastel fishing villages along the Amalfi coastline",
              caption: "Amalfi Coast, Italy",
            },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.heading",
      blockVersion: 1,
      props: {
        text: "Popular tours running this season",
        level: "h2",
        align: "center",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.carousel",
      blockVersion: 1,
      props: { heading: "" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.carousel-slide",
            blockVersion: 1,
            props: {
              image: tourArt("ff8a65"),
              caption: "Cyclades Island Hopper — 10 days, small group",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.carousel-slide",
            blockVersion: 1,
            props: {
              image: tourArt("6fb3a8"),
              caption: "Kyoto to Kanazawa Rail Trail — 14 days, self-guided",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.carousel-slide",
            blockVersion: 1,
            props: {
              image: tourArt("e8c07d"),
              caption: "Classic Serengeti Safari — 8 days, private vehicle",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.carousel-slide",
            blockVersion: 1,
            props: {
              image: tourArt("7ea1c9"),
              caption: "Patagonia Trekking Circuit — 12 days, guided",
            },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.icon-box",
      blockVersion: 1,
      props: {
        icon: "🏛️",
        title: "Mediterranean escapes",
        description:
          "Island-hopping through Greece and Italy's coastline, timed around the ferries and the light, not the cruise-ship crowds.",
        layout: "icon-left",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.icon-box",
      blockVersion: 1,
      props: {
        icon: "🎋",
        title: "Southeast Asia adventures",
        description:
          "Temples, street food, and rice terraces across Japan, Bali, and Vietnam, paced for both first-timers and repeat travelers.",
        layout: "icon-left",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.icon-box",
      blockVersion: 1,
      props: {
        icon: "🦒",
        title: "African safaris",
        description:
          "Tanzania, Kenya, and Botswana with guides who track the migration for a living, in vehicles that never exceed six guests.",
        layout: "icon-left",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.icon-box",
      blockVersion: 1,
      props: {
        icon: "🏔️",
        title: "South American trails",
        description:
          "Patagonia treks and Andean routes with acclimatization days built in, so the itinerary respects your lungs as much as your schedule.",
        layout: "icon-left",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.divider",
      blockVersion: 1,
      // The divider's own "style" field collides with the renderer's
      // universal style-override prop, so this instance leaves it unset and
      // takes the component's built-in solid default.
      props: {},
      slots: {},
    },
    {
      blockId: "openforge-cms.timeline",
      blockVersion: 1,
      props: { heading: "How a Sundrift trip comes together" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "Step 1",
              title: "Discover",
              description:
                "A 20-minute call about your pace, budget, and the places you keep bookmarking. No form to fill out first.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "Step 2",
              title: "Customize",
              description:
                "Your specialist drafts a day-by-day route and swaps anything that does not fit until it does.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "Step 3",
              title: "Book",
              description:
                "One deposit locks in flights, stays, and guides. Full payment is not due until 60 days before departure.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "Step 4",
              title: "Travel",
              description:
                "You get a printed and digital itinerary plus a 24/7 support number. We handle whatever changes once you are on the ground.",
            },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.data-table",
      blockVersion: 1,
      props: {
        heading: "At a glance",
        headers: "Destination, Best season, Typical length, Starting price",
        rows:
          "Santorini & the Cyclades|April – October|10 days|$3,190\nKyoto & the Kansai rail line|March – May, Oct – Nov|14 days|$4,450\nSerengeti safari|June – October|8 days|$5,980\nTorres del Paine, Patagonia|November – March|12 days|$4,720\nUbud & the Bali highlands|April – September|9 days|$2,860\nAmalfi Coast|May – September|7 days|$3,050",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.feature-list",
      blockVersion: 1,
      props: {
        heading: "Every tour includes",
        items:
          "A dedicated destination specialist from your first call through your return flight\nVetted local guides and drivers, briefed on your itinerary in advance\nAll intra-trip transport, entrance fees, and the accommodations listed in your itinerary\nA 24/7 emergency support line, active for the full length of your trip\nA digital and printed day-by-day itinerary you can hand to anyone",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.cta",
      blockVersion: 1,
      props: {
        heading: "See a destination that is not on this list?",
        buttonLabel: "Ask us to plan it",
        buttonHref: "/contact",
      },
      slots: {},
    },
  ],
};

const packages = {
  path: "/packages",
  title: "Packages & Pricing",
  blocks: [
    {
      blockId: "openforge-cms.hero",
      blockVersion: 1,
      props: {
        heading: "Three ways to travel with us",
        subheading:
          "Every package includes a dedicated specialist and 24/7 on-trip support. The difference is how much of the planning and the comfort you want us to take off your plate.",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.pricing",
      blockVersion: 1,
      props: {
        planName: "Explorer",
        price: "From $1,890 per person",
        features:
          "Custom day-by-day itinerary\nMid-range, hand-picked accommodations\nGroup or private transport between stops\n24/7 on-trip support line\nFree itinerary changes up to 30 days out",
        buttonLabel: "Start with Explorer",
        buttonHref: "/contact",
        featured: false,
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.pricing",
      blockVersion: 1,
      props: {
        planName: "Adventurer",
        price: "From $3,290 per person",
        features:
          "Everything in Explorer\nBoutique and 4-star accommodations\nPrivate guide for signature excursions\nAirport transfers included both ways\nOne complimentary itinerary redesign after booking",
        buttonLabel: "Start with Adventurer",
        buttonHref: "/contact",
        featured: true,
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.pricing",
      blockVersion: 1,
      props: {
        planName: "Luxury Escape",
        price: "From $6,450 per person",
        features:
          "Everything in Adventurer\n5-star and heritage-property accommodations\nPrivate guide and driver for the full trip\nPriority rebooking on any flight disruption\nA dedicated concierge reachable by call or message",
        buttonLabel: "Talk to a specialist",
        buttonHref: "/contact",
        featured: false,
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.alert",
      blockVersion: 1,
      props: {
        message:
          "Book any package for travel before the end of the season and take 10% off your deposit — mention the early-bird rate when you reach out.",
        tone: "info",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.accordion",
      blockVersion: 1,
      props: { heading: "Questions we get before people book" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "What is actually included in the price?",
              answer:
                "Accommodations, ground transport, guides, and the entrance fees listed in your itinerary. International flights are quoted separately so you can use points or your own airline if you prefer.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "How far in advance do I need to book?",
              answer:
                "Most trips are bookable with as little as six weeks' notice. Peak-season safaris and small-ship trips fill up faster, so we recommend 3-4 months out for those.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "Can you plan a trip for a group or a family?",
              answer:
                "Yes. Group and multi-generational itineraries are common — we build in flexible days and options at each stop so not everyone has to do everything together.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "What happens if my flight gets cancelled mid-trip?",
              answer:
                "Call the 24/7 support line on your itinerary. Your specialist handles rebooking and adjusts the rest of your schedule so a delay does not cost you the whole trip.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "Is my deposit refundable?",
              answer:
                "Deposits are refundable up to 60 days before departure, minus a small planning fee. Full cancellation terms are in the itinerary agreement we send before you pay.",
            },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.cta",
      blockVersion: 1,
      props: {
        heading: "Not sure which package fits your trip?",
        buttonLabel: "Talk to a specialist",
        buttonHref: "/contact",
      },
      slots: {},
    },
  ],
};

const about = {
  path: "/about",
  title: "About Sundrift Travel Co.",
  blocks: [
    {
      blockId: "openforge-cms.hero",
      blockVersion: 1,
      props: {
        heading: "We started this because a bad itinerary ruined a good trip",
        subheading:
          "Sundrift began in 2016 after our founder's own honeymoon was routed through three connecting flights and a hotel that had closed. She figured travelers deserved someone who actually checks.",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.rich-text",
      blockVersion: 1,
      props: {
        content:
          "Most travel sites are built to sell you a package that already exists. We built Sundrift backwards: start with the traveler, then assemble the trip, then go check that every hotel, guide, and transfer on the route is actually as good as it looks online.\n\nThat means a smaller team than a typical agency, and a slower way of working. Every destination on our site has been visited by someone on our team in the last two years, and every guide we book has worked with us before.\n\nWe are a team of 19 based across four countries, and between us we have led trips on six continents. We still answer the support line ourselves.",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.stats-row",
      blockVersion: 1,
      props: { heading: "Where we are today" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "19", label: "specialists on the team" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "4", label: "countries we work from" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "12,000+", label: "trips planned since 2016" },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.timeline",
      blockVersion: 1,
      props: { heading: "How we got here" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "2016",
              title: "One traveler, one spreadsheet",
              description:
                "Our founder started planning trips for friends after her own honeymoon went sideways — first as a favor, then for a fee.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "2019",
              title: "First five destination specialists",
              description:
                "Demand outgrew one person's calendar. We hired specialists who had each lived in the regions they now plan trips to.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "2022",
              title: "The 24/7 support line",
              description:
                "After one too many travelers were stranded overnight by a cancelled ferry, we built a support rotation that never goes to voicemail.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "2026",
              title: "38 destinations, still hand-checked",
              description:
                "We added our first South American trekking routes this year, each one scouted in person before it went on the site.",
            },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.heading",
      blockVersion: 1,
      props: {
        text: "The people who will actually plan your trip",
        level: "h2",
        align: "left",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.team-member",
      blockVersion: 1,
      props: {
        name: "Marisol Vega",
        role: "Founder & Mediterranean specialist",
        bio: "Planned her first trip for a friend in 2016 after her own honeymoon fell apart. Has personally scouted every hotel Sundrift books across Greece and Italy.",
        photo: avatarArt("ff8a65"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.team-member",
      blockVersion: 1,
      props: {
        name: "Kenji Osoro",
        role: "Southeast Asia & Japan specialist",
        bio: "Led small-group tours across Japan for a decade before joining Sundrift to build our rail and ryokan itineraries.",
        photo: avatarArt("6fb3a8"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.team-member",
      blockVersion: 1,
      props: {
        name: "Amara Nkosi",
        role: "Head of safari & support operations",
        bio: "Ten years guiding in the Serengeti before moving behind the scenes to run the 24/7 support line that now covers every trip we book.",
        photo: avatarArt("e8c07d"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.cta",
      blockVersion: 1,
      props: {
        heading: "We are hiring destination specialists in South America",
        buttonLabel: "Get in touch",
        buttonHref: "/contact",
      },
      slots: {},
    },
  ],
};

const contact = {
  path: "/contact",
  title: "Contact",
  blocks: [
    {
      blockId: "openforge-cms.hero",
      blockVersion: 1,
      props: {
        heading: "Tell us about the trip you keep putting off",
        subheading:
          "No sales script, no obligation quote. Write to us or call the office, and a destination specialist will get back to you within one business day.",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.location-card",
      blockVersion: 1,
      props: {
        name: "Sundrift Travel Co. — main office",
        address: "84 Harbor View Road\nSuite 210\nSan Diego, CA 92101",
        hours:
          "Mon-Fri: 8am-6pm Pacific\nSat: 9am-2pm Pacific\nSun: Closed (support line stays open)",
        phone: "+1 (619) 555-0148",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.contact-form",
      blockVersion: 1,
      props: {
        heading: "Send us the short version",
        body: "A destination, a rough date, and a headcount is plenty to start — we will ask the rest on the call.",
        action: "https://forms.sundrift.example/contact",
        submitLabel: "Send to a specialist",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.alert",
      blockVersion: 1,
      props: {
        message:
          "Already traveling with us? The 24/7 support number on your itinerary always beats email — use it for anything time-sensitive.",
        tone: "info",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.accordion",
      blockVersion: 1,
      props: { heading: "Before you write in" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "Do I need to know exactly where I want to go?",
              answer:
                "No. Tell us the kind of trip you want — coastline, mountains, a city you keep hearing about — and your specialist will bring you two or three route options.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "Is a first call obligation-free?",
              answer:
                "Yes. The first call is about understanding what you want; nothing is booked and no payment is taken until you approve a full itinerary.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "I am already traveling — how do I reach support?",
              answer:
                "Call the 24/7 number printed on your itinerary. It is answered directly by our support team, day or night, anywhere in the world.",
            },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.cta",
      blockVersion: 1,
      props: {
        heading: "Ready when you are",
        buttonLabel: "Start planning your trip",
        buttonHref: "/packages",
      },
      slots: {},
    },
  ],
};

export const exampleSite = [home, destinations, packages, about, contact];
