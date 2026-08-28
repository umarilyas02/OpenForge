import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { EventError } from "../src/errors.js";
import { createEventBus } from "../src/event-bus.js";

const sitePublishedSchema = z
  .object({ siteId: z.string().min(1), publishedAt: z.string().datetime() })
  .strict();

describe("createEventBus", () => {
  it("publishes a valid event to every subscribed handler", async () => {
    const bus = createEventBus({
      schemas: { "site.published": sitePublishedSchema },
    });
    const handler = vi.fn();
    bus.on("site.published", handler);

    await bus.publish("site.published", {
      siteId: "site_1",
      publishedAt: "2026-08-28T00:00:00.000Z",
    });

    expect(handler).toHaveBeenCalledWith({
      siteId: "site_1",
      publishedAt: "2026-08-28T00:00:00.000Z",
    });
  });

  it("rejects publishing an unregistered event", async () => {
    const bus = createEventBus({ schemas: {} });

    await expect(bus.publish("unknown.event", {})).rejects.toThrow(EventError);
  });

  it("rejects a payload that fails schema validation", async () => {
    const bus = createEventBus({
      schemas: { "site.published": sitePublishedSchema },
    });

    await expect(
      bus.publish("site.published", { siteId: "" }),
    ).rejects.toThrow();
  });

  it("stops delivering to a handler after off()", async () => {
    const bus = createEventBus({
      schemas: { "site.published": sitePublishedSchema },
    });
    const handler = vi.fn();
    const unsubscribe = bus.on("site.published", handler);
    unsubscribe();

    await bus.publish("site.published", {
      siteId: "site_1",
      publishedAt: "2026-08-28T00:00:00.000Z",
    });

    expect(handler).not.toHaveBeenCalled();
  });
});
