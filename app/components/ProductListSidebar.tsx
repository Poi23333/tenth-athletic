import {Link, useSearchParams, useSubmit} from 'react-router';
import type * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';

const SORT_OPTIONS = [
  {label: 'Newest', value: 'newest'},
  {label: 'Price: Low to High', value: 'price-asc'},
  {label: 'Price: High to Low', value: 'price-desc'},
] as const;

/** Preferred Shop filter order; matches Navigation → shop-menu. */
const SHOP_COLLECTION_ORDER = [
  'man',
  'woman',
  'accessories',
  'new-arrivals',
] as const;

export type ProductListCollectionFilter = {
  handle: string;
  title: string;
};

export function ProductListSidebar({
  collectionFilters,
  selectedCollectionHandle,
}: {
  collectionFilters: ProductListCollectionFilter[];
  selectedCollectionHandle?: string;
}) {
  const [searchParams] = useSearchParams();
  const submit = useSubmit();
  const selectedSort = searchParams.get('sort') ?? 'newest';
  const visibleCollectionFilters = sortShopCollections(collectionFilters);

  return (
    <>
      <div className="product-list-controls">
        <div className="product-list-sidebar-section product-list-filter-group">
          <h3 className="product-list-sidebar-heading">Filter</h3>
          {visibleCollectionFilters.map((collection) => {
            const isSelected = collection.handle === selectedCollectionHandle;
            const to = getCollectionFilterUrl(collection.handle, selectedSort);

            return (
              <Link
                className="product-list-filter-option"
                key={collection.handle}
                prefetch="intent"
                to={to}
              >
                <input
                  checked={isSelected}
                  name="collection"
                  readOnly
                  type="checkbox"
                  value={collection.handle}
                />
                <span>{collection.title}</span>
              </Link>
            );
          })}
        </div>
        <form
          className="product-list-sidebar-section product-list-sort-group"
          method="get"
          onChange={(event) => {
            void submit(event.currentTarget, {replace: false});
          }}
        >
          <h3 className="product-list-sidebar-heading">Sort</h3>
          <select
            className="product-list-sort-select"
            defaultValue={selectedSort}
            name="sort"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </form>
      </div>
    </>
  );
}

export function getProductListControls(request: Request) {
  const url = new URL(request.url);
  const sort = url.searchParams.get('sort') ?? 'newest';

  return {
    sort,
  };
}

export function getCollectionSort(sort: string) {
  switch (sort) {
    case 'price-asc':
      return {
        sortKey: 'PRICE' as StorefrontAPI.ProductCollectionSortKeys,
        reverse: false,
      };
    case 'price-desc':
      return {
        sortKey: 'PRICE' as StorefrontAPI.ProductCollectionSortKeys,
        reverse: true,
      };
    case 'newest':
    default:
      return {
        sortKey: 'CREATED' as StorefrontAPI.ProductCollectionSortKeys,
        reverse: true,
      };
  }
}

export function getCatalogSort(sort: string) {
  switch (sort) {
    case 'price-asc':
      return {sortKey: 'PRICE' as StorefrontAPI.ProductSortKeys, reverse: false};
    case 'price-desc':
      return {sortKey: 'PRICE' as StorefrontAPI.ProductSortKeys, reverse: true};
    case 'newest':
    default:
      return {
        sortKey: 'CREATED_AT' as StorefrontAPI.ProductSortKeys,
        reverse: true,
      };
  }
}

function sortShopCollections(collections: ProductListCollectionFilter[]) {
  const orderIndex = new Map(
    SHOP_COLLECTION_ORDER.map((handle, index) => [handle, index]),
  );

  return [...collections].sort((a, b) => {
    const aIndex = orderIndex.get(
      a.handle as (typeof SHOP_COLLECTION_ORDER)[number],
    );
    const bIndex = orderIndex.get(
      b.handle as (typeof SHOP_COLLECTION_ORDER)[number],
    );

    if (aIndex != null && bIndex != null) return aIndex - bIndex;
    if (aIndex != null) return -1;
    if (bIndex != null) return 1;
    return a.title.localeCompare(b.title);
  });
}

function getCollectionFilterUrl(handle: string, sort: string) {
  const searchParams = new URLSearchParams();

  if (sort !== 'newest') {
    searchParams.set('sort', sort);
  }

  const query = searchParams.toString();

  return `/collections/${handle}${query ? `?${query}` : ''}`;
}
