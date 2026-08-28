import { createCmsBlock } from "../block.js";

const STAR_COUNT = 5;

function Rating({ value, label }) {
  const filled = Number(value) || 0;

  return (
    <div className="of-block of-rating">
      <span aria-hidden="true" className="of-rating-stars">
        {Array.from({ length: STAR_COUNT }, (_, index) => (
          <span
            className={
              index < filled
                ? "of-rating-star of-rating-star-filled"
                : "of-rating-star"
            }
            key={index}
          >
            ★
          </span>
        ))}
      </span>
      <span className="of-rating-label">
        {label ?? `${filled} out of ${STAR_COUNT}`}
      </span>
    </div>
  );
}

export const ratingBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.rating",
    version: 1,
    name: "Rating",
    description: "A star rating with an optional descriptive label.",
    tags: ["social-proof", "rating"],
    defaultProps: { value: "5" },
    editableFields: [
      {
        path: "value",
        label: "Stars",
        control: "select",
        required: true,
        options: [
          { value: "1", label: "1 star" },
          { value: "2", label: "2 stars" },
          { value: "3", label: "3 stars" },
          { value: "4", label: "4 stars" },
          { value: "5", label: "5 stars" },
        ],
      },
      {
        path: "label",
        label: "Label",
        control: "text",
        required: false,
      },
    ],
    slots: [],
    accessibility: [
      "Stars are decorative (aria-hidden); the visible label carries the actual rating as real text.",
    ],
    migrations: [],
  },
  component: Rating,
});
