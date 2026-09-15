export const metadata = {
  title: 'Privacy Policy — Redline Supplements',
};

export default function PrivacyPage() {
  return (
    <main className="wrap legal-page">
      <div className="legal-page__draft-banner">
        <strong>DRAFT — for internal review, not legal advice.</strong> This
        is a starting skeleton, not a reviewed legal document. Please have it
        checked before publishing, and fill in every{' '}
        <span className="legal-page__placeholder">[PLACEHOLDER]</span>.
      </div>

      <h1>Privacy Policy</h1>
      <p className="legal-page__updated">Last updated: [PLACEHOLDER date]</p>

      <h2>What we collect</h2>
      <p>When you create an account, place an order, or contact us, we collect:</p>
      <ul>
        <li>Name, email address and delivery address (for orders shipped, via Stripe checkout)</li>
        <li>Order history and account login details</li>
        <li>Email address, if you sign up for new-product notifications</li>
      </ul>
      <p>
        We don't collect or store your payment card details — payments are
        handled directly by Stripe.
      </p>

      <h2>How we use it</h2>
      <p>To process and deliver your orders, respond to enquiries, and — only if you've opted in — let you know about new products.</p>

      <h2>Who we share it with</h2>
      <p>
        We use Stripe to process payments and Supabase to store account and
        order data. We don't sell your data to third parties.
      </p>

      <h2>Where your data is stored</h2>
      <p>
        [PLACEHOLDER — confirm the data region for your Supabase project and
        hosting provider, e.g. whether data is stored in Australia or
        overseas.]
      </p>

      <h2>Cookies</h2>
      <p>
        This site currently doesn't use third-party analytics or advertising
        cookies. It uses only the cookies needed for login sessions and
        checkout to work.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask to access or correct the personal information we hold
        about you by emailing us below. If you're unhappy with how we've
        handled your information, you can also contact the Office of the
        Australian Information Commissioner (OAIC).
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
