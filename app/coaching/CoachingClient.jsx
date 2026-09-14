'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const BOOKING_URL = 'https://calendly.com/redlinesupplementsaus/30min';

const STEPS = [
  {
    title: 'Free consult, no obligation',
    desc: "A relaxed virtual session where we get to know each other, look at your current habits, training, past coaching, and how you like to eat and train — plus a quick health check so your plan's built safely.",
  },
  {
    title: 'Get set up',
    desc: "If it's a fit, you get access to your own tailored software, on desktop and mobile.",
  },
  {
    title: 'Weekly check-ins',
    desc: 'Saturday or Sunday at a time that suits you. Optional but recommended — talking through problems directly means we fix them faster.',
  },
  {
    title: 'Always-on support',
    desc: 'Everything else runs through messaging, whenever you need it.',
  },
];

export default function CoachingClient() {
  const rootRef = useRef(null);
  const heroRef = useRef(null);
  const heroEyebrowRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroSubRef = useRef(null);
  const heroCtaRef = useRef(null);

  const methodRef = useRef(null);
  const methodEls = useRef([]);
  const toolsRef = useRef(null);
  const toolsEls = useRef([]);
  const stepsSectionRef = useRef(null);
  const stepsHeaderRef = useRef(null);
  const stepsGridRef = useRef(null);
  const closingRef = useRef(null);
  const closingEls = useRef([]);

  useIsoLayoutEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const heroEls = [heroEyebrowRef.current, heroTitleRef.current, heroSubRef.current, heroCtaRef.current].filter(
        Boolean
      );

      if (reduceMotion) {
        gsap.set(heroEls, { opacity: 1, y: 0 });
      } else {
        gsap.set(heroEls, { opacity: 0, y: 22 });
        gsap
          .timeline({ defaults: { ease: 'power2.out' } })
          .to(heroEyebrowRef.current, { opacity: 1, y: 0, duration: 0.5 })
          .to(heroTitleRef.current, { opacity: 1, y: 0, duration: 0.7 }, '-=0.25')
          .to(heroSubRef.current, { opacity: 1, y: 0, duration: 0.6 }, '-=0.35')
          .to(heroCtaRef.current, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3');
      }

      const reveal = (trigger, els, opts = {}) => {
        const nodes = els.filter(Boolean);
        if (!trigger || !nodes.length) return;
        if (reduceMotion) {
          gsap.set(nodes, { opacity: 1, y: 0 });
          return;
        }
        gsap.set(nodes, { opacity: 0, y: opts.y ?? 24 });
        ScrollTrigger.create({
          trigger,
          start: 'top 80%',
          once: true,
          onEnter: () =>
            gsap.to(nodes, {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: 'power2.out',
              stagger: opts.stagger ?? 0.1,
            }),
        });
      };

      reveal(methodRef.current, methodEls.current);
      reveal(toolsRef.current, toolsEls.current);
      reveal(stepsSectionRef.current, [stepsHeaderRef.current]);

      if (stepsGridRef.current) {
        const cards = Array.from(stepsGridRef.current.children);
        if (reduceMotion) {
          gsap.set(cards, { opacity: 1, y: 0 });
        } else {
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
      }

      reveal(closingRef.current, closingEls.current);
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={rootRef}>
      <section className="coaching-hero" ref={heroRef}>
        <div className="coaching-hero__inner">
          <p className="coaching-hero__eyebrow" ref={heroEyebrowRef}>
            Online Coaching
          </p>
          <h1 className="coaching-hero__title" ref={heroTitleRef}>
            Coaching that works with your body, not against it.
          </h1>
          <p className="coaching-hero__sub" ref={heroSubRef}>
            Tailored training, nutrition and habit coaching — built on a method I've lived,
            refined for how you actually train and eat.
          </p>
          <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="hero__cta" ref={heroCtaRef}>
            Book your free consult
          </a>
        </div>
      </section>

      <section className="coaching-section" ref={methodRef}>
        <div className="coaching-section__inner">
          <h2 className="coaching-section__title" ref={(el) => (methodEls.current[0] = el)}>
            A method, not a template.
          </h2>
          <p className="coaching-section__body" ref={(el) => (methodEls.current[1] = el)}>
            Most coaching hands you a generic plan and hopes it sticks. Mine is built around how
            your body actually uses fuel — cycling your carbs and timing your nutrition to work
            with your insulin response, not against it. It's the approach that transformed my own
            training, and I tailor it to every client rather than forcing one template on
            everyone.
          </p>
        </div>
      </section>

      <section className="coaching-section coaching-section--alt" ref={toolsRef}>
        <div className="coaching-section__inner">
          <h2 className="coaching-section__title" ref={(el) => (toolsEls.current[0] = el)}>
            Trackers you'll actually use.
          </h2>
          <p className="coaching-section__body" ref={(el) => (toolsEls.current[1] = el)}>
            I've been the client drowning in spreadsheets, so I built the opposite. Clean,
            genuinely easy trackers, tailored to each person — the kind you'll actually keep up
            with, because they take seconds, not effort. Everything's on your phone or your
            computer, wherever you are.
          </p>
        </div>
      </section>

      <section className="coaching-steps" ref={stepsSectionRef}>
        <div className="coaching-steps__inner">
          <h2 className="coaching-section__title" ref={stepsHeaderRef}>
            How it works.
          </h2>
          <div className="coaching-steps__grid" ref={stepsGridRef}>
            {STEPS.map((step, i) => (
              <div className="coaching-step" key={step.title}>
                <span className="coaching-step__num">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="coaching-step__title">{step.title}</h3>
                <p className="coaching-step__desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="story__cta" ref={closingRef}>
        <h2 className="story__cta-title" ref={(el) => (closingEls.current[0] = el)}>
          Ready to train smarter?
        </h2>
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="story__cta-btn"
          ref={(el) => (closingEls.current[1] = el)}
        >
          Book your free consult
        </a>
      </section>
    </main>
  );
}
