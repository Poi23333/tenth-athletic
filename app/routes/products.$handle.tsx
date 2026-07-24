import {redirect, useLoaderData} from 'react-router';
import {startTransition, useEffect, useRef, useState} from 'react';
import type {ReactNode} from 'react';
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
import {ProductEditorialContent} from '~/components/product/ProductEditorialContent';
import {ProductFeatureIndex} from '~/components/product/ProductFeatureIndex';
import {ProductCampaignVideo} from '~/components/product/ProductCampaignVideo';
import {ProductTechnicalSpecs} from '~/components/product/ProductTechnicalSpecs';
import {ProductHeroGallery} from '~/components/product/ProductHeroGallery';
import productSilhouette from '~/assets/product/auralite/product-silhouette.svg';
import {AURALITE_PRODUCT_DETAILS} from '~/data/productDetails';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {PRODUCT_INFORMATION_SECTIONS} from '~/lib/productInformation';

const DEFAULT_PRODUCT_THEME = {
  controlsRgb: '111, 100, 92',
  lightRgb: '225, 218, 209',
  mainColor: '#554d48',
} as const;

const LIGHT_COLOR_WHITE_MIX = 0.8;

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

  if (product.images.nodes.length < 1) {
    throw new Error(
      `Auralite product page requires at least one Product Media image; received ${product.images.nodes.length}.`,
    );
  }

  const secondaryImageReference = product.secondaryImage?.reference;
  const secondaryImage =
    secondaryImageReference?.__typename === 'MediaImage'
      ? secondaryImageReference.image
      : null;

  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {product, secondaryImage};
}

function loadDeferredData(_args: Route.LoaderArgs) {
  return {};
}

export default function Product() {
  const {product, secondaryImage} = useLoaderData<typeof loader>();
  const heroRef = useRef<HTMLElement | null>(null);
  const purchasePanelRef = useRef<HTMLDivElement | null>(null);
  const videoBoundaryRef = useRef<HTMLElement | null>(null);
  const informationSectionRef = useRef<HTMLElement | null>(null);
  const lastScrollYRef = useRef(0);
  const [purchasePanelState, setPurchasePanelState] = useState<{
    fixedLeft: number;
    isCollapsed: boolean;
    isDesktop: boolean;
    mode: 'embedded' | 'fixed' | 'stopped';
    panelWidth: number;
    primaryVisible: boolean;
    secondaryVisible: boolean;
    stoppedLeft: number;
    stoppedTop: number;
  }>({
    fixedLeft: 0,
    isCollapsed: false,
    isDesktop: false,
    mode: 'embedded',
    panelWidth: 0,
    primaryVisible: true,
    secondaryVisible: false,
    stoppedLeft: 0,
    stoppedTop: 0,
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

  const {title, descriptionHtml} = product;
  const heroImages = product.images.nodes;
  const productTheme = getProductTheme(product.mainColor?.value);

  useEffect(() => {
    function updatePurchasePanel() {
      const hero = heroRef.current;
      const purchasePanel = purchasePanelRef.current;
      const videoBoundary = videoBoundaryRef.current;
      const informationSection = informationSectionRef.current;

      if (!hero || !purchasePanel || !videoBoundary || !informationSection) {
        return;
      }

      if (!window.matchMedia('(min-width: 48em)').matches) {
        lastScrollYRef.current = window.scrollY;
        startTransition(() => {
          setPurchasePanelState((currentState) =>
            currentState.mode === 'embedded' &&
            !currentState.isCollapsed &&
            !currentState.isDesktop &&
            currentState.primaryVisible &&
            !currentState.secondaryVisible
              ? currentState
              : {
                  ...currentState,
                  isCollapsed: false,
                  isDesktop: false,
                  mode: 'embedded',
                  primaryVisible: true,
                  secondaryVisible: false,
                },
          );
        });
        return;
      }

      const bottomGap = 12;
      const viewportBottomLine = window.innerHeight - bottomGap;
      const heroRect = hero.getBoundingClientRect();
      const videoBoundaryRect = videoBoundary.getBoundingClientRect();
      const informationSectionRect = informationSection.getBoundingClientRect();
      const panelWidth = Math.min(508, heroRect.width);
      const measuredPanelHeight = purchasePanel.getBoundingClientRect().height;
      const hasReachedFixedPosition = heroRect.bottom <= viewportBottomLine;
      const hasReachedStopBoundary =
        videoBoundaryRect.top <= viewportBottomLine;
      const nextMode: 'embedded' | 'fixed' | 'stopped' =
        !hasReachedFixedPosition
          ? 'embedded'
          : hasReachedStopBoundary
            ? 'stopped'
            : 'fixed';
      const scrollDelta = window.scrollY - lastScrollYRef.current;
      const isScrollingDown = scrollDelta > 4;
      const isScrollingUp = scrollDelta < -4;
      const primaryVisible =
        nextMode !== 'stopped' ||
        videoBoundaryRect.top > measuredPanelHeight + bottomGap;
      const secondaryVisible =
        !primaryVisible &&
        informationSectionRect.top <= window.innerHeight * 0.7;

      lastScrollYRef.current = window.scrollY;

      startTransition(() => {
        setPurchasePanelState((currentState) => {
          const nextCollapsed =
            nextMode === 'embedded'
              ? false
              : isScrollingDown
                ? true
                : isScrollingUp
                  ? false
                  : currentState.isCollapsed;
          const nextState = {
            fixedLeft: heroRect.left + (heroRect.width - panelWidth) / 2,
            isCollapsed: nextCollapsed,
            isDesktop: true,
            mode: nextMode,
            panelWidth,
            primaryVisible,
            secondaryVisible,
            stoppedLeft: (heroRect.width - panelWidth) / 2,
            stoppedTop:
              videoBoundary.offsetTop -
              hero.offsetTop -
              measuredPanelHeight -
              bottomGap,
          };

          if (
            currentState.mode === nextState.mode &&
            currentState.isCollapsed === nextState.isCollapsed &&
            currentState.isDesktop === nextState.isDesktop &&
            Math.abs(currentState.fixedLeft - nextState.fixedLeft) < 1 &&
            Math.abs(currentState.panelWidth - nextState.panelWidth) < 1 &&
            currentState.primaryVisible === nextState.primaryVisible &&
            currentState.secondaryVisible === nextState.secondaryVisible &&
            Math.abs(currentState.stoppedLeft - nextState.stoppedLeft) < 1 &&
            Math.abs(currentState.stoppedTop - nextState.stoppedTop) < 1
          ) {
            return currentState;
          }

          return nextState;
        });
      });
    }

    lastScrollYRef.current = window.scrollY;
    updatePurchasePanel();
    const resizeObserver = new ResizeObserver(updatePurchasePanel);
    resizeObserver.observe(heroRef.current!);
    resizeObserver.observe(purchasePanelRef.current!);
    window.addEventListener('resize', updatePurchasePanel);
    window.addEventListener('scroll', updatePurchasePanel, {passive: true});

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updatePurchasePanel);
      window.removeEventListener('scroll', updatePurchasePanel);
    };
  }, []);

  return (
    <div className="product">
      <style>{`:root {
        --product-main-color: ${productTheme.mainColor};
        --product-main-color-rgb: ${productTheme.mainRgb};
        --product-controls-color-rgb: ${productTheme.controlsRgb};
        --product-light-color-rgb: ${productTheme.lightRgb};
      }`}</style>
      <h1 className="sr-only">{title}</h1>
      <section
        className="product-hero"
        aria-label="Product overview"
        ref={heroRef}
      >
        <ProductHeroGallery
          images={heroImages}
          key={product.id}
          productTitle={title}
        />
        <div
          className={`product-purchase-panel is-${purchasePanelState.mode}${
            purchasePanelState.isCollapsed ? ' is-collapsed' : ''
          }${purchasePanelState.primaryVisible ? ' is-visible' : ' is-hidden'}`}
          ref={purchasePanelRef}
          role="region"
          aria-label="Product purchase options"
          aria-hidden={!purchasePanelState.primaryVisible}
          style={
            purchasePanelState.mode === 'fixed'
              ? {
                  left: `${purchasePanelState.fixedLeft}px`,
                  width: `${purchasePanelState.panelWidth}px`,
                }
              : purchasePanelState.mode === 'stopped'
                ? {
                    left: `${purchasePanelState.stoppedLeft}px`,
                    top: `${purchasePanelState.stoppedTop}px`,
                    width: `${purchasePanelState.panelWidth}px`,
                  }
                : undefined
          }
        >
          <ProductForm
            icon={productSilhouette}
            productTitle={title}
            productOptions={productOptions}
            selectedVariant={selectedVariant}
            summary={AURALITE_PRODUCT_DETAILS.summary}
          />
        </div>
      </section>

      {secondaryImage ? (
        <section
          className="product-lifestyle-showcase"
          aria-label="Product shown from multiple angles"
        >
          <div className="product-lifestyle-media">
            <ProductImage image={secondaryImage} kind="lifestyle" />
          </div>
        </section>
      ) : null}

      <ProductFeatureIndex />

      <ProductEditorialContent html={descriptionHtml} />

      <ProductCampaignVideo ref={videoBoundaryRef} />

      <section
        className="product-information-section"
        ref={informationSectionRef}
      >
        <div className="product-accordions">
          {PRODUCT_INFORMATION_SECTIONS.map((item, index) => (
            <ProductInformationAccordion
              content={item.content}
              defaultOpen={index < 2}
              id={item.id}
              key={item.id}
              title={item.title}
            />
          ))}
        </div>
      </section>

      {purchasePanelState.isDesktop ? (
        <aside
          aria-hidden={!purchasePanelState.secondaryVisible}
          aria-label="Product purchase options"
          className={`product-secondary-purchase-panel${
            purchasePanelState.secondaryVisible ? ' is-visible' : ''
          }`}
        >
          <ProductForm
            icon={productSilhouette}
            productTitle={title}
            productOptions={productOptions}
            selectedVariant={selectedVariant}
            summary={AURALITE_PRODUCT_DETAILS.summary}
          />
        </aside>
      ) : null}

      <ProductTechnicalSpecs sku={selectedVariant?.sku} />

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

function getProductTheme(value: string | null | undefined) {
  const mainRgb = parseHexColor(value);

  if (!mainRgb) {
    return {
      ...DEFAULT_PRODUCT_THEME,
      mainRgb: '85, 77, 72',
    };
  }

  const lightRgb = mainRgb.map((channel) =>
    Math.round(channel + (255 - channel) * LIGHT_COLOR_WHITE_MIX),
  );
  const rgbValue = mainRgb.join(', ');

  return {
    controlsRgb: rgbValue,
    lightRgb: lightRgb.join(', '),
    mainColor: `#${mainRgb
      .map((channel) => channel.toString(16).padStart(2, '0'))
      .join('')}`,
    mainRgb: rgbValue,
  };
}

function parseHexColor(value: string | null | undefined) {
  const normalizedValue = value?.trim();

  if (!normalizedValue || !/^#[\da-f]{6}$/i.test(normalizedValue)) {
    return null;
  }

  return [
    Number.parseInt(normalizedValue.slice(1, 3), 16),
    Number.parseInt(normalizedValue.slice(3, 5), 16),
    Number.parseInt(normalizedValue.slice(5, 7), 16),
  ];
}

function ProductInformationAccordion({
  content,
  defaultOpen,
  id,
  title,
}: {
  content: ReactNode;
  defaultOpen: boolean;
  id: string;
  title: string;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const panelId = `product-information-${id}`;

  return (
    <div className={`product-accordion${isOpen ? ' is-open' : ''}`}>
      <button
        aria-controls={panelId}
        aria-expanded={isOpen}
        className="product-accordion-trigger"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        {title}
      </button>
      <div
        aria-hidden={!isOpen}
        className="product-accordion-panel"
        id={panelId}
      >
        <div className="product-accordion-content">{content}</div>
      </div>
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
    tags
    images(first: 20) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    secondaryImage: metafield(
      namespace: "custom"
      key: "img"
    ) {
      reference {
        __typename
        ... on MediaImage {
          image {
            id
            url
            altText
            width
            height
          }
        }
      }
    }
    mainColor: metafield(namespace: "custom", key: "main_color") {
      value
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
