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
  if (images.length !== 6) {
    throw new Error(
      `Product hero gallery requires exactly six images; received ${images.length}.`,
    );
  }

  return (
    <div
      aria-label={`${productTitle} image gallery`}
      className="product-hero-gallery"
      role="list"
    >
      {images.map((image, index) => {
        const group = index < 3 ? 'product' : 'model';
        const groupIndex = (index % 3) + 1;

        return (
          <div
            aria-label={`${group === 'product' ? 'Product' : 'Model'} image ${groupIndex} of 3`}
            className={`product-hero-media product-hero-media--${group}`}
            key={image.id ?? image.url}
            role="listitem"
          >
            <ProductImage image={image} kind="hero" />
          </div>
        );
      })}
    </div>
  );
}
