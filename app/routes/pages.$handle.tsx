import {redirect, useLoaderData} from 'react-router';
import type {Route} from './+types/pages.$handle';
import {InfoPage} from '~/components/InfoPage';
import {getInfoPage} from '~/data/info-pages';
import {pageMeta} from '~/lib/seo';

export const meta: Route.MetaFunction = ({data}) => {
  if (!data)
    return [
      {title: 'Page unavailable | TENTH Athletic'},
      {name: 'robots', content: 'noindex'},
    ];
  return pageMeta({
    title: `${data.title} | TENTH Athletic`,
    description: data.description,
    path: `/pages/${data.handle}`,
  });
};

export function loader({params}: Route.LoaderArgs) {
  const page = params.handle && getInfoPage(params.handle);
  if (!page) return redirect('/coming-soon');
  return {
    handle: params.handle,
    title: page.title,
    description: page.description,
  };
}

export default function Page() {
  const data = useLoaderData<typeof loader>();
  const page = getInfoPage(data.handle);
  if (!page) throw new Response('Not Found', {status: 404});
  return (
    <InfoPage title={page.title} wide={page.wide}>
      {page.content}
    </InfoPage>
  );
}
