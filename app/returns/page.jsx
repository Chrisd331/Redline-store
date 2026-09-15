export const metadata = {
  title: 'Returns — Redline Supplements',
};

export default function ReturnsPage() {
  return (
    <main className="wrap legal-page">
      <div className="legal-page__draft-banner">
        <strong>DRAFT — for internal review.</strong> This page has not been
        published for accuracy yet. Every{' '}
        <span className="legal-page__placeholder">[PLACEHOLDER]</span> needs a
        real value from you before this goes live.
      </div>

      <h1>Returns &amp; Refunds</h1>
      <p className="legal-page__updated">Last updated: [PLACEHOLDER date]</p>

      <h2>Change of mind</h2>
      <p>
        [PLACEHOLDER — do you accept change-of-mind returns? If yes: within
        how many days, must the product be unopened/unused, who pays return
        postage, and do you refund or offer store credit?]
      </p>

      <h2>Faulty or incorrect items</h2>
      <p>
        Under Australian Consumer Law, you're entitled to a repair,
        replacement or refund if a product has a major fault, and to a
        replacement or repair for a minor fault. If you receive a faulty or
        incorrect item, contact us and we'll sort it out.
      </p>

      <h2>Opened or used product</h2>
      <p>
        [PLACEHOLDER — for hygiene/safety reasons, most supplement sellers
        don't accept returns on opened tubs unless faulty. Confirm your
        policy here.]
      </p>

      <h2>How to request a return</h2>
      <p>
        Email{' '}
        <a href="mailto:hello@redlinesupplements.com.au">
          hello@redlinesupplements.com.au
        </a>{' '}
        with your order number and the reason for the return, and we'll
        confirm next steps.
      </p>

      <h2>Refunds</h2>
      <p>
        [PLACEHOLDER — refund method (original payment method?) and timing
        (e.g. "within X business days of the returned item being received").]
      </p>
    </main>
  );
}
