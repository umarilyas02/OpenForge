/**
 * A complete example marketing site for the Legal theme, expressed as real
 * content trees (`{ blockId, blockVersion, props, slots }`) built from the
 * official CMS block set. Every block instance below supplies each of its
 * block's required editable fields, so the whole site parses, validates,
 * and renders without a single missing prop.
 *
 * The fictional firm is "Meridian & Cole LLP", a full-service law firm.
 * Every recognition name, statistic, and testimonial below is invented
 * sample content for demonstration purposes, not a real award, ranking
 * body, or verified case result.
 */

/**
 * A tiny inline SVG placeholder, used wherever the example site needs a
 * real image URL (logos, headshots, office photography). Kept as a data
 * URI so the kit has no external asset dependencies.
 *
 * @param {number} width
 * @param {number} height
 * @param {string} fill Six-digit hex color, without the leading "#".
 */
const artwork = (width, height, fill) =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Crect width='${width}' height='${height}' fill='%23${fill}'/%3E%3C/svg%3E`;

const logoArt = (fill) => artwork(160, 48, fill);
const avatarArt = (fill) => artwork(96, 96, fill);

/**
 * The footer block, embedded at the end of every page so the site's legal
 * notices and quick links appear consistently across the whole example
 * site, the same way a real firm site's global footer would.
 */
const siteFooter = {
  blockId: "openforge-cms.footer",
  blockVersion: 1,
  props: {
    copyrightText:
      "© 2026 Meridian & Cole LLP. All rights reserved. Attorney advertising. Prior results do not guarantee a similar outcome.",
  },
  slots: {
    links: [
      {
        blockId: "openforge-cms.rich-text",
        blockVersion: 1,
        props: { content: "Privacy Policy" },
        slots: {},
      },
      {
        blockId: "openforge-cms.rich-text",
        blockVersion: 1,
        props: { content: "Terms of Use" },
        slots: {},
      },
      {
        blockId: "openforge-cms.rich-text",
        blockVersion: 1,
        props: { content: "Attorney Advertising Notice" },
        slots: {},
      },
    ],
  },
};

const home = {
  path: "/",
  title: "Meridian & Cole LLP — Counsel you can build a case on",
  blocks: [
    {
      blockId: "openforge-cms.banner",
      blockVersion: 1,
      props: {
        message:
          "Meridian & Cole secures a $45M jury verdict in a product liability trial — read the case summary.",
        ctaLabel: "Read the case summary",
        ctaHref: "/results",
        tone: "brand",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.hero",
      blockVersion: 1,
      props: {
        heading: "Counsel you can build a case on.",
        subheading:
          "Meridian & Cole LLP represents individuals and businesses in litigation, corporate matters, real estate, estate planning, and employment disputes throughout the region. Thirty years in, our first conversation is still a real conversation — not a sales pitch.",
        ctaLabel: "Schedule a Consultation",
        ctaHref: "/contact",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.logo-cloud",
      blockVersion: 1,
      props: {
        heading: "Recognized by",
      },
      slots: {
        items: [
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("d6dde8"), name: "The Jurist Register" },
            slots: {},
          },
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: {
              image: logoArt("e3d9c2"),
              name: "Statewide Counsel Review",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("d6dde8"), name: "National Trial Advocates" },
            slots: {},
          },
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("e3d9c2"), name: "Continental Bar Digest" },
            slots: {},
          },
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: {
              image: logoArt("d6dde8"),
              name: "Appellate Review Quarterly",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("e3d9c2"), name: "The Chancery Report" },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.stats-row",
      blockVersion: 1,
      props: { heading: "Thirty years of representation, in numbers" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "$180M+", label: "recovered for clients since 1994" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "1,200+", label: "matters resolved" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "22", label: "attorneys and counsel" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "98%", label: "of clients would refer us" },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.feature-list",
      blockVersion: 1,
      props: {
        heading: "Why clients choose Meridian & Cole",
        items:
          "Every matter is led by a partner, not handed off to whoever is available that week\nA single point of contact who returns calls within one business day, without exception\nFlat-fee estimates wherever the matter allows, so a bill never arrives as a surprise\nTrial-ready preparation on every case, even the ones we expect to settle\nPlain-language updates — no unexplained Latin, no thirty-page memos when three paragraphs will do",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.spotlight-card",
      blockVersion: 1,
      props: {
        icon: "⚖️",
        title: "Litigation & Dispute Resolution",
        description:
          "From pre-suit negotiation to jury verdict, we prepare every case as if it will be tried — because the firms that do get better settlements from the ones that don't.",
        tone: "amber",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.spotlight-card",
      blockVersion: 1,
      props: {
        icon: "🏢",
        title: "Corporate & Business Law",
        description:
          "Formation, governance, contracts, and the disputes that arise between them. We represent businesses the way we would want to be represented if it were our company.",
        tone: "cyan",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.spotlight-card",
      blockVersion: 1,
      props: {
        icon: "📜",
        title: "Estate Planning & Probate",
        description:
          "Wills, trusts, and probate administration handled with the care of a family matter, because for the families we work with, that is exactly what it is.",
        tone: "violet",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.testimonial",
      blockVersion: 1,
      props: {
        quote:
          "They took a contract dispute that had dragged on for a year and resolved it in four months, without a single surprise invoice. I never once felt like a file number.",
        author: "Renata Ibarra",
        role: "Owner, Ibarra & Sons Millwork",
        avatar: avatarArt("d6dde8"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.testimonial",
      blockVersion: 1,
      props: {
        quote:
          "My father's estate was more complicated than anyone expected. The team at Meridian & Cole walked my family through probate step by step and never made us feel rushed.",
        author: "Desmond Okafor",
        role: "Estate client",
        avatar: avatarArt("e3d9c2"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.cta",
      blockVersion: 1,
      props: {
        heading: "Ready to discuss your matter?",
        buttonLabel: "Schedule a Consultation",
        buttonHref: "/contact",
      },
      slots: {},
    },
    siteFooter,
  ],
};

const about = {
  path: "/about",
  title: "About Meridian & Cole",
  blocks: [
    {
      blockId: "openforge-cms.hero",
      blockVersion: 1,
      props: {
        heading: "Founded on the belief that good counsel listens first",
        subheading:
          "Meridian & Cole LLP was founded in 1994 by two attorneys who believed clients deserved a lawyer who returned their calls. Three decades later, that is still the standard every attorney here is held to.",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.rich-text",
      blockVersion: 1,
      props: {
        content:
          "We are a full-service firm, but we are not a large one by design. Every client matter is led by a partner who knows the file personally, supported by associates and paralegals who are never spread across more cases than they can actually manage.\n\nThat structure costs us some scale. We think it buys our clients something more valuable: a lawyer who can tell you, from memory, exactly where your matter stands and what happens next.\n\nToday the firm has three offices across the region, twenty-two attorneys and counsel, and six practice groups — but the same rule that founded the firm still governs how we take on new matters: if we would not recommend the engagement to a friend, we do not recommend it to a client.",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.stats-row",
      blockVersion: 1,
      props: { heading: "The firm today" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "1994", label: "year founded" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "3", label: "offices across the region" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "6", label: "practice groups" },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.timeline",
      blockVersion: 1,
      props: { heading: "Our history" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "1994",
              title: "The firm opens its doors",
              description:
                "Founding partners Eleanor Meridian and Walter Cole open a two-attorney practice focused on commercial litigation and small-business counsel.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "2003",
              title: "Estate planning and family law added",
              description:
                "Growing client demand leads the firm to add dedicated estate planning, probate, and family law practices alongside its litigation and corporate work.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "2015",
              title: "Second and third offices open",
              description:
                "The firm opens satellite offices to serve clients closer to home, without ever centralizing case teams away from the partners who lead them.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "2024",
              title: "$45M jury verdict",
              description:
                "The litigation group secures the largest single verdict in firm history in a product liability trial, after the other side declined a lower settlement.",
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
        text: "Meet the partners",
        level: "h2",
        align: "left",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.team-member",
      blockVersion: 1,
      props: {
        name: "Eleanor Meridian",
        role: "Founding Partner, Litigation",
        bio: "Thirty years trying commercial and product liability cases to verdict. Admitted to the state and federal bars, and to the bar of the Court of Appeals.",
        photo: avatarArt("d6dde8"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.team-member",
      blockVersion: 1,
      props: {
        name: "Walter Cole",
        role: "Founding Partner, Corporate & Business Law",
        bio: "Advises business owners on formation, governance, and succession. Serves on the board of two regional trade associations.",
        photo: avatarArt("e3d9c2"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.team-member",
      blockVersion: 1,
      props: {
        name: "Priya Nakamura",
        role: "Partner, Estate Planning & Probate",
        bio: "Guides families through wills, trusts, and probate administration. Named to the firm's partnership in 2018 after nine years practicing here.",
        photo: avatarArt("f0e6d2"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.team-member",
      blockVersion: 1,
      props: {
        name: "Marcus Whitfield",
        role: "Partner, Employment Law",
        bio: "Represents employers and employees in disputes and policy counsel alike, a balance he credits with making him a better negotiator on both sides.",
        photo: avatarArt("d9e3d6"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.cta",
      blockVersion: 1,
      props: {
        heading: "Speak with a partner about your matter",
        buttonLabel: "Schedule a Consultation",
        buttonHref: "/contact",
      },
      slots: {},
    },
    siteFooter,
  ],
};

const practiceAreas = {
  path: "/practice-areas",
  title: "Practice Areas",
  blocks: [
    {
      blockId: "openforge-cms.hero",
      blockVersion: 1,
      props: {
        heading: "Six practice groups, one standard of preparation",
        subheading:
          "Whichever group handles your matter, the same partner-led approach applies: a lawyer who knows your file, prepares as if it could go to trial, and tells you plainly what to expect.",
        ctaLabel: "Schedule a Consultation",
        ctaHref: "/contact",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.heading",
      blockVersion: 1,
      props: {
        text: "Where we practice",
        level: "h2",
        align: "center",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.icon-box",
      blockVersion: 1,
      props: {
        icon: "⚖️",
        title: "Litigation & Dispute Resolution",
        description:
          "Commercial disputes, product liability, contract breaches, and appeals. We prepare every matter for trial from day one, whether or not it ever reaches a courtroom.",
        layout: "icon-left",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.icon-box",
      blockVersion: 1,
      props: {
        icon: "🏢",
        title: "Corporate & Business Law",
        description:
          "Entity formation, governance, contracts, mergers and acquisitions, and business succession planning for owners at every stage of growth.",
        layout: "icon-left",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.icon-box",
      blockVersion: 1,
      props: {
        icon: "🏠",
        title: "Real Estate & Property Law",
        description:
          "Residential and commercial transactions, title disputes, easements, and landlord-tenant matters, handled from contract through closing.",
        layout: "icon-left",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.icon-box",
      blockVersion: 1,
      props: {
        icon: "📜",
        title: "Estate Planning & Probate",
        description:
          "Wills, revocable and irrevocable trusts, powers of attorney, and probate administration, with an emphasis on plans families actually understand.",
        layout: "icon-left",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.icon-box",
      blockVersion: 1,
      props: {
        icon: "👨‍👩‍👧",
        title: "Family Law",
        description:
          "Divorce, custody, and support matters approached with a steady hand — protecting a client's interests without turning every disagreement into a battle.",
        layout: "icon-left",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.icon-box",
      blockVersion: 1,
      props: {
        icon: "🤝",
        title: "Employment Law",
        description:
          "Wrongful termination, discrimination, wage disputes, and workplace policy counsel for both employers and employees.",
        layout: "icon-left",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.divider",
      blockVersion: 1,
      // The divider's own "style" field collides with the renderer's
      // universal style-override prop, so this instance leaves it unset
      // and takes the component's built-in solid default.
      props: {},
      slots: {},
    },
    {
      blockId: "openforge-cms.data-table",
      blockVersion: 1,
      props: {
        heading: "What each group typically handles",
        headers: "Practice group, Typical matters, How we typically resolve them",
        rows: "Litigation|Contract breaches, product liability, commercial disputes|Negotiated settlement, mediation, or trial\nCorporate|Formation, governance, contracts, M&A|Drafting and counsel, rarely adversarial\nReal estate|Purchase and sale, title disputes, leases|Closing counsel or negotiated resolution\nEstate planning|Wills, trusts, powers of attorney|Drafting, periodic review, probate if needed\nFamily law|Divorce, custody, support|Negotiated agreement or contested hearing\nEmployment|Termination, discrimination, wage disputes|Demand and negotiation, agency filing, or suit",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.feature-list",
      blockVersion: 1,
      props: {
        heading: "Every engagement includes",
        items:
          "A written fee agreement before any work begins, so there is never a question about scope or cost\nDirect access to the partner leading your matter, not a rotating cast of associates\nRegular status updates in plain language, on a schedule we agree to up front\nAn honest early assessment of your matter's strengths and risks, even when it is not what you hoped to hear\nCoordination with your accountant, financial advisor, or other counsel when a matter calls for it",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.cta",
      blockVersion: 1,
      props: {
        heading: "Not sure which group handles your matter?",
        buttonLabel: "Schedule a Consultation",
        buttonHref: "/contact",
      },
      slots: {},
    },
    siteFooter,
  ],
};

const results = {
  path: "/results",
  title: "Results",
  blocks: [
    {
      blockId: "openforge-cms.hero",
      blockVersion: 1,
      props: {
        heading: "What our clients say, and what we have won for them",
        subheading:
          "Every matter is different, and the outcome of any past case is never a promise about your own. Within that limit, here is a fair account of what clients have told us and what our litigation team has achieved at trial.",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.stats-row",
      blockVersion: 1,
      props: { heading: "Selected case results" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "$45M", label: "jury verdict, product liability, 2024" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "$12.5M", label: "settlement, commercial contract dispute" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "92%", label: "of litigation matters resolved without trial" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "500+", label: "cases resolved by the litigation group" },
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
          "We were told by two other firms that our case was not worth pursuing. Meridian & Cole took it to trial and proved them wrong. I wish we had called them first.",
        author: "Harold Voss",
        role: "Plaintiff, product liability matter",
        avatar: avatarArt("d6dde8"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.testimonial",
      blockVersion: 1,
      props: {
        quote:
          "The employment dispute could have dragged our small business under. They negotiated a resolution in ten weeks and explained every step so I never felt out of the loop.",
        author: "Faina Petrova",
        role: "Owner, Petrova Design Studio",
        avatar: avatarArt("e3d9c2"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.testimonial",
      blockVersion: 1,
      props: {
        quote:
          "Our commercial lease dispute with a difficult landlord was resolved without ever seeing a courtroom, at a cost far below what I had budgeted for.",
        author: "Samuel Ortiz",
        role: "Real estate client",
        avatar: avatarArt("f0e6d2"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.accordion",
      blockVersion: 1,
      props: { heading: "Questions about our results" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "Does a past result mean my case will turn out the same way?",
              answer:
                "No. Every case turns on its own facts, evidence, and applicable law. Past results illustrate our approach and experience; they are never a prediction or guarantee for your matter.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "How do you decide whether to settle or go to trial?",
              answer:
                "We prepare every matter as if it will be tried, which gives you real leverage in settlement talks. The decision to settle or proceed to trial is always yours, made with our honest assessment of the risks and likely outcomes on the table.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "How long does a typical litigation matter take?",
              answer:
                "It varies widely by court, subject matter, and whether the other side is willing to negotiate. We give every client a realistic timeline estimate at the outset and update it as the matter develops.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "Can I read the full case details behind these figures?",
              answer:
                "For matters that settled confidentially, we can only describe the outcome in general terms. For public trial verdicts, we are glad to walk you through the case in a consultation.",
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
          "Prior results do not guarantee a similar outcome. Every case is different, and the results described above depended on the specific facts and law involved in each matter.",
        tone: "warning",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.cta",
      blockVersion: 1,
      props: {
        heading: "Tell us about your matter",
        buttonLabel: "Schedule a Consultation",
        buttonHref: "/contact",
      },
      slots: {},
    },
    siteFooter,
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
        heading: "Talk to a lawyer, not an intake script",
        subheading:
          "Tell us briefly what is going on and a partner in the right practice group will reach out, usually within one business day.",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.location-card",
      blockVersion: 1,
      props: {
        name: "Meridian & Cole LLP — Main Office",
        address: "482 Courthouse Square\nSuite 900\nRiverton, ST 00501",
        hours: "Mon-Fri: 8:30am-5:30pm\nSat-Sun: Closed",
        phone: "+1 (555) 014-0199",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.location-card",
      blockVersion: 1,
      props: {
        name: "Meridian & Cole LLP — Eastgate Office",
        address: "17 Eastgate Commons\nFloor 3\nAshford, ST 00588",
        hours: "Mon-Fri: 9am-5pm\nSat-Sun: Closed",
        phone: "+1 (555) 014-0281",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.contact-form",
      blockVersion: 1,
      props: {
        heading: "Request a consultation",
        body: "Share a short description of your matter and the best way to reach you. We reply to every inquiry within one business day.",
        action: "#contact",
        submitLabel: "Request a Consultation",
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
              question: "Is the initial consultation free?",
              answer:
                "Yes, the initial consultation is free and confidential. It is a chance for us to understand your matter and for you to decide whether our firm is the right fit.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "Does submitting this form create an attorney-client relationship?",
              answer:
                "No. Submitting this form or speaking with us informally does not create an attorney-client relationship. That relationship begins only once both sides sign a written engagement letter.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "What should I bring to the first meeting?",
              answer:
                "Any contracts, correspondence, court papers, or other documents related to your matter. If you are not sure what is relevant, bring everything you have and we will help you sort through it.",
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
          "Contacting our firm does not create an attorney-client relationship. Please do not send confidential or time-sensitive information until you have spoken with one of our attorneys and a formal engagement is in place.",
        tone: "info",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.cta",
      blockVersion: 1,
      props: {
        heading: "We reply within one business day",
        buttonLabel: "Schedule a Consultation",
        buttonHref: "/contact",
      },
      slots: {},
    },
    siteFooter,
  ],
};

export const exampleSite = [home, about, practiceAreas, results, contact];
