'use client';

import Link from 'next/link';
import { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const HERO_LINES = ['Every engine', 'has a redline.'];

export default function Hero() {
  const heroRef = useRef(null);
  const tagRef = useRef(null);
  const lineRefs = useRef([]);
  const subRef = useRef(null);
  const barRef = useRef(null);
  const ctaRef = useRef(null);
  const logoWrapRef = useRef(null);

  useIsoLayoutEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      if (!reduceMotion) {
        const heroEls = [
          tagRef.current,
          ...lineRefs.current,
          subRef.current,
          barRef.current,
          ctaRef.current,
          logoWrapRef.current,
        ].filter(Boolean);
        gsap.set(heroEls, { opacity: 0 });
        gsap.set(lineRefs.current, { y: 28 });
        gsap.set([tagRef.current, subRef.current, ctaRef.current], { y: 14 });
        gsap.set(barRef.current, { scaleX: 0, transformOrigin: 'left center' });
        gsap.set(logoWrapRef.current, { scale: 0.85 });

        gsap
          .timeline({ defaults: { ease: 'power2.out' } })
          .to(tagRef.current, { opacity: 1, y: 0, duration: 0.5 })
          .to(lineRefs.current, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, '-=0.25')
          .to(subRef.current, { opacity: 1, y: 0, duration: 0.6 }, '-=0.35')
          .to(barRef.current, { opacity: 1, scaleX: 1, duration: 0.5 }, '-=0.3')
          .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
          .to(logoWrapRef.current, { opacity: 1, scale: 1, duration: 0.9, ease: 'back.out(1.5)' }, '-=0.8');

        gsap.to(logoWrapRef.current, {
          yPercent: 18,
          ease: 'none',
          scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" ref={heroRef}>
      <div className="hero__inner">
        <div className="hero__text">
          <p className="hero__tag" ref={tagRef}>
            Performance Supplements · Australia
          </p>
          <h1 className="hero__title">
            {HERO_LINES.map((line, i) => (
              <span className="hero__title-line" key={line} ref={(el) => (lineRefs.current[i] = el)}>
                {line}
              </span>
            ))}
          </h1>
          <p className="hero__sub" ref={subRef}>
            Australian-made fuel for fighters, footy players and lifters who train past
            comfortable.
          </p>
          <div className="hero__bar" ref={barRef} aria-hidden="true" />
          <Link href="/products" className="hero__cta" ref={ctaRef}>
            Shop the range
          </Link>
        </div>
        <div className="hero__logo-wrap" ref={logoWrapRef}>
          <span className="hero__logo-glow" aria-hidden="true" />
          <img src="/logo.jpg" alt="Redline Supplements" className="hero__logo" />
        </div>
      </div>
    </section>
  );
}
