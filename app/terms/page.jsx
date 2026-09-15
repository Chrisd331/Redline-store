export const metadata = {
  title: 'Terms & Conditions — Redline Supplements',
};

export default function TermsPage() {
  return (
    <main className="wrap legal-page">
      <div className="legal-page__draft-banner">
        <strong>DRAFT — for internal review, not legal advice.</strong> This
        is a starting skeleton, not a reviewed legal document. Please have it
        checked before publishing, and fill in every{' '}
        <span className="legal-page__placeholder">[PLACEHOLDER]</span>.
      </div>

      <h1>Terms &amp; Conditions</h1>
      <p className="legal-page__updated">Last updated: [PLACEHOLDER date]</p>

      <h2>About us</h2>
      <p>
        This site is operated by Redline Supplements (ABN 39 538 456 199).
        By using this site or placing an order, you agree to these terms.
      </p>

      <h2>Products &amp; pricing</h2>
      <p>
        Prices are shown in Australian dollars (AUD) and include GST where
        applicable. We may change prices or product availability at any
        time without notice, and reserve the right to limit order
        quantities.
      </p>

      <h2>Orders &amp; payment</h2>
      <p>
        Payments are processed securely through Stripe. We don't see or
        store your card details. An order is only confirmed once payment
        has been successfully processed.
      </p>

      <h2>Delivery &amp; pickup</h2>
      <p>
        See our <a href="/shipping">Shipping</a> page for delivery and local
        pickup details.
      </p>

      <h2>Health &amp; usage disclaimer</h2>
      <p>
        [PLACEHOLDER — confirm this applies to your products, e.g.: "This
        product is a food/dietary supplement, not a substitute for a varied
        diet. Consult a healthcare professional before use if you are
        pregnant, breastfeeding, under 18, taking medication, or have a
        medical condition. Discontinue use and consult a doctor if adverse
        reactions occur."]
      </p>

      <h2>Returns</h2>
      <p>
        See our <a href="/returns">Returns &amp; Refunds</a> page.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        [PLACEHOLDER — standard liability limitation clause, to the extent
        permitted by Australian Consumer Law, which cannot be excluded.]
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of{' '}
        [PLACEHOLDER — your state, e.g. Victoria], Australia.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        We may update these terms from time to time. Continued use of the
        site after changes means you accept the updated terms.
      </p>

      <h2>Contact</h2>
      <p>
        <a href="mailto:hello@redlinesupplements.com.au">
          hello@redlinesupplements.com.au
        </a>
      </p>
    </main>
  );
}
