/**
 * A complete example site for the Construction theme, expressed as real
 * content trees (`{ blockId, blockVersion, props, slots }`) built from the
 * official CMS block set. Every block instance below supplies each of its
 * block's required editable fields, so the whole site parses, validates,
 * and renders without a single missing prop.
 *
 * The fictional business is "Ironclad Construction", a general contractor
 * and home-services company.
 */

/**
 * A tiny inline SVG placeholder, used wherever the example site needs a
 * real image URL (logos, avatars, project photos). Kept as a data URI so
 * the kit has no external asset dependencies.
 *
 * @param {number} width
 * @param {number} height
 * @param {string} fill Six-digit hex color, without the leading "#".
 */
const artwork = (width, height, fill) =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Crect width='${width}' height='${height}' fill='%23${fill}'/%3E%3C/svg%3E`;

const logoArt = (fill) => artwork(160, 60, fill);
const avatarArt = (fill) => artwork(96, 96, fill);
const projectArt = (fill) => artwork(640, 420, fill);

const home = {
  path: "/",
  title: "Ironclad Construction — built to outlast the estimate",
  blocks: [
    {
      blockId: "openforge-cms.banner",
      blockVersion: 1,
      props: {
        message:
          "Now scheduling fall roofing and exterior projects — free on-site estimates within 48 hours.",
        ctaLabel: "Get a free estimate",
        ctaHref: "/contact",
        tone: "brand",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.hero",
      blockVersion: 1,
      props: {
        heading: "A contractor that shows up when they say they will.",
        subheading:
          "Ironclad Construction has run roofing, remodeling, additions, and outdoor-living projects across the metro for eighteen years. Every job gets a licensed crew, a written schedule, and a single project manager who answers the phone.",
        ctaLabel: "Get a free estimate",
        ctaHref: "/contact",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.stats-row",
      blockVersion: 1,
      props: { heading: "Two decades of work you can walk on" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "18 yrs", label: "in business, same ownership" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "2,300+", label: "projects completed" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "4.9 / 5", label: "average customer rating" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "100%", label: "licensed, bonded, and insured" },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.feature-list",
      blockVersion: 1,
      props: {
        heading: "Why homeowners choose Ironclad",
        items:
          "One project manager from the first walkthrough to the final punch list, not a rotating cast of subs\nWritten fixed-price quotes with allowances spelled out, so there are no surprise change orders\nCrews are our own trained employees for framing, roofing, and carpentry — not day labor pulled off a lot\nEvery job carries a 5-year workmanship warranty on top of manufacturer material warranties\nDaily job-site photos posted to your project so you can see progress without driving by",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.icon-box",
      blockVersion: 1,
      props: {
        icon: "🏠",
        title: "Roofing & Exteriors",
        description:
          "Full tear-offs, architectural shingle and metal roofing, siding, gutters, and storm damage repair.",
        layout: "icon-left",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.icon-box",
      blockVersion: 1,
      props: {
        icon: "🍳",
        title: "Kitchen & Bath Remodeling",
        description:
          "Full gut remodels through cabinet-and-counter refreshes, with our own cabinetry and tile crews.",
        layout: "icon-left",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.icon-box",
      blockVersion: 1,
      props: {
        icon: "🧱",
        title: "Room Additions",
        description:
          "Second stories, in-law suites, and bump-outs — engineered, permitted, and tied into your existing structure.",
        layout: "icon-left",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.icon-box",
      blockVersion: 1,
      props: {
        icon: "🪵",
        title: "Decks & Outdoor Living",
        description:
          "Composite and cedar decks, covered porches, and outdoor kitchens built to hold up through winter.",
        layout: "icon-left",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.spotlight-card",
      blockVersion: 1,
      props: {
        icon: "🛡️",
        title: "Licensed, bonded, and insured",
        description:
          "General contractor license #GC-441209, $2M liability coverage, and a bond on file with the state — verify it yourself before you sign anything.",
        tone: "amber",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.spotlight-card",
      blockVersion: 1,
      props: {
        icon: "📅",
        title: "A schedule we put in writing",
        description:
          "Every contract ships with a week-by-week timeline. If we slip a milestone that isn't weather or a permit delay, we credit your final invoice.",
        tone: "cyan",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.spotlight-card",
      blockVersion: 1,
      props: {
        icon: "🔧",
        title: "A warranty that outlasts the invoice",
        description:
          "Five years of workmanship coverage on every trade we self-perform, tracked to your address so a future owner can still call it in.",
        tone: "rose",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.testimonial",
      blockVersion: 1,
      props: {
        quote:
          "We got three quotes for our roof after a hailstorm. Ironclad was the only one that put the schedule in writing and actually kept to it — three days, exactly as promised, and they left the yard cleaner than they found it.",
        author: "Renee Castellano",
        role: "Homeowner, Fairview Heights",
        avatar: avatarArt("d8dadc"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.testimonial",
      blockVersion: 1,
      props: {
        quote:
          "Our kitchen gut remodel took eight weeks, which is exactly what they told us at signing. The project manager sent photos every single day. Worth every dollar for the peace of mind alone.",
        author: "Marcus Boone",
        role: "Homeowner, Brookdale",
        avatar: avatarArt("f3d8c7"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.cta",
      blockVersion: 1,
      props: {
        heading: "Get a written, fixed-price quote this week",
        buttonLabel: "Get a free estimate",
        buttonHref: "/contact",
      },
      slots: {},
    },
  ],
};

const services = {
  path: "/services",
  title: "Services",
  blocks: [
    {
      blockId: "openforge-cms.hero",
      blockVersion: 1,
      props: {
        heading: "Every trade under one roof",
        subheading:
          "Roofing, remodeling, additions, and outdoor living, all run by our own crews and a single project manager — so the drywall guy and the roofer are never blaming each other for a delay.",
        ctaLabel: "Book a site visit",
        ctaHref: "/contact",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.heading",
      blockVersion: 1,
      props: { text: "What we build", level: "h2", align: "center" },
      slots: {},
    },
    {
      blockId: "openforge-cms.icon-box",
      blockVersion: 1,
      props: {
        icon: "🏠",
        title: "Roofing & Exteriors",
        description:
          "Architectural shingle, standing-seam metal, and flat roofing; siding, soffit, fascia, and seamless gutters. We handle the insurance-claim paperwork on storm-damage jobs directly with your adjuster.",
        layout: "icon-left",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.icon-box",
      blockVersion: 1,
      props: {
        icon: "🍳",
        title: "Kitchen & Bath Remodeling",
        description:
          "From a full gut-and-reconfigure to a cabinet, counter, and tile refresh. Our in-house cabinetry shop builds custom cabinets when a stock line does not fit your layout.",
        layout: "icon-left",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.icon-box",
      blockVersion: 1,
      props: {
        icon: "🧱",
        title: "Room Additions & Framing",
        description:
          "Second-story additions, in-law suites, garage conversions, and bump-outs, engineered to tie into your existing foundation and roofline rather than looking bolted on.",
        layout: "icon-left",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.icon-box",
      blockVersion: 1,
      props: {
        icon: "🪵",
        title: "Decks, Patios & Outdoor Living",
        description:
          "Composite and cedar decks, covered porches, paver patios, and outdoor kitchens, built on footings rated for your local frost line so nothing heaves in year two.",
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
      props: { heading: "How a project runs, start to finish" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "Week 0",
              title: "Free on-site estimate",
              description:
                "A project manager walks the site with you, takes measurements, and follows up with a written, itemized quote within three business days.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "Weeks 1-2",
              title: "Design, permitting, and materials",
              description:
                "We finalize selections, pull the required permits, and order materials so your crew never sits idle waiting on a delivery.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "Construction",
              title: "Build, with daily photo updates",
              description:
                "Your dedicated crew works to the written schedule. Daily job-site photos post to your project so you can track progress without a site visit.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "Close-out",
              title: "Final walkthrough and warranty",
              description:
                "We walk the finished project with you, close out any punch-list items on the spot, and register your five-year workmanship warranty to the address.",
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
        heading: "What's included, trade by trade",
        headers: "Trade, Included in every quote, Add-on options",
        rows: "Roofing|Tear-off, disposal, ice-and-water shield, 5-yr workmanship warranty|Standing-seam metal, skylight install\nKitchen & Bath|Demo, disposal, in-house cabinetry, tile setting|Custom cabinet builds, heated floors\nAdditions|Engineering review, permitting, foundation tie-in|Radiant heat, smart-home wiring\nDecks & Patios|Footings to local frost depth, code-compliant railing|Outdoor kitchen, pergola, lighting package",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.heading",
      blockVersion: 1,
      props: {
        text: "How you want the project managed",
        level: "h2",
        align: "center",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.pricing",
      blockVersion: 1,
      props: {
        planName: "Estimate Only",
        price: "Free",
        features:
          "On-site walkthrough and measurements\nWritten, itemized quote within 3 business days\nMaterial and labor breakdown\nNo obligation to book",
        buttonLabel: "Request an estimate",
        buttonHref: "/contact",
        featured: false,
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.pricing",
      blockVersion: 1,
      props: {
        planName: "Managed Project",
        price: "Fixed-price quote",
        features:
          "Dedicated project manager for the full job\nWeek-by-week written schedule\nDaily job-site photo updates\nStandard 5-year workmanship warranty\nOn-time milestone guarantee",
        buttonLabel: "Get a free estimate",
        buttonHref: "/contact",
        featured: true,
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.pricing",
      blockVersion: 1,
      props: {
        planName: "Design-Build Turnkey",
        price: "Custom",
        features:
          "In-house design and architectural drawings\nPermitting handled entirely by our office\nCabinetry, tile, and finish carpentry by our own shops\nExtended 7-year workmanship warranty\nSingle fixed price covering design through final walkthrough",
        buttonLabel: "Talk to a project manager",
        buttonHref: "/contact",
        featured: false,
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.accordion",
      blockVersion: 1,
      props: { heading: "Questions before you book a walkthrough" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "Do you subcontract the work out?",
              answer:
                "Framing, roofing, and general carpentry are done by our own employees. We bring in licensed subcontractors only for electrical, plumbing, and HVAC, all of whom we have worked with for years and who are named in your contract.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "How long does a typical remodel take?",
              answer:
                "A kitchen or bath remodel typically runs 4-8 weeks once materials arrive. A full room addition runs 10-16 weeks depending on permitting. Your written quote includes a specific timeline for your project, not a range.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "Will you work directly with my insurance adjuster?",
              answer:
                "Yes, on storm-damage roofing and siding claims. We meet your adjuster on-site, document the damage, and submit the supplement paperwork so you are not the one relaying numbers back and forth.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "What happens if you hit a delay?",
              answer:
                "Weather and permit-office delays happen and are disclosed up front. Any delay that is our own scheduling error triggers a credit against your final invoice, spelled out in the contract before you sign.",
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
        heading: "Tell us which trade is on your list first",
        buttonLabel: "Book a site visit",
        buttonHref: "/contact",
      },
      slots: {},
    },
  ],
};

const projects = {
  path: "/projects",
  title: "Projects",
  blocks: [
    {
      blockId: "openforge-cms.hero",
      blockVersion: 1,
      props: {
        heading: "Recent work from around the metro",
        subheading:
          "A sample of roofs, remodels, additions, and decks we have completed in the last two years — every photo below is a finished Ironclad project, not a stock rendering.",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.stats-row",
      blockVersion: 1,
      props: { heading: "The last twelve months, in numbers" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "412,000", label: "square feet renovated" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "186", label: "projects completed this year" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "0", label: "missed milestone credits paid" },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.image-gallery",
      blockVersion: 1,
      props: { heading: "Finished projects" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.gallery-item",
            blockVersion: 1,
            props: {
              image: projectArt("cfd3d6"),
              alt: "Architectural shingle roof replacement on a two-story colonial",
              caption: "Full roof tear-off and replacement — Fairview Heights",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.gallery-item",
            blockVersion: 1,
            props: {
              image: projectArt("e6dcd0"),
              alt: "Renovated kitchen with white shaker cabinets and quartz counters",
              caption: "Kitchen gut remodel — Brookdale",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.gallery-item",
            blockVersion: 1,
            props: {
              image: projectArt("d7ded9"),
              alt: "Second-story addition framed above an existing single-story ranch",
              caption: "Second-story addition — Hollow Creek",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.gallery-item",
            blockVersion: 1,
            props: {
              image: projectArt("ded4c4"),
              alt: "Composite deck with cable railing overlooking a backyard",
              caption: "Composite deck and cable railing — Millbrook",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.gallery-item",
            blockVersion: 1,
            props: {
              image: projectArt("d3d8db"),
              alt: "Primary bathroom remodel with a curbless tile shower",
              caption: "Primary bath remodel — Fairview Heights",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.gallery-item",
            blockVersion: 1,
            props: {
              image: projectArt("e2ded2"),
              alt: "Covered outdoor kitchen and patio with a stone fireplace",
              caption: "Outdoor kitchen and covered patio — Brookdale",
            },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.heading",
      blockVersion: 1,
      props: { text: "Featured project: Hollow Creek addition", level: "h2", align: "left" },
      slots: {},
    },
    {
      blockId: "openforge-cms.carousel",
      blockVersion: 1,
      props: { heading: "Before, during, and after" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.carousel-slide",
            blockVersion: 1,
            props: {
              image: projectArt("c7c2bb"),
              caption: "Before: single-story ranch with an undersized attic",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.carousel-slide",
            blockVersion: 1,
            props: {
              image: projectArt("bcc4c9"),
              caption: "During: second-story framing tied into the existing roofline",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.carousel-slide",
            blockVersion: 1,
            props: {
              image: projectArt("d7ded9"),
              caption: "After: two new bedrooms and a full bath added upstairs",
            },
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
          "Adding a full second story to a house you still have to live in sounds like a nightmare. Ironclad tented off the work zone, kept the existing roof watertight through two rainstorms, and we never lost power or water for a single day.",
        author: "The Okafor Family",
        role: "Homeowners, Hollow Creek",
        avatar: avatarArt("e6dcd0"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.cta",
      blockVersion: 1,
      props: {
        heading: "See what we could build on your lot",
        buttonLabel: "Get a free estimate",
        buttonHref: "/contact",
      },
      slots: {},
    },
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
        heading: "What it's like to work with Ironclad",
        subheading:
          "We ask every client to review their project once it closes out, good or bad. Here is a sample, unedited, from the last two years.",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.rating",
      blockVersion: 1,
      props: {
        value: "5",
        label: "4.9 out of 5 average, from 340 completed-project reviews",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.avatar-group",
      blockVersion: 1,
      props: { caption: "A few of the homeowners behind those reviews" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.avatar-item",
            blockVersion: 1,
            props: { image: avatarArt("d8dadc"), name: "Renee Castellano" },
            slots: {},
          },
          {
            blockId: "openforge-cms.avatar-item",
            blockVersion: 1,
            props: { image: avatarArt("f3d8c7"), name: "Marcus Boone" },
            slots: {},
          },
          {
            blockId: "openforge-cms.avatar-item",
            blockVersion: 1,
            props: { image: avatarArt("e6dcd0"), name: "The Okafor Family" },
            slots: {},
          },
          {
            blockId: "openforge-cms.avatar-item",
            blockVersion: 1,
            props: { image: avatarArt("cfd3d6"), name: "Denise Whitfield" },
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
          "We got three quotes for our roof after a hailstorm. Ironclad was the only one that put the schedule in writing and actually kept to it — three days, exactly as promised, and they left the yard cleaner than they found it.",
        author: "Renee Castellano",
        role: "Roof replacement, Fairview Heights",
        avatar: avatarArt("d8dadc"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.testimonial",
      blockVersion: 1,
      props: {
        quote:
          "Our kitchen gut remodel took eight weeks, which is exactly what they told us at signing. The project manager sent photos every single day. Worth every dollar for the peace of mind alone.",
        author: "Marcus Boone",
        role: "Kitchen remodel, Brookdale",
        avatar: avatarArt("f3d8c7"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.testimonial",
      blockVersion: 1,
      props: {
        quote:
          "Adding a full second story to a house you still have to live in sounds like a nightmare. Ironclad tented off the work zone and we never lost power or water for a single day of the build.",
        author: "The Okafor Family",
        role: "Second-story addition, Hollow Creek",
        avatar: avatarArt("e6dcd0"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.testimonial",
      blockVersion: 1,
      props: {
        quote:
          "I called four contractors about a sagging deck. Ironclad was the only one who told me the footings were the actual problem instead of just quoting new boards over the same bad frame. Two years later it still doesn't creak.",
        author: "Denise Whitfield",
        role: "Deck rebuild, Millbrook",
        avatar: avatarArt("cfd3d6"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.logo-cloud",
      blockVersion: 1,
      props: { heading: "Licensed, certified, and accountable" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("d7ded9"), name: "State Board of Contractors" },
            slots: {},
          },
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("e2ded2"), name: "Better Business Bureau A+" },
            slots: {},
          },
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("d3d8db"), name: "EPA Lead-Safe Certified" },
            slots: {},
          },
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("ded4c4"), name: "National Association of Home Builders" },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.cta",
      blockVersion: 1,
      props: {
        heading: "Add your project to this list",
        buttonLabel: "Get a free estimate",
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
        heading: "Talk to a project manager, not a call center",
        subheading:
          "Tell us what you are planning and we will schedule a free on-site walkthrough, usually within a week. Storm damage or an active leak gets a same-week visit.",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.columns",
      blockVersion: 1,
      props: { heading: "Where to reach us" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.rich-text",
            blockVersion: 1,
            props: {
              content:
                "New projects\n\nCall (555) 481-0192 or write to estimates@ironcladconstruction.example and a project manager will call back within one business day.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.rich-text",
            blockVersion: 1,
            props: {
              content:
                "Existing projects\n\nAlready working with us? Contact your assigned project manager directly, or reach the office at office@ironcladconstruction.example.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.rich-text",
            blockVersion: 1,
            props: {
              content:
                "Storm damage and emergencies\n\nActive leak or storm damage gets priority scheduling. Call (555) 481-0192 and say it's an emergency.",
            },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.location-card",
      blockVersion: 1,
      props: {
        name: "Ironclad Construction — Main Office",
        address: "4820 Foundry Road\nSuite 2\nMetro City, ST 55021",
        hours:
          "Mon-Fri: 7am-6pm\nSat: 8am-1pm (estimates only)\nSun: Closed (emergency line only)",
        phone: "+1 (555) 481-0192",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.contact-form",
      blockVersion: 1,
      props: {
        heading: "Request a free estimate",
        body: "Tell us about the project and the best time to walk the site. We reply to every request within one business day.",
        action: "#contact",
        submitLabel: "Request an estimate",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.alert",
      blockVersion: 1,
      props: {
        message:
          "Our office is staffed Monday through Saturday. Anything submitted outside those hours is answered first thing the next business day, or immediately if it's flagged as an emergency.",
        tone: "info",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.accordion",
      blockVersion: 1,
      props: { heading: "Before you request an estimate" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "Is the estimate really free?",
              answer:
                "Yes, for every project type we quote, including insurance-claim roofing inspections. There is no obligation to book after you receive it.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "Do you travel outside Metro City?",
              answer:
                "We regularly work within about 40 miles of Metro City. Tell us your address when you request an estimate and we will confirm whether you're in the service area.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "What should I have ready for the walkthrough?",
              answer:
                "Nothing required, but photos of the problem area, any prior inspection reports, and a rough sense of budget all help us give you a faster, more accurate quote.",
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
        buttonLabel: "Get a free estimate",
        buttonHref: "/contact",
      },
      slots: {},
    },
  ],
};

export const exampleSite = [home, services, projects, testimonials, contact];
