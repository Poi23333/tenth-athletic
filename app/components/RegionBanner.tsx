import {Form, useLocation} from 'react-router';
import {useEffect, useLayoutEffect, useRef} from 'react';
import closeCircleFill from '~/assets/close_circle_fill.png';
import type {Region} from '~/data/regions';
import {formatGeoBannerMessage} from '~/data/regions';
import {useAside} from '~/components/Aside';

const REGION_BANNER_HEIGHT_VAR = '--region-banner-height';
const useIsomorphicLayoutEffect =
  typeof document !== 'undefined' ? useLayoutEffect : useEffect;

export function RegionBanner({
  currentRegion,
  suggestedRegion,
}: {
  currentRegion: Region;
  suggestedRegion: Region;
}) {
  const {openLocaleConfirm} = useAside();
  const location = useLocation();
  const returnTo = `${location.pathname}${location.search}`;
  const bannerRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const node = bannerRef.current;
    if (!node) return;

    const syncHeight = () => {
      document.documentElement.style.setProperty(
        REGION_BANNER_HEIGHT_VAR,
        `${node.getBoundingClientRect().height}px`,
      );
    };

    syncHeight();
    const observer =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(syncHeight)
        : null;
    observer?.observe(node);
    window.addEventListener('resize', syncHeight);

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', syncHeight);
      document.documentElement.style.removeProperty(REGION_BANNER_HEIGHT_VAR);
    };
  }, []);

  return (
    <div
      ref={bannerRef}
      className="region-banner"
      role="region"
      aria-label="Store location suggestion"
    >
      <p className="region-banner-message">
        {formatGeoBannerMessage(currentRegion, suggestedRegion)}
      </p>
      <div className="region-banner-actions">
        <button
          className="region-banner-shop"
          type="button"
          onClick={() => openLocaleConfirm(suggestedRegion.id)}
        >
          <span className="region-banner-globe" aria-hidden="true" />
          Shop {suggestedRegion.shortLabel} Store
        </button>
        <Form
          method="post"
          action="/locale"
          className="region-banner-dismiss-form"
        >
          <input type="hidden" name="intent" value="dismiss-banner" />
          <input type="hidden" name="returnTo" value={returnTo} />
          <button className="region-banner-continue" type="submit">
            Continue Shopping
            <span className="region-banner-continue-x" aria-hidden="true">
              ×
            </span>
          </button>
          <button
            className="region-banner-close"
            type="submit"
            aria-label="Dismiss location suggestion"
          >
            <img src={closeCircleFill} alt="" width={24} height={24} />
          </button>
        </Form>
      </div>
    </div>
  );
}
