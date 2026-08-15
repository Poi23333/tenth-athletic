import {data} from 'react-router';
import type {Route} from './+types/api.wishlist';
import {
  CUSTOMER_WISHLIST_MUTATION,
  CUSTOMER_WISHLIST_QUERY,
} from '~/graphql/customer-account/CustomerWishlist';

const PRODUCT_GID_PATTERN = /^gid:\/\/shopify\/Product\/\d+$/;

export async function loader({context}: Route.LoaderArgs) {
  if (!(await context.customerAccount.isLoggedIn())) {
    return data({authenticated: false, productIds: []}, {status: 401});
  }

  const {data: result, errors} = await context.customerAccount.query(
    CUSTOMER_WISHLIST_QUERY,
  );

  if (errors?.length || !result?.customer) {
    throw new Response(errors?.[0]?.message ?? 'Unable to load wishlist', {
      status: 502,
    });
  }

  return {
    authenticated: true,
    productIds: parseProductIds(result.customer.wishlist?.value),
  };
}

export async function action({context, request}: Route.ActionArgs) {
  if (request.method !== 'PUT') {
    return data({error: 'Method not allowed'}, {status: 405});
  }

  if (!(await context.customerAccount.isLoggedIn())) {
    return data({error: 'Authentication required'}, {status: 401});
  }

  const body = (await request.json()) as {productIds?: unknown};
  const productIds = validateProductIds(body.productIds);
  const {data: currentData, errors: currentErrors} =
    await context.customerAccount.query(CUSTOMER_WISHLIST_QUERY);

  if (currentErrors?.length || !currentData?.customer) {
    return data(
      {error: currentErrors?.[0]?.message ?? 'Unable to read wishlist'},
      {status: 502},
    );
  }

  const {data: result, errors} = await context.customerAccount.mutate(
    CUSTOMER_WISHLIST_MUTATION,
    {
      variables: {
        metafields: [
          {
            ownerId: currentData.customer.id,
            namespace: 'custom',
            key: 'wishlist_products',
            type: 'list.product_reference',
            value: JSON.stringify(productIds),
            compareDigest: currentData.customer.wishlist?.compareDigest ?? null,
          },
        ],
      },
    },
  );

  const userError = result?.metafieldsSet?.userErrors?.[0];
  if (errors?.length || userError || !result?.metafieldsSet?.metafields?.[0]) {
    return data(
      {
        error:
          userError?.message ??
          errors?.[0]?.message ??
          'Unable to save wishlist',
      },
      {status: 409},
    );
  }

  return {productIds};
}

function parseProductIds(value: string | null | undefined) {
  if (!value) return [];
  return validateProductIds(JSON.parse(value));
}

function validateProductIds(value: unknown) {
  if (!Array.isArray(value)) {
    throw new Response('productIds must be an array', {status: 400});
  }

  const productIds = [...new Set(value)];
  if (
    productIds.length > 100 ||
    productIds.some(
      (productId) =>
        typeof productId !== 'string' || !PRODUCT_GID_PATTERN.test(productId),
    )
  ) {
    throw new Response('Invalid productIds', {status: 400});
  }

  return productIds as string[];
}
