export class RecoveryError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = "RecoveryError";
    this.code = code;
    this.details = details;
  }
}

export function createRecoveryState({
  files,
  revision = 0,
  snapshots = [],
  extensions = [],
}) {
  if (!Array.isArray(files) || !Number.isInteger(revision) || revision < 0) {
    throw new TypeError("Recovery state requires files and a valid revision.");
  }
  return {
    files: structuredClone(files),
    revision,
    snapshots: structuredClone(snapshots),
    extensions: structuredClone(extensions),
    safeMode: false,
    status: "ready",
    pendingAction: null,
    announcement: "Recovery tools ready.",
    history: [],
  };
}

export class RecoveryController {
  constructor({
    initialState,
    restoreSnapshot,
    discardOperation,
    resetFromSource,
    onStateChange = () => {},
  }) {
    for (const [name, callback] of Object.entries({
      restoreSnapshot,
      discardOperation,
      resetFromSource,
    })) {
      if (typeof callback !== "function") {
        throw new TypeError(`Recovery controller requires ${name}().`);
      }
    }
    this.state = initialState;
    this.restoreSnapshotCallback = restoreSnapshot;
    this.discardOperationCallback = discardOperation;
    this.resetFromSourceCallback = resetFromSource;
    this.onStateChange = onStateChange;
  }

  async restore(snapshotId) {
    if (!this.state.snapshots.some((snapshot) => snapshot.id === snapshotId)) {
      throw new RecoveryError(
        "OF_RECOVERY_SNAPSHOT_NOT_FOUND",
        `Unknown recovery snapshot: "${snapshotId}".`,
      );
    }
    return this.run("restore-snapshot", async () =>
      this.restoreSnapshotCallback({
        snapshotId,
        baseRevision: this.state.revision,
      }),
    );
  }

  async discard(operationId) {
    if (typeof operationId !== "string" || operationId.length === 0) {
      throw new RecoveryError(
        "OF_RECOVERY_OPERATION_INVALID",
        "Discard requires an operation id.",
      );
    }
    return this.run("discard-operation", async () =>
      this.discardOperationCallback({
        operationId,
        baseRevision: this.state.revision,
      }),
    );
  }

  async reset() {
    return this.run("reset-from-source", async () =>
      this.resetFromSourceCallback({ baseRevision: this.state.revision }),
    );
  }

  enableSafeMode(reason = "User requested recovery mode.") {
    if (this.state.pendingAction) throw pendingError();
    const extensions = this.state.extensions.map((extension) => ({
      ...extension,
      enabled: extension.official === true ? extension.enabled : false,
    }));
    this.commit({
      ...this.state,
      extensions,
      safeMode: true,
      status: "safe-mode",
      announcement: `Safe mode enabled. Third-party extensions are disabled. ${reason}`,
      history: [
        ...this.state.history,
        { type: "enable-safe-mode", revision: this.state.revision },
      ],
    });
    return this.state;
  }

  disableSafeMode() {
    if (this.state.pendingAction) throw pendingError();
    this.commit({
      ...this.state,
      safeMode: false,
      status: "ready",
      announcement:
        "Safe mode disabled. Third-party extensions remain disabled until explicitly enabled.",
      history: [
        ...this.state.history,
        { type: "disable-safe-mode", revision: this.state.revision },
      ],
    });
    return this.state;
  }

  async run(type, execute) {
    if (this.state.pendingAction) throw pendingError();
    this.commit({
      ...this.state,
      pendingAction: type,
      status: "recovering",
      announcement: `${humanize(type)} started.`,
    });
    try {
      const result = await execute();
      if (
        !Array.isArray(result?.files) ||
        !Number.isInteger(result?.nextRevision) ||
        result.nextRevision <= this.state.revision
      ) {
        throw new RecoveryError(
          "OF_RECOVERY_RESULT_INVALID",
          "Recovery callback returned an invalid result.",
        );
      }
      this.commit({
        ...this.state,
        files: structuredClone(result.files),
        revision: result.nextRevision,
        pendingAction: null,
        status: this.state.safeMode ? "safe-mode" : "ready",
        announcement: `${humanize(type)} completed at revision ${result.nextRevision}.`,
        history: [
          ...this.state.history,
          { type, revision: result.nextRevision },
        ],
      });
      return result;
    } catch (error) {
      this.commit({
        ...this.state,
        pendingAction: null,
        status: "recovery-failed",
        announcement: `${humanize(type)} failed. Project source was not replaced.`,
      });
      throw error;
    }
  }

  commit(state) {
    this.state = state;
    this.onStateChange(state);
  }
}

function pendingError() {
  return new RecoveryError(
    "OF_RECOVERY_PENDING",
    "Wait for the active recovery action to finish.",
  );
}

function humanize(type) {
  return type
    .split("-")
    .map((part) => `${part[0].toUpperCase()}${part.slice(1)}`)
    .join(" ");
}
