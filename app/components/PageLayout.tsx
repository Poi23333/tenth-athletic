import {Await, NavLink} from 'react-router';
import {Suspense} from 'react';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
import {Aside, useAside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header, HeaderMenu} from '~/components/Header';
import {CartMain} from '~/components/CartMain';
import {CookieConsent} from '~/components/CookieConsent';

interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>;
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  children?: React.ReactNode;
}

export function PageLayout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
  publicStoreDomain,
}: PageLayoutProps) {
  return (
    <Aside.Provider>
      <CartAside cart={cart} />
      <ProductTypesAside
        header={header}
        publicStoreDomain={publicStoreDomain}
      />
      <LocaleAside />
      <MobileMenuAside cart={cart} isLoggedIn={isLoggedIn} />
      {header && (
        <Header
          header={header}
          cart={cart}
          isLoggedIn={isLoggedIn}
          publicStoreDomain={publicStoreDomain}
        />
      )}
      <main>{children}</main>
      <Footer
        footer={footer}
        header={header}
        publicStoreDomain={publicStoreDomain}
      />
      <CookieConsent />
    </Aside.Provider>
  );
}

function CartAside({cart}: {cart: PageLayoutProps['cart']}) {
  return (
    <Aside type="cart" heading={<CartAsideHeading cart={cart} />}>
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return <CartMain cart={cart} layout="aside" />;
          }}
        </Await>
      </Suspense>
    </Aside>
  );
}

function CartAsideHeading({cart}: {cart: PageLayoutProps['cart']}) {
  return (
    <Suspense fallback="Your Bag">
      <Await resolve={cart}>
        {(resolvedCart) => {
          const count = resolvedCart?.totalQuantity ?? 0;
          return `Your Bag (${count})`;
        }}
      </Await>
    </Suspense>
  );
}

function MobileMenuAside({
  cart,
  isLoggedIn,
}: {
  cart: PageLayoutProps['cart'];
  isLoggedIn: PageLayoutProps['isLoggedIn'];
}) {
  return (
    <Aside type="mobile" heading="MENU">
      <HeaderMenu cart={cart} isLoggedIn={isLoggedIn} viewport="mobile" />
    </Aside>
  );
}

function ProductTypesAside({
  header,
  publicStoreDomain,
}: {
  header: HeaderQuery;
  publicStoreDomain: string;
}) {
  const {close, productTypeAudience} = useAside();
  const displayHeading = productTypeAudience === 'man' ? 'Man' : 'Woman';
  const menu =
    productTypeAudience === 'man' ? header.manMenu : header.womanMenu;
  const primaryDomainUrl = header.shop.primaryDomain?.url;

  return (
    <Aside chrome="brand" type="productTypes" heading={displayHeading}>
      <nav
        className="drawer-list"
        aria-label={`${displayHeading} collections`}
      >
        {menu ? (
          menu.items.map((item) => {
            if (!item.url || !primaryDomainUrl) {
              return (
                <span className="drawer-list-item" key={item.id}>
                  {item.title}
                </span>
              );
            }

            const url = normalizeShopifyMenuUrl({
              primaryDomainUrl,
              publicStoreDomain,
              url: item.url,
            });
            const isExternal = !url.startsWith('/');

            return isExternal ? (
              <a
                className="drawer-list-item"
                href={url}
                key={item.id}
                onClick={close}
                rel="noopener noreferrer"
                target="_blank"
              >
                {item.title}
              </a>
            ) : (
              <NavLink
                className="drawer-list-item"
                key={item.id}
                onClick={close}
                prefetch="intent"
                to={url}
              >
                {item.title}
              </NavLink>
            );
          })
        ) : (
          <p className="drawer-list-empty">
            Shopify menu handle {productTypeAudience}-menu is not configured.
          </p>
        )}
      </nav>
    </Aside>
  );
}

const LOCALE_OPTIONS = [
  {id: 'gb', label: 'United Kingdom [ GBP £ ]'},
  {id: 'eu', label: 'Europe [ EUR € ]'},
  {id: 'us', label: 'United States [ USD $ ]'},
  {id: 'hk', label: 'Hong Kong SAR [ HKD $ ]'},
  {id: 'sg', label: 'Singapore [ SGD $ ]'},
  {id: 'jp', label: 'Japan [ JPY ¥ ]'},
  {id: 'kr', label: 'South Korea [ KRW ₩ ]'},
  {id: 'au', label: 'Australia [ AUD $ ]'},
  {id: 'ca', label: 'Canada [ CAD $ ]'},
  {id: 'tw', label: 'Taiwan Region [ TWD $ ]'},
  {id: 'row', label: 'Rest of the World [ GBP £ ]'},
] as const;

function LocaleAside() {
  const {close} = useAside();

  return (
    <Aside chrome="brand" type="locale" heading="Region and currency">
      <nav className="drawer-list" aria-label="Region and currency">
        {LOCALE_OPTIONS.map((option) => (
          <button
            className="drawer-list-item"
            key={option.id}
            type="button"
            onClick={close}
          >
            {option.label}
          </button>
        ))}
      </nav>
    </Aside>
  );
}

function normalizeShopifyMenuUrl({
  primaryDomainUrl,
  publicStoreDomain,
  url,
}: {
  primaryDomainUrl: string;
  publicStoreDomain: string;
  url: string;
}) {
  const isStorefrontUrl =
    url.includes('myshopify.com') ||
    url.includes(publicStoreDomain) ||
    url.includes(primaryDomainUrl);

  if (!isStorefrontUrl) return url;

  const parsedUrl = new URL(url);
  return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
}
