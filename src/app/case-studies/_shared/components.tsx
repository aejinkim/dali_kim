import React from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { CS, TYPE, MEDIA_STYLE } from './tokens';

export function SplitSection({
  title,
  children,
  pt = CS.space.section,
  pb = CS.space.section,
}: {
  title?: ReactNode;
  children: ReactNode;
  pt?: number | string;
  pb?: number | string;
}) {
  return (
    <section className="cs-split-section" style={{ paddingTop: pt, paddingBottom: pb }}>
      <div className="cs-split-left">{title}</div>
      <div className="cs-split-right">{children}</div>
    </section>
  );
}

export function Stack({ children, gap = CS.space.stack }: { children: ReactNode; gap?: number }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap }}>{children}</div>;
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <p style={TYPE.h2_52}>{children}</p>;
}

export function Body({ children, muted = false, style }: { children: ReactNode; muted?: boolean; style?: CSSProperties }) {
  return <p style={{ ...TYPE.p16, ...(muted ? { color: CS.color.dim } : null), ...style }}>{children}</p>;
}

export function SubTitle({ children }: { children: ReactNode }) {
  return <p style={TYPE.h3_32}>{children}</p>;
}

export function DisplayText({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <p style={{ ...TYPE.p56Regular, fontSize: 28, ...style }}>{children}</p>;
}

export function Caption({ children }: { children: ReactNode }) {
  const textContent = typeof children === 'string' ? children.replace(/^●\s*/, '') : children;
  return (
    <p style={{
      ...TYPE.p16SemiBold,
      display: 'flex',
      alignItems: 'center',
      gap: 6,
    }}>
      <span style={{
        width: CS.size.dot,
        height: CS.size.dot,
        borderRadius: '50%',
        backgroundColor: CS.color.ink,
        flex: `0 0 ${CS.size.dot}px`,
      }} />
      {textContent}
    </p>
  );
}

export function Divider() {
  return <div style={{ height: 1, background: CS.color.line }} />;
}

export function Pill({ children, href }: { children: ReactNode; href?: string }) {
  const style = {
    ...TYPE.tag12,
    height: CS.size.tagHeight,
    padding: '0 10px',
    border: `1.5px solid ${CS.color.pillBorder}`,
    borderRadius: 100,
    display: 'inline-flex',
    alignItems: 'center',
    textDecoration: 'none',
  } satisfies CSSProperties;

  if (href) {
    return <a href={href} target="_blank" rel="noopener noreferrer" style={style}>{children}</a>;
  }
  return <span style={style}>{children}</span>;
}

export function FullBleedImage({ src, aspect }: { src: string; aspect?: string }) {
  const isVideo = /\.(mp4|webm|mov)$/i.test(src);
  if (aspect) {
    return (
      <div style={{ width: '100%', aspectRatio: aspect, overflow: 'hidden' }}>
        {isVideo
          // eslint-disable-next-line @next/next/no-img-element
          ? <video src={src} autoPlay muted loop playsInline style={MEDIA_STYLE.cover} />
          : <img src={src} alt="" style={MEDIA_STYLE.cover} />}
      </div>
    );
  }
  return isVideo
    ? <video src={src} autoPlay muted loop playsInline style={MEDIA_STYLE.fluid} />
    // eslint-disable-next-line @next/next/no-img-element
    : <img src={src} alt="" style={MEDIA_STYLE.fluid} />;
}

export function FluidVideo({ src, aspect, cover = false }: { src: string; aspect?: string; cover?: boolean }) {
  return (
    <div style={{ width: '100%', aspectRatio: aspect, overflow: 'hidden' }}>
      <video src={src} autoPlay muted loop playsInline style={cover ? MEDIA_STYLE.cover : MEDIA_STYLE.fluid} />
    </div>
  );
}

export function CaptionMediaRow({
  children,
  media,
  height,
  mt = 0,
}: {
  children: ReactNode;
  media: ReactNode;
  height?: number | string;
  mt?: number | string;
}) {
  return (
    <section
      className="cs-caption-row"
      style={{ '--cmr-h': height ?? 'auto', marginTop: mt } as React.CSSProperties}
    >
      <div className="cs-caption-left">
        <Stack gap={CS.space.paragraph}>{children}</Stack>
      </div>
      <div className="cs-caption-right">{media}</div>
    </section>
  );
}

export function HalfCaptionBlock({ caption, children, pt = 0 }: { caption: string; children: ReactNode; pt?: number | string }) {
  return (
    <section className="cs-half-caption-block" style={{ paddingTop: pt, paddingBottom: CS.space.captionBottom }}>
      <div className="cs-half-spacer" />
      <div className="cs-half-content">
        <Caption>{caption}</Caption>
        <Body style={{ marginTop: CS.space.captionText }}>{children}</Body>
      </div>
    </section>
  );
}

export function WideCaptionBlock({ caption, children, pt = CS.space.section }: { caption: string; children: ReactNode; pt?: number | string }) {
  return (
    <section style={{ paddingTop: pt, paddingBottom: CS.space.captionBottom }}>
      <div style={{ width: '100%' }}>
        <Caption>{caption}</Caption>
        <Body style={{ marginTop: CS.space.captionText }}>{children}</Body>
      </div>
    </section>
  );
}
