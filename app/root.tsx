import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from 'react-router';
import favicon from '~/assets/favicon.svg';
import appStyles from '~/styles/app.css?url';
import tailwindStyles from '~/styles/tailwind.css?url';
import resetStyles from '~/styles/reset.css?url';
import comingSoonStyles from '~/styles/coming-soon.css?url';
import navigationStyles from '~/styles/launch-header.css?url';
import {LaunchHeader} from '~/components/LaunchHeader';

export function links() {
  return [{rel: 'icon', type: 'image/svg+xml', href: favicon}];
}

export function Layout({children}: {children?: React.ReactNode}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href={tailwindStyles} />
        <link rel="stylesheet" href={resetStyles} />
        <link rel="stylesheet" href={appStyles} />
        <link rel="stylesheet" href={comingSoonStyles} />
        <link rel="stylesheet" href={navigationStyles} />
        <Meta />
        <Links />
      </head>
      <body>
        <LaunchHeader />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  const status = isRouteErrorResponse(error) ? error.status : 500;
  const message =
    status === 404
      ? 'Page not found.'
      : 'The page could not be loaded. Please try again later.';

  return (
    <main>
      <h1>{status}</h1>
      <p>{message}</p>
      <a href="/">Back to home</a>
    </main>
  );
}
