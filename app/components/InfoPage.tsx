import {useId, useState, type ReactNode} from 'react';

type InfoPageProps = {
  title: string;
  children: ReactNode;
  wide?: boolean;
};

export function InfoPage({title, children, wide = false}: InfoPageProps) {
  return (
    <article className={`info-page${wide ? ' info-page--wide' : ''}`}>
      <div className="info-page-inner">
        <h1 className="info-page-title">{title}</h1>
        <div className="info-page-body">{children}</div>
      </div>
    </article>
  );
}

type InfoPageAccordionProps = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

export function InfoPageAccordion({
  title,
  children,
  defaultOpen = false,
}: InfoPageAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <div className={`info-page-accordion${isOpen ? ' is-open' : ''}`}>
      <button
        aria-controls={panelId}
        aria-expanded={isOpen}
        className="info-page-accordion-trigger"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        {title}
      </button>
      <div
        aria-hidden={!isOpen}
        className="info-page-accordion-panel"
        id={panelId}
      >
        <div className="info-page-accordion-content">{children}</div>
      </div>
    </div>
  );
}
