'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
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
function IconFlag() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 21V4" />
      <path d="M5 4h13l-3 4 3 4H5" />
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

const TRUST_ITEMS = [
  { icon: <IconTruck />, label: 'Free shipping over $99' },
  { icon: <IconFlag />, label: 'Made in Australia' },
  { icon: <IconBolt />, label: 'Dispatched within 24h' },
  { icon: <IconShield />, label: 'Secure checkout via Stripe' },
];

export default function ProductsClient({ products }) {
  const { cart, add, remove } = useCart();
  const [loading, setLoading] = useState(false);
  const cardRefs = useRef([]);

  const inCart = products.filter((p) => cart[p.id]);
  const total = inCart.reduce((sum, p) => sum + p.price_cents * cart[p.id], 0);
  const fmt = (cents) => `$${(cents / 100).toFixed(2)}`;

  const checkout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: inCart.map((p) => ({ id: p.id, quantity: cart[p.id] })),
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

  // Product-card reveal — runs before paint so cards don't flash visible first.
  useIsoLayoutEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      if (!reduceMotion) {
        const cards = cardRefs.current.filter(Boolean);
        gsap.set(cards, { opacity: 0, y: 24 });
        ScrollTrigger.batch(cards, {
          start: 'top 88%',
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.08,
              ease: 'power2.out',
              clearProps: 'transform',
            }),
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <main>
      <section className="wrap products-intro">
        <h1 className="section-title">Shop the range</h1>
        <p className="products-intro__sub">
          Australian-made performance supplements — pure formulas, nothing hidden on the label.
        </p>
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

      <section id="products" className="wrap products">
        <div className="grid">
          {products.map((p, i) => (
            <article key={p.id} className="card" ref={(el) => (cardRefs.current[i] = el)}>
              <div className="thumb">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} className="thumb__photo" />
                ) : (
                  <img src="/logo.jpg" alt="" className="thumb__watermark" aria-hidden="true" />
                )}
              </div>
              <div className="card__body">
                <h3>{p.name}</h3>
                <p className="desc">{p.description}</p>
                <div className="card__foot">
                  <span className="price">{fmt(p.price_cents)}</span>
                  <button onClick={() => add(p.id)}>Add</button>
                </div>
              </div>
            </article>
          ))}
        </div>
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
            <button className="checkout" disabled={loading} onClick={checkout}>
              {loading ? 'Redirecting to payment…' : 'Checkout'}
            </button>
          </div>
        </aside>
      )}
    </main>
  );
}
