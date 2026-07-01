import type { CSSProperties } from 'react';

export const FONT = 'var(--font-google-sans-flex), sans-serif';

export const CS = {
  color: {
    ink: '#000000',
    white: '#ffffff',
    dim: 'rgba(0,0,0,0.45)',
    line: 'rgba(0,0,0,0.08)',
    lineStrong: 'rgba(0,0,0,0.2)',
    pillBorder: '#d1d1d1',
    pillBorderMuted: 'rgba(209,209,209,0.2)',
    tag: '#474747',
  },
  size: {
    frame: 'clamp(1438px, calc(712px + 50.4167vw), 1680px)',
    inset: 40,
    content: 1600,
    half: 800,
    headerIntro: 'clamp(538px, calc(112px + 29.5833vw), 680px)',
    leftText: 420,

    leftMediaGap: 80,
    colorMediaHeight: 'clamp(451.66px, calc(72.64px + 26.321vw), 578px)',
    dot: 12,
    tagHeight: 31,
  },
  space: {
    section: 'var(--cs-section-padding)',
    xl: 80,
    stack: 40,
    paragraph: 20,
    quoteGap: 56,
    captionText: 14,
    captionBottom: 24,
    mediaTight: 16,
    mediaGap: 12,
    headerTop: 'var(--cs-header-top)',
  },
} as const;

export function text(
  fontSize: number | string,
  fontWeight: number,
  lineHeight: number | string,
  letterSpacing?: string,
  extra?: CSSProperties
): CSSProperties {
  return {
    fontFamily: FONT,
    fontSize,
    fontWeight,
    lineHeight,
    letterSpacing,
    color: CS.color.ink,
    margin: 0,
    ...extra,
  };
}

export const TYPE = {
  h2_52: text('var(--cs-section-title-size)', 400, 1.3, '-0.01em'),
  h3_32: text('var(--cs-subtitle-size)', 500, 1.3, '-0.01em', { margin: '0 0 8px' }),
  h3_32SemiBold: text('var(--cs-page-title-size)', 400, 'var(--cs-page-title-line-height, 1.3)', '-0.32px', { margin: '0 0 var(--cs-page-title-gap)' }),
  h3_42SemiBold: text(42, 600, 1.3, '-0.42px'),
  h3_20Regular: text('var(--cs-page-subtitle-size)', 400, 'var(--cs-page-subtitle-line-height, 1.3)', '-0.2px', { margin: '0 0 24px' }),
  pTitle_16Bold: text('var(--cs-meta-label-size, 16px)', 500, 1.5, '-0.16px', { margin: '0 0 var(--cs-meta-label-gap, 12px)' }),
  p16: text('var(--cs-body-text-size, 16px)', 400, 'var(--cs-body-line-height)', '-0.16px'),
  p16SemiBold: text('var(--cs-emphasis-text-size, 16px)', 600, 1.5, '-0.16px'),
  p56Regular: text('clamp(42px, 2.9167vw, 56px)', 400, 1.2, '-0.01em'),
  p28Regular: text(28, 400, 1.2, '-0.28px'),
  tag12: text(12, 400, 'normal', undefined, { color: CS.color.tag }),
  footer: text(14, 400, 1.4, undefined, {
    color: CS.color.dim,
    textDecoration: 'none',
  }),
} satisfies Record<string, CSSProperties>;

export const MEDIA_STYLE = {
  cover: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' } satisfies CSSProperties,
  fluid: { width: '100%', height: 'auto', display: 'block' } satisfies CSSProperties,
};
