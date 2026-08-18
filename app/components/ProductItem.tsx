import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
  SearchProductItemFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';
import {WishlistButton} from '~/components/WishlistButton';
import {getProductSizeOptions} from '~/lib/productSizeOptions';

type ProductCardFragment =
  | CollectionItemFragment
  | ProductItemFragment
  | SearchProductItemFragment;
export function ProductItem({
  product,
  loading,
  trackingParameters,
}: {
  product: ProductCardFragment;
  loading?: 'eager' | 'lazy';
  trackingParameters?: string | null;
}) {
  const variantUrl = useVariantUrl(product.handle);
  const trackingSearch = new URLSearchParams(
    trackingParameters ?? '',
  ).toString();
  const productUrl = trackingSearch
    ? `${variantUrl}${variantUrl.includes('?') ? '&' : '?'}${trackingSearch}`
    : variantUrl;
  const image = product.featuredImage;
  const hoverImage = product.images.nodes[1] ?? null;
  const hasHoverImage = Boolean(hoverImage);
  const sizeOptions = getProductSizeOptions(product);
  const hasSizeOptions = sizeOptions.length > 0;
  const {title, color} = getProductDisplayParts(product.title);

  return (
    <article
      className={`product-item${hasSizeOptions ? ' product-item--has-sizes' : ''}`}
      key={product.id}
    >
      <Link
        className="product-item-media-link"
        prefetch="intent"
        to={productUrl}
      >
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
      </Link>
      <div className="product-item-info">
        <Link
          className="product-item-details-link"
          prefetch="intent"
          to={productUrl}
        >
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
      </div>
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
