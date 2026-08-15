import {Image} from '@shopify/hydrogen';

type EditorialImage = {
  altText?: string | null;
  height?: number | null;
  id?: string | null;
  url: string;
  width?: number | null;
};

export type ProductEditorialBlock = {
  body: string;
  heading: string;
  id: string;
  image: EditorialImage;
};

export function ProductEditorialContent({
  blocks,
}: {
  blocks: ReadonlyArray<ProductEditorialBlock>;
}) {
  if (blocks.length !== 2) {
    throw new Error(
      `Product editorial content requires exactly two blocks; received ${blocks.length}.`,
    );
  }

  return (
    <section
      aria-label="Product description"
      className="product-editorial-content"
    >
      {blocks.map((block, index) => (
        <article
          className={`product-editorial-block${
            index % 2 === 1 ? ' product-editorial-block--reverse' : ''
          }`}
          key={block.id}
        >
          <div className="product-editorial-media">
            <Image
              alt={block.image.altText || block.heading}
              data={block.image}
              sizes="(min-width: 48em) 50vw, 100vw"
            />
          </div>
          <div className="product-editorial-copy">
            <h2>{block.heading}</h2>
            {block.body.split('\n').map((paragraph) => (
              <p key={`${block.id}-${paragraph}`}>{paragraph}</p>
            ))}
          </div>
        </article>
      ))}
    </section>
  );
}
