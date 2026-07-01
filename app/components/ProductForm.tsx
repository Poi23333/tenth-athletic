import {Link, useNavigate} from 'react-router';
import {Money, type MappedProductOptions} from '@shopify/hydrogen';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import type {ProductFragment} from 'storefrontapi.generated';

export function ProductForm({
  productTitle,
  productOptions,
  selectedVariant,
}: {
  productTitle: string;
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) {
  const navigate = useNavigate();
  const {open} = useAside();
  const image = selectedVariant?.image;
  const selectableProductOptions = productOptions.filter(
    (option) => option.optionValues.length > 0 && option.name !== 'Title',
  );

  return (
    <div className="product-form">
      <div className="product-form-heading">
        <div>
          <h2>{productTitle}</h2>
          <p className="product-form-specs">
            Two-piece 3D pattern construction
            <br />
            60% reduction in seam length
            <br />
            Tenth Lab modular-ready design
          </p>
        </div>
        {image ? (
          <img
            alt={image.altText || productTitle}
            className="product-form-thumb"
            src={image.url}
          />
        ) : null}
      </div>
      {selectableProductOptions.length ? (
        <div className="product-options-grid">
          {selectableProductOptions.map((option) => {
            const selectedValue =
              option.optionValues.find((value) => value.selected)?.name ??
              option.optionValues[0]?.name ??
              option.name;
            const selectedLabel = formatOptionValue(selectedValue);

            return (
              <div className="product-options" key={option.name}>
                {option.optionValues.length === 1 ? (
                  <div className="product-option-static">
                    <span>{selectedLabel}</span>
                    <OptionChevron />
                  </div>
                ) : (
                  <details className="product-option-select">
                    <summary>
                      <span>{selectedLabel}</span>
                      <OptionChevron />
                    </summary>
                    <div className="product-option-select-menu">
                      {option.optionValues.map((value) => {
                        const {
                          name,
                          handle,
                          variantUriQuery,
                          selected,
                          available,
                          exists,
                          isDifferentProduct,
                        } = value;

                        if (isDifferentProduct) {
                          return (
                            <Link
                              className="product-options-item"
                              key={option.name + name}
                              prefetch="intent"
                              preventScrollReset
                              replace
                              to={`/products/${handle}?${variantUriQuery}`}
                              style={{opacity: available ? 1 : 0.3}}
                            >
                              <span>{formatOptionValue(name)}</span>
                            </Link>
                          );
                        }

                        return (
                          <button
                            type="button"
                            className={`product-options-item${
                              exists && !selected ? ' link' : ''
                            }`}
                            key={option.name + name}
                            style={{opacity: available ? 1 : 0.3}}
                            disabled={!exists}
                            onClick={() => {
                              if (!selected) {
                                void navigate(`?${variantUriQuery}`, {
                                  replace: true,
                                  preventScrollReset: true,
                                });
                              }
                            }}
                          >
                            <span>{formatOptionValue(name)}</span>
                          </button>
                        );
                      })}
                    </div>
                  </details>
                )}
              </div>
            );
          })}
        </div>
      ) : null}
      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          open('cart');
        }}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                  selectedVariant,
                },
              ]
            : []
        }
      >
        <div>
          {selectedVariant?.price ? (
            <Money data={selectedVariant.price} />
          ) : (
            '—'
          )}
        </div>
        <span>
          {selectedVariant?.availableForSale ? 'Add to Cart' : 'Sold out'}
        </span>
      </AddToCartButton>
    </div>
  );
}

function OptionChevron() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="12"
      viewBox="0 0 12 12"
      width="12"
    >
      <path
        d="M3 4.5L6 7.5L9 4.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function formatOptionValue(value: string) {
  if (!value || value !== value.toLowerCase()) return value;

  return value.charAt(0).toUpperCase() + value.slice(1);
}
