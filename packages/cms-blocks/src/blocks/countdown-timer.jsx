import { createCmsBlock } from "../block.js";

const MS_PER_MINUTE = 60_000;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;

const DEFAULT_EXPIRED_MESSAGE = "We're live!";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Format the target instant in UTC, by hand, so the rendered text is identical
 * on every machine that builds the site (toLocaleString would vary with the
 * host's locale and ICU data).
 *
 * @param {Date} date
 */
function formatUtc(date) {
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  return `${date.getUTCDate()} ${MONTH_NAMES[date.getUTCMonth()]} ${date.getUTCFullYear()}, ${hours}:${minutes} UTC`;
}

/**
 * Turn a raw ISO 8601 string into the whole days/hours/minutes still ahead of
 * the moment this page is rendered.
 *
 * Returns `null` when the date is unparseable or already in the past, which is
 * the caller's signal to render the expired message instead of a countdown.
 *
 * @param {unknown} targetDate
 * @param {number} now
 */
function remainingParts(targetDate, now) {
  if (typeof targetDate !== "string" || targetDate.trim() === "") return null;

  const target = new Date(targetDate);
  const targetMs = target.getTime();
  if (Number.isNaN(targetMs)) return null;

  const remaining = targetMs - now;
  if (remaining <= 0) return null;

  return {
    iso: target.toISOString(),
    formatted: formatUtc(target),
    days: Math.floor(remaining / MS_PER_DAY),
    hours: Math.floor((remaining % MS_PER_DAY) / MS_PER_HOUR),
    minutes: Math.floor((remaining % MS_PER_HOUR) / MS_PER_MINUTE),
  };
}

/**
 * @param {number} count
 * @param {string} singular
 */
function unitLabel(count, singular) {
  return count === 1 ? singular : `${singular}s`;
}

function CountdownUnit({ value, singular }) {
  return (
    <div className="of-countdown-timer-unit">
      <span className="of-countdown-timer-value">{value}</span>
      <span className="of-countdown-timer-label">
        {unitLabel(value, singular)}
      </span>
    </div>
  );
}

function CountdownTimer({ heading, targetDate, expiredMessage }) {
  const message =
    typeof expiredMessage === "string" && expiredMessage.trim() !== ""
      ? expiredMessage
      : DEFAULT_EXPIRED_MESSAGE;
  const parts = remainingParts(targetDate, Date.now());

  if (parts === null) {
    return (
      <div className="of-block of-countdown-timer of-countdown-timer-expired">
        <p className="of-countdown-timer-message">{message}</p>
      </div>
    );
  }

  return (
    <div className="of-block of-countdown-timer">
      {heading ? <p className="of-countdown-timer-heading">{heading}</p> : null}
      <div className="of-countdown-timer-units">
        <CountdownUnit singular="Day" value={parts.days} />
        <CountdownUnit singular="Hour" value={parts.hours} />
        <CountdownUnit singular="Minute" value={parts.minutes} />
      </div>
      <p className="of-countdown-timer-note">
        Counting down to <time dateTime={parts.iso}>{parts.formatted}</time>,
        measured when this page was last rendered.
      </p>
    </div>
  );
}

export const countdownTimerBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.countdown-timer",
    version: 1,
    name: "Countdown Timer",
    description:
      "A countdown to a launch or event date. The days, hours, and minutes shown are computed on the server when the page is rendered or rebuilt — this is a static snapshot, not a live-ticking clock, so it goes stale until the page is rendered again.",
    tags: ["marketing", "urgency"],
    defaultProps: {
      heading: "Launching in",
      targetDate: "2030-01-01T00:00:00.000Z",
      expiredMessage: DEFAULT_EXPIRED_MESSAGE,
    },
    editableFields: [
      { path: "heading", label: "Heading", control: "text", required: false },
      {
        path: "targetDate",
        label: "Target date (ISO 8601, e.g. 2030-01-01T00:00:00.000Z)",
        control: "text",
        required: true,
      },
      {
        path: "expiredMessage",
        label: "Message once the date has passed",
        control: "text",
        required: false,
      },
    ],
    slots: [],
    accessibility: [
      "Every number is paired with a visible text unit label (Days, Hours, Minutes), so the meaning of each value never depends on its position, size, or color alone.",
      "The block reads correctly in linear order and uses no aria-live region or timer role, because the value is rendered once on the server and does not update in place — announcing it as live would mislead assistive technology.",
      "The exact target instant is exposed to machines through a time element's dateTime attribute, and the visible note states that the countdown reflects the page's last render.",
    ],
    migrations: [],
  },
  component: CountdownTimer,
});
