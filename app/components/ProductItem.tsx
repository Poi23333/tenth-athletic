import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';
import {WishlistButton} from '~/components/WishlistButton';

type ProductCardFragment = CollectionItemFragment | ProductItemFragment;
type ProductCardSizeOption = {
  name: string;
  available: boolean;
};

export function ProductItem({
  product,
  loading,
}: {
  product: ProductCardFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  const fullImageReference = product.fullImage?.reference;
  const hoverImage =
    fullImageReference?.__typename === 'MediaImage'
      ? fullImageReference.image
      : null;
  const hasHoverImage = Boolean(hoverImage);
  const sizeOptions = getSizeOptions(product);
  const hasSizeOptions = sizeOptions.length > 0;
  const {title, color} = getProductDisplayParts(product.title);

  return (
    <article
      className={`product-item${hasSizeOptions ? ' product-item--has-sizes' : ''}`}
      key={product.id}
    >
      <Link className="product-item-link" prefetch="intent" to={variantUrl}>
        {image && (
          <div
            className={`product-item-media${hasHoverImage ? ' product-item-media--swap' : ''}`}
          >
            <Image
              alt={image.altText || product.title}
              className="product-item-image product-item-image--primary"
              data={image}
              loading={loading}
              sizes="(min-width: 48em) 25vw, 50vw"
            />
            {hoverImage ? (
              <Image
                alt={hoverImage.altText || product.title}
                className="product-item-image product-item-image--secondary"
                data={hoverImage}
                loading="lazy"
                sizes="(min-width: 48em) 25vw, 50vw"
              />
            ) : null}
          </div>
        )}
        <div className="product-item-copy product-item-copy--default">
          <h4>{title}</h4>
          {color ? <p className="product-item-color">{color}</p> : null}
        </div>
        {hasSizeOptions ? (
          <div
            className="product-item-copy product-item-copy--sizes"
            aria-hidden="true"
          >
            <p className="product-item-sizes">
              {sizeOptions.map((size) => (
                <span
                  className={`product-item-size${
                    size.available ? '' : ' product-item-size--unavailable'
                  }`}
                  key={size.name}
                >
                  {size.name}
                </span>
              ))}
            </p>
          </div>
        ) : null}
        <div className="product-item-price">
          <Money data={product.priceRange.minVariantPrice} />
        </div>
      </Link>
      <WishlistButton
        className="product-item-wishlist"
        productId={product.id}
      />
    </article>
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

function getSizeOptions(product: ProductCardFragment) {
  const sizeOption = product.options.find(
    (option: ProductCardFragment['options'][number]) =>
      option.name.trim().toLowerCase() === 'size',
  );

  if (!sizeOption) {
    return [];
  }

  const availabilityBySize = new Map<string, boolean>();

  for (const variant of product.variants
    .nodes as ProductCardFragment['variants']['nodes']) {
    const sizeValue = variant.selectedOptions.find(
      (option: (typeof variant.selectedOptions)[number]) =>
        option.name.trim().toLowerCase() === 'size',
    )?.value;

    if (!sizeValue) {
      continue;
    }

    availabilityBySize.set(
      sizeValue,
      Boolean(availabilityBySize.get(sizeValue)) ||
        (typeof variant.quantityAvailable === 'number'
          ? variant.quantityAvailable > 0
          : variant.availableForSale),
    );
  }

  return sizeOption.optionValues.map(
    (
      value: ProductCardFragment['options'][number]['optionValues'][number],
    ): ProductCardSizeOption => ({
      name: value.name,
      available: availabilityBySize.get(value.name) ?? false,
    }),
  );
}
