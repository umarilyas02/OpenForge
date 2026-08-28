function block(blockId, props, slots) {
  return { blockId, blockVersion: 1, props, slots: slots ?? {} };
}

const hero = (props) => block("openforge-cms.hero", props);
const richText = (content) => block("openforge-cms.rich-text", { content });
const cta = (props) => block("openforge-cms.cta", props);
const columns = (heading, items) =>
  block("openforge-cms.columns", { heading }, { items });

/**
 * Starter block trees for new content. Each factory produces a fully valid
 * tree using the six existing cms-blocks — no new block types needed. The
 * "Blank" option always exists and mirrors the previous default (an empty
 * tree).
 */
export const PAGE_TEMPLATES = [
  {
    id: "blank",
    name: "Blank",
    description: "Start with an empty page.",
    build: () => [],
  },
  {
    id: "landing",
    name: "Landing page",
    description: "Hero, a three-column feature row, and a closing CTA.",
    build: () => [
      hero({
        heading: "Your headline goes here",
        subheading: "A short line explaining what this page is about.",
        ctaLabel: "Get started",
        ctaHref: "#",
      }),
      columns("Why choose us", [
        richText("First reason this matters to your reader."),
        richText("Second reason, kept just as short."),
        richText("Third reason, closing the case."),
      ]),
      cta({
        heading: "Ready to get started?",
        buttonLabel: "Get started",
        buttonHref: "#",
      }),
    ],
  },
  {
    id: "about",
    name: "About page",
    description: "Hero and two body paragraphs.",
    build: () => [
      hero({ heading: "About us", subheading: "A short introduction." }),
      richText(
        "Write a few paragraphs about your team, your mission, or your story.",
      ),
      richText("Add a second paragraph, or replace this with an image block."),
    ],
  },
];

export const POST_TEMPLATES = [
  {
    id: "blank",
    name: "Blank",
    description: "Start with an empty post.",
    build: () => [],
  },
  {
    id: "simple-post",
    name: "Simple post",
    description: "Two body paragraphs to get started.",
    build: () => [
      richText("Start writing your post here."),
      richText("Add a second paragraph, or replace this with an image block."),
    ],
  },
];

/**
 * @param {"page" | "post"} type
 */
export function templatesForType(type) {
  return type === "post" ? POST_TEMPLATES : PAGE_TEMPLATES;
}
