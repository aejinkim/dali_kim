import Link from 'next/link';
import Navbar from '@/components/main/Navbar';

import { CS, TYPE, MEDIA_STYLE } from '../_shared/tokens';
import {
  SplitSection, Stack, SectionTitle, Body, SubTitle, DisplayText,
  Caption, Divider, Pill, FullBleedImage, FluidVideo, CaptionMediaRow, HalfCaptionBlock,
} from '../_shared/components';

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

function PageHeader() {
  return (
    <header className="cs-page-header" style={{
      minHeight: 153,
      paddingTop: CS.space.headerTop,
      paddingBottom: CS.space.section,
    }}>
      <div className="cs-page-header-intro">
        <p style={TYPE.h3_32SemiBold}>Initia Ecosystem Branding</p>
        <p style={TYPE.h3_20Regular}>Established the Initia brand from defining the philosophy, visual language, and ecosystem branding framework </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <Pill>2023–2026</Pill>
          <Pill href="https://initia.xyz/">initia.xyz ›</Pill>
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

export default function InitiaPage() {
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
              <SubTitle>Initia</SubTitle>
              <Body>Initia is a Layer 1 blockchain designed to support an ecosystem of interconnected application-specific chains. Instead of operating as a single network, Initia enables multiple independent chains to coexist while sharing infrastructure, liquidity, and interoperability.</Body>
            </div>
            <div>
              <SubTitle>Role</SubTitle>
              <Body>As Head of Design, I owned the brand from the ground up — defining the philosophy, building the visual language, and establishing the ecosystem branding framework that connected diverse chains, products, and communities. This extended beyond visual design into product interfaces, governance, marketing, community programs, and ecosystem partnerships.</Body>
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
            <div style={{ marginTop: CS.space.stack }}>
              <p style={{ ...TYPE.p16SemiBold, margin: '0 0 16px' }}>The brand needed to:</p>
              {BRAND_NEEDS.map((item) => (
                <div key={item}>
                  <Divider />
                  <p style={{ ...TYPE.p16, margin: 'var(--cs-list-item-gap) 0' }}>{item}</p>
                </div>
              ))}
              <Divider />
            </div>
          </div>
        </SplitSection>

        <FullBleedImage src="/assets/initia/initia_02.png" aspect="16 / 9" />

        <SplitSection title={<SectionTitle>The Philosophy</SectionTitle>}>
          <Stack gap={36}>
            <Body>
              Technology alone doesn&apos;t build loyalty. What resonates is who you are, what you believe, and how you see the world. When building Initia&apos;s ecosystem identity, we needed more than a visual system — we needed a narrative that could explain the relationship between independent chains, shared infrastructure, and a growing ecosystem.
            </Body>
            <DisplayText>This became The Multichain Garden of Eden.</DisplayText>
            <Body>
              A garden where every organism is different — different colors, different shapes, different purposes — yet they coexist within the same environment. Initia provides the land, water, and infrastructure. Individual chains cultivate their own worlds. The ecosystem grows not through centralization, but through emergence.
            </Body>
            <Body>
              More than a brand concept, the Garden became the operating principle for every design decision: color, motion, typography, mascot, governance, community. A living canvas in constant motion.
            </Body>
          </Stack>
        </SplitSection>

        <FullBleedImage src="/assets/initia/initia_03.png" aspect="16 / 9" />

        <CaptionMediaRow
          height={CS.size.colorMediaHeight}
          mt={CS.space.section}
          media={
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/initia/initia_04.png" alt="" style={MEDIA_STYLE.cover} />
            </>
          }
        >
          <Caption>Color Philosophy</Caption>
          <Body>Traditional brand systems rely on fixed colors and strict rules to maintain consistency.</Body>
          <Body>Initia adopted black and white as the foundation of the ecosystem. Not as a limitation, but as a neutral environment where every chain could express its own identity.</Body>
          <Body>Just as white light contains the entire visible spectrum, the ecosystem provides a shared foundation while allowing each chain to contribute its own color, personality, and vision.</Body>
          <Body>The ecosystem owns no color.<br />It enables all colors.</Body>
        </CaptionMediaRow>

        <div style={{ marginTop: CS.space.mediaGap }}>
          <FluidVideo src="/assets/initia/initia_glass169_2.mp4" aspect="16 / 9" cover />
        </div>

        <CaptionMediaRow
          mt={CS.space.section}
          media={<FluidVideo src="/assets/initia/initia_convey.mp4" />}
        >
          <Caption>Design Principle</Caption>
          <Body>Inspired by Conway&apos;s Game of Life, we designed for emergence rather than control.</Body>
          <p style={TYPE.p28Regular}>Just as simple rules can create infinite complexity,</p>
          <Body>independent chains contribute to a larger ecosystem through interaction and interoperability. This philosophy shaped a brand system designed to grow, adapt, and evolve alongside the ecosystem itself.</Body>
        </CaptionMediaRow>

        <SplitSection title={<div />} pt={CS.space.section} pb={CS.space.section}>
          <div>
            <DisplayText>Quantum Entanglement, Not Centralization</DisplayText>
            <Body style={{ marginTop: CS.space.quoteGap }}>Our Garden is where chaos and order dance together. Where structure doesn&apos;t limit creativity but enables it. And where a unified vision emerges—not by control, but by coordination.</Body>
          </div>
        </SplitSection>

        <FullBleedImage src="/assets/initia/initia_08.png" aspect="3200 / 1436" />

        <CaptionMediaRow
          mt={CS.space.section}
          media={
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/initia/initia_09.png" alt="" style={MEDIA_STYLE.cover} />
            </>
          }
        >
          <Caption>Initia Mascot Jennie</Caption>
          <Body>A symbol that represents Initia&apos;s spirit, memes, and overall vibe. Balances Initia&apos;s philosophical and technological aspects while softening the brand atmosphere with a more approachable touch.</Body>
        </CaptionMediaRow>

        <div style={{ paddingTop: CS.space.section }}>
          <Divider />
        </div>

        <SplitSection title={<SectionTitle>Outcome</SectionTitle>}>
          <Stack gap={CS.space.paragraph}>
            <Body>The result was a scalable ecosystem identity that connected products, communities, and independent chains through a shared philosophy. Rather than enforcing consistency, the system enabled diversity within a coherent framework — proving that brand unity doesn&apos;t require uniformity.</Body>
            <Body>The brand system scaled across every surface: the app, the landing page, governance interfaces, the VIP program, airdrop campaigns, community events, and ecosystem partner launches. It gave Initia a recognizable presence in a market full of indistinct blockchain projects — without ever imposing a single dominant color or aesthetic on the chains building inside it.</Body>
            <DisplayText>Initia designed a living ecosystem.</DisplayText>
          </Stack>
        </SplitSection>

        <HalfCaptionBlock caption="Initia Landing">
          Initia landing page is intentionally designed as a single page without scrolling. This might seem contrary to common practice, but it serves a purpose: to provide important information concisely without overwhelming visitors.
        </HalfCaptionBlock>

        <FluidVideo src="/assets/initia/initia_.mov" />

        <div style={{ marginTop: CS.space.mediaGap }}>
          <FullBleedImage src="/assets/initia/initia_11.png" aspect="16 / 9" />
        </div>

        <HalfCaptionBlock caption="Marketing Element" pt={CS.space.section}>
          The visual system was designed to scale beyond products. It powered livestreams, community campaigns, educational content, ecosystem announcements, and social experiences, creating a cohesive brand presence across all channels.
        </HalfCaptionBlock>

        <FullBleedImage src="/assets/initia/initia_12.png" aspect="3203 / 1659" />

        <Footer />
      </div>
    </main>
  );
}
