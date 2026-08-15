import {Analytics, getPaginationVariables} from '@shopify/hydrogen';
import {RiSearchLine} from '@remixicon/react';
import {Form, useLoaderData, useNavigation} from 'react-router';
import type {Route} from './+types/search';
import type {SearchProductsQuery} from 'storefrontapi.generated';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {ProductItem} from '~/components/ProductItem';
import {ProductListEmpty} from '~/components/ProductListEmpty';

type SearchProductNode = Extract<
  SearchProductsQuery['search']['nodes'][number],
  {__typename: 'Product'}
>;

export const meta: Route.MetaFunction = ({data}) => {
  const term = data?.term;

  return [
    {
      title: term
        ? `Search: ${term} | TENTH Athletic`
        : 'Search | TENTH Athletic',
    },
  ];
};

export async function loader({context, request}: Route.LoaderArgs) {
  const term = new URL(request.url).searchParams.get('q')?.trim() ?? '';

  if (!term) {
    return {term, products: null, error: null};
  }

  try {
    const paginationVariables = getPaginationVariables(request, {pageBy: 16});
    const {search, errors} = await context.storefront.query(
      SEARCH_PRODUCTS_QUERY,
      {
        cache: context.storefront.CacheShort(),
        variables: {
          ...paginationVariables,
          term,
        },
      },
    );

    if (errors?.length) {
      throw new Error(errors.map(({message}) => message).join(', '));
    }

    if (!search) {
      throw new Error('No product search data returned from Shopify');
    }

    const productNodes = search.nodes.filter(
      (node): node is SearchProductNode => node.__typename === 'Product',
    );

    return {
      term,
      products: {...search, nodes: productNodes},
      error: null,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unable to search products';

    console.error('Product search failed:', error);

    return {term, products: null, error: message};
  }
}

export default function SearchPage() {
  const {error, products, term} = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isSearching =
    navigation.state === 'loading' &&
    new URLSearchParams(navigation.location?.search).has('q');

  return (
    <div className="search-page">
      <h1 className="sr-only">Search products</h1>
      <Form
        action="/search"
        className="search-page-form"
        method="get"
        role="search"
      >
        <label className="sr-only" htmlFor="search-page-input">
          Search products
        </label>
        <RiSearchLine aria-hidden="true" className="search-page-input-icon" />
        <input
          autoComplete="off"
          className="search-page-input"
          defaultValue={term}
          id="search-page-input"
          key={term}
          name="q"
          placeholder="Search products"
          type="search"
        />
        <button className="search-page-submit" type="submit">
          {isSearching ? 'Searching' : 'Search'}
        </button>
      </Form>

      {error ? (
        <div className="search-page-error" role="alert">
          <p>Search is currently unavailable.</p>
          <p>{error}</p>
        </div>
      ) : !term ? (
        <div className="search-page-prompt">
          <p>Search the product system by name, type, variant or vendor.</p>
        </div>
      ) : products ? (
        <section aria-labelledby="search-results-heading">
          <header className="search-results-heading">
            <h2 id="search-results-heading">Results for “{term}”</h2>
            <p>{products.totalCount} items</p>
          </header>

          {products.nodes.length > 0 ? (
            <PaginatedResourceSection<SearchProductNode>
              connection={products}
              resourcesClassName="products-grid search-products-grid"
            >
              {({node: product, index}) => (
                <ProductItem
                  key={product.id}
                  loading={index < 8 ? 'eager' : undefined}
                  product={product}
                  trackingParameters={product.trackingParameters}
                />
              )}
            </PaginatedResourceSection>
          ) : (
            <ProductListEmpty searchTerm={term} />
          )}

          <Analytics.SearchView
            data={{searchResults: products.nodes, searchTerm: term}}
          />
        </section>
      ) : null}
    </div>
  );
}

const SEARCH_PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment SearchProductItem on Product {
    id
    handle
    title
    productType
    trackingParameters
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
      optionValues {
        name
      }
    }
    variants(first: 50) {
      nodes {
        availableForSale
        quantityAvailable
        selectedOptions {
          name
          value
        }
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
  }
` as const;

const SEARCH_PRODUCTS_QUERY = `#graphql
  query SearchProducts(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $term: String!
  ) @inContext(country: $country, language: $language) {
    search(
      after: $endCursor
      before: $startCursor
      first: $first
      last: $last
      prefix: LAST
      query: $term
      sortKey: RELEVANCE
      types: [PRODUCT]
      unavailableProducts: LAST
    ) {
      nodes {
        __typename
        ... on Product {
          ...SearchProductItem
        }
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
  ${SEARCH_PRODUCT_ITEM_FRAGMENT}
` as const;
