'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Easy-to-edit contact + offer details — update these when you're ready.
const REDLINE_INSTAGRAM_HANDLE = '@redlinesupplementsaus';
const REDLINE_INSTAGRAM_URL = 'https://instagram.com/redlinesupplementsaus';

const PARTNERS = [
  {
    name: 'Hammers Gym',
    logo: '/partners/hammers-gym-logo.png',
    blurb: 'Est. 1995 — a trusted local fitness centre and home to the training that fuels our community.',
    offers: [],
    // Optional — add Hammers Gym's site or Instagram link once you have it, and
    // the button below will appear automatically.
    websiteUrl: '',
  },
  {
    name: 'Prynce Detailing',
    logo: '/partners/prynce-detailing-logo.png',
    blurb: 'Premium car detailing — premium care, premium results.',
    offers: [
      'Redline customers: 10% off Prynce Detailing.',
      'Prynce customers: 10% off all Redline orders.',
    ],
    // Optional — add Prynce's site or Instagram link once you have it, and
    // the button below will appear automatically.
    websiteUrl: '',
  },
];

export default function Partners() {
  const sectionRef = useRef(null);
  const headerRefs = useRef([]);
  const gridRef = useRef(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      if (reduceMotion) return;

      const headerEls = headerRefs.current.filter(Boolean);
      gsap.set(headerEls, { opacity: 0, y: 16 });

      if (gridRef.current) {
        const cards = Array.from(gridRef.current.children);
        gsap.set(cards, { opacity: 0, y: 20 });

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top 82%',
          once: true,
          onEnter: () => {
            gsap
              .timeline({ defaults: { ease: 'power2.out' } })
              .to(headerEls, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 })
              .to(cards, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 }, '-=0.25');
          },
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="partners wrap" ref={sectionRef}>
      <p className="partners__eyebrow" ref={(el) => (headerRefs.current[0] = el)}>
        Redline Partners
      </p>
      <h2 className="partners__headline" ref={(el) => (headerRefs.current[1] = el)}>
        Proudly partnered with Hammers Gym &amp; Prynce Detailing
      </h2>
      <p className="partners__intro" ref={(el) => (headerRefs.current[2] = el)}>
        Local businesses backing each other — train hard, then take care of your ride.
      </p>

      <div className="partners-grid" ref={gridRef}>
        {PARTNERS.map((partner) => (
          <article className="partner-card" key={partner.name}>
            <div className="partner-card__logo-plate">
              <img src={partner.logo} alt={`${partner.name} logo`} className="partner-card__logo" />
            </div>
            <div className="partner-card__body">
              <h3 className="partner-card__name">{partner.name}</h3>
              <p className="partner-card__desc">{partner.blurb}</p>

              {partner.offers.length > 0 && (
                <ul className="partner-card__offers">
                  {partner.offers.map((offer) => (
                    <li key={offer}>{offer}</li>
                  ))}
                </ul>
              )}

              {partner.offers.length > 0 && (
                <p className="partner-card__redeem">
                  DM us on Instagram{' '}
                  <a href={REDLINE_INSTAGRAM_URL} target="_blank" rel="noreferrer">
                    {REDLINE_INSTAGRAM_HANDLE}
                  </a>{' '}
                  to get your code, then redeem it when you order.
                </p>
              )}

              <div className="partner-card__cta">
                <a href={REDLINE_INSTAGRAM_URL} target="_blank" rel="noreferrer" className="partner-card__btn">
                  Message us on Instagram
                </a>
                {partner.websiteUrl && (
                  <a
                    href={partner.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="partner-card__btn partner-card__btn--ghost"
                  >
                    Visit {partner.name}
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
