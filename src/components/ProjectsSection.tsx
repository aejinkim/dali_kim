'use client';

import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';

interface CaseStudy {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
}

interface Meta {
  subtitle: string;
  thumbnail: string;
  date: string;
}

function useCursor() {
  const [cursor, setCursor] = useState<{ x: number; y: number; show: boolean }>({ x: 0, y: 0, show: false });
  return {
    cursor,
    onMouseMove: (e: React.MouseEvent<HTMLAnchorElement>) => {
      const r = e.currentTarget.getBoundingClientRect();
      setCursor({ x: e.clientX - r.left, y: e.clientY - r.top, show: true });
    },
    onMouseLeave: () => setCursor(c => ({ ...c, show: false })),
  };
}

function ProjectCard({
  study,
  meta,
  tall,
  flip = false,
}: {
  study: CaseStudy;
  meta: Meta;
  tall: boolean;
  flip?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const { cursor, onMouseMove, onMouseLeave } = useCursor();

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const revealIfVisible = () => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) setVisible(true);
    };

    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    obs.observe(el);
    revealIfVisible();
    const raf = requestAnimationFrame(revealIfVisible);
    window.addEventListener('pageshow', revealIfVisible);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pageshow', revealIfVisible);
      obs.disconnect();
    };
  }, []);

  const shortTitle = study.title.split(':')[0].trim();

  return (
    <div
      ref={cardRef}
      style={{
        flex: '1 0 0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: flip ? 'flex-end' : 'flex-start',
        gap: 28,
        minWidth: 0,
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(32px)',
        transition: 'opacity 700ms cubic-bezier(0.4,0,0.2,1), transform 700ms cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <Link
        href={`/case-studies/${study.slug}`}
        style={{
          display: 'block',
          width: tall ? '100%' : '75%',
          aspectRatio: '3 / 2',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'none',
          flexShrink: 0,
        }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        <div style={{ position: 'absolute', inset: 0, backgroundColor: '#d9d9d9' }} />
        {meta.thumbnail && (meta.thumbnail.endsWith('.mp4') ? (
          <video src={meta.thumbnail} autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={meta.thumbnail} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        ))}
        <div
          style={{
            position: 'absolute',
            left: cursor.x,
            top: cursor.y,
            transform: 'translate(-50%, -50%)',
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: cursor.show ? 1 : 0,
            transition: 'opacity 200ms ease',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="#0d1e1f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </Link>

      <div style={{ width: tall ? '100%' : '75%' }}>
        <p
          style={{
            fontFamily: 'var(--font-google-sans-flex), sans-serif',
            fontWeight: 300,
            fontSize: 'var(--project-subtitle-size)',
            lineHeight: 1,
            letterSpacing: '-0.96px',
            color: '#000000',
            margin: '0 0 8px',
          }}
        >
          {meta.subtitle}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-google-sans-flex), sans-serif',
            fontWeight: 500,
            fontSize: 'var(--project-title-size)',
            lineHeight: 1,
            letterSpacing: 'var(--project-title-tracking)',
            color: '#000000',
            margin: 0,
          }}
        >
          {shortTitle}
        </p>
      </div>
    </div>
  );
}

export default function ProjectsSection({
  studies,
  metadata,
}: {
  studies: CaseStudy[];
  metadata: Record<string, Meta>;
}) {
  const [vw, setVw] = useState(() => typeof window !== 'undefined' ? window.innerWidth : 1920);
  useEffect(() => {
    const update = () => setVw(window.innerWidth);
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const fallback: Meta = { subtitle: '', thumbnail: '/initia_thumbnail.png', date: '2026' };
  const s = (i: number) => studies[i];
  const m = (i: number) => metadata[studies[i]?.slug] ?? fallback;

  const isMobile = vw <= 768;

  if (isMobile) {
    return (
      <section id="projects" style={{ backgroundColor: '#ffffff' }}>
        <div style={{ width: '100%', height: 1, backgroundColor: '#111111' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '40px var(--page-gutter)' }}>
          {studies.map((study, i) => {
            const meta = m(i);
            const shortTitle = study.title.split(':')[0].trim();
            return (
              <div key={study.slug} style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 40 }}>
                <Link
                  href={`/case-studies/${study.slug}`}
                  style={{ display: 'block', width: '100%', aspectRatio: '3 / 2', position: 'relative', overflow: 'hidden' }}
                >
                  <div style={{ position: 'absolute', inset: 0, backgroundColor: '#d9d9d9' }} />
                  {meta.thumbnail && (meta.thumbnail.endsWith('.mp4') ? (
                    <video src={meta.thumbnail} autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={meta.thumbnail} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  ))}
                </Link>
                <div>
                  <p style={{
                    fontFamily: 'var(--font-google-sans-flex), sans-serif',
                    fontWeight: 300, fontSize: 'var(--project-subtitle-size)',
                    lineHeight: 1, letterSpacing: '-0.56px',
                    color: '#000000', margin: '0 0 4px',
                  }}>{meta.subtitle}</p>
                  <p style={{
                    fontFamily: 'var(--font-google-sans-flex), sans-serif',
                    fontWeight: 500, fontSize: 'var(--project-title-size)',
                    lineHeight: 1, letterSpacing: 'var(--project-title-tracking)',
                    color: '#000000', margin: 0,
                  }}>{shortTitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    gap: 20,
    padding: '10px var(--page-gutter)',
    alignItems: 'flex-end',
    width: '100%',
  };

  return (
    <section id="projects" style={{ backgroundColor: '#ffffff' }}>
      <div style={{ width: '100%', height: 1, backgroundColor: '#111111' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 100, marginTop: 63, paddingBottom: 200 }}>
        {studies.length >= 2 && (
          <div style={rowStyle}>
            <ProjectCard study={s(0)} meta={m(0)} tall={true} />
            <ProjectCard study={s(1)} meta={m(1)} tall={false} />
          </div>
        )}
        {studies.length >= 4 && (
          <div style={rowStyle}>
            <ProjectCard study={s(2)} meta={m(2)} tall={false} flip={true} />
            <ProjectCard study={s(3)} meta={m(3)} tall={true} />
          </div>
        )}
      </div>
    </section>
  );
}
