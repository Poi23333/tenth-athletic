import {Image} from '@shopify/hydrogen';

type ProductImageData = {
  id?: string | null;
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
  __typename?: 'Image';
};

export function ProductImage({
  image,
}: {
  image?: ProductImageData | null;
}) {
  if (!image) {
    return <div className="product-image" />;
  }
  return (
    <div className="product-image">
      <Image
        alt={image.altText || 'Product Image'}
        data={image}
        key={image.id}
        sizes="(min-width: 48em) 33vw, 100vw"
      />
    </div>
  );
}
