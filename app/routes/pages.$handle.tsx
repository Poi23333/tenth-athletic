import {useLoaderData} from 'react-router';
import type {Route} from './+types/pages.$handle';
import {InfoPage} from '~/components/InfoPage';
import {getInfoPage} from '~/data/info-pages';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

export const meta: Route.MetaFunction = ({data}) => {
  const title =
    data?.type === 'info'
      ? data.title
      : data?.type === 'shopify'
        ? data.page.title
        : '';

  return [{title: title ? `Tenth Athletic | ${title}` : 'Tenth Athletic'}];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, request, params}: Route.LoaderArgs) {
  if (!params.handle) {
    throw new Error('Missing page handle');
  }

  const infoPage = getInfoPage(params.handle);
  if (infoPage) {
    return {
      type: 'info' as const,
      handle: params.handle,
      title: infoPage.title,
      wide: infoPage.wide ?? false,
    };
  }

  const [{page}] = await Promise.all([
    context.storefront.query(PAGE_QUERY, {
      variables: {
        handle: params.handle,
      },
    }),
  ]);

  if (!page) {
    throw new Response('Not Found', {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle: params.handle, data: page});

  return {
    type: 'shopify' as const,
    page,
  };
}

function loadDeferredData(_args: Route.LoaderArgs) {
  return {};
}

export default function Page() {
  const data = useLoaderData<typeof loader>();

  if (data.type === 'info') {
    const infoPage = getInfoPage(data.handle);
    if (!infoPage) {
      throw new Response('Not Found', {status: 404});
    }

    return (
      <InfoPage title={infoPage.title} wide={infoPage.wide}>
        {infoPage.content}
      </InfoPage>
    );
  }

  return (
    <div className="page">
      <header>
        <h1>{data.page.title}</h1>
      </header>
      <main dangerouslySetInnerHTML={{__html: data.page.body}} />
    </div>
  );
}

const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      handle
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
` as const;
