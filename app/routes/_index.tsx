import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/_index';
import {MockShopNotice} from '~/components/MockShopNotice';
import {ProductItem} from '~/components/ProductItem';
import type {CollectionItemFragment} from 'storefrontapi.generated';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Tenth Athletic — Performance without conformity'}];
};

export async function loader({context}: Route.LoaderArgs) {
  const {products} = await context.storefront.query(HOME_PRODUCTS_QUERY, {
    variables: {first: 4},
  });

  return {
    isShopLinked: Boolean(context.env.PUBLIC_STORE_DOMAIN),
    products,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="home">
      {data.isShopLinked ? null : <MockShopNotice />}
      <section className="home-hero">
        <div className="home-hero-image-wrap">
          <img
            src="/home-hero-runner-night-v2-cropped-narrow.png"
            alt="Tenth Athletic runner at night"
            width={1154}
            height={1177}
          />
          <div className="home-hero-image-overlay" aria-hidden="true" />
        </div>
        <div className="home-hero-content">
          <p className="home-hero-tagline">Wild movement. Quiet mind.</p>
          <h1 className="home-hero-heading">
            Performance
            <br />
            without
            <br />
            conformity
          </h1>
          <p className="home-hero-body">
            Tenth athletic believes running is not a performance for attention,
            but a quiet way of building discipline, identity and belonging. We
            obsess over fabric, fit, friction, weather and distance because
            performance begins as a private experience before it becomes a
            public result.
          </p>
          <Link className="home-hero-cta" prefetch="intent" to="/collections/all">
            Explore the Collection
          </Link>
        </div>
      </section>
    </div>
  );
}

const HOME_PRODUCT_FRAGMENT = `#graphql
  fragment HomeProduct on Product {
    id
    handle
    title
    productType
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
  }
` as const;

const HOME_PRODUCTS_QUERY = `#graphql
  query HomeProducts(
    $country: CountryCode
    $first: Int!
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(first: $first) {
      nodes {
        ...HomeProduct
      }
    }
  }
  ${HOME_PRODUCT_FRAGMENT}
` as const;
