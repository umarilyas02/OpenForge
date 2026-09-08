// Distinctive, project-specific component variants that don't fit the other
// categories (dashboards, catalogs, trackers, chat widgets, forms, etc.),
// harvested from reference projects and generalized for reuse.
// Populated by an authoring pass — see README.md for the sourcing process.

const AI_CHAT_WIDGET_SOURCE = `import { useEffect, useRef, useState } from "react";

const defaultInitialMessages = [
  { id: "msg-welcome", role: "assistant", text: "Hi! I can help you find what you're looking for. Ask me anything." },
];

const defaultSuggestions = [
  "What can you help with?",
  "Show me pricing options",
  "Talk to a person",
];

function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

export function AiChatWidget({
  title = "Assistant",
  subtitle = "Usually replies in a few minutes",
  placeholder = "Type a message...",
  initialMessages = defaultInitialMessages,
  suggestions = defaultSuggestions,
  defaultOpen = true,
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  function pushMessage(role, text) {
    setMessages((prev) => [
      ...prev,
      { id: "msg-" + prev.length + "-" + Date.now(), role, text },
    ]);
  }

  function sendMessage(rawText) {
    const text = rawText.trim();
    if (!text) return;
    pushMessage("user", text);
    setDraft("");
    setIsTyping(true);
    timeoutRef.current = window.setTimeout(() => {
      setIsTyping(false);
      pushMessage(
        "assistant",
        "Thanks for reaching out. This is a placeholder reply from a generalized demo assistant."
      );
    }, 900);
  }

  return (
    <div className={cx("ofl-custom-chat-widget", open && "is-open")}>
      {open && (
        <div className="ocw-panel" role="dialog" aria-label={title + " chat"}>
          <header className="ocw-header">
            <div className="ocw-header-text">
              <p className="ocw-title">{title}</p>
              <p className="ocw-subtitle">{subtitle}</p>
            </div>
            <button
              type="button"
              className="ocw-icon-button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </header>

          <div className="ocw-messages" ref={listRef}>
            {messages.map((message) => (
              <div key={message.id} className={cx("ocw-row", "ocw-row-" + message.role)}>
                <span className="ocw-avatar" aria-hidden="true">
                  {message.role === "assistant" ? "A" : "U"}
                </span>
                <p className="ocw-bubble">{message.text}</p>
              </div>
            ))}
            {isTyping && (
              <div className="ocw-row ocw-row-assistant">
                <span className="ocw-avatar" aria-hidden="true">A</span>
                <div className="ocw-typing" aria-label={title + " is typing"} role="status">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>

          {messages.length <= 1 && suggestions.length > 0 && (
            <div className="ocw-suggestions">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  className="ocw-suggestion"
                  onClick={() => sendMessage(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          <form
            className="ocw-composer"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage(draft);
            }}
          >
            <input
              type="text"
              className="ocw-input"
              value={draft}
              placeholder={placeholder}
              aria-label="Message"
              onChange={(event) => setDraft(event.target.value)}
            />
            <button type="submit" className="ocw-send" aria-label="Send message" disabled={!draft.trim()}>
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M3 12l18-8-8 18-2-8-8-2z" fill="currentColor" />
              </svg>
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        className="ocw-launcher"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? (
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
            <path d="M4 4h16v12H8l-4 4V4z" fill="currentColor" />
          </svg>
        )}
      </button>
    </div>
  );
}
`;

const AI_CHAT_WIDGET_STYLES = `.ofl-custom-chat-widget {
  --ocw-accent: #6d5efc;
  --ocw-ink: #1c1b29;
  --ocw-bg: #ffffff;
  position: fixed;
  right: 1.5rem;
  bottom: 1.5rem;
  z-index: 40;
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.75rem;
}
.ofl-custom-chat-widget .ocw-launcher {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 999px;
  border: none;
  background: var(--ocw-accent);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 12px 24px rgba(109, 94, 252, 0.35);
}
.ofl-custom-chat-widget .ocw-panel {
  width: min(22rem, calc(100vw - 3rem));
  max-height: 32rem;
  display: flex;
  flex-direction: column;
  background: var(--ocw-bg);
  border-radius: 1.25rem;
  overflow: hidden;
  box-shadow: 0 20px 45px rgba(20, 16, 60, 0.22);
}
.ofl-custom-chat-widget .ocw-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1rem 1.1rem;
  background: var(--ocw-accent);
  color: #fff;
}
.ofl-custom-chat-widget .ocw-title { margin: 0; font-weight: 700; font-size: 0.95rem; }
.ofl-custom-chat-widget .ocw-subtitle { margin: 0.15rem 0 0; font-size: 0.75rem; opacity: 0.85; }
.ofl-custom-chat-widget .ocw-icon-button { background: transparent; border: none; color: #fff; cursor: pointer; padding: 0.2rem; }
.ofl-custom-chat-widget .ocw-messages { flex: 1; overflow-y: auto; padding: 1rem; display: flex; flex-direction: column; gap: 0.65rem; background: #f7f7fb; }
.ofl-custom-chat-widget .ocw-row { display: flex; gap: 0.5rem; align-items: flex-end; }
.ofl-custom-chat-widget .ocw-row-user { flex-direction: row-reverse; }
.ofl-custom-chat-widget .ocw-avatar { width: 1.6rem; height: 1.6rem; border-radius: 999px; background: var(--ocw-ink); color: #fff; font-size: 0.7rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ofl-custom-chat-widget .ocw-row-user .ocw-avatar { background: var(--ocw-accent); }
.ofl-custom-chat-widget .ocw-bubble { margin: 0; padding: 0.55rem 0.8rem; border-radius: 1rem 1rem 1rem 0.2rem; background: #fff; color: var(--ocw-ink); font-size: 0.85rem; line-height: 1.4; max-width: 14rem; box-shadow: 0 1px 2px rgba(20,16,60,0.08); }
.ofl-custom-chat-widget .ocw-row-user .ocw-bubble { background: var(--ocw-accent); color: #fff; border-radius: 1rem 1rem 0.2rem 1rem; }
.ofl-custom-chat-widget .ocw-typing { display: flex; gap: 0.25rem; padding: 0.6rem 0.8rem; background: #fff; border-radius: 1rem; }
.ofl-custom-chat-widget .ocw-typing span { width: 0.4rem; height: 0.4rem; border-radius: 999px; background: #b7b3d9; animation: ocw-bounce 1s infinite ease-in-out; }
.ofl-custom-chat-widget .ocw-typing span:nth-child(2) { animation-delay: 0.15s; }
.ofl-custom-chat-widget .ocw-typing span:nth-child(3) { animation-delay: 0.3s; }
@keyframes ocw-bounce { 0%, 80%, 100% { transform: translateY(0); opacity: 0.5; } 40% { transform: translateY(-0.25rem); opacity: 1; } }
.ofl-custom-chat-widget .ocw-suggestions { display: flex; flex-wrap: wrap; gap: 0.4rem; padding: 0 1rem 0.75rem; background: #f7f7fb; }
.ofl-custom-chat-widget .ocw-suggestion { border: 1px solid #dcdaf0; background: #fff; border-radius: 999px; padding: 0.35rem 0.7rem; font-size: 0.75rem; color: var(--ocw-accent); cursor: pointer; }
.ofl-custom-chat-widget .ocw-composer { display: flex; gap: 0.5rem; padding: 0.75rem; border-top: 1px solid #ece9fa; background: #fff; }
.ofl-custom-chat-widget .ocw-input { flex: 1; border: 1px solid #dcdaf0; border-radius: 999px; padding: 0.5rem 0.9rem; font-size: 0.85rem; }
.ofl-custom-chat-widget .ocw-send { width: 2.2rem; height: 2.2rem; border-radius: 999px; border: none; background: var(--ocw-accent); color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; }
.ofl-custom-chat-widget .ocw-send:disabled { opacity: 0.4; cursor: not-allowed; }
@media (prefers-reduced-motion: reduce) { .ofl-custom-chat-widget .ocw-typing span { animation: none; } }
`;

const ORDER_TRACKING_TIMELINE_SOURCE = `import { useState } from "react";

const defaultSteps = [
  { key: "placed", label: "Order Placed" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "out-for-delivery", label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" },
];

const defaultStats = [
  { id: "order-date", label: "Order Date", value: "Mar 4, 2026" },
  { id: "carrier", label: "Carrier", value: "Standard Freight" },
  { id: "eta", label: "Estimated Arrival", value: "Mar 9, 2026" },
  { id: "items", label: "Items", value: "3" },
];

const defaultActivity = [
  { id: "a4", label: "Departed regional facility", timestamp: "Mar 7, 8:14 AM", description: "Package left the last sorting facility." },
  { id: "a3", label: "Arrived at regional facility", timestamp: "Mar 6, 11:02 PM" },
  { id: "a2", label: "Order processed", timestamp: "Mar 5, 2:47 PM", description: "Items packed and labeled for shipment." },
  { id: "a1", label: "Order placed", timestamp: "Mar 4, 9:30 AM" },
];

function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

export function OrderTrackingTimeline({
  orderNumber = "ORD-48213",
  statusLabel = "In Transit",
  currentStep = 3,
  steps = defaultSteps,
  stats = defaultStats,
  activity = defaultActivity,
  isOnHold = false,
  isCancelled = false,
}) {
  const [showActivity, setShowActivity] = useState(false);

  return (
    <section className="ofl-custom-order-tracking" aria-label={"Tracking for order " + orderNumber}>
      <header className="ott-header">
        <div>
          <p className="ott-eyebrow">Order</p>
          <p className="ott-order-number">{orderNumber}</p>
        </div>
        <span className={cx("ott-status-pill", isCancelled && "is-cancelled", isOnHold && !isCancelled && "is-hold")}>
          {isCancelled ? "Cancelled" : isOnHold ? "On Hold" : statusLabel}
        </span>
      </header>

      {isOnHold && !isCancelled && (
        <p className="ott-banner ott-banner-hold" role="status">
          This shipment is on hold. Updates will resume automatically once released.
        </p>
      )}
      {isCancelled && (
        <p className="ott-banner ott-banner-cancelled" role="status">
          This order was cancelled. No further tracking updates will be sent.
        </p>
      )}

      {!isCancelled && (
        <ol className="ott-stepper">
          {steps.map((step, index) => {
            const position = index + 1;
            const state = position < currentStep ? "complete" : position === currentStep ? "current" : "upcoming";
            return (
              <li key={step.key} className={cx("ott-step", "ott-step-" + state)}>
                <span className="ott-circle" aria-hidden="true">
                  {state === "complete" ? (
                    <svg viewBox="0 0 24 24" width="14" height="14">
                      <path d="M4 12l5 5L20 6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    position
                  )}
                </span>
                <span className="ott-step-label">{step.label}</span>
              </li>
            );
          })}
        </ol>
      )}

      <ul className="ott-stat-row">
        {stats.map((stat) => (
          <li key={stat.id} className="ott-stat">
            <p className="ott-stat-value">{stat.value}</p>
            <p className="ott-stat-label">{stat.label}</p>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="ott-toggle"
        onClick={() => setShowActivity((prev) => !prev)}
        aria-expanded={showActivity}
      >
        {showActivity ? "Hide detailed activity" : "View detailed activity"}
      </button>

      {showActivity && (
        <ol className="ott-activity">
          {activity.map((event) => (
            <li key={event.id} className="ott-activity-item">
              <span className="ott-activity-dot" aria-hidden="true"></span>
              <div className="ott-activity-body">
                <p className="ott-activity-label">{event.label}</p>
                <p className="ott-activity-time">{event.timestamp}</p>
                {event.description && <p className="ott-activity-desc">{event.description}</p>}
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
`;

const ORDER_TRACKING_TIMELINE_STYLES = `.ofl-custom-order-tracking {
  --ott-ink: #0f172a;
  --ott-muted: #64748b;
  --ott-line: #e2e8f0;
  --ott-accent: #2563eb;
  --ott-success: #16a34a;
  font-family: Arial, sans-serif;
  color: var(--ott-ink);
  max-width: 40rem;
  margin: 0 auto;
  background: #fff;
  border: 1px solid var(--ott-line);
  border-radius: 1rem;
  padding: 1.75rem;
}
.ofl-custom-order-tracking .ott-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
.ofl-custom-order-tracking .ott-eyebrow { margin: 0; font-size: 0.7rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ott-muted); }
.ofl-custom-order-tracking .ott-order-number { margin: 0.2rem 0 0; font-size: 1.3rem; font-weight: 800; }
.ofl-custom-order-tracking .ott-status-pill { padding: 0.35rem 0.85rem; border-radius: 999px; background: #dbeafe; color: var(--ott-accent); font-size: 0.75rem; font-weight: 700; white-space: nowrap; }
.ofl-custom-order-tracking .ott-status-pill.is-hold { background: #fef3c7; color: #b45309; }
.ofl-custom-order-tracking .ott-status-pill.is-cancelled { background: #fee2e2; color: #b91c1c; }
.ofl-custom-order-tracking .ott-banner { margin: 1rem 0 0; padding: 0.75rem 1rem; border-radius: 0.65rem; font-size: 0.85rem; }
.ofl-custom-order-tracking .ott-banner-hold { background: #fffbeb; color: #92400e; }
.ofl-custom-order-tracking .ott-banner-cancelled { background: #fef2f2; color: #991b1b; }
.ofl-custom-order-tracking .ott-stepper { display: flex; list-style: none; margin: 1.75rem 0 0; padding: 0; }
.ofl-custom-order-tracking .ott-step { flex: 1; display: flex; flex-direction: column; align-items: center; text-align: center; position: relative; }
.ofl-custom-order-tracking .ott-step:not(:last-child)::after { content: ""; position: absolute; top: 0.9rem; left: 55%; width: 90%; height: 2px; background: var(--ott-line); z-index: 0; }
.ofl-custom-order-tracking .ott-step-complete:not(:last-child)::after { background: var(--ott-success); }
.ofl-custom-order-tracking .ott-circle { position: relative; z-index: 1; width: 1.9rem; height: 1.9rem; border-radius: 999px; background: #fff; border: 2px solid var(--ott-line); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; color: var(--ott-muted); }
.ofl-custom-order-tracking .ott-step-complete .ott-circle { background: var(--ott-success); border-color: var(--ott-success); color: #fff; }
.ofl-custom-order-tracking .ott-step-current .ott-circle { border-color: var(--ott-accent); color: var(--ott-accent); }
.ofl-custom-order-tracking .ott-step-label { margin-top: 0.5rem; font-size: 0.72rem; color: var(--ott-muted); max-width: 6rem; }
.ofl-custom-order-tracking .ott-step-current .ott-step-label, .ofl-custom-order-tracking .ott-step-complete .ott-step-label { color: var(--ott-ink); font-weight: 600; }
.ofl-custom-order-tracking .ott-stat-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(7rem, 1fr)); gap: 1rem; list-style: none; margin: 1.75rem 0 0; padding: 1rem 0; border-top: 1px solid var(--ott-line); }
.ofl-custom-order-tracking .ott-stat { text-align: left; }
.ofl-custom-order-tracking .ott-stat-value { margin: 0; font-weight: 700; }
.ofl-custom-order-tracking .ott-stat-label { margin: 0.15rem 0 0; font-size: 0.72rem; color: var(--ott-muted); }
.ofl-custom-order-tracking .ott-toggle { margin-top: 1rem; background: none; border: none; color: var(--ott-accent); font-weight: 700; font-size: 0.8rem; cursor: pointer; padding: 0; }
.ofl-custom-order-tracking .ott-activity { list-style: none; margin: 1rem 0 0; padding: 0; border-left: 2px solid var(--ott-line); }
.ofl-custom-order-tracking .ott-activity-item { position: relative; padding: 0 0 1.1rem 1.25rem; }
.ofl-custom-order-tracking .ott-activity-dot { position: absolute; left: -0.4rem; top: 0.15rem; width: 0.7rem; height: 0.7rem; border-radius: 999px; background: var(--ott-accent); border: 2px solid #fff; box-shadow: 0 0 0 2px var(--ott-accent); }
.ofl-custom-order-tracking .ott-activity-label { margin: 0; font-weight: 700; font-size: 0.85rem; }
.ofl-custom-order-tracking .ott-activity-time { margin: 0.1rem 0 0; font-size: 0.72rem; color: var(--ott-muted); }
.ofl-custom-order-tracking .ott-activity-desc { margin: 0.25rem 0 0; font-size: 0.8rem; color: var(--ott-muted); }
@media (max-width: 30rem) { .ofl-custom-order-tracking .ott-stepper { flex-wrap: wrap; row-gap: 1.5rem; } .ofl-custom-order-tracking .ott-step { flex-basis: 33%; } }
`;

const STEP_WIZARD_FORM_SOURCE = `import { useState } from "react";

const defaultSteps = [
  { key: "details", label: "Your details" },
  { key: "schedule", label: "Schedule" },
  { key: "review", label: "Review" },
];

const defaultValues = { name: "", email: "", date: "", notes: "" };

function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

export function StepWizardForm({ steps = defaultSteps, initialValues = defaultValues }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [values, setValues] = useState(initialValues);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState("");

  const isLastStep = stepIndex === steps.length - 1;
  const activeKey = steps[stepIndex] ? steps[stepIndex].key : "";

  function updateValue(key, value) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function goNext() {
    if (activeKey === "details" && !values.name.trim()) {
      setError("Please enter your name to continue.");
      return;
    }
    if (activeKey === "schedule" && !values.date) {
      setError("Please choose a date to continue.");
      return;
    }
    setError("");
    if (isLastStep) {
      setIsDone(true);
      return;
    }
    setStepIndex((index) => index + 1);
  }

  function goBack() {
    setError("");
    setStepIndex((index) => Math.max(0, index - 1));
  }

  function restart() {
    setValues(initialValues);
    setStepIndex(0);
    setIsDone(false);
    setError("");
  }

  const completedCount = isDone ? steps.length : stepIndex;
  const fillPercent = steps.length > 1 ? (completedCount / (steps.length - 1)) * 100 : 0;

  return (
    <div className="ofl-custom-step-wizard">
      <ol className="swf-stepper">
        <li className="swf-track">
          <span className="swf-track-fill" style={{ transform: "scaleX(" + (Math.min(100, fillPercent) / 100) + ")" }}></span>
        </li>
        {steps.map((step, index) => {
          const state = isDone || index < stepIndex ? "complete" : index === stepIndex ? "current" : "upcoming";
          return (
            <li key={step.key} className={cx("swf-node", "swf-node-" + state)} aria-current={state === "current" ? "step" : undefined}>
              <span className="swf-circle">
                {state === "complete" ? (
                  <svg viewBox="0 0 24 24" width="12" height="12">
                    <path d="M4 12l5 5L20 6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  index + 1
                )}
              </span>
              <span className="swf-node-label">{step.label}</span>
            </li>
          );
        })}
      </ol>

      <div className="swf-panel">
        {isDone ? (
          <div className="swf-success">
            <p className="swf-success-title">You're all set</p>
            <p className="swf-success-copy">Your request has been recorded. A generalized confirmation would appear here.</p>
            <button type="button" className="swf-secondary" onClick={restart}>Start over</button>
          </div>
        ) : (
          <>
            {activeKey === "details" && (
              <div className="swf-fields">
                <label className="swf-field">
                  <span>Full name</span>
                  <input type="text" value={values.name} onChange={(event) => updateValue("name", event.target.value)} />
                </label>
                <label className="swf-field">
                  <span>Email</span>
                  <input type="email" value={values.email} onChange={(event) => updateValue("email", event.target.value)} />
                </label>
              </div>
            )}
            {activeKey === "schedule" && (
              <div className="swf-fields">
                <label className="swf-field">
                  <span>Preferred date</span>
                  <input type="date" value={values.date} onChange={(event) => updateValue("date", event.target.value)} />
                </label>
                <label className="swf-field">
                  <span>Notes</span>
                  <textarea rows={3} value={values.notes} onChange={(event) => updateValue("notes", event.target.value)} />
                </label>
              </div>
            )}
            {activeKey === "review" && (
              <dl className="swf-review">
                <div className="swf-review-row"><dt>Name</dt><dd>{values.name || "—"}</dd></div>
                <div className="swf-review-row"><dt>Email</dt><dd>{values.email || "—"}</dd></div>
                <div className="swf-review-row"><dt>Date</dt><dd>{values.date || "—"}</dd></div>
                <div className="swf-review-row"><dt>Notes</dt><dd>{values.notes || "—"}</dd></div>
              </dl>
            )}

            {error && <p className="swf-error" role="alert">{error}</p>}

            <div className="swf-nav">
              <button type="button" className="swf-secondary" onClick={goBack} disabled={stepIndex === 0}>Back</button>
              <button type="button" className="swf-primary" onClick={goNext}>{isLastStep ? "Submit" : "Continue"}</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
`;

const STEP_WIZARD_FORM_STYLES = `.ofl-custom-step-wizard {
  --swf-accent: #7c3aed;
  --swf-line: #e5e0f7;
  --swf-ink: #1e1b2e;
  font-family: Arial, sans-serif;
  max-width: 34rem;
  margin: 0 auto;
  background: #fff;
  border-radius: 1.25rem;
  border: 1px solid var(--swf-line);
  padding: 2rem;
  color: var(--swf-ink);
}
.ofl-custom-step-wizard .swf-stepper { display: flex; list-style: none; margin: 0 0 2rem; padding: 0; position: relative; }
.ofl-custom-step-wizard .swf-track { position: absolute; top: 1rem; left: 2rem; right: 2rem; height: 3px; background: var(--swf-line); z-index: 0; padding: 0; }
.ofl-custom-step-wizard .swf-track-fill { display: block; height: 100%; width: 100%; background: var(--swf-accent); transform: scaleX(0); transform-origin: left; transition: transform 0.3s ease; }
.ofl-custom-step-wizard .swf-node { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; position: relative; z-index: 1; text-align: center; }
.ofl-custom-step-wizard .swf-circle { width: 2rem; height: 2rem; border-radius: 999px; background: #fff; border: 2px solid var(--swf-line); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.8rem; color: #94899f; }
.ofl-custom-step-wizard .swf-node-complete .swf-circle { background: var(--swf-accent); border-color: var(--swf-accent); color: #fff; }
.ofl-custom-step-wizard .swf-node-current .swf-circle { border-color: var(--swf-accent); color: var(--swf-accent); }
.ofl-custom-step-wizard .swf-node-label { font-size: 0.72rem; color: #94899f; max-width: 6rem; }
.ofl-custom-step-wizard .swf-node-current .swf-node-label, .ofl-custom-step-wizard .swf-node-complete .swf-node-label { color: var(--swf-ink); font-weight: 700; }
.ofl-custom-step-wizard .swf-fields { display: flex; flex-direction: column; gap: 1rem; }
.ofl-custom-step-wizard .swf-field { display: flex; flex-direction: column; gap: 0.35rem; font-size: 0.8rem; font-weight: 600; color: #574f66; }
.ofl-custom-step-wizard .swf-field input, .ofl-custom-step-wizard .swf-field textarea { border: 1px solid var(--swf-line); border-radius: 0.6rem; padding: 0.6rem 0.75rem; font-size: 0.85rem; font-family: inherit; }
.ofl-custom-step-wizard .swf-review { display: flex; flex-direction: column; gap: 0.6rem; margin: 0; }
.ofl-custom-step-wizard .swf-review-row { display: flex; justify-content: space-between; border-bottom: 1px solid var(--swf-line); padding-bottom: 0.5rem; font-size: 0.85rem; }
.ofl-custom-step-wizard .swf-review-row dt { color: #94899f; margin: 0; }
.ofl-custom-step-wizard .swf-review-row dd { margin: 0; font-weight: 700; }
.ofl-custom-step-wizard .swf-error { color: #b91c1c; font-size: 0.8rem; margin: 1rem 0 0; }
.ofl-custom-step-wizard .swf-nav { display: flex; justify-content: space-between; margin-top: 1.75rem; }
.ofl-custom-step-wizard .swf-primary { background: var(--swf-accent); color: #fff; border: none; border-radius: 999px; padding: 0.65rem 1.5rem; font-weight: 700; cursor: pointer; }
.ofl-custom-step-wizard .swf-secondary { background: transparent; border: 1px solid var(--swf-line); border-radius: 999px; padding: 0.65rem 1.5rem; font-weight: 700; cursor: pointer; color: var(--swf-ink); }
.ofl-custom-step-wizard .swf-secondary:disabled { opacity: 0.4; cursor: not-allowed; }
.ofl-custom-step-wizard .swf-success { text-align: center; padding: 1.5rem 0; }
.ofl-custom-step-wizard .swf-success-title { font-size: 1.1rem; font-weight: 800; margin: 0 0 0.5rem; }
.ofl-custom-step-wizard .swf-success-copy { color: #6b6478; font-size: 0.85rem; margin: 0 0 1.25rem; }
@media (max-width: 26rem) { .ofl-custom-step-wizard .swf-node-label { display: none; } }
`;

const BULK_QUOTE_CONFIGURATOR_SOURCE = `import { useState } from "react";

const defaultItems = [
  { id: "style-a", name: "Style A — Crew Neck", sizes: ["S", "M", "L", "XL"] },
  { id: "style-b", name: "Style B — Button Down", sizes: ["S", "M", "L", "XL"] },
  { id: "style-c", name: "Style C — Fleece Jacket", sizes: ["M", "L", "XL", "XXL"] },
];

const defaultPlans = [
  { id: "standard", label: "Standard", description: "Ships in 10-14 business days." },
  { id: "priority", label: "Priority", description: "Ships in 5-7 business days." },
  { id: "express", label: "Express", description: "Ships in 2-3 business days." },
];

function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

export function BulkQuoteConfigurator({
  items = defaultItems,
  plans = defaultPlans,
  minimumUnits = 25,
}) {
  const [contact, setContact] = useState({ name: "", email: "", company: "" });
  const [planId, setPlanId] = useState(plans[0] ? plans[0].id : "");
  const [selection, setSelection] = useState({
    itemId: items[0] ? items[0].id : "",
    size: items[0] && items[0].sizes[0] ? items[0].sizes[0] : "",
    qty: 1,
  });
  const [cart, setCart] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const totalUnits = cart.reduce((sum, line) => sum + line.qty, 0);
  const meetsMinimum = totalUnits >= minimumUnits;
  const selectedItem = items.find((item) => item.id === selection.itemId);

  function addToCart() {
    if (!selectedItem || !selection.size) return;
    setCart((prev) => [
      ...prev,
      {
        id: selectedItem.id + "-" + selection.size + "-" + prev.length + "-" + Date.now(),
        name: selectedItem.name,
        size: selection.size,
        qty: selection.qty,
      },
    ]);
  }

  function updateQty(lineId, delta) {
    setCart((prev) =>
      prev.map((line) => (line.id === lineId ? { ...line, qty: Math.max(1, line.qty + delta) } : line))
    );
  }

  function removeLine(lineId) {
    setCart((prev) => prev.filter((line) => line.id !== lineId));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (cart.length === 0 || !contact.name.trim() || !contact.email.trim()) return;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="ofl-custom-bulk-quote">
        <div className="bqc-success">
          <p className="bqc-success-title">Quote request received</p>
          <p className="bqc-success-copy">A generalized confirmation summary would appear here, along with a reference number.</p>
        </div>
      </div>
    );
  }

  return (
    <form className="ofl-custom-bulk-quote" onSubmit={handleSubmit}>
      <div className="bqc-main">
        <section className="bqc-card">
          <h3 className="bqc-card-title">Contact</h3>
          <div className="bqc-fields">
            <label className="bqc-field">
              <span>Full name</span>
              <input type="text" value={contact.name} onChange={(event) => setContact((prev) => ({ ...prev, name: event.target.value }))} />
            </label>
            <label className="bqc-field">
              <span>Email</span>
              <input type="email" value={contact.email} onChange={(event) => setContact((prev) => ({ ...prev, email: event.target.value }))} />
            </label>
            <label className="bqc-field">
              <span>Company</span>
              <input type="text" value={contact.company} onChange={(event) => setContact((prev) => ({ ...prev, company: event.target.value }))} />
            </label>
          </div>
        </section>

        <section className="bqc-card">
          <h3 className="bqc-card-title">Choose a service level</h3>
          <div className="bqc-choice-grid">
            {plans.map((plan) => (
              <label key={plan.id} className={cx("bqc-choice-card", planId === plan.id && "is-selected")}>
                <input
                  type="radio"
                  name="bqc-plan"
                  value={plan.id}
                  checked={planId === plan.id}
                  onChange={() => setPlanId(plan.id)}
                />
                <span className="bqc-choice-label">{plan.label}</span>
                <span className="bqc-choice-desc">{plan.description}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="bqc-card">
          <h3 className="bqc-card-title">Add items</h3>
          <div className="bqc-item-row">
            <label className="bqc-field">
              <span>Style</span>
              <select
                value={selection.itemId}
                onChange={(event) => {
                  const item = items.find((candidate) => candidate.id === event.target.value);
                  setSelection({ itemId: event.target.value, size: item ? item.sizes[0] : "", qty: 1 });
                }}
              >
                {items.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </label>
            <label className="bqc-field">
              <span>Size</span>
              <select value={selection.size} onChange={(event) => setSelection((prev) => ({ ...prev, size: event.target.value }))}>
                {(selectedItem ? selectedItem.sizes : []).map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </label>
            <div className="bqc-field">
              <span>Quantity</span>
              <div className="bqc-stepper">
                <button type="button" aria-label="Decrease quantity" onClick={() => setSelection((prev) => ({ ...prev, qty: Math.max(1, prev.qty - 1) }))}>−</button>
                <span className="bqc-stepper-value">{selection.qty}</span>
                <button type="button" aria-label="Increase quantity" onClick={() => setSelection((prev) => ({ ...prev, qty: prev.qty + 1 }))}>+</button>
              </div>
            </div>
            <button type="button" className="bqc-add" onClick={addToCart}>Add to quote</button>
          </div>
        </section>
      </div>

      <aside className="bqc-summary">
        <h3 className="bqc-card-title">Your quote</h3>
        {cart.length === 0 ? (
          <p className="bqc-empty">No items added yet.</p>
        ) : (
          <ul className="bqc-cart">
            {cart.map((line) => (
              <li key={line.id} className="bqc-cart-line">
                <div>
                  <p className="bqc-cart-name">{line.name}</p>
                  <p className="bqc-cart-meta">Size {line.size}</p>
                </div>
                <div className="bqc-cart-controls">
                  <button type="button" aria-label={"Decrease quantity for " + line.name} onClick={() => updateQty(line.id, -1)}>−</button>
                  <span>{line.qty}</span>
                  <button type="button" aria-label={"Increase quantity for " + line.name} onClick={() => updateQty(line.id, 1)}>+</button>
                  <button type="button" className="bqc-remove" aria-label={"Remove " + line.name} onClick={() => removeLine(line.id)}>×</button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <p className="bqc-total">Total units: {totalUnits}</p>
        {!meetsMinimum && cart.length > 0 && (
          <p className="bqc-warning" role="status">Minimum order is {minimumUnits} units. Add {minimumUnits - totalUnits} more to proceed.</p>
        )}
        <button type="submit" className="bqc-submit" disabled={cart.length === 0 || !meetsMinimum}>Request quote</button>
      </aside>
    </form>
  );
}
`;

const BULK_QUOTE_CONFIGURATOR_STYLES = `.ofl-custom-bulk-quote {
  --bqc-ink: #1f2933;
  --bqc-muted: #616e7c;
  --bqc-line: #d9d2c5;
  --bqc-accent: #b45309;
  font-family: Arial, sans-serif;
  color: var(--bqc-ink);
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  max-width: 56rem;
  margin: 0 auto;
}
.ofl-custom-bulk-quote .bqc-main { display: flex; flex-direction: column; gap: 1.25rem; }
.ofl-custom-bulk-quote .bqc-card { border: 1px solid var(--bqc-line); border-radius: 0.9rem; padding: 1.25rem; background: #fffdf9; }
.ofl-custom-bulk-quote .bqc-card-title { margin: 0 0 0.9rem; font-size: 0.95rem; font-weight: 800; }
.ofl-custom-bulk-quote .bqc-fields { display: grid; grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr)); gap: 0.85rem; }
.ofl-custom-bulk-quote .bqc-field { display: flex; flex-direction: column; gap: 0.3rem; font-size: 0.78rem; font-weight: 700; color: var(--bqc-muted); }
.ofl-custom-bulk-quote .bqc-field input, .ofl-custom-bulk-quote .bqc-field select { border: 1px solid var(--bqc-line); border-radius: 0.5rem; padding: 0.5rem 0.65rem; font-size: 0.85rem; font-family: inherit; color: var(--bqc-ink); }
.ofl-custom-bulk-quote .bqc-choice-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr)); gap: 0.75rem; }
.ofl-custom-bulk-quote .bqc-choice-card { position: relative; display: flex; flex-direction: column; gap: 0.3rem; border: 1px solid var(--bqc-line); border-radius: 0.75rem; padding: 0.85rem; cursor: pointer; }
.ofl-custom-bulk-quote .bqc-choice-card input { position: absolute; top: 0.75rem; right: 0.75rem; }
.ofl-custom-bulk-quote .bqc-choice-card.is-selected { border-color: var(--bqc-accent); background: #fef3e8; }
.ofl-custom-bulk-quote .bqc-choice-label { font-weight: 800; font-size: 0.85rem; }
.ofl-custom-bulk-quote .bqc-choice-desc { font-size: 0.75rem; color: var(--bqc-muted); }
.ofl-custom-bulk-quote .bqc-item-row { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 0.85rem; }
.ofl-custom-bulk-quote .bqc-stepper { display: flex; align-items: center; gap: 0.5rem; border: 1px solid var(--bqc-line); border-radius: 0.5rem; padding: 0.3rem 0.5rem; }
.ofl-custom-bulk-quote .bqc-stepper button { border: none; background: none; font-size: 1rem; cursor: pointer; color: var(--bqc-accent); width: 1.3rem; }
.ofl-custom-bulk-quote .bqc-stepper-value { min-width: 1.2rem; text-align: center; font-weight: 700; }
.ofl-custom-bulk-quote .bqc-add { background: var(--bqc-accent); color: #fff; border: none; border-radius: 0.55rem; padding: 0.6rem 1.1rem; font-weight: 700; cursor: pointer; height: fit-content; }
.ofl-custom-bulk-quote .bqc-summary { border: 1px solid var(--bqc-line); border-radius: 0.9rem; padding: 1.25rem; background: #fff; height: fit-content; position: sticky; top: 1rem; }
.ofl-custom-bulk-quote .bqc-empty { color: var(--bqc-muted); font-size: 0.85rem; }
.ofl-custom-bulk-quote .bqc-cart { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.75rem; }
.ofl-custom-bulk-quote .bqc-cart-line { display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; border-bottom: 1px solid var(--bqc-line); padding-bottom: 0.6rem; }
.ofl-custom-bulk-quote .bqc-cart-name { margin: 0; font-weight: 700; font-size: 0.85rem; }
.ofl-custom-bulk-quote .bqc-cart-meta { margin: 0.1rem 0 0; font-size: 0.72rem; color: var(--bqc-muted); }
.ofl-custom-bulk-quote .bqc-cart-controls { display: flex; align-items: center; gap: 0.35rem; }
.ofl-custom-bulk-quote .bqc-cart-controls button { border: 1px solid var(--bqc-line); background: #fff; border-radius: 0.4rem; width: 1.5rem; height: 1.5rem; cursor: pointer; }
.ofl-custom-bulk-quote .bqc-remove { color: #b91c1c; border-color: transparent; }
.ofl-custom-bulk-quote .bqc-total { font-weight: 800; margin: 1rem 0 0.5rem; }
.ofl-custom-bulk-quote .bqc-warning { background: #fef3e8; color: var(--bqc-accent); font-size: 0.78rem; padding: 0.6rem 0.75rem; border-radius: 0.5rem; margin: 0 0 1rem; }
.ofl-custom-bulk-quote .bqc-submit { width: 100%; background: var(--bqc-ink); color: #fff; border: none; border-radius: 0.6rem; padding: 0.75rem; font-weight: 800; cursor: pointer; }
.ofl-custom-bulk-quote .bqc-submit:disabled { opacity: 0.4; cursor: not-allowed; }
.ofl-custom-bulk-quote .bqc-success { grid-column: 1 / -1; text-align: center; padding: 2.5rem 1rem; border: 1px dashed var(--bqc-accent); border-radius: 1rem; }
.ofl-custom-bulk-quote .bqc-success-title { font-size: 1.1rem; font-weight: 800; margin: 0 0 0.5rem; }
.ofl-custom-bulk-quote .bqc-success-copy { color: var(--bqc-muted); margin: 0; }
@media (max-width: 42rem) { .ofl-custom-bulk-quote { grid-template-columns: 1fr; } .ofl-custom-bulk-quote .bqc-summary { position: static; } }
`;

const ERP_DASHBOARD_PANEL_SOURCE = `const defaultStats = [
  { id: "revenue", label: "Revenue", value: "48.2k", delta: "+12.4%", trend: "up" },
  { id: "orders", label: "Orders", value: "1,284", delta: "+4.1%", trend: "up" },
  { id: "active-users", label: "Active Users", value: "312", delta: "-2.3%", trend: "down" },
  { id: "tickets", label: "Open Tickets", value: "18", delta: "+3", trend: "flat" },
];

const defaultColumns = [
  { key: "name", label: "Name" },
  { key: "status", label: "Status" },
  { key: "owner", label: "Owner" },
  { key: "updated", label: "Updated" },
];

const defaultRows = [
  { id: "row-1", name: "Quarterly Report", status: "Complete", owner: "A. Rivera", updated: "2 hours ago" },
  { id: "row-2", name: "Client Onboarding", status: "In Progress", owner: "J. Chen", updated: "Yesterday" },
  { id: "row-3", name: "Inventory Audit", status: "Blocked", owner: "S. Patel", updated: "3 days ago" },
  { id: "row-4", name: "Vendor Review", status: "In Progress", owner: "M. Okafor", updated: "4 days ago" },
];

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function TrendIcon({ trend }) {
  if (trend === "up") {
    return (
      <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
        <path d="M4 16l6-6 4 4 6-8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (trend === "down") {
    return (
      <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
        <path d="M4 8l6 6 4-4 6 8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
      <path d="M4 12h16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function ErpDashboardPanel({
  title = "Overview",
  stats = defaultStats,
  columns = defaultColumns,
  rows = defaultRows,
}) {
  return (
    <section className="ofl-custom-erp-dashboard" aria-label={title}>
      <h2 className="edp-heading">{title}</h2>
      <ul className="edp-stat-row">
        {stats.map((stat) => (
          <li key={stat.id} className="edp-stat-card">
            <div className="edp-stat-top">
              <span className="edp-stat-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <rect x="3" y="3" width="18" height="18" rx="4" fill="currentColor" opacity="0.15" />
                  <path d="M8 13l3 3 5-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className={"edp-trend edp-trend-" + stat.trend}>
                <TrendIcon trend={stat.trend} />
                {stat.delta}
              </span>
            </div>
            <p className="edp-stat-value">{stat.value}</p>
            <p className="edp-stat-label">{stat.label}</p>
          </li>
        ))}
      </ul>

      <div className="edp-table-wrap">
        <table className="edp-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key} scope="col">{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                {columns.map((column) => (
                  <td key={column.key} data-label={column.label}>
                    {column.key === "status" ? (
                      <span className={"edp-status edp-status-" + slugify(row.status)}>{row[column.key]}</span>
                    ) : (
                      row[column.key]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
`;

const ERP_DASHBOARD_PANEL_STYLES = `.ofl-custom-erp-dashboard {
  --edp-ink: #101828;
  --edp-muted: #667085;
  --edp-line: #eaecf0;
  --edp-accent: #155eef;
  font-family: Arial, sans-serif;
  color: var(--edp-ink);
  background: #fff;
  border: 1px solid var(--edp-line);
  border-radius: 1rem;
  padding: 1.5rem;
}
.ofl-custom-erp-dashboard .edp-heading { margin: 0 0 1.25rem; font-size: 1.1rem; font-weight: 800; }
.ofl-custom-erp-dashboard .edp-stat-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr)); gap: 1rem; list-style: none; margin: 0 0 1.75rem; padding: 0; }
.ofl-custom-erp-dashboard .edp-stat-card { border: 1px solid var(--edp-line); border-radius: 0.75rem; padding: 1rem; background: #f9fafb; }
.ofl-custom-erp-dashboard .edp-stat-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; }
.ofl-custom-erp-dashboard .edp-stat-icon { width: 1.75rem; height: 1.75rem; border-radius: 0.5rem; background: rgba(21, 94, 239, 0.12); color: var(--edp-accent); display: flex; align-items: center; justify-content: center; }
.ofl-custom-erp-dashboard .edp-trend { display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.72rem; font-weight: 800; }
.ofl-custom-erp-dashboard .edp-trend-up { color: #067647; }
.ofl-custom-erp-dashboard .edp-trend-down { color: #b42318; }
.ofl-custom-erp-dashboard .edp-trend-flat { color: var(--edp-muted); }
.ofl-custom-erp-dashboard .edp-stat-value { margin: 0; font-size: 1.5rem; font-weight: 800; font-variant-numeric: tabular-nums; }
.ofl-custom-erp-dashboard .edp-stat-label { margin: 0.2rem 0 0; font-size: 0.78rem; color: var(--edp-muted); }
.ofl-custom-erp-dashboard .edp-table-wrap { overflow-x: auto; }
.ofl-custom-erp-dashboard .edp-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
.ofl-custom-erp-dashboard .edp-table th { text-align: left; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--edp-muted); padding: 0.6rem 0.75rem; border-bottom: 1px solid var(--edp-line); }
.ofl-custom-erp-dashboard .edp-table td { padding: 0.7rem 0.75rem; border-bottom: 1px solid var(--edp-line); }
.ofl-custom-erp-dashboard .edp-table tbody tr:nth-child(even) { background: #fafafa; }
.ofl-custom-erp-dashboard .edp-status { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.72rem; font-weight: 700; background: #eef2f6; color: var(--edp-muted); }
.ofl-custom-erp-dashboard .edp-status-complete { background: #ecfdf3; color: #067647; }
.ofl-custom-erp-dashboard .edp-status-in-progress { background: #eff4ff; color: var(--edp-accent); }
.ofl-custom-erp-dashboard .edp-status-blocked { background: #fef3f2; color: #b42318; }
@media (max-width: 34rem) {
  .ofl-custom-erp-dashboard .edp-table thead { display: none; }
  .ofl-custom-erp-dashboard .edp-table, .ofl-custom-erp-dashboard .edp-table tbody, .ofl-custom-erp-dashboard .edp-table tr, .ofl-custom-erp-dashboard .edp-table td { display: block; width: 100%; }
  .ofl-custom-erp-dashboard .edp-table tr { border: 1px solid var(--edp-line); border-radius: 0.6rem; margin-bottom: 0.75rem; padding: 0.5rem 0.75rem; }
  .ofl-custom-erp-dashboard .edp-table td { border-bottom: none; display: flex; justify-content: space-between; gap: 1rem; padding: 0.35rem 0; }
  .ofl-custom-erp-dashboard .edp-table td::before { content: attr(data-label); font-weight: 700; color: var(--edp-muted); }
}
`;

const VARIANT_SWATCH_PICKER_SOURCE = `import { useState } from "react";

const defaultColorOptions = [
  { id: "ocean", label: "Ocean Blue", hex: "#2b6cb0" },
  { id: "sand", label: "Sand", hex: "#d8c3a5" },
  { id: "forest", label: "Forest Green", hex: "#276749" },
  { id: "charcoal", label: "Charcoal", hex: "#2d3748" },
];

const defaultMaterialOptions = [
  { id: "cotton", label: "Cotton" },
  { id: "linen", label: "Linen" },
  { id: "blend", label: "Poly Blend" },
];

const defaultSizeOptions = ["XS", "S", "M", "L", "XL"];

const defaultSizeChart = [
  { size: "S", chest: "36-38 in", length: "27 in" },
  { size: "M", chest: "39-41 in", length: "28 in" },
  { size: "L", chest: "42-44 in", length: "29 in" },
  { size: "XL", chest: "45-47 in", length: "30 in" },
];

function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

export function VariantSwatchPicker({
  colorOptions = defaultColorOptions,
  materialOptions = defaultMaterialOptions,
  sizeOptions = defaultSizeOptions,
  sizeChart = defaultSizeChart,
}) {
  const [activeTab, setActiveTab] = useState("color");
  const [color, setColor] = useState(colorOptions[0] ? colorOptions[0].id : "");
  const [material, setMaterial] = useState(materialOptions[0] ? materialOptions[0].id : "");
  const [size, setSize] = useState(sizeOptions[Math.floor(sizeOptions.length / 2)] || "");
  const [isChartOpen, setIsChartOpen] = useState(false);

  const tabs = [
    { key: "color", label: "Color" },
    { key: "material", label: "Material" },
  ];

  const selectedColor = colorOptions.find((option) => option.id === color);
  const selectedMaterial = materialOptions.find((option) => option.id === material);

  return (
    <div className="ofl-custom-swatch-picker">
      <div className="vsp-tabs" role="tablist" aria-label="Variant attributes">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.key}
            className={cx("vsp-tab", activeTab === tab.key && "is-active")}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "color" && (
        <div className="vsp-swatch-row" role="tabpanel">
          {colorOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              className={cx("vsp-swatch", color === option.id && "is-selected")}
              style={{ backgroundColor: option.hex }}
              aria-label={option.label}
              aria-pressed={color === option.id}
              onClick={() => setColor(option.id)}
            >
              <span className="vsp-tooltip">{option.label}</span>
            </button>
          ))}
        </div>
      )}

      {activeTab === "material" && (
        <div className="vsp-material-row" role="tabpanel">
          {materialOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              className={cx("vsp-material", material === option.id && "is-selected")}
              aria-pressed={material === option.id}
              onClick={() => setMaterial(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      <div className="vsp-size-row">
        <div className="vsp-size-pills">
          {sizeOptions.map((option) => (
            <button
              key={option}
              type="button"
              className={cx("vsp-size-pill", size === option && "is-selected")}
              aria-pressed={size === option}
              onClick={() => setSize(option)}
            >
              {option}
            </button>
          ))}
        </div>
        <button type="button" className="vsp-size-guide-link" onClick={() => setIsChartOpen(true)}>
          Size guide
        </button>
      </div>

      <p className="vsp-summary">
        Selected: {selectedColor ? selectedColor.label : "—"} · {selectedMaterial ? selectedMaterial.label : "—"} · Size {size || "—"}
      </p>

      {isChartOpen && (
        <div className="vsp-modal-overlay" onClick={() => setIsChartOpen(false)}>
          <div
            className="vsp-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Size guide"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="vsp-modal-header">
              <p className="vsp-modal-title">Size guide</p>
              <button type="button" className="vsp-modal-close" aria-label="Close size guide" onClick={() => setIsChartOpen(false)}>
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <table className="vsp-chart-table">
              <thead>
                <tr>
                  <th scope="col">Size</th>
                  <th scope="col">Chest</th>
                  <th scope="col">Length</th>
                </tr>
              </thead>
              <tbody>
                {sizeChart.map((row) => (
                  <tr key={row.size}>
                    <td>{row.size}</td>
                    <td>{row.chest}</td>
                    <td>{row.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
`;

const VARIANT_SWATCH_PICKER_STYLES = `.ofl-custom-swatch-picker {
  --vsp-ink: #211f26;
  --vsp-muted: #7a7686;
  --vsp-line: #e4e1ea;
  --vsp-accent: #b23a6b;
  font-family: Arial, sans-serif;
  color: var(--vsp-ink);
  max-width: 26rem;
  position: relative;
}
.ofl-custom-swatch-picker .vsp-tabs { display: flex; gap: 1.5rem; border-bottom: 1px solid var(--vsp-line); margin-bottom: 1.25rem; }
.ofl-custom-swatch-picker .vsp-tab { background: none; border: none; padding: 0 0 0.7rem; font-size: 0.85rem; font-weight: 700; color: var(--vsp-muted); cursor: pointer; border-bottom: 2px solid transparent; }
.ofl-custom-swatch-picker .vsp-tab.is-active { color: var(--vsp-ink); border-color: var(--vsp-accent); }
.ofl-custom-swatch-picker .vsp-swatch-row { display: flex; gap: 0.9rem; margin-bottom: 1.5rem; }
.ofl-custom-swatch-picker .vsp-swatch { position: relative; width: 2.4rem; height: 2.4rem; border-radius: 999px; border: 2px solid transparent; cursor: pointer; padding: 0; box-shadow: inset 0 0 0 1px rgba(0,0,0,0.08); }
.ofl-custom-swatch-picker .vsp-swatch.is-selected { border-color: var(--vsp-accent); box-shadow: 0 0 0 2px #fff, 0 0 0 4px var(--vsp-accent); }
.ofl-custom-swatch-picker .vsp-tooltip { position: absolute; bottom: 120%; left: 50%; transform: translateX(-50%); background: var(--vsp-ink); color: #fff; font-size: 0.68rem; padding: 0.2rem 0.5rem; border-radius: 0.35rem; white-space: nowrap; opacity: 0; pointer-events: none; transition: opacity 0.15s ease; }
.ofl-custom-swatch-picker .vsp-swatch:hover .vsp-tooltip, .ofl-custom-swatch-picker .vsp-swatch:focus-visible .vsp-tooltip { opacity: 1; }
.ofl-custom-swatch-picker .vsp-material-row { display: flex; flex-wrap: wrap; gap: 0.6rem; margin-bottom: 1.5rem; }
.ofl-custom-swatch-picker .vsp-material { border: 1px solid var(--vsp-line); border-radius: 0.6rem; padding: 0.5rem 0.9rem; background: #fff; font-size: 0.8rem; cursor: pointer; }
.ofl-custom-swatch-picker .vsp-material.is-selected { border-color: var(--vsp-accent); background: #fbeaf1; color: var(--vsp-accent); font-weight: 700; }
.ofl-custom-swatch-picker .vsp-size-row { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1rem; }
.ofl-custom-swatch-picker .vsp-size-pills { display: flex; gap: 0.5rem; }
.ofl-custom-swatch-picker .vsp-size-pill { width: 2.1rem; height: 2.1rem; border-radius: 999px; border: 1px solid var(--vsp-line); background: #fff; font-size: 0.75rem; font-weight: 700; cursor: pointer; }
.ofl-custom-swatch-picker .vsp-size-pill.is-selected { background: var(--vsp-ink); border-color: var(--vsp-ink); color: #fff; }
.ofl-custom-swatch-picker .vsp-size-guide-link { background: none; border: none; text-decoration: underline; font-size: 0.78rem; color: var(--vsp-accent); cursor: pointer; padding: 0; }
.ofl-custom-swatch-picker .vsp-summary { font-size: 0.82rem; color: var(--vsp-muted); border-top: 1px solid var(--vsp-line); padding-top: 0.85rem; margin: 0; }
.ofl-custom-swatch-picker .vsp-modal-overlay { position: fixed; inset: 0; background: rgba(20, 16, 30, 0.45); display: flex; align-items: center; justify-content: center; z-index: 50; padding: 1rem; }
.ofl-custom-swatch-picker .vsp-modal { background: #fff; border-radius: 0.9rem; padding: 1.25rem; width: min(22rem, 100%); box-shadow: 0 20px 45px rgba(20,16,30,0.3); }
.ofl-custom-swatch-picker .vsp-modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.ofl-custom-swatch-picker .vsp-modal-title { margin: 0; font-weight: 800; }
.ofl-custom-swatch-picker .vsp-modal-close { border: none; background: none; cursor: pointer; color: var(--vsp-muted); }
.ofl-custom-swatch-picker .vsp-chart-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
.ofl-custom-swatch-picker .vsp-chart-table th, .ofl-custom-swatch-picker .vsp-chart-table td { text-align: left; padding: 0.5rem 0.4rem; border-bottom: 1px solid var(--vsp-line); }
`;

const CERTIFICATION_BADGE_SOURCE = `export function CertificationBadge({
  label = "ISO 9001:2015",
  description = "Certified quality management system",
  issuer = "Generic Standards Body",
  issuedYear = "2024",
  variant = "card",
  tone = "light",
  href = "#",
}) {
  const shieldIcon = (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d="M12 2l7 3v6c0 4.97-3.05 8.66-7 10-3.95-1.34-7-5.03-7-10V5l7-3z" fill="currentColor" opacity="0.16" />
      <path d="M12 2l7 3v6c0 4.97-3.05 8.66-7 10-3.95-1.34-7-5.03-7-10V5l7-3z" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8.5 12.2l2.4 2.4L15.6 9.4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  if (variant === "pill") {
    return (
      <span className={"ofl-custom-certification-badge cb-pill cb-tone-" + tone}>
        <span className="cb-icon" aria-hidden="true">{shieldIcon}</span>
        <span className="cb-pill-label">{label}</span>
      </span>
    );
  }

  return (
    <a className="ofl-custom-certification-badge cb-card" href={href}>
      <span className="cb-icon cb-icon-lg" aria-hidden="true">{shieldIcon}</span>
      <span className="cb-card-body">
        <span className="cb-card-label">{label}</span>
        <span className="cb-card-desc">{description}</span>
        <span className="cb-card-meta">{issuer} · {issuedYear}</span>
      </span>
      <span className="cb-card-arrow" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="14" height="14">
          <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </a>
  );
}
`;

const CERTIFICATION_BADGE_STYLES = `.ofl-custom-certification-badge {
  font-family: Arial, sans-serif;
  color: #1b1b1f;
}
.ofl-custom-certification-badge.cb-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.75rem 0.35rem 0.5rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  border: 1px solid transparent;
}
.ofl-custom-certification-badge.cb-tone-light { background: #eef2f6; color: #1b1b1f; }
.ofl-custom-certification-badge.cb-tone-dark { background: #101828; color: #fff; }
.ofl-custom-certification-badge.cb-tone-outline { background: transparent; border-color: #c9cdd6; color: #1b1b1f; }
.ofl-custom-certification-badge .cb-icon { display: inline-flex; color: #2563eb; }
.ofl-custom-certification-badge.cb-tone-dark .cb-icon { color: #7fb2ff; }
.ofl-custom-certification-badge.cb-card {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  text-decoration: none;
  color: inherit;
  border: 1px solid #e4e6ea;
  border-radius: 0.9rem;
  padding: 1rem 1.1rem;
  max-width: 22rem;
  transition: box-shadow 0.15s ease, transform 0.15s ease;
}
.ofl-custom-certification-badge.cb-card:hover { box-shadow: 0 12px 28px rgba(20,20,30,0.1); transform: translateY(-1px); }
.ofl-custom-certification-badge .cb-icon-lg { color: #2563eb; flex-shrink: 0; }
.ofl-custom-certification-badge .cb-card-body { display: flex; flex-direction: column; gap: 0.15rem; }
.ofl-custom-certification-badge .cb-card-label { font-weight: 800; font-size: 0.9rem; }
.ofl-custom-certification-badge .cb-card-desc { font-size: 0.78rem; color: #5b616e; }
.ofl-custom-certification-badge .cb-card-meta { font-size: 0.72rem; color: #8a90a0; }
.ofl-custom-certification-badge .cb-card-arrow { margin-left: auto; color: #b0b5c0; }
`;

export const customComponents = [
  {
    schemaVersion: 1,
    id: "custom.ai-chat-widget",
    name: "AI Chat Widget",
    category: "custom",
    description:
      "Floating support-chat launcher that expands into a message thread with a typing indicator, quick-reply suggestion chips, and a composer.",
    tags: ["chat", "widget", "support", "conversation", "floating"],
    sourceProject: "pm_chatbot",
    exportName: "AiChatWidget",
    fileName: "AiChatWidget.jsx",
    dependencies: [],
    defaultProps: {
      title: "Assistant",
      subtitle: "Usually replies in a few minutes",
      placeholder: "Type a message...",
      initialMessages: [
        { id: "msg-welcome", role: "assistant", text: "Hi! I can help you find what you're looking for. Ask me anything." },
      ],
      suggestions: ["What can you help with?", "Show me pricing options", "Talk to a person"],
      defaultOpen: true,
    },
    accessibility: [
      "The launcher button sets aria-expanded and an aria-label that reflects whether the panel is open or closed, and the panel itself carries role=\"dialog\" with a matching aria-label.",
      "The typing indicator is exposed to assistive tech via role=\"status\" and an aria-label naming who is typing, rather than relying on the animated dots alone.",
    ],
    source: AI_CHAT_WIDGET_SOURCE,
    styles: AI_CHAT_WIDGET_STYLES,
  },
  {
    schemaVersion: 1,
    id: "custom.order-tracking-timeline",
    name: "Order Tracking Timeline",
    category: "custom",
    description:
      "Shipment tracker with a status pill, a numbered horizontal progress stepper, hold/cancelled banners, a key-stat row, and a collapsible vertical activity timeline.",
    tags: ["tracking", "timeline", "stepper", "shipping", "status"],
    sourceProject: "stitchmarkuniform",
    exportName: "OrderTrackingTimeline",
    fileName: "OrderTrackingTimeline.jsx",
    dependencies: [],
    defaultProps: {
      orderNumber: "ORD-48213",
      statusLabel: "In Transit",
      currentStep: 3,
      isOnHold: false,
      isCancelled: false,
    },
    accessibility: [
      "Each step's completion state is conveyed through a checkmark icon and text label together, not through color alone, so it reads correctly without color vision.",
      "The detailed-activity toggle button uses aria-expanded so screen reader users know whether the timeline list is currently shown.",
    ],
    source: ORDER_TRACKING_TIMELINE_SOURCE,
    styles: ORDER_TRACKING_TIMELINE_STYLES,
  },
  {
    schemaVersion: 1,
    id: "custom.step-wizard-form",
    name: "Step Wizard Form",
    category: "custom",
    description:
      "Multi-step form wizard with a circular-node progress stepper with an animated fill connector, per-step validation, a review step, and a success screen.",
    tags: ["wizard", "form", "stepper", "multi-step", "onboarding"],
    sourceProject: "nac",
    exportName: "StepWizardForm",
    fileName: "StepWizardForm.jsx",
    dependencies: [],
    defaultProps: {
      steps: [
        { key: "details", label: "Your details" },
        { key: "schedule", label: "Schedule" },
        { key: "review", label: "Review" },
      ],
      initialValues: { name: "", email: "", date: "", notes: "" },
    },
    accessibility: [
      "Validation errors are surfaced in a role=\"alert\" element next to the navigation controls so they are announced immediately.",
      "The current step's stepper node sets aria-current=\"step\", giving assistive tech an unambiguous progress indicator beyond the visual fill.",
    ],
    source: STEP_WIZARD_FORM_SOURCE,
    styles: STEP_WIZARD_FORM_STYLES,
  },
  {
    schemaVersion: 1,
    id: "custom.bulk-quote-configurator",
    name: "Bulk Quote Configurator",
    category: "custom",
    description:
      "B2B bulk order form with sectioned cards for contact info and service-level choice cards, a style/size/quantity picker, and a live cart sidebar with a minimum-order-quantity warning.",
    tags: ["form", "quote", "configurator", "b2b", "cart"],
    sourceProject: "aqsurgical",
    exportName: "BulkQuoteConfigurator",
    fileName: "BulkQuoteConfigurator.jsx",
    dependencies: [],
    defaultProps: {
      items: [
        { id: "style-a", name: "Style A — Crew Neck", sizes: ["S", "M", "L", "XL"] },
        { id: "style-b", name: "Style B — Button Down", sizes: ["S", "M", "L", "XL"] },
        { id: "style-c", name: "Style C — Fleece Jacket", sizes: ["M", "L", "XL", "XXL"] },
      ],
      plans: [
        { id: "standard", label: "Standard", description: "Ships in 10-14 business days." },
        { id: "priority", label: "Priority", description: "Ships in 5-7 business days." },
        { id: "express", label: "Express", description: "Ships in 2-3 business days." },
      ],
      minimumUnits: 25,
    },
    accessibility: [
      "Quantity steppers use descriptive aria-label text (e.g. \"Increase quantity for Style A\") instead of relying on a plus/minus glyph alone.",
      "Service-level options are native input[type=\"radio\"] elements wrapped in their own <label>, so the whole choice card is keyboard- and screen-reader-operable.",
    ],
    source: BULK_QUOTE_CONFIGURATOR_SOURCE,
    styles: BULK_QUOTE_CONFIGURATOR_STYLES,
  },
  {
    schemaVersion: 1,
    id: "custom.erp-dashboard-panel",
    name: "ERP Dashboard Panel",
    category: "custom",
    description:
      "Admin dashboard panel combining a KPI stat-card row (value, trend arrow, delta) with a data table that collapses into labeled stacked cards on narrow screens.",
    tags: ["dashboard", "erp", "stats", "table", "admin"],
    sourceProject: "ERPS/allahrakhaandco",
    exportName: "ErpDashboardPanel",
    fileName: "ErpDashboardPanel.jsx",
    dependencies: [],
    defaultProps: {
      title: "Overview",
      stats: [
        { id: "revenue", label: "Revenue", value: "48.2k", delta: "+12.4%", trend: "up" },
        { id: "orders", label: "Orders", value: "1,284", delta: "+4.1%", trend: "up" },
        { id: "active-users", label: "Active Users", value: "312", delta: "-2.3%", trend: "down" },
        { id: "tickets", label: "Open Tickets", value: "18", delta: "+3", trend: "flat" },
      ],
    },
    accessibility: [
      "Status values render as a colored pill plus its literal text label together, so status is never conveyed by color alone.",
      "Table headers use scope=\"col\" for correct column association, and the mobile card layout keeps each value paired with its attr(data-label) heading.",
    ],
    source: ERP_DASHBOARD_PANEL_SOURCE,
    styles: ERP_DASHBOARD_PANEL_STYLES,
  },
  {
    schemaVersion: 1,
    id: "custom.variant-swatch-picker",
    name: "Variant Swatch Picker",
    category: "custom",
    description:
      "Tabbed product-variant picker with circular color swatches (ring highlight and hover tooltip), a material chip row, a size-pill row, and a modal size-chart guide.",
    tags: ["swatch", "variant", "picker", "size-chart", "product"],
    sourceProject: "collars",
    exportName: "VariantSwatchPicker",
    fileName: "VariantSwatchPicker.jsx",
    dependencies: [],
    defaultProps: {
      colorOptions: [
        { id: "ocean", label: "Ocean Blue", hex: "#2b6cb0" },
        { id: "sand", label: "Sand", hex: "#d8c3a5" },
        { id: "forest", label: "Forest Green", hex: "#276749" },
        { id: "charcoal", label: "Charcoal", hex: "#2d3748" },
      ],
      materialOptions: [
        { id: "cotton", label: "Cotton" },
        { id: "linen", label: "Linen" },
        { id: "blend", label: "Poly Blend" },
      ],
      sizeOptions: ["XS", "S", "M", "L", "XL"],
    },
    accessibility: [
      "Every swatch, material, and size button has an aria-label or visible text naming the option and aria-pressed reflecting selection state, so choices never depend on color perception alone.",
      "The size-guide overlay uses role=\"dialog\" with aria-modal=\"true\" and a labelled close button, and clicking the backdrop or the close button both dismiss it.",
    ],
    source: VARIANT_SWATCH_PICKER_SOURCE,
    styles: VARIANT_SWATCH_PICKER_STYLES,
  },
  {
    schemaVersion: 1,
    id: "custom.certification-badge",
    name: "Certification Badge",
    category: "custom",
    description:
      "Compliance/certification badge with two renderings from one component: a compact inline pill (light/dark/outline tones) and a full credential card with issuer, year, and a link affordance.",
    tags: ["badge", "certification", "compliance", "credential", "trust"],
    sourceProject: "allahrakhaandco",
    exportName: "CertificationBadge",
    fileName: "CertificationBadge.jsx",
    dependencies: [],
    defaultProps: {
      label: "ISO 9001:2015",
      description: "Certified quality management system",
      issuer: "Generic Standards Body",
      issuedYear: "2024",
      variant: "card",
      tone: "light",
    },
    accessibility: [
      "The shield icon is marked aria-hidden=\"true\" in both variants because the label, description, and issuer are already present as real visible text, so meaning never depends on the icon alone.",
    ],
    source: CERTIFICATION_BADGE_SOURCE,
    styles: CERTIFICATION_BADGE_STYLES,
  },
];
