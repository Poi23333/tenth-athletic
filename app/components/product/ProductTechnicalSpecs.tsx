import {forwardRef} from 'react';

type TechnicalSpecImage = {
  altText?: string | null;
  url: string;
};

export type ProductTechnicalSpecification = {
  label: string;
  logo: TechnicalSpecImage | null;
  value: string;
};

function TechnicalSpecificationRow({
  specification,
}: {
  specification: ProductTechnicalSpecification;
}) {
  return (
    <div className="product-specs-row">
      <div className="product-specs-key">{specification.label}</div>
      <div className="product-specs-value">
        {specification.logo ? (
          <img
            alt={specification.logo.altText || ''}
            className="product-specs-logo"
            src={specification.logo.url}
          />
        ) : null}
        <span>{specification.value}</span>
      </div>
    </div>
  );
}

export const ProductTechnicalSpecs = forwardRef<
  HTMLElement,
  {
    careInstructions: TechnicalSpecImage;
    postSkuSpecifications: ReadonlyArray<ProductTechnicalSpecification>;
    sku?: string | null;
    specifications: ReadonlyArray<ProductTechnicalSpecification>;
  }
>(function ProductTechnicalSpecs(
  {careInstructions, postSkuSpecifications, sku, specifications},
  ref,
) {
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
        {specifications.map((specification) => (
          <TechnicalSpecificationRow
            key={specification.label}
            specification={specification}
          />
        ))}
        {sku ? (
          <div className="product-specs-row">
            <div className="product-specs-key">SKU</div>
            <div className="product-specs-value">{sku}</div>
          </div>
        ) : null}
        {postSkuSpecifications.map((specification) => (
          <TechnicalSpecificationRow
            key={specification.label}
            specification={specification}
          />
        ))}
        <div className="product-specs-row">
          <div className="product-specs-key">Care Instructions</div>
          <div className="product-care-instructions">
            <img
              alt={careInstructions.altText || 'Care instructions'}
              className="product-care-instructions-image"
              src={careInstructions.url}
            />
          </div>
        </div>
      </div>
    </section>
  );
});
