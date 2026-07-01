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
  const displayHeading = productTypeAudience === 'man' ? 'Man' : 'Woman';
  const menu =
    productTypeAudience === 'man' ? header.manMenu : header.womanMenu;
  const primaryDomainUrl = header.shop.primaryDomain?.url;
  const collectionUrl =
    productTypeAudience === 'man'
      ? '/collections/man-new-arrivals'
      : '/collections/woman-new-arrivals';
  const contextText =
    productTypeAudience === 'man'
      ? "Performance engineering for disciplined output. Our 'Man' collection pairs measured compression, breathable structure, and stripped-back silhouettes for non-conforming athletic work."
      : "Performance engineering for the elite athletic form. Our 'Woman' collection integrates bio-mechanical support with avant-garde structural silhouettes. Non-conforming excellence as standard.";

  return (
    <Aside type="productTypes" heading={heading}>
      <div className="product-type-drawer">
        <div className="product-type-drawer-scroll">
          <nav className="product-type-menu" aria-label={`${displayHeading} collections`}>
            {menu ? (
              menu.items.map((item) => {
                const meta = getProductTypeMenuMeta(item.title);
                const itemContent = (
                  <>
                    <span className="product-type-menu-label">
                      {item.title}
                    </span>
                    {meta ? (
                      <span className="product-type-menu-meta">{meta}</span>
                    ) : null}
                  </>
                );

                if (!item.url || !primaryDomainUrl) {
                  return (
                    <span
                      className={`product-type-menu-item${meta === 'NEW' ? ' is-featured' : ''}`}
                      key={item.id}
                    >
                      {itemContent}
                    </span>
                  );
                }

                const url = normalizeShopifyMenuUrl({
                  primaryDomainUrl,
                  publicStoreDomain,
                  url: item.url,
                });
                const isExternal = !url.startsWith('/');
                const className = `product-type-menu-item${meta === 'NEW' ? ' is-featured' : ''}`;

                return isExternal ? (
                  <a
                    className={className}
                    href={url}
                    key={item.id}
                    onClick={close}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {itemContent}
                  </a>
                ) : (
                  <NavLink
                    className={className}
                    key={item.id}
                    onClick={close}
                    prefetch="intent"
                    to={url}
                  >
                    {itemContent}
                  </NavLink>
                );
              })
            ) : (
              <p className="product-type-menu-empty">
                Shopify menu handle {productTypeAudience}-menu is not configured.
              </p>
            )}
          </nav>

          <section className="product-type-context" aria-label="Laboratory context">
            <div className="product-type-context-heading">
              <span>Laboratory Context</span>
              <span className="product-type-context-pulse" aria-hidden="true" />
            </div>
            <p>{contextText}</p>
          </section>
        </div>

        <div className="product-type-drawer-action">
          <NavLink
            className="product-type-menu-cta"
            onClick={close}
            prefetch="intent"
            to={collectionUrl}
          >
            View All {displayHeading} Collection
          </NavLink>
        </div>
      </div>
    </Aside>
  );
}

function getProductTypeMenuMeta(title: string) {
  const normalizedTitle = title.toLowerCase();

  if (normalizedTitle.includes('new')) return 'NEW';
  if (normalizedTitle.includes('special')) return 'LIMITED';
  if (normalizedTitle.includes('tops')) return '014 ITEMS';
  if (normalizedTitle.includes('accessories')) return '032 ITEMS';

  return null;
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
