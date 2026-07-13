import {NavLink} from 'react-router';
import footerCactus from '~/assets/footer-cactus.svg';

type FooterLink = {
  label: string;
  to?: string;
  href?: string;
};

const FOOTER_COLUMNS: FooterLink[][] = [
  [
    {label: 'Customer Service', to: '/pages/customer-service'},
    {label: 'Shipping & Returns', to: '/pages/shipping-returns'},
    {label: 'FAQ', to: '/pages/faq'},
    {label: 'Terms & Conditions', to: '/pages/terms-conditions'},
    {label: 'Privacy & Cookie Policy', to: '/pages/privacy-cookie-policy'},
  ],
  [
    {label: 'Our Packaging', to: '/pages/our-packaging'},
    {label: 'Care Guide', to: '/pages/care-guide'},
    {label: 'Sustainability', to: '/pages/sustainability'},
    {label: 'Careers', to: '/pages/careers'},
    {label: 'Store Locator / Stockists', to: '/pages/store-locator'},
  ],
  [
    {label: 'Instagram', href: 'https://www.instagram.com/'},
    {label: 'YouTube', href: 'https://www.youtube.com/'},
    {label: 'TikTok', href: 'https://www.tiktok.com/'},
    {label: 'Strava', href: 'https://www.strava.com/'},
    {label: 'Spotify', href: 'https://open.spotify.com/'},
  ],
];

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-links">
          <div className="footer-rule" aria-hidden="true" />
          <div className="footer-columns">
            {FOOTER_COLUMNS.map((column, columnIndex) => (
              <ul className="footer-column" key={columnIndex}>
                {column.map((link) => (
                  <li key={link.label}>
                    <FooterLinkItem link={link} />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
        <div className="footer-aside" aria-hidden="true">
          <img
            className="footer-illustration"
            src={footerCactus}
            alt=""
            width={128}
            height={286}
            decoding="async"
          />
        </div>
      </div>
      <div className="footer-copyright-bar">
        <p>© Tenth Athletic Limited 2026. All rights reserved.</p>
      </div>
    </footer>
  );
}

function FooterLinkItem({link}: {link: FooterLink}) {
  if (link.href) {
    return (
      <a
        className="footer-link"
        href={link.href}
        rel="noopener noreferrer"
        target="_blank"
      >
        {link.label}
      </a>
    );
  }

  return (
    <NavLink className="footer-link" prefetch="intent" to={link.to ?? '/'}>
      {link.label}
    </NavLink>
  );
}
