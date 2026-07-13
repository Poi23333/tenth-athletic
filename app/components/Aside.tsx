import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import type {RegionId} from '~/data/regions';

type AsideType = 'cart' | 'mobile' | 'shop' | 'locale' | 'closed';
type AsideChrome = 'default' | 'brand';
type AsideContextValue = {
  type: AsideType;
  localeConfirmRegionId: RegionId | null;
  open: (mode: AsideType) => void;
  openLocaleConfirm: (regionId: RegionId) => void;
  clearLocaleConfirm: () => void;
  close: () => void;
};

function isBrandAside(type: AsideType) {
  return type === 'shop' || type === 'locale';
}

/**
 * A side bar component with Overlay
 * @example
 * ```jsx
 * <Aside type="cart" heading="Your Bag">
 *  ...
 * </Aside>
 * ```
 */
export function Aside({
  children,
  chrome = 'default',
  heading,
  type,
}: {
  children?: React.ReactNode;
  chrome?: AsideChrome;
  type: AsideType;
  heading: React.ReactNode;
}) {
  const {type: activeType, close} = useAside();
  const expanded = type === activeType;
  const isBrand = chrome === 'brand';

  useEffect(() => {
    const abortController = new AbortController();

    if (expanded) {
      document.addEventListener(
        'keydown',
        function handler(event: KeyboardEvent) {
          if (event.key === 'Escape') {
            close();
          }
        },
        {signal: abortController.signal},
      );
    }
    return () => abortController.abort();
  }, [close, expanded]);

  return (
    <div
      aria-modal
      className={`overlay overlay-${type} ${expanded ? 'expanded' : ''}`}
      data-aside-type={type}
      role="dialog"
    >
      <button className="close-outside" onClick={close} />
      <aside
        className={isBrand ? 'aside-brand' : undefined}
        aria-label={typeof heading === 'string' ? heading : undefined}
      >
        {isBrand ? (
          <>
            <h2 className="sr-only">{heading}</h2>
            <main className="aside-brand-main">{children}</main>
          </>
        ) : (
          <>
            <header>
              <h3>{heading}</h3>
              <button className="close reset" onClick={close} aria-label="Close">
                &times;
              </button>
            </header>
            <main>{children}</main>
          </>
        )}
      </aside>
    </div>
  );
}

const AsideContext = createContext<AsideContextValue | null>(null);

Aside.Provider = function AsideProvider({children}: {children: ReactNode}) {
  const [type, setType] = useState<AsideType>('closed');
  const [localeConfirmRegionId, setLocaleConfirmRegionId] =
    useState<RegionId | null>(null);

  const close = useCallback(() => {
    setType('closed');
    setLocaleConfirmRegionId(null);
  }, []);

  const open = useCallback((mode: AsideType) => {
    setLocaleConfirmRegionId(null);
    setType(mode);
  }, []);

  const openLocaleConfirm = useCallback((regionId: RegionId) => {
    setLocaleConfirmRegionId(regionId);
    setType('locale');
  }, []);

  const clearLocaleConfirm = useCallback(() => {
    setLocaleConfirmRegionId(null);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('brand-drawer-open', isBrandAside(type));
    return () => {
      document.body.classList.remove('brand-drawer-open');
    };
  }, [type]);

  useEffect(() => {
    if (type === 'closed') return;

    const scrollY = window.scrollY;
    const {style: bodyStyle} = document.body;
    const {style: htmlStyle} = document.documentElement;
    const originalBodyStyles = {
      overflow: bodyStyle.overflow,
      position: bodyStyle.position,
      top: bodyStyle.top,
      width: bodyStyle.width,
    };
    const originalHtmlOverflow = htmlStyle.overflow;

    htmlStyle.overflow = 'hidden';
    bodyStyle.overflow = 'hidden';
    bodyStyle.position = 'fixed';
    bodyStyle.top = `-${scrollY}px`;
    bodyStyle.width = '100%';

    return () => {
      htmlStyle.overflow = originalHtmlOverflow;
      bodyStyle.overflow = originalBodyStyles.overflow;
      bodyStyle.position = originalBodyStyles.position;
      bodyStyle.top = originalBodyStyles.top;
      bodyStyle.width = originalBodyStyles.width;
      window.scrollTo(0, scrollY);
    };
  }, [type]);

  return (
    <AsideContext.Provider
      value={{
        type,
        localeConfirmRegionId,
        open,
        openLocaleConfirm,
        clearLocaleConfirm,
        close,
      }}
    >
      {children}
    </AsideContext.Provider>
  );
};

export function useAside() {
  const aside = useContext(AsideContext);
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return aside;
}
