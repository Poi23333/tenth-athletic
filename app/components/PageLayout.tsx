import {Await, Link, NavLink} from 'react-router';
import {Suspense, useId} from 'react';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
import {Aside, useAside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header, HeaderMenu} from '~/components/Header';
import {CartMain} from '~/components/CartMain';
import {
  SEARCH_ENDPOINT,
  SearchFormPredictive,
} from '~/components/SearchFormPredictive';
import {SearchResultsPredictive} from '~/components/SearchResultsPredictive';
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
      <SearchAside />
      <ProductTypesAside
        header={header}
        publicStoreDomain={publicStoreDomain}
      />
      <MobileMenuAside cart={cart} />
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
    </Aside.Provider>
  );
}

function CartAside({cart}: {cart: PageLayoutProps['cart']}) {
  return (
    <Aside type="cart" heading="CART">
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

function SearchAside() {
  const queriesDatalistId = useId();
  return (
    <Aside type="search" heading="SEARCH">
      <div className="predictive-search">
        <br />
        <SearchFormPredictive>
          {({fetchResults, goToSearch, inputRef}) => (
            <>
              <input
                name="q"
                onChange={fetchResults}
                onFocus={fetchResults}
                placeholder="Search"
                ref={inputRef}
                type="search"
                list={queriesDatalistId}
              />
              &nbsp;
              <button onClick={goToSearch}>Search</button>
            </>
          )}
        </SearchFormPredictive>

        <SearchResultsPredictive>
          {({items, total, term, state, closeSearch}) => {
            const {articles, collections, pages, products, queries} = items;

            if (state === 'loading' && term.current) {
              return <div>Loading...</div>;
            }

            if (!total) {
              return <SearchResultsPredictive.Empty term={term} />;
            }

            return (
              <>
                <SearchResultsPredictive.Queries
                  queries={queries}
                  queriesDatalistId={queriesDatalistId}
                />
                <SearchResultsPredictive.Products
                  products={products}
                  closeSearch={closeSearch}
                  term={term}
                />
                <SearchResultsPredictive.Collections
                  collections={collections}
                  closeSearch={closeSearch}
                  term={term}
                />
                <SearchResultsPredictive.Pages
                  pages={pages}
                  closeSearch={closeSearch}
                  term={term}
                />
                <SearchResultsPredictive.Articles
                  articles={articles}
                  closeSearch={closeSearch}
                  term={term}
                />
                {term.current && total ? (
                  <Link
                    onClick={closeSearch}
                    to={`${SEARCH_ENDPOINT}?q=${term.current}`}
                  >
                    <p>
                      View all results for <q>{term.current}</q>
                      &nbsp; →
                    </p>
                  </Link>
                ) : null}
              </>
            );
          }}
        </SearchResultsPredictive>
      </div>
    </Aside>
  );
}

function MobileMenuAside({cart}: {cart: PageLayoutProps['cart']}) {
  return (
    <Aside type="mobile" heading="MENU">
      <HeaderMenu viewport="mobile" cart={cart} />
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
  const heading = productTypeAudience === 'man' ? 'MAN' : 'WOMAN';
  const menu =
    productTypeAudience === 'man' ? header.manMenu : header.womanMenu;
  const primaryDomainUrl = header.shop.primaryDomain?.url;

  return (
    <Aside type="productTypes" heading={heading}>
      <div className="product-type-menu">
        {menu ? (
          menu.items.map((item) => {
            if (!item.url || !primaryDomainUrl) {
              return (
                <span className="product-type-menu-item" key={item.id}>
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
                className="product-type-menu-item"
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
                className="product-type-menu-item"
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
          <p className="product-type-menu-empty">
            Shopify menu handle {productTypeAudience}-menu is not configured.
          </p>
        )}
      </div>
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
