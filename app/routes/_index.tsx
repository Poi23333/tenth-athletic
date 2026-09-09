import {useEffect, useRef, useState} from 'react';
import {useLoaderData} from 'react-router';
import type {Route} from './+types/_index';
import {raceFaq} from '~/data/race-faq';
import {raceProgramme, raceSpecifications} from '~/data/race';
import raceStyles from '~/styles/race.css?url';
import mapboxStyles from 'mapbox-gl/dist/mapbox-gl.css?url';
import {RaceMap} from '~/components/RaceMap';

export const links: Route.LinksFunction = () => [
  {rel: 'stylesheet', href: mapboxStyles},
  {rel: 'stylesheet', href: raceStyles},
  {
    rel: 'preload',
    href: '/fonts/tenth-race.otf',
    as: 'font',
    type: 'font/otf',
    crossOrigin: 'anonymous',
  },
];
export const meta: Route.MetaFunction = () => [
  {title: 'TENTH FIELD CIRCUIT | Tenth Athletic'},
  {
    name: 'description',
    content:
      'One circuit. Two terrains. Your sequence. Discover TENTH FIELD CIRCUIT at Lee Valley VeloPark, London.',
  },
];

export async function loader({context}: Route.LoaderArgs) {
  const mapboxAccessToken = context.env.PUBLIC_MAPBOX_ACCESS_TOKEN?.trim();
  if (mapboxAccessToken && !mapboxAccessToken.startsWith('pk.')) {
    throw new Response(
      'PUBLIC_MAPBOX_ACCESS_TOKEN must be a public pk. token.',
      {status: 503},
    );
  }
  const {race} = await context.storefront.query(RACE_QUERY, {
    cache: context.storefront.CacheNone(),
  });
  const date = race?.startsAt?.value;
  if (!date || !Number.isFinite(Date.parse(date))) {
    throw new Response(
      'Race countdown is not configured. Set race_event / field-circuit → starts_at in Shopify Content → Metaobjects.',
      {status: 503},
    );
  }
  return {
    mapboxAccessToken: mapboxAccessToken || null,
    startsAt: date,
    serverNow: Date.now(),
    registrationUrl: race?.registrationUrl?.value,
    photographerUrl: race?.photographerUrl?.value,
  };
}

export function getCountdown(target: number, now: number) {
  const seconds = Math.max(0, Math.floor((target - now) / 1000));
  return [
    Math.floor(seconds / 86400),
    Math.floor(seconds / 3600) % 24,
    Math.floor(seconds / 60) % 60,
    seconds % 60,
  ];
}

function Countdown({
  startsAt,
  serverNow,
}: {
  startsAt: string;
  serverNow: number;
}) {
  const [now, setNow] = useState(serverNow);
  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [startsAt]);
  const labels = ['Days', 'Hours', 'Minutes', 'Seconds'];
  return (
    <div
      className="race-countdown"
      role="timer"
      aria-label="Time until TENTH FIELD CIRCUIT"
    >
      {getCountdown(Date.parse(startsAt), now).map((value, i) => (
        <div key={labels[i]}>
          <span className="race-countdown-value">
            {String(value).padStart(2, '0')}
          </span>
          <span className="race-countdown-label">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

function Answer({text}: {text: string}) {
  return (
    <>
      {text.split(/\n\s*\n/).map((block) => {
        const lines = block.split('\n');
        if (lines.every((line) => /^- /.test(line)))
          return (
            <ul key={block}>
              {lines.map((line) => (
                <li key={line}>{line.slice(2)}</li>
              ))}
            </ul>
          );
        if (lines.every((line) => /^\d+\. /.test(line)))
          return (
            <ol key={block}>
              {lines.map((line) => (
                <li key={line}>{line.replace(/^\d+\. /, '')}</li>
              ))}
            </ol>
          );
        return <p key={block}>{block}</p>;
      })}
    </>
  );
}

function FaqItem({
  question,
  answer,
  id,
}: {
  question: string;
  answer: string;
  id: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`product-accordion${open ? ' is-open' : ''}`}>
      <h4>
        <button
          className="product-accordion-trigger"
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen(!open)}
        >
          {question}
        </button>
      </h4>
      <div id={id} className="product-accordion-panel" aria-hidden={!open}>
        <div className="product-accordion-content">
          <Answer text={answer} />
        </div>
      </div>
    </div>
  );
}

function EntryLink({href, children}: {href?: string | null; children: string}) {
  if (!href)
    return (
      <>
        <button className="race-pill" disabled>
          {children}
        </button>
        <span className="race-entry-status">Applications not yet open</span>
      </>
    );
  return (
    <a className="race-pill" href={href}>
      {children}
    </a>
  );
}

export default function RacePage() {
  const hero = useRef<HTMLElement>(null);
  const [headerOnHero, setHeaderOnHero] = useState(true);
  useEffect(() => {
    const header = document.querySelector('.header');
    const banner = hero.current;
    if (!header || !banner) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setHeaderOnHero(
          banner.getBoundingClientRect().bottom >
            header.getBoundingClientRect().bottom,
        );
      });
    };
    const resize = new ResizeObserver(update);
    resize.observe(header);
    resize.observe(banner);
    window.addEventListener('scroll', update, {passive: true});
    update();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener('scroll', update);
    };
  }, []);
  const {
    startsAt,
    serverNow,
    registrationUrl,
    photographerUrl,
    mapboxAccessToken,
  } = useLoaderData<typeof loader>();
  return (
    <main className="race-page" data-header-on-hero={headerOnHero}>
      <section
        ref={hero}
        className="race-hero"
        aria-label="TENTH FIELD CIRCUIT"
      >
        <img
          className="race-hero-background"
          src="/images/race/field-circuit-hero.jpg"
          alt=""
          width="1835"
          height="1223"
        />
        <img
          className="race-hero-logo"
          src="/images/race/field-circuit-logo.png"
          alt="Field Circuit"
        />
      </section>
      <div className="race-layout">
        <div className="race-intro">
          <h1>
            ONE CIRCUIT.
            <br />
            TWO TERRAINS.
            <br />
            YOUR SEQUENCE.
          </h1>
          <EntryLink href={registrationUrl}>REGISTER</EntryLink>
          <div className="race-venue">
            <p>
              LEE VALLEY VELOPARK, LONDON
              <br />
              13:00–22:00
            </p>
            <p>
              INDIVIDUAL FIELD + COMMUNITY FIELD RELAY
              <br />
              £20 REFUNDABLE DEPOSIT
              <br />
              ELIGIBILITY / 18+
              <br />
              SPECTATORS FREE
            </p>
          </div>
          <img
            className="race-velopark"
            src="/images/race/velopark-wordmark.svg"
            alt="Lee Valley VeloPark Stratford"
            width="425"
            height="113"
          />
          <div className="race-accreditation">
            <EntryLink href={photographerUrl}>
              Community Photographer Accreditation
            </EntryLink>
            <p>
              Bringing a crew photographer?
              <br />
              Apply for accreditation
            </p>
          </div>
          <img
            className="race-sun"
            src="/images/race/terrain-sun.svg"
            alt=""
            width="378"
            height="378"
            loading="lazy"
          />
        </div>
        <div className="race-details">
          <Countdown startsAt={startsAt} serverNow={serverNow} />
          <div className="race-overview">
            <p>
              TENTH Field Circuit consists of two separate competitions on one
              shared Road and Trail circuit:
            </p>
            <p>
              01 / INDIVIDUAL FIELD An individual competition progressing
              through Field Qualifying and Grid TT to the night Final.
            </p>
            <p>
              02 / COMMUNITY FIELD RELAY A separate six-person team competition
              with its own timing, ranking and podium.
            </p>
          </div>
          <section className="race-format">
            <h2>01 / INDIVIDUAL FIELD</h2>
            <h3>8 LAPS TO QUALIFY.</h3>
            <p>All entrants compete under the same rules.</p>
            <p>Every athlete completes four Road laps and four Trail laps.</p>
            <p>
              Across Laps 01–07, athletes complete four Trail laps and three
              Road laps in an open sequence—the order is their decision.
            </p>
            <p>
              Lap 08 is Road only, bringing the field together for a clear
              sprint to the line.
            </p>
            <p>
              The highest-placed athletes advance directly to the night Final.
            </p>
            <p>
              LAPS 01–07 / OPEN SEQUENCE
              <br />4 TRAIL + 3 ROAD REQUIRED
            </p>
            <p>
              LAP 08 / FINAL ROAD LAP
              <br />
              TRAIL ENTRY CLOSED
            </p>
            <h3>ONE ROAD LOOP. THE ROAD TO POLE.</h3>
            <p>
              Before the Final, qualified athletes complete one full 660-metre
              Road loop against the clock in Grid TT.
            </p>
            <p>
              The results determine Final starting-grid positions only. The
              fastest athlete takes Pole Position.
            </p>
            <p>Grid TT times do not carry into the Final.</p>
            <p className="race-facts">
              1 ATHLETE AT A TIME
              <br />1 FULL ROAD LOOP
              <br />
              660 METRES
              <br />
              STARTING GRID ONLY
            </p>
            <h3>12 LAPS TO WIN.</h3>
            <p>The night Final resets the competition.</p>
            <p>Every finalist completes six Road laps and six Trail laps.</p>
            <p>
              Across Laps 01–11, athletes complete six Trail laps and five Road
              laps in an open sequence. Lap 12 is Road only, bringing the entire
              field onto the same surface for the final sprint.
            </p>
            <p>
              The first athlete across the finish line—having completed the
              required terrain count—wins the Individual Field.
            </p>
            <p className="race-facts">
              LAPS 01–11 / OPEN SEQUENCE
              <br />6 TRAIL + 5 ROAD REQUIRED
            </p>
            <p className="race-facts">
              LAP 12 / FINAL ROAD LAP
              <br />
              TRAIL ENTRY CLOSED
            </p>
          </section>
          <section className="race-format race-relay">
            <h2>02 / COMMUNITY FIELD RELAY</h2>
            <h3>SIX RUNNERS. ONE TEAM RESULT.</h3>
            <p>
              The Community Field Relay is a separate team competition. Its
              results do not affect qualification, Grid TT or starting positions
              for the Individual Field.
            </p>
            <p>Each team consists of six runners—three women and three men.</p>
            <p>
              Every runner completes one Road lap and one Trail lap, in either
              order, before passing the timing baton to the next teammate.
            </p>
            <p>
              Relay teams are timed and ranked independently, with a dedicated
              team podium.
            </p>
            <p className="race-facts">
              6 RUNNERS
              <br />3 WOMEN + 3 MEN
              <br />1 ROAD + 1 TRAIL PER RUNNER
              <br />1 COMBINED TEAM TIME
            </p>
            <p>Two terrains. Six runners. One team result.</p>
          </section>
          <section className="race-specifications">
            <h2>
              Race
              <br />
              Specifications
            </h2>
            <dl>
              <div className="race-spec-row">
                <dt>EVENT</dt>
                <dd>
                  <img
                    src="/images/race/course-outline.svg"
                    alt="Road and Trail circuit outline"
                    width="630"
                    height="197"
                    loading="lazy"
                  />
                </dd>
              </div>
              {raceSpecifications.map(([label, paragraphs]) => (
                <div key={label} className="race-spec-row">
                  <dt>{label}</dt>
                  <dd>
                    {paragraphs.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
          <section className="race-location">
            <h2>LOCATION</h2>
            <RaceMap accessToken={mapboxAccessToken} />
          </section>
        </div>
        <img
          className="race-stratford"
          src="/images/race/stratford-map.svg"
          alt="Illustrated Stratford International venue map"
          width="526"
          height="529"
          loading="lazy"
        />
        <section className="race-programme">
          <h2>RACE DAY PROGRAMME</h2>
          <ol>
            {raceProgramme.map(([time, title, detail]) => (
              <li key={time}>
                <time>{time}</time>
                <div>
                  <h3>{title}</h3>
                  <p>{detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
        <section className="race-faq">
          <h2>FAQ</h2>
          {raceFaq.map((group, groupIndex) => (
            <section key={group.title}>
              <h3>{group.title}</h3>
              {group.items.map((item, itemIndex) => (
                <FaqItem
                  key={item.question}
                  {...item}
                  id={`race-faq-${groupIndex}-${itemIndex}`}
                />
              ))}
            </section>
          ))}
        </section>
      </div>
    </main>
  );
}

// Keep loader errors visible instead of rendering the Coming Soon homepage.
export function ErrorBoundary() {
  return (
    <main className="coming-soon">
      <div className="coming-soon-content">
        <h1>Race page unavailable</h1>
        <p>Event details could not be loaded. Please try again later.</p>
        <a className="coming-soon-race-link" href="/">
          Back to home
        </a>
      </div>
    </main>
  );
}

const RACE_QUERY = `#graphql
  query RaceEvent {
    race: metaobject(handle: {type: "race_event", handle: "field-circuit"}) {
      startsAt: field(key: "starts_at") { value }
      registrationUrl: field(key: "registration_url") { value }
      photographerUrl: field(key: "photographer_url") { value }
    }
  }
` as const;
