import {Link} from 'react-router';

type ProductListEmptyProps = {
  /** When set, copy reflects an active collection filter (e.g. "Man"). */
  collectionTitle?: string;
};

export function ProductListEmpty({collectionTitle}: ProductListEmptyProps) {
  const hasFilter = Boolean(collectionTitle);

  return (
    <div className="products-grid product-list-empty-grid" aria-live="polite">
      <div className="product-list-empty">
        <div className="product-list-empty-inner">
          <p className="product-list-empty-count" aria-hidden="true">
            0
          </p>
          <p className="product-list-empty-label">No inventory items</p>
          <p className="product-list-empty-message">
            {hasFilter
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
