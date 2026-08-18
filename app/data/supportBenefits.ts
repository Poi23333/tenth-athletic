export type SupportBenefit = {
  description: string;
  image: string;
  title: string;
};

export const COMPLIMENTARY_DELIVERY: SupportBenefit = {
  description:
    'On orders over £150. International shipping is calculated at checkout.',
  image: '/images/cart/complimentary-delivery.svg',
  title: 'Complimentary UK Delivery',
};

export const RETURNS_30_DAYS: SupportBenefit = {
  description: 'Free within the UK. International return shipping applies.',
  image: '/images/cart/returns-30-days.svg',
  title: '30-Day Returns',
};

export const BACK_TO_DISTANCE_PROGRAMME: SupportBenefit = {
  description:
    "Damaged your equipment in an accident? We'll help get you back out there.",
  image: '/images/footer/详情-Back to Distance Programme.svg',
  title: 'Back to Distance Programme',
};

export const SAME_DAY_DISPATCH: SupportBenefit = {
  description: 'UK orders placed before 12 noon are dispatched the same day.',
  image: '/images/footer/详情-Same-Day Dispatch.svg',
  title: 'Same-Day Dispatch',
};

export const FOOTER_SUPPORT_BENEFITS = [
  COMPLIMENTARY_DELIVERY,
  SAME_DAY_DISPATCH,
  RETURNS_30_DAYS,
  BACK_TO_DISTANCE_PROGRAMME,
] as const;
