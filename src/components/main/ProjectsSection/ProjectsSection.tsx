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
  href?: string;
  aspectRatio?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
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
        gap: 'var(--project-card-image-gap)',
        minWidth: 0,
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(32px)',
        transition: 'opacity 700ms cubic-bezier(0.4,0,0.2,1), transform 700ms cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <Link
        href={meta.href ?? `/case-studies/${study.slug}`}
        className="project-thumbnail"
        style={{
          display: 'block',
          width: tall ? '100%' : '75%',
          aspectRatio: meta.aspectRatio ?? '16 / 9',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'none',
          flexShrink: 0,
        }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'var(--color-thumbnail-placeholder)' }} />
        {meta.thumbnail && (meta.thumbnail.endsWith('.mp4') ? (
          <video src={meta.thumbnail} autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: meta.objectFit ?? 'cover' }} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={meta.thumbnail} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: meta.objectFit ?? 'cover' }} />
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
            backgroundColor: 'var(--color-brand-bg)',
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
            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="var(--color-ink)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </Link>

      <div style={{
        width: tall ? '100%' : '75%',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--project-card-text-gap)',
        alignItems: 'flex-start',
      }}>
        <p
          style={{
            fontFamily: 'var(--font-google-sans-flex), sans-serif',
            fontWeight: 400,
            fontSize: 'var(--project-title-size)',
            lineHeight: 1.3,
            letterSpacing: 'calc(var(--project-title-size) * -0.01)',
            color: 'var(--color-ink)',
            margin: 0,
          }}
        >
          {shortTitle}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-google-sans-flex), sans-serif',
            fontWeight: 300,
            fontSize: 'var(--project-subtitle-size)',
            lineHeight: 1.3,
            letterSpacing: 'calc(var(--project-subtitle-size) * -0.01)',
            color: 'var(--color-text-muted)',
            margin: 0,
            maxWidth: 'var(--project-subtitle-maxwidth)',
          }}
        >
          {meta.subtitle}
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
  const [vw, setVw] = useState(1920);
  useEffect(() => {
    const update = () => setVw(window.innerWidth);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const fallback: Meta = { subtitle: '', thumbnail: '', date: '2026' };
  const s = (i: number) => studies[i];
  const m = (i: number) => metadata[studies[i]?.slug] ?? fallback;

  const isMobile = vw <= 799;

  if (isMobile) {
    return (
      <section id="projects" style={{ backgroundColor: 'var(--color-brand-bg)' }}>
        <div style={{ width: '100%', height: 1, backgroundColor: 'var(--color-brand-line)' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '40px var(--page-gutter)' }}>
          {studies.map((study, i) => {
            const meta = m(i);
            const shortTitle = study.title.split(':')[0].trim();
            return (
              <div key={study.slug} style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 40 }}>
                <Link
                  href={metadata[study.slug]?.href ?? `/case-studies/${study.slug}`}
                  style={{ display: 'block', width: '100%', aspectRatio: meta.aspectRatio ?? '16 / 9', position: 'relative', overflow: 'hidden' }}
                >
                  <div style={{ position: 'absolute', inset: 0, backgroundColor: 'var(--color-thumbnail-placeholder)' }} />
                  {meta.thumbnail && (meta.thumbnail.endsWith('.mp4') ? (
                    <video src={meta.thumbnail} autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: meta.objectFit ?? 'cover' }} />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={meta.thumbnail} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: meta.objectFit ?? 'cover' }} />
                  ))}
                </Link>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <p style={{
                    fontFamily: 'var(--font-google-sans-flex), sans-serif',
                    fontWeight: 400, fontSize: 'var(--project-title-size)',
                    lineHeight: 1.3, letterSpacing: 'calc(var(--project-title-size) * -0.01)',
                    color: 'var(--color-ink)', margin: 0,
                  }}>{shortTitle}</p>
                  <p style={{
                    fontFamily: 'var(--font-google-sans-flex), sans-serif',
                    fontWeight: 300, fontSize: 'var(--project-subtitle-size)',
                    lineHeight: 1.3, letterSpacing: 'calc(var(--project-subtitle-size) * -0.01)',
                    color: 'var(--color-text-muted)', margin: 0,
                  }}>{meta.subtitle}</p>
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
    gap: 'var(--project-row-gap)',
    padding: '10px var(--page-gutter)',
    alignItems: 'flex-start',
    width: '100%',
  };

  return (
    <section id="projects" style={{ backgroundColor: 'var(--color-brand-bg)' }}>
      <div style={{ width: '100%', height: 1, backgroundColor: 'var(--color-brand-line)' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--project-row-vgap)', marginTop: 'var(--project-section-top)', paddingBottom: 200 }}>
        {studies.length >= 2 && (
          <div style={rowStyle}>
            <ProjectCard study={s(0)} meta={m(0)} tall={true} />
            <ProjectCard study={s(1)} meta={m(1)} tall={true} />
          </div>
        )}
        {studies.length >= 4 && (
          <div style={rowStyle}>
            <ProjectCard study={s(2)} meta={m(2)} tall={true} />
            <ProjectCard study={s(3)} meta={m(3)} tall={true} />
          </div>
        )}
        {studies.length >= 5 && (
          <div style={rowStyle}>
            <ProjectCard study={s(4)} meta={m(4)} tall={true} />
            {studies.length >= 6
              ? <ProjectCard study={s(5)} meta={m(5)} tall={true} />
              : <div style={{ flex: '1 0 0' }} />
            }
          </div>
        )}
      </div>
    </section>
  );
}
