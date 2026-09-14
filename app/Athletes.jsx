'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Per-athlete overrides, keyed by name, for cases the shared card styling
// can't infer from the database alone:
//  - objectPosition: keeps the right part of the photo in frame when a
//    source image's crop (portrait vs. landscape) doesn't suit the card's
//    default square crop.
//  - alt: a fuller, athlete-specific description for accessibility.
const PHOTO_OVERRIDES = {
  'Daniel Smith': {
    objectPosition: 'center 15%',
  },
  'Cooper MacDonald': {
    objectPosition: '58% center',
    alt: 'Cooper MacDonald playing Australian Rules football for Southport Sharks',
  },
};

function AthletePhoto({ athlete, imgClassName, placeholderClassName, watermarkClassName }) {
  const overrides = PHOTO_OVERRIDES[athlete.name];

  if (athlete.image_url) {
    return (
      <img
        src={athlete.image_url}
        alt={overrides?.alt || athlete.name}
        className={imgClassName}
        loading="lazy"
        style={overrides?.objectPosition ? { objectPosition: overrides.objectPosition } : undefined}
      />
    );
  }
  return (
    <div className={placeholderClassName}>
      <img src="/logo.jpg" alt="" className={watermarkClassName} aria-hidden="true" />
    </div>
  );
}

function AthleteCard({ athlete }) {
  const metaLine = [athlete.promotion, athlete.weight_class].filter(Boolean).join(' · ');

  return (
    <article className="athlete-card">
      <div className="athlete-card__media">
        <AthletePhoto
          athlete={athlete}
          imgClassName="athlete-card__photo"
          placeholderClassName="athlete-card__placeholder"
          watermarkClassName="athlete-card__watermark"
        />
      </div>
      <div className="athlete-card__body">
        {athlete.record && <span className="athlete-card__record">{athlete.record}</span>}
        <h4>{athlete.name}</h4>
        {athlete.gym && <p className="athlete-card__gym">{athlete.gym}</p>}
        {metaLine && <p className="athlete-card__meta">{metaLine}</p>}
        {athlete.quote && <p className="athlete-card__quote">{athlete.quote}</p>}
      </div>
    </article>
  );
}

export default function Athletes({ athletes }) {
  const sectionRef = useRef(null);
  const headerRefs = useRef([]);
  const gridRef = useRef(null);

  useEffect(() => {
    if (!athletes.length) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      if (reduceMotion) return;

      const headerEls = headerRefs.current.filter(Boolean);
      gsap.set(headerEls, { opacity: 0, y: 20 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 78%',
        once: true,
        onEnter: () => gsap.to(headerEls, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }),
      });

      if (gridRef.current) {
        const cards = Array.from(gridRef.current.children);
        gsap.set(cards, { opacity: 0, y: 24 });
        ScrollTrigger.batch(cards, {
          start: 'top 90%',
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.06,
              ease: 'power2.out',
              clearProps: 'transform',
            }),
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, [athletes.length]);

  if (!athletes.length) return null;

  return (
    <section className="athletes wrap" ref={sectionRef}>
      <p className="athletes__eyebrow" ref={(el) => (headerRefs.current[0] = el)}>
        Redline Athletes
      </p>
      <h2 className="athletes__headline" ref={(el) => (headerRefs.current[1] = el)}>
        Our Athletes
      </h2>
      <p className="athletes__intro" ref={(el) => (headerRefs.current[2] = el)}>
        Meet the athletes who run on Redline.
      </p>

      <div className="athletes-grid" ref={gridRef}>
        {athletes.map((athlete) => (
          <AthleteCard key={athlete.id} athlete={athlete} />
        ))}
      </div>

      <p className="athletes-note">More athletes joining the ranks soon.</p>
    </section>
  );
}
