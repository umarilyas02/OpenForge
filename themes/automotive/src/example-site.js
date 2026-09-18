/**
 * A complete example site for the Automotive theme, expressed as real
 * content trees (`{ blockId, blockVersion, props, slots }`) built from the
 * official CMS block set. Every block instance below supplies each of its
 * block's required editable fields, so the whole site parses, validates,
 * and renders without a single missing prop.
 *
 * The fictional business is "Redline Auto Group", a car dealership and
 * full-service repair shop in Ironhaven, TX.
 *
 * Every page ends with a shared `openforge-cms.footer` instance, which is
 * why "openforge-cms.footer" is also listed in this theme's `page-body`
 * region (saas's page-body region does not allow it, since saas's example
 * site never places a footer block inside a page's own block list — see
 * this package's README for the full note on that deviation).
 */

/**
 * A tiny inline SVG placeholder, used wherever the example site needs a
 * real image URL (logos, avatars, vehicle photos). Kept as a data URI so
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

/** The site-wide footer, appended to the end of every page below. */
const footer = {
  blockId: "openforge-cms.footer",
  blockVersion: 1,
  props: {
    copyrightText:
      "© 2026 Redline Auto Group, 4820 Foundry Row, Ironhaven, TX. All rights reserved.",
  },
  slots: {
    links: [
      {
        blockId: "openforge-cms.rich-text",
        blockVersion: 1,
        props: {
          content:
            "Sales: (555) 271-8420 · Service: (555) 271-8433 · Licensed dealer #TX-88214",
        },
        slots: {},
      },
    ],
  },
};

const home = {
  path: "/",
  title: "Redline Auto Group — Ironhaven's dealership and repair shop",
  blocks: [
    {
      blockId: "openforge-cms.banner",
      blockVersion: 1,
      props: {
        message:
          "Fall Service Special: 20% off brake pads and rotors, now through October 31.",
        ctaLabel: "See service pricing",
        ctaHref: "/inventory",
        tone: "brand",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.hero",
      blockVersion: 1,
      props: {
        heading: "Straight answers. Honest wrenches. Cars that actually run.",
        subheading:
          "Redline Auto Group pairs a real inventory lot with a full-service repair shop, so the same team that sells you the car keeps it running for the next decade — no upsell script, just the actual diagnosis and a flat-rate quote before we touch a bolt.",
        ctaLabel: "Browse the lot",
        ctaHref: "/inventory",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.logo-cloud",
      blockVersion: 1,
      props: {
        heading: "Factory-trained and certified to service every make we sell",
      },
      slots: {
        items: [
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("1a1c20"), name: "Ford" },
            slots: {},
          },
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("b3141f"), name: "Toyota" },
            slots: {},
          },
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("1a1c20"), name: "Honda" },
            slots: {},
          },
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("b3141f"), name: "Chevrolet" },
            slots: {},
          },
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("1a1c20"), name: "Subaru" },
            slots: {},
          },
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("b3141f"), name: "BMW" },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.stats-row",
      blockVersion: 1,
      props: { heading: "Twenty-two years of turning wrenches in Ironhaven" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "22 yrs", label: "in business" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "14,000+", label: "vehicles serviced" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "6", label: "ASE-certified technicians" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "4.9 / 5", label: "average shop rating" },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.feature-list",
      blockVersion: 1,
      props: {
        heading: "Why drivers keep coming back",
        items:
          "Every used vehicle passes a 112-point inspection before it touches the lot\nFlat-rate labor pricing quoted before we touch a bolt, not after\nSame-day service on most brake, battery, and tire jobs\nLoaner cars available for repairs running past a single day\nFactory-trained technicians on both domestic and import drivetrains",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.spotlight-card",
      blockVersion: 1,
      props: {
        icon: "🚗",
        title: "Buy with a real inspection report",
        description:
          "Every vehicle on the lot comes with its 112-point inspection sheet attached — not a sales pitch, the actual findings, including what we already fixed before it was listed.",
        tone: "rose",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.spotlight-card",
      blockVersion: 1,
      props: {
        icon: "🔧",
        title: "One quote, no surprise labor",
        description:
          "We diagnose first and quote flat-rate labor before any work starts. If we find something else while we're in there, you approve it before we touch it — every time.",
        tone: "amber",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.spotlight-card",
      blockVersion: 1,
      props: {
        icon: "🛠️",
        title: "The shop that sold it keeps it running",
        description:
          "Buy from us and your first two oil changes are on the house. Our service bay is fifty feet from the sales floor, not a call center in another state.",
        tone: "cyan",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.testimonial",
      blockVersion: 1,
      props: {
        quote:
          "I've bought two trucks from Redline and had a dozen services done between them. Nobody has ever tried to sell me a repair I didn't need, and that's rarer than it should be in this business.",
        author: "Hector Villareal",
        role: "Ironhaven contractor, repeat customer",
        avatar: avatarArt("d9dadd"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.testimonial",
      blockVersion: 1,
      props: {
        quote:
          "My transmission started slipping on a Friday and they had a loaner waiting when I dropped the car off. Fixed by Monday afternoon, at the price they quoted on the phone.",
        author: "Marisol Chen",
        role: "Local nurse, repair customer since 2022",
        avatar: avatarArt("c9cbce"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.cta",
      blockVersion: 1,
      props: {
        heading: "See the inspection reports on this week's inventory",
        buttonLabel: "Browse the lot",
        buttonHref: "/inventory",
      },
      slots: {},
    },
    footer,
  ],
};

const inventory = {
  path: "/inventory",
  title: "Inventory & Services",
  blocks: [
    {
      blockId: "openforge-cms.hero",
      blockVersion: 1,
      props: {
        heading: "This week's lot, and every service we run on it",
        subheading:
          "Every used vehicle below already has its 112-point inspection on file. Every service line below has the same flat-rate labor price whether it's your car or one we just sold you.",
        ctaLabel: "Book a service slot",
        ctaHref: "/contact",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.heading",
      blockVersion: 1,
      props: {
        text: "Current inventory",
        level: "h2",
        align: "left",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.data-table",
      blockVersion: 1,
      props: {
        heading: "On the lot this week",
        headers: "Year, Make & Model, Mileage, Price",
        rows:
          "2022|Toyota Camry SE|28,400 mi|$21,990\n2021|Ford F-150 XLT|41,200 mi|$32,450\n2023|Honda CR-V EX|16,800 mi|$27,900\n2020|Chevrolet Equinox LT|52,100 mi|$18,750\n2022|Subaru Outback Premium|31,600 mi|$24,300\n2019|BMW 3 Series 330i|58,900 mi|$19,980",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.feature-list",
      blockVersion: 1,
      props: {
        heading: "Every vehicle we sell includes",
        items:
          "The full 112-point inspection report, findings and all\nA 3-month / 4,500-mile powertrain warranty at no extra cost\nA clean title and history report, printed at the desk\nTwo free oil changes in your first year of ownership\nFinancing quotes from four lenders before you sign anything",
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
      blockId: "openforge-cms.heading",
      blockVersion: 1,
      props: {
        text: "Repair & maintenance services",
        level: "h2",
        align: "left",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.icon-box",
      blockVersion: 1,
      props: {
        icon: "🛢️",
        title: "Oil & fluid service",
        description:
          "Conventional, synthetic blend, or full synthetic, plus a 21-point courtesy check on every visit. Most cars are in and out in under 45 minutes.",
        layout: "icon-left",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.icon-box",
      blockVersion: 1,
      props: {
        icon: "🛑",
        title: "Brakes & rotors",
        description:
          "Pads, rotors, and calipers on every make we sell and most we don't. Free brake inspection with any other service booked the same day.",
        layout: "icon-left",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.icon-box",
      blockVersion: 1,
      props: {
        icon: "🛞",
        title: "Tires & alignment",
        description:
          "Mounted, balanced, and aligned on our own rack — we don't sub this out. Price-match any written quote from a competing Ironhaven shop.",
        layout: "icon-left",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.icon-box",
      blockVersion: 1,
      props: {
        icon: "💻",
        title: "Check-engine & diagnostics",
        description:
          "Dealer-grade scan tools read the actual fault code, not a guess. You get the printout and the plain-language explanation before you approve anything.",
        layout: "icon-left",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.pricing",
      blockVersion: 1,
      props: {
        planName: "Basic Maintenance",
        price: "$89 flat rate",
        features:
          "Oil & filter change\n21-point courtesy inspection\nTire pressure & tread check\nFluid top-off",
        buttonLabel: "Book this service",
        buttonHref: "/contact",
        featured: false,
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.pricing",
      blockVersion: 1,
      props: {
        planName: "Standard Service",
        price: "$249 flat rate",
        features:
          "Everything in Basic Maintenance\nBrake pad inspection with wear measurement\nBattery & charging system test\nAlignment check\nCabin & engine air filter replacement",
        buttonLabel: "Book this service",
        buttonHref: "/contact",
        featured: true,
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.pricing",
      blockVersion: 1,
      props: {
        planName: "Premium Care",
        price: "$449 flat rate",
        features:
          "Everything in Standard Service\nFull diagnostic scan with printed report\nBrake pad and rotor replacement, parts included\nTransmission & coolant fluid exchange\nLoaner car for the day",
        buttonLabel: "Book this service",
        buttonHref: "/contact",
        featured: false,
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.timeline",
      blockVersion: 1,
      props: { heading: "What happens when you drop your car off" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "Step 1",
              title: "Drop-off & write-up",
              description:
                "A service advisor walks the car with you, notes what you're hearing or feeling, and opens a work order with your phone number attached.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "Step 2",
              title: "Diagnosis",
              description:
                "A technician scopes the actual problem before anything is quoted — no flat-rate guess based on the symptom alone.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "Step 3",
              title: "Quote & approval",
              description:
                "You get a call with the flat-rate price for parts and labor. Nothing is repaired until you say yes, by phone or text.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "Step 4",
              title: "Repair & quality check",
              description:
                "A second technician road-tests the car before it leaves the bay, so the fix is checked by someone other than the person who made it.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "Step 5",
              title: "Pickup",
              description:
                "We walk you through what was done, hand over the old parts if you want them, and text you when the next service is due.",
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
        heading: "Book a bay before the fall rush fills the schedule",
        buttonLabel: "Book a service slot",
        buttonHref: "/contact",
      },
      slots: {},
    },
    footer,
  ],
};

const about = {
  path: "/about",
  title: "About Redline Auto Group",
  blocks: [
    {
      blockId: "openforge-cms.hero",
      blockVersion: 1,
      props: {
        heading: "A dealership that got tired of the dealership playbook",
        subheading:
          "Redline Auto Group opened in 2004 as a two-bay repair shop. We started selling cars because our own service customers kept asking us to find them one — and we saw no reason to sell a car we wouldn't want to service ourselves.",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.rich-text",
      blockVersion: 1,
      props: {
        content:
          "Most dealerships and most repair shops are built around the same incentive: move you through fast, whether that means a sale or a service ticket. We built Redline around the opposite bet — that a customer who trusts the inspection report and the labor quote comes back for the next ten years instead of shopping around every time.\n\nThat's why the sales floor and the service bay sit fifty feet apart under one roof. The same technicians who service the cars we sell also do the 112-point inspection before a vehicle ever gets listed, so nobody on our lot is guessing what's wrong with it.\n\nWe're still family-owned, still in the same Foundry Row building we started in, and still small enough that the owner answers the shop phone most Saturdays.",
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
            props: { value: "22", label: "years on Foundry Row" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "9", label: "service bays" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "14,000+", label: "vehicles serviced" },
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
              date: "2004",
              title: "Two bays on Foundry Row",
              description:
                "Founder Rosa Delgado opens a two-bay repair shop after eleven years turning wrenches for a national chain she'd grown tired of.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "2011",
              title: "First cars on the lot",
              description:
                "Customers kept asking Rosa to find them a reliable used car. The first six vehicles sold were trade-ins from her own service customers.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "2018",
              title: "Nine bays, six technicians",
              description:
                "The shop expands into the neighboring unit and adds a dedicated tire and alignment bay with its own rack.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "2026",
              title: "The 112-point inspection goes on every listing",
              description:
                "What started as an internal checklist becomes a printed report attached to every vehicle we sell, findings included.",
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
        text: "The people who'll actually work on your car",
        level: "h2",
        align: "left",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.team-member",
      blockVersion: 1,
      props: {
        name: "Rosa Delgado",
        role: "Founder & Master Technician",
        bio: "Started turning wrenches at seventeen and has held an ASE Master Technician certification for over two decades. Still does the road test on every transmission job herself.",
        photo: avatarArt("d9dadd"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.team-member",
      blockVersion: 1,
      props: {
        name: "Devon Okafor",
        role: "Service Manager",
        bio: "Runs the front desk and writes every quote personally, so the price you hear on the phone is the price on the invoice.",
        photo: avatarArt("c9cbce"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.team-member",
      blockVersion: 1,
      props: {
        name: "Luis Fernandez",
        role: "Sales & Inspections Lead",
        bio: "Performs the 112-point inspection on every vehicle before it's listed and can tell you exactly what's on the report, not just that it passed.",
        photo: avatarArt("b3141f"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.cta",
      blockVersion: 1,
      props: {
        heading: "We're hiring ASE-certified technicians",
        buttonLabel: "Get in touch",
        buttonHref: "/contact",
      },
      slots: {},
    },
    footer,
  ],
};

const testimonials = {
  path: "/testimonials",
  title: "Testimonials",
  blocks: [
    {
      blockId: "openforge-cms.hero",
      blockVersion: 1,
      props: {
        heading: "What Ironhaven says after the wrench comes off",
        subheading:
          "We don't cherry-pick. Every review below is from a real sales or service customer, and every rating is the number they actually gave us.",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.rating",
      blockVersion: 1,
      props: { value: "5", label: "4.9 out of 5 across 1,240 reviews" },
      slots: {},
    },
    {
      blockId: "openforge-cms.testimonial",
      blockVersion: 1,
      props: {
        quote:
          "I've bought two trucks from Redline and had a dozen services done between them. Nobody has ever tried to sell me a repair I didn't need, and that's rarer than it should be in this business.",
        author: "Hector Villareal",
        role: "Ironhaven contractor, repeat customer",
        avatar: avatarArt("d9dadd"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.testimonial",
      blockVersion: 1,
      props: {
        quote:
          "My transmission started slipping on a Friday and they had a loaner waiting when I dropped the car off. Fixed by Monday afternoon, at the price they quoted on the phone.",
        author: "Marisol Chen",
        role: "Local nurse, repair customer since 2022",
        avatar: avatarArt("c9cbce"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.testimonial",
      blockVersion: 1,
      props: {
        quote:
          "I brought my own written quote from another shop and Redline matched it on tires, then found a wheel bearing the other place missed entirely. That inspection report is not a gimmick.",
        author: "Grant Oduya",
        role: "Bought a Subaru Outback, 2023",
        avatar: avatarArt("b3141f"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.testimonial",
      blockVersion: 1,
      props: {
        quote:
          "As a single mom I've been talked down to at every other shop in town. Devon explained the brake job in plain language, showed me the worn pads, and the bill matched the quote exactly.",
        author: "Priya Nataraj",
        role: "Service customer since 2021",
        avatar: avatarArt("1a1c20"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.accordion",
      blockVersion: 1,
      props: { heading: "Questions people ask before they buy or book" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "Is the 112-point inspection report really included?",
              answer:
                "Yes, printed and handed to you at the desk for every used vehicle we sell — findings and all, including anything we already repaired before listing it.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "Do you work on cars you didn't sell?",
              answer:
                "Most of our service bay traffic is exactly that. Bring any make or model and our technicians will diagnose it the same way, on the same flat-rate labor board.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "What does the powertrain warranty actually cover?",
              answer:
                "Engine, transmission, and drivetrain for 3 months or 4,500 miles, whichever comes first, on every used vehicle we sell, at no extra cost and no paperwork to file.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "Can I get a loaner car for a longer repair?",
              answer:
                "Yes, for any job we expect to run past a single day. Ask your service advisor when you drop off and we'll have one ready if it's available.",
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
        heading: "Come see why they keep coming back",
        buttonLabel: "Browse the lot",
        buttonHref: "/inventory",
      },
      slots: {},
    },
    footer,
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
        heading: "Talk to the shop, not a call center",
        subheading:
          "Call, write, or stop by Foundry Row. A service advisor or sales associate answers the phone here — not a national booking line.",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.location-card",
      blockVersion: 1,
      props: {
        name: "Redline Auto Group",
        address: "4820 Foundry Row\nIronhaven, TX 75201",
        hours:
          "Mon-Fri: 7:30am-6:30pm\nSat: 8:00am-4:00pm\nSun: Closed (sales lot open by appointment)",
        phone: "+1 (555) 271-8420",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.contact-form",
      blockVersion: 1,
      props: {
        heading: "Send us a message",
        body: "Tell us whether you're asking about a vehicle on the lot or booking a service slot, and we'll route it to the right desk.",
        action: "mailto:contact@redlineauto.example",
        submitLabel: "Send message",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.alert",
      blockVersion: 1,
      props: {
        message:
          "The service bay phone line closes twenty minutes before the shop does, so a same-day repair request called in near closing gets a first-thing-tomorrow slot instead.",
        tone: "info",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.social-links",
      blockVersion: 1,
      props: { label: "Follow Redline Auto Group" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.social-link-item",
            blockVersion: 1,
            props: {
              platform: "instagram",
              href: "https://instagram.com/redlineauto.example",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.social-link-item",
            blockVersion: 1,
            props: {
              platform: "facebook",
              href: "https://facebook.com/redlineauto.example",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.social-link-item",
            blockVersion: 1,
            props: {
              platform: "youtube",
              href: "https://youtube.com/@redlineauto.example",
            },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.accordion",
      blockVersion: 1,
      props: { heading: "Before you call" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "Do I need an appointment for an oil change?",
              answer:
                "Walk-ins are welcome for Basic Maintenance, though an appointment guarantees a bay. Standard and Premium services should be booked ahead.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "Can I test-drive a vehicle without an appointment?",
              answer:
                "Yes, during lot hours. For a specific vehicle on a Sunday, call ahead and Luis can meet you by appointment.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "Do you offer financing on used vehicles?",
              answer:
                "Yes. We pull quotes from four lenders at the desk and show you every offer side by side before you choose one.",
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
        buttonLabel: "Book a service slot",
        buttonHref: "/inventory",
      },
      slots: {},
    },
    footer,
  ],
};

export const exampleSite = [home, inventory, about, testimonials, contact];
