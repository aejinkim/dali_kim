'use client';

import { useRef, useEffect, useLayoutEffect, useState, Fragment } from 'react';

const INTRO = "Hello, My name is Dali Kim.";
const BODY = "I design products for systems where mistakes have consequences. From blockchain infrastructure and financial networks to aerospace ground stations, my work focuses on turning complexity into clarity, trust, and action.";

const ALL_WORDS = [...INTRO.split(' '), ...BODY.split(' ')];
const N = ALL_WORDS.length;

const SLIDE_END = 0.2;
const REVEAL_END = 0.84;   // text fully revealed by this progress point
const REVEAL_WINDOW = 0.07;

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
  { idx: 22, key: 'aerospace',  rotate:  -2.1, offsetY: 50,  offsetX: 240 },
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
  const [cardPos, setCardPos] = useState<Map<CardKey, { left: number; top: number; width: number }>>(new Map());
  const [progress, setProgress] = useState(0);
  const [vw, setVw] = useState(1920);

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

  useEffect(() => {
    const syncViewport = () => setVw(window.innerWidth);
    syncViewport();
    window.addEventListener('resize', syncViewport);
    return () => window.removeEventListener('resize', syncViewport);
  }, []);

  // Measure trigger word positions relative to container (stable in sticky layout)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const measure = () => {
      const positions = new Map<CardKey, { left: number; top: number; width: number }>();
      const cRect = container.getBoundingClientRect();
      triggerRefs.current.forEach((el, key) => {
        const wRect = el.getBoundingClientRect();
        positions.set(key, {
          left:  wRect.left  - cRect.left,
          top:   wRect.top   - cRect.top,
          width: wRect.width,
        });
      });
      setCardPos(positions);
    };
    // Measure after fonts + layout settle
    const id = setTimeout(measure, 100);
    window.addEventListener('resize', measure);
    return () => { clearTimeout(id); window.removeEventListener('resize', measure); };
  }, [vw]);

  const xScale = Math.max(0, Math.min(1, (vw - 1024) / 896));
  const isMobile = vw <= 768;
  const revealProgress = Math.max(0, Math.min(1, (progress - SLIDE_END) / (REVEAL_END - SLIDE_END)));

  if (isMobile) {
    const mobileTags = SKILL_TAGS;
    const visibleCardsMobile = new Set(
      CARD_TRIGGERS
        .filter(t => revealProgress >= wordRevealThreshold(t.idx))
        .map(t => t.key)
    );

    return (
      <section ref={sectionRef} id="about" className="bg-white" style={{ position: 'relative', height: '350vh', marginTop: '-150vh', zIndex: 1 }}>
        <div className="sticky top-0 h-screen overflow-hidden" style={{ paddingTop: 149 }}>

          <div ref={containerRef} style={{ position: 'relative', width: '100%', boxSizing: 'border-box', padding: '0 var(--page-gutter)' }}>

            {/* Cards: scroll-triggered like desktop */}
            {CARD_TRIGGERS.map(trigger => {
              const pos = cardPos.get(trigger.key);
              const visible = visibleCardsMobile.has(trigger.key);
              if (!pos) return null;

              const mobileLeft = trigger.key === 'aerospace' ? pos.left + pos.width * 0.67 : pos.left;
              const mobileOffsetStr = trigger.key === 'aerospace' ? 'calc(var(--bio-font-size) * 0.652)' : '4px';

              const sharedStyle: React.CSSProperties = {
                position: 'absolute',
                left: mobileLeft,
                top: pos.top,
                transform: `translate(0px, calc(-100% + ${mobileOffsetStr})) rotate(${trigger.rotate}deg) scale(${visible ? 1 : 0.7})`,
                opacity: visible ? 1 : 0,
                transition: 'transform 160ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 80ms ease-out',
                zIndex: 10,
                pointerEvents: 'none',
              };

              if (trigger.key === 'dali-kim') {
                return (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={trigger.key} src="/assets/shared/dali_kim_photo2.png" alt=""
                    style={{ ...sharedStyle, width: 'calc(var(--bio-font-size) * 2.15)', height: 'calc(var(--bio-font-size) * 2.80)', objectFit: 'cover', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }} />
                );
              }
              if (trigger.key === 'blockchain') {
                return (
                  <video key={trigger.key} src="/assets/shared/bio_blockchain1.mp4" autoPlay muted loop playsInline
                    style={{ ...sharedStyle, width: 'calc(var(--bio-font-size) * 2.78)', height: 'calc(var(--bio-font-size) * 1.57)', objectFit: 'cover', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }} />
                );
              }
              return (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={trigger.key} src="/assets/shared/gk2_01.png" alt=""
                  style={{ ...sharedStyle, width: 'calc(var(--bio-font-size) * 2.26)', height: 'auto', objectFit: 'contain' }} />
              );
            })}

            {/* Text */}
            <div style={{
              fontFamily: 'var(--font-google-sans-flex), sans-serif',
              fontWeight: 300,
              fontSize: 'var(--bio-font-size)',
              lineHeight: 1.3,
              letterSpacing: '-0.26px',
              color: 'var(--color-ink)',
              position: 'relative',
              zIndex: 1,
              width: '100%',
            }}>
              <p style={{ margin: 0 }}>
                {ALL_WORDS.map((word, idx) => {
                  const visible = revealProgress >= wordRevealThreshold(idx);
                  const key = `${word}-${idx}`;
                  const needsBreak = idx === 5 || idx === 14;
                  const triggerKey = TRIGGER_MAP.get(idx);
                  return (
                    <Fragment key={key}>
                      <span
                        style={{
                          opacity: visible ? 1 : 0.1,
                          transition: 'opacity 80ms linear',
                          fontWeight: BOLD_WORDS.has(idx) ? 600 : 300,
                        }}
                        ref={triggerKey ? (el) => { if (el) triggerRefs.current.set(triggerKey, el); } : undefined}
                      >
                        {word}
                      </span>
                      {needsBreak ? <br /> : ' '}
                    </Fragment>
                  );
                })}
              </p>
            </div>

            {/* Tags with scroll opacity */}
            <div style={{
              marginTop: 40,
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              position: 'relative',
              zIndex: 1,
              opacity: progress >= TAGS_START ? 1 : 0,
              transform: progress >= TAGS_START ? 'translateY(0)' : 'translateY(12px)',
              transition: 'opacity 600ms ease-out, transform 600ms ease-out',
            }}>
              {mobileTags.map(({ label, color }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 'var(--bio-tag-dot)', height: 'var(--bio-tag-dot)', borderRadius: '50%', background: color, flexShrink: 0 }} />
                  <span style={{
                    fontFamily: 'var(--font-google-sans-flex), sans-serif',
                    fontWeight: 300,
                    fontSize: 'var(--bio-tag-font)',
                    lineHeight: 1.4,
                    letterSpacing: '-0.14px',
                    color: 'var(--color-ink)',
                    whiteSpace: 'nowrap',
                  }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

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
        className="sticky top-0 h-screen flex items-center justify-center"
        style={{ padding: 'var(--page-gutter)' }}
      >
        <div style={{ width: '100%', maxWidth: '1920px' }}>
          <div ref={containerRef} style={{ position: 'relative', width: '100%', maxWidth: 'var(--bio-container-width)', margin: '0 auto' }}>

            {/* Cards: appear above each trigger word on scroll reveal */}
            {CARD_TRIGGERS.map(trigger => {
              const pos = cardPos.get(trigger.key);
              const visible = visibleCards.has(trigger.key);
              if (!pos) return null;

              const offsetStr = trigger.key === 'aerospace'
                ? 'calc(var(--bio-font-size) * 0.652)'
                : `${trigger.offsetY}px`;

              const baseLeft = trigger.key === 'aerospace'
                ? pos.left + pos.width * 0.67
                : pos.left + Math.round(trigger.offsetX * xScale);

              const sharedStyle: React.CSSProperties = {
                position: 'absolute',
                left: baseLeft,
                top: pos.top,
                transform: `translate(0px, calc(-100% + ${offsetStr})) rotate(${trigger.rotate}deg) scale(${visible ? 1 : 0.7})`,
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
                    src="/assets/shared/dali_kim_photo2.png"
                    alt=""
                    style={{
                      ...sharedStyle,
                      width: 'calc(var(--bio-font-size) * 2.15)',
                      height: 'calc(var(--bio-font-size) * 2.80)',
                      objectFit: 'cover',
                      boxShadow: '0px 2px 6px rgba(0,0,0,0.08)',
                    }}
                  />
                );
              }

              if (trigger.key === 'blockchain') {
                return (
                  <video
                    key={trigger.key}
                    src="/assets/shared/bio_blockchain1.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{
                      ...sharedStyle,
                      width: 'calc(var(--bio-font-size) * 2.78)',
                      height: 'calc(var(--bio-font-size) * 1.57)',
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
                  src="/assets/shared/gk2_01.png"
                  alt=""
                  style={{
                    ...sharedStyle,
                    width: 'calc(var(--bio-font-size) * 2.26)',
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
