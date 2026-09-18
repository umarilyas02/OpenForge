/**
 * A complete example band/musician site for the Music theme, expressed as
 * real content trees (`{ blockId, blockVersion, props, slots }`) built from
 * the official CMS block set. Every block instance below supplies each of
 * its block's required editable fields, so the whole site parses, validates,
 * and renders without a single missing prop.
 *
 * The fictional act is "Neon Requiem", a dark electro-rock band on the
 * independent label Requiem Sound.
 */

/**
 * A tiny inline SVG placeholder, used wherever the example site needs a
 * real image URL (logos, avatars, album art, photos). Kept as a data URI so
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
  title: "Neon Requiem — dark electro-rock, out of Denver",
  blocks: [
    {
      blockId: "openforge-cms.banner",
      blockVersion: 1,
      props: {
        message:
          "Neon Requiem's new EP \"Static Bloom\" is out now — the 2027 Static Bloom Tour goes on sale this Friday.",
        ctaLabel: "Get tour tickets",
        ctaHref: "/tour",
        tone: "brand",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.hero",
      blockVersion: 1,
      props: {
        heading: "Four amps. One heartbeat. Total static.",
        subheading:
          "Neon Requiem turns a blacked-out room into a wall of neon and noise — dark electro-rock built for the front row and the back of the pit alike.",
        ctaLabel: "Get tour tickets",
        ctaHref: "/tour",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.badge",
      blockVersion: 1,
      props: { text: "New single — \"Static Bloom\" streaming now", tone: "accent" },
      slots: {},
    },
    {
      blockId: "openforge-cms.marquee-text",
      blockVersion: 1,
      props: {
        text: "STATIC BLOOM TOUR 2027 — ON SALE FRIDAY — NEW EP OUT NOW — MERCH RESTOCKED",
        speed: "normal",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.logo-cloud",
      blockVersion: 1,
      props: { heading: "As heard on" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("e93cf0"), name: "Wax & Wire" },
            slots: {},
          },
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("c026d3"), name: "Nightshift Magazine" },
            slots: {},
          },
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("e93cf0"), name: "The Static Room" },
            slots: {},
          },
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("c026d3"), name: "Aftershow Weekly" },
            slots: {},
          },
          {
            blockId: "openforge-cms.logo-item",
            blockVersion: 1,
            props: { image: logoArt("e93cf0"), name: "Loud & Low" },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.stats-row",
      blockVersion: 1,
      props: { heading: "Six years, one van, no signs of slowing down" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "142", label: "shows played" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "19", label: "countries toured" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "38M", label: "streams and counting" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "6", label: "years as a band" },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.gradient-heading",
      blockVersion: 1,
      props: { text: "The Sound", level: "h2", tone: "candy" },
      slots: {},
    },
    {
      blockId: "openforge-cms.icon-box",
      blockVersion: 1,
      props: {
        icon: "🔊",
        title: "Built for a wall of amps",
        description:
          "Every show is loud on purpose. We would rather you feel it in your chest than read the lyrics off a screen.",
        layout: "icon-left",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.icon-box",
      blockVersion: 1,
      props: {
        icon: "🎛️",
        title: "Real drums, analog synths",
        description:
          "No backing tracks, no click track you can hear. What you get on stage is what four people can actually play at once.",
        layout: "icon-left",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.icon-box",
      blockVersion: 1,
      props: {
        icon: "🖤",
        title: "A community, not a mailing list",
        description:
          "The front row knows the words because we taught them the words. Come early, stay for the merch line, we're usually behind the table ourselves.",
        layout: "icon-left",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.progress",
      blockVersion: 1,
      props: {
        label: "Static Bloom pre-save goal — unlocks a bonus B-side for everyone",
        percent: "80",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.spotlight-card",
      blockVersion: 1,
      props: {
        icon: "🌸",
        title: "Static Bloom (2027)",
        description:
          "Six tracks cut live to tape in a converted garage, then torn apart and rebuilt with synths until nothing sounded safe anymore.",
        tone: "violet",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.spotlight-card",
      blockVersion: 1,
      props: {
        icon: "🌘",
        title: "Afterglow (2024)",
        description:
          "The record that got us off the club circuit and onto festival side stages. Still the one people ask us to open with.",
        tone: "cyan",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.spotlight-card",
      blockVersion: 1,
      props: {
        icon: "🩸",
        title: "Bloodline Radio (2022)",
        description:
          "Our first full-length, recorded in four days because that was all the studio time we could afford. Still the rawest thing we've released.",
        tone: "amber",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.feature-list",
      blockVersion: 1,
      props: {
        heading: "Why fans keep coming back",
        items:
          "Every show is loud, and the setlist actually changes city to city\nMerch is screen-printed in small runs, never a dropship warehouse\nWe answer our own DMs — that's really us, not a label intern\nVinyl gets repressed instead of scalped the moment it sells out\nNo opener drama: every tour, we pick the opener ourselves",
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
      blockId: "openforge-cms.testimonial",
      blockVersion: 1,
      props: {
        quote:
          "The most electric twenty-two minutes of the year. Static Bloom sounds like a band that stopped worrying about being liked.",
        author: "Priya Osei",
        role: "Wax & Wire",
        avatar: avatarArt("d7d3fb"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.testimonial",
      blockVersion: 1,
      props: {
        quote:
          "I have seen Neon Requiem play a basement and a festival main stage in the same year. Same intensity both times. That's rare.",
        author: "Marcus Lindqvist",
        role: "Nightshift Magazine",
        avatar: avatarArt("cfe9f7"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.cta",
      blockVersion: 1,
      props: {
        heading: "Hear it loud before you hear it live",
        buttonLabel: "Stream Static Bloom",
        buttonHref: "/music",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.footer",
      blockVersion: 1,
      props: {
        copyrightText: "© 2026 Neon Requiem / Requiem Sound. All rights reserved.",
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
            props: { content: "Booking: booking@neonrequiem.example" },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.social-links",
      blockVersion: 1,
      props: { label: "Neon Requiem on social media" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.social-link-item",
            blockVersion: 1,
            props: { platform: "instagram", href: "https://instagram.com/neonrequiem" },
            slots: {},
          },
          {
            blockId: "openforge-cms.social-link-item",
            blockVersion: 1,
            props: { platform: "twitter", href: "https://x.com/neonrequiem" },
            slots: {},
          },
          {
            blockId: "openforge-cms.social-link-item",
            blockVersion: 1,
            props: { platform: "youtube", href: "https://youtube.com/@neonrequiem" },
            slots: {},
          },
          {
            blockId: "openforge-cms.social-link-item",
            blockVersion: 1,
            props: { platform: "tiktok", href: "https://tiktok.com/@neonrequiem" },
            slots: {},
          },
          {
            blockId: "openforge-cms.social-link-item",
            blockVersion: 1,
            props: {
              platform: "generic",
              href: "https://music.example/neonrequiem",
              label: "Listen on Spotify",
            },
            slots: {},
          },
        ],
      },
    },
  ],
};

const tour = {
  path: "/tour",
  title: "Tour Dates",
  blocks: [
    {
      blockId: "openforge-cms.breadcrumbs",
      blockVersion: 1,
      props: { items: "Home|/\nTour" },
      slots: {},
    },
    {
      blockId: "openforge-cms.hero",
      blockVersion: 1,
      props: {
        heading: "The Static Bloom Tour — 2027",
        subheading:
          "Twenty-six cities, one wall of amps. VIP packages include the soundcheck and a numbered tour poster you can't buy anywhere else.",
        ctaLabel: "See VIP packages",
        ctaHref: "/contact",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.countdown-timer",
      blockVersion: 1,
      props: {
        heading: "Tour kicks off in",
        targetDate: "2027-03-06T02:00:00.000Z",
        expiredMessage: "We're on the road right now!",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.alert",
      blockVersion: 1,
      props: {
        message:
          "General admission is always standing room. VIP packages include early entry, the soundcheck, and a numbered tour poster — while they last.",
        tone: "info",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.data-table",
      blockVersion: 1,
      props: {
        heading: "Upcoming dates",
        headers: "City, Venue, Date, Status",
        rows:
          "Denver, CO|The Ogden Theatre|Mar 6, 2027|On sale\nAustin, TX|Emo's|Mar 10, 2027|On sale\nNew Orleans, LA|The Fillmore|Mar 14, 2027|On sale\nAtlanta, GA|The Tabernacle|Mar 18, 2027|On sale\nBrooklyn, NY|Warsaw|Mar 24, 2027|Selling fast",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.timeline",
      blockVersion: 1,
      props: { heading: "How we got on the road" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "2022",
              title: "The first van tour",
              description:
                "Fourteen dates, a borrowed van, and a trailer that broke down twice. We played to a room of eleven people in Tulsa and meant every second of it.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "2023",
              title: "First sold-out headline show",
              description:
                "The Hi-Dive in Denver, our hometown room, sold out in nine minutes. We still play there every New Year's Eve.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "2024",
              title: "First festival main stage",
              description:
                "A 4pm slot at a mid-size festival that we treated like a headline set. It worked — we got invited back at 8pm the next year.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "2026",
              title: "Arena support slot",
              description:
                "Thirty minutes to win over eleven thousand people who came to see someone else. We'll take those odds again any night.",
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
        name: "The Ogden Theatre — Denver, CO",
        address: "935 E Colfax Ave\nDenver, CO 80218",
        hours: "Doors: 7:00 PM\nShow: 8:30 PM",
        phone: "+1 (303) 555-0142",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.accordion",
      blockVersion: 1,
      props: { heading: "Before you buy a ticket" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "Is this show all ages?",
              answer:
                "Most rooms on this run are all ages with a 16-and-under guardian requirement after 9pm; the exact policy is listed on each venue's own ticket page.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "Is there parking near the venue?",
              answer:
                "Most of these are downtown rooms without a dedicated lot. We recommend arriving by rideshare or checking the venue site for nearby garages.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "Can I get my hand stamped and step out?",
              answer:
                "Yes, every room on this tour allows re-entry with a hand stamp. The merch line moves fastest right before doors and right after the encore.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "What happens if a show is cancelled?",
              answer:
                "Refunds are issued automatically to the card used at checkout within ten business days. We will also post the reason on our social channels.",
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
        heading: "Don't see your city? Get notified first.",
        buttonLabel: "Join the tour list",
        buttonHref: "/contact",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.footer",
      blockVersion: 1,
      props: {
        copyrightText: "© 2026 Neon Requiem / Requiem Sound. All rights reserved.",
      },
      slots: {
        links: [
          {
            blockId: "openforge-cms.rich-text",
            blockVersion: 1,
            props: { content: "Refund Policy" },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.social-links",
      blockVersion: 1,
      props: { label: "Neon Requiem on social media" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.social-link-item",
            blockVersion: 1,
            props: { platform: "instagram", href: "https://instagram.com/neonrequiem" },
            slots: {},
          },
          {
            blockId: "openforge-cms.social-link-item",
            blockVersion: 1,
            props: { platform: "twitter", href: "https://x.com/neonrequiem" },
            slots: {},
          },
        ],
      },
    },
  ],
};

const music = {
  path: "/music",
  title: "Music & Media",
  blocks: [
    {
      blockId: "openforge-cms.hero",
      blockVersion: 1,
      props: {
        heading: "Static Bloom",
        subheading:
          "Six tracks, one long night. Neon Requiem's most direct record yet — cut live to tape, then torn apart and rebuilt with synths.",
        ctaLabel: "Stream now",
        ctaHref: "https://music.example/static-bloom",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.video",
      blockVersion: 1,
      props: {
        videoUrl: "https://videos.neonrequiem.example/embed/static-bloom-official-video",
        caption: "Official video — \"Static Bloom\"",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.image",
      blockVersion: 1,
      props: {
        src: coverArt("c026d3"),
        alt: "Static Bloom album cover: a neon magenta gradient over a black-and-white band photo",
        caption: "Static Bloom — out now",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.rating",
      blockVersion: 1,
      props: {
        value: "5",
        label: "\"The most electric 22 minutes of the year.\" — Wax & Wire",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.tabs",
      blockVersion: 1,
      props: { heading: "Static Bloom", labels: "Tracklist\nCredits\nThe Story", groupId: "static-bloom" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.tab-panel",
            blockVersion: 1,
            props: {
              label: "Tracklist",
              content:
                "1. Static Bloom\n\n2. Bloodline Radio\n\n3. Afterglow (Reprise)\n\n4. Low Light, No Sound\n\n5. Paper Halo\n\n6. Everything Louder",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.tab-panel",
            blockVersion: 1,
            props: {
              label: "Credits",
              content:
                "Written and performed by Neon Requiem.\n\nProduced by Marisol Vance and Dov Ilanit.\n\nRecorded at The Static Room, Denver, CO.\n\nMixed by Theo Kass. Mastered by Aisha Rowntree.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.tab-panel",
            blockVersion: 1,
            props: {
              label: "The Story",
              content:
                "We cut the whole record live in a converted garage over four nights, no clicks, no comping vocals. Everything you hear is one take, then rebuilt with synths after the fact — the noise is real, the gloss is on purpose.",
            },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.columns",
      blockVersion: 1,
      props: { heading: "Where to listen" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.rich-text",
            blockVersion: 1,
            props: {
              content:
                "Spotify\n\nSave Static Bloom to your library and follow us to get the next single the day it drops.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.rich-text",
            blockVersion: 1,
            props: {
              content:
                "Apple Music\n\nLossless and Dolby Atmos mixes of the full record, mastered separately from the streaming version.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.rich-text",
            blockVersion: 1,
            props: {
              content:
                "Bandcamp\n\nBuy the record directly and we keep most of it. Name-your-price downloads of the first two EPs are still up.",
            },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.carousel",
      blockVersion: 1,
      props: { heading: "On the road with Static Bloom" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.carousel-slide",
            blockVersion: 1,
            props: { image: coverArt("e93cf0"), caption: "Load-in, The Ogden Theatre" },
            slots: {},
          },
          {
            blockId: "openforge-cms.carousel-slide",
            blockVersion: 1,
            props: { image: coverArt("c026d3"), caption: "Soundcheck, four hours before doors" },
            slots: {},
          },
          {
            blockId: "openforge-cms.carousel-slide",
            blockVersion: 1,
            props: { image: coverArt("e93cf0"), caption: "First song, house lights still half up" },
            slots: {},
          },
          {
            blockId: "openforge-cms.carousel-slide",
            blockVersion: 1,
            props: { image: coverArt("c026d3"), caption: "Merch table, midnight, still a line" },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.image-gallery",
      blockVersion: 1,
      props: { heading: "Press photos" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.gallery-item",
            blockVersion: 1,
            props: {
              image: coverArt("e93cf0"),
              alt: "Neon Requiem performing under magenta stage lighting",
              caption: "Live at The Ogden Theatre, 2026",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.gallery-item",
            blockVersion: 1,
            props: {
              image: coverArt("c026d3"),
              alt: "Close-up of the band's analog synth rig",
              caption: "The synth rig, mid-set",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.gallery-item",
            blockVersion: 1,
            props: {
              image: coverArt("e93cf0"),
              alt: "Crowd with hands raised at a sold-out show",
              caption: "Sold out, Denver, 2026",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.gallery-item",
            blockVersion: 1,
            props: {
              image: coverArt("c026d3"),
              alt: "Band portrait backstage before a show",
              caption: "Backstage, before doors",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.gallery-item",
            blockVersion: 1,
            props: {
              image: coverArt("e93cf0"),
              alt: "Vinyl pressing of Static Bloom on a turntable",
              caption: "First pressing, side A",
            },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.pricing",
      blockVersion: 1,
      props: {
        planName: "Digital",
        price: "Free with email",
        features:
          "Full six-track download\nLossless FLAC and MP3\nInstant delivery\nJoins the mailing list",
        buttonLabel: "Get the download",
        buttonHref: "/contact",
        featured: false,
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.pricing",
      blockVersion: 1,
      props: {
        planName: "Vinyl LP",
        price: "$32",
        features:
          "180-gram magenta vinyl\nFull-size printed lyric insert\nDigital download included\nShips worldwide",
        buttonLabel: "Order the vinyl",
        buttonHref: "/contact",
        featured: true,
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.pricing",
      blockVersion: 1,
      props: {
        planName: "Deluxe Box",
        price: "$68",
        features:
          "Everything in Vinyl LP\nNumbered art print, signed by the band\nCassette of the four-track demo sessions\nEarly access to tour VIP packages",
        buttonLabel: "Order the box",
        buttonHref: "/contact",
        featured: false,
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.comparison-table",
      blockVersion: 1,
      props: {
        heading: "Compare formats",
        headers: "Feature, Digital, Vinyl LP, Deluxe Box",
        rows:
          "Full album|Included|Included|Included\nPhysical copy|Not included|180g vinyl|180g vinyl\nLyric insert|Not included|Included|Included\nSigned art print|Not included|Not included|Included\nDemo cassette|Not included|Not included|Included",
        featuredColumn: "2",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.card",
      blockVersion: 1,
      props: {
        image: coverArt("e93cf0"),
        title: "Single: \"Bloodline Radio\"",
        description:
          "The song that started it all, still the closer at almost every show. This is the 2026 remaster.",
        linkLabel: "Watch the video",
        linkHref: "/music",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.cta",
      blockVersion: 1,
      props: {
        heading: "Six tracks. One night. Turn it up.",
        buttonLabel: "Stream Static Bloom",
        buttonHref: "https://music.example/static-bloom",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.footer",
      blockVersion: 1,
      props: {
        copyrightText: "© 2026 Neon Requiem / Requiem Sound. All rights reserved.",
      },
      slots: {
        links: [
          {
            blockId: "openforge-cms.rich-text",
            blockVersion: 1,
            props: { content: "Licensing inquiries: sync@neonrequiem.example" },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.social-links",
      blockVersion: 1,
      props: { label: "Neon Requiem on social media" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.social-link-item",
            blockVersion: 1,
            props: { platform: "youtube", href: "https://youtube.com/@neonrequiem" },
            slots: {},
          },
          {
            blockId: "openforge-cms.social-link-item",
            blockVersion: 1,
            props: {
              platform: "generic",
              href: "https://music.example/neonrequiem",
              label: "Listen on Spotify",
            },
            slots: {},
          },
        ],
      },
    },
  ],
};

const about = {
  path: "/about",
  title: "About Neon Requiem",
  blocks: [
    {
      blockId: "openforge-cms.breadcrumbs",
      blockVersion: 1,
      props: { items: "Home|/\nAbout" },
      slots: {},
    },
    {
      blockId: "openforge-cms.hero",
      blockVersion: 1,
      props: {
        heading: "Four friends, a broken PA, and too much reverb",
        subheading:
          "Neon Requiem started in a basement in Denver in 2020 because the four of us couldn't afford separate rehearsal spaces — or separate bands.",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.rich-text",
      blockVersion: 1,
      props: {
        content:
          "We didn't set out to sound like anything in particular. Rae had a broken PA she'd bought off a church that was closing, Dov had a synth he barely knew how to program, and the two of us who could actually play drums and bass showed up because the basement had a space heater.\n\nWhat came out of that basement was loud, a little ugly, and completely honest, and we've spent six years trying not to sand off the parts that made it feel that way. Every record since has been recorded closer to how we actually sound live, not further from it.\n\nWe are still an independent band on our own label, Requiem Sound. We book most of our own shows, answer our own email, and press our own vinyl in runs small enough that we know where most of the copies end up.",
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
            props: { value: "6", label: "years as a band" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "3", label: "studio releases" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "19", label: "countries toured" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stat",
            blockVersion: 1,
            props: { value: "2", label: "vans, both retired with honors" },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.spacer",
      blockVersion: 1,
      props: { size: "lg" },
      slots: {},
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
              date: "2020",
              title: "Formed in a basement",
              description:
                "Four friends, a borrowed PA, and a shared feeling that most of what we were hearing on the radio wasn't loud enough.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "2021",
              title: "Bloodline Radio, self-released",
              description:
                "Recorded in four days because that was all the studio time we could afford. We sold the first pressing out of a car trunk.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "2023",
              title: "First sold-out headline show",
              description:
                "Nine minutes to sell out our hometown room. We still play there every New Year's Eve, same stage, bigger PA.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.timeline-step",
            blockVersion: 1,
            props: {
              date: "2026",
              title: "Static Bloom and an arena support slot",
              description:
                "Our most direct record yet, and thirty minutes in front of eleven thousand people who came to see someone else.",
            },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.heading",
      blockVersion: 1,
      props: { text: "Meet the band", level: "h2", align: "center" },
      slots: {},
    },
    {
      blockId: "openforge-cms.team-member",
      blockVersion: 1,
      props: {
        name: "Rae Solano",
        role: "Vocals, guitar",
        bio: "Writes most of the lyrics on tour buses and voice memos. Owns the broken PA that started the whole thing.",
        photo: avatarArt("e93cf0"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.team-member",
      blockVersion: 1,
      props: {
        name: "Dov Ilanit",
        role: "Synths, production",
        bio: "Produced all three records and still can't read sheet music. Built the touring synth rig out of parts from three broken keyboards.",
        photo: avatarArt("c026d3"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.team-member",
      blockVersion: 1,
      props: {
        name: "Marisol Vance",
        role: "Bass",
        bio: "Runs the label side of Requiem Sound between soundchecks. The reason the vinyl actually ships on time.",
        photo: avatarArt("e93cf0"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.team-member",
      blockVersion: 1,
      props: {
        name: "Theo Kass",
        role: "Drums",
        bio: "Mixed Static Bloom in a spare bedroom. Has played through two broken snares and one broken wrist without missing a show.",
        photo: avatarArt("c026d3"),
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.avatar-group",
      blockVersion: 1,
      props: { caption: "Fifteen crew keep the show on the road" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.avatar-item",
            blockVersion: 1,
            props: { image: avatarArt("d7d3fb"), name: "Nadia Ferro, tour manager" },
            slots: {},
          },
          {
            blockId: "openforge-cms.avatar-item",
            blockVersion: 1,
            props: { image: avatarArt("cfe9f7"), name: "Owen Bright, front-of-house engineer" },
            slots: {},
          },
          {
            blockId: "openforge-cms.avatar-item",
            blockVersion: 1,
            props: { image: avatarArt("fbe6cf"), name: "Sana Devereux, lighting director" },
            slots: {},
          },
          {
            blockId: "openforge-cms.avatar-item",
            blockVersion: 1,
            props: { image: avatarArt("e3f7ea"), name: "Jonah Pryce, merch lead" },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.cta",
      blockVersion: 1,
      props: {
        heading: "Get the next release before anyone else",
        buttonLabel: "Join the mailing list",
        buttonHref: "/contact",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.footer",
      blockVersion: 1,
      props: {
        copyrightText: "© 2026 Neon Requiem / Requiem Sound. All rights reserved.",
      },
      slots: {
        links: [
          {
            blockId: "openforge-cms.rich-text",
            blockVersion: 1,
            props: { content: "Press kit and photos: press@neonrequiem.example" },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.social-links",
      blockVersion: 1,
      props: { label: "Neon Requiem on social media" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.social-link-item",
            blockVersion: 1,
            props: { platform: "instagram", href: "https://instagram.com/neonrequiem" },
            slots: {},
          },
          {
            blockId: "openforge-cms.social-link-item",
            blockVersion: 1,
            props: { platform: "twitter", href: "https://x.com/neonrequiem" },
            slots: {},
          },
        ],
      },
    },
  ],
};

const contact = {
  path: "/contact",
  title: "Contact & Booking",
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
        heading: "Book Neon Requiem",
        subheading:
          "Currently routing the back half of 2027. Send the room capacity, the date, and the city — we'll send back a hold within two business days.",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.badge",
      blockVersion: 1,
      props: { text: "Now booking 2027", tone: "accent" },
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
                "Booking\n\nWrite to booking@neonrequiem.example with the venue, city, date, and room capacity, and we'll reply within two business days.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.rich-text",
            blockVersion: 1,
            props: {
              content:
                "Press and interviews\n\nEmail press@neonrequiem.example for photos, the press kit, or to set up an interview around the tour.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.rich-text",
            blockVersion: 1,
            props: {
              content:
                "Everything else\n\nFan mail, licensing questions, or lost-and-found from a show all go to hello@neonrequiem.example.",
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
        heading: "Send a booking inquiry",
        body: "Tell us the venue, city, date, and capacity. A real person replies — no bots, no forms that vanish into a shared inbox.",
        action: "#booking",
        submitLabel: "Send inquiry",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.location-card",
      blockVersion: 1,
      props: {
        name: "Requiem Sound — Label Office",
        address: "2200 Larimer Street\nSuite 4\nDenver, CO 80205",
        hours: "Mon-Fri: 10am-6pm MT",
        phone: "+1 (720) 555-0118",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.alert",
      blockVersion: 1,
      props: {
        message:
          "Booking inquiries get a response within two business days. Press and interview requests go to press@neonrequiem.example.",
        tone: "info",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.accordion",
      blockVersion: 1,
      props: { heading: "Before you send an inquiry" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "Do you require a deposit?",
              answer:
                "Yes, a 50% deposit against the guarantee is due at signing, with the balance due the night of the show per the contract.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "What's on the technical rider?",
              answer:
                "A standard four-piece backline rider with our own synth rack and in-ear monitoring. The full PDF is attached once we confirm a date.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "Do you sell merch at the venue?",
              answer:
                "Yes, we bring our own merch and staff the table ourselves. We're happy to discuss a standard venue cut in the contract.",
            },
            slots: {},
          },
          {
            blockId: "openforge-cms.faq-item",
            blockVersion: 1,
            props: {
              question: "Will you play all-ages rooms?",
              answer:
                "Whenever possible, yes — most of our own audience is under 21. Let us know the venue's age policy when you reach out.",
            },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.newsletter-signup",
      blockVersion: 1,
      props: {
        heading: "Get tour dates first",
        body: "One email when tickets go on sale near you. Nothing else, and we mean that.",
        action: "#newsletter",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.button",
      blockVersion: 1,
      props: {
        label: "Download the press kit",
        href: "/press-kit.pdf",
        variant: "outline",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.divider",
      blockVersion: 1,
      props: {},
      slots: {},
    },
    {
      blockId: "openforge-cms.cta",
      blockVersion: 1,
      props: {
        heading: "Ready when you are",
        buttonLabel: "Send a booking inquiry",
        buttonHref: "#booking",
      },
      slots: {},
    },
    {
      blockId: "openforge-cms.footer",
      blockVersion: 1,
      props: {
        copyrightText: "© 2026 Neon Requiem / Requiem Sound. All rights reserved.",
      },
      slots: {
        links: [
          {
            blockId: "openforge-cms.rich-text",
            blockVersion: 1,
            props: { content: "General inquiries: hello@neonrequiem.example" },
            slots: {},
          },
        ],
      },
    },
    {
      blockId: "openforge-cms.social-links",
      blockVersion: 1,
      props: { label: "Neon Requiem on social media" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.social-link-item",
            blockVersion: 1,
            props: { platform: "instagram", href: "https://instagram.com/neonrequiem" },
            slots: {},
          },
          {
            blockId: "openforge-cms.social-link-item",
            blockVersion: 1,
            props: { platform: "youtube", href: "https://youtube.com/@neonrequiem" },
            slots: {},
          },
          {
            blockId: "openforge-cms.social-link-item",
            blockVersion: 1,
            props: {
              platform: "generic",
              href: "https://music.example/neonrequiem",
              label: "Listen on Spotify",
            },
            slots: {},
          },
        ],
      },
    },
  ],
};

export const exampleSite = [home, tour, music, about, contact];
