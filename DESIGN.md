# AIPrism landing page

The redesigned homepage is a static, progressively enhanced page. No application framework, bundler, or client-side dependency is required. Supporting pages retain their existing layouts and the previously completed AIPrism rebranding.

## Files and local preview

- `index.html`: semantic sections, inline SVG prism, native service content, process and architecture disclosures, all nine existing articles, and the enquiry form.
- `landing.css`: theme tokens, shared components, section layouts, responsive rules, reduced-motion and forced-colors adaptations.
- `landing.js`: independent initializers for navigation, service selection, pointer motion, article dialogs, and form submission.
- `assets/fonts/inter-latin.woff2`: locally hosted Inter variable font; its license is alongside it.
- `aiprism-logo.webp`: 320 × 254 optimized export of the supplied logo. Regenerate using `generate-favicons.py`; the existing PNG remains the fallback.

From the repository root:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Open `http://127.0.0.1:8765/`. The canonical domain is `https://aiprismllp.com/`; see `DOMAIN-MIGRATION.md` for rollout status. Existing email addresses and the Web3Forms access key are retained.

## Interaction contracts

- Service selectors become tabs with arrow-key, Home, End, Enter, and Space support. Without JavaScript they link to three visible service sections. Direct links to individual panels are supported.
- Service CTAs select the matching enquiry interest and focus the name field. Native radio controls keep the choice accessible.
- Process steps and the five architecture layers use native `details`/`summary` elements.
- Article summaries open a native modal dialog with previous/next navigation, Escape dismissal, modal focus containment, and focus restoration. Without JavaScript, the full article expands inline. All nine original articles are retained and ordered newest first.
- The SVG uses a single, finite beam animation and event-driven pointer tilt. Reduced-motion settings disable both. There is no perpetual rendering loop or autoplay video on the homepage.
- Enquiries use native validation, a honeypot, duplicate-submit protection, a 15-second timeout, and an announced status. Failures retain the visitor's entries and permit retry; successful submissions reset the form and re-enable the button. Without JavaScript, the form submits directly to Web3Forms.
- Work previews are labelled illustrations, with links to the real demo and case-study pages. The seven-working-day development metric comes from the existing `menu-recommender.html` case study; no new client-result metrics were invented.

## Validation

Checked in Chromium at 320, 375, 768, 1024, and 1440 CSS pixels: no horizontal overflow or JavaScript errors. Keyboard navigation, tab selection, contextual CTAs, dialog focus return, success/retry form states, no-JavaScript behavior, and reduced motion were exercised. Contact tests intercepted Web3Forms requests locally; no enquiries were sent.

A final local mobile Lighthouse run reported 99 performance, 100 accessibility, 100 best practices, and 100 SEO; LCP 1.8 seconds, CLS 0, and approximately 185 KiB transferred. These are local lab measurements, not a guarantee of production hosting performance.

Axe scans of desktop, mobile, and dialog states found no WCAG A/AA violations. Gradients require additional contrast review. Conservative palette checks gave:

| Pair | Contrast |
| --- | --- |
| Muted text `#99a7bf` / bright general panel `#2e2845` | 5.73:1 |
| Button text `#101724` / fill `#bdd9fc` | 12.39:1 |
| Input boundary `#687993` / form surface `#181d2e` | 3.78:1 |
| Darkest heading-gradient stop `#bbb6ff` / panel `#282339` | 8.09:1 |

These exceed the relevant [WCAG 2.2 contrast thresholds](https://www.w3.org/TR/WCAG22/#contrast-minimum). Reduced motion follows the [W3C guidance on animation from interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html). Automated checks and the listed manual checks do not constitute a complete accessibility conformance audit.

The redesigned site is deployed on Vercel. Domain migration status is tracked in `DOMAIN-MIGRATION.md`. Real enquiry delivery has not been tested; browser checks mock the form service to avoid sending unsolicited messages.
