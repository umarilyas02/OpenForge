import { OFFICIAL_CMS_BLOCKS } from "@openforge/cms-blocks";
import { defaultThemeBlockRegistry } from "@openforge/theme-default";
import { notFound } from "next/navigation";

import { SourceContentEditor } from "../../../../../../../src/components/SourceContentEditor.jsx";
import { serializeBlockDefinitions } from "../../../../../../../src/lib/content-tree-ops.js";
import {
  getPageEditorState,
  insertBlockAction,
  moveBlockAction,
  removeBlockAction,
  updateBlockProps,
} from "./actions.js";

const ALL_BLOCK_IDS = OFFICIAL_CMS_BLOCKS.map((block) => block.definition.id);

export default async function PageEditorRoute({ params, searchParams }) {
  const { siteId } = await params;
  const { file } = await searchParams;
  if (!file) notFound();

  const { tree, pageRootNodeId } = await getPageEditorState(siteId, file);
  const catalog = serializeBlockDefinitions(
    ALL_BLOCK_IDS,
    defaultThemeBlockRegistry,
  );

  return (
    <SourceContentEditor
      allowedBlockIds={ALL_BLOCK_IDS}
      catalog={catalog}
      initialPageRootNodeId={pageRootNodeId}
      initialTree={tree}
      insertBlockAction={insertBlockAction}
      moveBlockAction={moveBlockAction}
      pagePath={file}
      pageTitle={file === "app/page.jsx" ? "Homepage" : file}
      removeBlockAction={removeBlockAction}
      siteId={siteId}
      updateBlockProps={updateBlockProps}
    />
  );
}
