import Link from 'next/link';

export default function ClosingCTA() {
  return (
    <section className="story__cta">
      <p className="story__cta-eyebrow">Every engine has a redline.</p>
      <h2 className="story__cta-title">Find yours.</h2>
      <Link href="/products" className="story__cta-btn">
        Shop the range
      </Link>
    </section>
  );
}
