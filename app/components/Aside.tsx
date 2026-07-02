import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

export type ProductTypeAudience = 'man' | 'woman';
type AsideType = 'cart' | 'mobile' | 'productTypes' | 'closed';
type AsideContextValue = {
  type: AsideType;
  productTypeAudience: ProductTypeAudience;
  open: (mode: AsideType) => void;
  openProductTypes: (audience: ProductTypeAudience) => void;
  close: () => void;
};

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
  heading,
  type,
}: {
  children?: React.ReactNode;
  type: AsideType;
  heading: React.ReactNode;
}) {
  const {type: activeType, close} = useAside();
  const expanded = type === activeType;

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
      <aside>
        <header>
          <h3>{heading}</h3>
          <button className="close reset" onClick={close} aria-label="Close">
            &times;
          </button>
        </header>
        <main>{children}</main>
      </aside>
    </div>
  );
}

const AsideContext = createContext<AsideContextValue | null>(null);

Aside.Provider = function AsideProvider({children}: {children: ReactNode}) {
  const [type, setType] = useState<AsideType>('closed');
  const [productTypeAudience, setProductTypeAudience] =
    useState<ProductTypeAudience>('man');

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
        productTypeAudience,
        open: setType,
        openProductTypes: (audience) => {
          setProductTypeAudience(audience);
          setType('productTypes');
        },
        close: () => setType('closed'),
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
