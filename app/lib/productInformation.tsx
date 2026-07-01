export const PRODUCT_INFORMATION_SECTIONS = [
  {
    id: 'size-fit',
    title: 'Size & Fit',
    content: (
      <>
        <p>
          Refer to our size guide for detailed measurements. All Tenth Athletic
          garments are designed with a performance race fit unless otherwise
          noted.
        </p>
      </>
    ),
  },
  {
    id: 'shipping-returns',
    title: 'Shipping & Returns',
    content: (
      <>
        <p>
          Free Standard shipping on orders over £150.
          <br />
          £10 Standard delivery fee on orders under £150.
          <br />
          £14 Express delivery fee.
        </p>
        <p>
          <strong>Free Returns within the UK on full-priced items only*</strong>
        </p>
        <p>
          Standard Delivery time is approximately 3-5 business days within the
          UK. Express Delivery time is approximately 1-3 business days within
          the UK.
        </p>
      </>
    ),
  },
  {
    id: 'materials',
    title: 'Materials',
    content: (
      <>
        <p>
          Engineered from technical performance fabrics selected for
          breathability, stretch recovery, and long-distance durability.
        </p>
      </>
    ),
  },
] as const;

export const PRODUCT_TECHNICAL_SECTIONS = [
  {
    id: 'technical',
    title: 'Technical',
    content: (
      <>
        <p>
          Two-piece 3D pattern construction with reduced seam length and a
          modular-ready design language developed for training and racing.
        </p>
      </>
    ),
  },
  {
    id: 'specifications',
    title: 'Specifications',
    content: (
      <>
        <p>
          Product-specific SKU and variant information is shown on each product
          detail page because it changes with the selected Shopify variant.
        </p>
      </>
    ),
  },
] as const;

export const PRODUCT_LIST_INFORMATION_SECTIONS = [
  ...PRODUCT_INFORMATION_SECTIONS,
  ...PRODUCT_TECHNICAL_SECTIONS,
] as const;
