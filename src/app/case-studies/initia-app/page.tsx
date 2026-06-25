import Link from 'next/link';
import Navbar from '@/components/main/Navbar';
import { CS, TYPE } from '../_shared/tokens';
import {
  SplitSection, Stack, SectionTitle, Body, SubTitle, DisplayText,
  Caption, Divider, Pill, FullBleedImage,
} from '../_shared/components';

const META = [
  { label: 'Role', value: 'Head of Product Design' },
  { label: 'Scope', value: 'UX Architecture\nInformation Design\nDesign System\nWallet UX' },
  { label: 'Context', value: '2023–2024\nInitia' },
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
    label: 'Hide what isn\'t needed yet',
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

function PageHeader() {
  return (
    <header className="cs-page-header" style={{
      minHeight: 153,
      paddingTop: CS.space.headerTop,
      paddingBottom: CS.space.section,
    }}>
      <div className="cs-page-header-intro">
        <p style={TYPE.h3_32SemiBold}>Initia App 1.0</p>
        <p style={TYPE.h3_20Regular}>Designing Without Data — Launching a Multichain Ecosystem</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <Pill>2023–2024</Pill>
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

export default function InitiaAppPage() {
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
                The Initia App is the primary entry point to Initia&apos;s multichain ecosystem — where users stake assets, swap tokens, participate in governance, and interact with independent chains connected through a shared infrastructure layer. V1 was built to launch the ecosystem: to give the first wave of users something coherent to land in.
              </Body>
            </div>
            <div>
              <SubTitle>My Role</SubTitle>
              <Body>
                As Head of Design, I set the product design direction for V1 from the ground up. That meant defining the information architecture, establishing the V1 design system, designing the core flows — Stake, Swap, Vote, and wallet connection — and building the design foundations that the rest of the product would grow on.
              </Body>
            </div>
          </Stack>
        </SplitSection>

        <Divider />

        <SplitSection title={<SectionTitle>The Problem</SectionTitle>} pt={CS.space.section} pb={100}>
          <div>
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
              The system was built around a dark-first aesthetic (consistent with the Initia brand), a strict typographic scale, a minimal color palette that kept ecosystem chain colors from clashing with core UI, and a component library that product engineers could implement without needing a designer in the loop for every edge case.
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

        <div style={{ paddingTop: CS.space.section }}>
          <Divider />
        </div>

        <SplitSection title={<SectionTitle>What Changed</SectionTitle>} pb={0}>
          <Stack gap={CS.space.paragraph}>
            <Body>
              V1 was a bet placed without data. It worked — the ecosystem launched, users onboarded, and the product held together under real conditions. But mainnet revealed something that the pre-launch assumptions hadn&apos;t accounted for.
            </Body>
            <Body>
              The users creating the most value inside the ecosystem — the ones staking consistently, providing liquidity, participating in governance, and driving chain activity — were not beginners. They were committed participants who had outgrown V1&apos;s simplicity. They wanted depth. Portfolio visibility. Reward tracking. Advanced liquidity management. And the ability to move assets without learning three different product surfaces.
            </Body>
            <DisplayText>
              V1 was built for the user who was just arriving. V2 had to be built for the user who decided to stay.
            </DisplayText>
          </Stack>
        </SplitSection>

        <Footer />
      </div>
    </main>
  );
}
