/**
 * A complete example marketing site for the Beauty theme, expressed as real
 * content trees (`{ blockId, blockVersion, props, slots }`) built from the
 * official CMS block set. Every block instance below supplies each of its
 * block's required editable fields, so the whole site parses, validates,
 * and renders without a single missing prop.
 *
 * The fictional business is "Petalwood Spa & Salon", a neighborhood salon
 * and day spa offering hair, skin, and massage treatments.
 */

/**
 * A tiny inline SVG placeholder, used wherever the example site needs a
 * real image URL (gallery photos, avatars, press logos). Kept as a data URI
 * so the kit has no external asset dependencies.
 *
 * @param {number} width
 * @param {number} height
 * @param {string} fill Six-digit hex color, without the leading "#".
 */
const artwork = (width, height, fill) =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Crect width='${width}' height='${height}' fill='%23${fill}'/%3E%3C/svg%3E`;

const logoArt = (fill) => artwork(160, 48, fill);
const avatarArt = (fill) => artwork(96, 96, fill);
const galleryArt = (fill) => artwork(640, 480, fill);
const portraitArt = (fill) => artwork(480, 600, fill);

const home = {
  path: "/",
  title: "Petalwood Spa & Salon — a quiet retreat for hair, skin, and calm",
  blocks: [
    {
      blockId: "openforge-cms.banner",
      blockVersion: 1,
      props: {
        message:
          "Autumn Glow package now booking: a facial, scalp massage, and blowout for one unhurried afternoon.",
        ctaLabel: "See services",
        ctaHref: "/services",
        tone: "brand",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.hero",
      blockVersion: 1,
      props: {
        heading: "An hour to yourself, done properly.",
        subheading:
          "Petalwood is a six-chair salon and day spa built around one idea: good treatments take time, and good service remembers your name. Hair, skin, and massage, from stylists and therapists who stay long enough to know your hair type and your usual order.",
        ctaLabel: "Book your visit",
        ctaHref: "/contact",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.logo-cloud",
      blockVersion: 1,
      props: {
        heading: "Featured in",
      },
      slots: {
        items: [
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("f6dde5"), name: "Willowmere Weekly" },
            slots: {},
          },
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("f2cdd9"), name: "Bridal & Bloom" },
            slots: {},
          },
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("f6dde5"), name: "The Local Table" },
            slots: {},
          },
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("f2cdd9"), name: "Sunday Edit" },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.stats-row",
      blockVersion: 1,
      props: { heading: "What guests notice" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "11", label: "years on Petalwood Lane" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "6", label: "stylists and therapists" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "14,000+", label: "treatments booked" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "4.9 / 5", label: "average guest rating" },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.feature-list",
      blockVersion: 1,
      props: {
        heading: "Why guests keep coming back",
        items:
          "One stylist or therapist for the whole visit, never handed off partway through\nA quiet, six-chair room instead of a crowded floor — no shouted conversations across the salon\nConsultations that start with your hair or skin history, not a price list\nOrganic, sulphate-free product lines used in every service, with retail sizes to take home\nOnline booking that shows real, live openings, not a call-back promise",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.spotlight-card",
      blockVersion: 1,
      props: {
        icon: "💇🏽‍♀️",
        title: "Hair",
        description:
          "Cut, color, and blowouts from stylists who ask what your hair actually does on a Tuesday morning, not just what looks good in the chair.",
        tone: "violet",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.spotlight-card",
      blockVersion: 1,
      props: {
        icon: "🌿",
        title: "Skin",
        description:
          "Facials built around your skin that week, not a fixed menu — extractions, peels, and calming treatments, always with an aftercare plan.",
        tone: "cyan",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.spotlight-card",
      blockVersion: 1,
      props: {
        icon: "🕯️",
        title: "Massage",
        description:
          "Deep tissue, hot stone, and prenatal massage in a room kept quiet on purpose — no music you didn't choose, no rush at the end.",
        tone: "amber",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.avatar-group",
      blockVersion: 1,
      props: { caption: "Loved by regulars who rebook every six weeks" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.avatar-item",
            blockVersion: 1,
            props: { image: avatarArt("f2cdd9"), name: "Regular guest" },
            slots: {},
          },
          {
            blockId: "openforge-cms.avatar-item",
            blockVersion: 1,
            props: { image: avatarArt("f6dde5"), name: "Regular guest" },
            slots: {},
          },
          {
            blockId: "openforge-cms.avatar-item",
            blockVersion: 1,
            props: { image: avatarArt("f2cdd9"), name: "Regular guest" },
            slots: {},
          },
          {
            blockId: "openforge-cms.avatar-item",
            blockVersion: 1,
            props: { image: avatarArt("f6dde5"), name: "Regular guest" },
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
          "I have fine, easily-damaged hair and have been burned by fast blowout chains before. Nadia at Petalwood spent the first visit just asking questions. Eight months later my hair is in better shape than it has been in years.",
        author: "Renata Ibarra",
        role: "Guest since 2023",
        avatar: avatarArt("f2cdd9"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.testimonial",
      blockVersion: 1,
      props: {
        quote:
          "The 90-minute deep tissue massage is the only hour of my week where my phone is genuinely somewhere else. Worth rearranging a Tuesday for.",
        author: "Owen Faulkner",
        role: "Guest since 2022",
        avatar: avatarArt("f6dde5"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.rating",
      blockVersion: 1,
      props: { value: "5", label: "4.9 out of 5 across 900+ guest reviews" },
      slots: {},
    },
    {
      blockId: "openforge-cms.newsletter-signup",
      blockVersion: 1,
      props: {
        heading: "Seasonal packages, before they book out",
        body: "One short email a month: new packages, stylist availability, and the occasional quiet-week discount.",
        action: "#newsletter",
        placeholder: "you@example.com",
        submitLabel: "Sign up",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.cta",
      blockVersion: 1,
      props: {
        heading: "Ready for an hour that's actually yours?",
        buttonLabel: "Book your visit",
        buttonHref: "/contact",
      },
      slots: {},
    },
  ],
};

const services = {
  path: "/services",
  title: "Services & pricing",
  blocks: [
    {
      blockId: "openforge-cms.hero",
      blockVersion: 1,
      props: {
        heading: "Every treatment, plainly priced",
        subheading:
          "No surprise add-ons at checkout. Each package below lists exactly what is included, and every à la carte treatment can be added to any visit when you book.",
        ctaLabel: "Book a treatment",
        ctaHref: "/contact",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.heading",
      blockVersion: 1,
      props: {
        text: "Signature treatments",
        level: "h2",
        align: "center",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.icon-box",
      blockVersion: 1,
      props: {
        icon: "✂️",
        title: "Cut & color",
        description:
          "A full consultation before every color service, precision cuts finished with a proper blowout, and gloss add-ons for guests between full-color visits.",
        layout: "icon-left",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.icon-box",
      blockVersion: 1,
      props: {
        icon: "🧖🏻‍♀️",
        title: "Facials",
        description:
          "Cleansing, exfoliation, extractions where needed, and a mask chosen for your skin that day — never the same routine regardless of season.",
        layout: "icon-left",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.icon-box",
      blockVersion: 1,
      props: {
        icon: "💆🏽",
        title: "Massage",
        description:
          "Swedish, deep tissue, hot stone, and prenatal massage, each timed to 60 or 90 minutes with a warm towel finish and a quiet room after.",
        layout: "icon-left",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.icon-box",
      blockVersion: 1,
      props: {
        icon: "💅🏼",
        title: "Nails",
        description:
          "Manicures and pedicures with a proper hand-and-arm or foot-and-leg massage built in, plus gel and dip options that last past two weeks.",
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
      blockId: "openforge-cms.pricing",
      blockVersion: 1,
      props: {
        planName: "Essential",
        price: "$95",
        features:
          "60-minute cut and blowout, or a 60-minute Swedish massage\nComplimentary scalp or hand treatment\nOrganic product line throughout\nOnline rebooking discount, 5%",
        buttonLabel: "Book Essential",
        buttonHref: "/contact",
        featured: false,
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.pricing",
      blockVersion: 1,
      props: {
        planName: "Signature",
        price: "$165",
        features:
          "90-minute facial and 60-minute massage, or full color and cut\nExtended consultation with your stylist or therapist\nTake-home retail sizes of the products used on you\nComplimentary sparkling tea and a quiet room after\nOnline rebooking discount, 10%",
        buttonLabel: "Book Signature",
        buttonHref: "/contact",
        featured: true,
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.pricing",
      blockVersion: 1,
      props: {
        planName: "Bridal Day",
        price: "From $420",
        features:
          "Trial run plus wedding-day hair and makeup for one guest\n90-minute facial the week of, timed around your schedule\nA dedicated stylist who arrives with you and stays until photos start\nUp to three bridal-party add-ons at a reduced rate\nPrivate room booked for your whole party",
        buttonLabel: "Ask about bridal dates",
        buttonHref: "/contact",
        featured: false,
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.data-table",
      blockVersion: 1,
      props: {
        heading: "À la carte add-ons",
        headers: "Treatment, Duration, Price",
        rows: "Scalp massage|15 min|$25\nGloss treatment|20 min|$35\nExtraction facial add-on|15 min|$30\nHot stone upgrade|+20 min|$40\nPrenatal massage|60 min|$95\nParaffin hand treatment|15 min|$20",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.feature-list",
      blockVersion: 1,
      props: {
        heading: "Every visit includes",
        items:
          "A short consultation before any color, facial, or first-time massage\nWarm towels, filtered water, and a robe for spa services\nOrganic, sulphate-free product lines with no synthetic fragrance\nA five-minute buffer before and after your slot, so nobody feels rushed\nHonest advice if a treatment isn't right for you that week",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.alert",
      blockVersion: 1,
      props: {
        message:
          "We hold every appointment with a card on file and ask for 24 hours' notice to change or cancel. Same-day changes are welcome by phone; we know plans shift.",
        tone: "info",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.accordion",
      blockVersion: 1,
      props: { heading: "Questions about services" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "Can I combine two services in one visit?",
              answer:
                "Yes — most guests booking a Signature package pair a facial with a massage, or a cut with a color gloss. Tell us both services when you book so we can hold enough time.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "Do you carry the products you use?",
              answer:
                "Every organic line used in a treatment is sold at the front desk in retail sizes, so you can keep using what worked at home.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "What if I don't know which stylist to book?",
              answer:
                "Tell us your hair type and what you're hoping for when you book, and we'll match you with whoever on the team specializes in it — no need to guess from photos.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "Is the massage room private?",
              answer:
                "Yes, every massage and facial happens in its own closed room, not a curtained bay. Bridal Day bookings can reserve the whole back room for a party.",
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
        heading: "Not sure which package fits? Ask us first.",
        buttonLabel: "Book a treatment",
        buttonHref: "/contact",
      },
      slots: {},
    },
  ],
};

const gallery = {
  path: "/gallery",
  title: "Gallery",
  blocks: [
    {
      blockId: "openforge-cms.hero",
      blockVersion: 1,
      props: {
        heading: "Inside Petalwood",
        subheading:
          "A look at the six-chair salon floor, the treatment rooms, and a few of the results our stylists and therapists are proudest of.",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.image-gallery",
      blockVersion: 1,
      props: { heading: "The space" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.gallery-item",
            blockVersion: 1,
            props: {
              image: galleryArt("f6dde5"),
              alt: "The six-chair salon floor with soft pink walls and brass fixtures",
              caption: "The salon floor",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.gallery-item",
            blockVersion: 1,
            props: {
              image: galleryArt("f2cdd9"),
              alt: "A private treatment room set up for a facial, with warm towels folded on a cart",
              caption: "A treatment room",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.gallery-item",
            blockVersion: 1,
            props: {
              image: galleryArt("f6dde5"),
              alt: "The massage room with dimmed lighting and a heated table",
              caption: "The massage room",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.gallery-item",
            blockVersion: 1,
            props: {
              image: galleryArt("f2cdd9"),
              alt: "A finished balayage color result under natural window light",
              caption: "A recent balayage",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.gallery-item",
            blockVersion: 1,
            props: {
              image: galleryArt("f6dde5"),
              alt: "The front desk and waiting nook with a small tea station",
              caption: "The front desk",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.gallery-item",
            blockVersion: 1,
            props: {
              image: galleryArt("f2cdd9"),
              alt: "A bridal-party updo finished for a wedding morning",
              caption: "A bridal-day updo",
            },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.rich-text",
      blockVersion: 1,
      props: {
        content:
          "We designed the space to slow you down before a stylist ever picks up a brush: soft light, no overhead music, and a tea station instead of a waiting-room television.\n\nEvery chair and treatment room faces away from the street, so the six-chair floor stays quiet even at its busiest on a Saturday.",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.button",
      blockVersion: 1,
      props: {
        label: "View the treatment menu",
        href: "/services",
        variant: "outline",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.cta",
      blockVersion: 1,
      props: {
        heading: "See it for yourself",
        buttonLabel: "Book a visit",
        buttonHref: "/contact",
      },
      slots: {},
    },
  ],
};

const about = {
  path: "/about",
  title: "About Petalwood",
  blocks: [
    {
      blockId: "openforge-cms.hero",
      blockVersion: 1,
      props: {
        heading: "We built the salon we couldn't find",
        subheading:
          "Petalwood opened in 2015 because our founder, a colorist, kept hearing the same complaint from her own clients: rushed consultations, a different stylist every visit, and a floor too loud to hear the person next to you.",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.image",
      blockVersion: 1,
      props: {
        src: portraitArt("f2cdd9"),
        alt: "Petalwood's founder standing at the salon's front window",
        caption: "Mireille Duchamp, founder and lead colorist",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.rich-text",
      blockVersion: 1,
      props: {
        content:
          "Mireille trained as a colorist in three salons before opening Petalwood with two chairs and one facial room. The rule she started with is still the one we follow: every guest keeps the same stylist or therapist for as long as they want one, and nobody is double-booked to make a Saturday schedule work.\n\nWe grew slowly on purpose. Six chairs is enough to keep the floor calm and still small enough that the person greeting you at the door knows your name before you say it.",
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
            props: { value: "6", label: "stylists and therapists" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "11", label: "years on Petalwood Lane" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "3", label: "treatment rooms" },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.timeline",
      blockVersion: 1,
      props: { heading: "How we grew" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "2015",
              title: "Two chairs, one facial room",
              description:
                "Mireille opens Petalwood on Petalwood Lane with a single esthetician and a client list carried over by word of mouth.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "2018",
              title: "The massage room",
              description:
                "A dedicated, soundproofed massage room opens after guests kept asking where they could lie down after a long facial.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "2021",
              title: "Six chairs, full team",
              description:
                "The salon floor expands to six chairs and the current team of stylists and therapists joins, each staying on past their first year.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "2026",
              title: "Bridal Day packages",
              description:
                "A dedicated bridal-party program launches, with a private back room reserved on wedding mornings.",
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
        text: "Meet the team",
        level: "h2",
        align: "left",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.team-member",
      blockVersion: 1,
      props: {
        name: "Mireille Duchamp",
        role: "Founder & Lead Colorist",
        bio: "Trained in three salons over nine years before opening Petalwood. Specializes in balayage and color correction for guests other salons have turned away.",
        photo: avatarArt("f2cdd9"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.team-member",
      blockVersion: 1,
      props: {
        name: "Amina Cissé",
        role: "Senior Esthetician",
        bio: "Runs Petalwood's facial and skincare program. Trained in medical-grade extractions and builds a home routine into every treatment plan.",
        photo: avatarArt("f6dde5"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.team-member",
      blockVersion: 1,
      props: {
        name: "Jonah Whitfield",
        role: "Massage Therapist",
        bio: "Licensed in Swedish, deep tissue, and prenatal massage. Known for a firm hand and for finishing every session exactly on time.",
        photo: avatarArt("f2cdd9"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.cta",
      blockVersion: 1,
      props: {
        heading: "Come meet the team in person",
        buttonLabel: "Book your visit",
        buttonHref: "/contact",
      },
      slots: {},
    },
  ],
};

const contact = {
  path: "/contact",
  title: "Book your visit",
  blocks: [
    {
      blockId: "openforge-cms.hero",
      blockVersion: 1,
      props: {
        heading: "Book your visit",
        subheading:
          "Call, email, or send the form below with a day and time that works and the treatment you're after. We reply the same business day, usually within the hour.",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.location-card",
      blockVersion: 1,
      props: {
        name: "Petalwood Spa & Salon",
        address: "214 Petalwood Lane\nSuite 2\nAshford Mills, ME 04101",
        hours:
          "Tue-Fri: 10am-7pm\nSat: 9am-5pm\nSun-Mon: Closed",
        phone: "+1 (207) 555-0148",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.contact-form",
      blockVersion: 1,
      props: {
        heading: "Send us a message",
        body: "Tell us the treatment you're interested in and a day or two that could work — we'll confirm an exact time by email.",
        action: "#booking",
        submitLabel: "Request an appointment",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.social-links",
      blockVersion: 1,
      props: { label: "Follow Petalwood" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.social-link-item",
            blockVersion: 1,
            props: {
              platform: "instagram",
              href: "https://instagram.com/petalwoodspa",
              label: "Follow Petalwood on Instagram",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.social-link-item",
            blockVersion: 1,
            props: {
              platform: "facebook",
              href: "https://facebook.com/petalwoodspa",
              label: "Follow Petalwood on Facebook",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.social-link-item",
            blockVersion: 1,
            props: {
              platform: "tiktok",
              href: "https://tiktok.com/@petalwoodspa",
              label: "Follow Petalwood on TikTok",
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
          "Walk-ins are welcome for a wash and blowout when a chair is free, but every other service books ahead — we keep the floor unrushed by never overbooking a slot.",
        tone: "info",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.accordion",
      blockVersion: 1,
      props: { heading: "Before you book" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "How far ahead should I book?",
              answer:
                "One to two weeks for most services, and four to six weeks for a first-time color appointment or a Bridal Day date. Massage and facials often have same-week openings.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "What is the cancellation policy?",
              answer:
                "We ask for 24 hours' notice to reschedule or cancel without a fee. Life happens — call us and we'll always try to find a way to move your appointment instead.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "Is there parking on Petalwood Lane?",
              answer:
                "Free parking is available directly behind the building, with the entrance marked on the map above. Street parking on Petalwood Lane itself is metered until 6pm.",
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
        heading: "We'll have a chair ready",
        buttonLabel: "Call the front desk",
        buttonHref: "tel:+12075550148",
      },
      slots: {},
    },
  ],
};

export const exampleSite = [home, services, gallery, about, contact];
