import {Link, useNavigate} from 'react-router';
import {Money, type MappedProductOptions} from '@shopify/hydrogen';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import type {ProductFragment} from 'storefrontapi.generated';

export function ProductForm({
  icon,
  summary,
  productTitle,
  productOptions,
  selectedVariant,
}: {
  icon: string;
  summary: readonly string[];
  productTitle: string;
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) {
  const navigate = useNavigate();
  const {open} = useAside();
  const selectableProductOptions = productOptions.filter(
    (option) => option.optionValues.length > 0 && option.name !== 'Title',
  );
  return (
    <div className="product-form">
      <div className="product-form-heading">
        <div>
          <h2>{productTitle}</h2>
          <p className="product-form-specs">
            {summary.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
        </div>
        <img
          alt=""
          aria-hidden="true"
          className="product-form-thumb"
          src={icon}
        />
      </div>
      <div className="product-purchase-controls">
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
                                aria-current={selected ? 'true' : undefined}
                                className={`product-options-item${
                                  selected ? ' is-selected' : ''
                                }${available ? '' : ' is-unavailable'}`}
                                key={option.name + name}
                                onClick={(event) => {
                                  event.currentTarget
                                    .closest('details')
                                    ?.removeAttribute('open');
                                }}
                                prefetch="intent"
                                preventScrollReset
                                replace
                                to={`/products/${handle}?${variantUriQuery}`}
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
                              }${selected ? ' is-selected' : ''}${
                                available ? '' : ' is-unavailable'
                              }`}
                              key={option.name + name}
                              aria-current={selected ? 'true' : undefined}
                              disabled={!exists}
                              onClick={(event) => {
                                event.currentTarget
                                  .closest('details')
                                  ?.removeAttribute('open');

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
          <span className="product-form-price">
            {selectedVariant?.price ? (
              <Money data={selectedVariant.price} />
            ) : (
              '—'
            )}
          </span>
          <span className="product-form-add-label">
            {selectedVariant?.availableForSale ? 'Add to Cart' : 'Sold out'}
          </span>
        </AddToCartButton>
      </div>
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
