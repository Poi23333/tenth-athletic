import {
  Link,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from 'react-router';
import type {Route} from './+types/account.orders._index';
import {useRef} from 'react';
import {
  Image,
  Money,
  flattenConnection,
  getPaginationVariables,
} from '@shopify/hydrogen';
import {
  ORDER_FILTER_FIELDS,
  buildOrderSearchQuery,
  parseOrderFilters,
  type OrderFilterParams,
} from '~/lib/orderFilters';
import {CUSTOMER_ORDERS_QUERY} from '~/graphql/customer-account/CustomerOrdersQuery';
import type {
  CustomerOrdersFragment,
  OrderItemFragment,
} from 'customer-accountapi.generated';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {formatAccountDate, formatAccountStatus} from '~/lib/account';

type OrdersLoaderData = {
  customer: CustomerOrdersFragment;
  filters: OrderFilterParams;
};

export const meta: Route.MetaFunction = () => {
  return [{title: 'Orders'}];
};

export async function loader({request, context}: Route.LoaderArgs) {
  const {customerAccount} = context;
  customerAccount.handleAuthStatus();

  const paginationVariables = getPaginationVariables(request, {
    pageBy: 20,
  });

  const url = new URL(request.url);
  const filters = parseOrderFilters(url.searchParams);
  const query = buildOrderSearchQuery(filters);

  const {data, errors} = await customerAccount.query(CUSTOMER_ORDERS_QUERY, {
    variables: {
      ...paginationVariables,
      query,
      language: customerAccount.i18n.language,
    },
  });

  if (errors?.length || !data?.customer) {
    throw Error('Customer orders not found');
  }

  return {customer: data.customer, filters};
}

export default function Orders() {
  const {customer, filters} = useLoaderData<OrdersLoaderData>();
  const {orders} = customer;

  return (
    <div className="account-orders">
      <OrderSearchForm currentFilters={filters} />
      <OrdersTable orders={orders} filters={filters} />
    </div>
  );
}

function OrdersTable({
  orders,
  filters,
}: {
  orders: CustomerOrdersFragment['orders'];
  filters: OrderFilterParams;
}) {
  const hasFilters = !!(filters.name || filters.confirmationNumber);

  return (
    <div className="account-orders-list" aria-live="polite">
      {orders?.nodes.length ? (
        <PaginatedResourceSection
          connection={orders}
          nextLabel="Load more"
          previousLabel="Previous"
          resourcesClassName="account-order-rows"
        >
          {({node: order}) => <OrderItem key={order.id} order={order} />}
        </PaginatedResourceSection>
      ) : (
        <EmptyOrders hasFilters={hasFilters} />
      )}
    </div>
  );
}

function EmptyOrders({hasFilters = false}: {hasFilters?: boolean}) {
  return (
    <div className="account-empty">
      {hasFilters ? (
        <>
          <p>No orders found matching your search.</p>
          <Link to="/account/orders">Clear filters</Link>
        </>
      ) : (
        <>
          <p>You haven&apos;t placed any orders yet.</p>
          <Link to="/collections">Start shopping</Link>
        </>
      )}
    </div>
  );
}

function OrderSearchForm({
  currentFilters,
}: {
  currentFilters: OrderFilterParams;
}) {
  const [, setSearchParams] = useSearchParams();
  const navigation = useNavigation();
  const isSearching =
    navigation.state !== 'idle' &&
    navigation.location?.pathname?.includes('orders');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();

    const name = formData.get(ORDER_FILTER_FIELDS.NAME)?.toString().trim();
    const confirmationNumber = formData
      .get(ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER)
      ?.toString()
      .trim();

    if (name) params.set(ORDER_FILTER_FIELDS.NAME, name);
    if (confirmationNumber)
      params.set(ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER, confirmationNumber);

    setSearchParams(params);
  };

  const hasFilters = currentFilters.name || currentFilters.confirmationNumber;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="account-order-search"
      aria-label="Search orders"
    >
      <fieldset>
        <legend>Filter orders</legend>
        <div className="account-order-search-fields">
          <label className="account-field">
            <span>Order number</span>
            <input
              type="search"
              name={ORDER_FILTER_FIELDS.NAME}
              placeholder="Order #"
              aria-label="Order number"
              defaultValue={currentFilters.name || ''}
            />
          </label>
          <label className="account-field">
            <span>Confirmation number</span>
            <input
              type="search"
              name={ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER}
              placeholder="Confirmation #"
              aria-label="Confirmation number"
              defaultValue={currentFilters.confirmationNumber || ''}
            />
          </label>
        </div>
        <div className="account-actions">
          <button
            className="account-button"
            type="submit"
            disabled={isSearching}
          >
            {isSearching ? 'Searching' : 'Search'}
          </button>
          {hasFilters ? (
            <button
              className="account-text-button"
              type="button"
              disabled={isSearching}
              onClick={() => {
                setSearchParams(new URLSearchParams());
                formRef.current?.reset();
              }}
            >
              Clear
            </button>
          ) : null}
        </div>
      </fieldset>
    </form>
  );
}

function OrderItem({order}: {order: OrderItemFragment}) {
  const preview = order.lineItems.nodes[0];
  const fulfillmentStatus = flattenConnection(order.fulfillments)[0]?.status;
  const financialLabel = formatAccountStatus(order.financialStatus);
  const fulfillmentLabel = formatAccountStatus(
    fulfillmentStatus || order.fulfillmentStatus,
  );

  return (
    <article className="account-order-row">
      <div className="account-order-row-media">
        {preview?.image ? (
          <Image
            alt={preview.image.altText || preview.title}
            data={preview.image}
            loading="lazy"
            sizes="72px"
            width={72}
            height={72}
          />
        ) : (
          <div className="account-order-row-placeholder" aria-hidden="true" />
        )}
      </div>
      <div className="account-order-row-body">
        <div className="account-order-row-heading">
          <Link to={`/account/orders/${btoa(order.id)}`}>#{order.number}</Link>
          <Money data={order.totalPrice} />
        </div>
        <p className="account-order-row-meta">
          {formatAccountDate(order.processedAt)}
          {preview?.title ? ` · ${preview.title}` : ''}
        </p>
        <p className="account-order-row-status">
          {[financialLabel, fulfillmentLabel].filter(Boolean).join(' · ')}
        </p>
        <Link
          className="account-order-row-link"
          to={`/account/orders/${btoa(order.id)}`}
        >
          View order
        </Link>
      </div>
    </article>
  );
}
