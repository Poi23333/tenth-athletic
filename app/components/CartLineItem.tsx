import type {CartLayout, LineItemChildrenMap} from '~/components/CartMain';
import {CartForm, Image, Money, type OptimisticCartLine} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link, useFetcher} from 'react-router';
import {useEffect, useState} from 'react';
import {useAside} from './Aside';
import type {CartApiQueryFragment} from 'storefrontapi.generated';

export type CartLine = OptimisticCartLine<CartApiQueryFragment>;

export function CartLineItem({
  layout,
  line,
  childrenMap,
}: {
  layout: CartLayout;
  line: CartLine;
  childrenMap: LineItemChildrenMap;
}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();
  const lineItemChildren = childrenMap[id];
  const childrenLabelId = `cart-line-children-${id}`;
  const variantLabel = selectedOptions
    .map((option) => `${option.name}: ${option.value}`)
    .join(' | ');

  return (
    <li key={id} className="cart-line">
      <div className="cart-line-inner">
        {image && (
          <div className="cart-line-image">
            <Image
              alt={title}
              data={image}
              loading="lazy"
              sizes="96px"
            />
          </div>
        )}

        <div className="cart-line-details">
          <div className="cart-line-header">
            <p className="cart-line-title">
              <Link
                prefetch="intent"
                to={lineItemUrl}
                onClick={() => {
                  if (layout === 'aside') {
                    close();
                  }
                }}
              >
                {product.title}
              </Link>
            </p>
            {line?.cost?.totalAmount ? (
              <div className="cart-line-price">
                <Money data={line.cost.totalAmount} />
              </div>
            ) : null}
          </div>
          {variantLabel ? (
            <p className="cart-line-variant">{variantLabel}</p>
          ) : null}
          <div className="cart-line-footer">
            <CartLineQuantity line={line} />
            <CartLineRemoveButton lineIds={[id]} disabled={!!line.isOptimistic} />
          </div>
        </div>
      </div>

      {lineItemChildren ? (
        <div>
          <p id={childrenLabelId} className="sr-only">
            Line items with {product.title}
          </p>
          <ul aria-labelledby={childrenLabelId} className="cart-line-children">
            {lineItemChildren.map((childLine) => (
              <CartLineItem
                childrenMap={childrenMap}
                key={childLine.id}
                line={childLine}
                layout={layout}
              />
            ))}
          </ul>
        </div>
      ) : null}
    </li>
  );
}

function CartLineQuantity({line}: {line: CartLine}) {
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));
  const [draftQuantity, setDraftQuantity] = useState(String(quantity));
  const inputFetcher = useFetcher({key: getUpdateKey([lineId])});

  useEffect(() => {
    setDraftQuantity(String(quantity));
  }, [quantity]);

  function commitDraftQuantity() {
    const nextDraftQuantity = Number.parseInt(draftQuantity, 10);

    if (!Number.isFinite(nextDraftQuantity)) {
      setDraftQuantity(String(quantity));
      return;
    }

    const normalizedQuantity = Math.max(1, nextDraftQuantity);
    setDraftQuantity(String(normalizedQuantity));

    if (normalizedQuantity !== quantity) {
      void inputFetcher.submit(
        {
          cartFormInput: JSON.stringify({
            action: CartForm.ACTIONS.LinesUpdate,
            inputs: {lines: [{id: lineId, quantity: normalizedQuantity}]},
          }),
        },
        {
          action: '/cart',
          method: 'post',
        },
      );
    }
  }

  function commitButtonQuantity(nextButtonQuantity: number) {
    void inputFetcher.submit(
      {
        cartFormInput: JSON.stringify({
          action: CartForm.ACTIONS.LinesUpdate,
          inputs: {lines: [{id: lineId, quantity: nextButtonQuantity}]},
        }),
      },
      {
        action: '/cart',
        method: 'post',
      },
    );
  }

  return (
    <div>
      <div className="cart-line-quantity-label">Quantity</div>
      <div className="cart-line-quantity">
        <button
          aria-label="Decrease quantity"
          disabled={quantity <= 1 || !!isOptimistic}
          name="decrease-quantity"
          onClick={() => commitButtonQuantity(prevQuantity)}
          type="button"
          value={prevQuantity}
        >
          −
        </button>
        <input
          aria-label="Quantity"
          className="cart-line-quantity-input"
          disabled={!!isOptimistic}
          inputMode="numeric"
          min={1}
          name="quantity"
          onBlur={commitDraftQuantity}
          onChange={(event) => {
            setDraftQuantity(event.currentTarget.value.replace(/\D/g, ''));
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              event.currentTarget.blur();
            }
            if (event.key === 'Escape') {
              setDraftQuantity(String(quantity));
              event.currentTarget.blur();
            }
          }}
          pattern="[0-9]*"
          type="text"
          value={draftQuantity}
        />
        <button
          aria-label="Increase quantity"
          disabled={!!isOptimistic}
          name="increase-quantity"
          onClick={() => commitButtonQuantity(nextQuantity)}
          type="button"
          value={nextQuantity}
        >
          +
        </button>
      </div>
    </div>
  );
}

function CartLineRemoveButton({
  lineIds,
  disabled,
}: {
  lineIds: string[];
  disabled: boolean;
}) {
  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button
        className="cart-line-remove"
        disabled={disabled}
        type="submit"
      >
        Remove
      </button>
    </CartForm>
  );
}

function getUpdateKey(lineIds: string[]) {
  return [CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-');
}
