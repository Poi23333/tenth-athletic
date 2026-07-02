import {useEffect, useMemo, useState} from 'react';
import {useAnalytics} from '@shopify/hydrogen';

type ConsentChoice = {
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
};

type ConsentView = 'summary' | 'settings';

const DEFAULT_CHOICE: ConsentChoice = {
  analytics: false,
  marketing: false,
  preferences: false,
};

const CONSENT_OPEN_EVENT = 'tenth:manage-cookies';
const CONSENT_STORAGE_KEY = 'tenth.cookie-consent.v1';

export function openCookieManager() {
  if (typeof document === 'undefined') return;
  document.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
}

export function CookieConsent() {
  const {customerPrivacy} = useAnalytics();
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<ConsentView>('summary');
  const [choice, setChoice] = useState<ConsentChoice>(DEFAULT_CHOICE);
  const [status, setStatus] = useState<string | null>(null);
  const [hasApiLoaded, setHasApiLoaded] = useState(Boolean(customerPrivacy));

  const api = customerPrivacy ?? getRuntimeCustomerPrivacy();

  useEffect(() => {
    if (customerPrivacy) {
      setHasApiLoaded(true);
      return;
    }

    const markLoaded = () => setHasApiLoaded(true);
    document.addEventListener('shopifyCustomerPrivacyApiLoaded', markLoaded);

    return () => {
      document.removeEventListener('shopifyCustomerPrivacyApiLoaded', markLoaded);
    };
  }, [customerPrivacy]);

  useEffect(() => {
    const openManager = () => {
      setChoice(readCurrentChoice(api));
      setStatus(api ? null : 'Cookie settings are still loading.');
      setView('settings');
      setIsOpen(true);
    };

    document.addEventListener(CONSENT_OPEN_EVENT, openManager);

    return () => {
      document.removeEventListener(CONSENT_OPEN_EVENT, openManager);
    };
  }, [api]);

  useEffect(() => {
    if (!api) return;

    setChoice(readCurrentChoice(api));

    if (!hasRecordedConsent(api) && !readStoredConsent()) {
      setView('summary');
      setIsOpen(true);
    }
  }, [api, hasApiLoaded]);

  const categories = useMemo(
    () => [
      {
        id: 'preferences' as const,
        title: 'Preference Cookies',
        text: 'Remember choices like region, language, and storefront preferences.',
      },
      {
        id: 'analytics' as const,
        title: 'Analytics Cookies',
        text: 'Help us understand how the store is used and where the experience can improve.',
      },
      {
        id: 'marketing' as const,
        title: 'Marketing Cookies',
        text: 'Support ads, attribution, and marketing communication based on interests.',
      },
    ],
    [],
  );

  if (!isOpen) return null;

  const saveConsent = (nextChoice: ConsentChoice) => {
    if (!api) {
      setStatus('Cookie settings are still loading.');
      return;
    }

    setStatus(null);
    api.setTrackingConsent(
      {
        ...nextChoice,
        sale_of_data: nextChoice.marketing,
      },
      (result) => {
        if (result?.error) {
          setStatus(result.error);
          return;
        }

        setChoice(nextChoice);
        writeStoredConsent(nextChoice);
        setIsOpen(false);
      },
    );
  };

  return (
    <div
      className="cookie-consent"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-consent-title"
    >
      <div className="cookie-consent-panel">
        <button
          className="cookie-consent-close"
          type="button"
          aria-label="Close cookie settings"
          onClick={() => setIsOpen(false)}
        >
          x
        </button>
        <img
          src="/logo/brand-logo-cookie.png"
          alt="Tenth Athletic"
          className="cookie-consent-logo"
          width={184}
          height={34}
        />
        <h2 className="sr-only" id="cookie-consent-title">
          Cookie settings
        </h2>

        {view === 'summary' ? (
          <>
            <p className="cookie-consent-copy">
              Your privacy is important to us so we want to be clear on what
              information is collected when you visit our sites. During your
              visit, we may need to retrieve and/or store your browser
              information, mostly in the form of cookies. This information might
              be about you, your choices, or your device and is mostly used to
              offer you a more personalised experience.
            </p>
            <p className="cookie-consent-copy">
              It is your choice what we collect. You can find out more about the
              different categories of cookies we use and how to opt in or out in
              Cookie Settings.
            </p>
            <p className="cookie-consent-copy">
              To learn more about how we and our partners use your personal
              information, please see our Privacy Policy.
            </p>
          </>
        ) : (
          <div className="cookie-consent-settings">
            <div className="cookie-consent-row">
              <div>
                <h3>Necessary Cookies</h3>
                <p>Required for core storefront, cart, checkout, and security.</p>
              </div>
              <span className="cookie-consent-required">Always on</span>
            </div>
            {categories.map((category) => (
              <label className="cookie-consent-row" key={category.id}>
                <span>
                  <strong>{category.title}</strong>
                  <span>{category.text}</span>
                </span>
                <input
                  checked={choice[category.id]}
                  type="checkbox"
                  onChange={(event) =>
                    setChoice((current) => ({
                      ...current,
                      [category.id]: event.currentTarget.checked,
                    }))
                  }
                />
              </label>
            ))}
          </div>
        )}

        {status ? <p className="cookie-consent-status">{status}</p> : null}

        <div className="cookie-consent-actions">
          {view === 'summary' ? (
            <button
              className="cookie-consent-text-action"
              type="button"
              onClick={() => {
                setChoice(readCurrentChoice(api));
                setView('settings');
              }}
            >
              Cookies Settings
            </button>
          ) : (
            <button
              className="cookie-consent-text-action"
              type="button"
              onClick={() => setView('summary')}
            >
              Back
            </button>
          )}
          <div className="cookie-consent-action-group">
            <button
              className="cookie-consent-button"
              type="button"
              onClick={() => saveConsent(DEFAULT_CHOICE)}
            >
              Reject All
            </button>
            <button
              className="cookie-consent-button"
              type="button"
              onClick={() =>
                saveConsent({
                  analytics: true,
                  marketing: true,
                  preferences: true,
                })
              }
            >
              Allow All
            </button>
            {view === 'settings' ? (
              <button
                className="cookie-consent-button"
                type="button"
                onClick={() => saveConsent(choice)}
              >
                Save
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function readCurrentChoice(api: ReturnType<typeof useAnalytics>['customerPrivacy']) {
  const storedConsent = readStoredConsent();

  if (storedConsent) return storedConsent.choice;
  if (!api) return DEFAULT_CHOICE;

  const current = api.currentVisitorConsent();

  return {
    analytics:
      typeof current.analytics === 'boolean'
        ? current.analytics
        : api.analyticsProcessingAllowed(),
    marketing:
      typeof current.marketing === 'boolean'
        ? current.marketing
        : api.marketingAllowed(),
    preferences:
      typeof current.preferences === 'boolean'
        ? current.preferences
        : api.preferencesProcessingAllowed(),
  };
}

function hasRecordedConsent(
  api: ReturnType<typeof useAnalytics>['customerPrivacy'],
) {
  if (!api) return false;

  const current = api.currentVisitorConsent();

  return [current.analytics, current.marketing, current.preferences].some(
    (value) => typeof value === 'boolean',
  );
}

function getRuntimeCustomerPrivacy():
  | ReturnType<typeof useAnalytics>['customerPrivacy']
  | null {
  if (typeof window === 'undefined') return null;

  const runtimeWindow = window as Window & {
    Shopify?: {
      customerPrivacy?: ReturnType<typeof useAnalytics>['customerPrivacy'];
    };
  };

  return runtimeWindow.Shopify?.customerPrivacy ?? null;
}

function readStoredConsent():
  | {
      choice: ConsentChoice;
      savedAt: string;
    }
  | null {
  if (typeof window === 'undefined') return null;

  const rawConsent = window.localStorage.getItem(CONSENT_STORAGE_KEY);

  if (!rawConsent) return null;

  const storedConsent = JSON.parse(rawConsent) as {
    choice?: Partial<ConsentChoice>;
    savedAt?: string;
  };

  if (!storedConsent.savedAt || !storedConsent.choice) return null;

  return {
    choice: {
      analytics: storedConsent.choice.analytics === true,
      marketing: storedConsent.choice.marketing === true,
      preferences: storedConsent.choice.preferences === true,
    },
    savedAt: storedConsent.savedAt,
  };
}

function writeStoredConsent(choice: ConsentChoice) {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(
    CONSENT_STORAGE_KEY,
    JSON.stringify({
      choice,
      savedAt: new Date().toISOString(),
    }),
  );
}
