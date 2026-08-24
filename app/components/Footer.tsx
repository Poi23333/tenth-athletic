import {useEffect, useId, useRef, useState} from 'react';
import {RiAddLine, RiCloseLine} from '@remixicon/react';
import {NavLink} from 'react-router';
import brandLogo from '~/assets/logo.svg';
import {useAside} from '~/components/Aside';
import {formatRegionNavLabel, type Region} from '~/data/regions';
import {FOOTER_SUPPORT_BENEFITS} from '~/data/supportBenefits';

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

type FieldNotesPhase =
  | 'idle'
  | 'hiding-bar'
  | 'opening'
  | 'open'
  | 'closing'
  | 'showing-bar';

const BAR_HIDE_MS = 320;
const DRAWER_MS = 480;

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function Footer({
  currentRegion,
  mainColor,
}: {
  currentRegion: Region;
  mainColor: string;
}) {
  const {open} = useAside();
  const [fieldNotesPhase, setFieldNotesPhase] =
    useState<FieldNotesPhase>('idle');
  const panelId = useId();
  const emailInputRef = useRef<HTMLInputElement>(null);
  const isFieldNotesOpen =
    fieldNotesPhase === 'opening' || fieldNotesPhase === 'open';
  const isFieldNotesActive = fieldNotesPhase !== 'idle';
  const isBarHidden =
    fieldNotesPhase === 'hiding-bar' ||
    fieldNotesPhase === 'opening' ||
    fieldNotesPhase === 'open' ||
    fieldNotesPhase === 'closing';
  const isDrawerVisible =
    fieldNotesPhase === 'opening' ||
    fieldNotesPhase === 'open' ||
    fieldNotesPhase === 'closing';

  const openFieldNotes = () => {
    if (fieldNotesPhase === 'showing-bar') {
      setFieldNotesPhase(prefersReducedMotion() ? 'open' : 'hiding-bar');
      return;
    }
    if (fieldNotesPhase !== 'idle') return;
    setFieldNotesPhase(prefersReducedMotion() ? 'open' : 'hiding-bar');
  };

  const closeFieldNotes = () => {
    if (
      fieldNotesPhase === 'idle' ||
      fieldNotesPhase === 'closing' ||
      fieldNotesPhase === 'showing-bar'
    ) {
      return;
    }
    if (prefersReducedMotion()) {
      setFieldNotesPhase('idle');
      return;
    }
    setFieldNotesPhase(
      fieldNotesPhase === 'hiding-bar' ? 'showing-bar' : 'closing',
    );
  };

  useEffect(() => {
    const nextPhase =
      fieldNotesPhase === 'hiding-bar'
        ? 'opening'
        : fieldNotesPhase === 'opening'
          ? 'open'
          : fieldNotesPhase === 'closing'
            ? 'showing-bar'
            : fieldNotesPhase === 'showing-bar'
              ? 'idle'
              : null;

    if (!nextPhase) return;

    const delay =
      fieldNotesPhase === 'hiding-bar' || fieldNotesPhase === 'showing-bar'
        ? BAR_HIDE_MS
        : DRAWER_MS;
    const timer = window.setTimeout(() => setFieldNotesPhase(nextPhase), delay);
    return () => window.clearTimeout(timer);
  }, [fieldNotesPhase]);

  useEffect(() => {
    if (!isFieldNotesActive) return;

    const originalOverflow = document.documentElement.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setFieldNotesPhase((phase) => {
        if (
          phase === 'idle' ||
          phase === 'closing' ||
          phase === 'showing-bar'
        ) {
          return phase;
        }
        if (prefersReducedMotion()) return 'idle';
        return phase === 'hiding-bar' ? 'showing-bar' : 'closing';
      });
    };

    document.documentElement.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.documentElement.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFieldNotesActive]);

  return (
    <footer
      className={`footer${isFieldNotesActive ? ' is-field-notes-active' : ''}${
        isFieldNotesOpen ? ' is-field-notes-open' : ''
      }${fieldNotesPhase === 'closing' ? ' is-field-notes-closing' : ''}`}
      style={{'--shop-main-color': mainColor} as React.CSSProperties}
    >
      <div className="footer-benefits" aria-label="Delivery and returns">
        {FOOTER_SUPPORT_BENEFITS.map((benefit) => (
          <section className="footer-benefit" key={benefit.title}>
            <div className="footer-benefit-heading">
              <div className="footer-benefit-icon">
                <img src={benefit.image} alt="" aria-hidden="true" />
              </div>
              <h2>{benefit.title}</h2>
            </div>
            <p>{benefit.description}</p>
          </section>
        ))}
      </div>
      <div className="footer-inner">
        <div className="footer-rule" aria-hidden="true" />
        <div className="footer-links">
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

        <p className="footer-copyright">
          © Tenth Athletic Limited 2026. All rights reserved. VAT n.GB 512329912
        </p>

        <img
          alt="Tenth Athletic"
          className="footer-logo"
          height={71}
          src="/images/tenth-athletic-outline-logo.svg"
          width={637}
        />

        <button
          className="footer-region reset"
          onClick={() => open('locale')}
          type="button"
        >
          {formatRegionNavLabel(currentRegion)}
        </button>
      </div>

      <div className="footer-field-notes-shell">
        <div aria-hidden="true" className="footer-field-notes-slot" />
        <button
          aria-label="Close field notes sign-up"
          className="footer-field-notes-backdrop"
          onClick={closeFieldNotes}
          tabIndex={isDrawerVisible ? 0 : -1}
          type="button"
        />
        <button
          aria-controls={panelId}
          aria-expanded={isFieldNotesOpen}
          className={`footer-copyright-bar${isBarHidden ? ' is-offscreen' : ''}${
            fieldNotesPhase === 'hiding-bar' ||
            fieldNotesPhase === 'showing-bar'
              ? ' is-animating'
              : ''
          }`}
          onClick={() =>
            isFieldNotesOpen ? closeFieldNotes() : openFieldNotes()
          }
          type="button"
        >
          <span className="footer-copyright-copy">
            <span className="footer-copyright-title">One More Mile</span>
            <span className="footer-copyright-prompt">
              Sign up for field notes
            </span>
          </span>
          <span className="footer-copyright-icon" aria-hidden="true">
            <RiAddLine />
          </span>
        </button>
        <div
          className={`footer-field-notes-stage${
            isDrawerVisible ? ' is-visible' : ''
          }${isFieldNotesOpen ? ' is-expanded' : ''}${
            fieldNotesPhase === 'opening' || fieldNotesPhase === 'closing'
              ? ' is-animating'
              : ''
          }`}
        >
          <section
            aria-hidden={!isFieldNotesOpen}
            aria-label="Field notes sign-up"
            aria-modal={isFieldNotesOpen}
            className="footer-field-notes-panel"
            id={panelId}
            role="dialog"
          >
            <button
              aria-label="Close field notes sign-up"
              className="footer-field-notes-close"
              onClick={closeFieldNotes}
              type="button"
            >
              <RiCloseLine aria-hidden="true" />
            </button>
            <div className="footer-field-notes-content">
              <h2>
                <span>JOIN</span>
                <img
                  alt="Tenth Athletic"
                  className="footer-field-notes-logo"
                  height={32}
                  src={brandLogo}
                  width={180}
                />
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
                    onClick={closeFieldNotes}
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
        </div>
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
