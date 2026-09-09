import {redirect} from 'react-router';
import type {Route} from './+types/$';

export function loader({request}: Route.LoaderArgs) {
  const {pathname} = new URL(request.url);
  if (/^\/(collections|products|pages|blogs|policies)(\/|$)/.test(pathname)) {
    return redirect('/coming-soon');
  }
  throw new Response(null, {status: 404});
}

export default function UnavailableRoute() {
  return null;
}
