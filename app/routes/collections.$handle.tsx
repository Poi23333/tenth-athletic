import {redirect, useLoaderData} from 'react-router';
import type {Route} from './+types/collections.$handle';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ProductItem} from '~/components/ProductItem';
import {ProductListEmpty} from '~/components/ProductListEmpty';
import {
  ProductListSidebar,
  getCatalogSort,
  getCollectionSort,
  getProductListControls,
} from '~/components/ProductListSidebar';
import {getGenderShopAllProductTag} from '~/lib/menu';
import type {ProductItemFragment} from 'storefrontapi.generated';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `${data?.collection.title ?? ''} | TENTH Athletic`}];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 16,
  });
  const {sort} = getProductListControls(request);

  if (!handle) {
    throw redirect('/collections');
  }

  const shopAllTag = getGenderShopAllProductTag(handle);

  if (shopAllTag) {
    const collectionSort = getCollectionSort(sort);
    const catalogSort = getCatalogSort(sort);

    const [{collection, collections}, {products}] = await Promise.all([
      storefront.query(COLLECTION_QUERY, {
        variables: {
          handle,
          // Collection products are unused for Shop All; keep the query valid.
          first: 1,
          ...collectionSort,
        },
      }),
      storefront.query(SHOP_ALL_PRODUCTS_QUERY, {
        variables: {
          ...paginationVariables,
          ...catalogSort,
          query: `tag:${shopAllTag}`,
        },
      }),
    ]);

    if (!collection) {
      throw new Response(`Collection ${handle} not found`, {
        status: 404,
      });
    }

    redirectIfHandleIsLocalized(request, {handle, data: collection});

    return {
      collection: {
        ...collection,
        products,
      },
      collectionFilters: collections.nodes,
    };
  }

  const sortInput = getCollectionSort(sort);
  const [{collection, collections}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {
        handle,
        ...paginationVariables,
        ...sortInput,
      },
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  redirectIfHandleIsLocalized(request, {handle, data: collection});

  return {
    collection,
    collectionFilters: collections.nodes,
  };
}

function loadDeferredData(_args: Route.LoaderArgs) {
  return {};
}

export default function Collection() {
  const {collection, collectionFilters} = useLoaderData<typeof loader>();

  return (
    <div className="collection product-list-page">
      <aside className="product-list-sidebar" aria-label="Filters and information">
        <ProductListSidebar
          collectionFilters={collectionFilters}
          selectedCollectionHandle={collection.handle}
        />
      </aside>
      <div className="product-list-main">
        <header className="product-list-heading">
          <h1>{collection.title}</h1>
          {collection.description ? (
            <p className="collection-description">{collection.description}</p>
          ) : null}
        </header>
        <div className="product-list-mobile-toolbar" aria-hidden="true">
          <span className="product-list-sidebar-heading">Filter</span>
          <span className="product-list-sidebar-heading">Sort</span>
        </div>
        {collection.products.nodes.length > 0 ? (
          <PaginatedResourceSection<ProductItemFragment>
            connection={collection.products}
            resourcesClassName="products-grid"
          >
            {({node: product, index}) => (
              <ProductItem
                key={product.id}
                product={product}
                loading={index < 8 ? 'eager' : undefined}
              />
            )}
          </PaginatedResourceSection>
        ) : (
          <ProductListEmpty collectionTitle={collection.title} />
        )}
      </div>
      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </div>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
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
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
  }
` as const;

const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
  ) @inContext(country: $country, language: $language) {
    collections(first: 250) {
      nodes {
        handle
        title
      }
    }
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor,
        sortKey: $sortKey,
        reverse: $reverse
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
` as const;

const SHOP_ALL_PRODUCTS_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query ShopAllProducts(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $sortKey: ProductSortKeys
    $reverse: Boolean
    $query: String!
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor,
      sortKey: $sortKey,
      reverse: $reverse,
      query: $query
    ) {
      nodes {
        ...ProductItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        endCursor
        startCursor
      }
    }
  }
` as const;
