import Link from 'next/link';
import Navbar from '@/components/main/Navbar';
import type { CSSProperties, ReactNode } from 'react';

const FONT = 'var(--font-google-sans-flex), sans-serif';

const CASE_STUDY = {
  color: {
    ink: '#000000',
    white: '#ffffff',
    dim: '#000000',
    line: 'rgba(0,0,0,0.08)',
    pillBorder: '#d1d1d1',
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
    section: 100,
    xl: 80,
    stack: 44,
    paragraph: 20,
    quoteGap: 56,
    captionText: 14,
    captionBottom: 24,
    mediaTight: 16,
    headerTop: 'clamp(152px, calc(92px + 4.1667vw), 172px)',
  },
} as const;

const TYPE = {
  h2_52: text('clamp(40px, calc(4px + 2.5vw), 52px)', 500, 1.3, '-0.01em'),
  h3_32: text('clamp(28px, calc(16px + 0.8333vw), 32px)', 500, 1.3, '-0.01em', { margin: '0 0 8px' }),
  h3_32SemiBold: text(32, 600, 1.3, '-0.32px'),
  h3_20Regular: text(20, 400, 1.3, '-0.2px', { margin: '0 0 24px' }),
  pTitle_16Bold: text(16, 700, 1.3, '-0.16px', { margin: '0 0 12px' }),
  p16: text(16, 400, 1.5, '-0.16px'),
  p16SemiBold: text(16, 600, 1.5, '-0.16px'),
  p56Regular: text('clamp(42px, 2.9167vw, 56px)', 400, 1.2, '-0.01em'),
  p28Regular: text(28, 400, 1.2, '-0.28px'),
  tag12: text(12, 400, 'normal', undefined, { color: CASE_STUDY.color.tag }),
  footer: text(14, 400, 1.4, undefined, {
    color: CASE_STUDY.color.dim,
    textDecoration: 'none',
  }),
} satisfies Record<string, CSSProperties>;

const MEDIA_STYLE = {
  cover: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' } satisfies CSSProperties,
  fluid: { width: '100%', height: 'auto', display: 'block' } satisfies CSSProperties,
};

const META = [
  { label: 'Role', value: 'Head of Design' },
  { label: 'Scope', value: 'Brand Strategy\nVisual Identity\nDesign System\nMarketing\nCommunity' },
  { label: 'Impact', value: 'Established the Initia brand from defining the philosophy, visual language, and ecosystem branding framework' },
] as const;

const BRAND_NEEDS = [
  'Scale across products and ecosystem partners',
  'Support both technical and non-technical audiences',
  'Create emotional connection without sacrificing credibility',
  'Remain flexible as the ecosystem evolved',
] as const;

function text(
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
    color: CASE_STUDY.color.ink,
    margin: 0,
    ...extra,
  };
}

function SplitSection({
  title,
  children,
  pt = CASE_STUDY.space.section,
  pb = CASE_STUDY.space.section,
}: {
  title?: ReactNode;
  children: ReactNode;
  pt?: number;
  pb?: number;
}) {
  return (
    <section style={{ display: 'flex', alignItems: 'flex-start', paddingTop: pt, paddingBottom: pb }}>
      <div style={{ flex: '0 0 50%' }}>{title}</div>
      <div style={{ flex: '0 0 50%' }}>{children}</div>
    </section>
  );
}

function Stack({ children, gap = CASE_STUDY.space.stack }: { children: ReactNode; gap?: number }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap }}>{children}</div>;
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <p style={TYPE.h2_52}>{children}</p>;
}

function Body({ children, muted = false, style }: { children: ReactNode; muted?: boolean; style?: CSSProperties }) {
  return <p style={{ ...TYPE.p16, ...(muted ? { color: CASE_STUDY.color.dim } : null), ...style }}>{children}</p>;
}

function SubTitle({ children }: { children: ReactNode }) {
  return <p style={TYPE.h3_32}>{children}</p>;
}

function DisplayText({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <p style={{ ...TYPE.p56Regular, ...style }}>{children}</p>;
}

function Caption({ children, size = 16 }: { children: ReactNode; size?: 16 | 20 }) {
  const textContent = typeof children === 'string' ? children.replace(/^●\s*/, '') : children;

  return (
    <p style={{
      ...TYPE.p16SemiBold,
      fontSize: size,
      letterSpacing: `-${size / 100}px`,
      display: 'flex',
      alignItems: 'center',
      gap: 6,
    }}>
      <span style={{
        width: CASE_STUDY.size.dot,
        height: CASE_STUDY.size.dot,
        borderRadius: '50%',
        backgroundColor: CASE_STUDY.color.ink,
        flex: `0 0 ${CASE_STUDY.size.dot}px`,
      }} />
      {textContent}
    </p>
  );
}

function Divider() {
  return <div style={{ height: 1, background: CASE_STUDY.color.line }} />;
}

function Pill({ children, href }: { children: ReactNode; href?: string }) {
  const style = {
    ...TYPE.tag12,
    height: CASE_STUDY.size.tagHeight,
    padding: '0 10px',
    border: `1.5px solid ${CASE_STUDY.color.pillBorder}`,
    borderRadius: 100,
    display: 'inline-flex',
    alignItems: 'center',
    textDecoration: 'none',
  } satisfies CSSProperties;

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" style={style}>
        {children}
      </a>
    );
  }

  return <span style={style}>{children}</span>;
}

function FullBleedImage({ src, aspect = '16 / 9' }: { src: string; aspect?: string }) {
  return (
    <div style={{ width: '100%', aspectRatio: aspect, overflow: 'hidden' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" style={MEDIA_STYLE.cover} />
    </div>
  );
}

function FluidVideo({ src, aspect, cover = false }: { src: string; aspect?: string; cover?: boolean }) {
  return (
    <div style={{ width: '100%', aspectRatio: aspect, overflow: 'hidden' }}>
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        style={cover ? MEDIA_STYLE.cover : MEDIA_STYLE.fluid}
      />
    </div>
  );
}

function CaptionMediaRow({
  children,
  media,
  height,
  mt = 0,
}: {
  children: ReactNode;
  media: ReactNode;
  height?: number | string;
  mt?: number;
}) {
  return (
    <section style={{ display: 'flex', alignItems: 'flex-start', height, marginTop: mt }}>
      <div style={{
        flex: `0 0 ${CASE_STUDY.size.leftText}px`,
        marginRight: CASE_STUDY.size.leftMediaGap,
      }}>
        <Stack gap={CASE_STUDY.space.paragraph}>{children}</Stack>
      </div>
      <div style={{ flex: 1, height: height ?? 'auto', overflow: 'hidden' }}>{media}</div>
    </section>
  );
}

function HalfCaptionBlock({ caption, children, pt = 0 }: { caption: string; children: ReactNode; pt?: number }) {
  return (
    <section style={{ display: 'flex', paddingTop: pt, paddingBottom: CASE_STUDY.space.captionBottom }}>
      <div style={{ flex: '0 0 50%' }} />
      <div style={{ flex: '0 0 50%' }}>
        <Caption size={20}>{caption}</Caption>
        <Body style={{ marginTop: CASE_STUDY.space.captionText }}>{children}</Body>
      </div>
    </section>
  );
}

function PageHeader() {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      minHeight: 153,
      paddingTop: CASE_STUDY.space.headerTop,
      paddingBottom: CASE_STUDY.space.section,
    }}>
      <div style={{ width: CASE_STUDY.size.headerIntro }}>
        <p style={TYPE.h3_32SemiBold}>Initia Ecosystem Branding</p>
        <p style={TYPE.h3_20Regular}>Designing a Living Ecosystem</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <Pill>2023–2026</Pill>
          <Pill href="https://initia.xyz/">initia.xyz ›</Pill>
        </div>
      </div>
      <div style={{ width: CASE_STUDY.size.half, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {META.map(({ label, value }) => (
          <div key={label}>
            <p style={TYPE.pTitle_16Bold}>{label}</p>
            <p style={{ ...TYPE.p16, whiteSpace: 'pre-line' }}>{value}</p>
          </div>
        ))}
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer style={{
      borderTop: `1px solid ${CASE_STUDY.color.line}`,
      padding: 'clamp(40px, 6vh, 64px) var(--page-gutter)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: CASE_STUDY.space.xl,
    }}>
      <Link href="/" style={TYPE.footer}>← Dali Kim</Link>
      <a href="mailto:jiny0410@gmail.com" style={{
        ...TYPE.footer,
        color: CASE_STUDY.color.ink,
        padding: '10px 24px',
        border: '1px solid rgba(0,0,0,0.2)',
        borderRadius: 100,
      }}>Get in touch</a>
    </footer>
  );
}

export default function InitiaPage() {
  return (
    <main style={{ backgroundColor: CASE_STUDY.color.white, color: CASE_STUDY.color.ink }}>
      <Navbar alwaysVisible tone="light" />
      <div
        className="content-width"
        style={{
          maxWidth: CASE_STUDY.size.frame,
          margin: '0 auto',
          overflow: 'hidden',
          padding: `0 ${CASE_STUDY.size.inset}px`,
          boxSizing: 'border-box',
        }}
      >
        <PageHeader />

        <FullBleedImage src="/initia_01.png" />

        <SplitSection title={<SectionTitle>Project Overview</SectionTitle>}>
          <Stack>
            <div>
              <SubTitle>Initia</SubTitle>
              <Body>Initia is a Layer 1 blockchain designed to support an ecosystem of interconnected application-specific chains. Instead of operating as a single network, Initia enables multiple independent chains to coexist while sharing infrastructure, liquidity, and interoperability.</Body>
            </div>
            <div>
              <SubTitle>Role</SubTitle>
              <Body>As Head of Design, I led ecosystem branding, I led product design, ecosystem branding, design systems, and cross-functional collaboration across products, marketing, community initiatives, and ecosystem partnerships. Defined the philosophy, visual language, and ecosystem branding framework that enabled diverse chains, products, and communities to coexist within a shared multichain identity.</Body>
            </div>
          </Stack>
        </SplitSection>

        <Divider />

        <SplitSection title={<SectionTitle>The Challenge</SectionTitle>}>
          <div>
            <div>
              <Body>Traditional brands are built on consistency and control. Initia required the opposite. A system where diverse identities could coexist while remaining connected through a shared vision.</Body>
              <Body>How do you create a coherent identity for an ecosystem made up of multiple chains, products, communities, and experiences?</Body>
            </div>
            <div style={{ marginTop: CASE_STUDY.space.stack }}>
              <p style={{ ...TYPE.p16SemiBold, margin: '0 0 16px' }}>The brand needed to:</p>
              {BRAND_NEEDS.map((item) => (
                <div key={item}>
                  <Divider />
                  <p style={{ ...TYPE.p16, margin: '16px 0' }}>{item}</p>
                </div>
              ))}
              <Divider />
            </div>
          </div>
        </SplitSection>

        <FullBleedImage src="/initia_02.png" />

        <SplitSection title={<SectionTitle>The Philosophy</SectionTitle>}>
          <Stack gap={36}>
            <Body>
              Storytelling is at the heart of every successful company.<br />
              Technology alone is not enough. What resonates with people is who you are, what you believe, and how you see the world.<br />
              <br />
              When building Initia&apos;s ecosystem identity, Initia wanted more than a visual system. Initia wanted a narrative that could explain the relationship between independent chains, shared infrastructure, and a growing ecosystem.
            </Body>
            <DisplayText>This idea became The Multichain Garden of Eden.</DisplayText>
            <Body>
              Initia envisioned a living digital garden where each chain could cultivate its own identity while remaining connected through a shared foundation. As new chains joined, new colors emerged, new forms of digital life appeared, and the ecosystem evolved.<br />
              <br />
              More than a brand concept, The Multichain Garden of Eden became the foundation for Initia&apos;s ecosystem design. a living canvas in constant motion.
            </Body>
          </Stack>
        </SplitSection>

        <FullBleedImage src="/initia_03.png" />

        <CaptionMediaRow
          height={CASE_STUDY.size.colorMediaHeight}
          mt={CASE_STUDY.space.section}
          media={
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/initia_04.png" alt="" style={MEDIA_STYLE.cover} />
            </>
          }
        >
          <Caption>Color Philosophy</Caption>
          <Body>Traditional brand systems rely on fixed colors and strict rules to maintain consistency.</Body>
          <Body>Initia adopted black and white as the foundation of the ecosystem. Not as a limitation, but as a neutral environment where every chain could express its own identity.</Body>
          <Body>Just as white light contains the entire visible spectrum, the ecosystem provides a shared foundation while allowing each chain to contribute its own color, personality, and vision.</Body>
          <Body>The ecosystem owns no color.<br />It enables all colors.</Body>
        </CaptionMediaRow>

        <div style={{ marginTop: CASE_STUDY.space.mediaTight }}>
          <FluidVideo src="/initia_glass169_2.mp4" aspect="16 / 9" cover />
        </div>

        <CaptionMediaRow
          mt={CASE_STUDY.space.section}
          media={<FluidVideo src="/initia_convey.mp4" />}
        >
          <Caption>Design Principle</Caption>
          <Body>Inspired by Conway&apos;s Game of Life, we designed for emergence rather than control.</Body>
          <p style={TYPE.p28Regular}>Just as simple rules can create infinite complexity,</p>
          <Body>independent chains contribute to a larger ecosystem through interaction and interoperability. This philosophy shaped a brand system designed to grow, adapt, and evolve alongside the ecosystem itself.</Body>
        </CaptionMediaRow>

        <SplitSection pt={CASE_STUDY.space.section} pb={CASE_STUDY.space.section}>
          <div>
            <DisplayText>Quantum Entanglement, Not Centralization</DisplayText>
            <Body style={{ marginTop: CASE_STUDY.space.quoteGap }}>Our Garden is where chaos and order dance together. Where structure doesn&apos;t limit creativity but enables it. And where a unified vision emerges—not by control, but by coordination.</Body>
          </div>
        </SplitSection>

        <FullBleedImage src="/initia_08.png" aspect="3200 / 1436" />

        <CaptionMediaRow
          mt={CASE_STUDY.space.section}
          media={
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/initia_09.png" alt="" style={MEDIA_STYLE.cover} />
            </>
          }
        >
          <Caption>Initia Mascot Jennie</Caption>
          <Body>A symbol that represents Initia&apos;s spirit, memes, and overall vibe. Balances Initia&apos;s philosophical and technological aspects while softening the brand atmosphere with a more approachable touch.</Body>
        </CaptionMediaRow>

        <div style={{ paddingTop: CASE_STUDY.space.section }}>
          <Divider />
        </div>

        <SplitSection title={<SectionTitle>Outcome</SectionTitle>}>
          <Stack>
            <Body>The result was a scalable ecosystem identity that connected products, communities, and independent chains through a shared philosophy. Rather than enforcing consistency, the system enabled diversity within a coherent framework — proving that brand unity doesn&apos;t require uniformity.</Body>
            <DisplayText>Initia designed a living ecosystem.</DisplayText>
          </Stack>
        </SplitSection>

        <HalfCaptionBlock caption="Initia Landing">
          Initia landing page is intentionally designed as a single page without scrolling. This might seem contrary to common practice, but it serves a purpose: to provide important information concisely without overwhelming visitors.
        </HalfCaptionBlock>

        <FluidVideo src="/initia_.mov" />

        <div style={{ marginTop: CASE_STUDY.space.mediaTight }}>
          <FullBleedImage src="/initia_11.png" />
        </div>

        <HalfCaptionBlock caption="Marketing Element" pt={CASE_STUDY.space.section}>
          The visual system was designed to scale beyond products. It powered livestreams, community campaigns, educational content, ecosystem announcements, and social experiences, creating a cohesive brand presence across all channels.
        </HalfCaptionBlock>

        <FullBleedImage src="/initia_12.png" aspect="3203 / 1659" />

        <Footer />
      </div>
    </main>
  );
}
