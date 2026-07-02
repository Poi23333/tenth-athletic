import {redirect, useLoaderData} from 'react-router';
import {useEffect, useRef, useState} from 'react';
import type {Route} from './+types/products.$handle';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductImage} from '~/components/ProductImage';
import {ProductForm} from '~/components/ProductForm';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {PRODUCT_INFORMATION_SECTIONS} from '~/lib/productInformation';

export const meta: Route.MetaFunction = ({data}) => {
  return [
    {title: `${data?.product.title ?? ''} | TENTH Athletic`},
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {product};
}

function loadDeferredData(_args: Route.LoaderArgs) {
  return {};
}

export default function Product() {
  const {product} = useLoaderData<typeof loader>();
  const heroGalleryCellRef = useRef<HTMLDivElement | null>(null);
  const lastScrollYRef = useRef(0);
  const stickyBuyPanelRef = useRef<HTMLDivElement | null>(null);
  const [stickyBuyState, setStickyBuyState] = useState<{
    fixedLeft: number;
    isCollapsed: boolean;
    mode: 'hidden' | 'fixed' | 'stopped';
    panelWidth: number;
    stoppedBottom: number;
  }>({
    fixedLeft: 0,
    isCollapsed: false,
    mode: 'hidden',
    panelWidth: 0,
    stoppedBottom: 0,
  });

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml, description} = product;
  const galleryImages =
    product.images?.nodes?.length > 0
      ? product.images.nodes
      : selectedVariant?.image
        ? [selectedVariant.image, selectedVariant.image, selectedVariant.image]
        : [];
  const visibleGalleryImages =
    galleryImages.length > 0 ? galleryImages.slice(0, 3) : [null, null, null];
  const image = selectedVariant?.image ?? galleryImages[0];

  useEffect(() => {
    function updateStickyBuyPanel() {
      const sizeFitBoundary = document.querySelector('.product-accordions');
      const heroGalleryCell = heroGalleryCellRef.current;
      const stickyBuyPanel = stickyBuyPanelRef.current;

      if (!heroGalleryCell || !sizeFitBoundary || !stickyBuyPanel) {
        return;
      }

      const viewportHeight = window.innerHeight;
      const heroCellRect = heroGalleryCell.getBoundingClientRect();
      const sizeFitRect = sizeFitBoundary.getBoundingClientRect();
      const bottomGap = parseFloat(
        getComputedStyle(stickyBuyPanel).getPropertyValue(
          '--product-buy-panel-bottom-gap',
        ),
      );
      const stickyBottomGap = Number.isFinite(bottomGap) ? bottomGap : 0;
      const stickyBottomLine = viewportHeight - stickyBottomGap;
      const hasReachedStickyStart = heroCellRect.bottom < stickyBottomLine - 1;
      const hasReachedStickyStop = sizeFitRect.top <= stickyBottomLine;
      const stoppedBottom = Math.max(
        0,
        viewportHeight - sizeFitRect.top + stickyBottomGap,
      );
      const scrollDelta = window.scrollY - lastScrollYRef.current;
      const isScrollingDown = scrollDelta > 4;
      const isScrollingUp = scrollDelta < -4;

      lastScrollYRef.current = window.scrollY;

      setStickyBuyState((currentState) => {
        const nextMode = !hasReachedStickyStart
          ? 'hidden'
          : hasReachedStickyStop
            ? 'stopped'
            : 'fixed';
        const nextLeft = heroCellRect.left;
        const nextWidth = heroCellRect.width;
        const nextCollapsed =
          nextMode === 'hidden'
            ? false
            : isScrollingDown
              ? true
              : isScrollingUp
                ? false
                : currentState.isCollapsed;

        if (
          currentState.mode === nextMode &&
          currentState.isCollapsed === nextCollapsed &&
          Math.abs(currentState.fixedLeft - nextLeft) < 1 &&
          Math.abs(currentState.panelWidth - nextWidth) < 1 &&
          Math.abs(currentState.stoppedBottom - stoppedBottom) < 1
        ) {
          return currentState;
        }

        return {
          fixedLeft: nextLeft,
          isCollapsed: nextCollapsed,
          mode: nextMode,
          panelWidth: nextWidth,
          stoppedBottom,
        };
      });
    }

    lastScrollYRef.current = window.scrollY;
    updateStickyBuyPanel();
    window.addEventListener('scroll', updateStickyBuyPanel, {passive: true});
    window.addEventListener('resize', updateStickyBuyPanel);

    return () => {
      window.removeEventListener('scroll', updateStickyBuyPanel);
      window.removeEventListener('resize', updateStickyBuyPanel);
    };
  }, []);

  return (
    <div className="product">
      <section className="product-gallery" aria-label="Product images">
        {visibleGalleryImages.map((galleryImage, index) => (
          <div
            className={`product-gallery-cell${
              index === 1 ? ' product-gallery-cell--hero' : ''
            }`}
            key={galleryImage ? `${galleryImage.url}-${index}` : index}
            ref={index === 1 ? heroGalleryCellRef : undefined}
          >
            <ProductImage image={galleryImage} />
            {index === 1 ? (
              <div
                className={`product-buy-panel is-${stickyBuyState.mode}${
                  stickyBuyState.isCollapsed ? ' is-collapsed' : ''
                }`}
                ref={stickyBuyPanelRef}
                role="region"
                aria-label="Product purchase options"
                style={
                  stickyBuyState.mode === 'fixed' ||
                  stickyBuyState.mode === 'stopped'
                    ? {
                        bottom:
                          stickyBuyState.mode === 'stopped'
                            ? `${stickyBuyState.stoppedBottom}px`
                            : undefined,
                        left: `${stickyBuyState.fixedLeft}px`,
                        width: `${stickyBuyState.panelWidth}px`,
                      }
                    : undefined
                }
              >
                <ProductForm
                  productTitle={title}
                  productOptions={productOptions}
                  selectedVariant={selectedVariant}
                />
              </div>
            ) : null}
          </div>
        ))}
      </section>

      <div
        className="product-buy-panel-mobile"
        role="region"
        aria-label="Product purchase options"
      >
        <ProductForm
          productTitle={title}
          productOptions={productOptions}
          selectedVariant={selectedVariant}
        />
      </div>

      <div className="product-details-grid">
        <div>
          {description ? (
            <div
              className="product-description"
              dangerouslySetInnerHTML={{__html: descriptionHtml}}
            />
          ) : null}
        </div>
        {image ? (
          <div className="product-details-image">
            <img
              alt={image.altText || title}
              src={image.url}
              width={image.width ?? undefined}
              height={image.height ?? undefined}
            />
          </div>
        ) : null}
      </div>

      <div className="product-accordions">
        {PRODUCT_INFORMATION_SECTIONS.map((item, index) => (
          <details className="product-accordion" key={item.id} open={index === 0}>
            <summary>{item.title}</summary>
            <div className="product-accordion-content">{item.content}</div>
          </details>
        ))}
      </div>

      {selectedVariant?.sku ? (
        <section className="product-specs" aria-label="Technical specifications">
          <h2 className="product-specs-heading">
            Technical
            <br />
            Specifications
          </h2>
          <div className="product-specs-row">
            <div className="product-specs-key">SKU</div>
            <div className="product-specs-value">{selectedVariant.sku}</div>
          </div>
          {selectedVariant.title !== 'Default Title' ? (
            <div className="product-specs-row">
              <div className="product-specs-key">Variant</div>
              <div className="product-specs-value">{selectedVariant.title}</div>
            </div>
          ) : null}
        </section>
      ) : null}

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    images(first: 3) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    encodedVariantExistence
    encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;
