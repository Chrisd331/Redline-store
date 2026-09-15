'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCart } from '../CartContext';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function IconTruck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7h11v9H3z" />
      <path d="M14 10h4l3 3v3h-7z" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17.5" cy="18" r="1.6" />
    </svg>
  );
}
function IconBolt() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2 4 14h6l-1 8 9-12h-6z" />
    </svg>
  );
}
function IconShield() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
function IconClock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

const TRUST_ITEMS = [
  { icon: <IconTruck />, label: 'Free shipping over $99' },
  { icon: <IconBolt />, label: 'Dispatched within 24h' },
  { icon: <IconShield />, label: 'Secure checkout via Stripe' },
];

const COMING_SOON_COUNT = 3;

const PICKUP_LOCATION = {
  name: 'Hammers Gym, Nunawading',
  address: '244 Whitehorse Rd, Nunawading VIC 3131',
  hours: [
    'Mon, Tue, Wed, Thu: 10am–9:30pm',
    'Fri: 10am–8pm',
    'Sat: 9am–3pm',
    'Sun: Closed',
  ],
};

export default function ProductsClient({ products }) {
  const { cart, add, remove } = useCart();
  const [loading, setLoading] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [fulfilment, setFulfilment] = useState('delivery');
  const featuredRef = useRef(null);
  const cardRefs = useRef([]);
  const comingSoonRefs = useRef([]);

  const [featured, ...rest] = products;

  const inCart = products.filter((p) => cart[p.id]);
  const total = inCart.reduce((sum, p) => sum + p.price_cents * cart[p.id], 0);
  const fmt = (cents) => `$${(cents / 100).toFixed(2)}`;
  const featuredTeaser = featured?.description?.split('\n\n')[0] || '';

  const checkout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: inCart.map((p) => ({ id: p.id, quantity: cart[p.id] })),
          fulfilment,
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || 'Checkout failed. Please try again.');
    } catch (err) {
      alert('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Notify-me: no subscriber database yet, so this opens a pre-filled email
  // to the team instead of silently pretending to save it somewhere.
  const notifySubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent('Notify me about new Redline products');
    const body = encodeURIComponent(`Please add this email to your new-product notification list: ${notifyEmail}`);
    window.location.href = `mailto:hello@redlinesupplements.com.au?subject=${subject}&body=${body}`;
  };

  // Card reveal — runs before paint so cards don't flash visible first.
  useIsoLayoutEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      if (!reduceMotion) {
        if (featuredRef.current) {
          gsap.set(featuredRef.current, { opacity: 0, y: 24 });
          ScrollTrigger.create({
            trigger: featuredRef.current,
            start: 'top 88%',
            once: true,
            onEnter: () => gsap.to(featuredRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }),
          });
        }

        const cards = cardRefs.current.filter(Boolean);
        if (cards.length) {
          gsap.set(cards, { opacity: 0, y: 24 });
          ScrollTrigger.batch(cards, {
            start: 'top 88%',
            once: true,
            onEnter: (batch) =>
              gsap.to(batch, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out', clearProps: 'transform' }),
          });
        }

        const comingSoon = comingSoonRefs.current.filter(Boolean);
        if (comingSoon.length) {
          gsap.set(comingSoon, { opacity: 0, y: 20 });
          ScrollTrigger.batch(comingSoon, {
            start: 'top 90%',
            once: true,
            onEnter: (batch) =>
              gsap.to(batch, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out', clearProps: 'transform' }),
          });
        }
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <main>
      <section className="wrap products-intro">
        <h1 className="section-title">Shop the range</h1>
        <p className="products-intro__sub">Performance supplements — pure formulas, nothing hidden on the label.</p>
      </section>

      <section className="trust-row">
        <div className="trust-row__inner">
          {TRUST_ITEMS.map((item) => (
            <div className="trust-item" key={item.label}>
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="products" className="wrap shop-section">
        {featured && (
          <article className="shop-featured" ref={featuredRef}>
            <Link href={`/products/${featured.slug}`} className="shop-featured__media">
              {featured.image_url ? (
                <img src={featured.image_url} alt={featured.name} className="shop-featured__photo" />
              ) : (
                <img src="/logo.jpg" alt="" className="shop-featured__watermark" aria-hidden="true" />
              )}
            </Link>
            <div className="shop-featured__body">
              <p className="shop-featured__eyebrow">Redline's first product</p>
              <h2 className="shop-featured__name">{featured.name}</h2>
              <p className="shop-featured__tagline">Our first release — the foundation of every stack.</p>
              {featuredTeaser && <p className="shop-featured__desc">{featuredTeaser}</p>}
              <div className="shop-featured__foot">
                <span className="shop-featured__price">{fmt(featured.price_cents)}</span>
                <button onClick={() => add(featured.id)}>Add</button>
              </div>
              <Link href={`/products/${featured.slug}`} className="shop-featured__more">
                Full details &amp; ingredients →
              </Link>
            </div>
          </article>
        )}

        {rest.length > 0 && (
          <div className="grid shop-more-grid">
            {rest.map((p, i) => (
              <article key={p.id} className="card" ref={(el) => (cardRefs.current[i] = el)}>
                <Link href={`/products/${p.slug}`} className="thumb">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="thumb__photo" />
                  ) : (
                    <img src="/logo.jpg" alt="" className="thumb__watermark" aria-hidden="true" />
                  )}
                </Link>
                <div className="card__body">
                  <h3>
                    <Link href={`/products/${p.slug}`}>{p.name}</Link>
                  </h3>
                  <p className="desc">{p.description}</p>
                  <div className="card__foot">
                    <span className="price">{fmt(p.price_cents)}</span>
                    <button onClick={() => add(p.id)}>Add</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="wrap coming-soon">
        <h2 className="section-title">More on the way</h2>
        <p className="coming-soon__intro">We're expanding the range — here's a preview of what's coming.</p>
        <div className="coming-soon__grid">
          {Array.from({ length: COMING_SOON_COUNT }).map((_, i) => (
            <div className="coming-soon__card" key={i} ref={(el) => (comingSoonRefs.current[i] = el)}>
              <IconClock />
              <span>Coming Soon</span>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap notify">
        <h2 className="section-title">Be first to know</h2>
        <p className="notify__sub">Get notified the moment new products drop.</p>
        <form className="notify__form" onSubmit={notifySubmit}>
          <input
            type="email"
            required
            placeholder="you@email.com"
            value={notifyEmail}
            onChange={(e) => setNotifyEmail(e.target.value)}
            aria-label="Email address"
          />
          <button type="submit">Notify me</button>
        </form>
      </section>

      {inCart.length > 0 && (
        <aside id="cart" className="cart wrap">
          <div>
            <h2>YOUR CART</h2>
            {inCart.map((p) => (
              <div key={p.id} className="cartline">
                <span>
                  {p.name} × {cart[p.id]}
                </span>
                <div>
                  <button aria-label={`Remove one ${p.name}`} onClick={() => remove(p.id)}>
                    −
                  </button>
                  <button aria-label={`Add one ${p.name}`} onClick={() => add(p.id)}>
                    +
                  </button>
                </div>
              </div>
            ))}
            <div className="cartTotal">
              <span>Total</span>
              <span>{fmt(total)}</span>
            </div>

            <fieldset className="fulfilment">
              <legend>Fulfilment</legend>
              <label className="fulfilment__option">
                <input
                  type="radio"
                  name="fulfilment"
                  value="pickup"
                  checked={fulfilment === 'pickup'}
                  onChange={() => setFulfilment('pickup')}
                />
                Pick up — {PICKUP_LOCATION.name} — $0
              </label>
              <label className="fulfilment__option">
                <input
                  type="radio"
                  name="fulfilment"
                  value="delivery"
                  checked={fulfilment === 'delivery'}
                  onChange={() => setFulfilment('delivery')}
                />
                Delivery
              </label>

              {fulfilment === 'pickup' && (
                <div className="fulfilment__pickup-details">
                  <p>{PICKUP_LOCATION.address}</p>
                  <ul>
                    {PICKUP_LOCATION.hours.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              )}
            </fieldset>

            <button className="checkout" disabled={loading} onClick={checkout}>
              {loading ? 'Redirecting to payment…' : 'Checkout'}
            </button>
          </div>
        </aside>
      )}
    </main>
  );
}
