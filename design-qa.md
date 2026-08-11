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

---

# Cart Drawer Design QA

## Validation context

- Source visual truth: `/var/folders/70/_1w6gjb95wg58934fw0p_tvr0000gn/T/codex-clipboard-fa562593-b52f-4504-b00a-f6a4c0a694d6.png`.
- Desktop implementation evidence: `/Users/poi/Workspace/shopify/tenth_athletic/outputs/cart-drawer/cart-drawer-final-target.png`.
- Summary implementation evidence: `/Users/poi/Workspace/shopify/tenth_athletic/outputs/cart-drawer/cart-drawer-final-summary.png`.
- Mobile implementation evidence: `/Users/poi/Workspace/shopify/tenth_athletic/outputs/cart-drawer/cart-drawer-mobile.png`.
- Full top-region comparison: `/Users/poi/Workspace/shopify/tenth_athletic/outputs/cart-drawer/comparison-top.png`.
- Focused summary comparison: `/Users/poi/Workspace/shopify/tenth_athletic/outputs/cart-drawer/comparison-summary.png`.
- Source pixels: 770×1664 at 1× density. The implementation intentionally retains the existing 42rem drawer width, which measures 672×1664 CSS px in the 1440×1664 desktop validation viewport.
- Browser screenshot evidence is 1× PNG. The in-app browser capture surface returns the first 1278 px of the 1664 px CSS viewport, so the top region and bottom summary were captured separately and compared at native density without stretching either drawer.
- State: Bag(3), three distinct Shopify cart lines, GBP locale, drawer open, no focused control.

## Full-view comparison evidence

- `comparison-top.png` places the 770 px source beside the retained 672 px implementation at the same 1194 px vertical crop. After accounting for the explicit width constraint, the normalized header, image, information, price, quantity, Remove, bookmark, and three-row positions align.
- At the 1664 px CSS viewport, the implementation summary rule starts at 1193.6 px versus 1195 px in the source. The third product ends at 922.7 px versus approximately 906 px in the source, leaving the intended open whitespace before the summary.
- The implementation uses the project Avenir files, the existing black/white tokens, live Shopify product imagery, and the real cart total/currency rather than substituting screenshot content.

## Focused region comparison

- `comparison-summary.png` compares the complete 470 px source summary with the 458 px implementation summary aligned to their top rules. Packaging copy, delivery copy, tax copy, Total, the 92 px Checkout action, and the centered View your basket link follow the same hierarchy and spacing.
- The source and implementation use different product names, images, prices, and totals because the implementation renders live Shopify cart data. This is an intentional content/data difference, not a layout mismatch.
- No additional focused crop was needed for the header or product controls because all typography and icons are legible at native size in `comparison-top.png`.

## Required fidelity surfaces

- Fonts and typography: Avenir is used throughout; title, metadata, option labels, prices, actions, and summary weights and line heights match the reference hierarchy. No unexpected truncation is present.
- Spacing and layout rhythm: the existing 42rem drawer width is unchanged. Header top/side offsets, product row intervals, summary rule, checkout height, and bottom-link placement match the reference after width normalization.
- Colors and tokens: the drawer uses the existing white canvas, shared global dot-matrix layer, and black/secondary text tokens with no added cart-specific gradients, radii, shadows, or fallback colors.
- Image quality and assets: live Shopify images render through Hydrogen `Image` with contain sizing. The close and `bookmark_line` assets come from Remix Icon; no handcrafted SVG, CSS drawing, glyph substitution, or placeholder is used.
- Copy and content: Bag count, option labels, packaging statement, delivery estimate, tax text, Total, Checkout, and View your basket match the requested structure. Product-specific copy and money remain data-driven.

## Interaction, responsiveness, and console checks

- Desktop open/close, quantity increase/decrease, Remove, cart-count updates, and internal list scrolling were exercised successfully. The two temporary QA cart lines were recreated for final three-line visual evidence, then removed again so the original one-line cart state was restored.
- The 390×844 mobile state measures 390 px for both document and drawer width, with no horizontal overflow. Actions reflow below product information and the line-items region scrolls independently above the fixed summary.
- Checkout and View your basket expose the correct live links. Checkout was not followed because that would leave the local storefront for Shopify checkout.
- Fresh development loads still log the project's existing root-level React hydration/Suspense warnings. No console error references the cart drawer components or the Remix Icon components.

## Comparison history

1. Earlier P1: the site header remained above the new cart header because an existing branded-drawer stacking selector had higher specificity. Fix: added a cart-specific stacking rule and removed the cart from the shared site-header close control. Post-fix evidence: `comparison-top.png` shows a clean Bag header with only the internal title and close icon.
2. Earlier P2: the summary rule began about 44 px too high at the 1664 px target height. Fix: reduced the packaging-to-delivery gap and summary bottom padding. Post-fix measurements are 1193.6 px for the rule versus 1195 px in the source, 1499 px for Checkout top versus 1500 px, and 1591 px for Checkout bottom versus 1592 px.
3. Post-fix visual comparison found no actionable P0, P1, or P2 differences. Remaining product-image scale variation is determined by each Shopify asset's intrinsic transparent whitespace and is acceptable data-specific behavior.

## Engineering checks

- `pnpm typecheck`: passed.
- Targeted ESLint for CartMain, CartLineItem, CartSummary, and Header: passed.
- `pnpm build`: passed.
- `git diff --check`: passed.

final result: passed

---

# Cart Drawer Follow-up Design QA

## Validation context

- Source visual truth for the retained treatment: the live Man drawer at `http://localhost:3080`, captured in `/Users/poi/Workspace/shopify/tenth_athletic/outputs/cart-drawer/other-drawer-dot-reference.png`.
- Updated desktop implementation: `/Users/poi/Workspace/shopify/tenth_athletic/outputs/cart-drawer/cart-drawer-followup-current.png`.
- Updated mobile implementation: `/Users/poi/Workspace/shopify/tenth_athletic/outputs/cart-drawer/cart-drawer-followup-mobile.png`.
- Combined comparison input: `/Users/poi/Workspace/shopify/tenth_athletic/outputs/cart-drawer/followup-dot-matrix-comparison.png`.
- Desktop source and implementation captures are 1280×720 px at 1× density and the same open-drawer interaction state. Mobile is 390×844 px at 1× density.

## Full-view and focused comparison evidence

- The combined comparison shows the existing global dot matrix at the same pitch, size, blend mode, and stacking position over both the reference drawer and the updated Bag drawer.
- The Bag drawer remains 672 px wide (`42rem`) in the 1280 px desktop viewport.
- The updated desktop header measures 100 px high with 32 px top and bottom padding. The 28 px title and 36 px close target are vertically centered and aligned to the same horizontal gutter.
- At 390×844, the title starts 24 px from the top, the close control stays in the matching top-right position, the drawer occupies exactly 390 px, and no horizontal overflow is visible.

## Required fidelity surfaces

- Fonts and typography: the existing Avenir hierarchy, weights, and title/count sizing are unchanged.
- Spacing and layout rhythm: the excessive desktop header height was removed without changing the drawer width or cart content geometry; mobile header padding was tightened proportionally.
- Colors and visual tokens: the existing global black-on-white dot-matrix treatment is restored instead of introducing a cart-specific approximation.
- Image quality and assets: product imagery and Remix Icon close/bookmark assets are unchanged and remain sharp at both tested densities.
- Copy and content: all live cart copy, price, quantity, Remove, total, and action labels remain data-driven and unchanged.

## Comparison history

1. User-reported P2: the first cart pass suppressed the global dot matrix that other drawers retain. Fix: removed only the cart-specific dot-matrix stacking override, allowing the shared `z-index: 210` layer to remain visible. Post-fix evidence: the combined comparison shows identical dot placement in both drawer states.
2. User-reported P2: the Bag header had too much vertical space above the title and an unbalanced overall height. Fix: reduced desktop padding to `clamp(2rem, 3.25vh, 3.25rem)` above and `clamp(2rem, 3vh, 3rem)` below; mobile now uses 24 px above and 32 px below. Post-fix evidence: the desktop header is 100 px at 1280×720 and the mobile header is visibly compact without crowding either control.
3. Post-fix visual comparison found no actionable P0, P1, or P2 differences for this follow-up scope.

## Interaction and engineering checks

- Bag open/close was exercised on desktop; the mobile menu-to-Bag path was exercised at 390×844.
- The existing development console still reports the project-level root hydration mismatch and background-video power-saving warning documented above. No new error references the cart drawer or these CSS changes.
- `pnpm typecheck`: passed.
- `pnpm build`: passed.
- `git diff --check`: passed.

final result: passed

---

# Cart Drawer Title Width Follow-up QA

## Validation context

- Reported source screenshot: `/var/folders/70/_1w6gjb95wg58934fw0p_tvr0000gn/T/codex-clipboard-60e8fee5-afa7-40e4-b0a4-f4e188fa9ea4.png` (1076×2048 px).
- Desktop implementation screenshot: `/Users/poi/Workspace/shopify/tenth_athletic/outputs/cart-drawer/cart-title-nowrap-desktop.png` (1280×720 px at 1× density, 672 px drawer).
- Mobile implementation screenshot: `/Users/poi/Workspace/shopify/tenth_athletic/outputs/cart-drawer/cart-title-layout-mobile.png` (390×844 px at 1× density).
- Combined focused comparison: `/Users/poi/Workspace/shopify/tenth_athletic/outputs/cart-drawer/cart-title-width-comparison.png`.
- State: Bag open with the live `MAAP Pink Wave Cycling Jersey` line at size XS for the desktop measurement; original one-line AuraLite cart state restored after capture.

## Findings and comparison history

1. User-reported P2: the three-column desktop grid reserved a `max-content` track for price, quantity, Remove, and bookmark, shrinking the product-information track enough to wrap the 227 px title while unused drawer width remained visible.
2. Fix: changed the item grid to image plus one flexible content column. The purchase controls now occupy the second row of that same content column, align right on desktop, and align left at the mobile breakpoint. The product image spans both rows so the item does not become unnecessarily taller.
3. Post-fix evidence: at the unchanged 672 px drawer width, the information track measures 403.2 px and the 227 px product-title link renders in one 16.8 px line. The actions remain fully visible at 403.2 px wide and right-aligned.
4. Mobile regression evidence: at 390×844, the document and drawer both measure 390 px, the content track is 230.6 px, actions reflow to two rows as intended, and no horizontal overflow is present.

## Required fidelity surfaces

- Fonts and typography: font family, size, weight, and line height are unchanged; only available inline width was corrected.
- Spacing and layout rhythm: drawer width and outer gutters are unchanged. The image spans the information and action rows to retain compact item height.
- Colors and visual tokens: unchanged, including the restored global dot matrix.
- Image quality and assets: product image sizing and Remix Icon bookmark asset are unchanged.
- Copy and content: all product, variant, price, quantity, Remove, and summary content remains data-driven.

## Engineering checks

- `pnpm typecheck`: passed.
- `pnpm build`: passed.
- `git diff --check`: passed.

final result: passed
