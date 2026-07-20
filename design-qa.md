# AuraLite PDP Design QA

## Validation context

- Source visual: `/Users/poi/Desktop/tenth/1/1.jpg`
- Annotated scope visual: `/var/folders/70/_1w6gjb95wg58934fw0p_tvr0000gn/T/codex-clipboard-bafcc08a-7577-43bd-9b4c-62504e834cc0.png`
- Implementation URL: `http://localhost:3080/products/auralite-performance-t-shirt?Color=Washed%20Charcoal&Size=S`
- Primary implementation screenshot: `/Users/poi/Workspace/shopify/tenth_athletic/outputs/auralite-pdp-single-purchase-final.png`
- Side-by-side comparison: `/Users/poi/Workspace/shopify/tenth_athletic/outputs/auralite-pdp-top-comparison.png`
- Viewports checked: 1440px desktop, 1280px desktop, 768px responsive breakpoint, and 390×844 mobile.
- Product state: Color = Washed Charcoal, Size = S, cart restored to Bag(0) after interaction testing.

## Full-view comparison evidence

The implementation follows the reference page sequence: header, primary product media, purchase panel, three-angle lifestyle media, feature index, Shopify rich text, campaign video, size/shipping/material sections, technical specifications, and footer. Desktop uses two purchase-panel instances with one shared Shopify variant state and mutually exclusive scroll visibility; mobile renders only the primary purchase form.

The primary product image differs from the reference because the storefront intentionally renders Shopify Media 1 as supplied. The reference shows a front view, while the current Shopify Media 1 is the back view. This is a product-data difference, not a layout substitution.

## Focused region comparison

- Header navigation, dot-matrix background, centered media composition, translucent warm off-white purchase panel, option controls, and dark brown CTA hierarchy match the supplied visual direction.
- Shopify Media 2 is rendered once as the three-angle lifestyle image; no repeated variant-image fallback is present.
- The supplied SVG assets are used for Fit, Condition Index, Ultralight Construction, Targeted Airflow, and Precision Cut.
- `descriptionHtml` is rendered as one raw Shopify-managed rich-text region without parsing or dependence on its internal layout.
- The fixed project video is rendered after Shopify rich text at a stable 2:1 ratio using muted autoplay, looping, inline playback, metadata preload, and no browser controls.
- Size & Fit, Shipping & Returns, Materials, technical specifications, and footer retain the long editorial page rhythm of the reference with enlarged PDP-only typography.
- On desktop the primary purchase panel is embedded and expanded at the hero, fixes to the viewport after the hero, collapses while scrolling down, expands while scrolling up, and stops 12px before the video using its current animated height. It then fades out as it leaves the viewport.
- The secondary desktop panel fades in at the Size & Fit trigger and remains available through Technical Specifications and the bottom of the page. Browser assertions confirmed that exactly one panel has visible, interactive pointer state throughout the transition.
- On mobile only one `ProductForm` is rendered and becomes a 136px bottom-fixed purchase bar. At 390px, document width equals viewport width, the video remains exactly 2:1, and the size table scrolls within its own container.

## Interaction and accessibility checks

- Color and size controls preserve the selected URL state.
- Add to Cart was exercised successfully, then the test cart line was removed.
- Size-unit switching works.
- Accordion triggers update open state and expose `aria-expanded`/`aria-controls`.
- Hidden desktop purchase panels use `opacity`, `visibility`, and `pointer-events` together, so they cannot receive clicks or keyboard focus during cross-fades.
- `prefers-reduced-motion` removes purchase-panel and product-thumb transition durations and pauses the campaign video on its first frame.
- The document contains one `h1`.
- Product media includes alt text; decorative feature SVGs use empty alt text.
- No horizontal page overflow was observed at 390px.
- Desktop scroll-state checks passed for `is-embedded`, `is-fixed is-collapsed`, `is-fixed`, `is-stopped is-visible`, primary `is-hidden`, and secondary `is-visible` through the page bottom.

## Engineering checks

- `pnpm typecheck`: passed.
- Targeted ESLint for all AuraLite PDP implementation files: passed.
- `pnpm build`: passed.
- `git diff --check`: passed.
- Shopify Hydrogen validator was executed for the new video component. Its component-only validator does not support native HTML5 `section`, `video`, and `source` elements and reports them as non-Shopify components; the native video implementation is instead covered by TypeScript, ESLint, production build, and browser media-state checks.
- Full-project lint still reports unrelated pre-existing issues in `CookieConsent.tsx` and `scripts/upload-product-import.mjs`; the PDP target files are clean.
- Browser console inspection still reports the project’s existing root-level Hydrogen deferred-Suspense hydration warnings on fresh development loads. No warning references the purchase panel, and the panel’s embedded, fixed, collapsed, expanded, stopped, and mobile states all render and transition correctly.

## Findings and iteration history

1. Replaced the old three-column gallery and image fallback behavior with the two-image Shopify media contract.
2. Removed the duplicated purchase panels and retained one shared purchase component across desktop and mobile.
3. Added the supplied product-information SVGs and technical-specification rows.
4. Corrected inherited grid styling that constrained the accordion block.
5. Restored the original desktop scroll behavior: downward collapse, upward expansion, fixed positioning, and a product-information stop boundary.
6. Removed the final optional-image rendering branch so missing required Shopify media is surfaced directly by the route contract.
7. Moved the primary panel stop boundary from product information to the campaign video and corrected the stop calculation to use the panel’s live animated height; both expanded and collapsed states stop 12px above the video.
8. Added the mutually exclusive Size & Fit desktop purchase panel and verified one interactive panel at a time.
9. Added the 2:1 campaign video, reduced-motion playback handling, larger PDP typography, warm translucent form styling, and SVG hover scale treatment.
10. Added a hero-only Shopify image carousel using the supplied mirrored PNG arrows. The carousel follows Shopify media order, loops at both ends, exposes accessible previous/next controls and a live image counter, and leaves the lower three-angle lifestyle image unchanged.
11. Compared the supplied 1920×1297 carousel reference and the implementation at the same viewport in `/Users/poi/Workspace/shopify/tenth_athletic/outputs/product-gallery-qa/reference-vs-final.png`. The gallery is constrained to 74rem so the arrow hit areas align with the reference while the product page itself remains full width.

## Product gallery verification

- Desktop interaction: previous/next controls are unique, keyboard-focusable buttons; next changes the hero image URL and the following next wraps back to the first image.
- Hero-only contract: browser assertions confirmed that the lower `.product-lifestyle-media` image URL remains unchanged during hero navigation.
- Responsive behavior: controls remain visible at 390×844, the document width remains equal to the viewport width, and the hero can be changed without affecting the mobile purchase bar.
- Reduced motion: the hero cross-fade is disabled under `prefers-reduced-motion`.
- Data query: the Storefront API request now fetches the first 20 product images and the Shopify schema validator reports the query as valid.
- Current local loader data still reports two images during browser verification. The implementation renders every image returned by Shopify, but the newly uploaded media cannot be exercised locally until the running storefront loader receives the refreshed Shopify image set.

## Product gallery height-stability regression

- Source visual truth: `/var/folders/70/_1w6gjb95wg58934fw0p_tvr0000gn/T/codex-clipboard-6308989b-6997-4ab5-a846-90076c2d4a9a.png`.
- Implementation screenshot: `/Users/poi/Workspace/shopify/tenth_athletic/outputs/product-gallery-qa/height-stability-fixed-desktop.png`.
- Combined comparison: `/Users/poi/Workspace/shopify/tenth_athletic/outputs/product-gallery-qa/reference-vs-height-stability-fixed.png`.
- Viewports and state: 1920×1297 desktop visual comparison; 1440×900 and 390×844 image-switch interaction checks.
- Earlier P1 finding: images with different intrinsic aspect ratios changed `.product-hero-media` height, pushing the purchase panel and all following content during a switch.
- Fix: the hero media stage now keeps a 16:15 aspect ratio with zero automatic minimum height and clipped overflow; every Shopify image fills that stable stage using `object-fit: contain`.
- Post-fix evidence: on desktop and mobile, the media height, hero height, purchase-panel offset, lifestyle-section offset, and document scroll height all have a measured switch delta of exactly 0px.
- Full-view comparison: the product, arrows, purchase panel, and lower lifestyle composition remain aligned with the existing carousel reference.
- Focused region comparison: no crop or distortion was introduced; the current first image remains fully visible and centered in the fixed stage.

final result: passed
