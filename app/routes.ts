import {flatRoutes} from '@react-router/fs-routes';
import {type RouteConfig} from '@react-router/dev/routes';
import {hydrogenRoutes} from '@shopify/hydrogen';

// Enable commerce utilities while catalog and editorial pages remain Coming soon.
const enabled = new Set([
  'routes/_index.tsx',
  'routes/race.tsx',
  'routes/coming-soon.tsx',
  'routes/$.tsx',
  'routes/cart.tsx',
  'routes/cart.$lines.tsx',
  'routes/wishlist.tsx',
  'routes/search.tsx',
  'routes/api.wishlist.tsx',
  'routes/api.wishlist-products.tsx',
  'routes/account.tsx',
  'routes/account_.login.tsx',
  'routes/account_.logout.tsx',
  'routes/account_.authorize.tsx',
  'routes/locale.tsx',
  'routes/discount.$code.tsx',
]);

export default hydrogenRoutes(
  (await flatRoutes()).filter((entry) => enabled.has(entry.file)),
) satisfies RouteConfig;
