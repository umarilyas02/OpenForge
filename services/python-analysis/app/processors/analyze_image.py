"""Validate raster images and create bounded metadata-free WebP variants."""

from __future__ import annotations

import argparse
import base64
import io
import json
import sys
import warnings
from dataclasses import asdict, dataclass

from PIL import Image, ImageOps

MAX_INPUT_BYTES = 10 * 1024 * 1024
MAX_VARIANT_WIDTH = 4096
ALLOWED_FORMATS = {
    "JPEG": "image/jpeg",
    "PNG": "image/png",
    "WEBP": "image/webp",
}


class ImageAnalysisError(ValueError):
    """Raised when an image violates the bounded analysis contract."""


@dataclass(frozen=True)
class Variant:
    """Serializable derivative metadata."""

    name: str
    mimeType: str
    width: int
    height: int
    base64: str


def analyze_image(
    payload: bytes,
    declared_mime: str,
    max_pixels: int,
    variant_widths: list[int],
) -> dict[str, object]:
    """Analyze bytes without filesystem or network access."""
    if not payload or len(payload) > MAX_INPUT_BYTES:
        raise ImageAnalysisError("Input image is empty or exceeds the byte limit.")
    if declared_mime not in ALLOWED_FORMATS.values():
        raise ImageAnalysisError("Declared MIME type is not supported.")
    if max_pixels <= 0:
        raise ImageAnalysisError("Pixel limit must be positive.")
    if (
        not variant_widths
        or len(variant_widths) > 8
        or any(width <= 0 or width > MAX_VARIANT_WIDTH for width in variant_widths)
    ):
        raise ImageAnalysisError("Variant widths are invalid or out of bounds.")

    try:
        with warnings.catch_warnings():
            warnings.simplefilter("error", Image.DecompressionBombWarning)
            source = Image.open(io.BytesIO(payload))
            source.load()
    except Exception as error:
        raise ImageAnalysisError("Image bytes could not be decoded safely.") from error

    detected_mime = ALLOWED_FORMATS.get(source.format)
    if detected_mime != declared_mime:
        raise ImageAnalysisError("Decoded image type does not match the declaration.")
    if getattr(source, "n_frames", 1) != 1:
        raise ImageAnalysisError("Animated images are not supported in the MVP.")

    normalized = ImageOps.exif_transpose(source)
    width, height = normalized.size
    if width <= 0 or height <= 0 or width * height > max_pixels:
        raise ImageAnalysisError("Decoded image exceeds the pixel limit.")

    variants = [
        _create_variant(normalized, requested_width)
        for requested_width in sorted(set(variant_widths))
    ]
    return {
        "width": width,
        "height": height,
        "variants": [asdict(variant) for variant in variants],
    }


def _create_variant(image: Image.Image, requested_width: int) -> Variant:
    target_width = min(image.width, requested_width)
    target_height = max(1, round(image.height * target_width / image.width))
    converted = image.convert("RGBA" if image.has_transparency_data else "RGB")
    converted.thumbnail((target_width, target_height), Image.Resampling.LANCZOS)
    output = io.BytesIO()
    converted.save(output, format="WEBP", quality=82, method=4, exif=b"")
    encoded = base64.b64encode(output.getvalue()).decode("ascii")
    return Variant(
        name=f"w{requested_width}",
        mimeType="image/webp",
        width=converted.width,
        height=converted.height,
        base64=encoded,
    )


def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--mime", required=True)
    parser.add_argument("--max-pixels", required=True, type=int)
    parser.add_argument("--widths", required=True)
    return parser.parse_args()


def main() -> int:
    """Read bounded bytes from stdin and emit one JSON result."""
    args = _parse_args()
    payload = sys.stdin.buffer.read(MAX_INPUT_BYTES + 1)
    try:
        widths = [int(value) for value in args.widths.split(",") if value]
        result = analyze_image(payload, args.mime, args.max_pixels, widths)
    except (ImageAnalysisError, ValueError) as error:
        print(str(error), file=sys.stderr)
        return 1
    json.dump(result, sys.stdout, separators=(",", ":"))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
