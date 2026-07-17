import conditionHeat from '~/assets/product/auralite/condition-heat.svg';
import fitContour from '~/assets/product/auralite/fit-contour.svg';
import precisionCut from '~/assets/product/auralite/precision-cut.svg';
import targetedAirflow from '~/assets/product/auralite/targeted-airflow.svg';
import ultralightConstruction from '~/assets/product/auralite/ultralight-construction.svg';
import {AURALITE_PRODUCT_DETAILS} from '~/data/productDetails';

const FEATURE_ICONS = {
  ultralight: ultralightConstruction,
  airflow: targetedAirflow,
  precision: precisionCut,
} as const;

export function ProductFeatureIndex() {
  return (
    <section className="product-feature-index" aria-label="Product features">
      <div className="product-feature-index-head">
        <div className="product-feature-summary">
          <img alt="" aria-hidden="true" src={fitContour} />
          <div>
            <span className="product-feature-kicker">Fit</span>
            <strong>Race. Contour</strong>
          </div>
        </div>
        <div className="product-feature-summary">
          <img alt="" aria-hidden="true" src={conditionHeat} />
          <div>
            <span className="product-feature-kicker">Condition Index</span>
            <strong>Heat / High Output</strong>
          </div>
        </div>
      </div>

      <div className="product-feature-list">
        {AURALITE_PRODUCT_DETAILS.highlights.map((feature) => (
          <article className="product-feature-row" key={feature.id}>
            <img
              alt=""
              aria-hidden="true"
              src={FEATURE_ICONS[feature.id]}
            />
            <div>
              <h2>{feature.title}</h2>
              <p className="product-feature-subtitle">{feature.subtitle}</p>
              <p>{feature.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
