/**
 * A complete, ready-to-import example site for the Healthcare theme.
 *
 * Every page's `blocks` array is a real OpenForge content tree: an array of
 * `{ blockId, blockVersion, props, slots }` nodes that satisfies
 * `parseContentTree()` from `@openforge/renderer` and every block's own
 * required props. The content describes a fictional family medicine
 * practice — Northbridge Family Health — and deliberately avoids clinical
 * claims, diagnoses, treatment advice, and outcome promises. Copy is
 * logistical (hours, insurance, what to bring, how booking works), which is
 * what a real clinic site mostly needs to say.
 */

const swatch = (width, height, hex) =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Crect width='${width}' height='${height}' fill='%23${hex}'/%3E%3C/svg%3E`;

const PORTRAIT = swatch(320, 320, "d6e9e5");
const SCENE = swatch(960, 540, "e4f1ee");
const LOGO = swatch(180, 60, "e9f2f0");

const node = (blockId, props = {}, slots = {}) => ({
  blockId,
  blockVersion: 1,
  props,
  slots,
});

const EMERGENCY_NOTICE =
  "This site is not monitored for urgent concerns. If you think you are having a medical emergency, call your local emergency number or go to the nearest emergency department.";

/* ------------------------------------------------------------------ */
/* Home                                                                */
/* ------------------------------------------------------------------ */

const homePage = {
  slug: "/",
  title: "Northbridge Family Health",
  template: "page",
  description:
    "A family medicine practice in Northbridge caring for newborns through older adults, with same-week appointments and an on-site lab.",
  blocks: [
    node("openforge-cms.banner", {
      message:
        "Saturday morning vaccination clinics run through the end of March — no appointment needed for established patients.",
      ctaLabel: "See clinic hours",
      ctaHref: "/appointments",
      tone: "brand",
    }),
    node("openforge-cms.hero", {
      heading: "Everyday family care, close to home",
      subheading:
        "Northbridge Family Health is a five-clinician family medicine practice. We handle checkups, ongoing conditions, school and sports forms, and the small worries in between — with the same care team each visit whenever scheduling allows.",
      ctaLabel: "Request an appointment",
      ctaHref: "/appointments",
    }),
    node("openforge-cms.alert", {
      message: EMERGENCY_NOTICE,
      tone: "warning",
    }),
    node(
      "openforge-cms.stats-row",
      { heading: "The practice at a glance" },
      {
        items: [
          node("openforge-cms.stat", {
            value: "5",
            label: "Physicians and nurse practitioners",
          }),
          node("openforge-cms.stat", {
            value: "1998",
            label: "Caring for Northbridge families since",
          }),
          node("openforge-cms.stat", {
            value: "6 days",
            label: "Open each week, including Saturday mornings",
          }),
          node("openforge-cms.stat", {
            value: "1 business day",
            label: "Typical reply to patient portal messages",
          }),
        ],
      },
    ),
    node("openforge-cms.heading", {
      text: "Care for every stage of life",
      level: "h2",
      align: "center",
    }),
    node("openforge-cms.icon-box", {
      icon: "🩺",
      title: "Primary and preventive care",
      description:
        "Annual checkups, routine screenings, and scheduled follow-up for ongoing conditions, coordinated with any specialists you already see.",
      layout: "icon-top",
    }),
    node("openforge-cms.icon-box", {
      icon: "👶",
      title: "Pediatrics and well-child visits",
      description:
        "Newborn visits, growth and development checks, and the school, camp, and sports forms that come with them.",
      layout: "icon-top",
    }),
    node("openforge-cms.icon-box", {
      icon: "🧪",
      title: "On-site lab draws",
      description:
        "Most routine bloodwork ordered by our clinicians is drawn in the building, so you do not need a second trip across town.",
      layout: "icon-top",
    }),
    node("openforge-cms.icon-box", {
      icon: "💬",
      title: "Care coordination",
      description:
        "Our nurses handle referrals, prior authorizations, and records requests, and they will tell you where a request stands if you ask.",
      layout: "icon-top",
    }),
    node("openforge-cms.divider", { style: "solid" }),
    node("openforge-cms.image", {
      src: SCENE,
      alt: "The Northbridge Family Health waiting room, with seating along a window wall",
      caption:
        "Our clinic on Harbor Street — street parking out front, accessible entrance on the north side.",
    }),
    node("openforge-cms.feature-list", {
      heading: "What a first visit looks like",
      items:
        "Arrive fifteen minutes early so the front desk can finish your registration\nBring a photo ID, your insurance card, and a list of current medications\nA nurse reviews your history and the reason for your visit\nYou meet your clinician for a scheduled thirty-minute new-patient appointment\nAny labs ordered that day are drawn on site before you leave\nResults and visit notes are posted to the patient portal when they are ready",
    }),
    node("openforge-cms.heading", {
      text: "What patients tell us",
      level: "h2",
      align: "center",
    }),
    node("openforge-cms.testimonial", {
      quote:
        "Booking online took about two minutes and the front desk called the same afternoon to confirm. The visit started close to on time, which I did not expect.",
      author: "Renata T.",
      role: "Patient since 2021",
      avatar: PORTRAIT,
    }),
    node("openforge-cms.testimonial", {
      quote:
        "Everyone from the front desk to the nurses explained what would happen next and how long it would take. I never had to guess what I was waiting for.",
      author: "Marcus D.",
      role: "Patient since 2019",
      avatar: PORTRAIT,
    }),
    node("openforge-cms.rating", {
      value: "5",
      label: "Front-desk courtesy, from our 2025 patient experience survey",
    }),
    node("openforge-cms.cta", {
      heading: "Taking new patients of all ages",
      buttonLabel: "Request an appointment",
      buttonHref: "/appointments",
    }),
  ],
};

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */

const servicesPage = {
  slug: "/services",
  title: "Services and specialties",
  template: "page",
  description:
    "What our family medicine team handles in clinic, what we coordinate elsewhere, and how long each kind of visit usually takes.",
  blocks: [
    node("openforge-cms.hero", {
      heading: "Services and specialties",
      subheading:
        "Family medicine covers a wide range of everyday care. Here is what we handle in the building, and what we help arrange with partners nearby.",
      ctaLabel: "Check availability",
      ctaHref: "/appointments",
    }),
    node("openforge-cms.rich-text", {
      content:
        "Our clinicians are trained in family medicine, which means one practice can follow a household across decades rather than handing you off at every stage of life.\n\nIf something falls outside what we do in clinic, we will say so directly and help you get to the right place instead of scheduling a visit that cannot help you.",
    }),
    node("openforge-cms.heading", {
      text: "Primary care",
      level: "h2",
      align: "left",
    }),
    node("openforge-cms.icon-box", {
      icon: "📋",
      title: "Annual checkups and physicals",
      description:
        "A scheduled review of your history, current medications, and routine screenings, plus employer, school, and sports forms completed during the visit.",
      layout: "icon-left",
    }),
    node("openforge-cms.icon-box", {
      icon: "🔁",
      title: "Ongoing condition follow-up",
      description:
        "Regular scheduled visits for conditions you already manage with a clinician, including medication reviews and coordination with your specialists.",
      layout: "icon-left",
    }),
    node("openforge-cms.icon-box", {
      icon: "📅",
      title: "Same-week sick visits",
      description:
        "Short appointments held open each morning for established patients with a new concern. Call before 10 a.m. for the best chance of a same-day slot.",
      layout: "icon-left",
    }),
    node("openforge-cms.divider", { style: "dashed" }),
    node("openforge-cms.heading", {
      text: "Also available in clinic",
      level: "h2",
      align: "left",
    }),
    node("openforge-cms.feature-list", {
      heading: "In-building services",
      items:
        "Routine lab draws for orders written by our clinicians\nRoutine and seasonal immunizations for children and adults\nTravel visits, scheduled at least six weeks before departure\nWell-child visits from the newborn period through adolescence\nAnnual Medicare wellness visits\nMinor in-office procedures such as suture removal and ear irrigation",
    }),
    node("openforge-cms.data-table", {
      heading: "Typical visit lengths",
      headers: "Visit type, Who it is for, Scheduled length",
      rows: "New patient visit|Anyone joining the practice|30 minutes\nAnnual checkup|Established patients|30 minutes\nFollow-up visit|Established patients|20 minutes\nSame-week sick visit|Established patients|15 minutes\nWell-child visit|Patients under 18|20 minutes\nTravel visit|Established patients|30 minutes",
    }),
    node("openforge-cms.alert", {
      message:
        "We do not provide emergency, urgent after-hours, or inpatient care. For care outside our hours, contact the on-call service listed on our voicemail, or go to the nearest urgent care or emergency department.",
      tone: "info",
    }),
    node(
      "openforge-cms.accordion",
      { heading: "Questions about our services" },
      {
        items: [
          node("openforge-cms.faq-item", {
            question: "Do I need a referral to be seen here?",
            answer:
              "No referral is needed to join the practice or to book with us. Some insurance plans require a referral before you see a specialist we send you to — the front desk will tell you if yours does.",
          }),
          node("openforge-cms.faq-item", {
            question: "Can the whole family be seen at the same practice?",
            answer:
              "Yes. Family medicine covers every age, and we regularly care for several generations of the same household. Each person still needs their own registration and their own appointment.",
          }),
          node("openforge-cms.faq-item", {
            question: "Do you do lab work for outside orders?",
            answer:
              "Our lab draws orders written by our own clinicians. If another practice ordered your labs, ask them which draw sites are in your network.",
          }),
          node("openforge-cms.faq-item", {
            question: "How far ahead should I book a travel visit?",
            answer:
              "At least six weeks before you leave. Some travel immunizations are given in a series, and shorter notice may not leave enough time to finish one.",
          }),
        ],
      },
    ),
    node("openforge-cms.cta", {
      heading: "Not sure which visit you need?",
      buttonLabel: "Call the front desk",
      buttonHref: "tel:+15555550142",
    }),
  ],
};

/* ------------------------------------------------------------------ */
/* Care team                                                           */
/* ------------------------------------------------------------------ */

const careTeamPage = {
  slug: "/care-team",
  title: "Our care team",
  template: "page",
  description:
    "The clinicians, nurses, and front-office staff who make up Northbridge Family Health.",
  blocks: [
    node("openforge-cms.hero", {
      heading: "Our care team",
      subheading:
        "Five clinicians and a support staff of eleven. We schedule you with the same clinician whenever we can, because continuity saves everyone time.",
      ctaLabel: "Request an appointment",
      ctaHref: "/appointments",
    }),
    node("openforge-cms.rich-text", {
      content:
        "Every clinician here practices family medicine, so any of them can see any member of your household. When your usual clinician is away, the colleague covering has access to the same chart and the same notes.\n\nAll of the people below are fictional, and this page exists to show how a clinic team is laid out in this theme.",
    }),
    node("openforge-cms.heading", {
      text: "Clinicians",
      level: "h2",
      align: "left",
    }),
    node("openforge-cms.team-member", {
      name: "Dr. Amara Whitlock",
      role: "Family physician, practice partner",
      bio: "Joined the practice in 2009 and now shares its clinical leadership. Sees patients of all ages and runs the Saturday morning schedule twice a month.",
      photo: PORTRAIT,
    }),
    node("openforge-cms.team-member", {
      name: "Dr. Elias Ferrand",
      role: "Family physician",
      bio: "Works primarily with adult and older-adult patients and coordinates the practice's medication review process with our pharmacy partners.",
      photo: PORTRAIT,
    }),
    node("openforge-cms.team-member", {
      name: "Dr. Priya Raghunathan",
      role: "Family physician",
      bio: "Handles much of the practice's newborn and well-child schedule and is the clinician most families meet at their first pediatric visit.",
      photo: PORTRAIT,
    }),
    node("openforge-cms.team-member", {
      name: "Tomás Delgado, NP",
      role: "Nurse practitioner",
      bio: "Covers same-week sick visits and follow-up appointments, and leads our seasonal vaccination clinics each autumn.",
      photo: PORTRAIT,
    }),
    node("openforge-cms.team-member", {
      name: "Hanne Lindqvist, PA-C",
      role: "Physician associate",
      bio: "Sees established patients for follow-up and minor in-office procedures, and manages our sports and camp physical days each summer.",
      photo: PORTRAIT,
    }),
    node("openforge-cms.divider", { style: "solid" }),
    node("openforge-cms.heading", {
      text: "Support team",
      level: "h2",
      align: "left",
    }),
    node("openforge-cms.card", {
      image: SCENE,
      title: "Nursing team",
      description:
        "Six nurses who room patients, run the on-site lab draws, return portal messages, and chase down referrals and prior authorizations.",
      linkLabel: "How to reach a nurse",
      linkHref: "/patient-information",
    }),
    node("openforge-cms.card", {
      image: SCENE,
      title: "Front office",
      description:
        "Five staff who handle scheduling, registration, insurance verification, records requests, and billing questions.",
      linkLabel: "Insurance and billing",
      linkHref: "/insurance-and-billing",
    }),
    node("openforge-cms.alert", {
      message:
        "New patients are matched with a clinician when they register. If you would like a specific clinician, tell the front desk at booking and we will schedule around their availability.",
      tone: "info",
    }),
    node("openforge-cms.cta", {
      heading: "Ready to pick a clinician?",
      buttonLabel: "Start a new patient request",
      buttonHref: "/appointments",
    }),
  ],
};

/* ------------------------------------------------------------------ */
/* Patient information                                                 */
/* ------------------------------------------------------------------ */

const patientInfoPage = {
  slug: "/patient-information",
  title: "Patient information",
  template: "page",
  description:
    "What to bring, how a visit runs, how to reach a nurse, and how to request your records.",
  blocks: [
    node("openforge-cms.hero", {
      heading: "Patient information",
      subheading:
        "The practical details: what to bring, how a visit runs from check-in to results, and how to reach us between appointments.",
      ctaLabel: "See clinic hours",
      ctaHref: "/appointments",
    }),
    node("openforge-cms.alert", {
      message: EMERGENCY_NOTICE,
      tone: "warning",
    }),
    node("openforge-cms.feature-list", {
      heading: "Bring these to every visit",
      items:
        "A photo ID\nYour current insurance card\nA written list of every medication and supplement you take, with doses\nAny co-payment your plan requires, payable at check-in\nFor a child's visit, the adult who can consent to care\nAny forms you need completed, handed over at check-in rather than at the end",
    }),
    node(
      "openforge-cms.timeline",
      { heading: "How a visit runs" },
      {
        items: [
          node("openforge-cms.timeline-step", {
            date: "15 minutes before",
            title: "Check in at the front desk",
            description:
              "Registration confirms your details and insurance. New patients should arrive earlier, since first-visit paperwork takes longer.",
          }),
          node("openforge-cms.timeline-step", {
            date: "At your appointment time",
            title: "A nurse rooms you",
            description:
              "The nurse records your vitals, reviews your medication list, and asks what you would like to cover today.",
          }),
          node("openforge-cms.timeline-step", {
            date: "During the visit",
            title: "You meet your clinician",
            description:
              "Bring your questions written down. If we run out of time, we will tell you and book the follow-up before you leave.",
          }),
          node("openforge-cms.timeline-step", {
            date: "Before you go",
            title: "Labs, orders, and scheduling",
            description:
              "Any labs ordered that day are drawn on site, and the front desk books your next visit and prints your visit summary.",
          }),
          node("openforge-cms.timeline-step", {
            date: "Afterwards",
            title: "Results in the portal",
            description:
              "Results and visit notes are posted to the patient portal as they come back. A nurse calls you if something needs a conversation.",
          }),
        ],
      },
    ),
    node("openforge-cms.heading", {
      text: "Reaching us between visits",
      level: "h2",
      align: "left",
    }),
    node("openforge-cms.rich-text", {
      content:
        "The patient portal is the fastest way to reach the nursing team for non-urgent questions, prescription refills, and forms. Messages sent during clinic hours are usually answered within one business day.\n\nPrescription refills are quickest when your pharmacy sends the request to us directly. Refills for medications that require a scheduled review are only issued after that visit.\n\nFor anything that cannot wait for a reply, call the front desk during clinic hours rather than sending a message.",
    }),
    node(
      "openforge-cms.accordion",
      { heading: "Frequently asked questions" },
      {
        items: [
          node("openforge-cms.faq-item", {
            question: "How do I get a copy of my records?",
            answer:
              "Submit a written records request to the front office in person or through the patient portal. Routine requests are usually completed within ten business days, and we will tell you if a copying fee applies.",
          }),
          node("openforge-cms.faq-item", {
            question: "Can I bring someone into the appointment with me?",
            answer:
              "Yes. You are welcome to bring a family member, friend, or interpreter of your choosing. Tell the front desk at booking if you would like us to arrange interpretation instead.",
          }),
          node("openforge-cms.faq-item", {
            question: "What if I need to cancel?",
            answer:
              "Call or cancel in the portal at least 24 hours ahead so we can offer the slot to someone else. Repeated same-day cancellations may affect how far ahead you can book.",
          }),
          node("openforge-cms.faq-item", {
            question: "Do you offer video visits?",
            answer:
              "We offer video visits for a limited set of follow-up appointments. The front desk will tell you whether the reason for your visit can be handled that way when you book.",
          }),
          node("openforge-cms.faq-item", {
            question: "Is the clinic accessible?",
            answer:
              "The north entrance is step-free, all exam rooms are on one floor, and there are two accessible parking spaces beside that entrance. Tell us at booking if you need extra time or a specific room.",
          }),
          node("openforge-cms.faq-item", {
            question: "How is my information kept private?",
            answer:
              "Your record is only accessed by staff involved in your care or in handling your account. Our full privacy notice is available at the front desk and in the patient portal.",
          }),
        ],
      },
    ),
    node("openforge-cms.cta", {
      heading: "Still have a question?",
      buttonLabel: "Contact the clinic",
      buttonHref: "/appointments",
    }),
  ],
};

/* ------------------------------------------------------------------ */
/* Appointments and contact                                            */
/* ------------------------------------------------------------------ */

const appointmentsPage = {
  slug: "/appointments",
  title: "Appointments and contact",
  template: "page",
  description:
    "Clinic hours, where to find us, and the four ways to book a visit at Northbridge Family Health.",
  blocks: [
    node("openforge-cms.hero", {
      heading: "Book a visit",
      subheading:
        "Four ways to reach us, one schedule behind all of them. Established patients can book directly in the portal; new patients start with a short request form.",
      ctaLabel: "Call the front desk",
      ctaHref: "tel:+15555550142",
    }),
    node("openforge-cms.alert", {
      message: EMERGENCY_NOTICE,
      tone: "danger",
    }),
    node("openforge-cms.icon-box", {
      icon: "🗓️",
      title: "Book in the patient portal",
      description:
        "Established patients can see real availability and book, reschedule, or cancel without calling. Available at any hour.",
      layout: "icon-left",
    }),
    node("openforge-cms.icon-box", {
      icon: "📞",
      title: "Call the front desk",
      description:
        "Reach us at (555) 555-0142 during clinic hours. Calls before 10 a.m. have the best chance at a same-day sick visit.",
      layout: "icon-left",
    }),
    node("openforge-cms.icon-box", {
      icon: "📝",
      title: "New patient request form",
      description:
        "New to the practice? Send us your details and insurance information and the front desk will call you back within one business day.",
      layout: "icon-left",
    }),
    node("openforge-cms.icon-box", {
      icon: "🚶",
      title: "Stop by",
      description:
        "The front desk can book you in person. Saturday mornings are busiest, so weekday afternoons are the quickest time to walk in with a question.",
      layout: "icon-left",
    }),
    node("openforge-cms.data-table", {
      heading: "Clinic and lab hours",
      headers: "Day, Clinic, On-site lab",
      rows: "Monday|8:00 a.m. – 5:30 p.m.|8:00 a.m. – 4:00 p.m.\nTuesday|8:00 a.m. – 5:30 p.m.|8:00 a.m. – 4:00 p.m.\nWednesday|8:00 a.m. – 7:00 p.m.|8:00 a.m. – 4:00 p.m.\nThursday|8:00 a.m. – 5:30 p.m.|8:00 a.m. – 4:00 p.m.\nFriday|8:00 a.m. – 4:00 p.m.|8:00 a.m. – 2:00 p.m.\nSaturday|8:30 a.m. – 12:30 p.m.|Closed\nSunday|Closed|Closed",
    }),
    node(
      "openforge-cms.columns",
      { heading: "Finding us" },
      {
        items: [
          node("openforge-cms.rich-text", {
            content:
              "Northbridge Family Health\n\n418 Harbor Street, Suite 200, Northbridge\n\nAccessible entrance on the north side of the building, with two accessible parking spaces beside it.",
          }),
          node("openforge-cms.rich-text", {
            content:
              "Front desk: (555) 555-0142\n\nBilling questions: (555) 555-0147\n\nFax for records: (555) 555-0149\n\nParking is free in the Harbor Street lot for the first two hours; the bus stop on Harbor at Fourth is one block away.",
          }),
          node("openforge-cms.cta", {
            heading: "Prefer to do it online?",
            buttonLabel: "Open the patient portal",
            buttonHref: "https://portal.example.com",
          }),
        ],
      },
    ),
    node("openforge-cms.image", {
      src: SCENE,
      alt: "Street view of the Harbor Street entrance to the clinic",
      caption: "The Harbor Street entrance, one block east of the bus stop.",
    }),
    node(
      "openforge-cms.accordion",
      { heading: "Booking questions" },
      {
        items: [
          node("openforge-cms.faq-item", {
            question: "How far ahead should I book a checkup?",
            answer:
              "Annual checkups fill four to six weeks out. Sick visits are held open each morning and are booked the same week.",
          }),
          node("openforge-cms.faq-item", {
            question: "What happens if I am running late?",
            answer:
              "Call us. If you arrive more than ten minutes late we may need to shorten your visit or move it, so that the patients after you are not pushed back.",
          }),
          node("openforge-cms.faq-item", {
            question: "Can I book for my child or a parent I care for?",
            answer:
              "Yes. You can book for a child you have custody of, or for an adult who has authorized you in writing on their record.",
          }),
        ],
      },
    ),
    node("openforge-cms.button", {
      label: "Download our new patient form",
      href: "/forms/new-patient",
      variant: "outline",
    }),
    node("openforge-cms.cta", {
      heading: "New to Northbridge Family Health?",
      buttonLabel: "Send a new patient request",
      buttonHref: "/appointments#new-patient",
    }),
  ],
};

/* ------------------------------------------------------------------ */
/* Insurance and billing                                               */
/* ------------------------------------------------------------------ */

const insurancePage = {
  slug: "/insurance-and-billing",
  title: "Insurance and billing",
  template: "page",
  description:
    "Plans we accept, self-pay visit rates, how billing works after a visit, and who to call about a statement.",
  blocks: [
    node("openforge-cms.hero", {
      heading: "Insurance and billing",
      subheading:
        "What we accept, what a visit costs without insurance, and what to do when a statement does not look right.",
      ctaLabel: "Call the billing office",
      ctaHref: "tel:+15555550147",
    }),
    node("openforge-cms.rich-text", {
      content:
        "Coverage changes every plan year, and the network list below is the one we maintain rather than one your insurer publishes. Please confirm with your plan before your first visit that this practice is in network for your specific policy.\n\nWe verify coverage at check-in. If your plan has changed, tell the front desk before your visit so we can re-verify rather than bill the wrong payer.",
    }),
    node(
      "openforge-cms.logo-cloud",
      { heading: "Plans we currently accept" },
      {
        items: [
          node("openforge-cms.logo-item", {
            image: LOGO,
            name: "Northbridge Regional Health Plan",
          }),
          node("openforge-cms.logo-item", {
            image: LOGO,
            name: "Statewide Choice PPO",
          }),
          node("openforge-cms.logo-item", {
            image: LOGO,
            name: "Harbor Mutual Benefits",
          }),
          node("openforge-cms.logo-item", {
            image: LOGO,
            name: "Cedarline Employee Health",
          }),
          node("openforge-cms.logo-item", {
            image: LOGO,
            name: "Meridian Public Plan",
          }),
        ],
      },
    ),
    node("openforge-cms.alert", {
      message:
        "Every plan name on this page is fictional and shown only to demonstrate this theme. Replace them with the plans your practice actually contracts with before publishing.",
      tone: "info",
    }),
    node("openforge-cms.heading", {
      text: "Paying without insurance",
      level: "h2",
      align: "left",
    }),
    node("openforge-cms.pricing", {
      planName: "Established patient visit",
      price: "$95",
      features:
        "20-minute scheduled visit\nMedication review\nVisit summary in the patient portal\nLab draws billed separately",
      buttonLabel: "Book a visit",
      buttonHref: "/appointments",
      featured: false,
    }),
    node("openforge-cms.pricing", {
      planName: "New patient visit",
      price: "$150",
      features:
        "30-minute first appointment\nFull history and medication review\nClinician match for future visits\nLab draws billed separately",
      buttonLabel: "Start a new patient request",
      buttonHref: "/appointments#new-patient",
      featured: true,
    }),
    node("openforge-cms.pricing", {
      planName: "Annual checkup",
      price: "$180",
      features:
        "30-minute scheduled checkup\nRoutine screening review\nSchool, camp, or employer forms completed\nLab draws billed separately",
      buttonLabel: "Book a checkup",
      buttonHref: "/appointments",
      featured: false,
    }),
    node("openforge-cms.data-table", {
      heading: "What happens after your visit",
      headers: "Step, Who does it, Typical timing",
      rows: "Visit is coded and submitted|Our billing office|Within 3 business days\nPlan processes the claim|Your insurer|2 to 6 weeks\nExplanation of benefits arrives|Your insurer|After processing\nStatement for any balance|Our billing office|After the plan responds\nPayment or payment plan|You, with our billing office|Within 30 days of the statement",
    }),
    node("openforge-cms.feature-list", {
      heading: "Good to know",
      items:
        "Co-payments are collected at check-in, as required by most plans\nWe bill your plan directly when the practice is in network\nLab work is billed separately by the laboratory that processes it\nInterest-free payment plans are available on request from the billing office\nWe can review a statement with you line by line if something looks wrong\nA sliding-scale discount is available for self-pay patients who apply",
    }),
    node(
      "openforge-cms.accordion",
      { heading: "Billing questions" },
      {
        items: [
          node("openforge-cms.faq-item", {
            question: "Why did I get a separate bill from a laboratory?",
            answer:
              "Laboratories bill for their own processing even when the sample was drawn here. That statement comes from them, not from us, and their contact details are on it.",
          }),
          node("openforge-cms.faq-item", {
            question: "My plan denied a claim. What now?",
            answer:
              "Call our billing office at (555) 555-0147. We can confirm how the visit was coded and resubmit if something was recorded incorrectly, and we will tell you if the next step is an appeal with your plan.",
          }),
          node("openforge-cms.faq-item", {
            question: "Can I get an estimate before a visit?",
            answer:
              "Yes. Ask the billing office for a good-faith estimate when you book. Estimates cover the visit itself; anything ordered during the visit is quoted separately.",
          }),
          node("openforge-cms.faq-item", {
            question: "Do you offer payment plans?",
            answer:
              "We do, at no interest, for balances over $100. Call the billing office before your statement's due date to set one up.",
          }),
        ],
      },
    ),
    node("openforge-cms.cta", {
      heading: "Questions about a statement?",
      buttonLabel: "Call the billing office",
      buttonHref: "tel:+15555550147",
    }),
  ],
};

/* ------------------------------------------------------------------ */
/* Site                                                                */
/* ------------------------------------------------------------------ */

export const exampleSite = {
  themeId: "openforge-theme.healthcare",
  name: "Northbridge Family Health",
  tagline: "Family medicine for every stage of life.",
  description:
    "A complete six-page example clinic site for the OpenForge Healthcare theme. Every clinician, plan, and phone number is fictional.",
  navigation: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Care team", href: "/care-team" },
    { label: "Patient info", href: "/patient-information" },
    { label: "Appointments", href: "/appointments" },
    { label: "Insurance", href: "/insurance-and-billing" },
  ],
  pages: [
    homePage,
    servicesPage,
    careTeamPage,
    patientInfoPage,
    appointmentsPage,
    insurancePage,
  ],
  footer: [
    node(
      "openforge-cms.footer",
      {
        copyrightText:
          "© 2026 Northbridge Family Health. A fictional practice used to demonstrate the OpenForge Healthcare theme.",
      },
      {
        links: [
          node("openforge-cms.rich-text", {
            content: "418 Harbor Street, Suite 200, Northbridge",
          }),
          node("openforge-cms.rich-text", {
            content: "Front desk: (555) 555-0142",
          }),
          node("openforge-cms.rich-text", {
            content: "Privacy notice and patient rights",
          }),
          node("openforge-cms.rich-text", {
            content: "Accessibility: step-free entrance on the north side",
          }),
        ],
      },
    ),
  ],
};
