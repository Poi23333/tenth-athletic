import {useLoaderData} from 'react-router';
import type {Route} from './+types/_index';
import {MockShopNotice} from '~/components/MockShopNotice';
import homeIllustration from '~/assets/home-mushrooms-cactus.svg';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Tenth Athletic — Performance without conformity'}];
};

export async function loader({context}: Route.LoaderArgs) {
  return {
    isShopLinked: Boolean(context.env.PUBLIC_STORE_DOMAIN),
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="home">
      {data.isShopLinked ? null : <MockShopNotice />}
      <section className="home-hero" aria-label="Brand introduction">
        <div className="home-hero-illustration">
          <img
            src={homeIllustration}
            alt=""
            width={690}
            height={630}
            decoding="async"
          />
        </div>
        <div className="home-hero-content">
          <p className="home-hero-tagline">
            Wild movement. Quiet mind.
            <br />
            Quiet performance for life around distance.
          </p>
          <h1 className="home-hero-heading">Performance without conformity</h1>
          <p className="home-hero-body">
            Tenth athletic believes running is not a performance for attention,
            but a quiet way of building discipline, identity and belonging. We
            obsess over fabric, fit, friction, weather and distance because
            performance begins as a private experience before it becomes a
            public result. We run outside the old mould — not alone, but
            together, through quiet miles and familiar faces.
          </p>
        </div>
      </section>
    </div>
  );
}
