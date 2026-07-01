'use client';

import Link from 'next/link';
import Navbar from '@/components/main/Navbar';
import { useRef, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { CS, TYPE, MEDIA_STYLE } from '../_shared/tokens';
import {
  SplitSection, Stack, SectionTitle, Body, SubTitle, DisplayText,
  Caption, Divider, Pill, FullBleedImage, CaptionMediaRow, HalfCaptionBlock,
} from '../_shared/components';

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

function FadeInView({ children, delay = 0, direction = 'up' }: { children: ReactNode; delay?: number; direction?: 'up' | 'down' }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hiddenTranslate = direction === 'down' ? 'translateY(-24px)' : 'translateY(24px)';

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : hiddenTranslate,
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
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
        <p style={TYPE.h3_32SemiBold}>VirtuSwap Branding</p>
        <p style={TYPE.h3_20Regular}>DeFi Exchange Visual Identity</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <Pill>2022</Pill>
          <Pill href="https://twitter.com/VirtuSwap">@VirtuSwap ›</Pill>
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
          padding: '0 var(--cs-page-inset)',
          boxSizing: 'border-box',
        }}
      >
        <PageHeader />

        <FullBleedImage src="/assets/virtuswap/virtuswap_01-1.jpg" />

        <SplitSection title={<SectionTitle>Project Overview</SectionTitle>}>
          <Stack>
            <div>
              <SubTitle>VirtuSwap</SubTitle>
              <Body>VirtuSwap is a decentralized exchange (DEX) built on a proprietary technology called Reserve-Powered Virtual Pools (RPVP). By optimizing liquidity allocation across pairs, VirtuSwap reduces trading costs for traders while improving returns for liquidity providers — bringing decentralized trading efficiency closer to that of centralized exchanges.</Body>
            </div>
            <div>
              <SubTitle>My Role</SubTitle>
              <Body>As the sole designer, I owned the entire visual system — from defining brand philosophy and building the logo to producing weekly content assets and shipping the landing page. Working directly with the founding team, I translated complex financial engineering into a brand that felt credible, ambitious, and distinctly VirtuSwap.</Body>
            </div>
          </Stack>
        </SplitSection>

        <FullBleedImage src="/assets/virtuswap/virtuswap_02.jpg" aspect="16 / 9" />

        <Divider />

        <SplitSection title={<SectionTitle>The Challenge</SectionTitle>} pt={CS.space.section}>
          <div>
            <Body>
              Communicate technical credibility, establish visual authority, maintain brand consistency, and scale from protocol to consumer-facing product. Four requirements pulling in opposite directions.
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

        <SplitSection title={<SectionTitle>The Philosophy</SectionTitle>} pt={CS.space.section} pb={CS.space.section}>
          <Stack gap={CS.space.paragraph}>
            <Body>
              The protocol&apos;s belief is simple: the market has accepted unnecessary friction for too long. Trading costs are a solved problem, or they should be. VirtuSwap exists to prove it.
            </Body>
            <DisplayText>
              Efficiency is not just a feature. It is the brand.
            </DisplayText>
            <Body>
              This shaped every decision I made. Not aesthetics first. Conviction first. A brand built on optimization has no room for decoration that doesn&apos;t earn its place.
            </Body>
          </Stack>
        </SplitSection>

        <FullBleedImage src="/assets/virtuswap/virtuswap_03.jpg" aspect="16 / 9" />


        <SplitSection title={<SectionTitle>Design Principle</SectionTitle>} pt={CS.space.section} pb={0}>
          <Stack gap={CS.space.paragraph}>
            <Body>
              Most DeFi brands draw inspiration from science fiction — gradients, neon, abstract geometry. Every protocol looks like it was built for the metaverse.
            </Body>
            <Body>
              I looked to Rome. VirtuSwap was founded by finance professors. The protocol has real academic authority. Roman design carries the same qualities: structured, enduring, built to last. It made that authority visible without having to explain it.
            </Body>
          </Stack>
        </SplitSection>

        <div style={{ marginTop: CS.space.section }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/virtuswap/virtuswap_04.jpg" alt="" style={MEDIA_STYLE.fluid} />
        </div>

        <CaptionMediaRow
          mt={CS.space.section}
          media={<FullBleedImage src="/assets/virtuswap/virtuswap_05.jpg" aspect="16 / 9" />}
        >
          <Caption>Orange Marble</Caption>
          <Body style={{ marginTop: CS.space.captionText }}>
            I chose orange not for warmth, but for energy: the heat of markets in motion, the urgency of optimization, the ambition to outperform.
          </Body>
          <Body>
            I chose Roman over the sci-fi aesthetics most DeFi brands default to: gradients, neon, abstract geometry. VirtuSwap was founded by finance professors. The protocol has real academic authority. Roman design carries the same qualities: structured, enduring, built to last. It made that authority visible without having to explain it.
          </Body>
          <Body>
            Together, orange and Roman give the brand two things DeFi rarely achieves at once: momentum and gravitas.
          </Body>
        </CaptionMediaRow>

        <div style={{ marginTop: CS.space.mediaGap, display: 'flex', flexDirection: 'column', gap: CS.space.mediaGap }}>
          <FullBleedImage src="/assets/virtuswap/virtuswap_06.jpg" />
          <div style={{ display: 'flex', gap: CS.space.mediaGap }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/virtuswap/virtuswap_08-1.jpg" alt="" style={{ ...MEDIA_STYLE.fluid, flex: 1, minWidth: 0 }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/virtuswap/virtuswap_08-2.jpg" alt="" style={{ ...MEDIA_STYLE.fluid, flex: 1, minWidth: 0 }} />
          </div>
        </div>

        <div style={{ marginTop: CS.space.mediaGap }}>
          <FullBleedImage src="/assets/virtuswap/virtuswap_09.jpg" aspect="16 / 9" />
        </div>

        <div style={{ marginTop: CS.space.mediaGap, display: 'flex', gap: CS.space.mediaGap }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/virtuswap/virtuswap_10-1.jpg" alt="" style={{ ...MEDIA_STYLE.fluid, flex: 1, minWidth: 0 }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/virtuswap/virtuswap_10-2.jpg" alt="" style={{ ...MEDIA_STYLE.fluid, flex: 1, minWidth: 0 }} />
        </div>

        <div style={{ paddingTop: CS.space.section }}>
          <Divider />
        </div>

        <SplitSection title={<SectionTitle>Reflection</SectionTitle>} pt={CS.space.section}>
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
