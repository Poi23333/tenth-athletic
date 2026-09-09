import {Link} from 'react-router';
import {Aside, useAside} from '~/components/Aside';
import {Header, HeaderMenu} from '~/components/Header';

// Same groups and order as full-storefront's FieldIndexAside.
const FIELD_INDEX_SECTIONS = [
  {heading: 'About', items: ['About Tenth', 'Practice', 'People']},
  {
    heading: 'Systems',
    items: ['Product System', 'Construction', 'Materials', 'Condition Index'],
  },
  {
    heading: 'Tenth Lab',
    items: [
      'Product Development',
      'Objects',
      'Spatial Systems',
      'Collaborations',
    ],
  },
] as const;

export function LaunchHeader() {
  return (
    <Aside.Provider>
      <Navigation />
    </Aside.Provider>
  );
}

function Navigation() {
  const {close} = useAside();
  return (
    <>
      <Aside chrome="brand" type="field-index" heading="Field Index">
        <nav className="drawer-menu" aria-label="Field Index">
          {FIELD_INDEX_SECTIONS.map(({heading, items}) => (
            <div className="drawer-menu-group" key={heading}>
              <p className="drawer-menu-heading">{heading}</p>
              <div className="drawer-list">
                {items.map((item) => (
                  <Link
                    key={item}
                    className="drawer-list-item"
                    to="/coming-soon"
                    onClick={close}
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <div className="drawer-menu-group">
            <p className="drawer-menu-heading">Field Circuit</p>
            <div className="drawer-list">
              <Link className="drawer-list-item" to="/race" onClick={close}>
                London 2026
              </Link>
            </div>
          </div>
        </nav>
      </Aside>
      <Aside type="mobile" heading="MENU">
        <HeaderMenu viewport="mobile" />
      </Aside>
      <Header />
    </>
  );
}
