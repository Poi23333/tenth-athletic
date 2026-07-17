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
  kind = 'hero',
}: {
  image: ProductImageData;
  kind?: 'hero' | 'lifestyle';
}) {
  return (
    <div className={`product-image product-image--${kind}`}>
      <Image
        alt={image.altText || 'Product Image'}
        data={image}
        key={image.id}
        sizes={
          kind === 'hero'
            ? '(min-width: 64em) 44rem, 92vw'
            : '(min-width: 64em) 90rem, 100vw'
        }
      />
    </div>
  );
}
