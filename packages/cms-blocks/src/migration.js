function clone(value) {
  return structuredClone(value);
}

function setAtPath(target, path, value) {
  if (!(path in target)) {
    target[path] = clone(value);
  }
}

/**
 * @param {Record<string, unknown>} props
 * @param {{ changes: Array<{type: string}> }} migration
 */
export function applyCmsBlockMigration(props, migration) {
  const next = clone(props);

  for (const change of migration.changes) {
    if (change.type === "rename-prop" && change.from in next) {
      next[change.to] = next[change.from];
      delete next[change.from];
    } else if (change.type === "set-default") {
      setAtPath(next, change.path, change.value);
    } else if (change.type === "remove-prop") {
      delete next[change.path];
    }
  }

  return next;
}
