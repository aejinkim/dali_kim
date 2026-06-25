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
  { label: 'Role', value: 'UI Designer' },
  { label: 'Scope', value: 'Brand Identity\nSymbol Design\nCI Guidelines' },
  { label: 'Impact', value: 'Company-wide adoption\nSeptember 2014' },
] as const;

const PROBLEMS = [
  'The existing symbol ("Si") was visually indistinguishable from the logotype — both were letterform-based, defeating the purpose of a two-element system',
  'The symbol carried no symbolic meaning: it told you nothing about what the company does, what it values, or what makes it distinct',
] as const;

const PROCESS_STEPS = [
  'CI type analysis — benchmarked Symbol, LogoType, and Symbol+LogoType systems across global brands',
  'Concept keyword: "위성 (Satellite)" — the one word that captures Satrec Initiative\'s identity and business',
  'Form derivation: satellite solar panel wings as the abstracted symbol shape',
  'Sketch phase: dozens of hand-drawn iterations exploring the concept',
  'Refinement: 12 digital concepts, narrowed to 4 finalists',
  'Community vote: 4 options posted on Facebook with business card mockups — employees and stakeholders voted',
  'Design guideline: hidden grid and golden ratio applied to the winning symbol',
  'Color system: RGB, CMYK, and PANTONE variants tested and defined',
] as const;

const DELIVERABLES = [
  'New corporate symbol: satellite solar panel form with golden ratio construction guide',
  'Logo system: symbol + Korean, English, and combined logotype variants',
  'Color system: PANTONE 2727C primary, with CMYK and RGB equivalents',
  'Application guidelines: document templates, business cards, PPT covers',
  'Employee ID card design',
] as const;

const VALUES = [
  {
    label: 'Challenge & Technical Spirit',
    desc: 'Innovation through diverse technical expertise to deliver the best solutions',
  },
  {
    label: 'Truth to Customers',
    desc: 'Honest, without exaggeration, always keeping its promises',
  },
  {
    label: 'Well-being of Members',
    desc: 'Respecting those who make the company\'s growth possible',
  },
] as const;

function ValueList() {
  return (
    <div style={{ marginTop: CS.space.stack }}>
      {VALUES.map((item, i) => (
        <div key={i}>
          <Divider />
          <div style={{ margin: '16px 0', display: 'flex', gap: 16 }}>
            <span style={{ color: CS.color.dim, fontVariantNumeric: 'tabular-nums', minWidth: 24, ...TYPE.p16 }}>
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
        <p style={TYPE.h3_32SemiBold}>Satrec Initiative CI Renewal</p>
        <p style={TYPE.h3_20Regular}>Corporate Identity Redesign for a Satellite Technology Company</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <Pill>2014</Pill>
          <Pill>Satrec Initiative</Pill>
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

export default function SatrecIPage() {
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

        <FullBleedImage src="/assets/satreci/satreci_01.jpg" aspect="16 / 9" />

        <SplitSection title={<SectionTitle>Project Overview</SectionTitle>}>
          <Stack>
            <div>
              <SubTitle>Satrec Initiative</SubTitle>
              <Body>
                Satrec Initiative is a Korean satellite technology company — its very name is derived from &quot;satellite.&quot; Founded as a spin-off of KAIST, it designs, manufactures, and operates small satellites and ground systems. By 2014, the company had grown into a globally recognized player in the space industry, with clients across Asia, the Middle East, and Southeast Asia.
              </Body>
            </div>
            <div>
              <SubTitle>My Role</SubTitle>
              <Body>
                I proposed and led the CI renewal project internally as part of the Ground Systems Division design team. The scope covered analysis of the existing identity, concept development, symbol design, community validation, and production of application guidelines — from initial research through company-wide rollout.
              </Body>
            </div>
          </Stack>
        </SplitSection>

        <Divider />

        <SplitSection title={<SectionTitle>The Problem</SectionTitle>} pt={CS.space.section} pb={100}>
          <div>
            <Body>
              A CI system with both a symbol and a logotype exists for a clear reason: the symbol carries visual identity and meaning that text alone cannot. When the two elements look too similar, the system fails at its own purpose.
            </Body>
            <div style={{ marginTop: CS.space.stack }}>
              {PROBLEMS.map((item, i) => (
                <div key={i}>
                  <Divider />
                  <p style={{ ...TYPE.p16, margin: '16px 0' }}>{item}</p>
                </div>
              ))}
              <Divider />
            </div>
            <Body style={{ marginTop: CS.space.stack }}>
              The existing symbol — the stylized &quot;Si&quot; letterform — was essentially a graphic version of the logotype. It offered no symbolic meaning, no visual metaphor for the company&apos;s work, and no identity beyond the initials themselves. A viewer could not tell from the symbol whether Satrec Initiative built satellites, software, or anything else.
            </Body>
          </div>
        </SplitSection>

        <div style={{ paddingTop: 0 }}>
          <Divider />
        </div>

        <SplitSection title={<SectionTitle>Design Process</SectionTitle>}>
          <Stack gap={CS.space.stack}>
            <Body>
              The process started with a question: what is the one word that best represents Satrec Initiative? The answer was immediate — <em>위성 (satellite)</em>. From there, the design problem became finding the right visual form.
            </Body>
            <DisplayText>
              A satellite&apos;s solar panel wings are its most recognizable visual signature — dynamic, precise, and distinctly technological.
            </DisplayText>
            <div>
              {PROCESS_STEPS.map((item, i) => (
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
          </Stack>
        </SplitSection>

        <FullBleedImage src="/assets/satreci/satreci_02.jpg" />

        <div style={{ marginTop: CS.space.mediaTight }}>
          <FullBleedImage src="/assets/satreci/satreci_03.jpg" />
        </div>

        <SplitSection title={<div />} pt={CS.space.section} pb={0}>
          <div>
            <Caption>Participatory Validation: The Facebook Vote</Caption>
            <Body style={{ marginTop: CS.space.captionText }}>
              Rather than presenting a single recommended direction to management, I brought four finalist concepts to the company&apos;s employees and broader network via Facebook — each shown as a full identity system including business card mockups. The response was decisive: one direction received 75% of the vote.
            </Body>
            <Body style={{ marginTop: CS.space.paragraph }}>
              This approach served two purposes. It stress-tested the design in context — real people reacting to how the identity felt on an actual artifact — and it built organizational buy-in before the formal approval process. The winning direction wasn&apos;t imposed; it was chosen.
            </Body>
          </div>
        </SplitSection>

        <div style={{ marginTop: CS.space.section }}>
          <FullBleedImage src="/assets/satreci/satreci_04.jpg" />
        </div>

        <div style={{ paddingTop: CS.space.section }}>
          <Divider />
        </div>

        <SplitSection title={<SectionTitle>The New CI</SectionTitle>}>
          <Stack gap={CS.space.stack}>
            <Body>
              The new symbol abstracts the form of a satellite&apos;s solar panels into a dynamic, three-part mark. The shape is constructed on a hidden grid with golden ratio proportions — visually balanced but never static. It reads instantly as technological and forward-moving.
            </Body>
            <div>
              <Caption>Three values, one mark</Caption>
              <Body style={{ marginTop: CS.space.captionText }}>
                The three components of the symbol were intentionally mapped to Satrec Initiative&apos;s three core values:
              </Body>
              <ValueList />
            </div>
          </Stack>
        </SplitSection>

        <FullBleedImage src="/assets/satreci/satreci_05.jpg" />

        <div style={{ marginTop: CS.space.mediaTight }}>
          <FullBleedImage src="/assets/satreci/satreci_06.jpg" />
        </div>

        <div style={{ paddingTop: CS.space.section }}>
          <Divider />
        </div>

        <SplitSection title={<SectionTitle>Outcome</SectionTitle>}>
          <Stack>
            <Body>
              Satrec Initiative officially adopted the new CI in September 2014, applying it across all company touchpoints — documents, business cards, presentation templates, and employee ID cards. The identity remained in use for years after the rollout.
            </Body>
            <DeliverableList />
          </Stack>
        </SplitSection>

        <Footer />
      </div>
    </main>
  );
}
