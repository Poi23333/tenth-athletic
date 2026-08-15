import {Link} from 'react-router';
import {RiPauseFill, RiPlayFill} from '@remixicon/react';
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
  const [isPaused, setIsPaused] = useState(false);
  const hasMultipleSlides = slides.length > 1;

  useEffect(() => {
    if (!hasMultipleSlides || isPaused) return;

    const timeout = window.setTimeout(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % slides.length);
      setCycle((currentCycle) => currentCycle + 1);
    }, AUTOPLAY_DURATION_MS);

    return () => window.clearTimeout(timeout);
  }, [activeIndex, cycle, hasMultipleSlides, isPaused, slides.length]);

  if (slides.length === 0) return null;

  const activeSlide = slides[activeIndex] ?? slides[0];
  const mobileImage = activeSlide.mobileImage ?? activeSlide.backgroundImage;

  const selectSlide = (index: number) => {
    if (index === activeIndex) return;
    setActiveIndex(index);
    setCycle((currentCycle) => currentCycle + 1);
  };

  const toggleAutoplay = () => {
    if (isPaused) {
      setCycle((currentCycle) => currentCycle + 1);
    }

    setIsPaused((currentValue) => !currentValue);
  };

  return (
    <section
      className={`home-banner${isPaused ? ' is-paused' : ''}`}
      aria-roledescription="carousel"
      aria-label="Featured collections"
      style={
        {
          '--home-banner-aspect-ratio': getAspectRatio(
            activeSlide.backgroundImage,
          ),
          '--home-banner-duration': `${AUTOPLAY_DURATION_MS}ms`,
          '--home-banner-mobile-aspect-ratio': getAspectRatio(mobileImage),
          '--home-banner-offset': `${activeIndex * -100}%`,
        } as CSSProperties
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
                  {...(index === 0 ? {fetchpriority: 'high'} : {})}
                  alt={slide.backgroundImage.altText}
                  className="home-banner-image"
                  decoding="async"
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
                  isInternalPath(slide.button.url) ? (
                    <Link className="home-banner-button" to={slide.button.url}>
                      {slide.button.label}
                    </Link>
                  ) : (
                    <a className="home-banner-button" href={slide.button.url}>
                      {slide.button.label}
                    </a>
                  )
                ) : null}
              </div>
            </article>
          );
        })}
      </div>

      {hasMultipleSlides ? (
        <>
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

          <button
            aria-label={isPaused ? '开始自动轮播' : '暂停自动轮播'}
            aria-pressed={isPaused}
            className="home-banner-autoplay"
            onClick={toggleAutoplay}
            type="button"
          >
            {isPaused ? (
              <RiPlayFill aria-hidden="true" />
            ) : (
              <RiPauseFill aria-hidden="true" />
            )}
          </button>
        </>
      ) : null}
    </section>
  );
}

function getAspectRatio(image: HomeBannerImage) {
  if (!image.width || !image.height) {
    throw new Error(
      `Banner image is missing intrinsic dimensions: ${image.url}`,
    );
  }

  return `${image.width} / ${image.height}`;
}

function isInternalPath(url: string) {
  return url.startsWith('/');
}
