import type {MetaDescriptor} from 'react-router';
import hero640 from '~/assets/race/field-circuit-hero-640.avif?url';
import hero960 from '~/assets/race/field-circuit-hero-960.avif?url';
import hero1440 from '~/assets/race/field-circuit-hero-1440.avif?url';
import hero1920 from '~/assets/race/field-circuit-hero-1920.avif?url';

/** Public origin shared by canonical URLs, robots.txt and the sitemap. */
export const SITE_ORIGIN = 'https://tenthathletic.com';
export const EVENT_IMAGE = `${SITE_ORIGIN}/images/race/field-circuit-hero-1920.webp`;
// Vite resolves these to the deployment's CDN URLs in production. Requesting
// public images through the storefront domain can strip format negotiation.
export const HERO_IMAGE = hero960;
export const HERO_SRC_SET = [
  [hero640, 640],
  [hero960, 960],
  [hero1440, 1440],
  [hero1920, 1920],
]
  .map(([url, width]) => `${url} ${width}w`)
  .join(', ');

export function pageMeta({
  title,
  description,
  path,
  image = `${SITE_ORIGIN}/images/tenth-athletic-social.png`,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): MetaDescriptor[] {
  const url = new URL(path, SITE_ORIGIN).href;
  return [
    {title},
    {name: 'description', content: description},
    {name: 'robots', content: 'index,follow,max-image-preview:large'},
    {tagName: 'link', rel: 'canonical', href: url},
    {property: 'og:type', content: 'website'},
    {property: 'og:site_name', content: 'TENTH Athletic'},
    {property: 'og:locale', content: 'en_GB'},
    {property: 'og:title', content: title},
    {property: 'og:description', content: description},
    {property: 'og:url', content: url},
    {property: 'og:image', content: image},
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:title', content: title},
    {name: 'twitter:description', content: description},
    {name: 'twitter:image', content: image},
  ];
}

export const organization = {
  '@type': 'Organization',
  '@id': `${SITE_ORIGIN}/#organization`,
  name: 'TENTH Athletic',
  legalName: 'Tenth Athletic Limited',
  url: `${SITE_ORIGIN}/`,
  logo: `${SITE_ORIGIN}/images/tenth-athletic-social.png`,
  sameAs: ['https://www.instagram.com/tenth.athletic/'],
};

export const siteStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    organization,
    {
      '@type': 'WebSite',
      '@id': `${SITE_ORIGIN}/#website`,
      url: `${SITE_ORIGIN}/`,
      name: 'TENTH Athletic',
      publisher: {'@id': organization['@id']},
      inLanguage: 'en-GB',
    },
  ],
};

/** Escape markup delimiters before embedding JSON in an HTML script element. */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

export function eventDate(startsAt: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(startsAt));
}

export function eventEnd(startsAt: string): string {
  // Confirmed programme: 15:00–22:00 London time (seven hours).
  return new Date(Date.parse(startsAt) + 7 * 60 * 60 * 1000).toISOString();
}

export function eventHours(startsAt: string): string {
  const format = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });
  return `${format.format(new Date(startsAt))}–${format.format(new Date(eventEnd(startsAt)))} (London time)`;
}

export function eventDescription(startsAt: string): string {
  return `TENTH FIELD CIRCUIT at Lee Valley VeloPark, London, on ${eventDate(startsAt)}. Explore the Road and Trail race, six-person relay, schedule and entry details.`;
}

export function eventStructuredData(startsAt: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    '@id': `${SITE_ORIGIN}/#field-circuit`,
    name: 'TENTH FIELD CIRCUIT',
    url: `${SITE_ORIGIN}/`,
    description: eventDescription(startsAt),
    image: [EVENT_IMAGE],
    startDate: startsAt,
    endDate: eventEnd(startsAt),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: 'Lee Valley VeloPark',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Abercrombie Road, Queen Elizabeth Olympic Park',
        addressLocality: 'London',
        postalCode: 'E20 3AB',
        addressCountry: 'GB',
      },
    },
    organizer: organization,
    // Registration is not open: do not advertise a purchasable ticket offer.
  };
}
