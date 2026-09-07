// Blog listing / article component variants harvested from reference projects.
// Populated by an authoring pass — see README.md for the sourcing process.

export const blogComponents = [
  {
    schemaVersion: 1,
    id: "blog.card-grid",
    name: "Blog Card Grid",
    category: "blog",
    description:
      "Responsive grid of blog cards with a placeholder cover, category tag, excerpt and a published date — a straightforward listing page for a company blog.",
    tags: ["blog", "grid", "cards", "listing", "cover"],
    sourceProject: "FitGrips-Frontend",
    exportName: "BlogCardGrid",
    fileName: "BlogCardGrid.jsx",
    dependencies: [],
    defaultProps: {
      heading: "From the blog",
      subheading: "Guides, updates and stories from the team.",
      posts: [
        {
          id: "post-1",
          title: "Five ways to get more from your morning routine",
          excerpt:
            "Small changes compound. Here is what actually moved the needle for our team this quarter.",
          category: "Guides",
          date: "2026-08-12",
        },
        {
          id: "post-2",
          title: "Behind the scenes of our latest product update",
          excerpt:
            "A look at the decisions, trade-offs and a few dead ends on the way to shipping.",
          category: "Product",
          date: "2026-07-29",
        },
        {
          id: "post-3",
          title: "Why we rebuilt our onboarding from scratch",
          excerpt:
            "Onboarding was quietly costing us new customers. Here is how we found out, and what we changed.",
          category: "Insights",
          date: "2026-07-04",
        },
        {
          id: "post-4",
          title: "A field guide to remote-friendly meetings",
          excerpt:
            "Fewer meetings, better ones. The format we landed on after two years of experiments.",
          category: "Culture",
          date: "2026-06-18",
        },
      ],
    },
    accessibility: [
      "Each post is a semantic <article> with the title marked up as a heading, so screen reader users can navigate the list by heading.",
      "The entire card is wrapped by a single labelled link so keyboard and assistive-technology users get one predictable target per post.",
    ],
    source: `const defaultPosts = [
  {
    id: "post-1",
    title: "Five ways to get more from your morning routine",
    excerpt:
      "Small changes compound. Here is what actually moved the needle for our team this quarter.",
    category: "Guides",
    date: "2026-08-12",
  },
  {
    id: "post-2",
    title: "Behind the scenes of our latest product update",
    excerpt:
      "A look at the decisions, trade-offs and a few dead ends on the way to shipping.",
    category: "Product",
    date: "2026-07-29",
  },
  {
    id: "post-3",
    title: "Why we rebuilt our onboarding from scratch",
    excerpt:
      "Onboarding was quietly costing us new customers. Here is how we found out, and what we changed.",
    category: "Insights",
    date: "2026-07-04",
  },
  {
    id: "post-4",
    title: "A field guide to remote-friendly meetings",
    excerpt:
      "Fewer meetings, better ones. The format we landed on after two years of experiments.",
    category: "Culture",
    date: "2026-06-18",
  },
];

function formatDate(value) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function BlogCardGrid({
  heading = "From the blog",
  subheading = "Guides, updates and stories from the team.",
  posts = defaultPosts,
}) {
  return (
    <section className="ofl-blog-card-grid" aria-labelledby="blog-card-grid-heading">
      <header className="ofl-blog-card-grid__header">
        <h2 className="ofl-blog-card-grid__heading" id="blog-card-grid-heading">
          {heading}
        </h2>
        <p className="ofl-blog-card-grid__subheading">{subheading}</p>
      </header>
      <div className="ofl-blog-card-grid__list">
        {posts.map((post) => (
          <article className="ofl-blog-card-grid__card" key={post.id}>
            <a className="ofl-blog-card-grid__link" href={"#" + post.id} aria-label={post.title}>
              <span className="ofl-blog-card-grid__cover" aria-hidden="true">
                <span className="ofl-blog-card-grid__cover-tag">{post.category}</span>
              </span>
              <div className="ofl-blog-card-grid__body">
                <time className="ofl-blog-card-grid__date" dateTime={post.date}>
                  {formatDate(post.date)}
                </time>
                <h3 className="ofl-blog-card-grid__title">{post.title}</h3>
                <p className="ofl-blog-card-grid__excerpt">{post.excerpt}</p>
                <span className="ofl-blog-card-grid__cta">Read article</span>
              </div>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
`,
    styles: `.ofl-blog-card-grid {
  background: #ffffff;
  box-sizing: border-box;
  color: #171a21;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
  padding: 4rem max(1.5rem, calc((100vw - 72rem) / 2));
}
.ofl-blog-card-grid * { box-sizing: border-box; }
.ofl-blog-card-grid__header { margin-bottom: 2.5rem; max-width: 40rem; }
.ofl-blog-card-grid__heading { font-size: clamp(1.75rem, 3.2vw, 2.5rem); font-weight: 800; letter-spacing: -0.02em; margin: 0 0 0.6rem; }
.ofl-blog-card-grid__subheading { color: #5b6270; font-size: 1.05rem; line-height: 1.6; margin: 0; }
.ofl-blog-card-grid__list { display: grid; gap: 1.75rem; grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr)); }
.ofl-blog-card-grid__card { border-radius: 1.1rem; overflow: hidden; transition: transform 0.18s ease, box-shadow 0.18s ease; }
.ofl-blog-card-grid__card:hover { box-shadow: 0 18px 34px rgba(23, 26, 33, 0.12); transform: translateY(-4px); }
.ofl-blog-card-grid__link { color: inherit; display: block; text-decoration: none; }
.ofl-blog-card-grid__cover {
  background: repeating-linear-gradient(135deg, #eef1f6 0, #eef1f6 12px, #e4e8f0 12px, #e4e8f0 24px);
  border-radius: 1.1rem;
  display: block;
  height: 11rem;
  position: relative;
}
.ofl-blog-card-grid__cover-tag {
  background: #171a21;
  border-radius: 999px;
  color: #ffffff;
  font-size: 0.7rem;
  font-weight: 700;
  left: 0.9rem;
  letter-spacing: 0.04em;
  padding: 0.3rem 0.75rem;
  position: absolute;
  text-transform: uppercase;
  top: 0.9rem;
}
.ofl-blog-card-grid__body { padding: 1.25rem 0.25rem 0; }
.ofl-blog-card-grid__date { color: #8a8f9b; font-size: 0.78rem; font-weight: 600; letter-spacing: 0.02em; text-transform: uppercase; }
.ofl-blog-card-grid__title { font-size: 1.2rem; font-weight: 750; line-height: 1.35; margin: 0.5rem 0 0.55rem; }
.ofl-blog-card-grid__excerpt { color: #565c68; font-size: 0.92rem; line-height: 1.6; margin: 0 0 0.85rem; }
.ofl-blog-card-grid__cta { color: #d1401f; font-size: 0.88rem; font-weight: 700; }
@media (max-width: 640px) {
  .ofl-blog-card-grid { padding-block: 3rem; }
}
`,
  },
  {
    schemaVersion: 1,
    id: "blog.featured-list",
    name: "Featured Post + List",
    category: "blog",
    description:
      "Editorial blog index with one large featured article up top and the rest of the posts below in a compact grid, each byline showing an author and tags.",
    tags: ["blog", "featured", "editorial", "author", "tags"],
    sourceProject: "archtech",
    exportName: "BlogFeaturedList",
    fileName: "BlogFeaturedList.jsx",
    dependencies: [],
    defaultProps: {
      eyebrow: "Instructor-written",
      heading: "Guides, not content marketing",
      featured: {
        id: "featured-post",
        title: "The honest guide to choosing your first design tool",
        excerpt:
          "There is no single right answer, but there is a right answer for where you are today. Here is how to find it without falling down a rabbit hole.",
        author: "Maya Chen",
        date: "2026-08-20",
        readMinutes: 9,
        tags: ["Careers", "Tools"],
      },
      posts: [
        {
          id: "post-1",
          title: "What actually happens in a design critique",
          excerpt: "A walkthrough of a real session, mistakes included.",
          author: "Jon Bell",
          date: "2026-08-05",
          readMinutes: 6,
          tags: ["Process"],
        },
        {
          id: "post-2",
          title: "Reading a brief without missing the point",
          excerpt: "Three questions to ask before you open any tool.",
          author: "Priya Nair",
          date: "2026-07-22",
          readMinutes: 5,
          tags: ["Careers"],
        },
        {
          id: "post-3",
          title: "The case for boring typography",
          excerpt: "Why the safest choice is usually the right one.",
          author: "Sam Osei",
          date: "2026-07-09",
          readMinutes: 4,
          tags: ["Typography"],
        },
      ],
    },
    accessibility: [
      "The featured article and the secondary list both use <article> and a single <h2>/<h3> heading per post, keeping the page's heading outline intact.",
      "Author names use visible text rather than avatar images alone, so attribution never depends on an image loading.",
    ],
    source: `const defaultFeatured = {
  id: "featured-post",
  title: "The honest guide to choosing your first design tool",
  excerpt:
    "There is no single right answer, but there is a right answer for where you are today. Here is how to find it without falling down a rabbit hole.",
  author: "Maya Chen",
  date: "2026-08-20",
  readMinutes: 9,
  tags: ["Careers", "Tools"],
};

const defaultPosts = [
  {
    id: "post-1",
    title: "What actually happens in a design critique",
    excerpt: "A walkthrough of a real session, mistakes included.",
    author: "Jon Bell",
    date: "2026-08-05",
    readMinutes: 6,
    tags: ["Process"],
  },
  {
    id: "post-2",
    title: "Reading a brief without missing the point",
    excerpt: "Three questions to ask before you open any tool.",
    author: "Priya Nair",
    date: "2026-07-22",
    readMinutes: 5,
    tags: ["Careers"],
  },
  {
    id: "post-3",
    title: "The case for boring typography",
    excerpt: "Why the safest choice is usually the right one.",
    author: "Sam Osei",
    date: "2026-07-09",
    readMinutes: 4,
    tags: ["Typography"],
  },
];

function formatDate(value) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function BlogFeaturedList({
  eyebrow = "Instructor-written",
  heading = "Guides, not content marketing",
  featured = defaultFeatured,
  posts = defaultPosts,
}) {
  return (
    <section className="ofl-blog-featured-list" aria-labelledby="blog-featured-list-heading">
      <p className="ofl-blog-featured-list__eyebrow">{eyebrow}</p>
      <h2 className="ofl-blog-featured-list__heading" id="blog-featured-list-heading">
        {heading}
      </h2>

      <article className="ofl-blog-featured-list__featured">
        <span className="ofl-blog-featured-list__featured-cover" aria-hidden="true" />
        <div className="ofl-blog-featured-list__featured-body">
          <div className="ofl-blog-featured-list__meta">
            <time dateTime={featured.date}>{formatDate(featured.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{featured.readMinutes} min read</span>
          </div>
          <h3 className="ofl-blog-featured-list__featured-title">{featured.title}</h3>
          <p className="ofl-blog-featured-list__excerpt">{featured.excerpt}</p>
          <div className="ofl-blog-featured-list__footer">
            <span className="ofl-blog-featured-list__author">{featured.author}</span>
            <div className="ofl-blog-featured-list__tags">
              {featured.tags.map((tag) => (
                <span className="ofl-blog-featured-list__tag" key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </article>

      <ul className="ofl-blog-featured-list__grid" role="list">
        {posts.map((post) => (
          <li key={post.id}>
            <article className="ofl-blog-featured-list__card">
              <span className="ofl-blog-featured-list__cover" aria-hidden="true" />
              <div className="ofl-blog-featured-list__meta">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span aria-hidden="true">·</span>
                <span>{post.readMinutes} min read</span>
              </div>
              <h3 className="ofl-blog-featured-list__title">{post.title}</h3>
              <p className="ofl-blog-featured-list__excerpt">{post.excerpt}</p>
              <div className="ofl-blog-featured-list__footer">
                <span className="ofl-blog-featured-list__author">{post.author}</span>
                <div className="ofl-blog-featured-list__tags">
                  {post.tags.map((tag) => (
                    <span className="ofl-blog-featured-list__tag" key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
`,
    styles: `.ofl-blog-featured-list {
  background: #faf8f4;
  box-sizing: border-box;
  color: #201d18;
  font-family: Georgia, "Times New Roman", serif;
  padding: 4.5rem max(1.5rem, calc((100vw - 74rem) / 2));
}
.ofl-blog-featured-list * { box-sizing: border-box; }
.ofl-blog-featured-list__eyebrow { color: #a3672f; font-family: Arial, sans-serif; font-size: 0.75rem; font-weight: 800; letter-spacing: 0.14em; margin: 0 0 0.6rem; text-transform: uppercase; }
.ofl-blog-featured-list__heading { font-size: clamp(1.9rem, 3.6vw, 2.75rem); line-height: 1.15; margin: 0 0 2.75rem; max-width: 30ch; }
.ofl-blog-featured-list__featured { border-bottom: 1px solid #e3ddd0; display: grid; gap: 2rem; grid-template-columns: 1.1fr 1fr; padding-bottom: 2.75rem; }
.ofl-blog-featured-list__featured-cover { background: linear-gradient(155deg, #ece4d4, #d9cdb3); border-radius: 0.9rem; display: block; min-height: 16rem; }
.ofl-blog-featured-list__featured-body { display: flex; flex-direction: column; justify-content: center; }
.ofl-blog-featured-list__meta { color: #8a7e68; font-family: Arial, sans-serif; display: flex; font-size: 0.78rem; font-weight: 600; gap: 0.5rem; letter-spacing: 0.02em; text-transform: uppercase; }
.ofl-blog-featured-list__featured-title { font-size: clamp(1.4rem, 2.6vw, 2rem); line-height: 1.25; margin: 0.75rem 0 0.9rem; }
.ofl-blog-featured-list__excerpt { color: #4d473c; font-size: 1.02rem; line-height: 1.7; margin: 0 0 1.25rem; }
.ofl-blog-featured-list__footer { align-items: center; display: flex; font-family: Arial, sans-serif; gap: 1rem; justify-content: space-between; }
.ofl-blog-featured-list__author { font-size: 0.88rem; font-weight: 700; }
.ofl-blog-featured-list__tags { display: flex; gap: 0.4rem; }
.ofl-blog-featured-list__tag { border: 1px solid #d9cdb3; border-radius: 999px; color: #6b6255; font-size: 0.72rem; padding: 0.25rem 0.65rem; }
.ofl-blog-featured-list__grid { display: grid; gap: 2rem; grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr)); list-style: none; margin: 2.75rem 0 0; padding: 0; }
.ofl-blog-featured-list__card { display: flex; flex-direction: column; }
.ofl-blog-featured-list__cover { background: linear-gradient(155deg, #ece4d4, #d9cdb3); border-radius: 0.75rem; display: block; min-height: 9rem; margin-bottom: 1rem; }
.ofl-blog-featured-list__title { font-size: 1.1rem; line-height: 1.35; margin: 0.65rem 0 0.5rem; }
.ofl-blog-featured-list__card .ofl-blog-featured-list__excerpt { font-size: 0.92rem; margin-bottom: 1rem; }
@media (max-width: 760px) {
  .ofl-blog-featured-list__featured { grid-template-columns: 1fr; }
}
`,
  },
  {
    schemaVersion: 1,
    id: "blog.scroll-carousel",
    name: "Horizontal Scroll Blog Carousel",
    category: "blog",
    description:
      "A compact, dark banded section that scrolls a row of blog cards horizontally with CSS scroll-snap, plus a heading and a 'view all' action — suited to a homepage teaser rather than a full listing page.",
    tags: ["blog", "carousel", "scroll-snap", "homepage", "teaser"],
    sourceProject: "snpridesports (BlogsSection horizontal-scroll pattern)",
    exportName: "BlogScrollCarousel",
    fileName: "BlogScrollCarousel.jsx",
    dependencies: [],
    defaultProps: {
      eyebrow: "Updates",
      heading: "Read our blogs & research",
      viewAllLabel: "View all",
      posts: [
        { id: "post-1", title: "Choosing the right material for the job", excerpt: "A quick comparison guide for buyers." },
        { id: "post-2", title: "Inside our quality control process", excerpt: "What every order goes through before it ships." },
        { id: "post-3", title: "Three questions to ask any supplier", excerpt: "Save time by asking these up front." },
        { id: "post-4", title: "A year in numbers", excerpt: "What changed for our customers this year." },
        { id: "post-5", title: "Packaging that survives the trip", excerpt: "Lessons learned from returns data." },
      ],
    },
    accessibility: [
      "The scroll container is keyboard-focusable and reachable by Tab, and scroll-snap keeps a card fully in view after each keyboard or swipe scroll.",
      "Reduced-motion users still get instant snapping since scroll-behavior is not forced to smooth for this track.",
    ],
    source: `const defaultPosts = [
  { id: "post-1", title: "Choosing the right material for the job", excerpt: "A quick comparison guide for buyers." },
  { id: "post-2", title: "Inside our quality control process", excerpt: "What every order goes through before it ships." },
  { id: "post-3", title: "Three questions to ask any supplier", excerpt: "Save time by asking these up front." },
  { id: "post-4", title: "A year in numbers", excerpt: "What changed for our customers this year." },
  { id: "post-5", title: "Packaging that survives the trip", excerpt: "Lessons learned from returns data." },
];

export function BlogScrollCarousel({
  eyebrow = "Updates",
  heading = "Read our blogs & research",
  viewAllLabel = "View all",
  posts = defaultPosts,
}) {
  return (
    <section className="ofl-blog-scroll-carousel" aria-labelledby="blog-scroll-carousel-heading">
      <div className="ofl-blog-scroll-carousel__header">
        <div>
          <p className="ofl-blog-scroll-carousel__eyebrow">{eyebrow}</p>
          <h2 className="ofl-blog-scroll-carousel__heading" id="blog-scroll-carousel-heading">
            {heading}
          </h2>
        </div>
        <a className="ofl-blog-scroll-carousel__view-all" href="#blog">
          {viewAllLabel}
        </a>
      </div>
      <ul className="ofl-blog-scroll-carousel__track" role="list">
        {posts.map((post) => (
          <li className="ofl-blog-scroll-carousel__item" key={post.id}>
            <a className="ofl-blog-scroll-carousel__card" href={"#" + post.id}>
              <span className="ofl-blog-scroll-carousel__cover" aria-hidden="true" />
              <h3 className="ofl-blog-scroll-carousel__title">{post.title}</h3>
              <p className="ofl-blog-scroll-carousel__excerpt">{post.excerpt}</p>
              <span className="ofl-blog-scroll-carousel__cta">Read more</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
`,
    styles: `.ofl-blog-scroll-carousel {
  background: #14171c;
  box-sizing: border-box;
  color: #f4f5f7;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
  padding: 3.5rem max(1.5rem, calc((100vw - 76rem) / 2));
}
.ofl-blog-scroll-carousel * { box-sizing: border-box; }
.ofl-blog-scroll-carousel__header { align-items: flex-end; display: flex; flex-wrap: wrap; gap: 1rem; justify-content: space-between; margin-bottom: 1.75rem; }
.ofl-blog-scroll-carousel__eyebrow { color: #9aa0ac; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.14em; margin: 0 0 0.4rem; text-transform: uppercase; }
.ofl-blog-scroll-carousel__heading { font-size: clamp(1.5rem, 2.8vw, 2.1rem); font-weight: 800; margin: 0; }
.ofl-blog-scroll-carousel__view-all { background: #ff5a1f; border-radius: 999px; color: #14171c; flex-shrink: 0; font-size: 0.8rem; font-weight: 800; padding: 0.65rem 1.3rem; text-decoration: none; }
.ofl-blog-scroll-carousel__track {
  display: flex;
  gap: 1.1rem;
  list-style: none;
  margin: 0;
  overflow-x: auto;
  padding: 0.25rem 0.25rem 1rem;
  scroll-padding-left: 0.25rem;
  scroll-snap-type: x mandatory;
}
.ofl-blog-scroll-carousel__track::-webkit-scrollbar { height: 6px; }
.ofl-blog-scroll-carousel__track::-webkit-scrollbar-thumb { background: #383e48; border-radius: 999px; }
.ofl-blog-scroll-carousel__item { flex: 0 0 auto; scroll-snap-align: start; width: 15.5rem; }
.ofl-blog-scroll-carousel__card { color: inherit; display: block; text-decoration: none; }
.ofl-blog-scroll-carousel__cover {
  background: repeating-linear-gradient(45deg, #23272f 0, #23272f 10px, #2b303a 10px, #2b303a 20px);
  border-radius: 1.1rem;
  display: block;
  height: 10.5rem;
  margin-bottom: 0.9rem;
}
.ofl-blog-scroll-carousel__title { font-size: 1.02rem; font-weight: 700; line-height: 1.35; margin: 0 0 0.4rem; }
.ofl-blog-scroll-carousel__excerpt { color: #b6bac2; font-size: 0.85rem; line-height: 1.55; margin: 0 0 0.5rem; }
.ofl-blog-scroll-carousel__cta { color: #ff8a54; font-size: 0.8rem; font-weight: 700; }
@media (prefers-reduced-motion: reduce) {
  .ofl-blog-scroll-carousel__track { scroll-behavior: auto; }
}
`,
  },
  {
    schemaVersion: 1,
    id: "blog.category-index",
    name: "Category-Filterable Blog Index",
    category: "blog",
    description:
      "A full blog index page with clickable category pills that filter the post grid client-side, plus an empty state for categories with no matching posts.",
    tags: ["blog", "filter", "categories", "index", "interactive"],
    sourceProject: "nac (HSA blogs index, category filtering adapted from archtech's per-category post lists)",
    exportName: "BlogCategoryIndex",
    fileName: "BlogCategoryIndex.jsx",
    dependencies: [],
    defaultProps: {
      heading: "Latest reads",
      description: "Practical guides, product news and seasonal checklists.",
      categories: ["All", "Guides", "News", "Product"],
      posts: [
        { id: "post-1", title: "A seasonal checklist worth keeping", excerpt: "The short list we hand every new customer.", category: "Guides", date: "2026-08-14" },
        { id: "post-2", title: "What changed in this month's release", excerpt: "Smaller queues, faster confirmations.", category: "Product", date: "2026-08-02" },
        { id: "post-3", title: "We're now open in two more cities", excerpt: "Here is what that means for booking times.", category: "News", date: "2026-07-21" },
        { id: "post-4", title: "Five questions before your first booking", excerpt: "Save yourself a follow-up call.", category: "Guides", date: "2026-07-10" },
        { id: "post-5", title: "A note on our new pricing", excerpt: "What's changing and what stays the same.", category: "News", date: "2026-06-30" },
        { id: "post-6", title: "Behind the scores: how ratings work", excerpt: "The mechanics of the number you see on every profile.", category: "Product", date: "2026-06-11" },
      ],
    },
    accessibility: [
      "Category pills are real <button> elements with aria-pressed reflecting the active filter, so the current selection is announced to assistive technology.",
      "Filtering updates a visually hidden live region announcing the result count, so screen reader users learn the filter took effect without moving focus.",
    ],
    source: `import { useMemo, useState } from "react";

const defaultCategories = ["All", "Guides", "News", "Product"];

const defaultPosts = [
  { id: "post-1", title: "A seasonal checklist worth keeping", excerpt: "The short list we hand every new customer.", category: "Guides", date: "2026-08-14" },
  { id: "post-2", title: "What changed in this month's release", excerpt: "Smaller queues, faster confirmations.", category: "Product", date: "2026-08-02" },
  { id: "post-3", title: "We're now open in two more cities", excerpt: "Here is what that means for booking times.", category: "News", date: "2026-07-21" },
  { id: "post-4", title: "Five questions before your first booking", excerpt: "Save yourself a follow-up call.", category: "Guides", date: "2026-07-10" },
  { id: "post-5", title: "A note on our new pricing", excerpt: "What's changing and what stays the same.", category: "News", date: "2026-06-30" },
  { id: "post-6", title: "Behind the scores: how ratings work", excerpt: "The mechanics of the number you see on every profile.", category: "Product", date: "2026-06-11" },
];

function formatDate(value) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

export function BlogCategoryIndex({
  heading = "Latest reads",
  description = "Practical guides, product news and seasonal checklists.",
  categories = defaultCategories,
  posts = defaultPosts,
}) {
  const [activeCategory, setActiveCategory] = useState(categories[0] || "All");

  const filtered = useMemo(() => {
    if (activeCategory === "All") return posts;
    return posts.filter((post) => post.category === activeCategory);
  }, [activeCategory, posts]);

  return (
    <section className="ofl-blog-category-index" aria-labelledby="blog-category-index-heading">
      <header className="ofl-blog-category-index__header">
        <h2 className="ofl-blog-category-index__heading" id="blog-category-index-heading">
          {heading}
        </h2>
        <p className="ofl-blog-category-index__description">{description}</p>
      </header>

      <div className="ofl-blog-category-index__pills" role="group" aria-label="Filter posts by category">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className="ofl-blog-category-index__pill"
            aria-pressed={activeCategory === category}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <p className="ofl-blog-category-index__status" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "post" : "posts"} in {activeCategory}
      </p>

      {filtered.length === 0 ? (
        <div className="ofl-blog-category-index__empty">No posts in this category yet.</div>
      ) : (
        <div className="ofl-blog-category-index__grid">
          {filtered.map((post) => (
            <article className="ofl-blog-category-index__card" key={post.id}>
              <span className="ofl-blog-category-index__cover" aria-hidden="true" />
              <div className="ofl-blog-category-index__body">
                <span className="ofl-blog-category-index__tag">{post.category}</span>
                <h3 className="ofl-blog-category-index__title">{post.title}</h3>
                <p className="ofl-blog-category-index__excerpt">{post.excerpt}</p>
                <time className="ofl-blog-category-index__date" dateTime={post.date}>
                  {formatDate(post.date)}
                </time>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
`,
    styles: `.ofl-blog-category-index {
  background: #f4f6fb;
  box-sizing: border-box;
  color: #171a2e;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
  padding: 4rem max(1.5rem, calc((100vw - 74rem) / 2));
}
.ofl-blog-category-index * { box-sizing: border-box; }
.ofl-blog-category-index__header { margin-bottom: 1.75rem; max-width: 36rem; }
.ofl-blog-category-index__heading { font-size: clamp(1.7rem, 3vw, 2.35rem); font-weight: 800; margin: 0 0 0.5rem; }
.ofl-blog-category-index__description { color: #565c72; font-size: 1rem; line-height: 1.6; margin: 0; }
.ofl-blog-category-index__pills { display: flex; flex-wrap: wrap; gap: 0.6rem; margin-bottom: 1rem; }
.ofl-blog-category-index__pill {
  background: #ffffff;
  border: 1px solid #d7dbe8;
  border-radius: 999px;
  color: #40465c;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 700;
  padding: 0.55rem 1.1rem;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}
.ofl-blog-category-index__pill:hover { border-color: #4c5eff; }
.ofl-blog-category-index__pill[aria-pressed="true"] { background: #2d3ae0; border-color: #2d3ae0; color: #ffffff; }
.ofl-blog-category-index__status { color: #7a8099; font-size: 0.82rem; margin: 0 0 1.5rem; }
.ofl-blog-category-index__empty { background: #ffffff; border: 1px dashed #c8cee0; border-radius: 1rem; color: #7a8099; padding: 2.5rem; text-align: center; }
.ofl-blog-category-index__grid { display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr)); }
.ofl-blog-category-index__card { background: #ffffff; border-radius: 1rem; box-shadow: 0 1px 2px rgba(23, 26, 46, 0.06); overflow: hidden; }
.ofl-blog-category-index__cover { background: linear-gradient(135deg, #e3e7fb, #c9d0f5); display: block; height: 8.5rem; }
.ofl-blog-category-index__body { padding: 1.15rem 1.25rem 1.4rem; }
.ofl-blog-category-index__tag { color: #2d3ae0; font-size: 0.72rem; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; }
.ofl-blog-category-index__title { font-size: 1.08rem; font-weight: 750; line-height: 1.35; margin: 0.55rem 0 0.5rem; }
.ofl-blog-category-index__excerpt { color: #565c72; font-size: 0.9rem; line-height: 1.55; margin: 0 0 0.75rem; }
.ofl-blog-category-index__date { color: #9096ab; font-size: 0.78rem; font-weight: 600; }
`,
  },
  {
    schemaVersion: 1,
    id: "blog.minimal-list",
    name: "Minimal Text-Only Blog List",
    category: "blog",
    description:
      "A dense, image-free list of posts — date, title and a one-line excerpt per row — for a documentation changelog, press log or writing archive where cover art would just add noise.",
    tags: ["blog", "minimal", "list", "text-only", "changelog"],
    sourceProject: "archtech (typography and meta-row conventions from BlogCard, restyled as an image-free list)",
    exportName: "BlogMinimalList",
    fileName: "BlogMinimalList.jsx",
    dependencies: [],
    defaultProps: {
      heading: "Writing",
      posts: [
        { id: "post-1", title: "On shipping small and often", excerpt: "The habit that made every later release easier.", date: "2026-08-18" },
        { id: "post-2", title: "Notes from a slow week", excerpt: "Not every week needs to be a sprint.", date: "2026-08-03" },
        { id: "post-3", title: "The tools I stopped using", excerpt: "Subtraction is a feature too.", date: "2026-07-19" },
        { id: "post-4", title: "A short defense of boring code", excerpt: "Clever is a cost you pay later.", date: "2026-07-02" },
        { id: "post-5", title: "What changed after a year of writing weekly", excerpt: "Fewer ideas, better ones.", date: "2026-06-14" },
      ],
    },
    accessibility: [
      "Rows are an ordered <ol> of <article> elements so the reading order and count are conveyed to assistive technology without relying on visual position.",
      "The date and title never depend on color alone — the date sits in its own labelled column and the title is always underlined on focus and hover.",
    ],
    source: `const defaultPosts = [
  { id: "post-1", title: "On shipping small and often", excerpt: "The habit that made every later release easier.", date: "2026-08-18" },
  { id: "post-2", title: "Notes from a slow week", excerpt: "Not every week needs to be a sprint.", date: "2026-08-03" },
  { id: "post-3", title: "The tools I stopped using", excerpt: "Subtraction is a feature too.", date: "2026-07-19" },
  { id: "post-4", title: "A short defense of boring code", excerpt: "Clever is a cost you pay later.", date: "2026-07-02" },
  { id: "post-5", title: "What changed after a year of writing weekly", excerpt: "Fewer ideas, better ones.", date: "2026-06-14" },
];

function formatDate(value) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function BlogMinimalList({ heading = "Writing", posts = defaultPosts }) {
  return (
    <section className="ofl-blog-minimal-list" aria-labelledby="blog-minimal-list-heading">
      <h2 className="ofl-blog-minimal-list__heading" id="blog-minimal-list-heading">
        {heading}
      </h2>
      <ol className="ofl-blog-minimal-list__rows">
        {posts.map((post) => (
          <li key={post.id}>
            <article className="ofl-blog-minimal-list__row">
              <a className="ofl-blog-minimal-list__link" href={"#" + post.id}>
                <time className="ofl-blog-minimal-list__date" dateTime={post.date}>
                  {formatDate(post.date)}
                </time>
                <span className="ofl-blog-minimal-list__text">
                  <span className="ofl-blog-minimal-list__title">{post.title}</span>
                  <span className="ofl-blog-minimal-list__excerpt">{post.excerpt}</span>
                </span>
                <span className="ofl-blog-minimal-list__arrow" aria-hidden="true">→</span>
              </a>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}
`,
    styles: `.ofl-blog-minimal-list {
  background: #ffffff;
  box-sizing: border-box;
  color: #1c1c1c;
  font-family: "Iowan Old Style", Georgia, serif;
  padding: 4rem max(1.5rem, calc((100vw - 56rem) / 2));
}
.ofl-blog-minimal-list * { box-sizing: border-box; }
.ofl-blog-minimal-list__heading { font-size: 1.4rem; font-weight: 700; letter-spacing: 0.01em; margin: 0 0 1.5rem; }
.ofl-blog-minimal-list__rows { list-style: none; margin: 0; padding: 0; }
.ofl-blog-minimal-list__row { border-top: 1px solid #e6e3db; }
.ofl-blog-minimal-list__rows li:last-child .ofl-blog-minimal-list__row { border-bottom: 1px solid #e6e3db; }
.ofl-blog-minimal-list__link {
  align-items: baseline;
  color: inherit;
  display: grid;
  gap: 0.35rem 1.5rem;
  grid-template-columns: 6.5rem 1fr 1.5rem;
  padding: 1.15rem 0.25rem;
  text-decoration: none;
}
.ofl-blog-minimal-list__link:hover .ofl-blog-minimal-list__title,
.ofl-blog-minimal-list__link:focus-visible .ofl-blog-minimal-list__title { text-decoration: underline; text-underline-offset: 3px; }
.ofl-blog-minimal-list__date { color: #8b8577; font-family: Arial, sans-serif; font-size: 0.78rem; font-weight: 600; letter-spacing: 0.03em; }
.ofl-blog-minimal-list__text { display: flex; flex-direction: column; gap: 0.2rem; }
.ofl-blog-minimal-list__title { font-size: 1.08rem; }
.ofl-blog-minimal-list__excerpt { color: #6b6558; font-family: Arial, sans-serif; font-size: 0.86rem; line-height: 1.5; }
.ofl-blog-minimal-list__arrow { color: #b0aa9a; font-family: Arial, sans-serif; justify-self: end; }
@media (max-width: 560px) {
  .ofl-blog-minimal-list__link { grid-template-columns: 1fr 1.25rem; }
  .ofl-blog-minimal-list__date { grid-column: 1 / -1; }
}
`,
  },
  {
    schemaVersion: 1,
    id: "blog.post-detail",
    name: "Blog Post Detail Template",
    category: "blog",
    description:
      "Full article template with a breadcrumb-style back link, title, author/date/read-time meta row, placeholder cover banner, body copy with a pull quote, tag list and a share row — for an individual blog post page.",
    tags: ["blog", "article", "post", "detail", "author"],
    sourceProject: "snpridesports (blog detail page: title, meta row, share buttons, article body)",
    exportName: "BlogPostDetail",
    fileName: "BlogPostDetail.jsx",
    dependencies: [],
    defaultProps: {
      backLabel: "Back to blog",
      category: "Guides",
      title: "The honest guide to choosing your first design tool",
      author: "Maya Chen",
      date: "2026-08-20",
      readMinutes: 9,
      paragraphs: [
        "Every new tool promises to be the last one you will ever need. It rarely is, and that is fine — the goal is not to pick forever, it is to pick for now.",
        "Start with the constraint that matters most this month: budget, a teammate's existing habit, or a file format you cannot avoid. Let that one constraint make the first cut for you.",
      ],
      pullQuote: "The best tool is the one that disappears once you start using it.",
      closingParagraph:
        "Revisit the choice in six months, not six days. Most regret comes from switching too early, before the tool has had a fair chance to earn its place.",
      tags: ["Careers", "Tools", "Getting started"],
    },
    accessibility: [
      "The article uses one <h1> for the post title and treats the pull quote as a <blockquote>, keeping the document outline meaningful for screen reader navigation.",
      "The share row exposes each destination as a labelled link (\"Share on ...\") rather than icon-only buttons with no accessible name.",
    ],
    source: `const defaultParagraphs = [
  "Every new tool promises to be the last one you will ever need. It rarely is, and that is fine — the goal is not to pick forever, it is to pick for now.",
  "Start with the constraint that matters most this month: budget, a teammate's existing habit, or a file format you cannot avoid. Let that one constraint make the first cut for you.",
];

const defaultTags = ["Careers", "Tools", "Getting started"];

function formatDate(value) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function BlogPostDetail({
  backLabel = "Back to blog",
  category = "Guides",
  title = "The honest guide to choosing your first design tool",
  author = "Maya Chen",
  date = "2026-08-20",
  readMinutes = 9,
  paragraphs = defaultParagraphs,
  pullQuote = "The best tool is the one that disappears once you start using it.",
  closingParagraph = "Revisit the choice in six months, not six days. Most regret comes from switching too early, before the tool has had a fair chance to earn its place.",
  tags = defaultTags,
}) {
  const initials = author
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className="ofl-blog-post-detail" aria-labelledby="blog-post-detail-title">
      <a className="ofl-blog-post-detail__back" href="#blog">
        ← {backLabel}
      </a>
      <p className="ofl-blog-post-detail__category">{category}</p>
      <h1 className="ofl-blog-post-detail__title" id="blog-post-detail-title">
        {title}
      </h1>

      <div className="ofl-blog-post-detail__meta">
        <span className="ofl-blog-post-detail__avatar" aria-hidden="true">{initials}</span>
        <div>
          <p className="ofl-blog-post-detail__author">{author}</p>
          <p className="ofl-blog-post-detail__submeta">
            <time dateTime={date}>{formatDate(date)}</time>
            <span aria-hidden="true"> · </span>
            <span>{readMinutes} min read</span>
          </p>
        </div>
      </div>

      <div className="ofl-blog-post-detail__cover" aria-hidden="true" />

      <div className="ofl-blog-post-detail__body">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
        <blockquote className="ofl-blog-post-detail__quote">{pullQuote}</blockquote>
        <p>{closingParagraph}</p>
      </div>

      <ul className="ofl-blog-post-detail__tags" role="list">
        {tags.map((tag) => (
          <li className="ofl-blog-post-detail__tag" key={tag}>{tag}</li>
        ))}
      </ul>

      <div className="ofl-blog-post-detail__share">
        <span className="ofl-blog-post-detail__share-label">Share this article</span>
        <div className="ofl-blog-post-detail__share-links">
          <a href="#share-x" aria-label={"Share \\"" + title + "\\" on X"}>X</a>
          <a href="#share-linkedin" aria-label={"Share \\"" + title + "\\" on LinkedIn"}>in</a>
          <a href="#share-email" aria-label={"Share \\"" + title + "\\" by email"}>@</a>
        </div>
      </div>
    </article>
  );
}
`,
    styles: `.ofl-blog-post-detail {
  background: #ffffff;
  box-sizing: border-box;
  color: #1a1c22;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
  margin: 0 auto;
  max-width: 42rem;
  padding: 4rem 1.5rem;
}
.ofl-blog-post-detail * { box-sizing: border-box; }
.ofl-blog-post-detail__back { color: #565c72; font-size: 0.85rem; font-weight: 600; text-decoration: none; }
.ofl-blog-post-detail__back:hover { text-decoration: underline; }
.ofl-blog-post-detail__category { color: #2d3ae0; font-size: 0.75rem; font-weight: 800; letter-spacing: 0.08em; margin: 1.75rem 0 0.5rem; text-transform: uppercase; }
.ofl-blog-post-detail__title { font-size: clamp(1.8rem, 4vw, 2.5rem); font-weight: 800; letter-spacing: -0.015em; line-height: 1.2; margin: 0 0 1.5rem; }
.ofl-blog-post-detail__meta { align-items: center; border-bottom: 1px solid #e7e9f0; display: flex; gap: 0.85rem; padding-bottom: 1.5rem; }
.ofl-blog-post-detail__avatar {
  align-items: center;
  background: #2d3ae0;
  border-radius: 999px;
  color: #ffffff;
  display: flex;
  flex-shrink: 0;
  font-size: 0.85rem;
  font-weight: 800;
  height: 2.6rem;
  justify-content: center;
  width: 2.6rem;
}
.ofl-blog-post-detail__author { font-size: 0.92rem; font-weight: 700; margin: 0; }
.ofl-blog-post-detail__submeta { color: #7a8099; font-size: 0.8rem; margin: 0.15rem 0 0; }
.ofl-blog-post-detail__cover {
  background: repeating-linear-gradient(120deg, #eef1f6 0, #eef1f6 14px, #e2e6ef 14px, #e2e6ef 28px);
  border-radius: 1rem;
  height: 16rem;
  margin: 1.75rem 0;
}
.ofl-blog-post-detail__body p { color: #33364a; font-size: 1.05rem; line-height: 1.75; margin: 0 0 1.25rem; }
.ofl-blog-post-detail__quote {
  border-left: 3px solid #2d3ae0;
  color: #1a1c22;
  font-size: 1.2rem;
  font-style: italic;
  line-height: 1.55;
  margin: 1.75rem 0;
  padding-left: 1.25rem;
}
.ofl-blog-post-detail__tags { display: flex; flex-wrap: wrap; gap: 0.5rem; list-style: none; margin: 0.5rem 0 2rem; padding: 0; }
.ofl-blog-post-detail__tag { background: #f0f1f8; border-radius: 999px; color: #40465c; font-size: 0.78rem; font-weight: 700; padding: 0.35rem 0.85rem; }
.ofl-blog-post-detail__share { align-items: center; border-top: 1px solid #e7e9f0; display: flex; gap: 1rem; justify-content: space-between; padding-top: 1.5rem; }
.ofl-blog-post-detail__share-label { color: #7a8099; font-size: 0.85rem; font-weight: 600; }
.ofl-blog-post-detail__share-links { display: flex; gap: 0.6rem; }
.ofl-blog-post-detail__share-links a {
  align-items: center;
  background: #f0f1f8;
  border-radius: 999px;
  color: #33364a;
  display: flex;
  font-size: 0.78rem;
  font-weight: 800;
  height: 2.2rem;
  justify-content: center;
  text-decoration: none;
  width: 2.2rem;
}
.ofl-blog-post-detail__share-links a:hover { background: #2d3ae0; color: #ffffff; }
`,
  },
];
