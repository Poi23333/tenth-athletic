import {useState} from 'react';

type SizeGuideUnit = 'cm' | 'in';

type SizeGuideValue = number | [number, number];

const SIZE_GUIDE_COLUMNS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;

const SIZE_GUIDE_ROWS: Array<{
  label: string;
  values: SizeGuideValue[];
}> = [
  {
    label: 'BUST',
    values: [
      32.3,
      [32.7, 34.6],
      [35, 37],
      [37.4, 39.4],
      [39.8, 42.9],
      [43.4, 46.5],
    ],
  },
  {
    label: 'WAIST',
    values: [
      26.4,
      [26.8, 28.7],
      [29.1, 31.1],
      [31.5, 33.5],
      [33.9, 37.4],
      [37.8, 41.3],
    ],
  },
  {
    label: 'HIP',
    values: [
      35.4,
      [35.8, 37.8],
      [38.2, 40.2],
      [40.6, 42.5],
      [42.9, 45.3],
      [45.7, 48],
    ],
  },
];

function formatSizeGuideNumber(value: number) {
  return Number(value.toFixed(1)).toString();
}

function toCentimeters(value: number) {
  return value * 2.54;
}

function formatSizeGuideValue(value: SizeGuideValue, unit: SizeGuideUnit) {
  const convert = unit === 'cm' ? toCentimeters : (entry: number) => entry;

  if (Array.isArray(value)) {
    return `${formatSizeGuideNumber(convert(value[0]))} - ${formatSizeGuideNumber(
      convert(value[1]),
    )}`;
  }

  return formatSizeGuideNumber(convert(value));
}

function SizeGuideTable() {
  const [unit, setUnit] = useState<SizeGuideUnit>('cm');

  return (
    <section className="size-guide" aria-label="Women's apparel size guide">
      <div className="size-guide-header">
        <div>
          <h3 className="size-guide-title">Size Guide - Womens Apparel</h3>
          <p className="size-guide-description">
            Your body measurements in {unit === 'cm' ? 'centimeters' : 'inches'}
          </p>
        </div>
        <div
          className="size-guide-toggle"
          role="group"
          aria-label="Size guide units"
        >
          <button
            aria-pressed={unit === 'cm'}
            className={`size-guide-toggle-button${
              unit === 'cm' ? ' is-active' : ''
            }`}
            onClick={() => setUnit('cm')}
            type="button"
          >
            Centimeters
          </button>
          <button
            aria-pressed={unit === 'in'}
            className={`size-guide-toggle-button${
              unit === 'in' ? ' is-active' : ''
            }`}
            onClick={() => setUnit('in')}
            type="button"
          >
            Inches
          </button>
        </div>
      </div>

      <div className="size-guide-table-wrap">
        <table className="size-guide-table">
          <thead>
            <tr>
              <th scope="col" />
              {SIZE_GUIDE_COLUMNS.map((column) => (
                <th key={column} scope="col">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SIZE_GUIDE_ROWS.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                {row.values.map((value, index) => (
                  <td key={`${row.label}-${SIZE_GUIDE_COLUMNS[index]}`}>
                    {formatSizeGuideValue(value, unit)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export const PRODUCT_INFORMATION_SECTIONS = [
  {
    id: 'size-fit',
    title: 'Size & Fit',
    content: <SizeGuideTable />,
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
