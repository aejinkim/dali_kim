import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/main/Navbar';
import { CS, TYPE } from '../_shared/tokens';
import {
  SplitSection, Stack, SectionTitle, Body, SubTitle, DisplayText,
  Caption, Divider, Pill, FullBleedImage, WideCaptionBlock,
} from '../_shared/components';

const META = [
  { label: 'Role', value: 'Head of Design' },
  { label: 'Scope', value: 'Product Design\nDesign System\nBranding\nOnboarding\nData Visualization' },
  { label: 'Impact', value: "Helped Fount become South Korea's leading robo-advisor with 1.5 trillion KRW in peak AUM" },
] as const;

const CHALLENGES = [
  'A multi-step onboarding spanning investment profiles, advisory contracts, and partner financial institution accounts',
  'A user base with low financial literacy who was skeptical of automated money management',
  'No existing mental model for robo-advisory products in the Korean market',
  'The AI recommendation had to feel explainable without exposing unnecessary system complexity',
] as const;

const DELIVERABLES = [
  'Product design across iOS and Android: fund, ETF, pension, and CMA products',
  'Onboarding flow redesign: investment profile, advisory contract, account opening',
  'Asset visualization system: portfolio breakdown, allocation, real-time earnings',
  'AI recommendation module: main screen placement and information hierarchy',
  'Design system: components, type scale, color, spacing, built solo',
  'Branding: visual language applied across app and web surfaces',
] as const;

function PageHeader() {
  return (
    <header className="cs-page-header" style={{
      minHeight: 153,
      paddingTop: CS.space.headerTop,
      paddingBottom: CS.space.section,
    }}>
      <div className="cs-page-header-intro">
        <p style={TYPE.h3_32SemiBold}>Fount Robo-Advisor</p>
        <p style={TYPE.h3_20Regular}>WealthTech Product Design</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <Pill>2020–2021</Pill>
          <Pill href="https://fount.co/">fount.co ›</Pill>
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

function ListBlock({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <div>
      <p style={{ ...TYPE.p16SemiBold, margin: '0 0 16px' }}>{title}</p>
      {items.map((item) => (
        <div key={item}>
          <Divider />
          <p style={{ ...TYPE.p16, margin: 'var(--cs-list-item-gap) 0' }}>{item}</p>
        </div>
      ))}
      <Divider />
    </div>
  );
}

function ImpactSection() {
  const stats = [
    { value: '10%', label: 'Conversion rate from app installation to first deposit', arrow: true },
    { value: '90%', label: 'Account opening to deposit', arrow: false },
    { value: '1.5 Trillion KRW', label: 'Peak AUM, leading the Korean market', arrow: false },
  ] as const;

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: CS.space.section, paddingTop: CS.space.section }}>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <SectionTitle>Impact</SectionTitle>
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
            <p style={{ ...TYPE.p56Regular, display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
              {stat.value}
              {stat.arrow
                ? <Image src="/assets/fount/clarity-arrow-line.svg" alt="" width={54} height={54} />
                : null}
            </p>
            <p style={{ ...TYPE.p16 }}>{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function DeliverableList() {
  return (
    <div>
      {DELIVERABLES.map((item, i) => (
        <div key={item}>
          <Divider />
          <p style={{ ...TYPE.p16, margin: 'var(--cs-list-item-gap) 0', display: 'flex', gap: 16 }}>
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
      <a href="mailto:hello@dalikim.com" style={{
        ...TYPE.footer,
        color: CS.color.ink,
        padding: '10px 24px',
        border: `1px solid ${CS.color.lineStrong}`,
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
          padding: '0 var(--cs-page-inset)',
          boxSizing: 'border-box',
        }}
      >
        <PageHeader />

        <FullBleedImage src="/assets/fount/fount_01.jpg" aspect="16 / 9" />

        <SplitSection title={<SectionTitle>Project Overview</SectionTitle>}>
          <Stack>
            <div>
              <SubTitle>Fount</SubTitle>
              <Body>
                Fount is South Korea&apos;s first large-scale AI robo-advisor. The platform manages asset portfolios across three core products: actively managed funds, domestic and international ETFs, and individual retirement accounts (IRPs). It also utilizes CMA accounts for liquid savings. The platform&apos;s AI automatically allocates and rebalances assets based on market conditions and each user&apos;s unique investment profile — completely free of human intervention.
              </Body>
            </div>
            <div>
              <SubTitle>Role</SubTitle>
              <Body>
                I joined as Lead Product Designer and Head of Design. I owned the entire product and visual surface across iOS and Android, and acted as a hybrid PM for feature planning, requirements drafting, QA tracking, and A/B test coordination. The design system was built from scratch, by me, while the product was actively shipping.
              </Body>
            </div>
          </Stack>
        </SplitSection>

        <Divider />

        <SplitSection title={<SectionTitle>The Challenge</SectionTitle>} pb={0}>
          <Stack>
            <Body>
              Fount launched at a time when most Koreans had never even heard the term &ldquo;robo-advisor.&rdquo; The idea of artificial intelligence managing savings was seen as novel at best, and deeply suspicious at worst. The onboarding process was a gauntlet: completing a financial assessment, signing an investment advisory contract, and opening a brokerage account through a partner financial institution — with each individual step requiring its own separate verification process.
            </Body>
            <DisplayText style={{ marginTop: CS.space.stack, marginBottom: CS.space.stack }}>
              It was critical to make people feel secure enough to hand over the reins of their financial management to an AI.
            </DisplayText>
            <ListBlock title="The product had to solve for:" items={CHALLENGES} />
          </Stack>
        </SplitSection>

        <div style={{ paddingTop: CS.space.section }}>
          <Divider />
        </div>

        <section style={{ paddingTop: CS.space.section }}>
          <SectionTitle>UX Solutions</SectionTitle>
        </section>

        <WideCaptionBlock caption="One core objective per screen" pt={CS.space.section}>
          Users are always fully aware of their current status, the next step, and the rationale behind it. The interface explicitly communicates the rebalancing lifecycle—whether it’s scheduled, actively in progress, or completed. As a result, cognitive load was significantly reduced.
        </WideCaptionBlock>

        <FullBleedImage src="/assets/fount/fount_02.jpg" aspect="3200 / 1794" />

        <WideCaptionBlock caption="Developed a comprehensive asset visualization system" pt={CS.space.section}>
          Developed an asset visualization system that provides a comprehensive, at-a-glance view of portfolio composition, asset allocation, and returns. The primary objective was to translate complex algorithmic outputs into intuitive, easily digestible insights. Additionally, the system enables users to monitor their current rebalancing status instantly.
        </WideCaptionBlock>

        <FullBleedImage src="/assets/fount/fount_03.jpg" aspect="3200 / 2304" />

        <WideCaptionBlock caption="Front-and-center placement for AI recommendations" pt={CS.space.section}>
          Relocated the AI recommendation module to the main screen for instant visibility upon app launch. Powered by Fount’s proprietary AI engine—a unique differentiator in the market—this feature allows users to seamlessly discover and evaluate financial products like Funds and ETFs, leading to a frictionless and rapid deposit experience.
        </WideCaptionBlock>

        <FullBleedImage src="/assets/fount/fount_04.jpg" aspect="3200 / 1794" />

        <div style={{ paddingTop: CS.space.section, paddingBottom: CS.space.captionBottom }}>
          <Caption>Marketing &amp; Design system</Caption>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <FullBleedImage src="/assets/fount/fount_05.jpg" aspect="3200 / 508" />
          <FullBleedImage src="/assets/fount/fount_06.jpg" aspect="3200 / 1520" />
        </div>

        <ImpactSection />

        <div style={{ paddingTop: CS.space.section }}>
          <Divider />
        </div>

        <SplitSection title={<SectionTitle>Reflection</SectionTitle>} pb={0}>
          <Stack gap={CS.space.paragraph}>
            <Body>
              Building a design system while the product was actively shipping meant making decisions faster than they could be fully validated. Some of those decisions held. Some needed another pass.
            </Body>
            <Body>
              What held up was the asset visualization system. Users responded to seeing their money organized and labeled. It reduced the feeling of handing control to something unknown.
            </Body>
            <Body>
              If I could revisit the product, I would push the AI from output to conversation. Explaining why a recommendation was made in plain language would have built more trust than any visual polish alone.
            </Body>
          </Stack>
        </SplitSection>

        <div style={{ paddingTop: CS.space.section }}>
          <Divider />
        </div>

        <SplitSection title={<SectionTitle>Outcome</SectionTitle>}>
          <Stack gap={20}>
            <Body>
              Fount reached 1.5 trillion KRW in assets under management, establishing itself as South Korea&apos;s leading robo-advisor by AUM.
            </Body>
            <div style={{
              background: CS.color.pillBorderMuted,
              borderLeft: `2px solid ${CS.color.pillBorder}`,
              padding: '20px 24px',
            }}>
              <p style={{ ...TYPE.tag12, color: CS.color.ink, marginBottom: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}>User Feedback</p>
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
