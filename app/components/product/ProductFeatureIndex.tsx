import {getProductFeaturePreset} from '~/data/productDetails';

export function ProductFeatureIndex({productType}: {productType: string}) {
  const preset = getProductFeaturePreset(productType);

  return (
    <section className="product-feature-index" aria-label="Product features">
      <div className="product-feature-index-head">
        {preset.summaries.map((summary) => (
          <div className="product-feature-summary" key={summary.kicker}>
            <img alt="" aria-hidden="true" src={summary.icon} />
            <div>
              <span className="product-feature-kicker">{summary.kicker}</span>
              <strong>{summary.value}</strong>
            </div>
          </div>
        ))}
      </div>

      <div className="product-feature-list">
        {preset.highlights.map((feature) => (
          <article className="product-feature-row" key={feature.id}>
            <img alt="" aria-hidden="true" src={feature.icon} />
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
