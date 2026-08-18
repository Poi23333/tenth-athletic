import {Link} from 'react-router';
import {useEffect, useState} from 'react';
import type {Route} from './+types/wishlist';
import type {ProductItemFragment} from 'storefrontapi.generated';
import {usePageLoading} from '~/components/GlobalLoading';
import {ProductItem} from '~/components/ProductItem';
import {useWishlist} from '~/components/WishlistProvider';

export const meta: Route.MetaFunction = () => [
  {title: 'Wishlist | TENTH Athletic'},
];

export default function Wishlist() {
  const {
    error: wishlistError,
    isAuthenticated,
    isReady,
    productIds,
  } = useWishlist();
  const [products, setProducts] = useState<ProductItemFragment[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady || productIds.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    const abortController = new AbortController();
    setLoading(true);
    setLoadError(null);

    void fetch('/api/wishlist-products', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', Accept: 'application/json'},
      body: JSON.stringify({productIds}),
      signal: abortController.signal,
    })
      .then(async (response) => {
        if (!response.ok)
          throw new Error(`Unable to load wishlist (${response.status})`);
        const result = (await response.json()) as {
          products: ProductItemFragment[];
        };
        const productsById = new Map(
          result.products.map((product) => [product.id, product]),
        );
        setProducts(
          productIds.flatMap((productId) => {
            const product = productsById.get(productId);
            return product ? [product] : [];
          }),
        );
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError')
          return;
        setLoadError(
          error instanceof Error ? error.message : 'Unable to load wishlist',
        );
      })
      .finally(() => {
        if (!abortController.signal.aborted) setLoading(false);
      });

    return () => abortController.abort();
  }, [isReady, productIds]);

  usePageLoading(!isReady || loading);

  return (
    <div className="wishlist-page">
      <header className="wishlist-heading">
        <h1>Wishlist</h1>
        <div className="wishlist-intro">
          <p>
            {isAuthenticated
              ? 'Your saved selection is available whenever you sign in.'
              : 'Don’t lose your selection. Log in or create an account to save your favourite pieces.'}
          </p>
          {!isAuthenticated ? (
            <Link className="wishlist-account-link" to="/account/login">
              Log in or create an account
            </Link>
          ) : null}
        </div>
      </header>

      {wishlistError || loadError ? (
        <p className="wishlist-error" role="alert">
          {wishlistError ?? loadError}
        </p>
      ) : null}

      {!isReady || loading ? null : products.length > 0 ? (
        <div className="products-grid wishlist-grid">
          {products.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="wishlist-empty">
          <p>Your wishlist is empty.</p>
          <Link to="/collections/all">Add to wishlist</Link>
        </div>
      )}
    </div>
  );
}
