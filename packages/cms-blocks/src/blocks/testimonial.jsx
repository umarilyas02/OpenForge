import { createCmsBlock } from "../block.js";

function Testimonial({ quote, author, role, avatar }) {
  return (
    <figure className="of-block of-testimonial">
      <blockquote className="of-testimonial-quote">{quote}</blockquote>
      <figcaption className="of-testimonial-author">
        {avatar ? (
          <img alt="" className="of-testimonial-avatar" src={avatar} />
        ) : null}
        <span>
          <strong>{author}</strong>
          {role ? <span className="of-testimonial-role"> — {role}</span> : null}
        </span>
      </figcaption>
    </figure>
  );
}

export const testimonialBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.testimonial",
    version: 1,
    name: "Testimonial",
    description: "A quote with an attributed author.",
    tags: ["social-proof", "testimonial"],
    defaultProps: {},
    editableFields: [
      { path: "quote", label: "Quote", control: "textarea", required: true },
      { path: "author", label: "Author", control: "text", required: true },
      {
        path: "role",
        label: "Role or company",
        control: "text",
        required: false,
      },
      { path: "avatar", label: "Avatar", control: "image", required: false },
    ],
    slots: [],
    accessibility: [
      "Rendered as a real <blockquote>/<figcaption> pair; avatar is decorative.",
    ],
    migrations: [],
  },
  component: Testimonial,
});
