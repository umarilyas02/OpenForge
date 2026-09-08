/**
 * A complete example marketing site for the SaaS theme, expressed as real
 * content trees (`{ blockId, blockVersion, props, slots }`) built from the
 * official CMS block set. Every block instance below supplies each of its
 * block's required editable fields, so the whole site parses, validates,
 * and renders without a single missing prop.
 *
 * The fictional product is "Klarion", a customer-operations platform.
 */

/**
 * A tiny inline SVG placeholder, used wherever the example site needs a
 * real image URL (logos, avatars, article art). Kept as a data URI so the
 * kit has no external asset dependencies.
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
  title: "Klarion — customer operations that run themselves",
  blocks: [
    {
      blockId: "openforge-cms.banner",
      blockVersion: 1,
      props: {
        message:
          "Klarion 3.0 is live: playbooks can now branch on billing and support signals in the same run.",
        ctaLabel: "Read the release notes",
        ctaHref: "/blog",
        tone: "brand",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.hero",
      blockVersion: 1,
      props: {
        heading: "Every customer handoff, on time and on the record.",
        subheading:
          "Klarion turns the signals already sitting in your CRM, help desk, and billing system into playbooks that run themselves — so onboarding, renewals, and escalations stop depending on who remembered to follow up.",
        ctaLabel: "Start a 14-day trial",
        ctaHref: "/pricing",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.logo-cloud",
      blockVersion: 1,
      props: {
        heading: "Operations teams at 1,400+ B2B companies run on Klarion",
      },
      slots: {
        items: [
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("e6e3fd"), name: "Harborline Logistics" },
            slots: {},
          },
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("dedbfb"), name: "Ferrous Labs" },
            slots: {},
          },
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("e6e3fd"), name: "Meadowpine Health" },
            slots: {},
          },
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("dedbfb"), name: "Overtone Audio" },
            slots: {},
          },
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("e6e3fd"), name: "Bellwether Freight" },
            slots: {},
          },
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("dedbfb"), name: "Cobalt and Ridge" },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.stats-row",
      blockVersion: 1,
      props: { heading: "What teams see in their first quarter" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "38%", label: "faster onboarding cycles" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "6.4 hrs", label: "saved per rep each week" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "1,400+", label: "teams running daily playbooks" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "99.98%", label: "playbook delivery uptime" },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.feature-list",
      blockVersion: 1,
      props: {
        heading: "Built for the work that lives between your tools",
        items:
          "Signal Inbox pulls every account event into one queue, deduplicated and ranked by revenue at risk\nPlaybook Builder turns a repeatable handoff into a versioned workflow in about ten minutes, no scripting\nHealth Scores blend product usage, ticket sentiment, and invoice status into one number your team trusts\nOwnership routing assigns each step to a person, not a shared inbox, and escalates when a step goes stale\nAudit trail records who did what and when, so renewals and security reviews stop being archaeology",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.spotlight-card",
      blockVersion: 1,
      props: {
        icon: "📥",
        title: "Stop triaging in six browser tabs",
        description:
          "Klarion watches your CRM, help desk, billing, and product events at once and surfaces only the accounts that need a human this week.",
        tone: "violet",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.spotlight-card",
      blockVersion: 1,
      props: {
        icon: "🧭",
        title: "Every handoff has an owner",
        description:
          "Assign steps to named people with a due date. If a step goes stale, Klarion escalates it before the customer notices.",
        tone: "cyan",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.spotlight-card",
      blockVersion: 1,
      props: {
        icon: "📈",
        title: "Report on the process, not the anecdote",
        description:
          "Every playbook run is a data point. See where deals stall, which steps get skipped, and what that costs in renewal dollars.",
        tone: "amber",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.testimonial",
      blockVersion: 1,
      props: {
        quote:
          "We were running onboarding out of a spreadsheet and three chat channels. Two weeks after we moved it into Klarion, our average time-to-first-value dropped from 41 days to 25 — and nobody had to be nagged into updating a status field.",
        author: "Priya Raghunathan",
        role: "VP Customer Operations, Harborline Logistics",
        avatar: avatarArt("d7d3fb"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.testimonial",
      blockVersion: 1,
      props: {
        quote:
          "The audit trail alone paid for the year. Our security review used to take a fortnight of screenshots; now we export the playbook history and we are done in an afternoon.",
        author: "Marcus Bell",
        role: "Director of Revenue Operations, Ferrous Labs",
        avatar: avatarArt("cfe9f7"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.cta",
      blockVersion: 1,
      props: {
        heading: "See your first playbook run this afternoon",
        buttonLabel: "Start a 14-day trial",
        buttonHref: "/pricing",
      },
      slots: {},
    },
  ],
};

const features = {
  path: "/features",
  title: "Features",
  blocks: [
    {
      blockId: "openforge-cms.hero",
      blockVersion: 1,
      props: {
        heading: "One workspace for the workflows nobody owns",
        subheading:
          "Onboarding, renewals, escalations, and win-backs all follow the same shape: a signal arrives, someone has to act, and the account quietly suffers if they do not. Klarion gives that shape a home.",
        ctaLabel: "Book a walkthrough",
        ctaHref: "/contact",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.heading",
      blockVersion: 1,
      props: {
        text: "Four parts, one loop",
        level: "h2",
        align: "center",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.icon-box",
      blockVersion: 1,
      props: {
        icon: "📡",
        title: "Signal Inbox",
        description:
          "Connect a source once and Klarion normalizes its events: usage drops, failed invoices, angry tickets, expiring contracts. Duplicates collapse into a single account thread.",
        layout: "icon-left",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.icon-box",
      blockVersion: 1,
      props: {
        icon: "🛠️",
        title: "Playbook Builder",
        description:
          "Describe the steps, who owns each one, and how long it may sit. Branch on any signal. Version every change so you can tell what a playbook looked like the day a customer churned.",
        layout: "icon-left",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.icon-box",
      blockVersion: 1,
      props: {
        icon: "❤️‍🩹",
        title: "Health Scores",
        description:
          "A single per-account number built from product usage, support sentiment, and billing status — with the underlying inputs always one click away, so nobody has to trust a black box.",
        layout: "icon-left",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.icon-box",
      blockVersion: 1,
      props: {
        icon: "📊",
        title: "Operations Reporting",
        description:
          "Cycle time per playbook, stalled-step rate by owner, and renewal dollars sitting behind an overdue task. Export to your warehouse or read it here.",
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
      props: { heading: "What happens when a signal lands" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "Step 1",
              title: "The signal arrives",
              description:
                "A usage drop, a failed payment, or a renewal date crossing 90 days out lands in the Signal Inbox and is matched to an account.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "Step 2",
              title: "A playbook starts",
              description:
                "Klarion picks the playbook whose conditions match, opens a run, and pins it to the account timeline so context travels with the work.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "Step 3",
              title: "Owners get their step",
              description:
                "Each step goes to a named person with a due date, in the tool they already live in — Klarion, email, or your chat client.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "Step 4",
              title: "The run closes, and the data stays",
              description:
                "Outcome, duration, and every action taken are written to the audit trail and the reporting warehouse. Next quarter you can prove what worked.",
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
        heading: "Integrations available today",
        headers: "System, What Klarion reads, What Klarion writes",
        rows: "CRM|Accounts, opportunities, renewal dates|Playbook status, next step, owner\nHelp desk|Tickets, sentiment, first-response time|Linked run, escalation notes\nBilling|Invoices, failed payments, plan changes|Dunning outcome, save-offer result\nProduct analytics|Feature adoption, seat activity|Health score inputs\nData warehouse|Nothing|Run history, cycle times, outcomes",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.feature-list",
      blockVersion: 1,
      props: {
        heading: "Also included, on every plan",
        items:
          "SAML single sign-on and SCIM user provisioning\nRole-based permissions down to the individual playbook\nSandbox workspace for testing playbook changes against real historical signals\nFull REST API and outbound webhooks for anything we have not built yet\nData residency in the EU or the US, chosen per workspace",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.cta",
      blockVersion: 1,
      props: {
        heading: "Bring one messy workflow. We will show you the loop.",
        buttonLabel: "Book a walkthrough",
        buttonHref: "/contact",
      },
      slots: {},
    },
  ],
};

const pricing = {
  path: "/pricing",
  title: "Pricing",
  blocks: [
    {
      blockId: "openforge-cms.hero",
      blockVersion: 1,
      props: {
        heading: "Priced per seat, not per signal",
        subheading:
          "Connect every system you have and run as many playbooks as you like. You pay for the people doing the work, so nobody has to ration automation to stay inside a quota.",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.pricing",
      blockVersion: 1,
      props: {
        planName: "Starter",
        price: "$29 per seat / month",
        features:
          "Up to 10 seats\n3 connected systems\n10 active playbooks\nSignal Inbox and Health Scores\nEmail support, next business day",
        buttonLabel: "Start a 14-day trial",
        buttonHref: "/contact",
        featured: false,
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.pricing",
      blockVersion: 1,
      props: {
        planName: "Growth",
        price: "$59 per seat / month",
        features:
          "Unlimited seats\nUnlimited connected systems\nUnlimited playbooks with branching\nSandbox workspace and versioned playbooks\nOperations reporting and warehouse export\nShared chat channel with our team, four-hour response",
        buttonLabel: "Start a 14-day trial",
        buttonHref: "/contact",
        featured: true,
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.pricing",
      blockVersion: 1,
      props: {
        planName: "Scale",
        price: "Custom",
        features:
          "Everything in Growth\nSAML SSO, SCIM, and audit log streaming\nEU or US data residency\n99.9% uptime SLA with credits\nNamed onboarding architect for the first 90 days",
        buttonLabel: "Talk to sales",
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
          "Registered nonprofits and teams under five people get 50% off Starter and Growth. Write to us and we will apply it to your account the same day.",
        tone: "info",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.accordion",
      blockVersion: 1,
      props: { heading: "Questions we get before people buy" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "What counts as a seat?",
              answer:
                "Anyone who owns a playbook step or edits a playbook. Teammates who only read dashboards or account timelines are free, and there is no limit on them.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "How long does implementation actually take?",
              answer:
                "Most teams connect their CRM and help desk on day one and have their first onboarding playbook running within a week. Growth and Scale customers get a migration review before they go live.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "Can I try it against my real data?",
              answer:
                "Yes. The 14-day trial is a full workspace, and the sandbox lets you replay the last 90 days of your own signals through a draft playbook before you turn it on for the team.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "What happens to my data if we leave?",
              answer:
                "You can export every account, playbook definition, and run record as JSON or CSV at any time, including after cancellation. We delete your workspace 30 days after you ask us to.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "Do you charge for connected systems?",
              answer:
                "Only on Starter, which includes three. Growth and Scale include every integration we ship, plus the API and webhooks for the ones we do not.",
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
        heading: "Try it on one workflow before you commit to ten",
        buttonLabel: "Start a 14-day trial",
        buttonHref: "/contact",
      },
      slots: {},
    },
  ],
};

const about = {
  path: "/about",
  title: "About Klarion",
  blocks: [
    {
      blockId: "openforge-cms.hero",
      blockVersion: 1,
      props: {
        heading:
          "We got tired of watching good teams lose accounts to forgetfulness",
        subheading:
          "Klarion started as an internal tool at a logistics software company, built because three renewals slipped in one quarter for the same reason: the handoff between support and account management had no owner.",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.rich-text",
      blockVersion: 1,
      props: {
        content:
          "Most operations software assumes the hard part is storing the record. In our experience the hard part is the twenty minutes after a signal appears — deciding whether it matters, who should act, and what good looks like when they are done.\n\nSo we built for that twenty minutes. Klarion is deliberately narrow: it does not want to be your CRM, your help desk, or your billing system. It wants to be the layer that notices what those systems are saying and makes sure a person does something about it.\n\nWe are a remote team of 34 across nine countries, funded by revenue and a single seed round, and we publish our uptime and incident history in public because we think you should be able to check.",
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
            props: { value: "34", label: "people, fully remote" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "9", label: "countries on the team" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "1,400+", label: "customer workspaces" },
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
              date: "2021",
              title: "An internal script",
              description:
                "A weekend project that watched the help desk and pinged an account manager when a top-50 customer filed a second angry ticket in a week.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "2022",
              title: "First ten customers",
              description:
                "We rewrote the script as a product because four other companies asked to buy the thing we kept describing at meetups.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "2024",
              title: "Playbook Builder and the audit trail",
              description:
                "Customers stopped asking for more alerts and started asking for proof of what happened. The audit trail became the reason enterprises signed.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "2026",
              title: "Klarion 3.0",
              description:
                "Cross-system branching, EU data residency, and a sandbox that replays your real history against a draft playbook.",
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
        text: "The people who answer your email",
        level: "h2",
        align: "left",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.team-member",
      blockVersion: 1,
      props: {
        name: "Dilnoza Karimova",
        role: "Co-founder and CEO",
        bio: "Ran customer operations for a 600-person logistics platform and wrote the first version of Klarion to stop losing renewals she could see coming.",
        photo: avatarArt("d7d3fb"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.team-member",
      blockVersion: 1,
      props: {
        name: "Tomas Wren",
        role: "Co-founder and CTO",
        bio: "Spent a decade building event pipelines. Responsible for the part of Klarion that never drops a signal, and for the public uptime page.",
        photo: avatarArt("cfe9f7"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.team-member",
      blockVersion: 1,
      props: {
        name: "Amara Osei",
        role: "Head of Customer Engineering",
        bio: "Leads the team that gets your first playbook live. Has personally migrated more onboarding spreadsheets than anyone should have to.",
        photo: avatarArt("fbe6cf"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.cta",
      blockVersion: 1,
      props: {
        heading: "We are hiring across engineering and customer engineering",
        buttonLabel: "See open roles",
        buttonHref: "/contact",
      },
      slots: {},
    },
  ],
};

const blog = {
  path: "/blog",
  title: "Blog",
  blocks: [
    {
      blockId: "openforge-cms.hero",
      blockVersion: 1,
      props: {
        heading: "Notes on customer operations",
        subheading:
          "Field notes, product changelogs, and the occasional uncomfortable metric from the team building Klarion.",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.card",
      blockVersion: 1,
      props: {
        image: coverArt("e6e3fd"),
        title: "The handoff is the product",
        description:
          "Why the gap between support and account management costs more renewal revenue than any single feature gap, and how to measure it in your own data this week.",
        linkLabel: "Read the article",
        linkHref: "/blog/the-handoff-is-the-product",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.card",
      blockVersion: 1,
      props: {
        image: coverArt("dfeff9"),
        title: "Health scores lie when nobody can see inside them",
        description:
          "We shipped an opaque score, watched teams quietly stop trusting it, and rebuilt it so every input is one click away. Here is what changed.",
        linkLabel: "Read the article",
        linkHref: "/blog/health-scores-lie",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.card",
      blockVersion: 1,
      props: {
        image: coverArt("fbe6cf"),
        title: "Klarion 3.0: cross-system branching",
        description:
          "A playbook can now branch on a billing event and a support signal in the same run. What that unlocks for dunning, save offers, and expansion plays.",
        linkLabel: "Read the changelog",
        linkHref: "/blog/klarion-3-0",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.card",
      blockVersion: 1,
      props: {
        image: coverArt("e3f7ea"),
        title: "What we learned from 40,000 stalled steps",
        description:
          "Steps stall for four reasons, and only one of them is laziness. A look at the anonymized data behind our escalation defaults.",
        linkLabel: "Read the article",
        linkHref: "/blog/forty-thousand-stalled-steps",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.cta",
      blockVersion: 1,
      props: {
        heading: "One considered email a month, no product news filler",
        buttonLabel: "Subscribe to the newsletter",
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
        heading: "Talk to a person who has migrated a spreadsheet",
        subheading:
          "No qualification form, no discovery call before the demo. Tell us which workflow is hurting and we will show you what it looks like as a playbook.",
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
                "Sales and demos\n\nWrite to sales@klarion.example and you will get a reply from a solutions engineer, usually within four working hours.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.rich-text",
            blockVersion: 1,
            props: {
              content:
                "Customer support\n\nExisting customers can reach us at support@klarion.example or in the shared channel on Growth and Scale plans.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.rich-text",
            blockVersion: 1,
            props: {
              content:
                "Security and press\n\nSend disclosures to security@klarion.example. Press and analyst enquiries go to press@klarion.example.",
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
          "Our support team works across UTC-5 to UTC+5:30, so there is someone awake for most of the working day. Anything filed outside that window is answered first thing the next morning.",
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
              question: "Can I get a demo without a sales call first?",
              answer:
                "Yes. Ask for the recorded walkthrough and we will send it immediately, with a calendar link only if you want one afterwards.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "Do you help with the migration?",
              answer:
                "On Growth and Scale, yes. Our customer engineering team will map your existing process and build the first two playbooks with you.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "Where do I report a security issue?",
              answer:
                "Email security@klarion.example. We acknowledge every report within one business day and publish a post-mortem for anything that affected customer data.",
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
        buttonLabel: "Start a 14-day trial",
        buttonHref: "/pricing",
      },
      slots: {},
    },
  ],
};

export const exampleSite = [home, features, pricing, about, blog, contact];
