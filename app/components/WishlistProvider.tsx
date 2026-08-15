import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

const STORAGE_KEY = 'tenth-athletic:wishlist';
const PRODUCT_GID_PATTERN = /^gid:\/\/shopify\/Product\/\d+$/;

type WishlistContextValue = {
  productIds: string[];
  isReady: boolean;
  isAuthenticated: boolean;
  error: string | null;
  isWishlisted: (productId: string) => boolean;
  isPending: (productId: string) => boolean;
  toggle: (productId: string) => Promise<void>;
};

type StorageMode = 'loading' | 'guest' | 'customer' | 'error';

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({children}: {children: ReactNode}) {
  const [productIds, setProductIds] = useState<string[]>([]);
  const [pendingIds, setPendingIds] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [storageMode, setStorageMode] = useState<StorageMode>('loading');
  const [error, setError] = useState<string | null>(null);
  const productIdsRef = useRef(productIds);
  const savingRef = useRef(false);
  const isAuthenticated = storageMode === 'customer';

  useEffect(() => {
    productIdsRef.current = productIds;
  }, [productIds]);

  useEffect(() => {
    let cancelled = false;
    const localIds = readLocalWishlist();
    setProductIds(localIds);

    void fetch('/api/wishlist', {headers: {Accept: 'application/json'}})
      .then(async (response) => {
        if (cancelled) return;
        if (response.status === 401) {
          setStorageMode('guest');
          setIsReady(true);
          return;
        }
        if (!response.ok) throw new Error(await getResponseError(response));

        const result = (await response.json()) as {productIds: string[]};
        const mergedIds = [...new Set([...result.productIds, ...localIds])];
        setStorageMode('customer');
        setProductIds(mergedIds);

        if (mergedIds.length !== result.productIds.length) {
          await saveRemoteWishlist(mergedIds);
        }
        window.localStorage.removeItem(STORAGE_KEY);
        setIsReady(true);
      })
      .catch((caughtError: unknown) => {
        if (cancelled) return;
        setError(getErrorMessage(caughtError));
        setStorageMode('error');
        setIsReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const toggle = useCallback(
    async (productId: string) => {
      if (!isReady || storageMode === 'error' || savingRef.current) return;

      const previousIds = productIdsRef.current;
      const nextIds = previousIds.includes(productId)
        ? previousIds.filter((id) => id !== productId)
        : [...previousIds, productId];
      setError(null);
      savingRef.current = true;
      setPendingIds((current) => [...current, productId]);
      setProductIds(nextIds);

      try {
        if (isAuthenticated) {
          await saveRemoteWishlist(nextIds);
        } else {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextIds));
        }
      } catch (caughtError) {
        setProductIds(previousIds);
        setError(getErrorMessage(caughtError));
        throw caughtError;
      } finally {
        savingRef.current = false;
        setPendingIds((current) => current.filter((id) => id !== productId));
      }
    },
    [isAuthenticated, isReady, storageMode],
  );

  const value = useMemo<WishlistContextValue>(
    () => ({
      productIds,
      isReady,
      isAuthenticated,
      error,
      isWishlisted: (productId) => productIds.includes(productId),
      isPending: () => pendingIds.length > 0,
      toggle,
    }),
    [error, isAuthenticated, isReady, pendingIds, productIds, toggle],
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
      {error ? (
        <div className="wishlist-notice" role="alert">
          {error}
        </div>
      ) : null}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const wishlist = useContext(WishlistContext);
  if (!wishlist) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return wishlist;
}

function readLocalWishlist() {
  try {
    const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(value)
      ? value.filter(
          (id): id is string =>
            typeof id === 'string' && PRODUCT_GID_PATTERN.test(id),
        )
      : [];
  } catch {
    return [];
  }
}

async function saveRemoteWishlist(productIds: string[]) {
  const response = await fetch('/api/wishlist', {
    method: 'PUT',
    headers: {'Content-Type': 'application/json', Accept: 'application/json'},
    body: JSON.stringify({productIds}),
  });
  if (!response.ok) throw new Error(await getResponseError(response));
}

async function getResponseError(response: Response) {
  const result = (await response.json().catch(() => null)) as {
    error?: string;
  } | null;
  return result?.error ?? `Wishlist request failed (${response.status})`;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Wishlist request failed';
}
