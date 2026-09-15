export const metadata = {
  title: 'Shipping — Redline Supplements',
};

export default function ShippingPage() {
  return (
    <main className="wrap legal-page">
      <div className="legal-page__draft-banner">
        <strong>DRAFT — for internal review.</strong> This page has not been
        published for accuracy yet. Every{' '}
        <span className="legal-page__placeholder">[PLACEHOLDER]</span> needs a
        real value from you before this goes live.
      </div>

      <h1>Shipping</h1>
      <p className="legal-page__updated">Last updated: [PLACEHOLDER date]</p>

      <h2>Dispatch time</h2>
      <p>
        Orders are dispatched within 24 hours.{' '}
        <em>
          (This matches the claim already on the Shop page — see the note in
          chat about whether this is safe to promise.)
        </em>
      </p>

      <h2>Local pickup</h2>
      <p>
        You can choose free local pickup at checkout instead of delivery:
      </p>
      <ul>
        <li>Hammers Gym, 244 Whitehorse Rd, Nunawading VIC 3131</li>
        <li>Mon, Tue, Wed, Thu: 10am–9:30pm</li>
        <li>Fri: 10am–8pm</li>
        <li>Sat: 9am–3pm</li>
        <li>Sun: Closed</li>
      </ul>

      <h2>Delivery</h2>
      <p>We currently ship within Australia only.</p>
      <ul>
        <li>Delivery time: [PLACEHOLDER — e.g. "2–5 business days metro, up to 10 regional"]</li>
        <li>Carrier: [PLACEHOLDER — e.g. Australia Post / Sendle]</li>
        <li>Shipping cost: Free on orders over $99. Orders under $99: $15 flat rate.</li>
        <li>Order tracking: [PLACEHOLDER — do you provide a tracking number/email?]</li>
      </ul>

      <h2>Delays</h2>
      <p>
        [PLACEHOLDER — standard note that delivery times are estimates and
        can be affected by carrier delays, public holidays, or high-demand
        periods.]
      </p>

      <h2>Questions</h2>
      <p>
        Contact us at{' '}
        <a href="mailto:hello@redlinesupplements.com.au">
          hello@redlinesupplements.com.au
        </a>{' '}
        about an order or delivery.
      </p>
    </main>
  );
}
