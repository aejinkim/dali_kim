import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCaseStudyBySlug, parseMarkdownToHtml } from '@/lib/markdown';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const CASE_META: Record<string, {
  thumbnail: string;
  year: string;
  industry?: string;
  scope?: string;
  link?: string;
}> = {
  'initia-ecosystem':         { thumbnail: '/Initiamian.webm',       year: '2023 – 2026', industry: 'Blockchain / Web3',    scope: 'Brand, Product, Design System' },
  'anchor-protocol':          { thumbnail: '',                       year: '2021 – 2023', industry: 'DeFi / Finance',       scope: 'UX Design, Research' },
  'fount-robo-advisor':       { thumbnail: '/fount_thumbnail.png',   year: '2020 – 2021', industry: 'WealthTech',            scope: 'Product Design' },
  'satrec-satellite-control': { thumbnail: '',                       year: '2017 – 2018', industry: 'Aerospace',             scope: 'UX Design, Research' },
  'virtuswap':                { thumbnail: '/virtuswap_01.jpg',      year: '2022',        industry: 'DeFi / Finance',       scope: 'Brand Identity, Visual Design, Landing Page' },
};

const FONT = 'var(--font-google-sans-flex), sans-serif';

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const study = await getCaseStudyBySlug(slug);

  if (!study) notFound();

  const htmlContent = parseMarkdownToHtml(study.content);
  const meta = CASE_META[slug] ?? { thumbnail: '', year: study.date?.split('-')[0] ?? '' };

  const metaFields = [
    meta.year     && { label: 'Year',     value: meta.year },
    meta.industry && { label: 'Industry', value: meta.industry },
    meta.scope    && { label: 'Scope',    value: meta.scope },
  ].filter(Boolean) as { label: string; value: string }[];

  const shortTitle = study.title.split(':')[0].trim();

  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', color: '#0a0a0a' }}>

      {/* ── Sticky Nav ── */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        padding: '0 var(--page-gutter)',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Link
          href="/"
          className="case-study-nav-back"
          style={{
            fontFamily: FONT,
            fontSize: '14px',
            fontWeight: 400,
            letterSpacing: '-0.01em',
            color: 'var(--color-ink)',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          ← Dali Kim
        </Link>
        <span style={{
          fontFamily: FONT,
          fontSize: '11px',
          fontWeight: 400,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'rgba(10,10,10,0.35)',
        }}>
          Case Study
        </span>
      </nav>

      {/* ── Hero ── */}
      <div style={{ padding: 'clamp(56px, 9vh, 128px) var(--page-gutter) clamp(48px, 7vh, 96px)' }}>

        {/* Tags */}
        {study.tags.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
            {study.tags.map(tag => (
              <span key={tag} style={{
                fontFamily: FONT,
                fontSize: '11px',
                fontWeight: 400,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'rgba(10,10,10,0.45)',
                padding: '4px 12px',
                border: '1px solid rgba(0,0,0,0.12)',
                borderRadius: '100px',
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 style={{
          fontFamily: FONT,
          fontWeight: 500,
          fontSize: 'clamp(36px, 5.5vw, 88px)',
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          color: '#0a0a0a',
          margin: '0 0 20px',
          maxWidth: '860px',
        }}>
          {shortTitle}
        </h1>

        {/* Summary */}
        <p style={{
          fontFamily: FONT,
          fontSize: 'clamp(15px, 1.3vw, 20px)',
          fontWeight: 300,
          lineHeight: 1.55,
          letterSpacing: '-0.01em',
          color: 'rgba(10,10,10,0.55)',
          margin: 0,
          maxWidth: '580px',
        }}>
          {study.summary}
        </p>

        {/* Metadata row */}
        {metaFields.length > 0 && (
          <div style={{
            display: 'flex',
            gap: 'clamp(32px, 5vw, 80px)',
            marginTop: 'clamp(40px, 6vh, 64px)',
            paddingTop: 'clamp(32px, 4vh, 48px)',
            borderTop: '1px solid rgba(0,0,0,0.1)',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
          }}>
            {metaFields.map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{
                  fontFamily: FONT,
                  fontSize: '10px',
                  fontWeight: 400,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(10,10,10,0.38)',
                }}>
                  {label}
                </span>
                <span style={{
                  fontFamily: FONT,
                  fontSize: 'clamp(13px, 1vw, 16px)',
                  fontWeight: 400,
                  letterSpacing: '-0.01em',
                  color: '#0a0a0a',
                }}>
                  {value}
                </span>
              </div>
            ))}

            {meta.link && (
              <a
                href={meta.link}
                target="_blank"
                rel="noopener noreferrer"
                className="case-study-action-btn"
                style={{
                  fontFamily: FONT,
                  fontSize: '13px',
                  fontWeight: 400,
                  letterSpacing: '-0.01em',
                  textDecoration: 'none',
                  padding: '10px 20px',
                  border: '1px solid rgba(0,0,0,0.18)',
                  borderRadius: '100px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginLeft: 'auto',
                }}
              >
                Visit ↗
              </a>
            )}
          </div>
        )}
      </div>

      {/* ── Hero Thumbnail ── */}
      {meta.thumbnail && (
        <div style={{ width: '100%', aspectRatio: '16 / 9', position: 'relative', overflow: 'hidden' }}>
          {/\.(mp4|webm|mov)$/i.test(meta.thumbnail) ? (
            <video
              src={meta.thumbnail}
              autoPlay muted loop playsInline
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <Image
              src={meta.thumbnail}
              alt={shortTitle}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          )}
        </div>
      )}

      {/* ── Article Content ── */}
      <article
        style={{ padding: 'clamp(56px, 8vh, 96px) var(--page-gutter) clamp(80px, 12vh, 160px)' }}
        className="case-study-article"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      {/* ── Footer ── */}
      <footer style={{
        borderTop: '1px solid rgba(0,0,0,0.08)',
        padding: 'clamp(40px, 6vh, 64px) var(--page-gutter)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '24px',
      }}>
        <Link href="/" style={{
          fontFamily: FONT,
          fontSize: '14px',
          fontWeight: 400,
          letterSpacing: '-0.01em',
          color: 'rgba(10,10,10,0.5)',
          textDecoration: 'none',
        }}>
          ← Back to work
        </Link>
        <a href="mailto:jiny0410@gmail.com"
          className="case-study-action-btn"
          style={{
            fontFamily: FONT,
            fontSize: '14px',
            fontWeight: 400,
            letterSpacing: '-0.01em',
            textDecoration: 'none',
            padding: '10px 24px',
            border: '1px solid rgba(0,0,0,0.18)',
            borderRadius: '100px',
          }}
        >
          Get in touch
        </a>
      </footer>

    </main>
  );
}
