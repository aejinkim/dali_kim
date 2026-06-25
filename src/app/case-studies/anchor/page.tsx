import Link from 'next/link';
import Navbar from '@/components/main/Navbar';
import { CS, TYPE } from '../_shared/tokens';
import {
  SplitSection,
  Stack,
  SectionTitle,
  Body,
  SubTitle,
  DisplayText,
  Caption,
  Divider,
  Pill,
  FullBleedImage,
} from '../_shared/components';

const META = [
  { label: 'Role', value: 'Senior Product Designer' },
  { label: 'Scope', value: 'Product Design\nUX Research\nDesign System' },
  { label: 'Impact', value: '$16B Peak TVL\nMass Retail Adoption' },
] as const;

const COMPLEXITY_ITEMS = [
  'Liquidation ratios and collateralized debt positions (CDPs)',
  'Variable interest rates that moved double digits in a single day',
  'Multi-step wallet interactions, gas optimizations, and approval flows',
  'No clear indication of what the user actually earned or held',
] as const;

const DELIVERABLES = [
  'Anchor Earn: simplified deposit and withdrawal UX',
  'Dashboard redesign: single-balance card replacing complex portfolio views',
  'Wallet Connect integration: 3-method connection system with visual hierarchy',
  'Cross-chain bridge UX: step-by-step wizards for Terra Bridge transfers',
  'Design system: components, tokens, and patterns across Anchor surfaces',
  'Investor and partner collateral: decks and visual assets for ecosystem growth',
] as const;


function ScaleStats() {
  const stats = [
    { value: '$16B', label: 'TVL at peak' },
    { value: '19.5%', label: 'Fixed APY' },
    { value: '#1', label: 'DeFi savings by TVL (Terra ecosystem)' },
  ];

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: CS.space.section, paddingTop: CS.space.section, paddingBottom: 100 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <SectionTitle>The Scale</SectionTitle>
      </div>
      <div className="cs-stats-grid">
        {stats.map((stat) => (
          <div key={stat.value} style={{
            minHeight: 99,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 8,
          }}>
            <p style={{ ...TYPE.p56Regular, whiteSpace: 'nowrap' }}>{stat.value}</p>
            <p style={{ ...TYPE.p16 }}>{stat.label}</p>
          </div>
        ))}
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
    <header className="cs-page-header" style={{
      minHeight: 153,
      paddingTop: CS.space.headerTop,
      paddingBottom: CS.space.section,
    }}>
      <div className="cs-page-header-intro">
        <p style={TYPE.h3_32SemiBold}>Anchor Protocol</p>
        <p style={TYPE.h3_20Regular}>DeFi Savings Protocol UX to $16B+ TVL</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <Pill>2021 – 2023</Pill>
          <Pill>Terraform Labs</Pill>
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

export default function AnchorPage() {
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

        <FullBleedImage src="/assets/anchor/anchor_01.jpg" aspect="16 / 9" />

        <SplitSection title={<SectionTitle>Project Overview</SectionTitle>}>
          <Stack>
            <div>
              <SubTitle>Anchor Protocol</SubTitle>
              <Body>
                Anchor is a DeFi savings protocol built on the Terra blockchain. Users deposit UST stablecoins and earn yield generated by staking rewards from collateralized crypto assets (bAssets). The protocol&apos;s goal was to offer a stable, predictable interest rate in a market defined by volatility.
              </Body>
            </div>
            <div>
              <SubTitle>My Role</SubTitle>
              <Body>
                I joined Terraform Labs as Senior Product Designer and owned Anchor Protocol&apos;s product design end to end. That meant the core Earn and Borrow flows, the wallet connection system, the cross-chain bridge UX, and the design system that tied all of it together. I also produced investor decks and partner collateral as the protocol scaled.
              </Body>
            </div>
          </Stack>
        </SplitSection>

        <Divider />

        <SplitSection title={<SectionTitle>The Problem</SectionTitle>} pt={CS.space.section} pb={100}>
          <div>
            <Body>
              DeFi in 2021 was built by engineers for engineers. The assumption baked into every interface was that the user already understood the underlying mechanics. Most did not.
            </Body>
            <Body style={{ marginTop: CS.space.paragraph }}>
              Anchor&apos;s opportunity was the gap between what DeFi promised (accessible yield) and what it delivered (an experience that required a technical background to navigate). Closing that gap was the design problem.
            </Body>
            <div style={{ marginTop: CS.space.stack }}>
              <p style={{ ...TYPE.p16SemiBold, margin: '0 0 16px' }}>What users had to understand just to start:</p>
              {COMPLEXITY_ITEMS.map((item, i) => (
                <div key={i}>
                  <Divider />
                  <p style={{ ...TYPE.p16, margin: '16px 0' }}>{item}</p>
                </div>
              ))}
              <Divider />
            </div>
          </div>
        </SplitSection>

        <div style={{ paddingTop: 0 }}>
          <Divider />
        </div>

        <SplitSection title={<SectionTitle>UX Solutions</SectionTitle>}>
          <Stack gap={CS.space.stack}>
            <Body>
              Anchor&apos;s true innovation lay in abstracting complex, niche Web3 and DeFi concepts into an
              elegant, mass-market UX/UI.
            </Body>
            <DisplayText>
              Anchor achieved a $16B TVL by abstracting complex blockchain elements into a seamless, familiar
              user experience.
            </DisplayText>
            <div>
              <Caption>Inverting Assumptions: Designing DeFi for Everyone</Caption>
              <Body style={{ marginTop: CS.space.captionText }}>
                At the time, typical DeFi dashboards were cluttered with liquidation ratios, collateralization
                factors, fluctuating APY graphs, and multi-step transaction flows. Every interface was designed
                under the assumption that users already understood the underlying protocol mechanics.
              </Body>
              <Body style={{ marginTop: CS.space.paragraph }}>
                For Anchor&apos;s Earn screen, we stripped away this complexity, simplifying it to a single,
                defining metric: the user&apos;s balance. Below it, we placed just two primary actions — Deposit
                and Withdraw. Nothing else was allowed to compete for visual real estate. This entire experience
                was built on the inverse assumption that users knew absolutely nothing about DeFi. Ultimately,
                this paradigm shift became the single greatest driver of the product&apos;s explosive growth.
              </Body>
            </div>
          </Stack>
        </SplitSection>

        <Divider />

        <ScaleStats />

        <FullBleedImage src="/assets/anchor/Anchor_02.jpg" />
        <div style={{ marginTop: CS.space.mediaTight }}>
          <FullBleedImage src="/assets/anchor/Anchor_03.jpg" />
        </div>
        <div style={{ marginTop: CS.space.mediaTight }}>
          <FullBleedImage src="/assets/anchor/Anchor_04.jpg" />
        </div>

        <SplitSection title={<div />} pt={CS.space.section} pb={0}>
          <div>
            <Caption>Scaling via Multi-Chain Expansion: Cultivating UST Demand and Collateral Diversification</Caption>
            <Body style={{ marginTop: CS.space.captionText }}>
              At the time, Anchor was pursuing a global multi-chain (xAnchor) strategy across Ethereum, Avalanche, Fantom, and Polygon. My core challenge was minimizing interface friction across radically different network environments.
            </Body>
            <Body style={{ marginTop: CS.space.paragraph }}>
              I led the alignment of all peripheral design systems with Anchor&apos;s master framework, systematically mapping design tokens, components, and layouts across all chains. This eliminated visual fragmentation and delivered a seamless, cohesive UX regardless of which network the user originated from.
            </Body>
          </div>
        </SplitSection>

        <div style={{ marginTop: CS.space.section }}>
          <FullBleedImage src="/assets/anchor/Anchor_05.jpg" />
        </div>

        <div style={{ marginTop: CS.space.mediaTight }}>
          <FullBleedImage src="/assets/anchor/Anchor_06.jpg" />
        </div>

        <div style={{ paddingTop: CS.space.section }}>
          <Divider />
        </div>

        <SplitSection title={<SectionTitle>Anchor 2.0</SectionTitle>}>
          <Stack gap={CS.space.paragraph}>
            <Body>
              By late 2021, a full redesign was underway. Anchor 2.0 was not a visual refresh. It was a rethinking of the information architecture: how to surface yield context without overwhelming depositors, how to communicate protocol health, how to build transparency into a product that had optimized for simplicity.
            </Body>
            <Body>
              The 2.0 direction introduced clearer yield sourcing context, a redesigned dashboard with protocol health indicators, and a more layered information model. Users who wanted to go deeper could. Users who did not could still deposit with two buttons.
            </Body>
            <Body>
              It was the version that would have addressed what 1.0 left unsaid. It was never shipped.
            </Body>
          </Stack>
        </SplitSection>

        <FullBleedImage src="/assets/anchor/Anchor_07.jpg" />

        <div style={{ paddingTop: CS.space.section }}>
          <Divider />
        </div>

        <SplitSection title={<SectionTitle>Reflection</SectionTitle>} pb={0}>
          <Stack gap={CS.space.paragraph}>
            <Body>
              Anchor was the product I was most attached to. While its $16 billion scale was undeniable, it wasn&apos;t just about the numbers. My decisions on what to show and what to hide directly influenced how hundreds of thousands of people understood their own money.
            </Body>
            <Body>
              When everything collapsed, we were in the middle of developing version 2.0 on May 7, 2022. Looking back, the decisions made during the product design stage ultimately dictated the exact manner of its implosion. The fixed 19.5% APY displayed on the screen wasn&apos;t a lie, but it wasn&apos;t the whole truth either. That rate was heavily subsidized by the Luna Foundation Guard, rather than being organically generated by the protocol itself. While the interface presented a reassuringly stable number, the underlying economic mechanics were anything but stable.
            </Body>
            <Body>
              The deliberate simplicity of the UI opened doors for everyday depositors, yet it simultaneously stripped away crucial context. Because it looked and felt just like a traditional bank account, users had no frame of reference to understand what was actually happening when that fixed rate began to fracture. Because the design failed to provide the necessary terminology, users were left unable to read the warning signs.
            </Body>
            <Body>
              Version 2.0 attempted to rectify these fatal flaws. We aimed to increase transparency, offer deeper protocol context, and introduce a tiered disclosure model that allowed users to dive as deep as they desired. Regrettably, these efforts never got the chance to bear fruit.
            </Body>
            <Body>
              The defining lesson from this experience is that designing for trust at scale demands a profound sense of responsibility that extends far beyond the screen.
            </Body>
          </Stack>
        </SplitSection>

        <div style={{ paddingTop: CS.space.section }}>
          <Divider />
        </div>

        <SplitSection title={<SectionTitle>Outcome</SectionTitle>}>
          <Stack>
            <Body>
              Anchor Protocol reached $16 billion in TVL at its peak, making it the largest DeFi savings protocol in the Terra ecosystem and one of the largest in the world at the time.
            </Body>
            <DeliverableList />
          </Stack>
        </SplitSection>

        <Footer />
      </div>
    </main>
  );
}
