import { createCmsBlock } from "../block.js";

/**
 * A plain, server-rendered HTML contact form.
 *
 * The block deliberately owns no submission logic: it renders a native
 * <form method="post">, and where that form posts is entirely the site
 * owner's `action` URL (their own endpoint, a hosted form service, or a
 * mailto: address). Exactly like the CTA block's `buttonHref`, this block
 * neither knows nor cares what answers on the other end.
 *
 * Each control is wrapped by its own <label>, which associates the two by
 * containment. That is a real, programmatic association and needs no `id`,
 * so several contact forms can share one page without colliding ids — and
 * the component stays hook-free, safe to render on the server or to call
 * directly as a function.
 */
function ContactForm({ heading, body, action, submitLabel }) {
  return (
    <section className="of-block of-contact-form">
      <h2 className="of-contact-form-heading">{heading}</h2>
      {body ? <p className="of-contact-form-body">{body}</p> : null}
      <form action={action} className="of-contact-form-form" method="post">
        <label className="of-contact-form-field">
          <span className="of-contact-form-label">Name</span>
          <input
            autoComplete="name"
            className="of-contact-form-control"
            name="name"
            required
            type="text"
          />
        </label>
        <label className="of-contact-form-field">
          <span className="of-contact-form-label">Email</span>
          <input
            autoComplete="email"
            className="of-contact-form-control"
            name="email"
            required
            type="email"
          />
        </label>
        <label className="of-contact-form-field">
          <span className="of-contact-form-label">Message</span>
          <textarea
            className="of-contact-form-control of-contact-form-message"
            name="message"
            required
            rows={5}
          />
        </label>
        <button className="of-contact-form-submit" type="submit">
          {submitLabel}
        </button>
      </form>
    </section>
  );
}

export const contactFormBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.contact-form",
    version: 1,
    name: "Contact Form",
    description:
      "A native name/email/message form. The block renders the markup only — you must supply your own form backend as the action URL (your own endpoint, a hosted form service, or a mailto: address); nothing is collected, stored, or emailed by OpenForge.",
    tags: ["form", "contact"],
    defaultProps: {
      heading: "Get in touch",
      body: "Send us a message and we will reply as soon as we can.",
      action: "#contact",
      submitLabel: "Send message",
    },
    editableFields: [
      { path: "heading", label: "Heading", control: "text", required: true },
      {
        path: "body",
        label: "Intro text",
        control: "textarea",
        required: false,
      },
      {
        path: "action",
        label: "Form action URL (your form backend)",
        control: "url",
        required: true,
      },
      {
        path: "submitLabel",
        label: "Submit button label",
        control: "text",
        required: false,
      },
    ],
    slots: [],
    accessibility: [
      "Every field has a visible <label> that wraps its own control, so the label is programmatically associated with it — placeholders are never used as a label substitute.",
      "Required fields are marked with the native required attribute, so the browser's own validation and assistive-technology announcements apply without any JavaScript.",
    ],
    migrations: [],
  },
  component: ContactForm,
});
