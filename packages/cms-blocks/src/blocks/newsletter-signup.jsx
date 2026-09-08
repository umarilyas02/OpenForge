import { createCmsBlock } from "../block.js";

function NewsletterSignup({
  heading,
  body,
  action,
  placeholder = "you@example.com",
  submitLabel = "Subscribe",
}) {
  return (
    <section className="of-block of-newsletter-signup">
      {heading ? (
        <h2 className="of-newsletter-signup-heading">{heading}</h2>
      ) : null}
      {body ? <p className="of-newsletter-signup-body">{body}</p> : null}
      <form className="of-newsletter-signup-form" method="post" action={action}>
        {/* The label wraps the input, so it is programmatically associated
            without inventing a DOM id — the same block can appear more than
            once on a page without colliding ids. */}
        <label className="of-newsletter-signup-field">
          <span className="of-newsletter-signup-label">Email address</span>
          <input
            className="of-newsletter-signup-input"
            type="email"
            name="email"
            autoComplete="email"
            required
            placeholder={placeholder}
          />
        </label>
        <button className="of-newsletter-signup-submit" type="submit">
          {submitLabel}
        </button>
      </form>
    </section>
  );
}

export const newsletterSignupBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.newsletter-signup",
    version: 1,
    name: "Newsletter Signup",
    description:
      "A heading, short pitch, and an email capture form. The block stores no addresses itself: it posts the email field to whatever form endpoint you supply in the action prop (your Mailchimp, ConvertKit, Buttondown, or Resend form URL), so replace the placeholder action with your own list provider's endpoint before publishing.",
    tags: ["form", "marketing", "email"],
    defaultProps: {
      heading: "Subscribe to the newsletter",
      body: "One short email a month. No spam, unsubscribe anytime.",
      action: "#",
      placeholder: "you@example.com",
      submitLabel: "Subscribe",
    },
    editableFields: [
      { path: "heading", label: "Heading", control: "text", required: true },
      { path: "body", label: "Body", control: "textarea", required: false },
      {
        path: "action",
        label: "Form endpoint URL",
        control: "url",
        required: true,
      },
      {
        path: "placeholder",
        label: "Input placeholder",
        control: "text",
        required: false,
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
      "The email input is wrapped by its own <label>, so it is programmatically labelled 'Email address' even though that text is visually hidden with the clip pattern rather than display:none.",
      'Submission uses a native HTML form with type="email" and required, so browser validation and keyboard submission work with no JavaScript.',
    ],
    migrations: [],
  },
  component: NewsletterSignup,
});
