import {Suspense} from 'react';
import {Await, NavLink} from 'react-router';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';
import {openCookieManager} from '~/components/CookieConsent';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({
  footer: footerPromise,
}: FooterProps) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {() => (
          <footer className="footer">
            <div className="footer-inner">
              <div className="footer-story">
                <h2 className="footer-title">
                  Performance without conformity
                </h2>
                <p className="footer-body">
                  Tenth athletic believes running is not a performance for
                  attention, but a quiet way of building discipline, identity
                  and belonging.
                </p>
              </div>

              <div className="footer-aside">
                <div
                  className="footer-social"
                  aria-label="Tenth Athletic socials"
                >
                  <img
                    src="/logo/footer-social-strava.png"
                    alt="Strava"
                    width={88}
                    height={20}
                  />
                  <img
                    src="/logo/footer-social-spotify.png"
                    alt="Spotify"
                    width={62}
                    height={20}
                  />
                </div>
                <div className="footer-legal">
                  <span className="footer-copyright">
                    ©2026 Tenth athletic®
                  </span>
                  <button
                    className="footer-legal-action"
                    type="button"
                    onClick={openCookieManager}
                  >
                    Manage Cookies
                  </button>
                  <span className="footer-legal-text">
                    Terms & Conditions
                  </span>
                  <span className="footer-legal-text">Privacy Policy</span>
                </div>
                <img
                  src="/logo/footer-partner-1-percent-planet.png"
                  alt="1% for the Planet"
                  className="footer-partner"
                  width={50}
                  height={65}
                />
              </div>
            </div>
          </footer>
        )}
      </Await>
    </Suspense>
  );
}
