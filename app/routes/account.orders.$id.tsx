import {Link, redirect, useLoaderData} from 'react-router';
import type {Route} from './+types/account.orders.$id';
import {Image, Money} from '@shopify/hydrogen';
import type {
  OrderLineItemFullFragment,
  OrderQuery,
} from 'customer-accountapi.generated';
import {CUSTOMER_ORDER_QUERY} from '~/graphql/customer-account/CustomerOrderQuery';
import {
  formatAccountDate,
  formatAccountStatus,
  lineItemTotal,
} from '~/lib/account';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `Order ${data?.order?.name ?? ''}`.trim()}];
};

export async function loader({params, context}: Route.LoaderArgs) {
  const {customerAccount} = context;
  customerAccount.handleAuthStatus();

  if (!params.id) {
    return redirect('/account/orders');
  }

  const orderId = atob(params.id);
  const {data, errors}: {data: OrderQuery; errors?: Array<{message: string}>} =
    await customerAccount.query(CUSTOMER_ORDER_QUERY, {
      variables: {
        orderId,
        language: customerAccount.i18n.language,
      },
    });

  if (errors?.length || !data?.order) {
    throw new Error('Order not found');
  }

  return {order: data.order};
}

export default function OrderRoute() {
  const {order} = useLoaderData<typeof loader>();
  const lineItems = order.lineItems.nodes;
  const discountApplications = order.discountApplications.nodes;
  const firstDiscount = discountApplications[0]?.value;
  const discountValue =
    firstDiscount?.__typename === 'MoneyV2' ? firstDiscount : null;
  const discountPercentage =
    firstDiscount?.__typename === 'PricingPercentageValue'
      ? firstDiscount.percentage
      : null;
  const financialLabel = formatAccountStatus(order.financialStatus);
  const fulfillmentLabel = formatAccountStatus(order.fulfillmentStatus);
  const trackingEntries = order.fulfillments.nodes.flatMap((fulfillment) =>
    fulfillment.trackingInformation.filter(
      (info) => info.number || info.url || info.company,
    ),
  );
  const addressLines = Array.isArray(order.shippingAddress?.formatted)
    ? order.shippingAddress.formatted
    : order.shippingAddress?.formatted
      ? [order.shippingAddress.formatted]
      : [];
  const hasShipping =
    Number(order.totalShipping.amount) > 0 || Boolean(order.shippingLine?.title);

  return (
    <div className="account-order">
      <Link className="account-back-link" to="/account/orders">
        Back to orders
      </Link>
      <header className="account-order-header">
        <h2>Order {order.name}</h2>
        <p>
          Placed on {formatAccountDate(order.processedAt)}
          {order.confirmationNumber
            ? ` · Confirmation ${order.confirmationNumber}`
            : ''}
        </p>
        <p className="account-order-status">
          {[financialLabel, fulfillmentLabel].filter(Boolean).join(' · ')}
        </p>
      </header>

      <div className="account-order-layout">
        <div className="account-order-scroll">
          <table className="account-order-table">
            <thead>
              <tr>
                <th scope="col">Product</th>
                <th scope="col">Price</th>
                <th scope="col">Quantity</th>
                <th scope="col">Total</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((lineItem) => (
                <OrderLineRow key={lineItem.id} lineItem={lineItem} />
              ))}
            </tbody>
            <tfoot>
              {discountValue || discountPercentage ? (
                <tr>
                  <th scope="row" colSpan={3}>
                    Discounts
                  </th>
                  <td>
                    {discountPercentage ? (
                      <span>-{discountPercentage}% OFF</span>
                    ) : (
                      discountValue && <Money data={discountValue} />
                    )}
                  </td>
                </tr>
              ) : null}
              {order.subtotal ? (
                <tr>
                  <th scope="row" colSpan={3}>
                    Subtotal
                  </th>
                  <td>
                    <Money data={order.subtotal} />
                  </td>
                </tr>
              ) : null}
              {hasShipping ? (
                <tr>
                  <th scope="row" colSpan={3}>
                    {order.shippingLine?.title || 'Shipping'}
                  </th>
                  <td>
                    <Money data={order.totalShipping} />
                  </td>
                </tr>
              ) : null}
              {order.totalTax ? (
                <tr>
                  <th scope="row" colSpan={3}>
                    Tax
                  </th>
                  <td>
                    <Money data={order.totalTax} />
                  </td>
                </tr>
              ) : null}
              <tr>
                <th scope="row" colSpan={3}>
                  Total
                </th>
                <td>
                  <Money data={order.totalPrice} />
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <aside className="account-order-aside">
          <section>
            <h3>Shipping address</h3>
            {order.shippingAddress ? (
              <address>
                {addressLines.length
                  ? addressLines.map((line) => (
                      <span key={line}>{line}</span>
                    ))
                  : order.shippingAddress.formattedArea ||
                    order.shippingAddress.name}
              </address>
            ) : (
              <p>No shipping address defined.</p>
            )}
          </section>

          {trackingEntries.length ? (
            <section>
              <h3>Tracking</h3>
              <ul className="account-tracking-list">
                {trackingEntries.map((info) => {
                  const label = [info.company, info.number]
                    .filter(Boolean)
                    .join(' · ');
                  return (
                    <li key={`${info.company}-${info.number}-${info.url}`}>
                      {info.url ? (
                        <a href={info.url} rel="noreferrer" target="_blank">
                          {label || 'Track shipment'}
                        </a>
                      ) : (
                        <span>{label}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}

          <p>
            <a
              className="account-text-button"
              href={order.statusPageUrl}
              rel="noreferrer"
              target="_blank"
            >
              View order status
            </a>
          </p>
        </aside>
      </div>
    </div>
  );
}

function OrderLineRow({lineItem}: {lineItem: OrderLineItemFullFragment}) {
  const total = lineItemTotal(
    lineItem.price,
    lineItem.quantity,
    lineItem.totalDiscount,
  );

  return (
    <tr>
      <td>
        <div className="account-order-product">
          {lineItem.image ? (
            <Image
              alt={lineItem.image.altText || lineItem.title}
              data={lineItem.image}
              height={72}
              loading="lazy"
              sizes="72px"
              width={72}
            />
          ) : null}
          <div>
            <p>{lineItem.title}</p>
            {lineItem.variantTitle ? <small>{lineItem.variantTitle}</small> : null}
          </div>
        </div>
      </td>
      <td>{lineItem.price ? <Money data={lineItem.price} /> : null}</td>
      <td>{lineItem.quantity}</td>
      <td>{total ? <Money data={total} /> : null}</td>
    </tr>
  );
}
