type MoneyLike = {
  amount: string;
  currencyCode: string;
};

export function formatAccountStatus(value?: string | null) {
  if (!value) return null;

  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function formatAccountDate(value?: string | null) {
  if (!value) return '';

  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function lineItemTotal(
  price?: MoneyLike | null,
  quantity = 0,
  discount?: MoneyLike | null,
) {
  if (!price) return null;

  const total = Number(price.amount) * quantity - Number(discount?.amount ?? 0);

  return {
    amount: Math.max(total, 0).toFixed(2),
    currencyCode: price.currencyCode,
  };
}
