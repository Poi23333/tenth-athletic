import {forwardRef} from 'react';
import {AURALITE_PRODUCT_DETAILS} from '~/data/productDetails';

export const ProductTechnicalSpecs = forwardRef<
  HTMLElement,
  {sku?: string | null}
>(function ProductTechnicalSpecs({sku}, ref) {
  return (
    <section
      className="product-specs"
      aria-label="Technical specifications"
      ref={ref}
    >
      <h2 className="product-specs-heading">
        Technical
        <br />
        Specifications
      </h2>
      <div className="product-specs-table">
        {AURALITE_PRODUCT_DETAILS.specifications.map((item) => (
          <div className="product-specs-row" key={item.label}>
            <div className="product-specs-key">{item.label}</div>
            <div className="product-specs-value">{item.value}</div>
          </div>
        ))}
        {sku ? (
          <div className="product-specs-row">
            <div className="product-specs-key">SKU</div>
            <div className="product-specs-value">{sku}</div>
          </div>
        ) : null}
      </div>
    </section>
  );
});
