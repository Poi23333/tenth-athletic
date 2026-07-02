import {Await, NavLink, useLocation} from 'react-router';
import {Suspense} from 'react';
import {type CartViewPayload, useAnalytics} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {type ProductTypeAudience, useAside} from '~/components/Aside';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

type TenthNavItem =
  {id: string; title: string; audience: ProductTypeAudience};

const TENTH_NAV_ITEMS: TenthNavItem[] = [
  {id: 'man', title: 'Man', audience: 'man'},
  {id: 'woman', title: 'Woman', audience: 'woman'},
];

export function Header({cart, header, isLoggedIn}: HeaderProps) {
  return (
    <header className="header">
      <div className="header-inner">
        <NavLink prefetch="intent" to="/" className="header-logo-link" end>
          <img
            src="/logo/brand-logo-header.png"
            alt={header.shop.name}
            className="header-logo"
            width={180}
            height={32}
          />
        </NavLink>
        <HeaderMenu cart={cart} isLoggedIn={isLoggedIn} viewport="desktop" />
        <HeaderCtas />
      </div>
    </header>
  );
}

export function HeaderMenu({
  cart,
  isLoggedIn,
  viewport,
}: {
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  viewport: Viewport;
}) {
  const className = `header-menu-${viewport}`;
  const {openProductTypes, productTypeAudience, type} = useAside();
  const location = useLocation();
  const activeAudience = getActiveAudience(location.pathname);

  return (
    <nav className={className} role="navigation">
      {TENTH_NAV_ITEMS.map((item) => (
        <button
          className={`header-menu-item reset${
            (type === 'productTypes' && productTypeAudience === item.audience) ||
            activeAudience === item.audience
              ? ' active'
              : ''
          }`}
          key={item.id}
          onClick={() => openProductTypes(item.audience)}
          type="button"
        >
          {item.title}
        </button>
      ))}
      <AccountLink isLoggedIn={isLoggedIn} />
      <BagToggle cart={cart} />
    </nav>
  );
}

function getActiveAudience(pathname: string): ProductTypeAudience | null {
  if (pathname.startsWith('/collections/man-')) {
    return 'man';
  }

  if (pathname.startsWith('/collections/woman-')) {
    return 'woman';
  }

  return null;
}

function AccountLink({isLoggedIn}: {isLoggedIn: Promise<boolean>}) {
  const {close} = useAside();

  return (
    <Suspense fallback={<AccountNavLink isLoggedIn={false} onClick={close} />}>
      <Await resolve={isLoggedIn}>
        {(resolvedIsLoggedIn) => (
          <AccountNavLink isLoggedIn={resolvedIsLoggedIn} onClick={close} />
        )}
      </Await>
    </Suspense>
  );
}

function AccountNavLink({
  isLoggedIn,
  onClick,
}: {
  isLoggedIn: boolean;
  onClick: () => void;
}) {
  return (
    <NavLink
      className="header-menu-item"
      end
      onClick={onClick}
      prefetch="intent"
      to={isLoggedIn ? '/account' : '/account/login'}
    >
      Account
    </NavLink>
  );
}

function HeaderCtas() {
  return (
    <nav className="header-ctas" role="navigation">
      <HeaderMenuMobileToggle />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="header-menu-mobile-toggle reset"
      onClick={() => open('mobile')}
      aria-label="Open menu"
    >
      <span className="header-menu-icon" aria-hidden="true">
        ☰
      </span>
    </button>
  );
}

function BagToggle({cart}: {cart: Promise<CartApiQueryFragment | null>}) {
  return (
    <Suspense fallback={<BagBanner count={0} />}>
      <Await resolve={cart}>
        {(resolvedCart) => <BagBanner count={resolvedCart?.totalQuantity ?? 0} />}
      </Await>
    </Suspense>
  );
}

function BagBanner({count}: {count: number}) {
  const {open} = useAside();
  const {publish, shop, cart: analyticsCart, prevCart} = useAnalytics();
  const hasItems = count > 0;

  return (
    <button
      type="button"
      className={`header-menu-item reset header-bag${hasItems ? ' has-items' : ''}`}
      onClick={() => {
        open('cart');
        publish('cart_viewed', {
          cart: analyticsCart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
    >
      <span className="header-bag-dot" aria-hidden="true" />
      <span>Bag</span>
      <span className="header-bag-count" aria-label={`${count} items in bag`}>
        ({count})
      </span>
    </button>
  );
}
