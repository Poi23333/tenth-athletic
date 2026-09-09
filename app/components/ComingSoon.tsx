export function ComingSoon() {
  return (
    <main className="coming-soon">
      <div className="coming-soon-content">
        <div className="coming-soon-brand">
          <img
            alt="Tenth Athletic"
            className="coming-soon-logo"
            src="/images/tenth-athletic-outline-logo.svg"
          />
          <p className="coming-soon-text">Coming soon</p>
        </div>
        <div className="coming-soon-event">
          <h2 className="coming-soon-event-title">FIELD CIRCUIT</h2>
          <a className="coming-soon-race-link" href="/race">
            <span>London 2026</span>
            <img
              className="coming-soon-tap-icon"
              src="/images/finger-tap-line.svg"
              alt=""
              aria-hidden="true"
              width="24"
              height="24"
            />
          </a>
        </div>
      </div>
    </main>
  );
}
