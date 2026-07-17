export function ProductEditorialContent({html}: {html: string}) {
  if (!html) return null;

  return (
    <section
      aria-label="Product description"
      className="product-editorial-content"
      dangerouslySetInnerHTML={{__html: html}}
    />
  );
}
