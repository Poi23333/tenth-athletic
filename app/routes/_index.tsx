import type {Route} from './+types/_index';
import {ComingSoon} from '~/components/ComingSoon';

export const meta: Route.MetaFunction = () => [
  {title: 'Tenth Athletic — Coming soon'},
  {
    name: 'description',
    content: 'Tenth Athletic is coming soon.',
  },
  {name: 'robots', content: 'noindex, nofollow'},
];

export default function Homepage() {
  return <ComingSoon />;
}
