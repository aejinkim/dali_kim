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
  Divider,
  Pill,
  FullBleedImage,
} from '../_shared/components';

const PAGE = {
  color: {
    teal: '#0EA882',
    tealMuted: 'rgba(14,168,130,0.08)',
  },
};

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

const DESIGN_DECISIONS = [
  {
    number: '01',
    title: 'One Number, Two Buttons',
    challenge: 'DeFi dashboards at the time displayed liquidation ratios, collateral percentages, variable APY graphs, and multi-step transaction flows. Every screen assumed the user already understood how the protocol worked.',
    decision: 'I stripped Anchor\'s Earn screen to a single number: your balance. Below it, two buttons. Deposit. Withdraw. Nothing else earned screen space. The design assumed the user understood nothing about DeFi, and that assumption turned out to be the product\'s biggest growth lever.',
  },
  {
    number: '02',
    title: 'Fixed Rate as a Trust Signal',
    challenge: 'DeFi interest rates fluctuated constantly, sometimes swinging 10 to 20 percent in a single day. Users had no mental model for this. Variable yields felt like gambling, not saving.',
    decision: 'I designed the 19.5% APY as a fixed, always-visible number on the main screen. Not a range. Not a "current rate." A number that did not change. The stability of that display translated directly into user trust. Stable design, stable rate, stable deposits.',
  },
  {
    number: '03',
    title: 'Wallet Connection as a Flow, Not a Choice',
    challenge: 'Anchor supported three connection methods: Chrome Extension, WalletConnect for mobile, and Readonly mode. Presenting them as equal options left users unsure where to start.',
    decision: 'I designed a visual hierarchy that made Chrome Extension and WalletConnect the clear primary paths, and placed Readonly as a utility option for developers. The order and visual weight of the options told users what to do without having to explain why. Connection friction dropped.',
  },
] as const;

const DELIVERABLES = [
  'Anchor Earn: simplified deposit and withdrawal UX',
  'Dashboard redesign: single-balance card replacing complex portfolio views',
  'Wallet Connect integration: 3-method connection system with visual hierarchy',
  'Cross-chain bridge UX: step-by-step wizards for Terra Bridge transfers',
  'Design system: components, tokens, and patterns across Anchor surfaces',
  'Investor and partner collateral: decks and visual assets for ecosystem growth',
] as const;



function NarrativeHook() {
  return (
    <section style={{
      paddingTop: CS.space.section,
      paddingBottom: CS.space.section,
      borderTop: `1px solid ${CS.color.line}`,
      borderBottom: `1px solid ${CS.color.line}`,
    }}>
      <DisplayText style={{ maxWidth: 900 }}>
        DeFi had a user problem.<br />
        Most people could not use it.
      </DisplayText>
      <Body muted style={{ marginTop: CS.space.quoteGap, maxWidth: 580 }}>
        Anchor Protocol bet that removing everything a user could not understand would unlock everyone else. Design it like a bank account. Remove the jargon. Make the yield visible. Let people save.
      </Body>
      <Body muted style={{ marginTop: CS.space.paragraph, maxWidth: 580 }}>
        At its peak, Anchor held $16 billion in deposits. Most of those depositors had never used a DeFi protocol before.
      </Body>
    </section>
  );
}

function ScaleStats() {
  const stats = [
    { value: '$16B', label: 'TVL at peak', note: 'Total value locked in deposits' },
    { value: '19.5%', label: 'Fixed APY', note: 'The number that did not move' },
    { value: '#1', label: 'DeFi savings by TVL', note: 'Terra ecosystem, 2022' },
  ];

  return (
    <section style={{ paddingTop: CS.space.section, paddingBottom: CS.space.section }}>
      <SectionTitle>The Scale</SectionTitle>
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
            These numbers did not come from a technical breakthrough alone. Anchor&apos;s economic model provided the yield. The design decided who could access it. A product that only crypto-native users could navigate would have stayed small. The decision to design for people who had never heard of DeFi was what made the scale possible.
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
                background: PAGE.color.tealMuted,
                borderLeft: `2px solid ${PAGE.color.teal}`,
                padding: '16px 20px',
              }}>
                <p style={{ ...TYPE.tag12, color: PAGE.color.teal, marginBottom: 8, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Decision</p>
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
        <p style={TYPE.h3_32SemiBold}>Anchor Protocol</p>
        <p style={TYPE.h3_20Regular}>DeFi Savings Product Design</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <Pill>2021 – 2023</Pill>
          <Pill>Terraform Labs</Pill>
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

        <FullBleedImage src="/anchor_thumbnail.png" aspect="16 / 9" />

        <NarrativeHook />

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

        <SplitSection title={<SectionTitle>The Problem</SectionTitle>} pt={CS.space.section}>
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
            <Body muted style={{ marginTop: CS.space.stack }}>
              The bet was that none of this complexity needed to be visible to a depositor. The depositor needed to know one thing: that their money was growing.
            </Body>
          </div>
        </SplitSection>

        <FullBleedImage src="/anchor_01.png" aspect="16 / 9" />

        <ScaleStats />

        <FullBleedImage src="/anchor_02.png" aspect="16 / 9" />

        <DesignDecisions />

        <FullBleedImage src="/anchor_03.png" aspect="16 / 9" />

        <div style={{ marginTop: CS.space.mediaTight }}>
          <FullBleedImage src="/anchor_04.png" aspect="16 / 9" />
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
            <Body muted>
              It was the version that would have addressed what 1.0 left unsaid. It was never shipped.
            </Body>
          </Stack>
        </SplitSection>

        <FullBleedImage src="/anchor_2_01.png" aspect="16 / 9" />

        <div style={{ marginTop: CS.space.mediaTight }}>
          <FullBleedImage src="/anchor_2_02.png" aspect="16 / 9" />
        </div>

        <div style={{ paddingTop: CS.space.section }}>
          <Divider />
        </div>

        <SplitSection title={<SectionTitle>Reflection</SectionTitle>}>
          <Stack gap={CS.space.paragraph}>
            <Body>
              Anchor was the product I was most attached to. Not because of the numbers, though $16B is hard to look away from. Because it was one of those rare moments where design had real leverage. The decisions I made on what to show and what to hide were shaping how hundreds of thousands of people understood their own money.
            </Body>
            <Body>
              I was in the middle of 2.0 when it happened. May 7, 2022. Two wallets pulled $375M from Anchor in a single day. Within a week, $18B had become $280M. The bank run was over before most users understood what had happened.
            </Body>
            <Body>
              Looking back, the design decisions that built the product also shaped how the collapse unfolded. The fixed 19.5% APY display was not a lie, but it was not the whole truth. The rate was subsidized by the Luna Foundation Guard, not generated organically by the protocol. The screen showed a stable number. The economics behind it were not stable.
            </Body>
            <Body>
              The simplicity that opened the door for mainstream depositors also closed the door on context. A user who deposited because the product felt like a bank account had no framework for what was happening when the peg broke. They could not read the warning signs because the design had never given them the vocabulary.
            </Body>
            <Body>
              2.0 was trying to fix some of this. More transparency. Better protocol context. A layered model where users could understand as much or as little as they chose. It never had the chance to matter.
            </Body>
            <Body muted>
              What I carry from this: designing trust at scale is a responsibility that extends beyond the screen. The product I built performed exactly as designed. That is the part that stays with me.
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
            <div style={{
              background: PAGE.color.tealMuted,
              borderLeft: `2px solid ${PAGE.color.teal}`,
              padding: '20px 24px',
            }}>
              <p style={{ ...TYPE.tag12, color: PAGE.color.teal, marginBottom: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}>What the design did</p>
              <p style={{ ...TYPE.p28Regular, lineHeight: 1.4 }}>Lowered the floor for who could participate in DeFi yield. Non-crypto-native savers deposited because the product felt like something they already knew how to use.</p>
            </div>
            <DeliverableList />
          </Stack>
        </SplitSection>

        <Footer />
      </div>
    </main>
  );
}
