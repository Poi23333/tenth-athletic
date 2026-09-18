# FIELD CIRCUIT SEO — 18 September 2026

Scope: keep the event on the homepage; defer product SEO and Product structured data until the catalogue is ready.

## Implemented

- The canonical event URL is https://tenthathletic.com/. `/race` retains the same page and points its canonical to the homepage; navigation uses the canonical URL.
- The sitemap contains the homepage and 12 published information pages, with no duplicate `/race` or unpublished catalogue URLs. Google Search Console previously accepted it with 13 discovered pages.
- Unique titles and descriptions, canonical links, Open Graph and Twitter metadata on all 13 public pages.
- Organization and WebSite JSON-LD throughout the site; Event JSON-LD on the event page. No fictional offers, performers or reviews. Registration URLs remain empty in Shopify, so ticket offers are deliberately omitted.
- Event time corrected in Shopify's existing `race_event / field-circuit` entry to **24 October 2026, 15:00 Europe/London** (`2026-10-24T14:00:00Z`). The confirmed programme lasts seven hours, ending at 22:00 local (`21:00Z`). Countdown, visible date/hours, first FAQ and Event JSON-LD use that source. If the programme duration or times change, update `eventEnd` and `raceProgramme` together.
- Visible event-name H1, date, local time, complete venue address and direct links to venue travel information, entry terms and privacy notice. Text, FAQ answers and links are present in the initial server-rendered HTML.
- Responsive WebP hero images with high fetch priority; explicit logo dimensions; font-display swap; short-lived header-query caching. The map retains its existing deferred loading.
- Search and wishlist explicitly use `noindex,follow`; Coming Soon already uses noindex. These utility pages are excluded from the sitemap.

## Verification before publication

- Shopify UI confirmed “Entry saved”; the storefront returned the corrected UTC start time.
- Project validator/typecheck and production build passed. Build still warns about four intentionally unpublished standard commerce routes. ESLint checked the applicable modified routes; the repository configuration ignores several other source paths.
- Local HTTP audit: all 13 sitemap URLs return 200, have unique titles/descriptions and self-canonicals, and permit Googlebot indexing. `/race` canonical, Event dates/address, JSON-LD parsing and utility noindex all passed.
- Smartphone Googlebot receives the same Event data, event-name heading, date, address and FAQ content in HTML without JavaScript execution.
- Hero file sizes: original 4,601,923 bytes; WebP 640: 86,644; 960: 233,148; 1440: 582,438; 1920: 1,099,960. Browser selection depends on viewport and device pixel ratio; file-size reductions are not a Core Web Vitals score.

## Outstanding measurements

Google PageSpeed API returned HTTP 429 during this session. No mobile performance score or Core Web Vitals pass is claimed from that failed request. Search Console needs time to collect field data and process updated pages; an indexing request does not guarantee ranking or an Event rich result.

Reference: [Google Event structured data](https://developers.google.com/search/docs/appearance/structured-data/event), [Organization structured data](https://developers.google.com/search/docs/appearance/structured-data/organization), [mobile-first indexing](https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing).
