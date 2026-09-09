import {Link, NavLink} from 'react-router';
import {RiBookmarkFill, RiSearchLine} from '@remixicon/react';
import {useAside} from './Aside';
import brandLogo from '../assets/logo.svg';

type Viewport = 'desktop' | 'mobile';

// Synced from full-storefront. Unreleased destinations point to Coming soon.
export function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <NavLink prefetch="intent" to="/" className="header-logo-link" end>
          <img
            src={brandLogo}
            alt="Tenth Athletic"
            className="header-logo"
            width={180}
            height={32}
          />
        </NavLink>
        <HeaderMenu viewport="desktop" />
        <HeaderCtas />
      </div>
    </header>
  );
}

export function HeaderMenu({viewport}: {viewport: 'desktop' | 'mobile'}) {
  const {type, open, close} = useAside();
  return (
    <nav
      className={`header-menu-${viewport}`}
      aria-label={`${viewport} navigation`}
    >
      {viewport === 'desktop' ? <SearchLink viewport="desktop" /> : null}
      {['Man', 'Woman', 'Account'].map((label) => (
        <Link
          key={label}
          className="header-menu-item"
          to="/coming-soon"
          onClick={close}
        >
          {label}
        </Link>
      ))}
      <button
        className={`header-menu-item reset${type === 'field-index' ? ' active' : ''}`}
        type="button"
        aria-expanded={type === 'field-index'}
        onClick={() => (type === 'field-index' ? close() : open('field-index'))}
      >
        Field Index
      </button>
      <Link
        className="header-menu-item header-wishlist"
        aria-label="Wishlist"
        to="/coming-soon"
        onClick={close}
      >
        <RiBookmarkFill aria-hidden="true" />
        <span className="sr-only">Wishlist</span>
      </Link>
      <Link
        className="header-menu-item header-bag"
        to="/coming-soon"
        onClick={close}
      >
        <span>Bag(0)</span>
      </Link>
      {viewport === 'desktop' && type === 'field-index' ? (
        <button
          aria-label="Close drawer"
          className="header-drawer-close reset"
          onClick={close}
          type="button"
        >
          &times;
        </button>
      ) : null}
    </nav>
  );
}

function HeaderCtas() {
  const {close, type} = useAside();
  const hasSharedHeaderDrawer =
    type === 'cart' ||
    type === 'shop' ||
    type === 'man' ||
    type === 'woman' ||
    type === 'field-index' ||
    type === 'locale';

  return (
    <nav className="header-ctas" role="navigation">
      <SearchLink viewport="mobile" />
      {hasSharedHeaderDrawer ? (
        <button
          aria-label="Close drawer"
          className="header-drawer-close header-drawer-close--mobile reset"
          onClick={close}
          type="button"
        >
          &times;
        </button>
      ) : (
        <HeaderMenuMobileToggle />
      )}
    </nav>
  );
}

function SearchLink({viewport}: {viewport: Viewport}) {
  const {close} = useAside();

  return (
    <NavLink
      aria-label="Search"
      className={({isActive}) =>
        `header-menu-item header-search-link header-search-link--${viewport}${
          isActive ? ' active' : ''
        }`
      }
      onClick={close}
      prefetch="intent"
      to="/coming-soon"
    >
      <RiSearchLine aria-hidden="true" />
    </NavLink>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="header-menu-mobile-toggle reset"
      onClick={() => open('mobile')}
      aria-label="Open menu"
    >
      <span className="header-menu-icon" aria-hidden="true">
        ☰
      </span>
    </button>
  );
}
