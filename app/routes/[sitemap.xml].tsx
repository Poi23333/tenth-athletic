import {INFO_PAGES} from '~/data/info-pages';
import {SITE_ORIGIN} from '~/lib/seo';

export function loader() {
  // Only published routes belong here. The catalog is still Coming soon,
  // and /race currently renders the same content as the canonical homepage.
  const paths = ['/', ...Object.keys(INFO_PAGES).map((handle) => `/pages/${handle}`)];
  const urls = paths
    .map((path) => `<url><loc>${SITE_ORIGIN}${path}</loc></url>`)
    .join('');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
    {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    },
  );
}
