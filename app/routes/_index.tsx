import {Link, useLoaderData} from 'react-router';
import type {HomepageCurrentReleaseQuery} from 'storefrontapi.generated';
import type {Route} from './+types/_index';
import {
  HomeBanner,
  type HomeBannerImage,
  type HomeBannerSlide,
} from '~/components/HomeBanner';
import {useAside} from '~/components/Aside';
import {getGenderFromCollectionHandle, type GenderMenuKey} from '~/lib/menu';
import {WishlistButton} from '~/components/WishlistButton';

const ENABLE_CATEGORY_CARD_LINKS: boolean = false;

export const meta: Route.MetaFunction = () => {
  return [{title: 'Tenth Athletic — Performance without conformity'}];
};

export async function loader({context}: Route.LoaderArgs) {
  const {products, banners, categories} = await context.storefront.query(
    HOMEPAGE_QUERY,
    {
      variables: {first: 4},
    },
  );

  return {
    banners: banners.nodes
      .map(normalizeBanner)
      .filter((banner): banner is HomeBannerSlide & {sortOrder: number} =>
        Boolean(banner),
      )
      .sort(
        (firstBanner, secondBanner) =>
          firstBanner.sortOrder - secondBanner.sortOrder,
      ),
    categories: categories.nodes
      .map(normalizeCategory)
      .filter((category): category is HomepageCategory & {sortOrder: number} =>
        Boolean(category),
      )
      .sort(
        (firstCategory, secondCategory) =>
          firstCategory.sortOrder - secondCategory.sortOrder,
      ),
    currentRelease: products.nodes,
  };
}

export default function Homepage() {
  const {banners, categories, currentRelease} = useLoaderData<typeof loader>();

  return (
    <div className="home">
      <HomeBanner slides={banners} />

      <section className="home-manifesto" aria-label="About Tenth Athletic">
        <p>
          Rooted in memory and shaped by transformation, evolving forms and
          refined details reveal new expressions of individuality.
        </p>
      </section>

      <section className="home-category-grid" aria-label="Shop by category">
        {categories.map((category) => (
          <CategoryCard key={category.id} {...category} />
        ))}
      </section>

      <section
        className="home-current-release"
        aria-labelledby="current-release-title"
      >
        <h1 id="current-release-title">Current Release</h1>
        <div className="home-release-grid">
          {currentRelease.map((product, index) => {
            const hoverImage = getHoverImage(product);

            return (
              <article className="home-release-card" key={product.id}>
                <Link
                  className="home-release-card-link"
                  prefetch="intent"
                  to={`/products/${product.handle}`}
                >
                  <div className="home-release-card-media">
                    {product.featuredImage ? (
                      <div
                        className={`home-release-card-image-stack${
                          hoverImage
                            ? ' home-release-card-image-stack--swap'
                            : ''
                        }`}
                      >
                        <img
                          alt={product.featuredImage.altText || product.title}
                          className="home-release-card-image home-release-card-image--primary"
                          decoding="async"
                          height={product.featuredImage.height ?? undefined}
                          loading={index < 2 ? 'eager' : 'lazy'}
                          src={product.featuredImage.url}
                          width={product.featuredImage.width ?? undefined}
                        />
                        {hoverImage ? (
                          <img
                            alt={hoverImage.altText || product.title}
                            className="home-release-card-image home-release-card-image--secondary"
                            decoding="async"
                            height={hoverImage.height ?? undefined}
                            loading="lazy"
                            src={hoverImage.url}
                            width={hoverImage.width ?? undefined}
                          />
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                  <div className="home-release-card-copy">
                    <p>{product.title}</p>
                    <p>{formatPrice(product.priceRange.minVariantPrice)}</p>
                  </div>
                </Link>
                <WishlistButton
                  className="home-release-card-wishlist"
                  productId={product.id}
                />
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function CategoryCard({image, label, link}: HomepageCategory) {
  const {open} = useAside();
  const content = (
    <>
      <span>{label}</span>
      <img
        alt={image.altText}
        decoding="async"
        height={image.height ?? undefined}
        loading="eager"
        src={image.url}
        width={image.width ?? undefined}
      />
    </>
  );

  if (ENABLE_CATEGORY_CARD_LINKS) {
    return (
      <Link className="home-category-card" prefetch="intent" to={link}>
        {content}
      </Link>
    );
  }

  return (
    <button
      className="home-category-card"
      onClick={() => open(getCategoryDrawerType(link))}
      type="button"
    >
      {content}
    </button>
  );
}

function getCategoryDrawerType(link: string): GenderMenuKey {
  const {pathname} = new URL(link, 'https://storefront.local');
  const collectionHandle = pathname.match(/^\/collections\/([^/]+)/)?.[1];
  const drawerType = getGenderFromCollectionHandle(collectionHandle);

  if (!drawerType) {
    throw new Error(`Unsupported homepage category link: ${link}`);
  }

  return drawerType;
}

function formatPrice(price: {amount: string; currencyCode: string}) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: price.currencyCode,
    maximumFractionDigits: 0,
  }).format(Number(price.amount));
}

type HomepageProduct = HomepageCurrentReleaseQuery['products']['nodes'][number];

function getHoverImage(product: HomepageProduct) {
  const reference = product.fullImage?.reference;
  return reference?.__typename === 'MediaImage' ? reference.image : null;
}

type HomepageBannerMetaobject =
  HomepageCurrentReleaseQuery['banners']['nodes'][number];

type HomepageCategoryMetaobject =
  HomepageCurrentReleaseQuery['categories']['nodes'][number];

type HomepageCategory = {
  id: string;
  image: HomeBannerImage;
  label: string;
  link: string;
  sortOrder: number;
};

function normalizeCategory(
  category: HomepageCategoryMetaobject,
): HomepageCategory | null {
  const image = getReferencedImage(category.image);
  const label = getTrimmedValue(category.label?.value);
  const link = getTrimmedValue(category.link?.value);
  const sortOrder = getRequiredInteger(category.sortOrder?.value);

  if (!image || !label || !link || sortOrder === null) return null;

  return {id: category.id, image, label, link, sortOrder};
}

function normalizeBanner(
  banner: HomepageBannerMetaobject,
): (HomeBannerSlide & {sortOrder: number}) | null {
  const backgroundImage = getImage(banner.backgroundImage);
  const sortOrder = getRequiredInteger(banner.sortOrder?.value);

  if (!backgroundImage || sortOrder === null) return null;

  const logoFile = getFile(banner.logoFile);
  const logoText = getTrimmedValue(banner.logoText?.value);
  const slogan = getTrimmedValue(banner.slogan?.value);
  const buttonLabel = getTrimmedValue(banner.buttonText?.value);
  const buttonUrl = getTrimmedValue(banner.buttonLink?.value);

  return {
    id: banner.id,
    backgroundImage,
    mobileImage: getImage(banner.mobileImage),
    logo: logoFile
      ? {kind: 'file', url: logoFile.url, alt: logoFile.alt}
      : logoText
        ? {kind: 'text', value: logoText}
        : null,
    slogan,
    button:
      buttonLabel && buttonUrl ? {label: buttonLabel, url: buttonUrl} : null,
    sortOrder,
  };
}

function getImage(
  field:
    | HomepageBannerMetaobject['backgroundImage']
    | HomepageBannerMetaobject['mobileImage'],
): HomeBannerImage | null {
  return getReferencedImage(field);
}

function getReferencedImage(
  field:
    | HomepageBannerMetaobject['backgroundImage']
    | HomepageBannerMetaobject['mobileImage']
    | HomepageCategoryMetaobject['image'],
): HomeBannerImage | null {
  const reference = field?.reference;
  if (reference?.__typename !== 'MediaImage' || !reference.image?.url) {
    return null;
  }

  return {
    altText: reference.image.altText?.trim() ?? '',
    height: reference.image.height ?? null,
    url: reference.image.url,
    width: reference.image.width ?? null,
  };
}

function getFile(
  field: HomepageBannerMetaobject['logoFile'],
): {alt: string; url: string} | null {
  const reference = field?.reference;

  if (
    reference?.__typename === 'GenericFile' &&
    reference.mimeType === 'image/svg+xml' &&
    reference.url
  ) {
    return {alt: reference.alt?.trim() ?? '', url: reference.url};
  }

  if (reference?.__typename === 'MediaImage' && reference.image?.url) {
    return {
      alt: reference.image.altText?.trim() ?? '',
      url: reference.image.url,
    };
  }

  return null;
}

function getTrimmedValue(value: string | null | undefined) {
  const trimmedValue = value?.trim();
  return trimmedValue ? trimmedValue : null;
}

function getRequiredInteger(value: string | null | undefined) {
  const normalizedValue = getTrimmedValue(value);
  if (!normalizedValue) return null;

  const parsedValue = Number(normalizedValue);
  return Number.isInteger(parsedValue) ? parsedValue : null;
}

const HOMEPAGE_QUERY = `#graphql
  query HomepageCurrentRelease(
    $country: CountryCode
    $language: LanguageCode
    $first: Int!
  ) @inContext(country: $country, language: $language) {
    banners: metaobjects(type: "homepage_banner", first: 20) {
      nodes {
        id
        backgroundImage: field(key: "image") {
          reference {
            __typename
            ... on MediaImage {
              image {
                altText
                height
                url
                width
              }
            }
          }
        }
        mobileImage: field(key: "mobile_image") {
          reference {
            __typename
            ... on MediaImage {
              image {
                altText
                height
                url
                width
              }
            }
          }
        }
        logoFile: field(key: "logo_file") {
          reference {
            __typename
            ... on GenericFile {
              alt
              mimeType
              url
            }
            ... on MediaImage {
              image {
                altText
                url
              }
            }
          }
        }
        logoText: field(key: "logo_text") {
          value
        }
        slogan: field(key: "slogan") {
          value
        }
        buttonText: field(key: "button_text") {
          value
        }
        buttonLink: field(key: "button_link") {
          value
        }
        sortOrder: field(key: "sort_order") {
          value
        }
      }
    }
    categories: metaobjects(type: "homepage_category", first: 10) {
      nodes {
        id
        image: field(key: "image") {
          reference {
            __typename
            ... on MediaImage {
              image {
                altText
                height
                url
                width
              }
            }
          }
        }
        label: field(key: "label") {
          value
        }
        link: field(key: "link") {
          value
        }
        sortOrder: field(key: "sort_order") {
          value
        }
      }
    }
    products(first: $first, sortKey: CREATED_AT, reverse: true) {
      nodes {
        id
        handle
        title
        featuredImage {
          altText
          url
          width
          height
        }
        fullImage: metafield(namespace: "custom", key: "full") {
          reference {
            __typename
            ... on MediaImage {
              image {
                altText
                url
                width
                height
              }
            }
          }
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
` as const;
