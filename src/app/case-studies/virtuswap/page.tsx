import Link from 'next/link';
import Navbar from '@/components/main/Navbar';
import type { CSSProperties, ReactNode } from 'react';

const FONT = 'var(--font-google-sans-flex), sans-serif';

const CS = {
  color: {
    ink: '#000000',
    white: '#ffffff',
    dim: '#000000',
    line: 'rgba(0,0,0,0.08)',
    pillBorder: '#d1d1d1',
    tag: '#474747',
    orange: '#F15A22',
    orangeMuted: 'rgba(241,90,34,0.08)',
  },
  size: {
    frame: 'clamp(1438px, calc(712px + 50.4167vw), 1680px)',
    inset: 40,
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
  tag12: text(12, 400, 'normal', undefined, { color: CS.color.tag }),
  footer: text(14, 400, 1.4, undefined, {
    color: CS.color.dim,
    textDecoration: 'none',
  }),
} satisfies Record<string, CSSProperties>;

const MEDIA_STYLE = {
  cover: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' } satisfies CSSProperties,
  fluid: { width: '100%', height: 'auto', display: 'block' } satisfies CSSProperties,
};

const META = [
  { label: 'Role', value: 'Brand & UI/UX Designer' },
  { label: 'Scope', value: 'Brand Identity\nVisual Assets\nLanding Page' },
  { label: 'Impact', value: 'End-to-end visual system from brand foundation to live product' },
] as const;

const BRAND_CHALLENGES = [
  'Communicate technical credibility without sacrificing approachability',
  'Establish visual authority in a crowded DeFi market',
  'Maintain brand consistency across diverse touchpoints',
  'Scale from protocol branding to consumer-facing product',
] as const;


const DELIVERABLES = [
  'Logo system: 3 prototypes to final identity',
  'Brand book: color system, typography, logo usage guide',
  'Medium article graphics: 2 to 3 per week throughout launch',
  'Twitter cover · Airdrop graphics · Token logo',
  'Merchandise: t-shirts, sweatshirts, polo shirts, hats',
  'Landing page: desktop and mobile responsive',
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
    color: CS.color.ink,
    margin: 0,
    ...extra,
  };
}

function SplitSection({
  title,
  children,
  pt = CS.space.section,
  pb = CS.space.section,
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

function Stack({ children, gap = CS.space.stack }: { children: ReactNode; gap?: number }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap }}>{children}</div>;
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <p style={TYPE.h2_52}>{children}</p>;
}

function Body({ children, muted = false, style }: { children: ReactNode; muted?: boolean; style?: CSSProperties }) {
  return <p style={{ ...TYPE.p16, ...(muted ? { color: CS.color.dim } : null), ...style }}>{children}</p>;
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

function Divider() {
  return <div style={{ height: 1, background: CS.color.line }} />;
}

function Pill({ children, href }: { children: ReactNode; href?: string }) {
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

function FullBleedImage({ src, aspect }: { src: string; aspect?: string }) {
  const isVideo = /\.(mp4|webm|mov)$/i.test(src);
  if (aspect) {
    return (
      <div style={{ width: '100%', aspectRatio: aspect, overflow: 'hidden' }}>
        {isVideo ? (
          <video src={src} autoPlay muted loop playsInline style={MEDIA_STYLE.cover} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" style={MEDIA_STYLE.cover} />
        )}
      </div>
    );
  }
  return isVideo ? (
    <video src={src} autoPlay muted loop playsInline style={MEDIA_STYLE.fluid} />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" style={MEDIA_STYLE.fluid} />
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
      <div style={{ flex: `0 0 ${CS.size.leftText}px`, marginRight: CS.size.leftMediaGap }}>
        <Stack gap={CS.space.paragraph}>{children}</Stack>
      </div>
      <div style={{ flex: 1, height: height ?? 'auto', overflow: 'hidden' }}>{media}</div>
    </section>
  );
}

function HalfCaptionBlock({ caption, children, pt = 0 }: { caption: string; children: ReactNode; pt?: number }) {
  return (
    <section style={{ display: 'flex', paddingTop: pt, paddingBottom: CS.space.captionBottom }}>
      <div style={{ flex: '0 0 50%' }} />
      <div style={{ flex: '0 0 50%' }}>
        <Caption size={20}>{caption}</Caption>
        <Body style={{ marginTop: CS.space.captionText }}>{children}</Body>
      </div>
    </section>
  );
}


function DeliverableList() {
  return (
    <div style={{ marginTop: CS.space.stack }}>
      {DELIVERABLES.map((item, i) => (
        <div key={i}>
          <Divider />
          <p style={{ ...TYPE.p16, margin: '16px 0', display: 'flex', gap: 16 }}>
            <span style={{ color: CS.color.dim, fontVariantNumeric: 'tabular-nums', minWidth: 24 }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            {item}
          </p>
        </div>
      ))}
      <Divider />
    </div>
  );
}

function PageHeader() {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      minHeight: 153,
      paddingTop: CS.space.headerTop,
      paddingBottom: CS.space.section,
    }}>
      <div style={{ width: CS.size.headerIntro }}>
        <p style={TYPE.h3_32SemiBold}>VirtuSwap Branding</p>
        <p style={TYPE.h3_20Regular}>DeFi Exchange Visual Identity</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <Pill>2022</Pill>
          <Pill href="https://twitter.com/VirtuSwap">@VirtuSwap ›</Pill>
        </div>
      </div>
      <div style={{ width: CS.size.half, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
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
      borderTop: `1px solid ${CS.color.line}`,
      padding: 'clamp(40px, 6vh, 64px) var(--page-gutter)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: CS.space.xl,
    }}>
      <Link href="/" style={TYPE.footer}>← Dali Kim</Link>
      <a href="mailto:jiny0410@gmail.com" style={{
        ...TYPE.footer,
        color: CS.color.ink,
        padding: '10px 24px',
        border: '1px solid rgba(0,0,0,0.2)',
        borderRadius: 100,
      }}>Get in touch</a>
    </footer>
  );
}

export default function VirtuSwapPage2() {
  return (
    <main style={{ backgroundColor: CS.color.white, color: CS.color.ink }}>
      <Navbar alwaysVisible tone="light" />
      <div
        className="content-width"
        style={{
          maxWidth: CS.size.frame,
          margin: '0 auto',
          overflow: 'hidden',
          padding: `0 ${CS.size.inset}px`,
          boxSizing: 'border-box',
        }}
      >
        <PageHeader />

        <FullBleedImage src="/virtuswap_01-1.jpg" />

        <SplitSection title={<SectionTitle>Project Overview</SectionTitle>}>
          <Stack>
            <div>
              <SubTitle>VirtuSwap</SubTitle>
              <Body>VirtuSwap is a decentralized exchange (DEX) built on a proprietary technology called Reserve-Powered Virtual Pools (RPVP). By optimizing liquidity allocation across pairs, VirtuSwap reduces trading costs for traders while improving returns for liquidity providers — bringing decentralized trading efficiency closer to that of centralized exchanges.</Body>
            </div>
            <div>
              <SubTitle>Role</SubTitle>
              <Body>As the sole designer on contract, I owned the entire visual system — from defining brand philosophy and building the logo to producing weekly content assets and shipping the landing page. Working directly with the founding team, I translated complex financial engineering into a brand that felt credible, ambitious, and distinctly VirtuSwap.</Body>
            </div>
          </Stack>
        </SplitSection>

        <FullBleedImage src="/virtuswap_02.jpg" />

        <SplitSection title={<SectionTitle>The Challenge</SectionTitle>} pt={CS.space.section}>
          <div>
            <Body>The founding team gave the brand three words:</Body>
            <DisplayText style={{ margin: `${CS.space.paragraph}px 0 ${CS.space.stack}px` }}>
              intelligence, efficiency, elegance.
            </DisplayText>
            <Body>
              Not as mood board keywords, but as constraints — every visual decision had to earn its place against this standard.
            </Body>
            <Body style={{ marginTop: CS.space.paragraph }}>
              Most DeFi projects land in one of two categories: technically impressive but visually forgettable, or visually striking but lacking substance. VirtuSwap needed to occupy the gap between them.
            </Body>
            <div style={{ marginTop: CS.space.stack }}>
              <p style={{ ...TYPE.p16SemiBold, margin: '0 0 16px' }}>The brand needed to:</p>
              {BRAND_CHALLENGES.map((item) => (
                <div key={item}>
                  <Divider />
                  <p style={{ ...TYPE.p16, margin: '16px 0' }}>{item}</p>
                </div>
              ))}
              <Divider />
            </div>
          </div>
        </SplitSection>

        <Divider />

        <SplitSection title={<SectionTitle>The Philosophy</SectionTitle>}>
          <Stack gap={36}>
            <Body>
              The protocol&apos;s belief is simple: the market has accepted unnecessary friction for too long. Trading costs are a solved problem, or they should be. VirtuSwap exists to prove it.
            </Body>
            <DisplayText>Efficiency is not just a feature. It is the brand.</DisplayText>
            <Body>
              This shaped every decision I made. Not aesthetics first. Conviction first. A brand built on optimization has no room for decoration that doesn&apos;t earn its place.
            </Body>
          </Stack>
        </SplitSection>

        <FullBleedImage src="/virtuswap_03.jpg" />

        <SplitSection title={<SectionTitle>Design Principle</SectionTitle>} pt={CS.space.section}>
          <Stack>
            <Body>Most DeFi brands draw inspiration from science fiction or space. I looked to Rome, drawing from the same values the protocol is built on: structured, solid, and designed to endure. That conviction became the foundation of the VirtuSwap logo.</Body>
          </Stack>
        </SplitSection>

        <FullBleedImage src="/virtuswap_04.jpg" />

        <FullBleedImage src="/virtuswap_05.jpg" />

        <FullBleedImage src="/virtuswap_06.jpg" />

        <FullBleedImage src="/virtuswap_07.jpg" />

        <FullBleedImage src="/virtuswap_08.jpg" />

        <div style={{ marginTop: CS.space.mediaTight }}>
          <FullBleedImage src="/virtuswap_09.jpg" />
        </div>

        <div style={{ marginTop: CS.space.mediaTight }}>
          <FullBleedImage src="/virtuswap_10.jpg" />
        </div>

        <div style={{ paddingTop: CS.space.section }}>
          <Divider />
        </div>

        <SplitSection title={<SectionTitle>Reflection</SectionTitle>}>
          <Stack gap={CS.space.paragraph}>
            <Body>Building a brand from the ground up, then shipping a landing page and pitch deck in under two months as the only designer on the project meant quality could never be the trade-off. The system had to be established and producing content within weeks of starting.</Body>
            <Body>If I could revisit this project, I&apos;d push harder on a motion design system. The Roman aesthetic paired with orange has obvious kinetic potential, but the timeline didn&apos;t allow for it. A set of animation principles would have given the landing page and social content a dimension the static system couldn&apos;t reach.</Body>
            <Body>What held up: the decision to commit fully to the Roman theme. It was a deliberate bet against the DeFi default, and it gave VirtuSwap a visual identity that was immediately recognizable.</Body>
          </Stack>
        </SplitSection>

        <div style={{ paddingTop: CS.space.section }}>
          <Divider />
        </div>

        <SplitSection title={<SectionTitle>Outcome</SectionTitle>}>
          <Stack>
            <div>
              <p style={{ ...TYPE.p16SemiBold, margin: '0 0 12px' }}>Business Impact</p>
              {[
                'Established a recognizable identity for a new DeFi protocol',
                'Created a scalable visual system',
                'Enabled consistent communication across product and marketing touchpoints',
              ].map((item) => (
                <div key={item}>
                  <Divider />
                  <p style={{ ...TYPE.p16, margin: '16px 0' }}>{item}</p>
                </div>
              ))}
              <Divider />
            </div>
            <div style={{ marginTop: CS.space.paragraph }}>
              <p style={{ ...TYPE.p16SemiBold, margin: '0 0 12px' }}>Design Impact</p>
              {[
                'Reduced complexity in communicating AMM mechanics',
                'Increased perceived credibility',
                'Created stronger differentiation from existing DEX brands',
              ].map((item) => (
                <div key={item}>
                  <Divider />
                  <p style={{ ...TYPE.p16, margin: '16px 0' }}>{item}</p>
                </div>
              ))}
              <Divider />
            </div>
            <DeliverableList />
          </Stack>
        </SplitSection>

        <Footer />
      </div>
    </main>
  );
}
