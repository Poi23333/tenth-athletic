import {useState} from 'react';
import {useLocation, useNavigate, useSearchParams} from 'react-router';
import type * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';
import {Aside, useAside} from '~/components/Aside';

const SIZE_OPTIONS = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;
const FIT_OPTIONS = ['ContourRace (Race)', 'Field Fit (Relax)'] as const;
const SORT_OPTIONS = [
  {label: 'Featured', value: 'featured'},
  {label: 'Latest', value: 'newest'},
  {label: 'Price — High', value: 'price-desc'},
  {label: 'Price — Low', value: 'price-asc'},
] as const;

type ProductListSort = (typeof SORT_OPTIONS)[number]['value'];
type DraftFilters = {
  sizes: string[];
  fits: string[];
  sort: ProductListSort;
};

export function ProductListSidebar({productCount}: {productCount: number}) {
  const [searchParams] = useSearchParams();
  const {open} = useAside();
  const appliedFilters = readFilters(searchParams);
  const [draftFilters, setDraftFilters] = useState(appliedFilters);

  function openFilterDrawer() {
    setDraftFilters(appliedFilters);
    open('filter');
  }

  return (
    <>
      <button
        aria-haspopup="dialog"
        className="product-list-filter-trigger"
        onClick={openFilterDrawer}
        type="button"
      >
        Filter
      </button>
      <Aside
        type="filter"
        heading={
          <span>
            Filter{' '}
            <span className="filter-drawer-count">
              ({productCount} products)
            </span>
          </span>
        }
      >
        <ProductFilterForm
          draftFilters={draftFilters}
          setDraftFilters={setDraftFilters}
        />
      </Aside>
    </>
  );
}

function ProductFilterForm({
  draftFilters,
  setDraftFilters,
}: {
  draftFilters: DraftFilters;
  setDraftFilters: React.Dispatch<React.SetStateAction<DraftFilters>>;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {close} = useAside();

  function toggleFilter(type: 'sizes' | 'fits', value: string) {
    setDraftFilters((current) => ({
      ...current,
      [type]: current[type].includes(value)
        ? current[type].filter((item) => item !== value)
        : [...current[type], value],
    }));
  }

  function showResults() {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('size');
    nextParams.delete('fit');
    nextParams.delete('sort');
    nextParams.delete('cursor');
    nextParams.delete('direction');

    draftFilters.sizes.forEach((size) => nextParams.append('size', size));
    draftFilters.fits.forEach((fit) => nextParams.append('fit', fit));
    if (draftFilters.sort !== 'featured') {
      nextParams.set('sort', draftFilters.sort);
    }

    const query = nextParams.toString();
    void navigate(`${location.pathname}${query ? `?${query}` : ''}`);
    close();
  }

  return (
    <div className="filter-drawer-form">
      <div className="filter-drawer-sections">
        <FilterSection title="Size">
          <div className="filter-size-options">
            {SIZE_OPTIONS.map((size) => (
              <label className="filter-size-option" key={size}>
                <input
                  checked={draftFilters.sizes.includes(size)}
                  onChange={() => toggleFilter('sizes', size)}
                  type="checkbox"
                />
                <span>{size}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Fit">
          <div className="filter-fit-options">
            {FIT_OPTIONS.map((fit) => (
              <label className="filter-fit-option" key={fit}>
                <input
                  checked={draftFilters.fits.includes(fit)}
                  onChange={() => toggleFilter('fits', fit)}
                  type="checkbox"
                />
                <span>{fit}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Sort By">
          <div className="filter-sort-options">
            {SORT_OPTIONS.map((option) => (
              <label className="filter-sort-option" key={option.value}>
                <input
                  checked={draftFilters.sort === option.value}
                  name="product-list-sort"
                  onChange={() =>
                    setDraftFilters((current) => ({
                      ...current,
                      sort: option.value,
                    }))
                  }
                  type="radio"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      </div>

      <div className="filter-drawer-actions">
        <button
          className="filter-clear-button"
          onClick={() =>
            setDraftFilters({sizes: [], fits: [], sort: 'featured'})
          }
          type="button"
        >
          Clear All
        </button>
        <button
          className="filter-results-button"
          onClick={showResults}
          type="button"
        >
          Show Results
        </button>
      </div>
    </div>
  );
}

function FilterSection({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <details className="filter-drawer-section" open>
      <summary>{title}</summary>
      <div className="filter-drawer-section-content">{children}</div>
    </details>
  );
}

function readFilters(searchParams: URLSearchParams): DraftFilters {
  const sort = searchParams.get('sort');

  return {
    sizes: searchParams
      .getAll('size')
      .filter((size) => SIZE_OPTIONS.some((option) => option === size)),
    fits: searchParams
      .getAll('fit')
      .filter((fit) => FIT_OPTIONS.some((option) => option === fit)),
    sort: SORT_OPTIONS.some((option) => option.value === sort)
      ? (sort as ProductListSort)
      : 'featured',
  };
}

export function getProductListControls(request: Request) {
  const filters = readFilters(new URL(request.url).searchParams);

  return {
    ...filters,
    productFilters: [
      ...filters.sizes.map((value) => ({
        variantOption: {name: 'Size', value},
      })),
      ...filters.fits.map((value) => ({
        variantOption: {name: 'Fit', value},
      })),
    ] satisfies StorefrontAPI.ProductFilter[],
  };
}

export function getCollectionSort(sort: ProductListSort) {
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
      return {
        sortKey: 'CREATED' as StorefrontAPI.ProductCollectionSortKeys,
        reverse: true,
      };
    case 'featured':
      return {
        sortKey:
          'COLLECTION_DEFAULT' as StorefrontAPI.ProductCollectionSortKeys,
        reverse: false,
      };
  }
}
