import {Suspense} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
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
  | {id: string; title: string; audience: ProductTypeAudience; url?: never}
  | {id: string; title: string; url: string; audience?: never};

const TENTH_NAV_ITEMS: TenthNavItem[] = [
  {id: 'man', title: 'Man', audience: 'man'},
  {id: 'woman', title: 'Woman', audience: 'woman'},
  {id: 'account', title: 'Account', url: '/account'},
];

export function Header({header, cart}: HeaderProps) {
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
        <HeaderMenu viewport="desktop" cart={cart} />
        <HeaderCtas />
      </div>
    </header>
  );
}

export function HeaderMenu({
  viewport,
  cart,
}: {
  viewport: Viewport;
  cart: Promise<CartApiQueryFragment | null>;
}) {
  const className = `header-menu-${viewport}`;
  const {close, open, openProductTypes, productTypeAudience, type} =
    useAside();

  return (
    <nav className={className} role="navigation">
      {TENTH_NAV_ITEMS.map((item) =>
        item.audience !== undefined ? (
          <button
            className={`header-menu-item reset${
              type === 'productTypes' && productTypeAudience === item.audience
                ? ' active'
                : ''
            }`}
            key={item.id}
            onClick={() => openProductTypes(item.audience)}
            type="button"
          >
            {item.title}
          </button>
        ) : (
          <NavLink
            className="header-menu-item"
            end
            key={item.id}
            onClick={close}
            prefetch="intent"
            to={item.url}
          >
            {item.title}
          </NavLink>
        ),
      )}
      <button
        className="header-menu-item reset"
        onClick={() => open('search')}
        type="button"
      >
        Search
      </button>
      <BagToggle cart={cart} />
    </nav>
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
    <Suspense fallback={<span className="header-menu-item">Bag</span>}>
      <Await resolve={cart}>
        <BagBanner />
      </Await>
    </Suspense>
  );
}

function BagBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  const {open} = useAside();
  const {publish, shop, cart: analyticsCart, prevCart} = useAnalytics();
  const count = cart?.totalQuantity ?? 0;

  return (
    <button
      type="button"
      className="header-menu-item reset header-bag"
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
      Bag{count > 0 ? `:${count}` : ''}
    </button>
  );
}
