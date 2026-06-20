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
    blue: '#1A56DB',
    blueMuted: 'rgba(26,86,219,0.08)',
  },
  size: {
    frame: 'clamp(1438px, calc(712px + 50.4167vw), 1680px)',
    inset: 40,
    half: 800,
    headerIntro: 'clamp(538px, calc(112px + 29.5833vw), 680px)',
    leftText: 420,
    leftMediaGap: 80,
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
  { label: 'Role', value: 'Lead Product Designer\n(Head of Design)' },
  { label: 'Scope', value: 'Product Design\nDesign System\nBranding' },
  { label: 'Company', value: 'Fount Inc.\n2020 – 2021' },
] as const;

const CHALLENGES = [
  'A brand-new concept with no existing mental model: Korea had never heard the word "robo-advisor" before',
  'A multi-step onboarding spanning investment profiles, advisory contracts, and partner financial institution accounts',
  'A user base with low financial literacy and high skepticism toward automated money management',
] as const;

const DESIGN_DECISIONS = [
  {
    number: '01',
    title: 'Making the Invisible Visible',
    challenge: 'An AI managing money is, by design, invisible. No knobs to turn. No decisions to approve. Users were investing but couldn\'t see where their money was or whether it was working. Opacity creates anxiety, and anxiety stops deposits.',
    decision: 'I built an asset visualization system that surfaced portfolio composition, allocation breakdown, and earnings in a single view. The goal was to make the algorithm\'s output legible. Once users could see their money working, the AI became a collaborator rather than a black box.',
  },
  {
    number: '02',
    title: 'Recommendation Front and Center',
    challenge: 'The natural layout for a financial app leads with balances and transaction history. That works for a bank. But Fount\'s value is the AI recommendation itself. Burying it in a secondary tab meant burying the product\'s entire reason for existing.',
    decision: 'I moved the AI recommendation module to the main screen. Not nested. Not discoverable. Visible on launch. If the recommendation is what makes Fount different, it should be the first thing a user sees.',
  },
  {
    number: '03',
    title: 'One Goal Per Screen',
    challenge: 'The onboarding required completing an investment profile, signing an advisory contract, and opening a financial account through a partner institution. Each step had its own dependencies and verification requirements. Combined into a single flow, it was overwhelming.',
    decision: 'I restructured onboarding into a conversational format where each screen had exactly one question or one action. Users always knew where they were, what was next, and why. The cognitive load dropped. Users who made it to account opening converted at 90%.',
  },
] as const;

const DELIVERABLES = [
  'Product design across iOS and Android: fund, ETF, pension, and CMA products',
  'Onboarding flow redesign: investment profile, advisory contract, account opening',
  'Asset visualization system: portfolio breakdown, allocation, real-time earnings',
  'AI recommendation module: main screen placement and information hierarchy',
  'Design system: components, type scale, color, spacing, built solo',
  'Branding: visual language applied across app and web surfaces',
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

function Divider() {
  return <div style={{ height: 1, background: CS.color.line }} />;
}

function Pill({ children }: { children: ReactNode }) {
  return (
    <span style={{
      ...TYPE.tag12,
      height: CS.size.tagHeight,
      padding: '0 10px',
      border: `1.5px solid ${CS.color.pillBorder}`,
      borderRadius: 100,
      display: 'inline-flex',
      alignItems: 'center',
    }}>
      {children}
    </span>
  );
}

function FullBleedImage({ src, aspect = '16 / 9' }: { src: string; aspect?: string }) {
  return (
    <div style={{ width: '100%', aspectRatio: aspect, overflow: 'hidden' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" style={MEDIA_STYLE.cover} />
    </div>
  );
}

function NarrativeHook() {
  return (
    <section style={{
      paddingTop: CS.space.section,
      paddingBottom: CS.space.section,
      borderTop: `1px solid ${CS.color.line}`,
      borderBottom: `1px solid ${CS.color.line}`,
    }}>
      <DisplayText style={{ maxWidth: 900 }}>
        You cannot see an algorithm work.<br />
        You can only see what it builds.
      </DisplayText>
      <Body muted style={{ marginTop: CS.space.quoteGap, maxWidth: 580 }}>
        Fount is South Korea&apos;s first scaled AI robo-advisor. The platform manages complex asset portfolios through algorithmic allocation across funds, ETFs, and retirement accounts. No human advisor. No manual rebalancing. An AI making decisions with real money.
      </Body>
      <Body muted style={{ marginTop: CS.space.paragraph, maxWidth: 580 }}>
        The design challenge was trust. Making someone comfortable handing financial control to something they cannot observe.
      </Body>
    </section>
  );
}

function FunnelInsight() {
  const stats = [
    { value: '7%', label: 'Install to first deposit', note: 'The full funnel, unfiltered' },
    { value: '90%', label: 'Account opening to deposit', note: 'Once users committed this far' },
    { value: '1.5T KRW', label: 'AUM at peak', note: 'South Korea market leader' },
  ];

  return (
    <section style={{ paddingTop: CS.space.section, paddingBottom: CS.space.section }}>
      <SectionTitle>The Insight</SectionTitle>
      <div style={{ marginTop: CS.space.xl }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: CS.color.line }}>
          {stats.map((stat) => (
            <div key={stat.value} style={{ background: CS.color.white, padding: '40px 32px' }}>
              <p style={{ ...TYPE.p56Regular, marginBottom: 12 }}>{stat.value}</p>
              <p style={{ ...TYPE.p16SemiBold, marginBottom: 8 }}>{stat.label}</p>
              <p style={{ ...TYPE.tag12, color: CS.color.dim }}>{stat.note}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: CS.space.stack }}>
          <Body>
            The shape of the funnel told a clear story. Only 7% of users who installed the app ever made a deposit. But of users who reached account opening, 90% followed through. The barrier was not intent. It was comprehension. Users who understood what Fount was, trusted it. Getting them to that point was the design problem.
          </Body>
        </div>
      </div>
    </section>
  );
}

function DesignDecisions() {
  return (
    <section style={{ paddingTop: CS.space.section, paddingBottom: CS.space.section }}>
      <SectionTitle>Design Decisions</SectionTitle>
      <div style={{ marginTop: CS.space.xl }}>
        {DESIGN_DECISIONS.map((item, i) => (
          <div key={item.number}>
            {i > 0 && <Divider />}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '80px 1fr 1fr',
              gap: 40,
              padding: `${CS.space.stack}px 0`,
              alignItems: 'flex-start',
            }}>
              <p style={{ ...TYPE.tag12, color: CS.color.dim, paddingTop: 4 }}>{item.number}</p>
              <div>
                <p style={{ ...TYPE.p16SemiBold, marginBottom: 12 }}>{item.title}</p>
                <Body muted>{item.challenge}</Body>
              </div>
              <div style={{
                background: CS.color.blueMuted,
                borderLeft: `2px solid ${CS.color.blue}`,
                padding: '16px 20px',
              }}>
                <p style={{ ...TYPE.tag12, color: CS.color.blue, marginBottom: 8, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Decision</p>
                <Body>{item.decision}</Body>
              </div>
            </div>
          </div>
        ))}
        <Divider />
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
        <p style={TYPE.h3_32SemiBold}>Fount Robo-Advisor</p>
        <p style={TYPE.h3_20Regular}>WealthTech Product Design</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <Pill>2020 – 2021</Pill>
          <Pill>WealthTech</Pill>
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

export default function FountPage() {
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

        <FullBleedImage src="/fount_thumbnail.png" />

        <NarrativeHook />

        <SplitSection title={<SectionTitle>Project Overview</SectionTitle>}>
          <Stack>
            <div>
              <SubTitle>Fount</SubTitle>
              <Body>
                Fount manages asset portfolios through three core products: actively managed funds, domestic and overseas ETFs, and pension accounts (IRP). A CMA account handles liquid savings. The platform&apos;s AI allocates and rebalances automatically, guided by market conditions and each user&apos;s investment profile. There is no human advisor in the loop.
              </Body>
            </div>
            <div>
              <SubTitle>My Role</SubTitle>
              <Body>
                I joined as Lead Product Designer and Head of Design. I owned the entire product and visual surface across iOS and Android, and acted as a hybrid PM for feature planning, requirements drafting, QA tracking, and A/B test coordination. The design system was built from scratch, by me, while the product was actively shipping.
              </Body>
            </div>
          </Stack>
        </SplitSection>

        <Divider />

        <SplitSection title={<SectionTitle>The Challenge</SectionTitle>} pt={CS.space.section}>
          <div>
            <Body>
              The challenges were not just UX problems. They were trust problems.
            </Body>
            <Body style={{ marginTop: CS.space.paragraph }}>
              Fount launched at a time when most Koreans had never heard the word &ldquo;robo-advisor.&rdquo; The idea of an AI managing your savings was novel at best, suspicious at worst. The sign-up flow required users to complete a financial assessment, sign an investment advisory contract, and open a securities account through a partner financial institution, each with its own verification steps.
            </Body>
            <div style={{ marginTop: CS.space.stack }}>
              {CHALLENGES.map((item, i) => (
                <div key={i}>
                  <Divider />
                  <p style={{ ...TYPE.p16, margin: '16px 0' }}>{item}</p>
                </div>
              ))}
              <Divider />
            </div>
          </div>
        </SplitSection>

        <FullBleedImage src="/fount_01.png" />

        <FunnelInsight />

        <FullBleedImage src="/fount_02.png" />

        <DesignDecisions />

        <FullBleedImage src="/fount_03.png" />

        <div style={{ marginTop: CS.space.mediaTight }}>
          <FullBleedImage src="/fount_04.png" />
        </div>

        <div style={{ paddingTop: CS.space.section }}>
          <Divider />
        </div>

        <SplitSection title={<SectionTitle>Reflection</SectionTitle>}>
          <Stack gap={CS.space.paragraph}>
            <Body>
              Building a design system solo while the product was actively shipping means making decisions faster than they can be validated. Some of those decisions held. Some didn&apos;t.
            </Body>
            <Body>
              The asset visualization system worked better than expected. Users responded to seeing their money organized and labeled. It reduced the sense of handing control to something unknown.
            </Body>
            <Body>
              If I could revisit this project, I&apos;d spend more time on how the AI communicated its reasoning. Explaining why an algorithm made a specific allocation choice, in plain language, would have built more trust than any visual redesign. The recommendation was treated as an output. It should have been a conversation.
            </Body>
          </Stack>
        </SplitSection>

        <div style={{ paddingTop: CS.space.section }}>
          <Divider />
        </div>

        <SplitSection title={<SectionTitle>Outcome</SectionTitle>}>
          <Stack>
            <Body>
              Fount reached 1.5 trillion KRW in assets under management, establishing itself as South Korea&apos;s leading robo-advisor by AUM.
            </Body>
            <div style={{
              background: CS.color.blueMuted,
              borderLeft: `2px solid ${CS.color.blue}`,
              padding: '20px 24px',
            }}>
              <p style={{ ...TYPE.tag12, color: CS.color.blue, marginBottom: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}>User Feedback</p>
              <p style={{ ...TYPE.p28Regular, marginBottom: 10 }}>&ldquo;People who don&apos;t know much about investing can use this easily.&rdquo;</p>
              <p style={{ ...TYPE.tag12, color: CS.color.dim }}>재테크를 잘 모르는 사람도 쉽게 이용할 수 있는 것 같습니다.</p>
            </div>
            <DeliverableList />
          </Stack>
        </SplitSection>

        <Footer />
      </div>
    </main>
  );
}
