import type {
  CollectionItemFragment,
  ProductItemFragment,
} from 'storefrontapi.generated';

type ProductCardFragment = CollectionItemFragment | ProductItemFragment;

export function filterProductList<T extends ProductCardFragment>(
  products: T[],
  filters: {
    sizes: string[];
    fits: string[];
  },
) {
  return products.filter((product) => {
    if (!matchesVariantOption(product, 'Size', filters.sizes)) {
      return false;
    }

    if (!matchesVariantOption(product, 'Fit', filters.fits)) {
      return false;
    }

    return true;
  });
}

function matchesVariantOption(
  product: ProductCardFragment,
  optionName: string,
  selectedValues: string[],
) {
  if (selectedValues.length === 0) {
    return true;
  }

  return product.variants.nodes.some((variant) =>
    variant.selectedOptions.some(
      (option) =>
        option.name.trim().toLowerCase() === optionName.toLowerCase() &&
        selectedValues.includes(option.value),
    ),
  );
}
