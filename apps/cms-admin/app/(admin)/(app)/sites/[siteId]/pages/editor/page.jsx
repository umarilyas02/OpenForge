import { OFFICIAL_CMS_BLOCKS } from "@openforge/cms-blocks";
import { defaultThemeBlockRegistry } from "@openforge/theme-default";
import { notFound } from "next/navigation";

import { SourceContentEditor } from "../../../../../../../src/components/SourceContentEditor.jsx";
import { serializeBlockDefinitions } from "../../../../../../../src/lib/content-tree-ops.js";
import { serializeLibraryCatalog } from "../../../../../../../src/lib/library-content-actions.js";
import {
  duplicateBlockAction,
  getPageEditorState,
  insertBlockAction,
  insertLibraryComponentAction,
  moveBlockAction,
  removeBlockAction,
  restorePageSourceAction,
  updateBlockProps,
} from "./actions.js";

const ALL_BLOCK_IDS = OFFICIAL_CMS_BLOCKS.map((block) => block.definition.id);

export default async function PageEditorRoute({ params, searchParams }) {
  const { siteId } = await params;
  const { file } = await searchParams;
  if (!file) notFound();

  const { tree, pageRootNodeId, source, themeId, tokenOverrides } =
    await getPageEditorState(siteId, file);
  const catalog = serializeBlockDefinitions(
    ALL_BLOCK_IDS,
    defaultThemeBlockRegistry,
  );
  const libraryCatalog = serializeLibraryCatalog();

  return (
    <SourceContentEditor
      allowedBlockIds={ALL_BLOCK_IDS}
      catalog={catalog}
      duplicateBlockAction={duplicateBlockAction}
      initialPageRootNodeId={pageRootNodeId}
      initialSource={source}
      initialTree={tree}
      insertBlockAction={insertBlockAction}
      initialThemeId={themeId}
      initialTokenOverrides={tokenOverrides}
      insertLibraryComponentAction={insertLibraryComponentAction}
      libraryCatalog={libraryCatalog}
      moveBlockAction={moveBlockAction}
      pagePath={file}
      pageTitle={file === "app/page.jsx" ? "Homepage" : file}
      removeBlockAction={removeBlockAction}
      restorePageSourceAction={restorePageSourceAction}
      siteId={siteId}
      updateBlockProps={updateBlockProps}
    />
  );
}
