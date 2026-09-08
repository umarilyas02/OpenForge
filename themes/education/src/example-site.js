/**
 * A complete, ready-to-import example site for the Education theme.
 *
 * Every entry in `pages[].blocks` (and `footer`) is a real OpenForge
 * content tree: `{ blockId, blockVersion, props, slots }` nodes that
 * satisfy `@openforge/renderer`'s `parseContentTree` and every block's
 * own required `editableFields`. Import it to seed a demo site, or copy
 * single pages as a starting point.
 *
 * The site is a fictional part-time online school, "Brightfield Academy".
 * All names, quotes, and prices are invented. The copy deliberately
 * describes how the program is structured rather than promising any
 * particular result for any student.
 */

/**
 * A flat placeholder image as a data URI, so the example site renders
 * with no network access and no bundled binaries. Replace `src`/`photo`
 * values with real media when you seed a real site.
 *
 * @param {number} width
 * @param {number} height
 * @param {string} fill Six-digit hex, without the leading `#`.
 */
function swatch(width, height, fill) {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Crect width='${width}' height='${height}' fill='%23${fill}'/%3E%3C/svg%3E`;
}

/**
 * @param {string} blockId
 * @param {Record<string, unknown>} [props]
 * @param {Record<string, object[]>} [slots]
 */
function block(blockId, props = {}, slots = {}) {
  return { blockId, blockVersion: 1, props, slots };
}

const NAVY = "1e3a5f";
const AMBER = "f2a71b";
const SLATE = "334e68";

const homePage = {
  slug: "/",
  title: "Brightfield Academy",
  template: "page",
  description:
    "A part-time, online school for people who already have a job and want data analysis in it.",
  blocks: [
    block("openforge-cms.banner", {
      message: "Applications for the March evening cohort close on 6 March.",
      ctaLabel: "See cohort dates",
      ctaHref: "/enrollment",
      tone: "brand",
    }),
    block("openforge-cms.hero", {
      heading: "Learn to work with data, two evenings a week.",
      subheading:
        "Brightfield Academy teaches practical data analysis to people who already have a job. Twelve weeks per course, live instruction on Tuesday and Thursday evenings, and a mentor who reads the code you actually wrote.",
      ctaLabel: "Browse the four courses",
      ctaHref: "/courses",
    }),
    block(
      "openforge-cms.stats-row",
      { heading: "How the program is put together" },
      {
        items: [
          block("openforge-cms.stat", {
            value: "12 weeks",
            label: "One course, start to finish",
          }),
          block("openforge-cms.stat", {
            value: "6 hours",
            label: "Expected study time per week",
          }),
          block("openforge-cms.stat", {
            value: "2 evenings",
            label: "Live sessions, Tuesday and Thursday",
          }),
          block("openforge-cms.stat", {
            value: "3 projects",
            label: "Built and reviewed in every course",
          }),
        ],
      },
    ),
    block("openforge-cms.image", {
      src: swatch(1200, 600, NAVY),
      alt: "An instructor rewriting a student's query on a shared screen during an evening workshop.",
      caption:
        "Most Tuesday sessions end with an instructor rewriting somebody's query in front of the whole cohort.",
    }),
    block("openforge-cms.heading", {
      text: "What you can do by the end",
      level: "h2",
      align: "left",
    }),
    block("openforge-cms.feature-list", {
      heading: "By the end of a Brightfield course you can:",
      items: [
        "Pull, join, and clean a messy dataset in SQL without waiting on an engineer",
        "Write Python that another analyst can read, run, and hand back with comments",
        "Turn a vague request from a manager into a question that has a measurable answer",
        "Choose a chart because it answers the question, not because it looks impressive",
        "Present an analysis in five slides and defend the numbers when somebody pushes back",
      ].join("\n"),
    }),
    block("openforge-cms.divider", {}),
    block("openforge-cms.heading", {
      text: "How a week actually goes",
      level: "h2",
      align: "left",
    }),
    block(
      "openforge-cms.timeline",
      { heading: "One week in the evening cohort" },
      {
        items: [
          block("openforge-cms.timeline-step", {
            date: "Tuesday, 7-9pm",
            title: "Live workshop",
            description:
              "Two hours with the instructor: roughly forty minutes of new material, then the whole cohort works the same problem while the instructor shares a screen and fixes things in real time.",
          }),
          block("openforge-cms.timeline-step", {
            date: "Wednesday to Thursday",
            title: "Practice set",
            description:
              "Six to eight exercises on the week's topic, done on your own schedule. They are checked automatically, so you find out straight away whether an answer holds up.",
          }),
          block("openforge-cms.timeline-step", {
            date: "Thursday, 7-8pm",
            title: "Office hours",
            description:
              "Optional, informal, and recorded. Bring a broken query, a confusing dataset, or the question you did not want to ask in front of everyone on Tuesday.",
          }),
          block("openforge-cms.timeline-step", {
            date: "Sunday",
            title: "Mentor review",
            description:
              "You push the week's work to the cohort repository and your mentor leaves written comments on it before the next live session.",
          }),
        ],
      },
    ),
    block("openforge-cms.testimonial", {
      quote:
        "I had spent four years avoiding SQL by asking somebody else to run my queries. Eleven weeks in, I was the one being asked. What changed it was having a mentor read my actual code every week instead of grading a quiz.",
      author: "Priya Raghunathan",
      role: "Operations analyst, Data Foundations cohort",
      avatar: swatch(96, 96, SLATE),
    }),
    block("openforge-cms.spacer", { size: "lg" }),
    block("openforge-cms.cta", {
      heading: "Not sure which course to start with?",
      buttonLabel: "Compare the four courses",
      buttonHref: "/courses",
    }),
  ],
};

const coursesPage = {
  slug: "/courses",
  title: "Courses",
  template: "page",
  description:
    "Four courses, taken in order or on their own. Each runs for twelve weeks on Tuesday and Thursday evenings.",
  blocks: [
    block("openforge-cms.rich-text", {
      content: [
        "Every Brightfield course is twelve weeks long and taught live. Nothing is pre-recorded first and released later: the recording exists because the session happened, not the other way round.",
        "Most people start with Data Foundations, which assumes no programming at all. The other three can be taken in any order once you can write a SELECT with a join and explain what it returns.",
      ].join("\n\n"),
    }),
    block("openforge-cms.heading", {
      text: "The four courses",
      level: "h2",
      align: "left",
    }),
    block("openforge-cms.card", {
      image: swatch(800, 450, NAVY),
      title: "Data Foundations: spreadsheets to SQL",
      description:
        "Where everyone starts. How data is really stored, why a spreadsheet stops coping, and enough SQL to answer a four-part business question in one query you can explain.",
      linkLabel: "Course outline",
      linkHref: "/courses/data-foundations",
    }),
    block("openforge-cms.card", {
      image: swatch(800, 450, SLATE),
      title: "Python for Analysts",
      description:
        "Reading, reshaping, and joining data in Python, with an unusual amount of time spent on writing code a stranger can pick up six months later. Assumes Data Foundations or equivalent SQL.",
      linkLabel: "Course outline",
      linkHref: "/courses/python-for-analysts",
    }),
    block("openforge-cms.card", {
      image: swatch(800, 450, AMBER),
      title: "Visualization and Data Storytelling",
      description:
        "Choosing a chart on purpose, cutting a report down to the questions people actually ask, and presenting a result to a room that is allowed to disagree with you.",
      linkLabel: "Course outline",
      linkHref: "/courses/visualization",
    }),
    block("openforge-cms.card", {
      image: swatch(800, 450, NAVY),
      title: "Applied Statistics for Decisions",
      description:
        "Uncertainty, sampling, and comparison, taught around the question that ends every session: what would change your mind? Assumes Python for Analysts.",
      linkLabel: "Course outline",
      linkHref: "/courses/applied-statistics",
    }),
    block("openforge-cms.heading", {
      text: "Week by week, in Data Foundations",
      level: "h2",
      align: "left",
    }),
    block("openforge-cms.data-table", {
      heading: "Data Foundations syllabus",
      headers: "Weeks, Focus, What you hand in",
      rows: [
        "1-2 | How data is really stored, and why spreadsheets break | A cleaned version of a deliberately broken sales export",
        "3-4 | SELECT, WHERE, ORDER BY, and reading an error message | Twelve queries against the cohort practice database",
        "5-6 | Joins, and what to do when a join doubles your rows | One query answering a four-part business question",
        "7-8 | Grouping, window functions, and honest aggregation | A weekly metrics query with a written explanation",
        "9-10 | Data quality: nulls, duplicates, silent truncation | A short audit of a dataset you bring in yourself",
        "11-12 | Final project and review week | A documented analysis, presented to the cohort",
      ].join("\n"),
    }),
    block("openforge-cms.heading", {
      text: "What you need before week one",
      level: "h2",
      align: "left",
    }),
    block("openforge-cms.feature-list", {
      items: [
        "A laptop you can install free software on - Windows, macOS, and Linux all work",
        "Comfort with a spreadsheet: filtering, sorting, and writing a SUM formula",
        "Six hours a week you can genuinely protect, two of which are the live session",
        "No prior programming experience for Data Foundations - it assumes none",
      ].join("\n"),
    }),
    block("openforge-cms.alert", {
      message:
        "Courses can be taken one at a time. If you already know you want all four, the full-program enrollment costs less than four separate courses and reserves your seat in each cohort.",
      tone: "info",
    }),
    block("openforge-cms.cta", {
      heading: "Ready to pick a cohort date?",
      buttonLabel: "See enrollment options",
      buttonHref: "/enrollment",
    }),
  ],
};

const enrollmentPage = {
  slug: "/enrollment",
  title: "Enrollment and tuition",
  template: "page",
  description:
    "What each option costs, what it includes, and how the application actually works.",
  blocks: [
    block("openforge-cms.rich-text", {
      content: [
        "There are three ways to enroll. They differ in how many courses you take and how much one-to-one mentor time you get, not in the quality of the teaching: everybody sits in the same live sessions.",
        "Prices are per person and include every tool used in the course. Nothing here is billed monthly after you finish.",
      ].join("\n\n"),
    }),
    block("openforge-cms.heading", {
      text: "Three ways to enroll",
      level: "h2",
      align: "left",
    }),
    block("openforge-cms.pricing", {
      planName: "Single Course",
      price: "$490",
      features: [
        "One twelve-week course of your choice",
        "Both live sessions every week, plus the recordings",
        "All practice sets and access to the cohort database",
        "A written mentor review of your final project",
      ].join("\n"),
      buttonLabel: "Enroll in one course",
      buttonHref: "/enrollment/single-course",
      featured: false,
    }),
    block("openforge-cms.pricing", {
      planName: "Full Program",
      price: "$1,690",
      features: [
        "All four courses, taken in order across about a year",
        "Every live session and every recording",
        "Written mentor reviews every week, not only on the final project",
        "A reserved seat in each cohort, so a busy term does not cost you a place",
        "Access to the alumni study room after you finish",
      ].join("\n"),
      buttonLabel: "Enroll in the full program",
      buttonHref: "/enrollment/full-program",
      featured: true,
    }),
    block("openforge-cms.pricing", {
      planName: "Full Program + Mentor Track",
      price: "$2,340",
      features: [
        "Everything in the Full Program",
        "A 45-minute one-to-one with your mentor every two weeks",
        "A portfolio review before you finish the final course",
        "One practice walkthrough of a project you built, start to finish",
      ].join("\n"),
      buttonLabel: "Ask about the mentor track",
      buttonHref: "/enrollment/mentor-track",
      featured: false,
    }),
    block("openforge-cms.alert", {
      message:
        "Tuition can be split into three monthly payments at no extra cost. A set number of partial-tuition places is held for each cohort, and applying for one does not affect whether you are offered a place.",
      tone: "info",
    }),
    block("openforge-cms.heading", {
      text: "What each option includes",
      level: "h2",
      align: "left",
    }),
    block("openforge-cms.data-table", {
      heading: "Side by side",
      headers: "What you get, Single Course, Full Program, Mentor Track",
      rows: [
        "Live evening sessions | Yes | Yes | Yes",
        "Session recordings | Yes | Yes | Yes",
        "Practice sets and cohort database | Yes | Yes | Yes",
        "Written mentor review | Final project only | Every week | Every week",
        "One-to-one mentor sessions | No | No | Every two weeks",
        "Reserved seat in later cohorts | No | Yes | Yes",
        "Alumni study room | No | Yes | Yes",
      ].join("\n"),
    }),
    block("openforge-cms.heading", {
      text: "How enrolling works",
      level: "h2",
      align: "left",
    }),
    block(
      "openforge-cms.timeline",
      { heading: "Four steps, about two weeks end to end" },
      {
        items: [
          block("openforge-cms.timeline-step", {
            date: "Step 1",
            title: "Send the short application",
            description:
              "Ten minutes. We ask what you work on now, what you want to be able to do, and how much time you can realistically protect each week.",
          }),
          block("openforge-cms.timeline-step", {
            date: "Step 2",
            title: "A twenty-minute call",
            description:
              "Not an interview. We check that the course you picked is the right starting point and that two fixed evenings actually fit your week.",
          }),
          block("openforge-cms.timeline-step", {
            date: "Step 3",
            title: "Offer and deposit",
            description:
              "If it fits, you get a place and a payment plan. A deposit holds the seat and the balance is due before week one.",
          }),
          block("openforge-cms.timeline-step", {
            date: "Step 4",
            title: "Onboarding week",
            description:
              "You install the tools, join the cohort space, and work through one warm-up exercise so that nobody spends the first live session installing things.",
          }),
        ],
      },
    ),
    block("openforge-cms.cta", {
      heading: "Applications for the March cohort are open.",
      buttonLabel: "Start an application",
      buttonHref: "/enrollment/apply",
    }),
  ],
};

const instructorsPage = {
  slug: "/instructors",
  title: "Instructors and mentors",
  template: "page",
  description:
    "Four instructors, all still working in the field, teaching one course each.",
  blocks: [
    block("openforge-cms.rich-text", {
      content: [
        "Each course has one instructor who teaches it every cohort, and a small group of mentors who read student work between sessions. Everybody here also does the job they teach, part time, which is why the examples in class keep changing.",
      ].join("\n\n"),
    }),
    block("openforge-cms.heading", {
      text: "Who teaches",
      level: "h2",
      align: "left",
    }),
    block("openforge-cms.team-member", {
      name: "Amara Osei",
      role: "Lead instructor, Data Foundations",
      bio: "Amara spent nine years as an analyst in public health before teaching. She built the cohort practice database and rewrites a chunk of it every year, on the grounds that real data is never as tidy as last year's data.",
      photo: swatch(320, 320, NAVY),
    }),
    block("openforge-cms.team-member", {
      name: "Tomas Beltran",
      role: "Instructor, Python for Analysts",
      bio: "Tomas came to teaching after a decade of maintaining other people's data pipelines, which is why his first session is about writing code that a stranger can pick up six months later.",
      photo: swatch(320, 320, SLATE),
    }),
    block("openforge-cms.team-member", {
      name: "Rina Okafor",
      role: "Instructor, Visualization and Data Storytelling",
      bio: "Rina works as a design lead and teaches the visualization course on Tuesday evenings. Her standing rule is that a chart has to survive being explained out loud in one sentence.",
      photo: swatch(320, 320, AMBER),
    }),
    block("openforge-cms.team-member", {
      name: "Jonas Widmark",
      role: "Instructor, Applied Statistics for Decisions",
      bio: "Jonas teaches the statistics course and spends most of it arguing against false precision. He is the reason every final project has to state what evidence would change the author's mind.",
      photo: swatch(320, 320, NAVY),
    }),
    block("openforge-cms.heading", {
      text: "How mentoring works",
      level: "h2",
      align: "left",
    }),
    block("openforge-cms.feature-list", {
      items: [
        "You get one mentor for the whole twelve weeks, not a rotating support queue",
        "Mentors read the code you actually wrote and leave written comments on it",
        "Comments are about the reasoning as much as the syntax: why this join, why this cut-off",
        "Office hours are optional and recorded, so missing one costs you nothing",
        "Mentors are working analysts, engineers, and designers who teach part time",
      ].join("\n"),
    }),
    block("openforge-cms.rich-text", {
      content: [
        "We take on two or three new mentors a year, usually from among people who finished the full program and kept turning up to office hours to help. If that sounds like you, write to us and describe a piece of work you would be comfortable reviewing.",
      ].join("\n\n"),
    }),
    block("openforge-cms.cta", {
      heading: "Want to meet an instructor before you commit?",
      buttonLabel: "Book a twenty-minute call",
      buttonHref: "/enrollment/apply",
    }),
  ],
};

const storiesPage = {
  slug: "/student-stories",
  title: "Student stories",
  template: "page",
  description:
    "What four students set out to do, what they found hard, and what they built.",
  blocks: [
    block("openforge-cms.rich-text", {
      content: [
        "The most useful thing former students tell us is not what the course did for their career. It is which week nearly broke them and what got them through it. So that is what we ask about.",
      ].join("\n\n"),
    }),
    block("openforge-cms.alert", {
      message:
        "These are individual experiences, shared with permission. They describe what particular people built and learned. They are not a prediction of any result for anyone else, and no course here promises one.",
      tone: "info",
    }),
    block("openforge-cms.testimonial", {
      quote:
        "I do not have a degree and I was sure that would show up in week one. It did not. What showed up was that I already knew which questions mattered on our floor, I just could not get the numbers out. Now I can.",
      author: "Marcus Delacroix-Hale",
      role: "Warehouse team lead, Data Foundations",
      avatar: swatch(96, 96, NAVY),
    }),
    block("openforge-cms.testimonial", {
      quote:
        "My mentor's comments were the whole thing. She would not accept 'it works' as a reason. Every week I got back a paragraph about why my code would be painful for the next person, and by the end I was writing it that way without being told.",
      author: "Yuki Tanabe",
      role: "Product manager, Python for Analysts",
      avatar: swatch(96, 96, SLATE),
    }),
    block("openforge-cms.testimonial", {
      quote:
        "Our annual report used to be eleven charts nobody read. I rebuilt it as three, each answering a question a trustee had actually asked out loud. An entire Tuesday evening of the course is spent on exactly that idea.",
      author: "Hannah Volkov",
      role: "Fundraising coordinator, Visualization and Data Storytelling",
      avatar: swatch(96, 96, AMBER),
    }),
    block("openforge-cms.testimonial", {
      quote:
        "I could already write the code. What I could not do was say how confident I was in the answer. The statistics course is twelve weeks of being asked what would change your mind, which is uncomfortable and extremely useful.",
      author: "Sam Iwu",
      role: "Junior developer, Applied Statistics for Decisions",
      avatar: swatch(96, 96, NAVY),
    }),
    block("openforge-cms.heading", {
      text: "What people built",
      level: "h2",
      align: "left",
    }),
    block("openforge-cms.card", {
      image: swatch(800, 450, SLATE),
      title: "A restocking flag for a 40-person warehouse",
      description:
        "A Data Foundations final project: one query that flags items likely to run out before the next delivery, with a one-page write-up of every assumption behind it.",
    }),
    block("openforge-cms.card", {
      image: swatch(800, 450, AMBER),
      title: "Three charts instead of eleven",
      description:
        "A rebuilt annual supporter report for a small charity, cut down to the three questions trustees kept asking, with the discarded charts documented so nobody quietly adds them back next year.",
    }),
    block("openforge-cms.card", {
      image: swatch(800, 450, NAVY),
      title: "A weekly report that runs itself",
      description:
        "A Python project that turns four exports into one weekly summary, with tests, a README, and setup instructions written for whoever inherits it.",
    }),
    block(
      "openforge-cms.columns",
      { heading: "The parts students say are hardest" },
      {
        items: [
          block("openforge-cms.rich-text", {
            content: [
              "Week five",
              "Joins arrive, and with them the first result that is confidently, silently wrong. Almost everyone hits it. The fix is not cleverness, it is learning to count rows before and after.",
            ].join("\n\n"),
          }),
          block("openforge-cms.rich-text", {
            content: [
              "The middle stretch",
              "Weeks seven and eight are when the novelty has gone and the final project has not started. Mentors deliberately schedule a smaller practice set here, and office hours get busier.",
            ].join("\n\n"),
          }),
          block("openforge-cms.rich-text", {
            content: [
              "The final presentation",
              "Five slides, ten minutes, and a cohort that is encouraged to disagree with you. Most people say afterwards that this was the part that actually changed how they work.",
            ].join("\n\n"),
          }),
        ],
      },
    ),
    block("openforge-cms.cta", {
      heading: "Want to talk to a former student?",
      buttonLabel: "Ask us for an introduction",
      buttonHref: "/questions",
    }),
  ],
};

const questionsPage = {
  slug: "/questions",
  title: "Questions and contact",
  template: "page",
  description: "The eight things people ask before applying, answered plainly.",
  blocks: [
    block("openforge-cms.rich-text", {
      content: [
        "If the answer you need is not here, write to us. We would rather spend twenty minutes telling you this is not the right fit than take a deposit from somebody who will be miserable in week three.",
      ].join("\n\n"),
    }),
    block(
      "openforge-cms.accordion",
      { heading: "Before you apply" },
      {
        items: [
          block("openforge-cms.faq-item", {
            question: "Do I need to know how to code?",
            answer:
              "Not for Data Foundations. It assumes none, and the first weeks are SQL rather than a programming language. Python for Analysts assumes you have finished Data Foundations, or that you can already write a SELECT with a join and explain what it returns.",
          }),
          block("openforge-cms.faq-item", {
            question: "How much time does it really take?",
            answer:
              "Six hours a week, two of which are the Tuesday live session. Thursday office hours are an optional extra hour. People who fall behind have usually protected the live sessions but not the practice time.",
          }),
          block("openforge-cms.faq-item", {
            question: "What happens if I miss a live session?",
            answer:
              "Every session is recorded and posted within a day, and the practice set never depends on having been there live. If you miss more than three in one course, your mentor will suggest moving to the next cohort, and your seat carries over.",
          }),
          block("openforge-cms.faq-item", {
            question: "Can I pause or move cohorts?",
            answer:
              "Yes, once per course, up to the end of week six. Full Program students keep their reserved seat in the following cohort at no extra cost.",
          }),
          block("openforge-cms.faq-item", {
            question: "Is this accredited?",
            answer:
              "No. Brightfield is not a degree-granting institution and does not award academic credit. What you leave with is a documented set of projects and the written mentor comments on them.",
          }),
          block("openforge-cms.faq-item", {
            question: "Do you help with job hunting?",
            answer:
              "We do not place students and we do not promise outcomes. The Mentor Track includes a portfolio review and one practice walkthrough of a project you built, which is preparation, not a placement service.",
          }),
          block("openforge-cms.faq-item", {
            question: "What software do I need to buy?",
            answer:
              "None. Everything used across the four courses is free and open source, and the cohort practice database is hosted for you.",
          }),
          block("openforge-cms.faq-item", {
            question: "Are there partial-tuition places?",
            answer:
              "A set number is held for each cohort. They are decided on circumstances rather than a test, and applying for one has no effect on whether you are offered a place.",
          }),
        ],
      },
    ),
    block("openforge-cms.divider", {}),
    block("openforge-cms.heading", {
      text: "Still not answered?",
      level: "h2",
      align: "left",
    }),
    block("openforge-cms.rich-text", {
      content: [
        "Email admissions@brightfield.example and a person will reply, usually within two working days. Tell us which course you are looking at and what you are hoping to be able to do afterwards, and the reply will be a lot more useful.",
        "If you would rather talk it through, book the twenty-minute call. It is the same call every applicant has, and it is not an interview.",
      ].join("\n\n"),
    }),
    block("openforge-cms.button", {
      label: "Email the admissions team",
      href: "mailto:admissions@brightfield.example",
      variant: "primary",
    }),
    block("openforge-cms.button", {
      label: "Book a twenty-minute call",
      href: "/enrollment/apply",
      variant: "outline",
    }),
    block("openforge-cms.cta", {
      heading: "Applications for the March cohort close on 6 March.",
      buttonLabel: "Start an application",
      buttonHref: "/enrollment/apply",
    }),
  ],
};

/** The site-wide footer, rendered into the theme's `footer` region. */
export const exampleFooter = [
  block(
    "openforge-cms.footer",
    {
      copyrightText:
        "Brightfield Academy - an example site shipped with the OpenForge Education theme.",
    },
    {
      links: [
        block("openforge-cms.rich-text", { content: "Courses" }),
        block("openforge-cms.rich-text", { content: "Enrollment" }),
        block("openforge-cms.rich-text", { content: "Instructors" }),
        block("openforge-cms.rich-text", { content: "Student stories" }),
        block("openforge-cms.rich-text", { content: "Questions" }),
      ],
    },
  ),
];

export const exampleSite = {
  name: "Brightfield Academy",
  themeId: "openforge-theme.education",
  description:
    "A six-page example site for a fictional part-time online school, demonstrating the Education theme end to end.",
  pages: [
    homePage,
    coursesPage,
    enrollmentPage,
    instructorsPage,
    storiesPage,
    questionsPage,
  ],
  footer: exampleFooter,
};
