import Link from 'next/link';

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
      <div className="site-footer__legal">
        <nav className="site-footer__legal-links">
          <Link href="/shipping">Shipping</Link>
          <Link href="/returns">Returns</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
        </nav>
        <span className="site-footer__abn">ABN 39 538 456 199</span>
      </div>
    </footer>
  );
}
