import {data, Link, useLoaderData} from 'react-router';
import {startTransition, useEffect, useRef, useState} from 'react';
import type {PointerEvent as ReactPointerEvent, ReactNode} from 'react';
import type {Route} from './+types/products.$handle';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  Image,
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
import {getProductFeaturePreset} from '~/data/productDetails';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {PRODUCT_INFORMATION_SECTIONS} from '~/lib/productInformation';
import type {
  ProductFragment,
  ProductMerchandisingItemFragment,
} from 'storefrontapi.generated';

const DEFAULT_PRODUCT_THEME = {
  controlsRgb: '111, 100, 92',
  lightRgb: '225, 218, 209',
  mainColor: '#554d48',
} as const;

const LIGHT_COLOR_WHITE_MIX = 0.8;
const RECENTLY_EXPLORED_COOKIE = 'tenth_recently_explored';
const MERCHANDISING_PRODUCT_LIMIT = 8;

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
  return data(
    {...deferredData, ...criticalData.data},
    {
      headers: {
        'Set-Cookie': createRecentlyExploredCookie(
          criticalData.recentlyExploredHandles,
        ),
      },
    },
  );
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

  const pdp = normalizeProductPdp(product);

  const secondaryImageReference = product.secondaryImage?.reference;
  const secondaryImage =
    secondaryImageReference?.__typename === 'MediaImage'
      ? secondaryImageReference.image
      : null;

  const recentlyExploredHandles = getRecentlyExploredHandles(request, handle);
  const {productRecommendations, recentlyExplored} = await storefront.query(
    PRODUCT_MERCHANDISING_QUERY,
    {
      variables: {
        productId: product.id,
        recentlyExploredQuery: recentlyExploredHandles
          .map((recentHandle) => `handle:${recentHandle}`)
          .join(' OR '),
      },
    },
  );
  type MerchandisingProduct = (typeof recentlyExplored.nodes)[number];
  const recentlyExploredByHandle = new Map(
    recentlyExplored.nodes.map((recentProduct: MerchandisingProduct) => [
      recentProduct.handle,
      recentProduct,
    ]),
  );

  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {
    data: {
      completeTheSystem:
        productRecommendations?.filter(
          (
            recommendedProduct: MerchandisingProduct | null,
          ): recommendedProduct is MerchandisingProduct =>
            recommendedProduct !== null && recommendedProduct.id !== product.id,
        ) ?? [],
      product,
      pdp,
      recentlyExplored: recentlyExploredHandles
        .map((recentHandle) => recentlyExploredByHandle.get(recentHandle))
        .filter(
          (recentProduct): recentProduct is MerchandisingProduct =>
            recentProduct !== undefined,
        ),
      secondaryImage,
    },
    recentlyExploredHandles,
  };
}

function loadDeferredData(_args: Route.LoaderArgs) {
  return {};
}

export default function Product() {
  const {completeTheSystem, pdp, product, recentlyExplored, secondaryImage} =
    useLoaderData<typeof loader>();
  const productRef = useRef<HTMLDivElement | null>(null);
  const purchasePanelRef = useRef<HTMLDivElement | null>(null);
  const videoBoundaryRef = useRef<HTMLElement | null>(null);
  const lastScrollYRef = useRef(0);
  const [purchasePanelState, setPurchasePanelState] = useState<{
    isCollapsed: boolean;
    mode: 'embedded' | 'fixed' | 'stopped';
    stoppedTop: number;
  }>({
    isCollapsed: false,
    mode: 'fixed',
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

  const {title} = product;
  const selectedColor = selectedVariant.selectedOptions.find(
    (option) => option.name.trim().toLowerCase() === 'color',
  )?.value;

  if (!selectedColor) {
    throw new Error(`Product "${product.handle}" has no selected Color value.`);
  }

  const selectedGallery = pdp.colorGalleries.find(
    (gallery) =>
      gallery.colorName.trim().toLowerCase() ===
      selectedColor.trim().toLowerCase(),
  );

  if (!selectedGallery) {
    throw new Error(
      `Product "${product.handle}" has no six-image gallery for Color "${selectedColor}".`,
    );
  }

  const heroImages = selectedGallery.images;
  const productTheme = getProductTheme(product.mainColor?.value);
  const productFooterMainColor = normalizeHexColor(product.mainColor?.value);

  useEffect(() => {
    function updatePurchasePanel() {
      const productElement = productRef.current;
      const purchasePanel = purchasePanelRef.current;
      const videoBoundary = videoBoundaryRef.current;

      if (!productElement || !purchasePanel || !videoBoundary) {
        return;
      }

      if (!window.matchMedia('(min-width: 48em)').matches) {
        lastScrollYRef.current = window.scrollY;
        startTransition(() => {
          setPurchasePanelState((currentState) =>
            currentState.mode === 'embedded' && !currentState.isCollapsed
              ? currentState
              : {
                  ...currentState,
                  isCollapsed: false,
                  mode: 'embedded',
                },
          );
        });
        return;
      }

      const bottomGap = 12;
      const viewportBottomLine = window.innerHeight - bottomGap;
      const productRect = productElement.getBoundingClientRect();
      const videoBoundaryRect = videoBoundary.getBoundingClientRect();
      const measuredPanelHeight = purchasePanel.getBoundingClientRect().height;
      const hasReachedStopBoundary =
        videoBoundaryRect.top <= viewportBottomLine;
      const nextMode: 'embedded' | 'fixed' | 'stopped' = hasReachedStopBoundary
        ? 'stopped'
        : 'fixed';
      const scrollDelta = window.scrollY - lastScrollYRef.current;
      const isScrollingDown = scrollDelta > 4;
      const isScrollingUp = scrollDelta < -4;

      lastScrollYRef.current = window.scrollY;

      startTransition(() => {
        setPurchasePanelState((currentState) => {
          const nextCollapsed = isScrollingDown
            ? true
            : isScrollingUp
              ? false
              : currentState.isCollapsed;
          const nextState = {
            isCollapsed: nextCollapsed,
            mode: nextMode,
            stoppedTop:
              videoBoundaryRect.top -
              productRect.top -
              measuredPanelHeight -
              bottomGap,
          };

          if (
            currentState.mode === nextState.mode &&
            currentState.isCollapsed === nextState.isCollapsed &&
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
    resizeObserver.observe(productRef.current!);
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
    <div className="product" ref={productRef}>
      <style>{`:root {
        --product-main-color: ${productTheme.mainColor};
        --product-main-color-rgb: ${productTheme.mainRgb};
        --product-controls-color-rgb: ${productTheme.controlsRgb};
        --product-light-color-rgb: ${productTheme.lightRgb};
        ${productFooterMainColor ? `--product-footer-main-color: ${productFooterMainColor};` : ''}
      }`}</style>
      <h1 className="sr-only">{title}</h1>
      <section className="product-hero" aria-label="Product overview">
        <ProductHeroGallery
          images={heroImages}
          key={selectedGallery.colorName}
          productTitle={title}
        />
      </section>

      <div
        className={`product-purchase-panel is-${purchasePanelState.mode}${
          purchasePanelState.isCollapsed ? ' is-collapsed' : ''
        }`}
        ref={purchasePanelRef}
        role="region"
        aria-label="Product purchase options"
        style={
          purchasePanelState.mode === 'stopped'
            ? {top: `${purchasePanelState.stoppedTop}px`}
            : undefined
        }
      >
        <ProductForm
          icon={productSilhouette}
          productTitle={title}
          productOptions={productOptions}
          selectedVariant={selectedVariant}
          summary={pdp.summary}
        />
      </div>

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

      <ProductFeatureIndex productType={product.productType} />

      <ProductEditorialContent blocks={pdp.editorialBlocks} />

      <ProductCampaignVideo ref={videoBoundaryRef} />

      <section className="product-information-section">
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

      <ProductTechnicalSpecs
        careInstructions={pdp.careInstructions}
        sku={selectedVariant?.sku}
        specifications={pdp.specifications}
      />

      <div className="product-merchandising">
        <ProductRail products={completeTheSystem} title="Complete the System" />
        <ProductRail products={recentlyExplored} title="Recently Explored" />
      </div>

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

function ProductRail({
  products,
  title,
}: {
  products: ProductMerchandisingItemFragment[];
  title: string;
}) {
  const titleId = `product-rail-${slugify(title)}`;

  return (
    <section className="product-rail" aria-labelledby={titleId}>
      <h2 className="product-rail-title" id={titleId}>
        {title}
      </h2>
      <ProductRailScroller products={products} title={title} />
    </section>
  );
}

function ProductRailScroller({
  products,
  title,
}: {
  products: ProductMerchandisingItemFragment[];
  title: string;
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<{pointerX: number; scrollLeft: number} | null>(
    null,
  );
  const [scrollbar, setScrollbar] = useState({
    isVisible: false,
    thumbLeft: 0,
    thumbWidth: 100,
  });

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const updateScrollbar = () => {
      const clientWidth = scroller.clientWidth;
      const scrollWidth = scroller.scrollWidth;
      const maxScrollLeft = scrollWidth - clientWidth;
      const isVisible = maxScrollLeft > 1;
      const thumbWidth = isVisible ? (clientWidth / scrollWidth) * 100 : 100;
      const thumbLeft = isVisible
        ? (scroller.scrollLeft / maxScrollLeft) * (100 - thumbWidth)
        : 0;

      setScrollbar((current) =>
        current.isVisible === isVisible &&
        Math.abs(current.thumbLeft - thumbLeft) < 0.05 &&
        Math.abs(current.thumbWidth - thumbWidth) < 0.05
          ? current
          : {isVisible, thumbLeft, thumbWidth},
      );
    };

    updateScrollbar();
    const resizeObserver = new ResizeObserver(updateScrollbar);
    resizeObserver.observe(scroller);
    const productList = scroller.firstElementChild;
    if (productList) resizeObserver.observe(productList);
    scroller.addEventListener('scroll', updateScrollbar, {passive: true});

    return () => {
      resizeObserver.disconnect();
      scroller.removeEventListener('scroll', updateScrollbar);
    };
  }, [products]);

  function scrollFromTrack(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const track = event.currentTarget.getBoundingClientRect();
    const thumbWidth = (scrollbar.thumbWidth / 100) * track.width;
    const availableTrack = track.width - thumbWidth;
    const position = Math.min(
      Math.max(event.clientX - track.left - thumbWidth / 2, 0),
      availableTrack,
    );
    scroller.scrollLeft =
      (position / availableTrack) *
      (scroller.scrollWidth - scroller.clientWidth);
  }

  function startThumbDrag(event: ReactPointerEvent<HTMLDivElement>) {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStateRef.current = {
      pointerX: event.clientX,
      scrollLeft: scroller.scrollLeft,
    };
  }

  function dragThumb(event: ReactPointerEvent<HTMLDivElement>) {
    const scroller = scrollerRef.current;
    const dragState = dragStateRef.current;
    const track = event.currentTarget.parentElement;
    if (!scroller || !dragState || !track) return;

    const thumbWidth = (scrollbar.thumbWidth / 100) * track.clientWidth;
    const availableTrack = track.clientWidth - thumbWidth;
    const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;
    scroller.scrollLeft =
      dragState.scrollLeft +
      ((event.clientX - dragState.pointerX) / availableTrack) * maxScrollLeft;
  }

  function stopThumbDrag() {
    dragStateRef.current = null;
  }

  return (
    <div className="product-rail-scroller-shell">
      <div
        aria-label={`${title} products`}
        className="product-rail-scroller"
        ref={scrollerRef}
        role="region"
      >
        <div className="product-rail-list">
          {products.map((railProduct) => (
            <ProductRailImage key={railProduct.id} product={railProduct} />
          ))}
        </div>
      </div>
      {scrollbar.isVisible ? (
        <div
          aria-hidden="true"
          className="product-rail-scrollbar"
          onPointerDown={scrollFromTrack}
        >
          <div
            className="product-rail-scrollbar-thumb"
            onPointerCancel={stopThumbDrag}
            onPointerDown={startThumbDrag}
            onPointerMove={dragThumb}
            onPointerUp={stopThumbDrag}
            style={{
              left: `${scrollbar.thumbLeft}%`,
              width: `${scrollbar.thumbWidth}%`,
            }}
          />
        </div>
      ) : null}
    </div>
  );
}

function ProductRailImage({
  product,
}: {
  product: ProductMerchandisingItemFragment;
}) {
  const fullImageReference = product.fullImage?.reference;
  const hoverImage =
    fullImageReference?.__typename === 'MediaImage'
      ? fullImageReference.image
      : null;
  const image = product.featuredImage;

  return (
    <Link
      aria-label={product.title}
      className="product-rail-image-link"
      prefetch="intent"
      to={`/products/${product.handle}`}
    >
      {image ? (
        <div
          className={`product-rail-image-media${
            hoverImage ? ' product-rail-image-media--swap' : ''
          }`}
        >
          <Image
            alt={image.altText || product.title}
            className="product-rail-image product-rail-image--primary"
            data={image}
            sizes="(min-width: 48em) 20vw, 72vw"
          />
          {hoverImage ? (
            <Image
              alt={hoverImage.altText || product.title}
              className="product-rail-image product-rail-image--secondary"
              data={hoverImage}
              loading="lazy"
              sizes="(min-width: 48em) 20vw, 72vw"
            />
          ) : null}
        </div>
      ) : null}
    </Link>
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function normalizeProductPdp(product: ProductFragment) {
  getProductFeaturePreset(product.productType);

  const summary = parseRequiredStringList(
    product.pdpSummary?.value,
    `${product.handle}: custom.pdp_summary`,
    1,
    4,
  );
  const galleryReferences = product.colorGalleries?.references?.nodes;

  if (!galleryReferences?.length) {
    throw new Error(
      `Product "${product.handle}" requires custom.color_galleries.`,
    );
  }

  const colorGalleries = galleryReferences.map((galleryReference) => {
    if (galleryReference.__typename !== 'Metaobject') {
      throw new Error(
        `Product "${product.handle}" has a non-metaobject color gallery reference.`,
      );
    }

    const colorName = requireMetafieldValue(
      galleryReference.colorName,
      `${galleryReference.handle}: color_name`,
    );
    const imageReferences = galleryReference.images?.references?.nodes;

    if (imageReferences?.length !== 6) {
      throw new Error(
        `Color gallery "${galleryReference.handle}" requires exactly six images; received ${imageReferences?.length ?? 0}.`,
      );
    }

    const images = imageReferences.map((imageReference) => {
      if (imageReference.__typename !== 'MediaImage') {
        throw new Error(
          `Color gallery "${galleryReference.handle}" contains a non-image file reference.`,
        );
      }

      if (!imageReference.image) {
        throw new Error(
          `Color gallery "${galleryReference.handle}" contains an image reference without image data.`,
        );
      }

      return imageReference.image;
    });

    return {
      colorName,
      id: galleryReference.id,
      images,
    };
  });
  const galleryKeys = colorGalleries.map((gallery) =>
    gallery.colorName.trim().toLowerCase(),
  );

  if (new Set(galleryKeys).size !== galleryKeys.length) {
    throw new Error(
      `Product "${product.handle}" has duplicate Color gallery names.`,
    );
  }

  const colorOption = product.options.find(
    (option) => option.name.trim().toLowerCase() === 'color',
  );

  if (!colorOption) {
    throw new Error(`Product "${product.handle}" requires a Color option.`);
  }

  for (const optionValue of colorOption.optionValues) {
    if (!galleryKeys.includes(optionValue.name.trim().toLowerCase())) {
      throw new Error(
        `Product "${product.handle}" is missing a six-image gallery for Color "${optionValue.name}".`,
      );
    }
  }

  const editorialReferences = product.editorialBlocks?.references?.nodes;

  if (editorialReferences?.length !== 2) {
    throw new Error(
      `Product "${product.handle}" requires exactly two custom.editorial_blocks; received ${editorialReferences?.length ?? 0}.`,
    );
  }

  const editorialBlocks = editorialReferences.map((editorialReference) => {
    if (editorialReference.__typename !== 'Metaobject') {
      throw new Error(
        `Product "${product.handle}" has a non-metaobject editorial reference.`,
      );
    }

    const imageReference = editorialReference.image?.reference;

    if (imageReference?.__typename !== 'MediaImage') {
      throw new Error(
        `Editorial block "${editorialReference.id}" requires one image.`,
      );
    }

    if (!imageReference.image) {
      throw new Error(
        `Editorial block "${editorialReference.id}" has no image data.`,
      );
    }

    return {
      body: requireMetafieldValue(
        editorialReference.body,
        `${editorialReference.id}: body`,
      ),
      heading: requireMetafieldValue(
        editorialReference.heading,
        `${editorialReference.id}: heading`,
      ),
      id: editorialReference.id,
      image: imageReference.image,
    };
  });

  const specifications = [
    {
      label: 'Product Weight',
      logo: getOptionalMetafieldImage(
        product.productWeightLogo,
        `${product.handle}: custom.spec_product_weight_logo`,
      ),
      value: requireMetafieldValue(
        product.productWeight,
        `${product.handle}: custom.spec_product_weight`,
      ),
    },
    {
      label: 'Main Fabric Content',
      logo: getOptionalMetafieldImage(
        product.fabricContentLogo,
        `${product.handle}: custom.spec_main_fabric_content_logo`,
      ),
      value: requireMetafieldValue(
        product.fabricContent,
        `${product.handle}: custom.spec_main_fabric_content`,
      ),
    },
    {
      label: 'Fit',
      logo: getOptionalMetafieldImage(
        product.fitLogo,
        `${product.handle}: custom.spec_fit_logo`,
      ),
      value: requireMetafieldValue(
        product.fit,
        `${product.handle}: custom.spec_fit`,
      ),
    },
    {
      label: 'Temperature Range',
      logo: getOptionalMetafieldImage(
        product.temperatureRangeLogo,
        `${product.handle}: custom.spec_temperature_range_logo`,
      ),
      value: requireMetafieldValue(
        product.temperatureRange,
        `${product.handle}: custom.spec_temperature_range`,
      ),
    },
    {
      label: 'Riding Conditions',
      logo: getOptionalMetafieldImage(
        product.ridingConditionsLogo,
        `${product.handle}: custom.spec_riding_conditions_logo`,
      ),
      value: requireMetafieldValue(
        product.ridingConditions,
        `${product.handle}: custom.spec_riding_conditions`,
      ),
    },
  ];
  const careReferences = product.careInstructions?.references?.nodes;

  if (!careReferences?.length) {
    throw new Error(
      `Product "${product.handle}" requires at least one custom.care_instructions selection.`,
    );
  }

  const careInstructions = careReferences.map((careReference) => {
    if (careReference.__typename !== 'Metaobject') {
      throw new Error(
        `Product "${product.handle}" has a non-metaobject care instruction reference.`,
      );
    }

    const iconReference = careReference.icon?.reference;

    if (iconReference?.__typename !== 'MediaImage') {
      throw new Error(
        `Care instruction "${careReference.id}" requires one icon.`,
      );
    }

    if (!iconReference.image) {
      throw new Error(
        `Care instruction "${careReference.id}" has no icon image data.`,
      );
    }

    return {
      icon: iconReference.image,
      id: careReference.id,
      name: requireMetafieldValue(
        careReference.name,
        `${careReference.id}: name`,
      ),
    };
  });

  return {
    careInstructions,
    colorGalleries,
    editorialBlocks,
    specifications,
    summary,
  };
}

function requireMetafieldValue(
  metafield: {value?: string | null} | null | undefined,
  label: string,
) {
  const value = metafield?.value?.trim();

  if (!value) {
    throw new Error(`Missing required PDP field ${label}.`);
  }

  return value;
}

function getOptionalMetafieldImage(
  metafield: ProductFragment['productWeightLogo'],
  label: string,
) {
  if (!metafield) return null;

  const reference = metafield.reference;

  if (reference?.__typename !== 'MediaImage') {
    throw new Error(`${label} must reference an image or SVG.`);
  }

  if (!reference.image) {
    throw new Error(`${label} has no image data.`);
  }

  return reference.image;
}

function parseRequiredStringList(
  rawValue: string | null | undefined,
  label: string,
  minimum: number,
  maximum: number,
) {
  if (!rawValue) {
    throw new Error(`Missing required PDP field ${label}.`);
  }

  let parsedValue: unknown;

  try {
    parsedValue = JSON.parse(rawValue);
  } catch (error) {
    throw new Error(`${label} is not valid JSON.`, {cause: error});
  }

  if (
    !Array.isArray(parsedValue) ||
    parsedValue.length < minimum ||
    parsedValue.length > maximum ||
    parsedValue.some(
      (value) => typeof value !== 'string' || value.trim().length === 0,
    )
  ) {
    throw new Error(
      `${label} requires ${minimum}–${maximum} non-empty text values.`,
    );
  }

  return (parsedValue as string[]).map((value) => value.trim());
}

function getRecentlyExploredHandles(request: Request, currentHandle: string) {
  const cookie = request.headers
    .get('Cookie')
    ?.split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${RECENTLY_EXPLORED_COOKIE}=`));
  const storedHandles = cookie
    ? cookie.slice(RECENTLY_EXPLORED_COOKIE.length + 1).split(',')
    : [];

  return [currentHandle, ...storedHandles]
    .filter(
      (handle, index, handles) =>
        /^[a-z0-9][a-z0-9-]*$/i.test(handle) &&
        handles.indexOf(handle) === index,
    )
    .slice(0, MERCHANDISING_PRODUCT_LIMIT);
}

function createRecentlyExploredCookie(handles: string[]) {
  return `${RECENTLY_EXPLORED_COOKIE}=${handles.join(
    ',',
  )}; Path=/; Max-Age=2592000; HttpOnly; SameSite=Lax`;
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
  const normalizedValue = normalizeHexColor(value);

  if (!normalizedValue) {
    return null;
  }

  return [
    Number.parseInt(normalizedValue.slice(1, 3), 16),
    Number.parseInt(normalizedValue.slice(3, 5), 16),
    Number.parseInt(normalizedValue.slice(5, 7), 16),
  ];
}

function normalizeHexColor(value: string | null | undefined) {
  const normalizedValue = value?.trim();

  return normalizedValue && /^#[\da-f]{6}$/i.test(normalizedValue)
    ? normalizedValue
    : null;
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

const PDP_MEDIA_IMAGE_FRAGMENT = `#graphql
  fragment PdpMediaImage on MediaImage {
    image {
      id
      url
      altText
      width
      height
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    productType
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
    pdpSummary: metafield(namespace: "custom", key: "pdp_summary") {
      value
    }
    colorGalleries: metafield(
      namespace: "custom"
      key: "color_galleries"
    ) {
      references(first: 20) {
        nodes {
          __typename
          ... on Metaobject {
            id
            handle
            colorName: field(key: "color_name") {
              value
            }
            images: field(key: "images") {
              references(first: 6) {
                nodes {
                  __typename
                  ...PdpMediaImage
                }
              }
            }
          }
        }
      }
    }
    editorialBlocks: metafield(
      namespace: "custom"
      key: "editorial_blocks"
    ) {
      references(first: 2) {
        nodes {
          __typename
          ... on Metaobject {
            id
            heading: field(key: "heading") {
              value
            }
            body: field(key: "body") {
              value
            }
            image: field(key: "image") {
              reference {
                __typename
                ...PdpMediaImage
              }
            }
          }
        }
      }
    }
    productWeight: metafield(
      namespace: "custom"
      key: "spec_product_weight"
    ) {
      value
    }
    productWeightLogo: metafield(
      namespace: "custom"
      key: "spec_product_weight_logo"
    ) {
      reference {
        __typename
        ...PdpMediaImage
      }
    }
    fabricContent: metafield(
      namespace: "custom"
      key: "spec_main_fabric_content"
    ) {
      value
    }
    fabricContentLogo: metafield(
      namespace: "custom"
      key: "spec_main_fabric_content_logo"
    ) {
      reference {
        __typename
        ...PdpMediaImage
      }
    }
    fit: metafield(namespace: "custom", key: "spec_fit") {
      value
    }
    fitLogo: metafield(namespace: "custom", key: "spec_fit_logo") {
      reference {
        __typename
        ...PdpMediaImage
      }
    }
    temperatureRange: metafield(
      namespace: "custom"
      key: "spec_temperature_range"
    ) {
      value
    }
    temperatureRangeLogo: metafield(
      namespace: "custom"
      key: "spec_temperature_range_logo"
    ) {
      reference {
        __typename
        ...PdpMediaImage
      }
    }
    ridingConditions: metafield(
      namespace: "custom"
      key: "spec_riding_conditions"
    ) {
      value
    }
    ridingConditionsLogo: metafield(
      namespace: "custom"
      key: "spec_riding_conditions_logo"
    ) {
      reference {
        __typename
        ...PdpMediaImage
      }
    }
    careInstructions: metafield(
      namespace: "custom"
      key: "care_instructions"
    ) {
      references(first: 20) {
        nodes {
          __typename
          ... on Metaobject {
            id
            name: field(key: "name") {
              value
            }
            icon: field(key: "icon") {
              reference {
                __typename
                ...PdpMediaImage
              }
            }
          }
        }
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
  ${PDP_MEDIA_IMAGE_FRAGMENT}
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

const PRODUCT_MERCHANDISING_FRAGMENT = `#graphql
  fragment ProductMerchandisingItem on Product {
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
    fullImage: metafield(namespace: "custom", key: "full") {
      reference {
        __typename
        ... on MediaImage {
          image {
            id
            altText
            url
            width
            height
          }
        }
      }
    }
    options {
      name
      optionValues {
        name
      }
    }
    variants(first: 50) {
      nodes {
        availableForSale
        quantityAvailable
        selectedOptions {
          name
          value
        }
      }
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

const PRODUCT_MERCHANDISING_QUERY = `#graphql
  query ProductMerchandising(
    $country: CountryCode
    $language: LanguageCode
    $productId: ID!
    $recentlyExploredQuery: String!
  ) @inContext(country: $country, language: $language) {
    productRecommendations(productId: $productId, intent: COMPLEMENTARY) {
      ...ProductMerchandisingItem
    }
    recentlyExplored: products(
      first: 8
      query: $recentlyExploredQuery
    ) {
      nodes {
        ...ProductMerchandisingItem
      }
    }
  }
  ${PRODUCT_MERCHANDISING_FRAGMENT}
` as const;
