const IMPORT_LINE = /^import \{ createCmsBlock \} from "\.\.\/block\.js";\n\n?/;
const EXPORT_LINE = /^export const \w+Block = createCmsBlock\(\{/m;
const COMPONENT_LINE = /^\s*component: (\w+),/m;
const SLOTS_PARAM = /,\s*slots\s*\}/;
const SLOTS_USAGE = /slots\?\.(\w+)\s*\?\?\s*\[\]/;

/**
 * Given one `packages/cms-blocks/src/blocks/*.jsx` file's raw source text,
 * produce a plain, importable React component file with zero CMS-registry
 * code: the same function body, minus the trailing `createCmsBlock({...})`
 * registration, ending in a plain `export default <Component>;`. This is
 * what gets copied into a real site's `components/` directory — the block
 * definition (editableFields, migrations, etc.) stays exactly where it is,
 * this is only ever a second, generated representation of the same
 * component, not a fork of it.
 *
 * Blocks that render slot content read a `slots` prop the CMS renderer
 * injects (`packages/renderer`'s `createRenderer` turns each slot's
 * children into pre-rendered elements under `props.slots[name]`); a plain
 * source file instead passes nested content as ordinary JSX `children`, so
 * that one destructured parameter and its one usage line are rewritten
 * accordingly.
 *
 * @param {string} source
 */
export function generateStandaloneBlock(source) {
  const exportMatch = source.match(EXPORT_LINE);
  if (!exportMatch) {
    throw new Error(
      "Could not find the `export const <x>Block = createCmsBlock({` line.",
    );
  }

  const componentMatch = source.match(COMPONENT_LINE);
  if (!componentMatch) {
    throw new Error("Could not find the `component: <Name>,` line.");
  }
  const componentName = componentMatch[1];

  let body = source.slice(0, exportMatch.index).replace(IMPORT_LINE, "");

  if (SLOTS_PARAM.test(body)) {
    body = body.replace(SLOTS_PARAM, ", children }");
    body = body.replace(
      SLOTS_USAGE,
      "Array.isArray(children) ? children : children ? [children] : []",
    );
  }

  return `${body.trimEnd()}\n\nexport default ${componentName};\n`;
}
