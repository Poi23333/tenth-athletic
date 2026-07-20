import {useState} from 'react';
import {ProductImage} from '~/components/ProductImage';

type ProductGalleryImage = {
  id?: string | null;
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
  __typename?: 'Image';
};

export function ProductHeroGallery({
  images,
  productTitle,
}: {
  images: ProductGalleryImage[];
  productTitle: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex]!;

  function showPreviousImage() {
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? images.length - 1 : currentIndex - 1,
    );
  }

  function showNextImage() {
    setActiveIndex((currentIndex) =>
      currentIndex === images.length - 1 ? 0 : currentIndex + 1,
    );
  }

  return (
    <div
      aria-label={`${productTitle} image gallery`}
      className="product-hero-gallery"
      role="group"
    >
      <button
        aria-label="Previous product image"
        className="product-hero-gallery-arrow product-hero-gallery-arrow--previous"
        onClick={showPreviousImage}
        type="button"
      >
        <img
          alt=""
          aria-hidden="true"
          src="/images/product-arrow-left.png"
        />
      </button>

      <div className="product-hero-media" aria-live="polite">
        <ProductImage image={activeImage} key={activeImage.id} kind="hero" />
        <span className="sr-only">
          Image {activeIndex + 1} of {images.length}
        </span>
      </div>

      <button
        aria-label="Next product image"
        className="product-hero-gallery-arrow product-hero-gallery-arrow--next"
        onClick={showNextImage}
        type="button"
      >
        <img
          alt=""
          aria-hidden="true"
          src="/images/product-arrow-right.png"
        />
      </button>
    </div>
  );
}
