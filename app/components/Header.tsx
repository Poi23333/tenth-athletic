import {
  Await,
  NavLink,
  useLocation,
  useMatches,
  useRouteLoaderData,
} from 'react-router';
import {Suspense, useEffect, useLayoutEffect, useRef} from 'react';
import {type CartViewPayload, useAnalytics} from '@shopify/hydrogen';
import type {CartApiQueryFragment, HeaderQuery} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {formatRegionNavLabel, type Region} from '~/data/regions';
import {
  getGenderFromCollectionHandle,
  getGenderFromMenus,
  getGenderFromProductTags,
  type GenderMenuKey,
} from '~/lib/menu';
import type {RootLoader} from '~/root';
import brandLogo from '~/assets/logo.svg';
import {RiBookmarkFill, RiSearchLine} from '@remixicon/react';
import {useWishlist} from '~/components/WishlistProvider';

// useLayoutEffect warns during SSR; keep layout sync on the client only.
const useIsomorphicLayoutEffect =
  typeof document !== 'undefined' ? useLayoutEffect : useEffect;

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  currentRegion: Region;
}

type Viewport = 'desktop' | 'mobile';

export function Header({cart, header, isLoggedIn, currentRegion}: HeaderProps) {
  return (
    <header className="header">
      <div className="header-inner">
        <NavLink prefetch="intent" to="/" className="header-logo-link" end>
          <img
            src={brandLogo}
            alt={header.shop.name}
            className="header-logo"
            width={180}
            height={32}
          />
        </NavLink>
        <HeaderMenu
          cart={cart}
          isLoggedIn={isLoggedIn}
          viewport="desktop"
          currentRegion={currentRegion}
        />
        <HeaderCtas />
      </div>
    </header>
  );
}

export function HeaderMenu({
  cart,
  isLoggedIn,
  viewport,
  currentRegion,
}: {
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  viewport: Viewport;
  currentRegion: Region;
}) {
  const className = `header-menu-${viewport}`;
  const navRef = useRef<HTMLElement>(null);
  const {open, type, close} = useAside();
  const routeGender = useRouteGender();
  const manActive = type === 'man' || routeGender === 'man';
  const womanActive = type === 'woman' || routeGender === 'woman';
  const hasSharedHeaderDrawer =
    viewport === 'desktop' &&
    (type === 'shop' ||
      type === 'man' ||
      type === 'woman' ||
      type === 'field-index' ||
      type === 'locale');

  function toggleAside(nextType: 'locale' | 'man' | 'woman' | 'field-index') {
    if (type === nextType) {
      close();
      return;
    }

    open(nextType);
  }

  useIsomorphicLayoutEffect(() => {
    if (viewport !== 'desktop') return;

    const syncAsideWidth = () => {
      const nav = navRef.current;
      const firstItem = nav?.querySelector<HTMLElement>('.header-menu-item');
      if (!firstItem) return;

      // Keep product-side panels aligned with the header nav span.
      const navSpan = Math.round(
        window.innerWidth - firstItem.getBoundingClientRect().left,
      );
      const extra = Math.round(
        Number.parseFloat(
          getComputedStyle(document.documentElement).fontSize || '16',
        ) * 3,
      );
      document.documentElement.style.setProperty(
        '--aside-width',
        `${navSpan + extra}px`,
      );
    };

    syncAsideWidth();
    window.addEventListener('resize', syncAsideWidth);

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(syncAsideWidth)
        : null;
    if (navRef.current) resizeObserver?.observe(navRef.current);

    return () => {
      window.removeEventListener('resize', syncAsideWidth);
      resizeObserver?.disconnect();
    };
  }, [viewport]);

  return (
    <nav className={className} ref={navRef} role="navigation">
      {viewport === 'desktop' ? <SearchLink viewport="desktop" /> : null}
      <button
        className={`header-menu-item reset header-locale${
          type === 'locale' ? ' active' : ''
        }`}
        type="button"
        onClick={() => toggleAside('locale')}
      >
        {formatRegionNavLabel(currentRegion)}
      </button>
      <button
        className={`header-menu-item reset${manActive ? ' active' : ''}`}
        type="button"
        onClick={() => toggleAside('man')}
      >
        Man
      </button>
      <button
        className={`header-menu-item reset${womanActive ? ' active' : ''}`}
        type="button"
        onClick={() => toggleAside('woman')}
      >
        Woman
      </button>
      <AccountLink isLoggedIn={isLoggedIn} />
      <button
        className={`header-menu-item reset${
          type === 'field-index' ? ' active' : ''
        }`}
        type="button"
        onClick={() => toggleAside('field-index')}
      >
        Field Index
      </button>
      <WishlistLink />
      <BagToggle cart={cart} />
      {hasSharedHeaderDrawer ? (
        <button
          aria-label="Close drawer"
          className="header-drawer-close reset"
          onClick={close}
          type="button"
        >
          &times;
        </button>
      ) : null}
    </nav>
  );
}

function WishlistLink() {
  const {close} = useAside();
  const {productIds} = useWishlist();

  return (
    <NavLink
      aria-label={`Wishlist with ${productIds.length} items`}
      className={({isActive}) =>
        `header-menu-item header-wishlist${isActive ? ' active' : ''}`
      }
      onClick={close}
      prefetch="intent"
      to="/wishlist"
    >
      <RiBookmarkFill aria-hidden="true" />
      <span className="sr-only">Wishlist ({productIds.length})</span>
    </NavLink>
  );
}

function useRouteGender(): GenderMenuKey | null {
  const location = useLocation();
  const matches = useMatches();
  const rootData = useRouteLoaderData<RootLoader>('root');

  const collectionMatch = location.pathname.match(/^\/collections\/([^/?#]+)/i);
  if (collectionMatch) {
    const handle = decodeURIComponent(collectionMatch[1]);
    return (
      getGenderFromCollectionHandle(handle) ??
      getGenderFromMenus({
        handle,
        manMenu: rootData?.header?.manMenu,
        womanMenu: rootData?.header?.womanMenu,
        primaryDomainUrl: rootData?.header?.shop?.primaryDomain?.url ?? '',
        publicStoreDomain: rootData?.publicStoreDomain ?? '',
      })
    );
  }

  if (!location.pathname.startsWith('/products/')) return null;

  for (const match of [...matches].reverse()) {
    const data = match.data;
    if (!data || typeof data !== 'object' || !('product' in data)) continue;

    const product = (data as {product?: {tags?: string[] | null}}).product;
    if (!product) continue;

    return getGenderFromProductTags(product.tags);
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
      className={() => 'header-menu-item'}
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
      <SearchLink viewport="mobile" />
      <HeaderMenuMobileToggle />
    </nav>
  );
}

function SearchLink({viewport}: {viewport: Viewport}) {
  const {close} = useAside();

  return (
    <NavLink
      aria-label="Search"
      className={({isActive}) =>
        `header-menu-item header-search-link header-search-link--${viewport}${
          isActive ? ' active' : ''
        }`
      }
      onClick={close}
      prefetch="intent"
      to="/search"
    >
      <RiSearchLine aria-hidden="true" />
    </NavLink>
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
        {(resolvedCart) => (
          <BagBanner count={resolvedCart?.totalQuantity ?? 0} />
        )}
      </Await>
    </Suspense>
  );
}

function BagBanner({count}: {count: number}) {
  const {close, open, type} = useAside();
  const {publish, shop, cart: analyticsCart, prevCart} = useAnalytics();
  const hasItems = count > 0;

  return (
    <button
      type="button"
      className={`header-menu-item reset header-bag${
        hasItems ? ' has-items' : ''
      }${type === 'cart' ? ' active' : ''}`}
      onClick={() => {
        if (type === 'cart') {
          close();
          return;
        }

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
      <span>Bag({count})</span>
    </button>
  );
}
