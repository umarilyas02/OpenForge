"""Tests for bounded raster analysis and derivative generation."""

from __future__ import annotations

import base64
import io
import json
import subprocess
import sys
from pathlib import Path

import pytest
from PIL import Image

from app.processors.analyze_image import ImageAnalysisError, analyze_image

SCRIPT = Path(__file__).parents[1] / "app" / "processors" / "analyze_image.py"


def image_bytes(width: int = 120, height: int = 60) -> bytes:
    """Create a deterministic in-memory PNG fixture."""
    output = io.BytesIO()
    Image.new("RGB", (width, height), "#ff5a1f").save(output, format="PNG")
    return output.getvalue()


def test_analyzes_dimensions_and_generates_bounded_webp_variants() -> None:
    result = analyze_image(
        image_bytes(),
        "image/png",
        max_pixels=1_000_000,
        variant_widths=[40, 80],
    )

    assert result["width"] == 120
    assert result["height"] == 60
    assert [(item["name"], item["width"], item["height"]) for item in result["variants"]] == [
        ("w40", 40, 20),
        ("w80", 80, 40),
    ]
    for variant in result["variants"]:
        decoded = Image.open(io.BytesIO(base64.b64decode(variant["base64"])))
        assert decoded.format == "WEBP"
        assert decoded.getexif() == {}


def test_rejects_mime_mismatch_pixel_bombs_and_invalid_widths() -> None:
    payload = image_bytes(100, 100)
    with pytest.raises(ImageAnalysisError, match="does not match"):
        analyze_image(payload, "image/jpeg", 1_000_000, [40])
    with pytest.raises(ImageAnalysisError, match="pixel limit"):
        analyze_image(payload, "image/png", 5_000, [40])
    with pytest.raises(ImageAnalysisError, match="widths"):
        analyze_image(payload, "image/png", 1_000_000, [5000])


def test_cli_uses_stdin_and_returns_compact_json() -> None:
    completed = subprocess.run(
        [
            sys.executable,
            str(SCRIPT),
            "--mime",
            "image/png",
            "--max-pixels",
            "1000000",
            "--widths",
            "32",
        ],
        input=image_bytes(),
        capture_output=True,
        check=False,
    )
    assert completed.returncode == 0
    result = json.loads(completed.stdout)
    assert result["variants"][0]["name"] == "w32"
    assert completed.stderr == b""
