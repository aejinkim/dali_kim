import Link from 'next/link';
import Navbar from '@/components/main/Navbar';
import { CS, TYPE } from '../_shared/tokens';
import {
  SplitSection, Stack, SectionTitle, Body, SubTitle, DisplayText,
  Caption, Divider, Pill, FullBleedImage,
} from '../_shared/components';

const META = [
  { label: 'Role', value: 'Head of Design\nProduct Strategy\nUX Architecture\nSystem Design\nEcosystem Experience Design\nDesign Review' },
  { label: 'Scope', value: 'App\nGovernance\nVIP\nWidget\nPortfolio\nGhost Wallet\niUSD' },
  { label: 'Impact', value: '190K+ testnet wallets\n$40M+ TVL in first month\n0→1 brand + full product suite' },
] as const;

const DESIGN_CONSTRAINTS = [
  'Designing without user behavior data (newly launched ecosystem).',
  'Two radically different audiences: crypto newcomers and experienced on-chain users',
  'Presenting the user experience as a new chain.',
] as const;

const KEY_INSIGHTS = [
  'Assets felt fragmented.',
  'Power users needed greater information density.',
  'VIP was powerful but difficult to understand.',
] as const;

const IMPACT_STATS = [
  {
    number: '190K+',
    label: 'Testnet wallets',
    detail: 'V1 drove 190K+ wallets during testnet, designed without user data and guided by first-principles thinking.',
  },
  {
    number: '$40M+',
    label: 'TVL in first month',
    detail: 'The ecosystem held $40M in TVL within the first month of mainnet. The product held up under real market pressure.',
  },
  {
    number: '0 → 1',
    label: 'Brand to product',
    detail: 'Led design across brand identity, product, governance, and ecosystem tools from the ground up.',
  },
] as const;


function ListBlock({ items, numbered = true }: { items: readonly string[]; numbered?: boolean }) {
  return (
    <div style={{ marginTop: 16 }}>
      {items.map((item, i) => (
        <div key={i}>
          <Divider />
          <p style={{ ...TYPE.p16, margin: '16px 0', display: 'flex', gap: 16 }}>
            {numbered && (
              <span style={{ color: CS.color.dim, fontVariantNumeric: 'tabular-nums', minWidth: 24 }}>
                {String(i + 1).padStart(2, '0')}
              </span>
            )}
            {item}
          </p>
        </div>
      ))}
      <Divider />
    </div>
  );
}

function StatGrid() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      alignItems: 'stretch',
      marginTop: CS.space.stack,
    }}>
      {IMPACT_STATS.map((stat, i) => (
        <div key={i} style={{
          padding: '32px 24px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {i > 0 && (
            <div style={{
              position: 'absolute',
              left: 0,
              top: '10%',
              width: 1,
              height: '80%',
              backgroundColor: CS.color.line,
            }} />
          )}
          <p style={{ ...TYPE.p16SemiBold, fontSize: 42, fontWeight: 400, marginBottom: 4 }}>{stat.number}</p>
          <p style={{ ...TYPE.p16SemiBold, marginBottom: 12 }}>{stat.label}</p>
          <p style={{ ...TYPE.p16 }}>{stat.detail}</p>
        </div>
      ))}
    </div>
  );
}


function PageHeader() {
  return (
    <header className="cs-page-header" style={{
      minHeight: 153,
      paddingTop: CS.space.headerTop,
      paddingBottom: CS.space.section,
    }}>
      <div className="cs-page-header-intro">
        <p style={TYPE.h3_32SemiBold}>Initia App</p>
        <p style={TYPE.h3_20Regular}>Evolving a Flagship Product for a Growing Ecosystem</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <Pill>2023–2026</Pill>
          <Pill>Initia</Pill>
        </div>
      </div>
      <div className="cs-page-header-meta">
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
        border: `1px solid ${CS.color.lineStrong}`,
        borderRadius: 100,
      }}>Get in touch</a>
    </footer>
  );
}

export default function InitiaAppV2Page() {
  return (
    <main style={{ backgroundColor: CS.color.white, color: CS.color.ink }}>
      <Navbar alwaysVisible tone="light" />
      <div
        className="content-width"
        style={{
          maxWidth: CS.size.frame,
          margin: '0 auto',
          overflow: 'hidden',
          padding: '0 var(--cs-page-inset)',
          boxSizing: 'border-box',
        }}
      >
        <PageHeader />

        <FullBleedImage src="/assets/initia/initia_01.png" aspect="16 / 9" />

        <SplitSection title={<SectionTitle>Project Overview</SectionTitle>}>
          <Stack>
            <div>
              <SubTitle>The Initia App</SubTitle>
              <Body>
                The Initia App is the primary gateway to the Initia ecosystem, where users stake assets, swap tokens, bridge across chains, participate in governance, and manage their portfolio. Designed as the ecosystem&apos;s flagship product, it transforms complex multichain interactions into a unified and intuitive experience.
              </Body>
            </div>
            <div>
              <SubTitle>Role</SubTitle>
              <Body>
                As Head of Design, I led the evolution of Initia&apos;s flagship product across two major releases. V1 lowered the barrier to blockchain for new users. As the ecosystem matured, V2 evolved into a more sophisticated experience designed for users who had become active participants.
              </Body>
            </div>
          </Stack>
        </SplitSection>

        <Divider />

        {/* ── V1 ─────────────────────────────────────────────── */}

        <SplitSection
          title={<div><SectionTitle>Initia App V1</SectionTitle><p style={{ ...TYPE.p16, marginTop: 8 }}>Designing Without Data</p></div>}
          pt={CS.space.section} pb={100}
        >
          <div>
            <Body>
              Initia wasn&apos;t building a single blockchain. It was building an ecosystem of interconnected chains. The challenge was to bring staking, swapping, governance, and portfolio management into one intuitive experience.
            </Body>
            <div style={{ marginTop: CS.space.stack }}>
              <p style={TYPE.p16SemiBold}>The Constraints:</p>
              <ListBlock items={DESIGN_CONSTRAINTS} numbered={false} />
            </div>
            <div style={{ marginTop: CS.space.stack }}>
              <p style={TYPE.p16SemiBold}>Design Philosophy</p>
              <DisplayText style={{ marginTop: 20 }}>
                Design for the user who knows nothing. Make the first experience feel effortless.
              </DisplayText>
            </div>
          </div>
        </SplitSection>

        <Divider />

        <SplitSection title={<SectionTitle>Implementation</SectionTitle>} pt={CS.space.section} pb={0}>
          <div>
            <Caption>One thing at a time</Caption>
            <Body style={{ marginTop: CS.space.captionText }}>
              V1 was developed to eliminate the inherent complexity of traditional DeFi, providing a streamlined experience that removes the friction users often face when onboarding to a new blockchain. By simplifying the decision making process, we allow users to focus on their goals rather than navigating overwhelming data.
            </Body>
            <Body style={{ marginTop: CS.space.paragraph }}>
              While technical details like APR, TVL, liquidity depth, and positional specifics remain accessible, they are not displayed by default. Instead, each screen highlights only the essential tasks at hand.
            </Body>
          </div>
        </SplitSection>

        <div style={{ marginTop: CS.space.stack }}>
          <FullBleedImage src="/assets/initia_app/initia_app_02.mp4" />
        </div>

        <SplitSection title={<div />} pt={CS.space.section} pb={0}>
          <div>
            <Caption>Action Based Design: Prioritizing User Tasks over Labels</Caption>
            <Body style={{ marginTop: CS.space.captionText }}>
              Rather than relying on feature based labeling, the interface was built around action oriented communication. Each screen is designed to guide users by proactively highlighting available actions or current context, such as selecting an asset for staking or identifying the status of a governance vote.
            </Body>
            <Body style={{ marginTop: CS.space.paragraph }}>
              By significantly reducing cognitive load, this method empowers users to navigate complex blockchain concepts with confidence. It serves as a core design system that defines the entire V1 experience.
            </Body>
          </div>
        </SplitSection>

        <div style={{ marginTop: CS.space.stack, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <FullBleedImage src="/assets/initia_app/initia_app_03.mp4" />
          <FullBleedImage src="/assets/initia_app/initia_app_04.jpg" />
          <FullBleedImage src="/assets/initia_app/initia_app_05.jpg" />
        </div>

        {/* ── V2 ─────────────────────────────────────────────── */}

        <div style={{ paddingTop: CS.space.section }}>
          <Divider />
        </div>

        <SplitSection
          title={<div><SectionTitle>Initia App V1 → V2</SectionTitle><p style={{ ...TYPE.p16, marginTop: 8 }}>Redesigning for Power Users</p></div>}
          pt={CS.space.section} pb={0}
        >
          <div>
            <Body>
              V1 was a bold, foundational challenge for a new blockchain ecosystem. While we initially prioritized strategic simplicity to drive broad adoption and establish our footprint, V2 was a comprehensive rebuild driven by rigorous product analysis, user interviews, and usability testing.
            </Body>
            <Body style={{ marginTop: CS.space.paragraph }}>
              The data revealed a clear truth: our core user base had evolved beyond the &apos;beginner&apos; phase. We pivoted our focus to empower these power users by directly addressing their needs: a unified portfolio view for seamless asset tracking, visual transparency for complex VIP incentive mechanisms, and optimized liquidity management for a fragmented multi-chain landscape.
            </Body>
            <div style={{ marginTop: CS.space.stack }}>
              <p style={TYPE.p16SemiBold}>Key Insights from Research</p>
              <ListBlock items={KEY_INSIGHTS} numbered={false} />
            </div>
          </div>
        </SplitSection>

        <div style={{ paddingTop: CS.space.section }}>
          <Divider />
        </div>

        <SplitSection title={<SectionTitle>Key UX Strategies</SectionTitle>} pb={0}>
          <div>
            <Caption>Home as a Control Center</Caption>
            <Body style={{ marginTop: CS.space.captionText }}>
              The Home page redesign transforms Initia into a robust financial hub. Based on V1 user testing, this overhaul optimizes the environment for power users with data-driven entry points.
            </Body>
            <div style={{ marginTop: CS.space.stack }}>
              <Divider />
              <div style={{ marginTop: 16 }}>
                <p style={TYPE.p16SemiBold}>Transitioning into an Ecosystem Hub</p>
                <Body style={{ marginTop: CS.space.captionText }}>
                  The &apos;Featured appchains&apos; section serves as a navigation gateway for the ecosystem. Additionally, the &apos;Latest News&apos; area bridges product updates and yield opportunities to drive user action.
                </Body>
              </div>
              <div style={{ marginTop: CS.space.stack }}>
                <p style={TYPE.p16SemiBold}>Unified Portfolio Management</p>
                <Body style={{ marginTop: CS.space.captionText }}>
                  Total assets and rewards are positioned at the top for immediate visibility. Assets are grouped by type (Liquid, LP, and Appchain) for at-a-glance status checks.
                </Body>
              </div>
              <div style={{ marginTop: CS.space.stack }}>
                <p style={TYPE.p16SemiBold}>Actionable Insights</p>
                <Body style={{ marginTop: CS.space.captionText }}>
                  Sections like &apos;Claimable rewards&apos;, &apos;Epoch timers&apos;, and &apos;What&apos;s New&apos; are strategically placed to facilitate direct user engagement.
                </Body>
              </div>
            </div>
          </div>
        </SplitSection>

        <div style={{ marginTop: CS.space.stack }}>
          <FullBleedImage src="/assets/initia_app/initia_app_07.jpg" />
        </div>

        <SplitSection title={<div />} pt={CS.space.section} pb={0}>
          <div>
            <Caption>VIP: Turning Complexity into Clarity</Caption>
            <Body style={{ marginTop: CS.space.captionText }}>
              VIP (Vested Interest Program) is Initia&apos;s core economic engine, but its multi-stage structure made it difficult for users to know where they stood or what to do next.
            </Body>
            <Body style={{ marginTop: CS.space.paragraph }}>
              V2 redesigned the entire system as a visual experience. Cycle and stage context appears consistently across all related screens, reward accrual updates in real time, and allocation and claim schedules surface together. This makes the relationship between participation and payout immediately clear.
            </Body>
          </div>
        </SplitSection>

        <div style={{ marginTop: CS.space.stack, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <FullBleedImage src="/assets/initia_app/initia_app_08.jpg" />
          <FullBleedImage src="/assets/initia_app/initia_app_09.jpg" />
        </div>

        <SplitSection title={<div />} pt={CS.space.section} pb={0}>
          <div>
            <Caption>Information Density by Intent</Caption>
            <Body style={{ marginTop: CS.space.captionText }}>
              V2 rejected the idea that complexity should be hidden. Rather than using progressive disclosure to bury depth, the interface surfaces relevant data at the exact moment a user is ready to act on it.
            </Body>
            <Body style={{ marginTop: CS.space.paragraph }}>
              On pool pages, TVL trends, pool composition, APR breakdowns, and position metrics are visible by default. In the deposit flow, slippage tolerance, price impact, and fee estimates appear inline rather than tucked behind a settings panel. The interface treats users as capable of handling real information at the point they have already chosen to engage.
            </Body>
          </div>
        </SplitSection>

        <div style={{ marginTop: CS.space.stack, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <FullBleedImage src="/assets/initia_app/initia_app_10.jpg" />
          <FullBleedImage src="/assets/initia_app/initia_app_11.jpg" />
          <FullBleedImage src="/assets/initia_app/initia_app_12.jpg" />
        </div>

        <div style={{ paddingTop: CS.space.section }}>
          <Divider />
        </div>

        <SplitSection title={<SectionTitle>Outcome</SectionTitle>}>
          <Stack gap={CS.space.paragraph}>
            <Body>
              V1 proved that a DeFi product could lower the barrier to entry without sacrificing functionality. V2 responded to what users became after they arrived, addressing each friction point directly: a financial control center, VIP visualized end-to-end, and liquidity management built for depth.
            </Body>
            <DisplayText>
              V1 reduced the decision surface. V2 expanded what users could do with it.
            </DisplayText>
            <StatGrid />
          </Stack>
        </SplitSection>

        <div style={{ marginTop: CS.space.stack }}>
          <FullBleedImage src="/assets/initia_app/initia_app_13.jpg" />
        </div>

        <Footer />
      </div>
    </main>
  );
}
