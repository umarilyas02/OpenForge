/**
 * A complete example site for the Fitness theme, expressed as real content
 * trees (`{ blockId, blockVersion, props, slots }`) built from the official
 * CMS block set. Every block instance below supplies each of its block's
 * required editable fields, so the whole site parses, validates, and
 * renders without a single missing prop.
 *
 * The fictional business is "Ironclad Fitness Club", a small-group strength
 * and conditioning gym.
 */

/**
 * A tiny inline SVG placeholder, used wherever the example site needs a
 * real image URL (logos, avatars, facility photos). Kept as a data URI so
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
  title: "Ironclad Fitness Club — small-group strength and conditioning",
  blocks: [
    {
      blockId: "openforge-cms.banner",
      blockVersion: 1,
      props: {
        message:
          "New six-week Strength Foundations cycle starts Monday — spots are capped at twelve per group.",
        ctaLabel: "See the schedule",
        ctaHref: "/classes",
        tone: "brand",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.hero",
      blockVersion: 1,
      props: {
        heading: "Train like the work actually matters.",
        subheading:
          "Ironclad is a small-group strength and conditioning gym: capped class sizes, coaches who watch every rep, and programming that changes as you get stronger instead of repeating the same circuit forever.",
        ctaLabel: "Book a free trial class",
        ctaHref: "/membership",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.stats-row",
      blockVersion: 1,
      props: { heading: "What members hit in their first 90 days" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "12", label: "max athletes per class" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "40 lbs", label: "average squat gain in 90 days" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "6", label: "class formats every week" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "94%", label: "of members still training at 6 months" },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.feature-list",
      blockVersion: 1,
      props: {
        heading: "Why athletes train at Ironclad",
        items:
          "Classes cap at twelve so a coach can actually see your bar path, not just count reps from across the room\nEvery cycle is programmed six weeks out, with your numbers logged so progress is measured, not guessed at\nStrength, conditioning, and mobility all live under one roof instead of three different memberships\nCoaches are present on the floor for every class, not running the front desk between sets\nNo class ever repeats back to back, so your joints and your motivation both stay fresh",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.spotlight-card",
      blockVersion: 1,
      props: {
        icon: "🏋️",
        title: "Small-group strength, not a crowded floor",
        description:
          "Twelve athletes, one coach, one whiteboard. You get correction on your setup before the bar ever loads heavy.",
        tone: "rose",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.spotlight-card",
      blockVersion: 1,
      props: {
        icon: "📋",
        title: "Programming that adapts to you",
        description:
          "Every lift you log feeds next week's loading. Two members in the same class can be on completely different numbers.",
        tone: "amber",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.spotlight-card",
      blockVersion: 1,
      props: {
        icon: "🩺",
        title: "Coaching that checks your form, not just your attendance",
        description:
          "Every coach is certified in strength and conditioning and spends the whole class on the floor, not behind a desk.",
        tone: "cyan",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.logo-cloud",
      blockVersion: 1,
      props: { heading: "Equipment and recovery partners we run on" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("2a2a2e"), name: "Ironline Racks" },
            slots: {},
          },
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("3a3a3f"), name: "Redline Barbell Co." },
            slots: {},
          },
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("2a2a2e"), name: "Fortis Flooring" },
            slots: {},
          },
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("3a3a3f"), name: "Recover Studio" },
            slots: {},
          },
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("2a2a2e"), name: "Pulse Nutrition" },
            slots: {},
          },
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("3a3a3f"), name: "Groundwork Physio" },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.testimonial",
      blockVersion: 1,
      props: {
        quote:
          "I had been going to a big-box gym for years and never touched a barbell because I was scared of doing it wrong. Six weeks at Ironclad and my coach had rebuilt my squat from the ground up. I actually look forward to leg day now.",
        author: "Renata Dubois",
        role: "Member since 2024",
        avatar: avatarArt("4a1620"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.testimonial",
      blockVersion: 1,
      props: {
        quote:
          "The class size is the whole thing. My old gym's classes had thirty people and a coach yelling generic cues. Here there are twelve of us and the coach knows my knee has been cranky since March.",
        author: "Devon Achebe",
        role: "Member since 2023",
        avatar: avatarArt("1e1e22"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.cta",
      blockVersion: 1,
      props: {
        heading: "Your first class is on us",
        buttonLabel: "Book a free trial class",
        buttonHref: "/membership",
      },
      slots: {},
    },
  ],
};

const classes = {
  path: "/classes",
  title: "Classes",
  blocks: [
    {
      blockId: "openforge-cms.hero",
      blockVersion: 1,
      props: {
        heading: "Six ways to get after it this week",
        subheading:
          "Every format is coached, capped at twelve, and programmed on a six-week cycle. Drop into any class as a member — nothing is gated behind a separate add-on.",
        ctaLabel: "See membership options",
        ctaHref: "/membership",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.heading",
      blockVersion: 1,
      props: { text: "Find your class", level: "h2", align: "center" },
      slots: {},
    },
    {
      blockId: "openforge-cms.icon-box",
      blockVersion: 1,
      props: {
        icon: "🔥",
        title: "HIIT Conditioning",
        description:
          "45 minutes of interval work on rowers, bikes, and sleds. Every round is scaled to your own pace, scored against your own last time.",
        layout: "icon-left",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.icon-box",
      blockVersion: 1,
      props: {
        icon: "🏋️",
        title: "Strength & Power",
        description:
          "Barbell-focused: squat, press, pull, and hinge on a six-week loading cycle. Coaches check setup on every working set.",
        layout: "icon-left",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.icon-box",
      blockVersion: 1,
      props: {
        icon: "🥊",
        title: "Boxing Fundamentals",
        description:
          "Bag work and pad rounds built around footwork and real technique, not just a cardio soundtrack with punches attached.",
        layout: "icon-left",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.icon-box",
      blockVersion: 1,
      props: {
        icon: "🧘",
        title: "Mobility & Recovery",
        description:
          "A slower 40 minutes of banded stretching, breathing work, and joint prep — the class your knees and shoulders keep asking for.",
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
      props: { heading: "Your first week at Ironclad" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "Day 1",
              title: "Free trial class",
              description:
                "Pick any class on the schedule. A coach pulls you aside for five minutes beforehand to check mobility and scale the movements to you.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "Day 2",
              title: "Movement assessment",
              description:
                "A 20-minute one-on-one to check your squat, hinge, and overhead position before you load anything heavy in group class.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "Week 1",
              title: "Your numbers go on the board",
              description:
                "Baseline lifts get logged so the next six weeks of programming are built around where you actually are, not a guess.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "Week 6",
              title: "Retest day",
              description:
                "Every cycle ends with a retest on the lifts that opened it, so progress is a number on a whiteboard, not a feeling.",
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
        heading: "This week's schedule",
        headers: "Class, Days, Time, Coach",
        rows: "Strength & Power|Mon / Wed / Fri|6:00 AM, 5:30 PM|Marcus Ndiaye\nHIIT Conditioning|Tue / Thu|6:00 AM, 6:00 PM|Sofia Reyes\nBoxing Fundamentals|Mon / Thu|7:00 PM|Jonah Pryce\nMobility & Recovery|Wed / Sat|9:00 AM|Priya Anand\nOpen Gym|Every day|11:00 AM - 1:00 PM|Self-guided",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.feature-list",
      blockVersion: 1,
      props: {
        heading: "Included with every membership",
        items:
          "Unlimited access to all six class formats, no per-class add-on fees\nA logged lift history so you can see your own numbers move over six-week cycles\nOpen gym hours for extra work between coached classes\nA free movement assessment before your first loaded class\nAccess to the members' app to reserve a spot and check the week's programming",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.cta",
      blockVersion: 1,
      props: {
        heading: "Drop in on any class, no strings attached",
        buttonLabel: "Book a free trial class",
        buttonHref: "/membership",
      },
      slots: {},
    },
  ],
};

const membership = {
  path: "/membership",
  title: "Membership",
  blocks: [
    {
      blockId: "openforge-cms.hero",
      blockVersion: 1,
      props: {
        heading: "Membership priced for people who actually show up",
        subheading:
          "One membership covers every class format. No per-class fees, no separate strength-coaching upsell hiding behind a paywall.",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.pricing",
      blockVersion: 1,
      props: {
        planName: "Drop-In",
        price: "$28 / class",
        features:
          "Any single class, any format\nNo commitment or contract\nGood for travelers and trial visits\nOpen gym access on the day of your class",
        buttonLabel: "Book a class",
        buttonHref: "/contact",
        featured: false,
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.pricing",
      blockVersion: 1,
      props: {
        planName: "All-Access",
        price: "$159 / month",
        features:
          "Unlimited classes across all six formats\nOpen gym hours every day\nFree movement assessment and lift-history tracking\nMembers' app for booking and programming\nNo long-term contract, cancel with 30 days' notice",
        buttonLabel: "Start your free trial class",
        buttonHref: "/contact",
        featured: true,
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.pricing",
      blockVersion: 1,
      props: {
        planName: "Elite Coaching",
        price: "$349 / month",
        features:
          "Everything in All-Access\nTwo private coaching sessions each month\nCustom programming layered on top of group class\nMonthly retest and video form review\nDirect messaging with your assigned coach",
        buttonLabel: "Talk to a coach",
        buttonHref: "/contact",
        featured: false,
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.comparison-table",
      blockVersion: 1,
      props: {
        heading: "Compare memberships",
        headers: "Feature, Drop-In, All-Access, Elite Coaching",
        rows:
          "Class access|Pay per class|Unlimited|Unlimited\nOpen gym hours|Day of class only|Every day|Every day\nLift-history tracking|Not included|Included|Included\nPrivate coaching sessions|Not included|Not included|2 per month\nContract|None|None|None",
        featuredColumn: "2",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.alert",
      blockVersion: 1,
      props: {
        message:
          "Active-duty military, first responders, and students get 15% off All-Access and Elite Coaching. Bring your ID to the front desk and we will apply it the same day.",
        tone: "info",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.accordion",
      blockVersion: 1,
      props: { heading: "Membership questions" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "I have never touched a barbell. Can I still join?",
              answer:
                "Yes — every new member gets a free movement assessment before their first loaded class, and coaches scale every lift to where you are on day one.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "Is there a joining fee?",
              answer:
                "No. Your first month is the price shown, and there is no separate enrollment or equipment fee on any plan.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "Can I freeze my membership?",
              answer:
                "All-Access and Elite Coaching members can freeze for up to two months a year for travel or injury, at no charge.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "Do classes ever sell out?",
              answer:
                "Classes cap at twelve to keep coaching quality high, so yes — popular evening slots do fill. The members' app shows live spots and lets you book up to a week ahead.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "What is the cancellation policy?",
              answer:
                "All-Access and Elite Coaching are month-to-month with 30 days' written notice. There is no long-term contract on any plan.",
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
        heading: "First class is free, no card required",
        buttonLabel: "Book your free class",
        buttonHref: "/contact",
      },
      slots: {},
    },
  ],
};

const coaches = {
  path: "/coaches",
  title: "Coaches",
  blocks: [
    {
      blockId: "openforge-cms.hero",
      blockVersion: 1,
      props: {
        heading: "Coached by people who still train",
        subheading:
          "Every coach at Ironclad programs their own lifts, competes or trains outside the gym, and is on the floor for the classes they run — never behind a desk.",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.rich-text",
      blockVersion: 1,
      props: {
        content:
          "We hire for two things: a real strength-and-conditioning certification, and the ability to explain a cue in one sentence instead of five. If a coach can't tell you why your knee caved on that last rep, they don't teach here yet.\n\nEvery coach carries a class roster of twelve or fewer so they can watch your bar path, not just your rep count. That is a deliberate ceiling, not a staffing accident — we would rather run one more class per week than let coaching quality slide.",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.stats-row",
      blockVersion: 1,
      props: { heading: "Our coaching staff" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "6", label: "certified coaches on staff" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "47", label: "combined years coaching" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "12", label: "max athletes per coach" },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.team-member",
      blockVersion: 1,
      props: {
        name: "Marcus Ndiaye",
        role: "Head Coach & Co-Owner",
        bio: "Former collegiate powerlifter turned strength coach. Writes every six-week programming cycle and still competes twice a year.",
        photo: avatarArt("4a1620"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.team-member",
      blockVersion: 1,
      props: {
        name: "Sofia Reyes",
        role: "Conditioning Coach",
        bio: "Runs HIIT Conditioning and Open Gym. Certified in strength and conditioning, and the person who scales every workout for bad knees and bad backs.",
        photo: avatarArt("1e1e22"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.team-member",
      blockVersion: 1,
      props: {
        name: "Jonah Pryce",
        role: "Boxing Coach",
        bio: "Ten years coaching amateur boxers before joining Ironclad. Teaches footwork and technique first, conditioning second.",
        photo: avatarArt("2a2a2e"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.team-member",
      blockVersion: 1,
      props: {
        name: "Priya Anand",
        role: "Mobility & Recovery Coach",
        bio: "Licensed physical therapist who leads Mobility & Recovery and reviews any member's nagging injury before it becomes a real one.",
        photo: avatarArt("3a3a3f"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.cta",
      blockVersion: 1,
      props: {
        heading: "Meet the team in person",
        buttonLabel: "Book a free trial class",
        buttonHref: "/membership",
      },
      slots: {},
    },
  ],
};

const about = {
  path: "/about",
  title: "About Ironclad",
  blocks: [
    {
      blockId: "openforge-cms.hero",
      blockVersion: 1,
      props: {
        heading: "We built the gym we couldn't find",
        subheading:
          "Ironclad started because our founder kept getting hurt in classes of thirty with one coach yelling cues from the front. Twelve athletes and one coach who is actually watching turned out to be the whole fix.",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.rich-text",
      blockVersion: 1,
      props: {
        content:
          "Most gyms sell you access to equipment. We sell you access to a coach who is watching your set, in a room small enough that they actually can. That single decision — capping every class at twelve — shapes almost everything else about how Ironclad runs.\n\nWe are not a franchise and we are not trying to become one. One location, six coaches, and a six-week programming cycle we rewrite every time based on what the last one actually did for our members' numbers.",
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
            props: { value: "2019", label: "the year we opened" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "8,200 sq ft", label: "of turf, racks, and mats" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "310", label: "active members" },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.timeline",
      blockVersion: 1,
      props: { heading: "How Ironclad got here" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "2019",
              title: "A garage and eight members",
              description:
                "Marcus started coaching a handful of former teammates out of his garage after one too many bad experiences in crowded commercial-gym classes.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "2020",
              title: "The first real space",
              description:
                "Moved into a 3,000 square foot unit with real racks and a whiteboard. Capped classes at twelve from day one — a rule that has never changed.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "2023",
              title: "Expanded to 8,200 square feet",
              description:
                "Added a full turf lane, a boxing bag rack, and a dedicated mobility room so Recovery classes stopped competing with barbell sets for floor space.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "2026",
              title: "Six-week cycles, every class",
              description:
                "Rebuilt our entire programming around retested six-week cycles, so every member can point at a number that moved instead of just a feeling.",
            },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.image-gallery",
      blockVersion: 1,
      props: { heading: "Inside the gym" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.gallery-item",
            blockVersion: 1,
            props: {
              image: coverArt("1e1e22"),
              alt: "The main turf and rack floor at Ironclad Fitness Club",
              caption: "The main floor: eight racks and a full turf lane",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.gallery-item",
            blockVersion: 1,
            props: {
              image: coverArt("2a2a2e"),
              alt: "A coach spotting an athlete on a barbell squat",
              caption: "A coach watching a working set up close",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.gallery-item",
            blockVersion: 1,
            props: {
              image: coverArt("3a3a3f"),
              alt: "The boxing bag rack and pad-work area",
              caption: "The boxing corner, used for Boxing Fundamentals",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.gallery-item",
            blockVersion: 1,
            props: {
              image: coverArt("4a1620"),
              alt: "The dedicated mobility and recovery room",
              caption: "The mobility room, added in the 2023 expansion",
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
        heading: "Come see the floor for yourself",
        buttonLabel: "Book a free trial class",
        buttonHref: "/membership",
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
        heading: "Come train. First class is free.",
        subheading:
          "Book a class on the schedule, or send us a message and a coach will get back to you the same day.",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.location-card",
      blockVersion: 1,
      props: {
        name: "Ironclad Fitness Club",
        address: "418 Foundry Street\nUnit 2\nMillbrook, OH 43119",
        hours:
          "Mon-Fri: 5:30am-9:00pm\nSat: 8:00am-2:00pm\nSun: Open gym only, 9:00am-12:00pm",
        phone: "+1 (614) 555-0148",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.contact-form",
      blockVersion: 1,
      props: {
        heading: "Ask us anything",
        body:
          "Questions about class formats, membership plans, or whether your knee will survive Boxing Fundamentals — send them here.",
        action: "#contact",
        submitLabel: "Send message",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.social-links",
      blockVersion: 1,
      props: { label: "Follow Ironclad Fitness Club" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.social-link-item",
            blockVersion: 1,
            props: {
              platform: "instagram",
              href: "https://instagram.com/ironcladfitnessclub",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.social-link-item",
            blockVersion: 1,
            props: {
              platform: "tiktok",
              href: "https://tiktok.com/@ironcladfitnessclub",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.social-link-item",
            blockVersion: 1,
            props: {
              platform: "youtube",
              href: "https://youtube.com/@ironcladfitnessclub",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.social-link-item",
            blockVersion: 1,
            props: {
              platform: "facebook",
              href: "https://facebook.com/ironcladfitnessclub",
            },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.alert",
      blockVersion: 1,
      props: {
        message:
          "Walk-ins are always welcome for your free trial class, but booking ahead in the members' app guarantees you a spot in capped classes.",
        tone: "info",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.accordion",
      blockVersion: 1,
      props: { heading: "Before you come in" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "What should I bring to my first class?",
              answer:
                "Closed-toe shoes, a water bottle, and comfortable clothes you can squat in. We provide chalk, bands, and everything else.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "Do I need to book ahead for the free trial?",
              answer:
                "It helps but isn't required. Booking through the members' app guarantees a spot since classes cap at twelve; walk-ins are seated if there is room.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "Is there parking on site?",
              answer:
                "Yes, free parking directly in front of the unit on Foundry Street, plus overflow parking one block over on Kiln Avenue.",
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
        buttonLabel: "Book a free trial class",
        buttonHref: "/membership",
      },
      slots: {},
    },
  ],
};

export const exampleSite = [home, classes, membership, coaches, about, contact];
