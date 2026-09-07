"use server";

import { assertSiteAccess } from "@openforge/auth";
import { schema } from "@openforge/db";
import { AssetError } from "@openforge/storage";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";

import { getAssetManager } from "../../../../../../src/lib/asset-manager.js";
import { getDb } from "../../../../../../src/lib/db.js";
import {
  getMemberships,
  requireUser,
} from "../../../../../../src/lib/session.js";

const ALLOWED_MIME_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

/**
 * Uploads a new media asset for this site: validates the file, runs it
 * through the Python image analyzer, stores the original plus resized
 * variants, and records the asset row. See asset-manager.js's
 * `getAssetManager()` for why a fresh manager is built per call rather than
 * reused from a cache — it needs this request's user id for the
 * `assets.created_by` column.
 *
 * @param {string} siteId
 * @param {{ error: string | null, uploaded?: boolean, token?: number }} _prevState
 * @param {FormData} formData
 */
export async function uploadAsset(siteId, _prevState, formData) {
  const user = await requireUser();
  const db = getDb();

  const [site] = await db
    .select()
    .from(schema.sites)
    .where(eq(schema.sites.id, siteId));
  if (!site) notFound();

  const memberships = await getMemberships(user.id);
  try {
    assertSiteAccess({ userId: user.id }, site, memberships);
  } catch {
    notFound();
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose a file to upload." };
  }
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return { error: "Only PNG, JPEG, or WebP images are supported." };
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const altText = String(formData.get("altText") ?? "");

  try {
    await getAssetManager({ userId: user.id }).upload({
      projectId: site.id,
      originalName: file.name,
      mimeType: file.type,
      bytes,
      altText,
    });
  } catch (error) {
    if (error instanceof AssetError) {
      return { error: error.message };
    }
    throw error;
  }

  revalidatePath(`/sites/${site.id}/media`);
  return { error: null, uploaded: true, token: Date.now() };
}
