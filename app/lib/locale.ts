import type {CountryCode, LanguageCode} from '@shopify/hydrogen/storefront-api-types';
import {
  DEFAULT_REGION,
  getRegionByCountry,
  getRegionById,
  type Region,
  type RegionId,
} from '~/data/regions';

export const LOCALE_COOKIE = 'tenth_locale';
export const GEO_BANNER_DISMISS_COOKIE = 'tenth_geo_banner_dismissed';
export const DEBUG_COUNTRY_HEADER = 'X-Debug-Country';

export type I18nLocale = {
  language: LanguageCode;
  country: CountryCode;
};

function parseCookies(cookieHeader: string | null): Record<string, string> {
  if (!cookieHeader) return {};

  return cookieHeader.split(';').reduce<Record<string, string>>((acc, part) => {
    const [rawKey, ...rest] = part.trim().split('=');
    if (!rawKey) return acc;
    acc[rawKey] = decodeURIComponent(rest.join('=') || '');
    return acc;
  }, {});
}

export function getRegionIdFromRequest(request: Request): RegionId {
  const cookies = parseCookies(request.headers.get('Cookie'));
  const region = getRegionById(cookies[LOCALE_COOKIE]);
  return (region ?? DEFAULT_REGION).id;
}

export function getCurrentRegionFromRequest(request: Request): Region {
  return getRegionById(getRegionIdFromRequest(request)) ?? DEFAULT_REGION;
}

export function getLocaleFromRequest(request: Request): I18nLocale {
  const region = getCurrentRegionFromRequest(request);
  return {
    language: 'EN',
    country: region.countryCode,
  };
}

export function getGeoCountry(request: Request): CountryCode | null {
  const url = new URL(request.url);
  const debugFromQuery = url.searchParams.get('debugCountry');
  const debugCountry =
    request.headers.get(DEBUG_COUNTRY_HEADER) || debugFromQuery;
  if (debugCountry) {
    return debugCountry.trim().toUpperCase() as CountryCode;
  }

  // Cloudflare / Oxygen request property (production)
  const cfCountry = (request as Request & {cf?: {country?: string}}).cf
    ?.country;
  if (cfCountry && cfCountry !== 'XX' && cfCountry !== 'T1') {
    return cfCountry.toUpperCase() as CountryCode;
  }

  // Headers Oxygen / Cloudflare may provide when cf object is unavailable
  for (const headerName of [
    'oxygen-buyer-country',
    'cf-ipcountry',
    'cloudfront-viewer-country',
  ]) {
    const value = request.headers.get(headerName);
    if (value && value !== 'XX' && value !== 'T1') {
      return value.trim().toUpperCase() as CountryCode;
    }
  }

  return null;
}

export function resolveRegionForGeo(
  countryCode: string | null | undefined,
): Region | null {
  return getRegionByCountry(countryCode);
}

export function isGeoBannerDismissed(request: Request): boolean {
  const cookies = parseCookies(request.headers.get('Cookie'));
  return cookies[GEO_BANNER_DISMISS_COOKIE] === '1';
}

export function createLocaleCookieHeader(regionId: RegionId): string {
  const maxAge = 60 * 60 * 24 * 365;
  return `${LOCALE_COOKIE}=${encodeURIComponent(regionId)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

/** Session cookie — no Max-Age so it expires when the browser session ends. */
export function createGeoBannerDismissCookieHeader(): string {
  return `${GEO_BANNER_DISMISS_COOKIE}=1; Path=/; SameSite=Lax`;
}

export function getSafeReturnTo(value: FormDataEntryValue | null, requestUrl: string): string {
  const fallback = new URL(requestUrl).pathname || '/';
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) {
    return fallback;
  }
  return value;
}
