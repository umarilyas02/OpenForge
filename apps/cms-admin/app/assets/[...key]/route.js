import { getAssetBlobStorage } from "../../../src/lib/asset-blob-storage.js";
import { getAssetSigner } from "../../../src/lib/asset-manager.js";

/**
 * Serves asset bytes directly to `<img>` tags. Deliberately a top-level
 * route (a sibling of the `(admin)` and `(canvas)` route groups) so it does
 * NOT inherit `(admin)/(app)/layout.jsx`'s `requireUser()` session gate —
 * authorization here comes entirely from the HMAC signature in the URL
 * query string, not cookies, since a browser <img> request can't attach an
 * admin session anyway.
 */
export async function GET(request, { params }) {
  const { key: segments } = await params;
  const key = segments.join("/");

  const url = new URL(request.url);
  const expires = Number(url.searchParams.get("expires"));
  const signature = url.searchParams.get("signature");

  const verified = verifySignature(key, expires, signature);
  if (!verified) {
    return new Response("Forbidden", { status: 403 });
  }

  const object = await getAssetBlobStorage().getObject(key);
  if (!object) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(object.bytes, {
    headers: {
      "cache-control": "private, max-age=300",
      "content-type": object.metadata.mimeType,
    },
  });
}

/** The signer throws on a malformed key rather than returning false. */
function verifySignature(key, expires, signature) {
  try {
    return getAssetSigner().verify({
      key,
      expires,
      candidateSignature: signature,
    });
  } catch {
    return false;
  }
}
