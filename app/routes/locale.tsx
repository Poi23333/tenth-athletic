import {data, redirect, type HeadersFunction} from 'react-router';
import type {Route} from './+types/locale';
import {getRegionById} from '~/data/regions';
import {
  createGeoBannerDismissCookieHeader,
  createLocaleCookieHeader,
  getSafeReturnTo,
} from '~/lib/locale';

export const headers: HeadersFunction = ({actionHeaders}) => actionHeaders;

async function clearHydrogenCache() {
  try {
    await caches.delete('hydrogen');
  } catch (error) {
    console.error('Failed to clear Hydrogen cache after locale switch', error);
  }
}

export async function action({request, context}: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = String(formData.get('intent') || '');
  const returnTo = getSafeReturnTo(formData.get('returnTo'), request.url);
  const headers = new Headers();

  if (intent === 'dismiss-banner') {
    headers.append('Set-Cookie', createGeoBannerDismissCookieHeader());
    return redirect(returnTo, {headers});
  }

  if (intent === 'switch') {
    const regionId = String(formData.get('regionId') || '');
    const region = getRegionById(regionId);

    if (!region) {
      throw data({message: `Unknown region: ${regionId}`}, {status: 400});
    }

    headers.append('Set-Cookie', createLocaleCookieHeader(region.id));

    // Clear cart when switching markets (cart is market-linked).
    const clearCartHeaders = context.cart.setCartId('');
    clearCartHeaders.forEach((value, key) => {
      if (key.toLowerCase() === 'set-cookie') {
        headers.append('Set-Cookie', value);
      } else {
        headers.set(key, value);
      }
    });

    await clearHydrogenCache();

    // Always land on homepage with a fresh document load (Form uses reloadDocument).
    headers.set('Cache-Control', 'no-store');
    return redirect('/', {headers});
  }

  throw data({message: `Unknown locale intent: ${intent}`}, {status: 400});
}

export async function loader() {
  return redirect('/');
}
