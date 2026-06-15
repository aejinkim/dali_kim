'use client';

import { useRef, useEffect, useLayoutEffect, useState, Fragment } from 'react';

const INTRO = "Hello, My name is Dali Kim.";
const BODY = "I design products for systems where mistakes have consequences. From blockchain infrastructure and financial networks to aerospace ground stations, my work focuses on turning complexity into clarity, trust, and action.";

const ALL_WORDS = [...INTRO.split(' '), ...BODY.split(' ')];
const N = ALL_WORDS.length;

const SLIDE_END = 0.2;
const REVEAL_END = 0.84;   // text fully revealed by this progress point
const REVEAL_WINDOW = 0.16;

const wordRevealThreshold = (idx: number) =>
  (idx / N) * (1 - REVEAL_WINDOW) + REVEAL_WINDOW;

const TAGS_START = 0.91;   // tags appear after reveal

const SKILL_TAGS: Array<{ label: string; color: string }> = [
  { label: 'AI-Native Product',   color: 'var(--color-tag-pink)' },
  { label: 'Vibe coding',         color: 'var(--color-tag-mint)' },
  { label: 'Financial UX',        color: 'var(--color-canvas-bg)' },
  { label: 'Web3 Product Design', color: 'var(--color-tag-blush)' },
  { label: 'Mobile App',          color: 'var(--color-tag-blue)' },
  { label: 'Design System',       color: 'var(--color-tag-lime)' },
  { label: 'Graphic Design',      color: 'var(--color-tag-green)' },
  { label: 'Pitch Deck',          color: 'var(--color-tag-lavender)' },
  { label: 'Motion Graphic',      color: 'var(--color-tag-peach)' },
];

const CARD_TRIGGERS = [
  { idx: 5,  key: 'dali-kim',   rotate: -11.2, offsetY: 18,  offsetX:   0 },
  { idx: 16, key: 'blockchain', rotate:  12,   offsetY: 18,  offsetX: 200 },
  { idx: 22, key: 'aerospace',  rotate:  -2.1, offsetY: 46,  offsetX: 240 },
] as const;

type CardKey = typeof CARD_TRIGGERS[number]['key'];

const TRIGGER_MAP = new Map<number, CardKey>(CARD_TRIGGERS.map(t => [t.idx, t.key as CardKey]));

// Dali(4) Kim.(5) / blockchain(16) / aerospace(22)
const BOLD_WORDS = new Set([4, 5, 16, 22]);

export default function BioSection() {
  const sectionRef   = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef    = useRef<HTMLDivElement>(null);
  const triggerRefs  = useRef<Map<CardKey, HTMLSpanElement>>(new Map());
  const [cardPos, setCardPos] = useState<Map<CardKey, { left: number; top: number }>>(new Map());
  const [progress, setProgress] = useState(0);
  const [vw, setVw] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1920));

  useLayoutEffect(() => {
    const s = sectionRef.current;
    if (!s) return;
    const { top, height } = s.getBoundingClientRect();
    const scrollable = height - window.innerHeight;
    if (scrollable <= 0) return;
    setProgress(Math.min(Math.max(-top / scrollable, 0), 1));
  }, []);

  // Scroll progress
  useEffect(() => {
    const onScroll = () => {
      const s = sectionRef.current;
      if (!s) return;
      const { top, height } = s.getBoundingClientRect();
      const p = Math.min(Math.max(-top / (height - window.innerHeight), 0), 1);
      setProgress(p);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Measure trigger word positions relative to container (stable in sticky layout)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const measure = () => {
      setVw(window.innerWidth);
      const positions = new Map<CardKey, { left: number; top: number }>();
      const cRect = container.getBoundingClientRect();
      triggerRefs.current.forEach((el, key) => {
        const wRect = el.getBoundingClientRect();
        positions.set(key, {
          left: wRect.left - cRect.left,
          top:  wRect.top  - cRect.top,
        });
      });
      setCardPos(positions);
    };
    // Measure after fonts + layout settle
    const id = setTimeout(measure, 100);
    window.addEventListener('resize', measure);
    return () => { clearTimeout(id); window.removeEventListener('resize', measure); };
  }, []);

  const xScale = Math.max(0, Math.min(1, (vw - 1024) / 896));
  const isMobile = vw <= 768;

  if (isMobile) {
    return (
      <section id="about" className="bg-white" style={{ position: 'relative' }}>
        <div style={{ position: 'relative', padding: '40px var(--page-gutter) 60px', overflow: 'hidden' }}>
          <img
            src="/dali_kim_photo2.png"
            alt=""
            style={{
              position: 'absolute', right: 0, top: 0,
              width: 45, height: 58,
              objectFit: 'cover',
              transform: 'rotate(12deg)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
            }}
          />
          <video
            src="/bio_blockchain1.mp4"
            autoPlay muted loop playsInline
            style={{
              position: 'absolute', left: 'var(--page-gutter)', top: 68,
              width: 60, height: 34,
              objectFit: 'cover',
              transform: 'rotate(10.2deg)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
          />
          <img
            src="/gk2_01.png"
            alt=""
            style={{
              position: 'absolute', right: 0, top: 130,
              width: 53, height: 52,
              objectFit: 'contain',
              transform: 'rotate(-2.1deg)',
            }}
          />

          <div
            style={{
              fontFamily: 'var(--font-google-sans-flex), sans-serif',
              fontWeight: 300,
              fontSize: 'var(--bio-font-size)',
              lineHeight: 1.3,
              letterSpacing: '-0.01em',
              color: 'var(--color-ink)',
              position: 'relative',
              zIndex: 1,
              maxWidth: 'calc(100% - 56px)',
            }}
          >
            <p style={{ margin: '0 0 4px' }}>
              Hello, My name is <span style={{ fontWeight: 600 }}>Dali Kim.</span>
            </p>
            <p style={{ margin: 0 }}>
              I design products for systems where mistakes have consequences. From{' '}
              <span style={{ fontWeight: 600 }}>blockchain</span> infrastructure and financial networks to{' '}
              <span style={{ fontWeight: 600 }}>aerospace</span> ground stations, my work focuses on turning complexity into clarity, trust, and action.
            </p>
          </div>

          <div style={{ marginTop: 40, display: 'flex', gap: '42px', position: 'relative', zIndex: 1 }}>
            {[0, 1].map(col => (
              <div key={col} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {SKILL_TAGS.filter((_, i) => i % 2 === col).map(({ label, color }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: 'var(--bio-tag-dot)', height: 'var(--bio-tag-dot)', borderRadius: '50%', background: color, flexShrink: 0 }} />
                    <span style={{
                      fontFamily: 'var(--font-google-sans-flex), sans-serif',
                      fontWeight: 300,
                      fontSize: 'var(--bio-tag-font)',
                      lineHeight: 1.4,
                      letterSpacing: '-0.12px',
                      color: 'var(--color-ink)',
                      whiteSpace: 'nowrap',
                    }}>{label}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const revealProgress = Math.max(0, Math.min(1, (progress - SLIDE_END) / (REVEAL_END - SLIDE_END)));

  const visibleCards = new Set(
    CARD_TRIGGERS
      .filter(t => revealProgress >= wordRevealThreshold(t.idx))
      .map(t => t.key)
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative bg-white"
      style={{ height: '350vh', marginTop: '-150vh', zIndex: 1 }}
    >
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen overflow-hidden flex items-center justify-center"
        style={{ padding: 'var(--page-gutter)' }}
      >
        <div style={{ width: '100%', maxWidth: '1920px' }}>
          <div ref={containerRef} style={{ position: 'relative', width: '100%', maxWidth: 'var(--bio-container-width)', margin: '0 auto' }}>

            {/* Cards: appear above each trigger word on scroll reveal */}
            {CARD_TRIGGERS.map(trigger => {
              const pos     = cardPos.get(trigger.key);
              const visible = visibleCards.has(trigger.key);
              if (!pos) return null;
              const isBlockchain = trigger.key === 'blockchain';

              const sharedStyle: React.CSSProperties = {
                position: 'absolute',
                left: pos.left + Math.round(trigger.offsetX * xScale),
                top:  pos.top,
                transform: `translate(0px, calc(-100% + ${trigger.offsetY}px)) rotate(${trigger.rotate}deg) scale(${visible ? 1 : 0.7})`,
                opacity: visible ? 1 : 0,
                transition: 'transform 160ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 80ms ease-out',
                zIndex: 10,
                pointerEvents: 'none',
              };

              if (trigger.key === 'dali-kim') {
                return (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={trigger.key}
                    src="/dali_kim_photo2.png"
                    alt=""
                    style={{
                      ...sharedStyle,
                      width: 'clamp(58px, 6.9vw, 99px)',
                      height: 'clamp(75px, 9vw, 129px)',
                      objectFit: 'cover',
                      boxShadow: '0px 2px 6px rgba(0,0,0,0.08)',
                    }}
                  />
                );
              }

              if (isBlockchain) {
                return (
                  <video
                    key={trigger.key}
                    src="/bio_blockchain1.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{
                      ...sharedStyle,
                      width: 'clamp(72px, 8.9vw, 128px)',
                      height: 'clamp(41px, 5vw, 72px)',
                      objectFit: 'cover',
                      boxShadow: '0px 2px 6px rgba(0,0,0,0.08)',
                    }}
                  />
                );
              }

              return (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={trigger.key}
                  src="/gk2_01.png"
                  alt=""
                  style={{
                    ...sharedStyle,
                    width: 'clamp(72px, 7.2vw, 104px)',
                    height: 'auto',
                    objectFit: 'contain',
                  }}
                />
              );
            })}

            {/* Text */}
            <div
              style={{
                fontFamily: 'var(--font-google-sans-flex), sans-serif',
                fontWeight: 300,
                fontSize: 'var(--bio-font-size)',
                lineHeight: 1.25,
                letterSpacing: '-0.01em',
                color: 'var(--color-ink)',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <p className="m-0">
                {ALL_WORDS.map((word, idx) => {
                  const start = (idx / N) * (1 - REVEAL_WINDOW);
                  const end   = start + REVEAL_WINDOW;
                  const opacity =
                    revealProgress <= start ? 0.1
                    : revealProgress >= end ? 1
                    : 0.1 + ((revealProgress - start) / REVEAL_WINDOW) * 0.9;

                  const triggerKey = TRIGGER_MAP.get(idx);

                  return (
                    <Fragment key={idx}>
                      <span
                        className="inline-block mr-[0.22em]"
                        style={{ opacity, transition: 'opacity 16ms linear', fontWeight: BOLD_WORDS.has(idx) ? 700 : 300 }}
                        ref={triggerKey ? (el) => { if (el) triggerRefs.current.set(triggerKey, el); } : undefined}
                      >
                        {word}
                      </span>
                      {idx === 5 && <br />}
                    </Fragment>
                  );
                })}
              </p>

            </div>

          </div>

          {/* Keyword tags — grid */}
          <div
            style={{
              maxWidth: 'var(--bio-container-width)',
              margin: 'clamp(40px, 5.6vw, 80px) auto 0',
              pointerEvents: 'none',
              opacity: progress >= TAGS_START ? 1 : 0,
              transform: progress >= TAGS_START ? 'translateY(0)' : 'translateY(12px)',
              transition: 'opacity 600ms ease-out, transform 600ms ease-out',
            }}
          >
            <div style={{ display: 'flex', gap: '60px', width: '100%' }}>
              {[0, 1, 2].map(col => (
                <div
                  key={col}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: 0,
                    gap: '8px',
                  }}
                >
                  {SKILL_TAGS.filter((_, i) => i % 3 === col).map(({ label, color }) => (
                    <div
                      key={label}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <div style={{ width: 'var(--bio-tag-dot)', height: 'var(--bio-tag-dot)', borderRadius: '50%', background: color, flexShrink: 0 }} />
                      <span
                        style={{
                          fontFamily: 'var(--font-google-sans-flex), sans-serif',
                          fontWeight: 300,
                          fontSize: 'var(--bio-tag-font)',
                          lineHeight: '140%',
                          letterSpacing: '-0.2px',
                          color: 'var(--color-ink)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </section>
  );
}
