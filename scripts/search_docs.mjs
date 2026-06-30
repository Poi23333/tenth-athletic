#!/usr/bin/env node

const query = process.argv.slice(2).join(' ').trim();

if (!query) {
  console.error('Usage: node scripts/search_docs.mjs "<query>"');
  process.exit(1);
}

const searchUrl = new URL('https://shopify.dev/search');
searchUrl.searchParams.set('q', query);

// eslint-disable-next-line no-console
console.log(`Shopify docs search: ${searchUrl.toString()}`);
// eslint-disable-next-line no-console
console.log('');
// eslint-disable-next-line no-console
console.log('Open the URL above to review official Shopify documentation.');
