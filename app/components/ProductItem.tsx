import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';

export function ProductItem({
  product,
  loading,
}: {
  product: CollectionItemFragment | ProductItemFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  const {title, color} = getProductDisplayParts(product.title);

  return (
    <Link
      className="product-item"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      {image && (
        <div className="product-item-media">
          <Image
            alt={image.altText || product.title}
            data={image}
            loading={loading}
            sizes="(min-width: 48em) 25vw, 50vw"
          />
        </div>
      )}
      <h4>{title}</h4>
      {color ? <p className="product-item-color">{color}</p> : null}
      <div className="product-item-price">
        <Money data={product.priceRange.minVariantPrice} />
      </div>
    </Link>
  );
}

const COLOR_NAMES = [
  'black',
  'white',
  'grey',
  'gray',
  'navy',
  'blue',
  'green',
  'red',
  'brown',
  'cream',
  'beige',
  'sand',
  'stone',
  'olive',
  'khaki',
  'charcoal',
];

function getProductDisplayParts(title: string) {
  const separated = title.match(/^(.*)\s[-–—]\s([^–—-]+)$/);
  if (separated && isColorName(separated[2])) {
    return {title: separated[1], color: separated[2]};
  }

  const words = title.trim().split(/\s+/);
  const lastWord = words[words.length - 1]?.toLowerCase();
  if (lastWord && isColorName(lastWord) && words.length > 1) {
    return {
      title: words.slice(0, -1).join(' '),
      color: words[words.length - 1],
    };
  }

  return {title, color: ''};
}

function isColorName(value: string) {
  return COLOR_NAMES.includes(value.trim().toLowerCase());
}
