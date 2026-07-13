import type {CountryCode} from '@shopify/hydrogen/storefront-api-types';

export type RegionId =
  | 'gb'
  | 'eu'
  | 'us'
  | 'hk'
  | 'sg'
  | 'jp'
  | 'kr'
  | 'au'
  | 'ca'
  | 'tw'
  | 'row';

export type Region = {
  id: RegionId;
  label: string;
  confirmLabel: string;
  shortLabel: string;
  countryCode: CountryCode;
  currencyCode: string;
  currencySymbol: string;
  /** Countries used for geo → market mapping. Defaults to [countryCode]. */
  countries?: CountryCode[];
  isDefault?: boolean;
};

/** Europe market countries (aligned with Admin Markets · 17 regions). */
export const EUROPE_COUNTRIES = [
  'DE',
  'FR',
  'IT',
  'ES',
  'NL',
  'BE',
  'AT',
  'PT',
  'SE',
  'DK',
  'FI',
  'IE',
  'PL',
  'CZ',
  'RO',
  'HU',
  'GR',
] as const satisfies readonly CountryCode[];

export const REGIONS: readonly Region[] = [
  {
    id: 'gb',
    label: 'United Kingdom',
    confirmLabel: 'United Kingdom',
    shortLabel: 'UK',
    countryCode: 'GB',
    currencyCode: 'GBP',
    currencySymbol: '£',
    isDefault: true,
  },
  {
    id: 'eu',
    label: 'Europe',
    confirmLabel: 'Europe',
    shortLabel: 'EU',
    countryCode: 'DE',
    currencyCode: 'EUR',
    currencySymbol: '€',
    countries: [...EUROPE_COUNTRIES],
  },
  {
    id: 'us',
    label: 'United States',
    confirmLabel: 'United States',
    shortLabel: 'US',
    countryCode: 'US',
    currencyCode: 'USD',
    currencySymbol: '$',
  },
  {
    id: 'hk',
    label: 'Hong Kong SAR',
    confirmLabel: 'Hong Kong SAR',
    shortLabel: 'HK',
    countryCode: 'HK',
    currencyCode: 'HKD',
    currencySymbol: '$',
  },
  {
    id: 'sg',
    label: 'Singapore',
    confirmLabel: 'Singapore',
    shortLabel: 'SG',
    countryCode: 'SG',
    currencyCode: 'SGD',
    currencySymbol: '$',
  },
  {
    id: 'jp',
    label: 'Japan',
    confirmLabel: 'Japan',
    shortLabel: 'JP',
    countryCode: 'JP',
    currencyCode: 'JPY',
    currencySymbol: '¥',
  },
  {
    id: 'kr',
    label: 'South Korea',
    confirmLabel: 'South Korea',
    shortLabel: 'KR',
    countryCode: 'KR',
    currencyCode: 'KRW',
    currencySymbol: '₩',
  },
  {
    id: 'au',
    label: 'Australia',
    confirmLabel: 'Australia',
    shortLabel: 'AU',
    countryCode: 'AU',
    currencyCode: 'AUD',
    currencySymbol: '$',
  },
  {
    id: 'ca',
    label: 'Canada',
    confirmLabel: 'Canada',
    shortLabel: 'CA',
    countryCode: 'CA',
    currencyCode: 'CAD',
    currencySymbol: '$',
  },
  {
    id: 'tw',
    label: 'Taiwan Region',
    confirmLabel: 'Taiwan Region',
    shortLabel: 'TW',
    countryCode: 'TW',
    currencyCode: 'TWD',
    currencySymbol: '$',
  },
  {
    id: 'row',
    label: 'Rest of the World',
    confirmLabel: 'International',
    shortLabel: 'International',
    // Representative country for @inContext; must belong to the ROW market in Admin.
    countryCode: 'NZ',
    currencyCode: 'GBP',
    currencySymbol: '£',
  },
] as const;

export const DEFAULT_REGION =
  REGIONS.find((region) => region.isDefault) ?? REGIONS[0];

export function getRegionById(id: string | null | undefined): Region | undefined {
  if (!id) return undefined;
  return REGIONS.find((region) => region.id === id);
}

export function getRegionCountries(region: Region): CountryCode[] {
  return region.countries ?? [region.countryCode];
}

/**
 * Resolve a geo country to a market. Non-ROW markets are matched first;
 * anything else maps to Rest of the World.
 */
export function getRegionByCountry(
  countryCode: string | null | undefined,
): Region | null {
  if (!countryCode) return null;

  const normalized = countryCode.toUpperCase();

  for (const region of REGIONS) {
    if (region.id === 'row') continue;
    if (getRegionCountries(region).includes(normalized as CountryCode)) {
      return region;
    }
  }

  return getRegionById('row') ?? null;
}

export function formatRegionListLabel(region: Region): string {
  return `${region.label} [ ${region.currencyCode} ${region.currencySymbol} ]`;
}

export function formatRegionNavLabel(region: Region): string {
  return `${region.shortLabel} / ${region.currencyCode} ${region.currencySymbol}`;
}

export function formatConfirmBody(region: Region): string {
  return `You're moving to the ${region.confirmLabel} store. Your current cart is linked to your present location and will be cleared when you switch.`;
}

export function formatConfirmSwitchLabel(region: Region): string {
  return `Switch to ${region.shortLabel}/English`;
}

export function formatGeoBannerMessage(
  currentRegion: Region,
  suggestedRegion: Region,
): string {
  return `You're currently viewing our ${currentRegion.label} store, would you prefer to shop on our ${suggestedRegion.label} site?`;
}
