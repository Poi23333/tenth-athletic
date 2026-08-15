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

export type ProductCareInstruction = {
  icon: TechnicalSpecImage;
  id: string;
  name: string;
};

export const ProductTechnicalSpecs = forwardRef<
  HTMLElement,
  {
    careInstructions: ReadonlyArray<ProductCareInstruction>;
    sku?: string | null;
    specifications: ReadonlyArray<ProductTechnicalSpecification>;
  }
>(function ProductTechnicalSpecs({careInstructions, sku, specifications}, ref) {
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
        {specifications.map((item) => (
          <div className="product-specs-row" key={item.label}>
            <div className="product-specs-key">{item.label}</div>
            <div className="product-specs-value">
              {item.logo ? (
                <img
                  alt={item.logo.altText || ''}
                  className="product-specs-logo"
                  src={item.logo.url}
                />
              ) : null}
              <span>{item.value}</span>
            </div>
          </div>
        ))}
        <div className="product-specs-row">
          <div className="product-specs-key">Care Instructions</div>
          <div className="product-care-instructions">
            {careInstructions.map((instruction) => (
              <div className="product-care-instruction" key={instruction.id}>
                <img alt="" aria-hidden="true" src={instruction.icon.url} />
                <span>{instruction.name}</span>
              </div>
            ))}
          </div>
        </div>
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
