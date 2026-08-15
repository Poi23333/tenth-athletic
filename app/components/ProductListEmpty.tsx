import {Link} from 'react-router';

type ProductListEmptyProps = {
  /** When set, copy reflects an active collection filter (e.g. "Man"). */
  collectionTitle?: string;
  /** When set, copy reflects an empty search result. */
  searchTerm?: string;
};

export function ProductListEmpty({
  collectionTitle,
  searchTerm,
}: ProductListEmptyProps) {
  const hasFilter = Boolean(collectionTitle);
  const hasSearch = Boolean(searchTerm);

  return (
    <div className="products-grid product-list-empty-grid" aria-live="polite">
      <div className="product-list-empty">
        <div className="product-list-empty-inner">
          <p className="product-list-empty-count" aria-hidden="true">
            0
          </p>
          <p className="product-list-empty-label">
            {hasSearch ? 'No matching products' : 'No inventory items'}
          </p>
          <p className="product-list-empty-message">
            {hasSearch
              ? `Nothing matches “${searchTerm}”. Try another search term.`
              : hasFilter
                ? `Nothing in ${collectionTitle} matches your current selection.`
                : 'No products are available at the moment.'}
          </p>
          {hasFilter ? (
            <Link
              className="product-list-empty-action"
              prefetch="intent"
              to="/collections/all"
            >
              View all products →
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
