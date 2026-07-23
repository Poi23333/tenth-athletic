/** Convert absolute Shopify storefront menu URLs into relative paths for the app. */
export function normalizeShopifyMenuUrl({
  primaryDomainUrl,
  publicStoreDomain,
  url,
}: {
  primaryDomainUrl: string;
  publicStoreDomain: string;
  url: string;
}) {
  const isStorefrontUrl =
    url.includes('myshopify.com') ||
    url.includes(publicStoreDomain) ||
    url.includes(primaryDomainUrl);

  if (!isStorefrontUrl) return url;

  const parsedUrl = new URL(url);
  return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
}

/** Column headings in Shopify menus often use `#` (or `/#`) as a non-link URL. */
export function isPlaceholderMenuUrl(url: string | null | undefined) {
  if (!url) return true;

  try {
    const {pathname, hash, search} = new URL(url, 'https://placeholder.local');
    const path = pathname.replace(/\/+$/, '') || '/';
    return (path === '/' || path === '') && !search && (hash === '' || hash === '#');
  } catch {
    return url === '#' || url.endsWith('/#') || url.trim() === '';
  }
}

/** Parent "Shop All" collection handles for Man / Woman. */
export const GENDER_SHOP_ALL_HANDLES = {
  man: 'man-all',
  woman: 'woman',
} as const;

export type GenderMenuKey = keyof typeof GENDER_SHOP_ALL_HANDLES;

type MenuWithCollectionLinks = {
  items?: Array<{
    items?: Array<{url?: string | null} | null> | null;
  } | null> | null;
} | null;

export function getGenderShopAllHandle(gender: GenderMenuKey) {
  return GENDER_SHOP_ALL_HANDLES[gender];
}

/** Product tag used to aggregate all products for a gender Shop All page. */
export function getGenderShopAllProductTag(handle: string) {
  if (handle === GENDER_SHOP_ALL_HANDLES.man) return 'Man';
  if (handle === GENDER_SHOP_ALL_HANDLES.woman) return 'Woman';
  return null;
}

/** Infer Man / Woman from a collection handle naming convention. */
export function getGenderFromCollectionHandle(
  handle?: string | null,
): GenderMenuKey | null {
  if (!handle) return null;
  if (handle === 'man' || handle === 'man-all' || handle.startsWith('man-')) {
    return 'man';
  }
  if (
    handle === 'woman' ||
    handle === 'woman-all' ||
    handle.startsWith('woman-')
  ) {
    return 'woman';
  }
  return null;
}

/** Infer Man / Woman from product tags used by Shop All aggregation. */
export function getGenderFromProductTags(
  tags: string[] | null | undefined,
): GenderMenuKey | null {
  if (!tags?.length) return null;

  const normalized = new Set(tags.map((tag) => tag.trim().toLowerCase()));
  const hasMan = normalized.has('man');
  const hasWoman = normalized.has('woman');

  if (hasMan && !hasWoman) return 'man';
  if (hasWoman && !hasMan) return 'woman';
  return null;
}

/** Extract a collection handle from a Shopify menu item URL. */
export function getCollectionHandleFromMenuItem({
  url,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  url?: string | null;
  primaryDomainUrl: string;
  publicStoreDomain: string;
}) {
  if (!url || isPlaceholderMenuUrl(url)) return null;

  const path = normalizeShopifyMenuUrl({
    primaryDomainUrl,
    publicStoreDomain,
    url,
  });
  const match = path.match(/^\/collections\/([^/?#]+)/i);
  return match?.[1] ?? null;
}

/** Resolve gender when a collection is listed under man-menu / woman-menu. */
export function getGenderFromMenus({
  handle,
  manMenu,
  womanMenu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  handle: string;
  manMenu?: MenuWithCollectionLinks;
  womanMenu?: MenuWithCollectionLinks;
  primaryDomainUrl: string;
  publicStoreDomain: string;
}): GenderMenuKey | null {
  if (
    menuContainsCollectionHandle({
      menu: manMenu,
      handle,
      primaryDomainUrl,
      publicStoreDomain,
    })
  ) {
    return 'man';
  }

  if (
    menuContainsCollectionHandle({
      menu: womanMenu,
      handle,
      primaryDomainUrl,
      publicStoreDomain,
    })
  ) {
    return 'woman';
  }

  return null;
}

function menuContainsCollectionHandle({
  menu,
  handle,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu?: MenuWithCollectionLinks;
  handle: string;
  primaryDomainUrl: string;
  publicStoreDomain: string;
}) {
  for (const category of menu?.items ?? []) {
    for (const item of category?.items ?? []) {
      const itemHandle = getCollectionHandleFromMenuItem({
        url: item?.url,
        primaryDomainUrl,
        publicStoreDomain,
      });
      if (itemHandle === handle) return true;
    }
  }
  return false;
}
