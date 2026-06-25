import Link from 'next/link';
import Navbar from '@/components/main/Navbar';
import { CS, TYPE } from '../_shared/tokens';
import {
  SplitSection, Stack, SectionTitle, Body, SubTitle, DisplayText,
  Caption, Divider, Pill, FullBleedImage,
} from '../_shared/components';

const META = [
  { label: 'Role', value: 'Head of Product Design' },
  { label: 'Scope', value: 'UX Architecture\nInformation Design\nDesign System\nWallet UX\nProduct Strategy' },
  { label: 'Context', value: '2023–2026\nInitia' },
] as const;

const DESIGN_CONSTRAINTS = [
  'No user behavior data — the ecosystem had not yet launched',
  'Two radically different audiences: crypto newcomers and experienced on-chain users',
  'A rapidly expanding feature set with no stable product surface to anchor to',
  'Wallet connection requiring MetaMask, Keplr, or Leap — each with different installation flows',
] as const;

const V1_PRINCIPLES = [
  {
    label: 'One thing at a time',
    desc: 'Each primary action — Stake, Swap, Vote — lived in its own destination. No competing calls to action on a single screen.',
  },
  {
    label: "Hide what isn't needed yet",
    desc: 'APRs, TVL, pool depths, and position details were accessible but not surfaced by default. The first screen showed what to do, not everything that existed.',
  },
  {
    label: 'Trust through clarity',
    desc: 'In DeFi, users are moving real money. Confirmation screens, clear transaction summaries, and explicit warnings were not optional — they were the product.',
  },
] as const;

const WHAT_WORKED = [
  'Newcomers could start staking or swapping without understanding what a wallet address was',
  'The three-action architecture gave the product a clear mental model that spread through the community',
  'Design system foundations — tokens, components, spacing — scaled as new surfaces were added',
  'Wallet connection with installed-wallets-only reduced support burden from failed connection attempts',
] as const;

const FRAGMENTATION_ITEMS = [
  'Different chains, each with its own liquidity and asset state',
  'Multiple wallet connections, each with different signing flows',
  'Liquidity positions spread across pools with no unified view',
  'Governance participation disconnected from staking and liquidity',
  'Cross-chain transfers requiring users to know which bridge to use',
] as const;

const IMPACT_STATS = [
  {
    number: '190K+',
    label: 'testnet wallets',
    detail: 'The Build-a-Jennie campaign turned participation into a shareable loop — every interaction generated an artifact worth sharing, compounding reach without paid distribution.',
  },
  {
    number: '$40M+',
    label: 'TVL in first month',
    detail: 'Within the first month of mainnet, the ecosystem held over $40M in TVL. The product had to be ready for users arriving with that level of market attention.',
  },
  {
    number: 'Binance',
    label: 'Launchpool at TGE',
    detail: 'INIT launched on Binance Launchpool at TGE — establishing Initia\'s position in the market from day one and bringing a new wave of users into the product.',
  },
  {
    number: '95%',
    label: 'design system adoption',
    detail: 'Component adoption across V1 surfaces within the first product cycle — new screens assembled from existing pieces, consistency held without manual review.',
  },
] as const;

const KEY_DECISIONS = [
  {
    label: 'Portfolio as the product hub',
    desc: "Portfolio became the central destination for understanding assets, positions, rewards, and on-chain activity. Users no longer needed to navigate three separate surfaces to answer one question: \"Where do I stand?\"",
  },
  {
    label: 'Information density by intent',
    desc: 'Rather than hiding complexity behind progressive disclosure, V2 surfaced relevant depth at the moment users were ready for it. APRs, pool depths, reward accrual, and position health appeared contextually — not buried.',
  },
  {
    label: 'Advanced liquidity management',
    desc: 'Pool-level data, APR breakdowns, reward tracking, and position management became first-class experiences. Power users running liquidity strategies had the information they needed without leaving the app.',
  },
  {
    label: 'Incentive systems made legible',
    desc: 'The Vested Interest Program (VIP) and Gauge Vote went through multiple redesigns to translate complex tokenomics into navigable UX. Stage, Cycle, Challenge Period, Allocation, and Claim were visualized as a coherent system — not a sequence of disconnected screens.',
  },
] as const;

function PrincipleList() {
  return (
    <div style={{ marginTop: CS.space.stack }}>
      {V1_PRINCIPLES.map((item, i) => (
        <div key={i}>
          <Divider />
          <div style={{ margin: '16px 0', display: 'flex', gap: 16 }}>
            <span style={{ ...TYPE.p16, color: CS.color.dim, fontVariantNumeric: 'tabular-nums', minWidth: 24 }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <div>
              <p style={{ ...TYPE.p16SemiBold, marginBottom: 4 }}>{item.label}</p>
              <p style={TYPE.p16}>{item.desc}</p>
            </div>
          </div>
        </div>
      ))}
      <Divider />
    </div>
  );
}

function DecisionList() {
  return (
    <div style={{ marginTop: CS.space.stack }}>
      {KEY_DECISIONS.map((item, i) => (
        <div key={i}>
          <Divider />
          <div style={{ margin: '16px 0', display: 'flex', gap: 16 }}>
            <span style={{ ...TYPE.p16, color: CS.color.dim, fontVariantNumeric: 'tabular-nums', minWidth: 24 }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <div>
              <p style={{ ...TYPE.p16SemiBold, marginBottom: 4 }}>{item.label}</p>
              <p style={TYPE.p16}>{item.desc}</p>
            </div>
          </div>
        </div>
      ))}
      <Divider />
    </div>
  );
}

function ListBlock({ items }: { items: readonly string[] }) {
  return (
    <div style={{ marginTop: CS.space.stack }}>
      {items.map((item, i) => (
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

function StatGrid() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 1,
      backgroundColor: CS.color.line,
      marginTop: CS.space.stack,
    }}>
      {IMPACT_STATS.map((stat, i) => (
        <div key={i} style={{
          backgroundColor: CS.color.white,
          padding: '32px 24px',
        }}>
          <p style={{ ...TYPE.h3_32SemiBold, marginBottom: 4 }}>{stat.number}</p>
          <p style={{ ...TYPE.p16SemiBold, marginBottom: 12 }}>{stat.label}</p>
          <p style={{ ...TYPE.p16, color: CS.color.dim }}>{stat.detail}</p>
        </div>
      ))}
    </div>
  );
}

function PartLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      ...TYPE.p16SemiBold,
      color: CS.color.dim,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      marginBottom: 8,
    }}>
      {children}
    </p>
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
        <p style={TYPE.h3_20Regular}>Product Design for a Multichain Ecosystem — V1 → V2</p>
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

        <FullBleedImage src="/assets/initia/initia_app_01.png" aspect="16 / 9" />

        <SplitSection title={<SectionTitle>Project Overview</SectionTitle>}>
          <Stack>
            <div>
              <SubTitle>The Initia App</SubTitle>
              <Body>
                The Initia App is the primary entry point to Initia&apos;s multichain ecosystem — where users stake assets, swap tokens, participate in governance, and interact with independent chains connected through a shared infrastructure layer.
              </Body>
            </div>
            <div>
              <SubTitle>My Role</SubTitle>
              <Body>
                As Head of Design, I shaped this product from the ground up across two major releases. V1 launched the ecosystem — designed for the user who had never touched a blockchain. V2 rebuilt it for the users who decided to stay.
              </Body>
            </div>
          </Stack>
        </SplitSection>

        <Divider />

        {/* ── V1 ─────────────────────────────────────────────── */}

        <SplitSection title={<SectionTitle>V1 — Designing Without Data</SectionTitle>} pt={CS.space.section} pb={100}>
          <div>
            <PartLabel>The Problem</PartLabel>
            <Body>
              Designing V1 meant designing in the dark. There was no existing user base, no behavioral data, no established pattern for what a multichain ecosystem app should feel like. We were building the product and the audience simultaneously.
            </Body>
            <Body style={{ marginTop: CS.space.paragraph }}>
              The constraints were real:
            </Body>
            <ListBlock items={DESIGN_CONSTRAINTS} />
            <Body style={{ marginTop: CS.space.stack }}>
              The risk wasn&apos;t building something users couldn&apos;t use. The risk was building something so complex that users never started — and walking away with the impression that Initia required expertise to enter.
            </Body>
          </div>
        </SplitSection>

        <div style={{ paddingTop: 0 }}>
          <Divider />
        </div>

        <SplitSection title={<SectionTitle>The Strategy</SectionTitle>}>
          <Stack gap={CS.space.stack}>
            <Body>
              When you don&apos;t have data, you make bets. The V1 bet was simple: reduce the decision surface to the point where starting was obvious. This wasn&apos;t minimalism for aesthetic reasons — it was a direct response to the onboarding reality of Web3 in 2023.
            </Body>
            <DisplayText>
              Design for the user who knows nothing. The expert will find their way.
            </DisplayText>
            <Body>
              This shaped three core design principles for V1:
            </Body>
            <PrincipleList />
          </Stack>
        </SplitSection>

        <FullBleedImage src="/assets/initia/initia_app_02.png" aspect="16 / 9" />

        <SplitSection title={<div />} pt={CS.space.section} pb={0}>
          <div>
            <Caption>Three Actions, Three Destinations</Caption>
            <Body style={{ marginTop: CS.space.captionText }}>
              The V1 information architecture organized itself around three primary actions: Stake, Swap, and Vote. Each lived in its own destination. Nothing competed for visual real estate. The decision on the home screen was not &quot;what can I do here?&quot; but &quot;which of these three do I want?&quot;
            </Body>
            <Body style={{ marginTop: CS.space.paragraph }}>
              This structure also served a secondary function: it mapped cleanly to Initia&apos;s ecosystem roles. Stakers secured the network. Swappers provided liquidity. Voters shaped governance. The architecture reflected the ecosystem, not just the interface.
            </Body>
          </div>
        </SplitSection>

        <div style={{ marginTop: CS.space.section }}>
          <FullBleedImage src="/assets/initia/initia_app_03.png" aspect="16 / 9" />
        </div>

        <SplitSection title={<div />} pt={CS.space.section} pb={0}>
          <div>
            <Caption>Wallet Connection</Caption>
            <Body style={{ marginTop: CS.space.captionText }}>
              Wallet connection was the first real test. At launch, Initia supported Keplr, Leap, and EVM wallets via Privy — three different connection flows, each with different installation requirements, different UX patterns, and different failure modes.
            </Body>
            <Body style={{ marginTop: CS.space.paragraph }}>
              The V1 solution was intentionally scoped: show only wallets the user has already installed. No prompts to install new software before connecting. No decision paralysis from a list of unfamiliar options. The connection modal surfaced what was available, explained the difference briefly, and got out of the way.
            </Body>
          </div>
        </SplitSection>

        <div style={{ marginTop: CS.space.section }}>
          <FullBleedImage src="/assets/initia/initia_app_04.png" aspect="16 / 9" />
        </div>

        <div style={{ paddingTop: CS.space.section }}>
          <Divider />
        </div>

        <SplitSection title={<SectionTitle>Design System</SectionTitle>}>
          <Stack gap={CS.space.paragraph}>
            <Body>
              V1 was always intended to grow. That meant the design system — components, tokens, spacing, interaction patterns — needed to be built for scale from day one, even if only three surfaces existed at launch.
            </Body>
            <Body>
              The system was built around a dark-first aesthetic consistent with the Initia brand, a strict typographic scale, a minimal color palette that kept ecosystem chain colors from clashing with core UI, and a component library that product engineers could implement without needing a designer in the loop for every edge case.
            </Body>
            <Body>
              Component adoption across V1 surfaces reached 95% within the first product cycle — meaning new screens could be assembled quickly from existing pieces, and visual consistency held without manual review on every decision.
            </Body>
          </Stack>
        </SplitSection>

        <FullBleedImage src="/assets/initia/initia_app_05.png" aspect="16 / 9" />

        <div style={{ paddingTop: CS.space.section }}>
          <Divider />
        </div>

        <SplitSection title={<SectionTitle>What Worked</SectionTitle>}>
          <Stack>
            <Body>
              After launch, the V1 architecture held up against real user behavior in several important ways:
            </Body>
            <ListBlock items={WHAT_WORKED} />
          </Stack>
        </SplitSection>

        {/* ── Pivot ──────────────────────────────────────────── */}

        <div style={{ paddingTop: CS.space.section }}>
          <Divider />
        </div>

        <SplitSection title={<SectionTitle>The Pivot</SectionTitle>} pb={0}>
          <Stack gap={CS.space.paragraph}>
            <Body>
              V1 was a bet placed without data. It worked — the ecosystem launched, users onboarded, and the product held together under real conditions. But mainnet revealed something the pre-launch assumptions hadn&apos;t accounted for.
            </Body>
            <Body>
              The users creating the most value inside the ecosystem — the ones staking consistently, providing liquidity, participating in governance, and driving chain activity — were not beginners. They were committed participants who had outgrown V1&apos;s simplicity. They wanted depth. Portfolio visibility. Reward tracking. Advanced liquidity management. The ability to move assets without learning three different product surfaces.
            </Body>
            <DisplayText>
              V1 was built for the user who was just arriving. V2 had to be built for the user who decided to stay.
            </DisplayText>
          </Stack>
        </SplitSection>

        {/* ── V2 ─────────────────────────────────────────────── */}

        <div style={{ paddingTop: CS.space.section }}>
          <Divider />
        </div>

        <SplitSection title={<SectionTitle>V2 — Redesigning for Power Users</SectionTitle>} pt={CS.space.section} pb={100}>
          <div>
            <PartLabel>The Challenge</PartLabel>
            <Body>
              As Initia grew, the product grew with it — but not coherently. Each new chain, protocol, and financial primitive added another surface. What began as three clean destinations became a fragmented constellation of tools that required users to hold the entire ecosystem map in their heads.
            </Body>
            <Body style={{ marginTop: CS.space.paragraph }}>
              The complexity users had to navigate:
            </Body>
            <ListBlock items={FRAGMENTATION_ITEMS} />
            <Body style={{ marginTop: CS.space.stack }}>
              The challenge was no longer designing individual screens. The challenge was designing coherence — a product that felt like one thing, even as the ecosystem underneath it grew into many.
            </Body>
          </div>
        </SplitSection>

        <div style={{ paddingTop: 0 }}>
          <Divider />
        </div>

        <SplitSection title={<SectionTitle>The Insight</SectionTitle>}>
          <Stack gap={CS.space.stack}>
            <Body>
              Internally, Initia organized its products by technical function: Swap. Bridge. Wallet. Governance. Liquidity. But users rarely think in product categories. They think in goals — move my assets, see my portfolio, earn yield, participate.
            </Body>
            <Body>
              The mismatch between how the product was organized and how users actually thought created friction at every step. Users were learning the system before accomplishing their task. Instead of helping users understand more concepts, we needed to reduce the amount of concepts they needed to understand.
            </Body>
            <DisplayText>
              Users who stay eventually become power users.
            </DisplayText>
            <Body>
              This reframing shifted the focus from onboarding to retention — supporting users who had made a commitment to the ecosystem and needed the product to match their growing sophistication.
            </Body>
            <DecisionList />
          </Stack>
        </SplitSection>

        <FullBleedImage src="/assets/initia/initia_app2_01.png" aspect="16 / 9" />

        <SplitSection title={<div />} pt={CS.space.section} pb={0}>
          <div>
            <Caption>Portfolio Hub</Caption>
            <Body style={{ marginTop: CS.space.captionText }}>
              The portfolio surface unified what had been scattered across multiple destinations: asset balances, staking positions, liquidity contributions, reward accrual, and transaction history. For the first time, a user could answer &quot;what am I doing in this ecosystem?&quot; in one place.
            </Body>
            <Body style={{ marginTop: CS.space.paragraph }}>
              This wasn&apos;t a dashboard bolted onto the existing architecture — it required rethinking how data flowed through the product. Positions, rewards, and asset states from multiple chains needed to be surfaced through a single coherent view, even when the underlying infrastructure was heterogeneous.
            </Body>
          </div>
        </SplitSection>

        <div style={{ marginTop: CS.space.section }}>
          <FullBleedImage src="/assets/initia/initia_app2_02.png" aspect="16 / 9" />
        </div>

        <div style={{ paddingTop: CS.space.section }}>
          <Divider />
        </div>

        <SplitSection title={<SectionTitle>Ghost Wallet</SectionTitle>}>
          <Stack gap={CS.space.paragraph}>
            <Body>
              Wallet creation had been Web3&apos;s most consistent dropout point. The original Initia App required MetaMask, Rabby, Keplr, or Leap — each demanding installation, a seed phrase ceremony, and a mental model that most users didn&apos;t have.
            </Body>
            <Body>
              V2 introduced Ghost Wallet: a native embedded wallet built on Privy&apos;s social login infrastructure. Users could create a wallet with a Google or Apple account — no extension, no seed phrase on day one, no prior crypto knowledge required.
            </Body>
            <DisplayText>
              Web2 onboarding. Web3 ownership.
            </DisplayText>
            <Body>
              The design challenge wasn&apos;t technical — it was trust. Auto-sign, the feature that eliminated signature prompts for low-risk transactions, required users to grant meaningful permissions. The UX had to make that permission grant feel safe, transparent, and reversible: settings-controlled, clearly scoped, and easy to revoke.
            </Body>
          </Stack>
        </SplitSection>

        <FullBleedImage src="/assets/initia/initia_app2_03.png" aspect="16 / 9" />

        <div style={{ paddingTop: CS.space.section }}>
          <Divider />
        </div>

        <SplitSection title={<SectionTitle>Incentive UX</SectionTitle>}>
          <Stack gap={CS.space.paragraph}>
            <Body>
              The Vested Interest Program (VIP) and Gauge Vote system were among the most complex UX problems in the product — not because the flows were technically difficult, but because the underlying tokenomics were genuinely hard to understand.
            </Body>
            <Body>
              VIP ran on Stages and Cycles. Each cycle had a Challenge Period. Allocations were calculated from historical participation. Claims had their own timing window. Each concept was meaningful, but together they created a system that even engaged users struggled to navigate.
            </Body>
            <Body>
              The V2 approach was to visualize the system as a whole — not just the current state, but where a user was in the cycle, what actions were available, and what they were working toward. Stage and cycle context appeared on every relevant screen. Reward accrual was shown in real time. Allocation and claim timelines were displayed together so users could understand the relationship between participation and payout.
            </Body>
            <Body>
              The goal was not simplification. The goal was legibility — translating a real reward system into UX that matched its actual complexity without hiding it.
            </Body>
          </Stack>
        </SplitSection>

        <FullBleedImage src="/assets/initia/initia_app2_04.png" aspect="16 / 9" />

        <div style={{ paddingTop: CS.space.section }}>
          <Divider />
        </div>

        <SplitSection title={<SectionTitle>Outcome</SectionTitle>}>
          <Stack gap={CS.space.paragraph}>
            <Body>
              V2 transformed the Initia App from an onboarding-focused product into a platform capable of supporting long-term ecosystem participants. Ghost Wallet removed the largest barrier to entry. The portfolio surface gave committed users a place to manage their ecosystem presence. The liquidity and incentive redesigns made advanced participation accessible without requiring users to hold context outside the product.
            </Body>
            <Body>
              Together, V1 and V2 created a progression path that matched how users actually evolved inside the ecosystem — arriving simply, staying deeply.
            </Body>
            <StatGrid />
            <DisplayText style={{ marginTop: CS.space.stack }}>
              V1 reduced the decision surface. V2 expanded what users could do with it.
            </DisplayText>
          </Stack>
        </SplitSection>

        <Footer />
      </div>
    </main>
  );
}
