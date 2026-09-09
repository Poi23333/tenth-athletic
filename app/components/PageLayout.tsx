import {Await, Form, NavLink} from 'react-router';
import {Suspense, useEffect, useRef} from 'react';
import type {
  CartApiQueryFragment,
  HeaderQuery,
  MenuFragment,
} from 'storefrontapi.generated';
import {Aside, useAside} from '~/components/Aside';
import {Header, HeaderMenu} from '~/components/Header';
import {CartMain} from '~/components/CartMain';
import {CookieConsent} from '~/components/CookieConsent';
import {GlobalLoadingProvider} from '~/components/GlobalLoading';
import {WishlistProvider} from '~/components/WishlistProvider';
import type {GeoBannerData} from '~/root';
import {isPlaceholderMenuUrl, normalizeShopifyMenuUrl} from '~/lib/menu';
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
}: PageLayoutProps) {
  return (
    <WishlistProvider>
      <GlobalLoadingProvider>
        <Aside.Provider>
          <CartAside cart={cart} />
          <ShopAside header={header} publicStoreDomain={publicStoreDomain} />
          <GenderMenuAside
            type="man"
            heading="Man"
            menu={header.manMenu}
            primaryDomainUrl={header.shop.primaryDomain?.url ?? ''}
            publicStoreDomain={publicStoreDomain}
          />
          <GenderMenuAside
            type="woman"
            heading="Woman"
            menu={header.womanMenu}
            primaryDomainUrl={header.shop.primaryDomain?.url ?? ''}
            publicStoreDomain={publicStoreDomain}
          />
          <FieldIndexAside />
          <LocaleAside regions={regions} currentRegion={currentRegion} />
          <MobileMenuAside cart={cart} isLoggedIn={isLoggedIn} />
          {header && (
            <Header header={header} cart={cart} isLoggedIn={isLoggedIn} />
          )}
          <main>{children}</main>
          <CookieConsent />
        </Aside.Provider>
      </GlobalLoadingProvider>
    </WishlistProvider>
  );
}

function CartAside({cart}: {cart: PageLayoutProps['cart']}) {
  return (
    <Aside chrome="brand" type="cart" heading="Bag">
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

function GenderMenuAside({
  type,
  heading,
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  type: 'man' | 'woman';
  heading: string;
  menu?: MenuFragment | null;
  primaryDomainUrl: string;
  publicStoreDomain: string;
}) {
  const {close} = useAside();

  return (
    <Aside chrome="brand" type={type} heading={heading}>
      <nav className="drawer-menu" aria-label={`${heading} collections`}>
        <div className="drawer-menu-group">
          <div className="drawer-list">
            <NavLink
              className="drawer-list-item drawer-menu-shop-all"
              onClick={close}
              prefetch="intent"
              to="/coming-soon"
            >
              Shop All
            </NavLink>
          </div>
        </div>
        {menu?.items?.length ? (
          menu.items.map((category) => (
            <div className="drawer-menu-group" key={category.id}>
              <p className="drawer-menu-heading">{category.title}</p>
              {category.items?.length ? (
                <div className="drawer-list">
                  {category.items.map((item) => {
                    return (
                      <NavLink
                        className="drawer-list-item"
                        key={item.id}
                        onClick={close}
                        to="/coming-soon"
                      >
                        {item.title}
                      </NavLink>
                    );
                  })}
                </div>
              ) : null}
            </div>
          ))
        ) : (
          <p className="drawer-list-empty">
            Shopify menu handle {type}-menu is not configured.
          </p>
        )}
      </nav>
    </Aside>
  );
}

const FIELD_INDEX_SECTIONS = [
  {
    heading: 'About',
    items: ['About Tenth', 'Practice', 'People'],
  },
  {
    heading: 'Systems',
    items: ['Product System', 'Construction', 'Materials', 'Condition Index'],
  },
  {
    heading: 'Tenth Lab',
    items: [
      'Product Development',
      'Objects',
      'Spatial Systems',
      'Collaborations',
    ],
  },
] as const;

function FieldIndexAside() {
  const {close} = useAside();
  return (
    <Aside chrome="brand" type="field-index" heading="Field Index">
      <nav className="drawer-menu" aria-label="Field Index">
        {FIELD_INDEX_SECTIONS.map((section) => (
          <div className="drawer-menu-group" key={section.heading}>
            <p className="drawer-menu-heading">{section.heading}</p>
            <div className="drawer-list">
              {section.items.map((item) => (
                <NavLink
                  className="drawer-list-item"
                  key={item}
                  to="/coming-soon"
                  onClick={close}
                >
                  {item}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
        <div className="drawer-menu-group">
          <p className="drawer-menu-heading">Field Circuit</p>
          <div className="drawer-list">
            <NavLink
              className="drawer-list-item"
              to="/race"
              prefetch="intent"
              onClick={close}
            >
              London 2026
            </NavLink>
          </div>
        </div>
      </nav>
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
          <p className="locale-confirm-body">
            {formatConfirmBody(confirmRegion)}
          </p>
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
