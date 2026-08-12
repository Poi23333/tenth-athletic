import {useEffect, useId, useRef, useState} from 'react';
import {RiAddLine, RiCloseLine} from '@remixicon/react';
import {NavLink} from 'react-router';

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

export function Footer({mainColor}: {mainColor: string}) {
  const [isFieldNotesOpen, setIsFieldNotesOpen] = useState(false);
  const panelId = useId();
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isFieldNotesOpen) return;

    const originalOverflow = document.documentElement.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsFieldNotesOpen(false);
    };

    document.documentElement.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.documentElement.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFieldNotesOpen]);

  return (
    <footer
      className={`footer${isFieldNotesOpen ? ' is-field-notes-open' : ''}`}
      style={{'--shop-main-color': mainColor} as React.CSSProperties}
    >
      <div className="footer-inner">
        <div className="footer-links">
          <div className="footer-rule" aria-hidden="true" />
          <div className="footer-columns">
            {FOOTER_COLUMNS.map((column) => (
              <ul className="footer-column" key={column[0].label}>
                {column.map((link) => (
                  <li key={link.label}>
                    <FooterLinkItem link={link} />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-field-notes-shell">
        <button
          aria-label="Close field notes sign-up"
          className="footer-field-notes-backdrop"
          onClick={() => setIsFieldNotesOpen(false)}
          tabIndex={isFieldNotesOpen ? 0 : -1}
          type="button"
        />
        <section
          aria-hidden={!isFieldNotesOpen}
          aria-label="Field notes sign-up"
          aria-modal="true"
          className="footer-field-notes-panel"
          id={panelId}
          role="dialog"
        >
          <button
            aria-label="Close field notes sign-up"
            className="footer-field-notes-close"
            onClick={() => setIsFieldNotesOpen(false)}
            type="button"
          >
            <RiCloseLine aria-hidden="true" />
          </button>
          <div className="footer-field-notes-content">
            <h2>
              Join <em>Tenth Athletic</em>
            </h2>
            <p className="footer-field-notes-intro">
              Built around distance. Connected by design.
              <br />
              Be the first to hear about new product releases, Tenth Lab
              research, field notes and community events.
            </p>
            <button
              className="footer-field-notes-learn"
              onClick={() => emailInputRef.current?.focus()}
              type="button"
            >
              Learn more
            </button>

            <form className="footer-field-notes-form">
              <label htmlFor={`${panelId}-email`}>Email *</label>
              <input
                autoComplete="email"
                id={`${panelId}-email`}
                name="email"
                ref={emailInputRef}
                required
                type="email"
              />
              <p>
                By subscribing, you agree to our{' '}
                <NavLink
                  onClick={() => setIsFieldNotesOpen(false)}
                  to="/pages/privacy-cookie-policy"
                >
                  Privacy Policy
                </NavLink>
                .
              </p>
              <button className="footer-field-notes-submit" type="button">
                Sign Up For Field Notes
              </button>
            </form>
          </div>
        </section>

        <button
          aria-controls={panelId}
          aria-expanded={isFieldNotesOpen}
          className="footer-copyright-bar"
          onClick={() => setIsFieldNotesOpen((isOpen) => !isOpen)}
          type="button"
        >
          <span className="footer-copyright-title">One More Mile</span>
          <span className="footer-copyright-prompt">
            {isFieldNotesOpen ? 'Close field notes' : 'Sign up for field notes'}
          </span>
          <span className="footer-copyright-icon" aria-hidden="true">
            {isFieldNotesOpen ? <RiCloseLine /> : <RiAddLine />}
          </span>
          <span className="sr-only">
            © Tenth Athletic Limited 2026. All rights reserved.
          </span>
        </button>
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
