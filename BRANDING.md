# AIPrism branding

Use **AIPrism** in website copy and **AIPrism Consulting LLP** for the legal entity and copyright notices.

- `assets/branding/aiprism-original.png`: the supplied organization logo, preserved unchanged.
- `aiprism-logo.png`: stacked logo used across all 17 pages.
- `aiprism-logo.webp`: optimized homepage logo; its `<picture>` retains a PNG fallback.
- `aiprism-mark.png`: prism symbol used in the homepage illustration.
- `aiprism-social.png`: 1200 × 630 social preview.
- `favicon.ico`, `favicon-96x96.png`, `apple-touch-icon.png`: icons derived from the prism symbol.
- `branding.css`: shared logo sizing and navigation spacing.
- `landing.css`: the homepage's independent dark theme, components, and responsive logo sizing. See `DESIGN.md` for the landing-page implementation.

Regenerate the web assets directly from the supplied original with:

```sh
uv run --with pillow generate-favicons.py
```

The generator requires Pillow. A Python environment with Pillow installed can also run `python generate-favicons.py`. It resolves paths relative to the script, so it works from any directory.

A cleanup preview was explored with the built-in imagegen tool, but was not used because it changed the mark's proportions. Final assets use the supplied artwork directly, cropping outer margins and resizing without redrawing the design. The preview's prompt was:

> Edit target: the attached AIPrism Consulting LLP organization logo. Prepare the EXACT existing logo for use on its official website. Remove ONLY the gray/white checkerboard backdrop and excess outer margins. Place on a solid pure white background. Preserve the original blue open triangular prism mark, incoming blue ray, outgoing rainbow rays and their soft colored glow, all relative positions, typography, colors, and the two exact text lines 'AIPRISM' and 'CONSULTING LLP'. Do not redesign or reinterpret the logo. Tightly frame the entire mark plus both text lines with modest consistent white padding; no cropping of artwork or glow. Output one clean logo image with no mockup or additional objects. This is background cleanup of the supplied official logo, not a new design.

## Domain migration

The new primary website address is `https://aiprismllp.com/`. All page canonical and social URLs use this address. See `DOMAIN-MIGRATION.md` for DNS records, rollout status, and redirect configuration.

Existing `support@growtenx.in` contact addresses and the Web3Forms configuration are retained until replacement mailboxes are verified. The enquiry subject and sender display name use AIPrism.
