import { describe, expect, it, vi } from "vitest";

import {
  RecoveryController,
  RecoveryError,
  createRecoveryState,
} from "../src/index.js";

const originalFiles = [
  { path: "app/page.jsx", source: "export default function Page() {}" },
];
const restoredFiles = [
  {
    path: "app/page.jsx",
    source: "export default function Page() { return null; }",
  },
];

describe("recovery controller", () => {
  it("restores snapshots and announces the new revision", async () => {
    const restoreSnapshot = vi.fn(async () => ({
      files: restoredFiles,
      nextRevision: 6,
    }));
    const controller = fixture({ restoreSnapshot });
    const result = await controller.restore("snapshot_1");

    expect(result.files).toEqual(restoredFiles);
    expect(restoreSnapshot).toHaveBeenCalledWith({
      snapshotId: "snapshot_1",
      baseRevision: 5,
    });
    expect(controller.state).toMatchObject({
      revision: 6,
      status: "ready",
      announcement: "Restore Snapshot completed at revision 6.",
      pendingAction: null,
    });
  });

  it("discards one operation and resets from authoritative source", async () => {
    const discardOperation = vi.fn(async () => ({
      files: restoredFiles,
      nextRevision: 6,
    }));
    const resetFromSource = vi.fn(async () => ({
      files: originalFiles,
      nextRevision: 7,
    }));
    const controller = fixture({ discardOperation, resetFromSource });

    await controller.discard("operation_1");
    expect(discardOperation).toHaveBeenCalledWith({
      operationId: "operation_1",
      baseRevision: 5,
    });
    await controller.reset();
    expect(resetFromSource).toHaveBeenCalledWith({ baseRevision: 6 });
    expect(controller.state.revision).toBe(7);
    expect(controller.state.history.map(({ type }) => type)).toEqual([
      "discard-operation",
      "reset-from-source",
    ]);
  });

  it("safe mode disables only third-party extensions and never auto-enables them", () => {
    const controller = fixture();
    controller.enableSafeMode("A plugin caused the preview failure.");
    expect(controller.state.safeMode).toBe(true);
    expect(controller.state.extensions).toEqual([
      { id: "official", official: true, enabled: true },
      { id: "community", official: false, enabled: false },
      { id: "already-off", official: false, enabled: false },
    ]);
    expect(controller.state.announcement).toContain(
      "Third-party extensions are disabled.",
    );

    controller.disableSafeMode();
    expect(controller.state.safeMode).toBe(false);
    expect(controller.state.extensions[1].enabled).toBe(false);
  });

  it("records failures without replacing files or revisions", async () => {
    const controller = fixture({
      resetFromSource: async () => {
        throw new Error("source unavailable");
      },
    });
    await expect(controller.reset()).rejects.toThrow("source unavailable");
    expect(controller.state).toMatchObject({
      files: originalFiles,
      revision: 5,
      status: "recovery-failed",
      pendingAction: null,
    });
  });

  it("rejects unknown snapshots and concurrent recovery actions", async () => {
    const controller = fixture();
    await expect(controller.restore("missing")).rejects.toMatchObject({
      code: "OF_RECOVERY_SNAPSHOT_NOT_FOUND",
    });
    controller.state = {
      ...controller.state,
      pendingAction: "restore-snapshot",
    };
    expect(() => controller.enableSafeMode()).toThrowError(RecoveryError);
  });
});

function fixture(overrides = {}) {
  return new RecoveryController({
    initialState: createRecoveryState({
      files: originalFiles,
      revision: 5,
      snapshots: [{ id: "snapshot_1", label: "Before layout edit" }],
      extensions: [
        { id: "official", official: true, enabled: true },
        { id: "community", official: false, enabled: true },
        { id: "already-off", official: false, enabled: false },
      ],
    }),
    restoreSnapshot: async () => ({ files: restoredFiles, nextRevision: 6 }),
    discardOperation: async () => ({ files: restoredFiles, nextRevision: 6 }),
    resetFromSource: async () => ({ files: originalFiles, nextRevision: 6 }),
    ...overrides,
  });
}
