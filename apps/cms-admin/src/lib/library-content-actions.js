import { libraryRegistry } from "@openforge/component-library";
import {
  CompilerOperationError,
  applyEditorOperation,
  applyVisualOperation,
} from "@openforge/compiler";

import { commitSiteChanges } from "./site-git.js";
import { getWorkspaceManager } from "./site-workspace.js";
import { findPageRootNodeId } from "./source-content-tree.js";

const LIBRARY_COMPONENTS_DIR = "components/openforge-library";

/**
 * The client-facing catalog for the Blocks tab: everything BlockPalette
 * needs to browse and search (id, name, category, description, tags) with
 * the full component `source`/`styles` text left out — those only matter at
 * insertion time and would otherwise ship ~40 full component sources to
 * every editor page load for nothing.
 */
export function serializeLibraryCatalog() {
  return libraryRegistry.list().map((component) => ({
    id: component.id,
    name: component.name,
    category: component.category,
    description: component.description,
    tags: component.tags,
  }));
}

function renderAttribute(name, value) {
  if (value === true) return name;
  if (typeof value === "string") return `${name}=${JSON.stringify(value)}`;
  return `${name}={${JSON.stringify(value)}}`;
}

function renderLibraryJsx(component, localName) {
  const attributes = Object.entries(component.defaultProps ?? {})
    .map(([name, value]) => ` ${renderAttribute(name, value)}`)
    .join("");
  return `<${localName}${attributes} />`;
}

function requireFileSource(files, path) {
  const file = files.find((candidate) => candidate.path === path);
  if (!file) throw new Error(`File not found after operation: ${path}`);
  return file.source;
}

/**
 * Copies a library component's (self-contained) source and scoped CSS into
 * the site the first time it's used there, and makes sure pagePath imports
 * it — the same two-step pattern as ensureBlockAvailable in
 * source-content-actions.js, since adding an import shifts every later
 * node's id in the file and needs to land as its own persisted step before
 * anything targets a node for the insert that follows.
 *
 * Unlike cms-blocks (one shared blocks.css, imported once at the site's
 * root layout), each library component owns its own scoped stylesheet, so
 * the generated .jsx imports its sibling .css directly.
 */
export async function ensureLibraryComponentAvailable(
  siteSlug,
  pagePath,
  componentId,
) {
  const component = libraryRegistry.get(componentId);
  const manager = getWorkspaceManager();

  let state = await manager.describe(siteSlug);
  let files = await manager.readFiles(siteSlug);

  const baseName = component.fileName.replace(/\.jsx$/u, "");
  const componentPath = `${LIBRARY_COMPONENTS_DIR}/${component.fileName}`;
  const stylesPath = `${LIBRARY_COMPONENTS_DIR}/${baseName}.css`;

  if (!files.some((file) => file.path === componentPath)) {
    const source = `import "./${baseName}.css";\n${component.source}`;
    await manager.saveFile(siteSlug, {
      baseRevision: state.revision,
      path: componentPath,
      source,
    });
    await commitSiteChanges(state.rootPath, `Add ${component.id} library component`);
    state = await manager.describe(siteSlug);

    await manager.saveFile(siteSlug, {
      baseRevision: state.revision,
      path: stylesPath,
      source: component.styles,
    });
    await commitSiteChanges(state.rootPath, `Add ${component.id} library styles`);
    state = await manager.describe(siteSlug);
    files = await manager.readFiles(siteSlug);
  }

  const localName = component.exportName;
  const depth = pagePath.split("/").length - 1;
  const specifier = `${"../".repeat(depth)}${componentPath}`;

  try {
    const result = await applyEditorOperation({
      files,
      currentRevision: 0,
      operation: {
        schemaVersion: 1,
        baseRevision: 0,
        filePath: pagePath,
        type: "add-import",
        payload: {
          source: specifier,
          importKind: "named",
          imported: component.exportName,
          local: localName,
        },
      },
    });
    await manager.saveFile(siteSlug, {
      baseRevision: state.revision,
      path: pagePath,
      source: requireFileSource(result.files, pagePath),
    });
    await commitSiteChanges(state.rootPath, `Import ${component.id} on ${pagePath}`);
  } catch (error) {
    // Already imported on this page under the same convention-derived name.
    if (
      !(error instanceof CompilerOperationError) ||
      error.code !== "OF_OPERATION_NO_CHANGE"
    ) {
      throw error;
    }
  }

  return { localName, component };
}

/**
 * Appends a library component to the end of the page — always top-level,
 * unlike insertBlock in source-content-actions.js, since a library
 * component isn't a recognized block (parsePageToBlockTree only walks
 * components/openforge/*.jsx imports — see its own comment), so it can
 * never be a slot-bearing container another insert targets. The page's
 * root node id is still resolvable regardless of that — it's just the
 * page's own top-level JSX wrapper, independent of which children are
 * "known" blocks — so a plain top-level append works the same way it
 * would for any other page content.
 */
export async function insertLibraryComponent(siteSlug, pagePath, componentId) {
  const { localName, component } = await ensureLibraryComponentAvailable(
    siteSlug,
    pagePath,
    componentId,
  );

  const manager = getWorkspaceManager();
  const state = await manager.describe(siteSlug);
  const files = await manager.readFiles(siteSlug);
  const rootNodeId = findPageRootNodeId(files, pagePath);

  const result = await applyVisualOperation({
    files,
    currentRevision: 0,
    operation: {
      schemaVersion: 1,
      baseRevision: 0,
      filePath: pagePath,
      type: "insert-jsx",
      target: { nodeId: rootNodeId },
      payload: {
        jsx: renderLibraryJsx(component, localName),
        position: "inside-end",
      },
    },
  });

  await manager.saveFile(siteSlug, {
    baseRevision: state.revision,
    path: pagePath,
    source: requireFileSource(result.files, pagePath),
  });
  await commitSiteChanges(state.rootPath, `Add ${component.id} to ${pagePath}`);
}
