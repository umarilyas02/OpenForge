/**
 * A complete example site for the Finance theme, expressed as real content
 * trees (`{ blockId, blockVersion, props, slots }`) built from the official
 * CMS block set. Every block instance below supplies each of its block's
 * required editable fields, so the whole site parses, validates, and renders
 * without a single missing prop.
 *
 * The fictional firm is "Northgate Capital Partners", a financial-consulting
 * and advisory practice for mid-market companies and private clients.
 */

/**
 * A tiny inline SVG placeholder, used wherever the example site needs a real
 * image URL (logos, avatars, article art). Kept as a data URI so the kit has
 * no external asset dependencies.
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

/**
 * A shared footer, appended as the last block of every page. Real per-page
 * content trees in this CMS don't otherwise render site-wide chrome, so the
 * footer block is included explicitly here on every page (see the theme's
 * README for why this differs from the SaaS reference theme).
 */
const footer = {
  blockId: "openforge-cms.footer",
  blockVersion: 1,
  props: {
    copyrightText:
      "© 2026 Northgate Capital Partners. All rights reserved. Advisory services offered through Northgate Capital Partners, a registered investment adviser.",
  },
  slots: {
    links: [
      {
        blockId: "openforge-cms.rich-text",
        blockVersion: 1,
        props: { content: "Form ADV Part 2A" },
        slots: {},
      },
      {
        blockId: "openforge-cms.rich-text",
        blockVersion: 1,
        props: { content: "Privacy Policy" },
        slots: {},
      },
      {
        blockId: "openforge-cms.rich-text",
        blockVersion: 1,
        props: { content: "Client Login" },
        slots: {},
      },
    ],
  },
};

const home = {
  path: "/",
  title: "Northgate Capital Partners — financial clarity for decisions that can't wait",
  blocks: [
    {
      blockId: "openforge-cms.banner",
      blockVersion: 1,
      props: {
        message:
          "Our Q3 2026 Market Outlook is now available: rate-cut odds, private-credit spreads, and what they mean for a mid-market balance sheet.",
        ctaLabel: "Read the outlook",
        ctaHref: "/insights",
        tone: "brand",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.hero",
      blockVersion: 1,
      props: {
        heading: "Financial clarity for decisions that can't wait",
        subheading:
          "Northgate Capital Partners turns your ledgers, cap table, and market exposure into one model your team actually understands — so the next board meeting, refinancing, or exit decision rests on numbers you trust, not a slide someone assembled the night before.",
        ctaLabel: "Schedule a portfolio review",
        ctaHref: "/contact",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.marquee-text",
      blockVersion: 1,
      props: {
        text: "S&P 500 +0.8%  •  10-Yr Treasury 4.12%  •  EUR/USD 1.07  •  Gold $2,410/oz  •  IG Credit Spread 92bps",
        speed: "normal",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.logo-cloud",
      blockVersion: 1,
      props: {
        heading:
          "Trusted by finance and operations leaders at 60+ companies",
      },
      slots: {
        items: [
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("cfe3e6"), name: "Anchorbridge Logistics" },
            slots: {},
          },
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("d7e4e6"), name: "Solheim Manufacturing" },
            slots: {},
          },
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("cfe3e6"), name: "Practable Health Systems" },
            slots: {},
          },
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("d7e4e6"), name: "Norwood Retail Group" },
            slots: {},
          },
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("cfe3e6"), name: "Faircrest Energy" },
            slots: {},
          },
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("d7e4e6"), name: "Bellmark Industries" },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.stats-row",
      blockVersion: 1,
      props: { heading: "Results our clients can point to" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "$4.8B", label: "in client assets under advisement" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "312", label: "engagements completed since 2011" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "97%", label: "client retention rate" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "18 days", label: "average time to a first action plan" },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.feature-list",
      blockVersion: 1,
      props: {
        heading: "What sets our advisory apart",
        items:
          "One integrated model spanning cash, credit, and equity, rebuilt from your real ledgers instead of a static template\nA named senior advisor on every engagement, never a rotating analyst pool\nRisk reported as a range and a driver, never a single misleading number\nMonthly working sessions with your finance team, not a slide deck dropped in your inbox\nFull model handoff at the end of every engagement, so the analysis stays yours",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.spotlight-card",
      blockVersion: 1,
      props: {
        icon: "📊",
        title: "Portfolio strategy grounded in your own data",
        description:
          "We model your actual cash position, debt schedule, and revenue mix before we talk allocation — not a generic risk questionnaire.",
        tone: "violet",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.spotlight-card",
      blockVersion: 1,
      props: {
        icon: "🛡️",
        title: "Risk you can actually explain to your board",
        description:
          "Every risk figure comes with the three drivers behind it, so when a number moves, you already know why.",
        tone: "cyan",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.spotlight-card",
      blockVersion: 1,
      props: {
        icon: "🧮",
        title: "Cash-flow forecasting that survives contact with reality",
        description:
          "Rolling 13-week and 12-month forecasts, reconciled against actuals every month so drift gets caught early, not at year-end.",
        tone: "amber",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.testimonial",
      blockVersion: 1,
      props: {
        quote:
          "We came to Northgate with a spreadsheet nobody fully trusted and a refinancing deadline six weeks out. They rebuilt our cash model, found the covenant risk our own numbers were hiding, and sat with our CFO until the board believed it too.",
        author: "Renata Oduya",
        role: "CEO, Anchorbridge Logistics",
        avatar: avatarArt("cfe3e6"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.testimonial",
      blockVersion: 1,
      props: {
        quote:
          "Every other advisor we interviewed pitched us a risk score. Northgate showed us the three levers behind our score and which one to pull first. That distinction alone was worth the engagement.",
        author: "Declan Furst",
        role: "CFO, Solheim Manufacturing",
        avatar: avatarArt("d7e4e6"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.data-table",
      blockVersion: 1,
      props: {
        heading: "Where our advisory shows up in the numbers",
        headers: "Metric, Before Northgate, After 12 months",
        rows:
          "Days sales outstanding|54 days|38 days\nCash-flow forecast variance|±22%|±6%\nWorking capital tied up|$3.1M|$1.9M\nTime to close the monthly book|11 business days|5 business days\nBoard-level surprises per year|4.2 average|0.6 average",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.cta",
      blockVersion: 1,
      props: {
        heading: "Ready to see your numbers differently?",
        buttonLabel: "Book a consultation",
        buttonHref: "/contact",
      },
      slots: {},
    },
    footer,
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
        heading: "Advisory built around your numbers, not our template",
        subheading:
          "Every engagement starts with your real ledgers, not a standardized questionnaire. What we build next depends on what those numbers actually show.",
        ctaLabel: "Talk to an advisor",
        ctaHref: "/contact",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.heading",
      blockVersion: 1,
      props: { text: "Three ways we work with you", level: "h2", align: "center" },
      slots: {},
    },
    {
      blockId: "openforge-cms.icon-box",
      blockVersion: 1,
      props: {
        icon: "📈",
        title: "Portfolio Strategy",
        description:
          "Asset allocation and liability matching built from your actual balance sheet, revisited quarterly as conditions move.",
        layout: "icon-left",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.icon-box",
      blockVersion: 1,
      props: {
        icon: "🛡️",
        title: "Risk Analytics",
        description:
          "Credit, interest-rate, and concentration risk modeled together and reported as ranges with named drivers, not a single opaque score.",
        layout: "icon-left",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.icon-box",
      blockVersion: 1,
      props: {
        icon: "🧮",
        title: "Cash-Flow Forecasting",
        description:
          "Rolling 13-week and 12-month forecasts reconciled monthly against actuals, so variance gets caught while it is still small.",
        layout: "icon-left",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.icon-box",
      blockVersion: 1,
      props: {
        icon: "🤝",
        title: "Corporate Advisory & M&A Readiness",
        description:
          "Diligence-ready financials, term-sheet review, and integration modeling for a raise, refinancing, or sale.",
        layout: "icon-left",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.tabs",
      blockVersion: 1,
      props: {
        heading: "How each engagement runs",
        labels: "Discovery\nModeling\nImplementation\nReview",
        groupId: "engagement-phases",
      },
      slots: {
        items: [
          {
            blockId: "openforge-cms.tab-panel",
            blockVersion: 1,
            props: {
              label: "Discovery",
              content:
                "We start inside your actual ledgers, cap table, and bank feeds — two weeks of structured interviews and data pulls, not a template intake form.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.tab-panel",
            blockVersion: 1,
            props: {
              label: "Modeling",
              content:
                "Your numbers go into one integrated model covering cash, credit, and equity exposure, stress-tested against the scenarios your board actually worries about.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.tab-panel",
            blockVersion: 1,
            props: {
              label: "Implementation",
              content:
                "We sit with your finance team while changes go live — new forecast cadence, revised covenant tracking, or a rebalanced allocation — so the model gets used, not filed away.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.tab-panel",
            blockVersion: 1,
            props: {
              label: "Review",
              content:
                "Monthly working sessions reconcile the model against actuals and adjust it as conditions move, for as long as the engagement runs.",
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
        heading: "Advisory engagement metrics",
        headers: "Engagement type, Typical duration, Typical outcome",
        rows:
          "Portfolio strategy review|4-6 weeks|Rebalanced allocation with a documented rationale\nRisk analytics build-out|6-8 weeks|A standing risk model with monthly monitoring\nCash-flow forecasting setup|3-4 weeks|A rolling 13-week and 12-month forecast, reconciled monthly\nM&A readiness review|8-12 weeks|A diligence-ready data room and negotiation model",
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
      props: { text: "Advisory retainer tiers", level: "h2", align: "center" },
      slots: {},
    },
    {
      blockId: "openforge-cms.pricing",
      blockVersion: 1,
      props: {
        planName: "Foundation",
        price: "$2,400 / month",
        features:
          "Quarterly portfolio and risk review\nRolling 12-month cash-flow forecast\nMonthly market and rate briefing\nEmail access to your advisory team",
        buttonLabel: "Start with Foundation",
        buttonHref: "/contact",
        featured: false,
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.pricing",
      blockVersion: 1,
      props: {
        planName: "Advisory",
        price: "$6,500 / month",
        features:
          "Everything in Foundation\nMonthly working sessions with a named senior advisor\nRolling 13-week and 12-month forecasts, reconciled monthly\nFull risk analytics with quarterly stress testing\nBoard-ready reporting package",
        buttonLabel: "Start with Advisory",
        buttonHref: "/contact",
        featured: true,
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.pricing",
      blockVersion: 1,
      props: {
        planName: "Enterprise",
        price: "Custom",
        features:
          "Everything in Advisory\nDedicated advisory team, not a single point of contact\nM&A and refinancing support included\nCustom model build-out and integration with your finance stack\nQuarterly in-person board presentations",
        buttonLabel: "Talk to sales",
        buttonHref: "/contact",
        featured: false,
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.comparison-table",
      blockVersion: 1,
      props: {
        heading: "Compare advisory tiers",
        headers: "Feature, Foundation, Advisory, Enterprise",
        rows:
          "Portfolio and risk review|Quarterly|Monthly|Monthly\nCash-flow forecast|12-month|13-week and 12-month|13-week and 12-month, integrated\nNamed senior advisor|Not included|Included|Dedicated team\nM&A and refinancing support|Not included|Not included|Included\nBoard-ready reporting|Not included|Included|Included, presented in person",
        featuredColumn: "2",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.alert",
      blockVersion: 1,
      props: {
        message:
          "Northgate Capital Partners acts as a fee-only fiduciary: we take no commissions or referral fees from any product or fund we discuss with you.",
        tone: "info",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.accordion",
      blockVersion: 1,
      props: { heading: "Questions we get before an engagement starts" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "What size company or portfolio do you work with?",
              answer:
                "Most Advisory and Enterprise clients are mid-market companies with $10M-$500M in revenue, or private clients with $2M or more in investable assets. Foundation fits earlier-stage companies that need a rigorous forecast before they are ready for a full advisory retainer.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "Do you take custody of client assets?",
              answer:
                "No. We advise; your existing custodian or bank continues to hold your assets. This keeps us structurally independent of the products we might otherwise be tempted to recommend.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "How fast can an engagement actually start?",
              answer:
                "Discovery typically begins within two weeks of signing, once we have secured read access to the ledgers, bank feeds, and cap table the engagement needs.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "What happens to the model when the engagement ends?",
              answer:
                "It is yours. Every engagement ends with a full handoff of the underlying model and documentation, not a summary deck.",
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
        heading: "Bring us your numbers before you bring us your assumptions",
        buttonLabel: "Schedule a portfolio review",
        buttonHref: "/contact",
      },
      slots: {},
    },
    footer,
  ],
};

const about = {
  path: "/about",
  title: "About Northgate Capital Partners",
  blocks: [
    {
      blockId: "openforge-cms.hero",
      blockVersion: 1,
      props: {
        heading: "We started this firm because a covenant breach shouldn't be a surprise",
        subheading:
          "Northgate was founded in 2011 after our founder watched a client's board learn about a covenant breach from their bank, not from their own advisor. Every model we build since has been designed so that never happens again.",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.rich-text",
      blockVersion: 1,
      props: {
        content:
          "Most financial advisory firms sell you a template: a risk questionnaire, a model portfolio, a slide deck refreshed once a quarter. We think the hard part is different — it's building one model that actually reflects your cash position, your debt schedule, and your market exposure at the same time, and keeping it current enough that it changes how decisions get made.\n\nSo that is what we build. Northgate is deliberately narrow: we do not manage assets, sell insurance products, or take a cut of any transaction we advise on. We are paid a flat retainer to tell you what your own numbers are actually saying.\n\nWe are a team of 41 across two offices, independently owned by our partners, and every engagement is led by a named senior advisor who stays with you for as long as you work with us.",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.stats-row",
      blockVersion: 1,
      props: { heading: "Northgate at a glance" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "2011", label: "founded" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "41", label: "advisors and analysts" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "2", label: "offices, Chicago and New York" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "$4.8B", label: "in client assets under advisement" },
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
              date: "2011",
              title: "Northgate opens in Chicago",
              description:
                "Founded with four clients and one conviction: a board should never learn about its own financial risk secondhand.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "2015",
              title: "Risk Analytics becomes its own practice",
              description:
                "What began as a spreadsheet built for one client's covenant tracking became a standing service after six more clients asked for the same thing.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "2019",
              title: "New York office opens",
              description:
                "Client demand on the East Coast, largely in M&A readiness work, justified a second office rather than a satellite team.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "2026",
              title: "Northgate today",
              description:
                "41 advisors and analysts, $4.8B in client assets under advisement, and a fee-only structure we have never deviated from.",
            },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.heading",
      blockVersion: 1,
      props: { text: "The advisors who lead your engagement", level: "h2", align: "left" },
      slots: {},
    },
    {
      blockId: "openforge-cms.team-member",
      blockVersion: 1,
      props: {
        name: "Marguerite Assefa",
        role: "Founder and Managing Partner",
        bio: "Spent eleven years in corporate treasury before founding Northgate in 2011. Still leads the firm's largest Enterprise engagements personally.",
        photo: avatarArt("cfe3e6"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.team-member",
      blockVersion: 1,
      props: {
        name: "Peter Kowalczyk",
        role: "Head of Portfolio Strategy",
        bio: "Fifteen years managing institutional fixed-income books before joining Northgate to build the Portfolio Strategy practice in 2016.",
        photo: avatarArt("d7e4e6"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.team-member",
      blockVersion: 1,
      props: {
        name: "Ines Carvalho",
        role: "Head of Risk Analytics",
        bio: "Built the firm's risk-modeling framework from that first covenant-tracking spreadsheet and has led the practice since 2015.",
        photo: avatarArt("cfe3e6"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.cta",
      blockVersion: 1,
      props: {
        heading: "We are hiring analysts across both offices",
        buttonLabel: "See open roles",
        buttonHref: "/contact",
      },
      slots: {},
    },
    footer,
  ],
};

const insights = {
  path: "/insights",
  title: "Insights",
  blocks: [
    {
      blockId: "openforge-cms.hero",
      blockVersion: 1,
      props: {
        heading: "Insights",
        subheading:
          "Market commentary, forecasting notes, and the occasional uncomfortable number from the advisors at Northgate Capital Partners.",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.card",
      blockVersion: 1,
      props: {
        image: coverArt("cfe3e6"),
        title: "Reading the yield curve without the jargon",
        description:
          "What an inverted curve does and does not tell you about the next twelve months, and the two indicators we actually weight more heavily.",
        linkLabel: "Read the article",
        linkHref: "/insights/reading-the-yield-curve",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.card",
      blockVersion: 1,
      props: {
        image: coverArt("d7e4e6"),
        title: "What a 90-day cash-flow forecast catches that a quarterly one misses",
        description:
          "Three real covenant near-misses we caught early, and the forecasting cadence that made the difference in each one.",
        linkLabel: "Read the article",
        linkHref: "/insights/the-90-day-forecast",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.card",
      blockVersion: 1,
      props: {
        image: coverArt("cfe3e6"),
        title: "Six questions to ask before your next M&A term sheet",
        description:
          "The diligence questions that most often surface a valuation gap after signing, drawn from twelve years of readiness reviews.",
        linkLabel: "Read the article",
        linkHref: "/insights/before-your-next-term-sheet",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.card",
      blockVersion: 1,
      props: {
        image: coverArt("d7e4e6"),
        title: "Why we stopped presenting risk as a single number",
        description:
          "A single risk score hides more than it reveals. Here is the three-driver format we replaced it with, and how clients use it in board meetings.",
        linkLabel: "Read the article",
        linkHref: "/insights/beyond-a-single-risk-score",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.data-table",
      blockVersion: 1,
      props: {
        heading: "Market snapshot",
        headers: "Indicator, Value, 3-month change",
        rows:
          "S&P 500|5,842|+4.1%\n10-Yr Treasury yield|4.12%|-0.18pp\nIG credit spread|92 bps|-6 bps\nUSD/EUR|1.07|+1.2%\nGold|$2,410/oz|+3.8%",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.newsletter-signup",
      blockVersion: 1,
      props: {
        heading: "Subscribe to our monthly market briefing",
        body: "One considered email a month covering rates, credit, and what we are watching for client portfolios. No product pitches.",
        action: "#subscribe",
        placeholder: "you@company.com",
        submitLabel: "Subscribe",
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
        heading: "Talk to an advisor, not a call queue",
        subheading:
          "Tell us what is on your balance sheet and what decision is coming up. We will tell you honestly whether we are the right advisor for it.",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.location-card",
      blockVersion: 1,
      props: {
        name: "Northgate Capital Partners — Chicago HQ",
        address: "233 South Wacker Drive\nSuite 4100\nChicago, IL 60606",
        hours: "Mon-Fri: 8am-6pm CT\nSat-Sun: Closed",
        phone: "+1 (312) 555-0142",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.location-card",
      blockVersion: 1,
      props: {
        name: "Northgate Capital Partners — New York",
        address: "1 Vanderbilt Avenue\nFloor 27\nNew York, NY 10017",
        hours: "Mon-Fri: 8am-6pm ET\nSat-Sun: Closed",
        phone: "+1 (212) 555-0198",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.contact-form",
      blockVersion: 1,
      props: {
        heading: "Send us a note",
        body: "A senior advisor will reply directly, usually within one business day.",
        action: "#contact",
        submitLabel: "Request a consultation",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.alert",
      blockVersion: 1,
      props: {
        message:
          "Our advisory team covers ET and CT business hours. Anything sent outside that window is answered first thing the next business day.",
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
              question: "Can I get an introductory call without committing to an engagement?",
              answer:
                "Yes. Every relationship starts with a no-obligation portfolio review so we can both tell whether Northgate is the right fit before anything is signed.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "What documents should I have ready?",
              answer:
                "Recent financial statements, your current debt schedule, and cap table if applicable. We will tell you exactly what read access we need once we understand your situation.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "Do you work with clients outside Chicago and New York?",
              answer:
                "Yes, the majority of our engagements run remotely with periodic in-person sessions. Location only affects how often we meet in your offices.",
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
        heading: "Bring us your numbers before your next big decision",
        buttonLabel: "Schedule a portfolio review",
        buttonHref: "/services",
      },
      slots: {},
    },
    footer,
  ],
};

export const exampleSite = [home, services, about, insights, contact];
