/**
 * A complete example conference site for the Events theme, expressed as real
 * content trees (`{ blockId, blockVersion, props, slots }`) built from the
 * official CMS block set. Every block instance below supplies each of its
 * block's required editable fields, so the whole site parses, validates,
 * and renders without a single missing prop.
 *
 * The fictional event is "The Aurum Summit", an annual three-day conference
 * for event producers, planners, and venue leaders, produced by the
 * fictional company "Vantage Events Group".
 */

/**
 * A tiny inline SVG placeholder, used wherever the example site needs a
 * real image URL (logos, avatars, gallery photos). Kept as a data URI so
 * the kit has no external asset dependencies.
 *
 * @param {number} width
 * @param {number} height
 * @param {string} fill Six-digit hex color, without the leading "#".
 */
const artwork = (width, height, fill) =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Crect width='${width}' height='${height}' fill='%23${fill}'/%3E%3C/svg%3E`;

const logoArt = (fill) => artwork(160, 48, fill);
const avatarArt = (fill) => artwork(96, 96, fill);
const coverArt = (fill) => artwork(640, 360, fill);

const home = {
  path: "/",
  title: "The Aurum Summit — three days for the people who build the room",
  blocks: [
    {
      blockId: "openforge-cms.banner",
      blockVersion: 1,
      props: {
        message:
          "Registration for the 2027 Aurum Summit is open — Early Bird pricing ends March 1.",
        ctaLabel: "Reserve your seat",
        ctaHref: "/tickets",
        tone: "brand",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.hero",
      blockVersion: 1,
      props: {
        heading:
          "Three days. One extraordinary gathering for the people who build unforgettable events.",
        subheading:
          "The Aurum Summit brings 1,200 event producers, planners, and venue leaders together each September to trade the ideas, vendors, and stagecraft that make a room feel unforgettable — no filler panels, no vendor-floor small talk.",
        ctaLabel: "Get your pass",
        ctaHref: "/tickets",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.logo-cloud",
      blockVersion: 1,
      props: {
        heading:
          "Produced with the venues and studios that make the room possible",
      },
      slots: {
        items: [
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("e9dab8"), name: "The Marigold Hotel" },
            slots: {},
          },
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("ded1ea"), name: "Wraith & Co. Lighting" },
            slots: {},
          },
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("e9dab8"), name: "Verve Audio Visual" },
            slots: {},
          },
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("ded1ea"), name: "Cabot Street Catering" },
            slots: {},
          },
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("e9dab8"), name: "Northlight Staging" },
            slots: {},
          },
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("ded1ea"), name: "Ember Floral Studio" },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.stats-row",
      blockVersion: 1,
      props: { heading: "What three days at Aurum looks like" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "1,200+", label: "event professionals attending" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "60", label: "speakers and sessions" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "3", label: "days of programming" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "94%", label: "would recommend to a colleague" },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.feature-list",
      blockVersion: 1,
      props: {
        heading:
          "Why event professionals block out their calendar for this one",
        items:
          "Keynotes and case studies taught by working producers, not vendors pitching a product\nHands-on production labs where you build the cue sheet, not just watch a slide about one\nA curated vendor showcase you can actually walk in under an hour\nInvite-only evening receptions that double as a live masterclass in room design\nA resource library of session recordings and templates that stays open all year",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.spotlight-card",
      blockVersion: 1,
      props: {
        icon: "🎓",
        title: "Learn from the people already doing it",
        description:
          "Forty-plus sessions taught by working producers and planners, not vendors pitching a product — real budgets, real failures, real callback numbers included.",
        tone: "violet",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.spotlight-card",
      blockVersion: 1,
      props: {
        icon: "🕯️",
        title: "Feel a room done right",
        description:
          "Every social touchpoint of the Summit is itself a design brief — you experience the craft you came to study, not a hotel ballroom with a projector.",
        tone: "amber",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.spotlight-card",
      blockVersion: 1,
      props: {
        icon: "🤝",
        title: "Leave with people, not just notes",
        description:
          "Structured connection sessions match you with five peers solving the same problem you are, before the evening receptions turn it into a real relationship.",
        tone: "rose",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.testimonial",
      blockVersion: 1,
      props: {
        quote:
          "I have been to a dozen industry conferences. Aurum is the only one where the production itself teaches you something — I redesigned our entire welcome reception around one transition I watched happen on the main stage.",
        author: "Renata Cobb",
        role: "Creative Director, Marigold Events Collective",
        avatar: avatarArt("e9dab8"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.testimonial",
      blockVersion: 1,
      props: {
        quote:
          "The connection sessions alone were worth the flight. I walked away with three vendors I still use and a co-producer for next year's gala.",
        author: "Desmond Ilori",
        role: "Founder, Ilori & Park Productions",
        avatar: avatarArt("ded1ea"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.image-gallery",
      blockVersion: 1,
      props: { heading: "Moments from last year's Summit" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.gallery-item",
            blockVersion: 1,
            props: {
              image: coverArt("e9dab8"),
              alt: "Attendees networking during the opening night reception at the 2026 Summit",
              caption: "Opening night reception, 2026",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.gallery-item",
            blockVersion: 1,
            props: {
              image: coverArt("ded1ea"),
              alt: "A speaker presenting a stagecraft case study on the main stage",
              caption: "Main stage keynote, 2026",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.gallery-item",
            blockVersion: 1,
            props: {
              image: coverArt("e9dab8"),
              alt: "Attendees working through a lighting cue sheet in a hands-on production lab",
              caption: "Production lab, 2026",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.gallery-item",
            blockVersion: 1,
            props: {
              image: coverArt("ded1ea"),
              alt: "The vendor showcase floor set up with lighting and floral displays",
              caption: "Vendor showcase floor, 2026",
            },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.countdown-timer",
      blockVersion: 1,
      props: {
        heading: "Doors open in",
        targetDate: "2027-09-15T14:00:00.000Z",
        expiredMessage: "See you inside — doors are open.",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.newsletter-signup",
      blockVersion: 1,
      props: {
        heading: "Get next year's dates first",
        body: "One email when passes open, one when the agenda drops, nothing else.",
        action: "#newsletter",
        placeholder: "you@company.com",
        submitLabel: "Notify me",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.cta",
      blockVersion: 1,
      props: {
        heading: "Early Bird pricing ends March 1",
        buttonLabel: "See ticket tiers",
        buttonHref: "/tickets",
      },
      slots: {},
    },
  ],
};

const schedule = {
  path: "/schedule",
  title: "Schedule",
  blocks: [
    {
      blockId: "openforge-cms.breadcrumbs",
      blockVersion: 1,
      props: { items: "Home|/\nSchedule" },
      slots: {},
    },
    {
      blockId: "openforge-cms.hero",
      blockVersion: 1,
      props: {
        heading: "Three days, mapped to the minute",
        subheading:
          "Building an agenda is our craft too. Here is exactly what's on stage, in the labs, and after hours.",
        ctaLabel: "Get your pass",
        ctaHref: "/tickets",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.data-table",
      blockVersion: 1,
      props: {
        heading: "The Summit at a glance",
        headers: "Day, Focus, Format",
        rows:
          "Day One|Big-stage keynotes and case studies|Plenary sessions\nDay Two|Hands-on production labs and the vendor showcase|Workshops and showcase floor\nDay Three|Off-site studio tours and the closing gala|Excursions and evening event",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.timeline",
      blockVersion: 1,
      props: { heading: "Day One — Main Stage" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "8:00 AM",
              title: "Registration & Welcome Coffee",
              description:
                "Badge pickup opens at the Marigold Convention Center atrium, alongside coffee from a local roaster and a first look at the vendor showcase.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "9:30 AM",
              title: "Opening Keynote: The Room Remembers",
              description:
                "Renata Cobb walks through three receptions she redesigned from the ground up, and what changed in every callback number that followed.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "11:00 AM",
              title: "Track Sessions Begin",
              description:
                "Forty-plus concurrent sessions across weddings and social, corporate and conference, and festivals and live events run through the afternoon.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "6:00 PM",
              title: "Opening Night Reception",
              description:
                "A live design brief in action: lighting, floral, and sound teams stage the reception itself as the evening's case study.",
            },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.timeline",
      blockVersion: 1,
      props: { heading: "Day Two — Labs & Showcase" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "9:00 AM",
              title: "Production Labs Open",
              description:
                "Small-group labs where you build a real cue sheet, floor plan, or run-of-show with a working producer looking over your shoulder.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "1:00 PM",
              title: "Vendor Showcase Floor Opens",
              description:
                "Sixty booths of lighting, staging, catering, and floral partners, arranged so you can walk the whole floor in under an hour.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "3:30 PM",
              title: "Connection Sessions",
              description:
                "You are matched with five peers solving the same problem you are, in a structured conversation designed to outlast the Summit itself.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "7:30 PM",
              title: "Industry Awards Dinner",
              description:
                "A seated dinner recognizing the year's best event work, produced by the same team that will produce your next callback.",
            },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.tabs",
      blockVersion: 1,
      props: {
        heading: "Choose your track for Day Two",
        labels: "Weddings & Social\nCorporate & Conference\nFestivals & Live Events",
        groupId: "schedule-tracks",
      },
      slots: {
        items: [
          {
            blockId: "openforge-cms.tab-panel",
            blockVersion: 1,
            props: {
              label: "Weddings & Social",
              content:
                "Labs on client-facing proposals, floral and rental budgeting, and designing a reception timeline that survives an emotional father-of-the-bride toast running long.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.tab-panel",
            blockVersion: 1,
            props: {
              label: "Corporate & Conference",
              content:
                "Labs on stakeholder sign-off, AV run-of-show design, and negotiating hotel and convention-center contracts without losing your margin.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.tab-panel",
            blockVersion: 1,
            props: {
              label: "Festivals & Live Events",
              content:
                "Labs on crowd flow and permitting, multi-stage sound design, and building a vendor logistics plan for a site with no loading dock.",
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
        heading: "Save your spot before tracks fill",
        buttonLabel: "Get your pass",
        buttonHref: "/tickets",
      },
      slots: {},
    },
  ],
};

const speakers = {
  path: "/speakers",
  title: "Speakers",
  blocks: [
    {
      blockId: "openforge-cms.breadcrumbs",
      blockVersion: 1,
      props: { items: "Home|/\nSpeakers" },
      slots: {},
    },
    {
      blockId: "openforge-cms.hero",
      blockVersion: 1,
      props: {
        heading: "The people on stage this year",
        subheading:
          "Working producers, designers, and venue leaders — every one of them still doing the job they are teaching, not consulting on memories of it.",
        ctaLabel: "See the full schedule",
        ctaHref: "/schedule",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.avatar-group",
      blockVersion: 1,
      props: {
        caption: "Trusted by 5,000+ event professionals across four Summits",
      },
      slots: {
        items: [
          {
            blockId: "openforge-cms.avatar-item",
            blockVersion: 1,
            props: { image: avatarArt("e9dab8"), name: "Renata Cobb" },
            slots: {},
          },
          {
            blockId: "openforge-cms.avatar-item",
            blockVersion: 1,
            props: { image: avatarArt("ded1ea"), name: "Desmond Ilori" },
            slots: {},
          },
          {
            blockId: "openforge-cms.avatar-item",
            blockVersion: 1,
            props: { image: avatarArt("e9dab8"), name: "Priya Anand" },
            slots: {},
          },
          {
            blockId: "openforge-cms.avatar-item",
            blockVersion: 1,
            props: { image: avatarArt("ded1ea"), name: "Tomas Rieger" },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.heading",
      blockVersion: 1,
      props: {
        text: "This year's speaker lineup",
        level: "h2",
        align: "center",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.team-member",
      blockVersion: 1,
      props: {
        name: "Renata Cobb",
        role: "Creative Director, Marigold Events Collective",
        bio: "Opens the Summit each year with the case study everyone quotes for the next twelve months. Redesigns receptions the way other people redesign floor plans.",
        photo: avatarArt("e9dab8"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.team-member",
      blockVersion: 1,
      props: {
        name: "Desmond Ilori",
        role: "Founder, Ilori & Park Productions",
        bio: "Teaches the budgeting and vendor-negotiation labs that turn a good proposal into a profitable one, drawn from twelve years of real client contracts.",
        photo: avatarArt("ded1ea"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.team-member",
      blockVersion: 1,
      props: {
        name: "Priya Anand",
        role: "VP Events, Northlight Hospitality Group",
        bio: "Runs venue partnerships for a twelve-property hotel group and leads the Day Two session on negotiating contracts without losing your margin.",
        photo: avatarArt("e9dab8"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.team-member",
      blockVersion: 1,
      props: {
        name: "Tomas Rieger",
        role: "Lighting Designer, Wraith & Co.",
        bio: "Designed the lighting for three of the receptions attendees quote back to us every year. Teaches the stagecraft lab on cue-sheet design.",
        photo: avatarArt("ded1ea"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.team-member",
      blockVersion: 1,
      props: {
        name: "Chidinma Okafor",
        role: "Head of Experience, Verve Audio Visual",
        bio: "Builds run-of-show systems for conferences with six concurrent stages, and teaches the AV lab on designing a room nobody notices the tech in.",
        photo: avatarArt("e9dab8"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.team-member",
      blockVersion: 1,
      props: {
        name: "Marisol Vega",
        role: "Owner, Ember Floral Studio",
        bio: "Leads the floral and installation design lab, built around the same seasonal-sourcing process she uses for every wedding her studio produces.",
        photo: avatarArt("ded1ea"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.cta",
      blockVersion: 1,
      props: {
        heading: "Have a session the room needs to hear?",
        buttonLabel: "Submit a proposal",
        buttonHref: "/contact",
      },
      slots: {},
    },
  ],
};

const tickets = {
  path: "/tickets",
  title: "Tickets",
  blocks: [
    {
      blockId: "openforge-cms.breadcrumbs",
      blockVersion: 1,
      props: { items: "Home|/\nTickets" },
      slots: {},
    },
    {
      blockId: "openforge-cms.hero",
      blockVersion: 1,
      props: {
        heading:
          "Every pass gets you the whole Summit — the tier is about how close you sit",
        subheading:
          "Choose a single day on the floor, the full three-day program, or a VIP pass with a seat at the speaker faculty dinner.",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.badge",
      blockVersion: 1,
      props: { text: "Save 20% before March 1", tone: "accent" },
      slots: {},
    },
    {
      blockId: "openforge-cms.pricing",
      blockVersion: 1,
      props: {
        planName: "Day Pass",
        price: "$395",
        features:
          "Choose any single day\nFull access to that day's stage and labs\nVendor showcase floor\nDigital session recordings after the Summit",
        buttonLabel: "Choose Day Pass",
        buttonHref: "/contact",
        featured: false,
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.pricing",
      blockVersion: 1,
      props: {
        planName: "Full Summit Pass",
        price: "$895",
        features:
          "All three days, every track\nOpening night and awards dinner receptions\nPrinted resource guide plus lifetime digital access\nPriority seating at the main stage",
        buttonLabel: "Choose Full Pass",
        buttonHref: "/contact",
        featured: true,
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.pricing",
      blockVersion: 1,
      props: {
        planName: "VIP Patron Pass",
        price: "$1,650",
        features:
          "Everything in the Full Summit Pass\nReserved front-row seating\nSmall-group dinner with the speaker faculty\nOne complimentary pass to next year's Summit",
        buttonLabel: "Choose VIP Pass",
        buttonHref: "/contact",
        featured: false,
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.comparison-table",
      blockVersion: 1,
      props: {
        heading: "Compare passes at a glance",
        headers: "Feature, Day Pass, Full Summit Pass, VIP Patron Pass",
        rows:
          "Days included|1|3|3\nEvening receptions|Not included|Both nights|Both nights + dinner\nSession recordings|Included|Included|Included\nFront-row seating|Not included|Not included|Included\nNext year's pass|Not included|Not included|Included",
        featuredColumn: "2",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.alert",
      blockVersion: 1,
      props: {
        message:
          "Groups of five or more save 20% per seat — email groups@aurumsummit.example before you buy tickets individually.",
        tone: "info",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.accordion",
      blockVersion: 1,
      props: { heading: "Ticket questions" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "What is included in the Full Summit Pass?",
              answer:
                "All three days of sessions and labs, both evening receptions, the printed resource guide, lifetime access to session recordings, and priority main-stage seating.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "Can I upgrade after I've registered?",
              answer:
                "Yes. Email tickets@aurumsummit.example with your confirmation number and we will send an invoice for the difference between your current pass and the one you want.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "Do you offer refunds?",
              answer:
                "Full refunds through July 1. After that, passes can be transferred to a colleague at no charge, but are no longer refundable.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "Is there a discount for students or nonprofits?",
              answer:
                "Yes — 50% off the Day Pass and Full Summit Pass for students and registered nonprofit staff. Write to tickets@aurumsummit.example with verification and we will send a discount code.",
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
        heading: "Passes are moving quickly this year",
        buttonLabel: "Get your pass",
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
      blockId: "openforge-cms.breadcrumbs",
      blockVersion: 1,
      props: { items: "Home|/\nContact" },
      slots: {},
    },
    {
      blockId: "openforge-cms.hero",
      blockVersion: 1,
      props: {
        heading: "Talk to the team producing the Summit",
        subheading:
          "Whether you are buying a pass, pitching a session, or bringing your brand to the showcase floor, tell us which and we will route it to the right person the same day.",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.location-card",
      blockVersion: 1,
      props: {
        name: "The Aurum Summit — Marigold Convention Center",
        address: "480 Harborlight Avenue\nSuite 200\nPortland, OR 97209",
        hours:
          "Registration desk: 7:00 AM-7:00 PM, all three days\nSummit office: Mon-Fri, 9am-6pm",
        phone: "+1 (503) 555-0142",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.columns",
      blockVersion: 1,
      props: { heading: "Who to write to" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.rich-text",
            blockVersion: 1,
            props: {
              content:
                "Sponsorship & partnerships\n\nWrite to partners@aurumsummit.example to bring your brand to the showcase floor or an evening reception.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.rich-text",
            blockVersion: 1,
            props: {
              content:
                "Speaking proposals\n\nSend a one-page outline to speakers@aurumsummit.example. We read every submission and reply within three weeks.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.rich-text",
            blockVersion: 1,
            props: {
              content:
                "Attendee support\n\nQuestions about your pass, hotel block, or accessibility needs go to tickets@aurumsummit.example.",
            },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.contact-form",
      blockVersion: 1,
      props: {
        heading: "Send us a message",
        body: "Tell us what you need and which team it belongs to — we will forward it and reply from there.",
        action: "#contact",
        submitLabel: "Send message",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.alert",
      blockVersion: 1,
      props: {
        message:
          "Our office runs Pacific time, Monday through Friday. Anything sent over a weekend is answered first thing the next business day.",
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
              question: "Where is the Summit held?",
              answer:
                "The Marigold Convention Center in Portland, Oregon. A discounted hotel block is confirmed by email after you register.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "Can I bring a colleague who hasn't registered yet?",
              answer:
                "Guests need their own pass to enter session rooms and receptions, but day-of registration is available at the front desk while seats last.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "How do I submit a session proposal?",
              answer:
                "Email a one-page outline to speakers@aurumsummit.example before the December 1 deadline. We reply to every submission within three weeks.",
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
        buttonLabel: "Get your pass",
        buttonHref: "/tickets",
      },
      slots: {},
    },
  ],
};

export const exampleSite = [home, schedule, speakers, tickets, contact];
