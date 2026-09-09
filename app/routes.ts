import {index, route, type RouteConfig} from '@react-router/dev/routes';

export default [
  index('routes/_index.tsx'),
  route('race', 'routes/race.tsx'),
  route('coming-soon', 'routes/coming-soon.tsx'),
  route('*', 'routes/$.tsx'),
] satisfies RouteConfig;
