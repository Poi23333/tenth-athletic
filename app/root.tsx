import {Links, Meta, Outlet, Scripts, ScrollRestoration} from 'react-router';
import favicon from '~/assets/favicon.svg';
import resetStyles from '~/styles/reset.css?url';
import comingSoonStyles from '~/styles/coming-soon.css?url';
import {ComingSoon} from '~/components/ComingSoon';

export function links() {
  return [{rel: 'icon', type: 'image/svg+xml', href: favicon}];
}

export function Layout({children}: {children?: React.ReactNode}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href={resetStyles} />
        <link rel="stylesheet" href={comingSoonStyles} />
        <Meta />
        <Links />
      </head>
      <body>
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
  return <ComingSoon />;
}
