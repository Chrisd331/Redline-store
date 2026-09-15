export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <img src="/logo.jpg" alt="Redline" className="site-footer__logo" />
          <span>Redline Supplements</span>
        </div>
        <p className="site-footer__line">Built for the redline.</p>
        <div className="site-footer__contact">
          <a href="mailto:hello@redlinesupplements.com.au">hello@redlinesupplements.com.au</a>
          <a href="https://instagram.com/redlinesupplementsaus" target="_blank" rel="noreferrer">
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}
