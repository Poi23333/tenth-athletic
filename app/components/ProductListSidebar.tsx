import {Link, useRouteLoaderData, useSearchParams, useSubmit} from 'react-router';
import type * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';
import type {MenuFragment} from 'storefrontapi.generated';
import type {RootLoader} from '~/root';
import {
  getCollectionHandleFromMenuItem,
  getGenderFromCollectionHandle,
  getGenderShopAllHandle,
  type GenderMenuKey,
} from '~/lib/menu';

const SORT_OPTIONS = [
  {label: 'Newest', value: 'newest'},
  {label: 'Price: Low to High', value: 'price-asc'},
  {label: 'Price: High to Low', value: 'price-desc'},
] as const;

/** Preferred Shop filter order; matches Navigation → shop-menu. */
const SHOP_COLLECTION_ORDER = [
  'man-all',
  'woman',
  'accessories',
  'new-arrivals',
] as const;

export type ProductListCollectionFilter = {
  handle: string;
  title: string;
};

type FilterGroup = {
  id: string;
  title: string;
  items: ProductListCollectionFilter[];
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
  const rootData = useRouteLoaderData<RootLoader>('root');
  const selectedSort = searchParams.get('sort') ?? 'newest';
  const gender = getGenderFromCollectionHandle(selectedCollectionHandle);
  const filterGroups = gender
    ? buildGenderFilterGroups({
        gender,
        menu:
          gender === 'man'
            ? rootData?.header?.manMenu
            : rootData?.header?.womanMenu,
        collectionFilters,
        primaryDomainUrl: rootData?.header?.shop?.primaryDomain?.url ?? '',
        publicStoreDomain: rootData?.publicStoreDomain ?? '',
      })
    : null;
  const visibleCollectionFilters = gender
    ? null
    : sortShopCollections(collectionFilters);

  return (
    <>
      <div className="product-list-controls">
        <div className="product-list-sidebar-section product-list-filter-group">
          <h3 className="product-list-sidebar-heading">Filter</h3>
          {filterGroups && gender ? (
            <>
              <CollectionFilterOption
                collection={{
                  handle: getGenderShopAllHandle(gender),
                  title: 'Shop All',
                }}
                selectedCollectionHandle={selectedCollectionHandle}
                selectedSort={selectedSort}
              />
              {filterGroups.map((group) => (
                <div className="product-list-filter-category" key={group.id}>
                  <p className="product-list-filter-category-title">
                    {group.title}
                  </p>
                  {group.items.map((collection) => (
                    <CollectionFilterOption
                      collection={collection}
                      key={collection.handle}
                      selectedCollectionHandle={selectedCollectionHandle}
                      selectedSort={selectedSort}
                    />
                  ))}
                </div>
              ))}
            </>
          ) : (
            visibleCollectionFilters?.map((collection) => (
              <CollectionFilterOption
                collection={collection}
                key={collection.handle}
                selectedCollectionHandle={selectedCollectionHandle}
                selectedSort={selectedSort}
              />
            ))
          )}
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

function CollectionFilterOption({
  collection,
  selectedCollectionHandle,
  selectedSort,
}: {
  collection: ProductListCollectionFilter;
  selectedCollectionHandle?: string;
  selectedSort: string;
}) {
  const isSelected = collection.handle === selectedCollectionHandle;
  const to = getCollectionFilterUrl(collection.handle, selectedSort);

  return (
    <Link
      className="product-list-filter-option"
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

function buildGenderFilterGroups({
  gender,
  menu,
  collectionFilters,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  gender: GenderMenuKey;
  menu?: MenuFragment | null;
  collectionFilters: ProductListCollectionFilter[];
  primaryDomainUrl: string;
  publicStoreDomain: string;
}): FilterGroup[] {
  if (menu?.items?.length) {
    return menu.items
      .map((category) => ({
        id: category.id,
        title: category.title,
        items: (category.items ?? [])
          .map((item) => {
            const handle = getCollectionHandleFromMenuItem({
              url: item.url,
              primaryDomainUrl,
              publicStoreDomain,
            });
            if (!handle) return null;

            return {
              handle,
              title: stripGenderPrefix(item.title, gender),
            };
          })
          .filter((item): item is ProductListCollectionFilter => item != null),
      }))
      .filter((group) => group.items.length > 0);
  }

  // Menu missing: keep gender-scoped collections with cleaned titles, no groups.
  const shopAllHandle = getGenderShopAllHandle(gender);
  const prefix = `${gender}-`;
  return [
    {
      id: gender,
      title: gender === 'man' ? 'Man' : 'Woman',
      items: collectionFilters
        .filter(
          (collection) =>
            collection.handle === gender ||
            collection.handle === shopAllHandle ||
            collection.handle.startsWith(prefix),
        )
        .map((collection) => ({
          handle: collection.handle,
          title: stripGenderPrefix(collection.title, gender),
        }))
        .filter(
          (collection) =>
            collection.handle !== gender &&
            collection.handle !== shopAllHandle,
        ),
    },
  ].filter((group) => group.items.length > 0);
}

function stripGenderPrefix(title: string, gender: GenderMenuKey) {
  const pattern =
    gender === 'man' ? /^Man\s*[-–—:]\s*/i : /^Woman\s*[-–—:]\s*/i;
  return title.replace(pattern, '').trim() || title;
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
