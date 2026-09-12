"""Generate website logo sizes and favicons: uv run --with pillow generate-favicons.py."""

from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "assets/branding/aiprism-original.png"

# Crop only outer space; the mark-only crop omits text for small browser icons.
LOGO_BOX = (420, 140, 1010, 622)
MARK_BOX = (425, 140, 1010, 448)


def fit_on_white(image, size, padding=0):
    canvas = Image.new("RGB", size, "white")
    fitted = ImageOps.contain(
        image, (size[0] - padding * 2, size[1] - padding * 2), Image.Resampling.LANCZOS
    )
    canvas.paste(fitted, ((size[0] - fitted.width) // 2, (size[1] - fitted.height) // 2))
    return canvas


def main():
    with Image.open(SOURCE) as source:
        master = source.convert("RGB")
    logo = master.crop(LOGO_BOX)
    mark = master.crop(MARK_BOX)
    fit_on_white(logo, (640, 508)).save(ROOT / "aiprism-logo.png", optimize=True)
    fit_on_white(logo, (320, 254)).save(ROOT / "aiprism-logo.webp", quality=88, method=6)
    fit_on_white(mark, (256, 256), padding=8).save(ROOT / "aiprism-mark.png", optimize=True)
    fit_on_white(logo, (1200, 630), padding=32).save(ROOT / "aiprism-social.png", optimize=True)
    icon = fit_on_white(mark, (256, 256), padding=8)
    icon.save(ROOT / "favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
    icon.resize((96, 96), Image.Resampling.LANCZOS).save(ROOT / "favicon-96x96.png", optimize=True)
    icon.resize((180, 180), Image.Resampling.LANCZOS).save(ROOT / "apple-touch-icon.png", optimize=True)
    print("Generated AIPrism logo, mark, social preview, and favicons.")


if __name__ == "__main__":
    main()
