export type ProductSizeOption = {
  name: string;
  available: boolean;
};

type ProductWithSizeVariants = {
  options: Array<{
    name: string;
    optionValues: Array<{name: string}>;
  }>;
  variants: {
    nodes: Array<{
      availableForSale: boolean;
      quantityAvailable?: number | null;
      selectedOptions: Array<{name: string; value: string}>;
    }>;
  };
};

export function getProductSizeOptions(
  product: ProductWithSizeVariants,
): ProductSizeOption[] {
  const sizeOption = product.options.find(
    (option) => option.name.trim().toLowerCase() === 'size',
  );

  if (!sizeOption) return [];

  const availabilityBySize = new Map<string, boolean>();

  for (const variant of product.variants.nodes) {
    const sizeValue = variant.selectedOptions.find(
      (option) => option.name.trim().toLowerCase() === 'size',
    )?.value;

    if (!sizeValue) continue;

    const isAvailable =
      typeof variant.quantityAvailable === 'number'
        ? variant.quantityAvailable > 0
        : variant.availableForSale;

    availabilityBySize.set(
      sizeValue,
      Boolean(availabilityBySize.get(sizeValue)) || isAvailable,
    );
  }

  return sizeOption.optionValues.map((value) => ({
    name: value.name,
    available: availabilityBySize.get(value.name) ?? false,
  }));
}
