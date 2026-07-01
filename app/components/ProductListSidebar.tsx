import {useState} from 'react';
import {useSearchParams, useSubmit} from 'react-router';
import type * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';
import {PRODUCT_LIST_INFORMATION_SECTIONS} from '~/lib/productInformation';

const SORT_OPTIONS = [
  {label: 'Newest', value: 'newest'},
  {label: 'Price: Low to High', value: 'price-asc'},
  {label: 'Price: High to Low', value: 'price-desc'},
] as const;

export function ProductListSidebar({productTypes}: {productTypes: string[]}) {
  const [searchParams] = useSearchParams();
  const [openInformationId, setOpenInformationId] = useState<string | null>(
    null,
  );
  const submit = useSubmit();
  const selectedTypes = searchParams.getAll('type');
  const selectedSort = searchParams.get('sort') ?? 'newest';

  return (
    <>
      <form
        className="product-list-controls"
        method="get"
        onChange={(event) => {
          void submit(event.currentTarget, {replace: false});
        }}
      >
        <div className="product-list-sidebar-section product-list-filter-group">
          <h3 className="product-list-sidebar-heading">Filter</h3>
          {productTypes.map((option) => (
            <label className="product-list-filter-option" key={option}>
              <input
                defaultChecked={selectedTypes.includes(option)}
                name="type"
                type="checkbox"
                value={option}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
        <div className="product-list-sidebar-section product-list-sort-group">
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
        </div>
      </form>
      <div className="product-list-sidebar-accordion">
        {PRODUCT_LIST_INFORMATION_SECTIONS.map((item) => (
          <details
            className="product-accordion"
            key={item.id}
            open={openInformationId === item.id}
          >
            <summary
              onClick={(event) => {
                event.preventDefault();
                setOpenInformationId((currentId) =>
                  currentId === item.id ? null : item.id,
                );
              }}
            >
              {item.title}
            </summary>
            <div className="product-accordion-content">{item.content}</div>
          </details>
        ))}
      </div>
    </>
  );
}

export function getProductListControls(request: Request) {
  const url = new URL(request.url);
  const typeFilters = url.searchParams.getAll('type').filter(Boolean);
  const sort = url.searchParams.get('sort') ?? 'newest';

  return {
    sort,
    typeFilters,
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

export function getCollectionFilters(typeFilters: string[]) {
  return typeFilters.map(normalizeProductType);
}

export function filterProductsByType<
  TConnection extends {nodes: Array<{productType?: string}>},
>(connection: TConnection, typeFilters: string[]) {
  const normalizedFilters = getCollectionFilters(typeFilters);

  if (normalizedFilters.length === 0) return connection;

  return {
    ...connection,
    nodes: connection.nodes.filter((product) =>
      normalizedFilters.includes(normalizeProductType(product.productType ?? '')),
    ),
  };
}

export function getProductTypes(products: Array<{productType?: string}>) {
  return Array.from(
    new Set(
      products
        .map((product) => product.productType?.trim())
        .filter((productType): productType is string => Boolean(productType)),
    ),
  );
}

function normalizeProductType(value: string) {
  return value.trim().toLowerCase();
}
