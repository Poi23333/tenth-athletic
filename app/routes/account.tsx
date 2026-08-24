import {
  data as remixData,
  Form,
  NavLink,
  Outlet,
  useLoaderData,
} from 'react-router';
import type {Route} from './+types/account';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';

export function shouldRevalidate() {
  return true;
}

export async function loader({context}: Route.LoaderArgs) {
  const {customerAccount} = context;
  customerAccount.handleAuthStatus();

  const {data, errors} = await customerAccount.query(CUSTOMER_DETAILS_QUERY, {
    variables: {
      language: customerAccount.i18n.language,
    },
  });

  if (errors?.length || !data?.customer) {
    throw new Error('Customer not found');
  }

  return remixData(
    {customer: data.customer},
    {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    },
  );
}

export default function AccountLayout() {
  const {customer} = useLoaderData<typeof loader>();

  const heading = customer.firstName
    ? `Welcome, ${customer.firstName}`
    : 'Welcome to your account.';

  return (
    <div className="account-page">
      <div className="account-page-inner">
        <div className="account-page-header">
          <h1 className="account-page-title">{heading}</h1>
          <Logout />
        </div>
        <AccountMenu />
        <div className="account-page-body">
          <Outlet context={{customer}} />
        </div>
      </div>
    </div>
  );
}

function accountNavClass({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return [
    'account-nav-link',
    isActive ? 'is-active' : '',
    isPending ? 'is-pending' : '',
  ]
    .filter(Boolean)
    .join(' ');
}

function AccountMenu() {
  return (
    <nav className="account-nav" aria-label="Account">
      <NavLink className={accountNavClass} to="/account/orders">
        Orders
      </NavLink>
      <NavLink className={accountNavClass} to="/account/profile">
        Profile
      </NavLink>
      <NavLink className={accountNavClass} to="/account/addresses">
        Addresses
      </NavLink>
    </nav>
  );
}

function Logout() {
  return (
    <Form className="account-logout" method="POST" action="/account/logout">
      <button className="account-text-button" type="submit">
        Sign out
      </button>
    </Form>
  );
}
