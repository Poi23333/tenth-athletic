import {data} from 'react-router';
import type {Route} from './+types/api.wishlist-products';

const PRODUCT_GID_PATTERN = /^gid:\/\/shopify\/Product\/\d+$/;

export async function action({context, request}: Route.ActionArgs) {
  if (request.method !== 'POST') {
    return data({error: 'Method not allowed'}, {status: 405});
  }

  const body = (await request.json()) as {productIds?: unknown};
  if (
    !Array.isArray(body.productIds) ||
    body.productIds.length > 100 ||
    body.productIds.some(
      (id) => typeof id !== 'string' || !PRODUCT_GID_PATTERN.test(id),
    )
  ) {
    return data({error: 'Invalid productIds'}, {status: 400});
  }
  const productIds = body.productIds as string[];

  if (productIds.length === 0) return {products: []};

  const {nodes} = await context.storefront.query(WISHLIST_PRODUCTS_QUERY, {
    variables: {ids: productIds},
    cache: context.storefront.CacheNone(),
  });

  return {products: nodes.filter((node) => node?.__typename === 'Product')};
}

const WISHLIST_PRODUCTS_QUERY = `#graphql
  query WishlistProducts(
    $ids: [ID!]!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    nodes(ids: $ids) {
      __typename
      ... on Product {
        id
        handle
        title
        productType
        featuredImage {
          id
          altText
          url
          width
          height
        }
        fullImage: metafield(namespace: "custom", key: "full") {
          reference {
            __typename
            ... on MediaImage {
              image {
                id
                altText
                url
                width
                height
              }
            }
          }
        }
        options {
          name
          optionValues { name }
        }
        variants(first: 50) {
          nodes {
            availableForSale
            quantityAvailable
            selectedOptions { name value }
          }
        }
        priceRange {
          minVariantPrice { amount currencyCode }
          maxVariantPrice { amount currencyCode }
        }
      }
    }
  }
` as const;
