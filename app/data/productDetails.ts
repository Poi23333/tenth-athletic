import conditionHeat from '~/assets/product/auralite/condition-heat.svg';
import fitContour from '~/assets/product/auralite/fit-contour.svg';
import precisionCut from '~/assets/product/auralite/precision-cut.svg';
import targetedAirflow from '~/assets/product/auralite/targeted-airflow.svg';
import ultralightConstruction from '~/assets/product/auralite/ultralight-construction.svg';

export type ProductFeaturePreset = {
  summaries: ReadonlyArray<{
    icon: string;
    kicker: string;
    value: string;
  }>;
  highlights: ReadonlyArray<{
    description: string;
    icon: string;
    id: string;
    subtitle: string;
    title: string;
  }>;
};

const PERFORMANCE_TOP_PRESET: ProductFeaturePreset = {
  summaries: [
    {
      icon: fitContour,
      kicker: 'Fit',
      value: 'Race. Contour',
    },
    {
      icon: conditionHeat,
      kicker: 'Condition Index',
      value: 'Heat / High Output',
    },
  ],
  highlights: [
    {
      id: 'ultralight',
      icon: ultralightConstruction,
      title: 'Ultralight Construction',
      subtitle: 'Low Weight / Unrestricted Movement',
      description:
        'Engineered with reduced material, minimal construction, and lightweight components to minimise weight and support unrestricted movement.',
    },
    {
      id: 'airflow',
      icon: targetedAirflow,
      title: 'Targeted Airflow',
      subtitle: 'Ventilation / Heat Release',
      description:
        'Strategically positioned ventilation zones increase airflow where heat builds fastest, helping release excess heat without compromising overall structure.',
    },
    {
      id: 'precision',
      icon: precisionCut,
      title: 'Precision Cut',
      subtitle: 'Laser / Clean Construction',
      description:
        'Laser-cut components create precise edges, reduce unnecessary bulk, and enable clean integration of functional openings and construction details.',
    },
  ],
};

const PRODUCT_FEATURE_PRESETS: Record<string, ProductFeaturePreset> = {
  Tanks: PERFORMANCE_TOP_PRESET,
  'T-Shirt': PERFORMANCE_TOP_PRESET,
};

export function getProductFeaturePreset(productType: string) {
  const preset = PRODUCT_FEATURE_PRESETS[productType];

  if (!preset) {
    throw new Error(
      `No PDP feature-label preset is configured for Shopify product type "${productType}".`,
    );
  }

  return preset;
}
