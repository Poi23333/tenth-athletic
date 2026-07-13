import {Await, Form, NavLink} from 'react-router';
import {Suspense, useEffect, useRef} from 'react';
import type {
  CartApiQueryFragment,
  HeaderQuery,
} from 'storefrontapi.generated';
import {Aside, useAside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header, HeaderMenu} from '~/components/Header';
import {CartMain} from '~/components/CartMain';
import {CookieConsent} from '~/components/CookieConsent';
import {RegionBanner} from '~/components/RegionBanner';
import type {GeoBannerData} from '~/root';
import {
  formatConfirmBody,
  formatConfirmSwitchLabel,
  formatRegionListLabel,
  getRegionById,
  type Region,
} from '~/data/regions';

interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>;
  header: HeaderQuery;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  regions: readonly Region[];
  currentRegion: Region;
  geoBanner: GeoBannerData | null;
  children?: React.ReactNode;
}

export function PageLayout({
  cart,
  children = null,
  header,
  isLoggedIn,
  publicStoreDomain,
  regions,
  currentRegion,
  geoBanner,
}: PageLayoutProps) {
  return (
    <Aside.Provider>
      <CartAside cart={cart} />
      <ShopAside header={header} publicStoreDomain={publicStoreDomain} />
      <LocaleAside regions={regions} currentRegion={currentRegion} />
      <MobileMenuAside
        cart={cart}
        isLoggedIn={isLoggedIn}
        currentRegion={currentRegion}
      />
      {geoBanner?.show ? (
        <RegionBanner
          currentRegion={geoBanner.currentRegion}
          suggestedRegion={geoBanner.suggestedRegion}
        />
      ) : null}
      {header && (
        <Header
          header={header}
          cart={cart}
          isLoggedIn={isLoggedIn}
          currentRegion={currentRegion}
        />
      )}
      <main>{children}</main>
      <Footer />
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
  currentRegion,
}: {
  cart: PageLayoutProps['cart'];
  isLoggedIn: PageLayoutProps['isLoggedIn'];
  currentRegion: Region;
}) {
  return (
    <Aside type="mobile" heading="MENU">
      <HeaderMenu
        cart={cart}
        isLoggedIn={isLoggedIn}
        viewport="mobile"
        currentRegion={currentRegion}
      />
    </Aside>
  );
}

function ShopAside({
  header,
  publicStoreDomain,
}: {
  header: HeaderQuery;
  publicStoreDomain: string;
}) {
  const {close} = useAside();
  const menu = header.shopMenu;
  const primaryDomainUrl = header.shop.primaryDomain?.url;

  return (
    <Aside chrome="brand" type="shop" heading="Shop">
      <nav className="drawer-list" aria-label="Shop collections">
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
            Shopify menu handle shop-menu is not configured.
          </p>
        )}
      </nav>
    </Aside>
  );
}

function LocaleAside({
  regions,
  currentRegion,
}: {
  regions: readonly Region[];
  currentRegion: Region;
}) {
  const {
    close,
    type,
    localeConfirmRegionId,
    openLocaleConfirm,
    clearLocaleConfirm,
  } = useAside();
  const confirmRegion = localeConfirmRegionId
    ? getRegionById(localeConfirmRegionId)
    : null;

  useEffect(() => {
    if (type !== 'locale') {
      clearLocaleConfirm();
    }
  }, [type, clearLocaleConfirm]);

  // SPA redirect after /locale keeps Aside state; close when the market actually changes.
  const prevRegionIdRef = useRef(currentRegion.id);
  useEffect(() => {
    if (prevRegionIdRef.current === currentRegion.id) return;
    prevRegionIdRef.current = currentRegion.id;
    close();
  }, [currentRegion.id, close]);

  return (
    <Aside chrome="brand" type="locale" heading="Region and currency">
      {confirmRegion ? (
        <div className="locale-confirm">
          <h3 className="locale-confirm-title">Switch field location?</h3>
          <p className="locale-confirm-body">{formatConfirmBody(confirmRegion)}</p>
          <div className="locale-confirm-actions">
            <Form method="post" action="/locale" reloadDocument>
              <input type="hidden" name="intent" value="switch" />
              <input type="hidden" name="regionId" value={confirmRegion.id} />
              <button className="locale-confirm-switch" type="submit">
                {formatConfirmSwitchLabel(confirmRegion)}
              </button>
            </Form>
            <button
              className="locale-confirm-stay reset"
              type="button"
              onClick={clearLocaleConfirm}
            >
              Stay here
            </button>
          </div>
          <hr className="locale-confirm-rule" />
        </div>
      ) : (
        <nav className="drawer-list" aria-label="Region and currency">
          {regions.map((region) => (
            <button
              className="drawer-list-item"
              key={region.id}
              type="button"
              onClick={() => {
                if (region.id === currentRegion.id) {
                  close();
                  return;
                }
                openLocaleConfirm(region.id);
              }}
            >
              {formatRegionListLabel(region)}
            </button>
          ))}
        </nav>
      )}
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
