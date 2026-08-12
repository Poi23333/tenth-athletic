import {useEffect, useState, type CSSProperties} from 'react';

const AUTOPLAY_DURATION_MS = 6000;

export type HomeBannerSlide = {
  id: string;
  backgroundImage: HomeBannerImage;
  mobileImage: HomeBannerImage | null;
  logo:
    | {kind: 'file'; url: string; alt: string}
    | {kind: 'text'; value: string}
    | null;
  slogan: string | null;
  button: {label: string; url: string} | null;
};

export type HomeBannerImage = {
  altText: string;
  height: number | null;
  url: string;
  width: number | null;
};

export function HomeBanner({slides}: {slides: HomeBannerSlide[]}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [cycle, setCycle] = useState(0);
  const hasMultipleSlides = slides.length > 1;

  useEffect(() => {
    if (!hasMultipleSlides) return;

    const timeout = window.setTimeout(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % slides.length);
      setCycle((currentCycle) => currentCycle + 1);
    }, AUTOPLAY_DURATION_MS);

    return () => window.clearTimeout(timeout);
  }, [activeIndex, cycle, hasMultipleSlides, slides.length]);

  if (slides.length === 0) return null;

  const selectSlide = (index: number) => {
    if (index === activeIndex) return;
    setActiveIndex(index);
    setCycle((currentCycle) => currentCycle + 1);
  };

  return (
    <section
      className="home-banner"
      aria-roledescription="carousel"
      aria-label="Featured collections"
      style={
        {'--home-banner-duration': `${AUTOPLAY_DURATION_MS}ms`} as CSSProperties
      }
    >
      <div className="home-banner-slides" aria-live="off">
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;

          return (
            <article
              className={`home-banner-slide${isActive ? ' is-active' : ''}`}
              aria-hidden={!isActive}
              key={slide.id}
            >
              <picture className="home-banner-picture">
                {slide.mobileImage ? (
                  <source
                    media="(max-width: 47.99em)"
                    srcSet={slide.mobileImage.url}
                  />
                ) : null}
                <img
                  alt={slide.backgroundImage.altText}
                  className="home-banner-image"
                  decoding="async"
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                  height={slide.backgroundImage.height ?? undefined}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  src={slide.backgroundImage.url}
                  width={slide.backgroundImage.width ?? undefined}
                />
              </picture>

              <div className="home-banner-content">
                {slide.logo?.kind === 'file' ? (
                  <img
                    alt={slide.logo.alt}
                    className="home-banner-logo-image"
                    decoding="async"
                    src={slide.logo.url}
                  />
                ) : null}
                {slide.logo?.kind === 'text' ? (
                  <p className="home-banner-logo-text">{slide.logo.value}</p>
                ) : null}
                {slide.slogan ? (
                  <p className="home-banner-slogan">{slide.slogan}</p>
                ) : null}
                {slide.button ? (
                  <a className="home-banner-button" href={slide.button.url}>
                    {slide.button.label}
                  </a>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>

      {hasMultipleSlides ? (
        <div className="home-banner-pagination" aria-label="Select banner">
          {slides.map((slide, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                aria-label={`Show banner ${index + 1}`}
                aria-current={isActive ? 'true' : undefined}
                className={`home-banner-pagination-item${
                  isActive ? ' is-active' : ''
                }`}
                key={slide.id}
                onClick={() => selectSlide(index)}
                type="button"
              >
                <span
                  className="home-banner-pagination-progress"
                  key={isActive ? `${slide.id}-${cycle}` : slide.id}
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
