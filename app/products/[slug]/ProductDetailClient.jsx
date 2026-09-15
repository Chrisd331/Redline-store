'use client';

import Link from 'next/link';
import { useCart } from '../../CartContext';

const CREDENTIALS = [
  {
    title: 'SGS GMP Certification',
    body: 'Good Manufacturing Practices for dietary supplements (21 CFR Part 111).',
  },
  {
    title: 'ISO 22000:2018',
    body: 'Food Safety Management System certification.',
  },
  {
    title: 'HACCP Certification',
    body: 'hazard analysis and critical control point food-safety system.',
  },
  {
    title: 'US FDA Food Facility Registration',
    body: 'the manufacturing facility is registered with the US FDA (a registration required to export food to the US; NOT FDA approval or endorsement of the product).',
  },
  {
    title: 'Halal Certification',
    body: '',
  },
  {
    title: 'Chinese Export Food Producer Registration',
    body: 'facility registered with Chinese customs as an approved export-food producer.',
  },
];

export default function ProductDetailClient({ product }) {
  const { add } = useCart();
  const fmt = (cents) => `$${(cents / 100).toFixed(2)}`;
  const paragraphs = (product.description || '').split('\n\n').filter(Boolean);

  const hasSpec = product.net_weight_g && product.serving_size_g && product.serves_per_container;
  const pricePerServe = hasSpec ? Math.round(product.price_cents / product.serves_per_container) : null;

  return (
    <main className="wrap product-detail">
      <Link href="/products" className="product-detail__back">
        ← Back to shop
      </Link>

      <div className="product-detail__layout">
        <div className="product-detail__image">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="product-detail__photo" />
          ) : (
            <img src="/logo.jpg" alt="" className="product-detail__watermark" aria-hidden="true" />
          )}
        </div>

        <div>
          <h1 className="product-detail__name">{product.name}</h1>
          <div className="product-detail__price">{fmt(product.price_cents)}</div>

          {hasSpec && (
            <dl className="product-detail__spec">
              <div>
                <dt>Net weight</dt>
                <dd>{product.net_weight_g}g</dd>
              </div>
              <div>
                <dt>Serving size</dt>
                <dd>{product.serving_size_g}g</dd>
              </div>
              <div>
                <dt>Serves per tub</dt>
                <dd>{product.serves_per_container}</dd>
              </div>
              <div>
                <dt>Price per serve</dt>
                <dd>{pricePerServe}c</dd>
              </div>
            </dl>
          )}

          <div className="product-detail__desc">
            {paragraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {product.directions && (
            <div className="product-detail__section">
              <h2>Directions</h2>
              <p>{product.directions}</p>
            </div>
          )}

          {product.ingredients && (
            <div className="product-detail__section">
              <h2>Ingredients</h2>
              <p>{product.ingredients}</p>
            </div>
          )}

          <div className="product-detail__cta">
            <button type="button" className="product-detail__add" onClick={() => add(product.id)}>
              Add to cart
            </button>
          </div>
        </div>
      </div>

      <section className="credentials">
        <h2 className="credentials__title">Supplier Documentation &amp; Quality Credentials</h2>
        <p className="credentials__intro">
          Redline Creatine is produced in a manufacturing facility that holds the following
          quality credentials and documentation. These are supplier/manufacturer credentials and
          facility registrations — not product approvals or endorsements — and full
          documentation is available on request.
        </p>
        <ul className="credentials__list">
          {CREDENTIALS.map((c) => (
            <li key={c.title}>
              <strong>{c.title}</strong>
              {c.body && <> — {c.body}</>}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
