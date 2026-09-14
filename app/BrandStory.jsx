'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const BEATS = [
  {
    headline: 'The supplement aisle is full of noise.',
    sub: 'Imported fillers, big claims, brands that have never met the people they sell to. Redline started as the answer to that.',
  },
  {
    headline: 'One person. A name behind every tub.',
    sub: 'No boardroom. No faceless label. Redline is run by one Australian who answers the messages, checks the batches, and stands behind everything that goes out the door.',
  },
  {
    headline: 'No shortcuts. Built to be trusted.',
    sub: 'Formulas with nothing hidden on the label — plus the training protocols, resources and straight answers most brands never bother to give you. More than nutrition.',
  },
  {
    headline: 'Fuel for athletes who train past comfortable.',
    sub: 'Fighters, footy players, lifters — every code, every corner of the country. This is your reliable corner. Every engine has a redline. We help you find yours.',
  },
];

export default function BrandStory() {
  const rootRef = useRef(null);
  const pinRef = useRef(null);
  const bgMarkRef = useRef(null);
  const beatRefs = useRef([]);
  const dotRefs = useRef([]);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: '(min-width: 900px) and (prefers-reduced-motion: no-preference)',
          isSimple: '(max-width: 899px), (prefers-reduced-motion: reduce)',
        },
        (context) => {
          const { isDesktop } = context.conditions;

          if (isDesktop) {
            // Pinned, scroll-scrubbed cross-fade sequence.
            const beats = beatRefs.current;
            const dots = dotRefs.current;
            const hold = 1;
            const trans = 0.6;

            gsap.set(beats[0], { opacity: 1, y: 0, scale: 1 });
            beats.slice(1).forEach((el) => gsap.set(el, { opacity: 0, y: 28, scale: 0.97 }));
            dots.forEach((d, i) => d && d.classList.toggle('story__dot--active', i === 0));

            const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
            let t = hold;
            for (let i = 1; i < beats.length; i++) {
              tl.to(beats[i - 1], { opacity: 0, y: -28, scale: 1.03, duration: trans }, t)
                .to(beats[i], { opacity: 1, y: 0, scale: 1, duration: trans }, t)
                .call(
                  () => dots.forEach((d, di) => d && d.classList.toggle('story__dot--active', di === i)),
                  null,
                  t + trans / 2
                );
              t += trans + hold;
            }
            // Continuous slow zoom + drift on the brand mark across the whole pin.
            tl.to(bgMarkRef.current, { scale: 1.16, rotate: 5, ease: 'none', duration: t }, 0);
            // Release: fade the beats right before unpin.
            tl.to(
              beats[beats.length - 1],
              { opacity: 0, y: -20, duration: 0.5, ease: 'power1.in' },
              t - 0.5
            );

            ScrollTrigger.create({
              trigger: rootRef.current,
              start: 'top top',
              end: () => '+=' + window.innerHeight * (t + 0.6),
              pin: pinRef.current,
              scrub: 1,
              anticipatePin: 1,
              animation: tl,
            });
          } else {
            // Simple stacked reveal — no pin, no cross-fade fighting mobile scroll.
            const beats = beatRefs.current;
            beats.forEach((el) => {
              if (!el) return;
              if (reduceMotion) {
                gsap.set(el, { opacity: 1, y: 0 });
                return;
              }
              gsap.fromTo(
                el,
                { opacity: 0, y: 24 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.7,
                  ease: 'power2.out',
                  scrollTrigger: {
                    trigger: el,
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                    once: true,
                  },
                }
              );
            });
          }
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="story" ref={rootRef}>
      <div className="story__pin" ref={pinRef}>
        <div className="story__bg">
          <div className="story__bg-texture" aria-hidden="true" />
          <img src="/logo.jpg" alt="" ref={bgMarkRef} className="story__bg-mark" aria-hidden="true" />
          <div className="story__bg-overlay" aria-hidden="true" />
        </div>
        <div className="story__beats">
          {BEATS.map((beat, i) => (
            <div
              className="story__beat"
              key={beat.headline}
              ref={(el) => (beatRefs.current[i] = el)}
            >
              <h2>{beat.headline}</h2>
              <p>{beat.sub}</p>
            </div>
          ))}
        </div>
        <div className="story__progress" aria-hidden="true">
          {BEATS.map((beat, i) => (
            <span className="story__dot" key={beat.headline} ref={(el) => (dotRefs.current[i] = el)} />
          ))}
        </div>
      </div>
    </section>
  );
}
