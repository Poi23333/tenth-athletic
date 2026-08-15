# Homepage Banner design QA

## Comparison target

- Source visual truth:
  - `/Users/poi/Desktop/tenth/微信图片_20260729221225_960_1014.png`
  - `/Users/poi/Desktop/tenth/微信图片_20260729222825_1001_1014.png`
  - `/Users/poi/Desktop/tenth/banner.jpg`
- Browser-rendered implementation:
  - `/Users/poi/Workspace/shopify/tenth_athletic/banner-implementation-desktop-full.png`
  - `/Users/poi/Workspace/shopify/tenth_athletic/banner-implementation-mobile.png`
- Combined full-view evidence:
  - `/Users/poi/Workspace/shopify/tenth_athletic/banner-comparison-desktop.png`
  - `/Users/poi/Workspace/shopify/tenth_athletic/banner-comparison-mobile.png`
- Focused content evidence:
  - `/Users/poi/Workspace/shopify/tenth_athletic/banner-comparison-content.png`
- State: three-slide QA data matching the Shopify `homepage_banner` output shape. The
  temporary QA data and copied test asset were removed after capture; production still
  renders only Shopify Metaobject data.

## Viewport and normalization

- Desktop CSS viewport: 1280 × 720, device scale factor reported by the browser: 2.
- Desktop implementation full-page capture: 1280 × 2993 pixels. The comparison crops
  the header and Banner to 1280 × 873 pixels.
- Desktop source: 1888 × 1268 pixels, downsampled to 1280 × 860 pixels with Lanczos
  resampling. The remaining 13-pixel height difference reflects the real storefront
  header height and the explicit requirement to preserve the 1920 × 1200 image ratio.
- Mobile CSS viewport and capture: 390 × 844, device scale factor 1.
- Mobile source hero crop: 986 × 718, normalized to 390 × 284. The implementation hero
  is 390 × 244 because no separate mobile image was supplied and the desktop test image
  remains at its natural 1920:1200 ratio. The mobile comparison pads, rather than
  stretches, the implementation to make that expected difference visible.

## Required fidelity surfaces

- Fonts and typography: the existing Avenir display/body families are used. Text mode
  is centered with the same three-line hierarchy as the design. Exact italic `Lab`
  lettering is intentionally delegated to the configurable Logo file field; the QA
  fixture exercises the configurable text alternative.
- Spacing and layout rhythm: the Banner is edge-to-edge, content is centered, and the
  progress index remains near the lower edge. The desktop and mobile compositions remain
  stable without horizontal overflow.
- Colors and visual tokens: overlay copy, CTA, and progress use the storefront white
  token. The existing global dot matrix remains visible over the supplied orange artwork.
- Image quality and asset fidelity: the supplied 1920 × 1200 image is rendered at its
  full intrinsic ratio with `object-fit: contain`; measured image and Banner rectangles
  were both 1280 × 800 on desktop and 390 × 243.75 on mobile. No stretching or forced
  crop was observed.
- Copy and content: Logo/heading, slogan, button label, button URL, images, mobile image,
  and order are all driven by Shopify Metaobject fields. A slide with no link rendered no
  button.

## Comparison history

### Iteration 1

- [P2] The text-mode first line was visibly undersized compared with the reference. It
  used a 10vw/9rem ceiling. The initial evidence is
  `/Users/poi/Workspace/shopify/tenth_athletic/banner-implementation-desktop.png`.
- [P2] React logged a Banner-specific DOM warning for `fetchPriority` during browser
  verification.

Fixes:

- Increased text-mode display sizing to `clamp(3.5rem, 18vw, 20rem)`.
- Emitted the standards-compatible lowercase `fetchpriority` attribute for the first
  image only.

### Iteration 2

- Post-fix evidence is recorded in the combined desktop, mobile, and focused comparison
  images above.
- No actionable P0, P1, or P2 Banner differences remain.
- The mobile Banner is intentionally shorter than the layout board when only the 1920 ×
  1200 desktop image is configured. Merchants can provide `mobile_image` for a taller
  mobile composition without distorting either asset.

## Interaction and runtime checks

- Automatic slide advance: passed.
- Manual progress-index selection: passed.
- Progress growth animation: passed (`home-banner-progress`).
- Link configured: CTA rendered with the configured URL.
- Link absent: CTA count was zero.
- Reduced-motion CSS path is present and disables transitions/progress animation.
- Banner-specific browser console warning: fixed and absent on the final capture.
- Existing app-wide Suspense hydration messages were observed during reload; they are not
  emitted by `HomeBanner` and did not affect its render or interactions.
- Production build: passed.
- TypeScript: passed.
- Changed-file ESLint: passed.

## Findings

No actionable Banner fidelity, responsiveness, interaction, or accessibility findings
remain. The exact shape of uploaded Logo artwork and any independent mobile crop remain
merchant-controlled by design.

## Follow-up polish

- P3: upload the final brand Logo SVG in Shopify instead of using text mode when the
  artwork must match the italic reference exactly.

final result: passed

---

# Product detail six-image gallery design QA

## Validation context

- Source visual truth: `/Users/poi/Desktop/tenth/微信图片_20260812184342_1054_1014.jpg`.
- Reported initial-position evidence:
  `/var/folders/70/_1w6gjb95wg58934fw0p_tvr0000gn/T/codex-clipboard-42509a7e-850b-4d39-8c7f-20bdc77fb15c.png`.
- Normalized inspection image: `/tmp/tenth-pdp-layout-reference.png`.
- Target route: `http://localhost:3080/products/pdp-color-gallery-test-jacket`.
- Required state: six images shown simultaneously, with three product images in the
  first row, three model images in the second row, and no previous/next gallery controls.

## Implementation checks

- The gallery renders exactly six Shopify images as one list instead of keeping a single
  active image.
- Desktop uses three columns and two rows. The first three media entries are identified
  as product images and the last three as model images.
- The purchase panel is rendered as a product-page-level floating layer outside the
  gallery section. On desktop it is fixed to the viewport bottom from the initial render.
- Mobile uses a two-column, three-row grid without horizontal gallery controls.
- Changing Color replaces the selected six-image gallery; other variant changes do not
  change the image set.
- The main purchase panel no longer reads the gallery position, height, or row gap. Its
  downward-collapse and upward-expand behavior remains scroll-direction driven, and its
  existing stop position is calculated relative to the product page and video boundary.
- The purchase panel has no active hidden state or opacity/visibility exit animation.
  After reaching the video boundary it stops being fixed and leaves the viewport only
  through natural page scrolling.
- The separate lower-page fixed purchase panel, its visibility state, and its dedicated
  CSS have been removed. The original main-panel scroll direction and stop-boundary logic
  remain unchanged.
- TypeScript, changed-file ESLint, production build, and `git diff --check` passed.

## Blockers and remaining evidence

- Browser-rendered desktop/mobile screenshots, interaction checks, overflow checks, and
  console checks could not be completed because the documented existing local service at
  `localhost:3080` is not listening. A second development service was not started because
  the project instructions prohibit that unless the user explicitly asks.
- The supplied test media contains product-only photography. Shopify positions 4–6 are
  structurally reserved for model images, but three real model assets are still required
  for the rendered content to match the design reference.

final result: blocked
