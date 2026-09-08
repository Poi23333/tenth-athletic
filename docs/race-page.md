# Field Circuit race page

Route: `/race`. Local preview: http://localhost:3080/race.

## Shopify configuration

Confirmed store: **Tenth Athletic**, project domain `5yvudf-m6.myshopify.com`, current Admin handle `tenth-athletic-3`. No race configuration was written to NorthStar.

Definition created in Admin: Content → Metaobjects → **Race event** (`race_event`). Storefront API access is enabled. Create the definition before adding an entry; this is merchant-owned content editable in Admin and read by the Hydrogen storefront.

Entry handle: `field-circuit`, status: Active.

Edit entry: https://admin.shopify.com/store/tenth-athletic-3/content/metaobjects/entries/race_event/637590143350

| Field | Type | Value / behavior |
| --- | --- | --- |
| `starts_at` | Date and time, required | Test: 1 November 2026, 13:00 London / GMT (`2026-11-01T13:00:00Z`) |
| `registration_url` | URL, optional | Empty, pending actual registration URL |
| `photographer_url` | URL, optional | Empty, pending accreditation URL |

The loader reads the entry through the Storefront API with `CacheNone()`. Date changes apply when the page reloads. The browser updates the countdown every second and clamps it to zero after the target time. The initial server timestamp keeps the countdown identical between server HTML and the first client render. Missing/invalid date configuration produces an explicit 503; no test-date fallback is embedded in the page.

The time was selected from the design's 13:00 event opening time. Shopify shows GMT for this November date. This test date does not replace the FAQ's unconfirmed event date.

When either URL is empty, its button is disabled with “Applications not yet open”, as confirmed by the user. Supplying a URL enables that link.

## Assets and content

All assets were copied, with descriptive new names, into `public/images/race/`; the supplied `Tenth.otf` is `public/fonts/tenth-race.otf`. The Downloads directory is never used at runtime. Original files are preserved.

- `Asset 2.svg` → `velopark-wordmark.svg`
- `Asset 3.svg` → `terrain-sun.svg`
- `Asset 4.svg` → `countdown-labels.svg` (reference; accessible live text is rendered)
- `Asset 5.svg` → `circuit-wordmark.svg` (retained resource)
- `Asset 6.svg` → `course-outline.svg`
- `Asset 7.svg` → `stratford-map.svg`
- `Asset 8.svg` → `location-map.svg` (retained reference; replaced by Mapbox)
- `banner-bg.jpg` → `field-circuit-hero.jpg`
- `banner-logo.png` → `field-circuit-logo.png`

`app/data/race-faq.md` preserves the provided FAQ verbatim. `app/data/race-faq.ts` contains the same 6 groups / 34 questions as structured content. Update both if the approved copy changes. Answers support paragraphs, numbered lists, bullets and line breaks. The accordion follows the product page's independent open/close behavior, animated panels and rotating plus icon, with button/ARIA and keyboard support.

Race copy and programme are transcribed from the design; FAQ copy takes precedence within the FAQ. Editorial `[TBC]`, `[EVENT EMAIL]`, and `[INSERT LINK]` placeholders are preserved, including the source's recommended wording. These must be finalized before release. In particular, the design states specific relay composition/terrain rules while the FAQ says final allocations are still to be confirmed.

Page ink: `#5f3058`, matching the supplied SVGs. Hero navigation is white. Typography, two-column layout, illustrations, specifications, programme and FAQ are responsive; mobile stacks the content in reading order. Shared footer commerce benefits are hidden on this event page to match the reference.

## Verification — 2026-09-08

### Mapbox integration

The LOCATION section uses Mapbox GL JS 3.30.0 with the `mapbox/light-v11` style, a purple venue marker, address popup and zoom controls. The SDK loads within 200px of the viewport, is excluded from the Oxygen server bundle via `app/lib/mapbox.client.ts`, and is removed when the component unmounts. Cooperative gestures avoid capturing ordinary page scrolling. Mapbox attribution remains visible. The separate Google Maps directions link was removed at the user’s request.

Create a dedicated public token at https://console.mapbox.com/account/access-tokens with `styles:read` and `fonts:read`, without secret scopes. Restrict the development token to `http://localhost:3080`. Production/preview tokens must allow the actual storefront origin, including its Oxygen preview hostname when testing there; the Shopify Admin domain is not the storefront origin. Use separate tokens for development and production.

Set `PUBLIC_MAPBOX_ACCESS_TOKEN` in the local `.env` and in the appropriate Tenth Athletic Hydrogen/Oxygen environment before deploying. Its value must start with `pk.`. Do not commit the token. This public value is sent to the browser by the route loader. A missing token displays an explicit unconfigured state; an `sk.` or other non-public value is rejected server-side with 503 and is not sent to the browser. Map load failures/timeouts display an error instead of substituting a static map.

The marker uses the user-provided coordinates `[-0.0153, 51.5504]` (longitude, latitude). The popup opens initially and displays only `Lee Valley VeloPark`, without an address or translated name. This is the venue centre, not a confirmed race check-in entrance.

Mapbox validation: project typecheck, scoped ESLint and build passed. Live tiles, token restrictions, marker interactions and responsive WebGL rendering remain blocked pending the user's token. The local preview also returned `500 / Network connection lost` during browser verification; no local service was restarted. The separate skill validator remains blocked by its missing dependencies listed below.

### Earlier race-page verification

- PASS: Shopify definition and active entry saved in Tenth Athletic; the local route successfully reads the remote date.
- PASS: GraphQL code generation, TypeScript check, scoped ESLint, production build, diff whitespace check.
- PASS: desktop 1440px and mobile 390px / 320px browser rendering; no horizontal overflow; Tenth font loaded; computed page ink `rgb(95, 48, 88)`.
- PASS: 34 FAQ buttons; mouse opens the first answer and Enter closes it; source Markdown remains byte-equivalent as text.
- BLOCKED: the bundled Hydrogen skill validator requires missing validator dependencies (`@shopify/hydrogen-react`, `type-fest`, `schema-dts`, `preact`). The project's own typecheck/codegen/build passed; dependencies were not added solely for the separate validator.
- PASS: all seven rendered race images loaded; countdown rollover/expiry checked with five boundary cases; long FAQ list verified on 320px.
- Browser tooling limitation: Chrome automation rewrites the favicon (`data-codex-favicon-badge`) and the in-app browser injects `div#codex-browser-sidebar-comments-root` directly under `html`. React 18 reports hydration warnings on those instrumented loads. The latter extra node was verified in the live DOM; the warning names an unexpected `div` inside `html`. Normal, uninstrumented browser hydration has not been verified. No hydration suppression or error-swallowing was added.
- Not performed: deployment, live site publication, full accessibility audit, performance benchmark.

### Local Mapbox follow-up verification

The existing development service was restarted on port 3080 to load PUBLIC_MAPBOX_ACCESS_TOKEN from .env. Browser verification passed: real Mapbox Light tiles, purple marker, initial English-only Lee Valley VeloPark popup and zoom control. No Google Maps links remain. Production and Preview Oxygen variables were saved separately; deployment has not been triggered.
