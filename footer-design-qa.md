# Footer field-notes drawer design QA

- Source visual truth: `/Users/poi/Desktop/tenth/4/ScreenShot_2026-08-12_163518_682.png`, `/Users/poi/Desktop/tenth/4/ScreenShot_2026-08-12_163608_618.png`, and key frames extracted from `/Users/poi/Desktop/tenth/4/459aec7bf435710dacfb1693f9dbf63e.mp4`.
- Implementation screenshots: `/Users/poi/Workspace/shopify/tenth_athletic/footer-implementation-desktop-open.png` and `/Users/poi/Workspace/shopify/tenth_athletic/footer-implementation-mobile-open.png`.
- Comparison evidence: `/Users/poi/Workspace/shopify/tenth_athletic/footer-mobile-comparison.png`.
- Viewports: desktop 1280 × 800 CSS px at device scale factor 1; mobile 469 × 867 CSS px at device scale factor 1.
- Source pixels: mobile reference 938 × 1734 (@2x), collapsed-bar reference 1996 × 70, video frames 1280 × 800. The mobile source was normalized to 469 × 867 before comparison.
- Implementation pixels: desktop 1280 × 800 and mobile 469 × 867.
- State: footer field-notes drawer open. Collapsed trigger and close paths were also tested.

## Findings

- No actionable P0/P1/P2 differences remain in the implemented interaction or responsive layout.
- Typography uses the project's existing Avenir family and preserves the source hierarchy, weight contrast, wrapping, and compact legal copy.
- Spacing follows the mobile reference: centered content column, compact intro/form stack, and bottom-anchored CTA. Desktop follows the recording's right-side drawer proportion and full-height presentation.
- Color maps to the Shopify Shop metafield `custom.main_color`. Because it is not configured locally yet, the implementation evidence intentionally shows the required `#554d48` brown fallback instead of the reference purple (`#BE8EC2`). Foreground and border treatment otherwise match the source.
- The reference contains no raster imagery or non-standard icon asset in this drawer. The plus/close affordance is native UI chrome and does not require an image asset.
- Copy matches the supplied mobile reference: heading, introduction, Learn more, Email, privacy statement, and CTA.

## Interaction and responsive verification

- The bottom trigger reports `aria-expanded=false` before activation and `true` after activation.
- Clicking the trigger opens the drawer; clicking the backdrop and pressing Escape close it.
- The page scroll is locked while open and restored after closing.
- Desktop drawer measured 601.6 × 800 at the 1280 × 800 viewport (47% width).
- Mobile drawer measured 469 × 867 and had no horizontal or vertical overflow at the tested viewport.
- Mobile CTA remained fully visible at the bottom of the viewport.
- Browser console checked: no errors related to the footer implementation. The local dev page already emits React hydration/Suspense errors during reload; they are outside the footer component and were surfaced rather than suppressed.

## Comparison history

1. Initial pass: the desktop drawer was 508 px wide and foreground became white on the brown fallback. Fixed the width to 47vw and restored the source's dark foreground treatment.
2. Second pass: the mobile form began too low because desktop vertical spacing carried through. Added mobile-specific top/form spacing and reduced the CTA height.
3. Final pass: source and implementation were normalized side by side at 469 × 867. Remaining color difference is expected until Shopify `custom.main_color` is configured.

Focused region comparison was not necessary beyond the normalized full mobile drawer because the form, heading, copy, and CTA are all legible at that size. The collapsed-bar screenshot was separately used to verify its two-line label and right-side plus icon.

final result: passed
