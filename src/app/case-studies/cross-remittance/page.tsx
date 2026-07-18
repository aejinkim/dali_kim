import { Fragment } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import Navbar from '@/components/main/Navbar';
import { CS, TYPE } from '../_shared/tokens';
import {
  SplitSection,
  Stack,
  SectionTitle,
  Body,
  SubTitle,
  Caption,
  Divider,
  Pill,
  FullBleedImage,
} from '../_shared/components';
import { GaugeBar } from './GaugeBar';

const CROSS_BLUE = '#272aff';
const BAR_GRAY = '#aaaebf';
const BAR_BLUE = '#4968e6';
const BAR_PINK = '#fac6be';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const TRACK_LABEL_WIDTH = 230;

const PHASES = [
  { num: '01', name: 'APP v1.0 + BRAND', start: 1, end: 5 as number | undefined },
  { num: '02', name: 'WEB v1.0', start: 5, end: 7 as number | undefined },
  { num: '03', name: 'WEB v2.0', start: 7, end: 12 as number | undefined },
] as const;

const GANTT_ROWS = [
  { kind: 'task', label: 'Goal Definition & Planning', start: 1, end: 3, color: BAR_GRAY },
  { kind: 'task', label: 'Research & Benchmarking', start: 1, end: 4, color: BAR_GRAY },
  { kind: 'task', label: 'User Scenarios & Flows', start: 2, end: 5, color: BAR_BLUE },
  { kind: 'task', label: 'Brand Guide', start: 4, end: 6, color: BAR_BLUE },
  { kind: 'task', label: 'UI Design / Prototype', start: 3, end: 7, color: BAR_BLUE },
  { kind: 'task', label: 'Markup & QA', start: 4, end: 7, color: BAR_BLUE },
  { kind: 'spacer' },
  { kind: 'task', label: 'Launch Prep', start: 5, end: 7, color: BAR_PINK },
  { kind: 'milestone', label: 'Cross Launch', start: 8, end: 8 },
  { kind: 'spacer' },
  { kind: 'task', label: 'Web UX/UI Redesign', start: 6, end: 10, color: BAR_BLUE },
  { kind: 'task', label: 'Offline Branding', start: 6, end: 9, color: BAR_BLUE },
  { kind: 'task', label: 'Dev, Markup & QA', start: 9, end: 12, color: BAR_BLUE },
] as const;

function PhasePillsRow() {
  return (
    <div style={{ display: 'flex', height: 115, marginBottom: 8 }}>
      <div style={{ width: TRACK_LABEL_WIDTH, flexShrink: 0 }} />
      <div style={{ flex: 1, position: 'relative' }}>
        {PHASES.map((p, i) => (
          <div key={p.num} style={{
            position: 'absolute',
            left: `${((p.start - 1) / 12) * 100}%`,
            top: i * 36,
            display: 'flex',
            alignItems: 'stretch',
            height: 43,
            width: p.end ? `${((p.end - p.start + 1) / 12) * 100}%` : undefined,
            backgroundColor: '#fff',
            border: '1px solid #d7d7f5',
            borderRadius: 8,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}>
            <span style={{ fontFamily: TYPE.p16.fontFamily, fontSize: 18, fontWeight: 600, lineHeight: '27px', letterSpacing: '-0.01em', color: CROSS_BLUE, backgroundColor: '#ededff', display: 'flex', alignItems: 'center', padding: '0 16px' }}>{p.num}</span>
            <span style={{ fontFamily: TYPE.p16.fontFamily, fontSize: 14, fontWeight: 700, letterSpacing: '0.039em', color: '#000', display: 'flex', alignItems: 'center', padding: '0 16px' }}>{p.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function GanttChart() {
  return (
    <div>
      <div style={{ display: 'flex', marginBottom: 12 }}>
        <div style={{ width: TRACK_LABEL_WIDTH, flexShrink: 0 }} />
        <div style={{ flex: 1, display: 'flex' }}>
          {MONTHS.map((m) => (
            <span key={m} style={{ fontFamily: TYPE.p16.fontFamily, fontSize: 14, flex: 1, color: 'rgba(0,0,0,0.4)', letterSpacing: '0.08em', textAlign: 'left' }}>{m}</span>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {GANTT_ROWS.map((row, i, arr) => {
          if (row.kind === 'spacer') {
            return <div key={i} style={{ height: 12 }} />;
          }
          const isGroupStart = arr[i - 1]?.kind === 'spacer' || i === 0;
          const leftPct = ((row.start - 1) / 12) * 100;
          const widthPct = ((row.end - row.start + 1) / 12) * 100;
          const isMilestone = row.kind === 'milestone';
          return (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              height: 34,
              gap: 9,
              borderTop: isGroupStart ? '1px solid #dfdfdf' : 'none',
            }}>
              <div style={{ width: TRACK_LABEL_WIDTH, flexShrink: 0, display: 'flex' }}>
                <span style={{
                  fontFamily: TYPE.p16.fontFamily,
                  fontSize: 14,
                  color: '#474747',
                  letterSpacing: '-0.01em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>{row.label}</span>
              </div>
              <div style={{ flex: 1, position: 'relative', height: '100%' }}>
                {isMilestone ? (
                  <>
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: `${leftPct}%`,
                      transform: 'translate(-50%, -50%)',
                      width: 60,
                      height: 12,
                      borderRadius: 100,
                      background: `linear-gradient(to right, ${BAR_PINK}00, ${BAR_PINK})`,
                    }} />
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: `${leftPct}%`,
                      transform: 'translate(-50%, -50%)',
                      width: 44,
                      height: 30,
                      zIndex: 1,
                    }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/assets/cross/cross-launch-mascot.png" alt="Cross Launch" style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scaleX(-1)' }} />
                    </div>
                  </>
                ) : (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    left: `${leftPct}%`,
                    width: `calc(${widthPct}% - 4px)`,
                    height: 19,
                    borderRadius: 100,
                    background: `linear-gradient(to right, ${row.color}00, ${row.color})`,
                  }} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const HEADER_STATS = [
  { label: 'Workstreams', value: 'App (iOS, Android) · Web · Brand' },
  { label: 'Timeline', value: '12 Months' },
] as const;

function HeaderStats() {
  return (
    <div style={{ display: 'flex', gap: 32 }}>
      {HEADER_STATS.map((s) => (
        <div key={s.label} style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start' }}>
          <span style={{ fontFamily: TYPE.p16.fontFamily, fontSize: 14, color: 'rgba(0,0,0,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{s.label}</span>
          <span style={{ fontFamily: TYPE.p16.fontFamily, fontSize: 14, fontWeight: 600, lineHeight: 1.3, color: CS.color.ink, letterSpacing: '0.73px', textTransform: 'uppercase' }}>{s.value}</span>
        </div>
      ))}
    </div>
  );
}

const META = [
  { label: 'Role', value: 'Product Designer' },
  { label: 'Scope', value: 'App, Web Design\nUX Research\nOnboarding & KYC\nRemittance Flow' },
  { label: 'Impact', value: '7+ Years in Market\nGovernment-Registered Remittance' },
] as const;

const CONSTRAINTS = [
  { label: 'Trust', description: 'One unclear fee could break trust permanently.' },
  { label: 'Identity', description: 'KYC, but users had expired passports and no Korean bank account.' },
  { label: 'Access', description: 'Multiple languages, low digital literacy, older shared Androids.' },
  { label: 'Regulation', description: 'Government-certified service; compliance on every screen.' },
] as const;

function ConstraintsGrid() {
  return (
    <div style={{
      backgroundColor: CROSS_BLUE,
      borderRadius: 16,
      padding: 'clamp(32px, 6vw, 80px) clamp(24px, 6vw, 96px)',
    }}>
      <p style={{
        fontFamily: TYPE.p16.fontFamily,
        fontSize: 'clamp(28px, 4vw, 40px)',
        fontWeight: 400,
        lineHeight: 1.3,
        letterSpacing: '-0.01em',
        color: '#fff',
        textAlign: 'center',
        margin: '0 0 clamp(32px, 6vw, 64px)',
      }}>
        Four constraints defined everything that followed
      </p>

      <div className="cs-impact-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', rowGap: 40 }}>
        {CONSTRAINTS.map((item, i) => (
          <div key={item.label} style={{
            paddingLeft: i % 2 === 1 ? 'var(--spacing-cs-stack)' : undefined,
            borderLeft: i % 2 === 1 ? '1px solid rgba(255,255,255,0.2)' : undefined,
            paddingTop: i > 1 ? 40 : undefined,
            borderTop: i > 1 ? '1px solid rgba(255,255,255,0.2)' : undefined,
          }}>
            <ConstraintItem item={item} />
          </div>
        ))}
      </div>

      <div className="cs-impact-stack" style={{ gap: 32 }}>
        {CONSTRAINTS.map((item, i) => (
          <Fragment key={item.label}>
            {i > 0 && <div style={{ height: 1, background: 'rgba(255,255,255,0.2)' }} />}
            <ConstraintItem item={item} />
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function ConstraintItem({ item }: { item: (typeof CONSTRAINTS)[number] }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/cross/cross-mark.png" alt="" style={{ width: 24, height: 16 }} />
        <span style={{ fontFamily: TYPE.p16.fontFamily, fontSize: 20, fontWeight: 600, color: '#ffb199' }}>{item.label}</span>
      </div>
      <p style={{ ...TYPE.p16, color: '#fff', margin: 0 }}>{item.description}</p>
    </div>
  );
}

const BASELINE_KRW = 25000;
const DECISION_KRW = 5000;

const METHOD_FACTS = [
  { label: 'Format', value: 'Six-step survey' },
  { label: 'Respondents', value: '18 migrant workers in Korea' },
  { label: 'Screening', value: 'Actively sending money home' },
  { label: 'Sample note', value: 'Sub-questions n = 7–18' },
] as const;

type ResearchInsight = { headline: string; value: number; description: string };

const RESEARCH_INSIGHTS: ResearchInsight[] = [
  {
    headline: 'Safety beats price.',
    value: 57.1,
    description: 'Cited asset safety, not cost, as the top reason for staying with a bank.',
  },
  {
    headline: 'Speed is why they switch.',
    value: 30,
    description: 'Cited faster transfers as the top reason for moving to fintech.',
  },
  {
    headline: 'This is rent money.',
    value: 44.4,
    description: 'Send $200–299 home every month, the largest respondent segment.',
  },
];

const RESEARCH_TO_DESIGN = [
  {
    insight: 'Safety beats price',
    decision: 'A fixed, transparent fee and human-language status updates. Predictability became the trust strategy.',
  },
  {
    insight: 'Speed is why they switch',
    decision: 'Settlement in about an hour on blockchain rails, surfaced up front instead of buried in an FAQ.',
  },
  {
    insight: 'This is rent money',
    decision: 'A three-step transfer flow with zero surprises, designed to feel safe to repeat every payday.',
  },
] as const;

function GaugeCard({ stat }: { stat: ResearchInsight }) {
  return (
    <div>
      <p style={{ ...TYPE.p16SemiBold, margin: '0 0 20px' }}>{stat.headline}</p>
      <GaugeBar value={stat.value} />
      <p style={{ ...TYPE.p56Regular, display: 'flex', alignItems: 'baseline', gap: 4, margin: '24px 0 8px' }}>
        {stat.value}
        <span style={{ fontFamily: TYPE.p16.fontFamily, fontSize: 'clamp(22px, 2vw, 32px)', fontWeight: 400, color: CS.color.dim }}>%</span>
      </p>
      <p style={{ ...TYPE.p16, color: CS.color.dim }}>{stat.description}</p>
    </div>
  );
}

function BaselineDecisionCompare() {
  const bars = [
    { label: 'Korean bank (2018 avg.)', display: '25,000+ KRW', amount: BASELINE_KRW, highlight: false },
    { label: 'Cross', display: '5,000 KRW', amount: DECISION_KRW, highlight: true },
  ];
  return (
    <div style={{ marginTop: 32 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {bars.map((bar) => (
          <div key={bar.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
              <span style={TYPE.p16}>{bar.label}</span>
              <span style={{ ...TYPE.p16SemiBold, color: bar.highlight ? CROSS_BLUE : CS.color.ink }}>{bar.display}</span>
            </div>
            <div style={{ height: 12, borderRadius: 100, backgroundColor: CS.color.line, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${(bar.amount / BASELINE_KRW) * 100}%`,
                borderRadius: 100,
                backgroundColor: bar.highlight ? CROSS_BLUE : 'rgba(0,0,0,0.25)',
              }} />
            </div>
          </div>
        ))}
      </div>
      <p style={{ ...TYPE.p16, color: CS.color.dim, marginTop: 16 }}>
        {Math.round((1 - DECISION_KRW / BASELINE_KRW) * 100)}% below the bank baseline.
      </p>
    </div>
  );
}

function StepBlock({ num, label, children }: { num: string; label: string; children: ReactNode }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 16 }}>
        <span style={{ ...TYPE.p16SemiBold, color: CROSS_BLUE }}>{num}</span>
        <span style={{ ...TYPE.p16SemiBold, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      </div>
      <Divider />
      <div style={{ marginTop: 40 }}>{children}</div>
    </div>
  );
}

function ResearchQuote() {
  return (
    <div>
      <p style={{ ...TYPE.p56Regular, fontSize: 'clamp(28px, 2.6vw, 44px)', maxWidth: 900, margin: 0 }}>
        Price wasn’t the deciding factor.<br />Trust and speed were.
      </p>
      <p style={{ fontFamily: TYPE.p16.fontFamily, fontSize: 12, color: CS.color.dim, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '20px 0 0' }}>
        Research synthesis · 2018 survey
      </p>
    </div>
  );
}

function MethodStep() {
  return (
    <StepBlock num="01" label="Method">
      <div style={{ display: 'flex', gap: '24px 48px', flexWrap: 'wrap' }}>
        {METHOD_FACTS.map((f) => (
          <div key={f.label} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontFamily: TYPE.p16.fontFamily, fontSize: 14, color: 'rgba(0,0,0,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{f.label}</span>
            <span style={TYPE.p16SemiBold}>{f.value}</span>
          </div>
        ))}
      </div>
    </StepBlock>
  );
}

function InsightsStep() {
  return (
    <StepBlock num="02" label="Insights">
      <div className="cs-impact-grid">
        {RESEARCH_INSIGHTS.map((s, i) => (
          <div key={s.headline} style={{
            paddingLeft: i > 0 ? CS.space.stack : undefined,
            paddingRight: i < RESEARCH_INSIGHTS.length - 1 ? CS.space.captionText : undefined,
            borderLeft: i > 0 ? `1px solid ${CS.color.line}` : undefined,
          }}>
            <GaugeCard stat={s} />
          </div>
        ))}
      </div>
      <div className="cs-impact-stack">
        {RESEARCH_INSIGHTS.map((s, i) => (
          <Fragment key={s.headline}>
            {i > 0 && <Divider />}
            <GaugeCard stat={s} />
          </Fragment>
        ))}
      </div>
    </StepBlock>
  );
}

function OutcomeStep() {
  return (
    <StepBlock num="03" label="What It Changed">
      <div>
        {RESEARCH_TO_DESIGN.map((row, i) => (
          <div key={row.insight}>
            {i > 0 && <Divider />}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 32px', padding: 'var(--cs-list-item-gap) 0' }}>
              <span style={{ ...TYPE.p16SemiBold, flex: '0 0 220px' }}>{row.insight}</span>
              <p style={{ ...TYPE.p16, flex: '1 1 280px', margin: 0 }}>{row.decision}</p>
            </div>
          </div>
        ))}
        <Divider />
      </div>

      <div style={{ marginTop: 56 }}>
        <Caption>The decision this research earned</Caption>
        <div style={{ marginTop: 24 }}>
          <ImpactStat stat={{
            value: '5,000',
            unit: 'KRW',
            unitPosition: 'inline',
            description: 'Flat, to any country. 80% below the bank baseline, settled in about an hour, on a government-licensed blockchain rail (Oct 2018).',
          }} />
          <BaselineDecisionCompare />
        </div>
      </div>

      <Body muted style={{ marginTop: 56 }}>
        The same research named the primary design target: not the average user, but the most constrained one.
      </Body>
    </StepBlock>
  );
}

function EvidenceSection() {
  return (
    <>
      <SplitSection title={<SectionTitle>User Research</SectionTitle>} pt={CS.space.section} pb={64}>
        <Body>
          The 5,000 KRW flat fee wasn’t a branding choice. It came out of research with the people Cross was built for, migrant workers in Korea sending real remittances home.
        </Body>
      </SplitSection>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 64, paddingBottom: 100 }}>
        <MethodStep />
        <InsightsStep />
        <ResearchQuote />
        <OutcomeStep />
      </div>
    </>
  );
}

const DESIGN_DIRECTION = [
  {
    caption: 'Radical Simplicity in the Transfer Flow',
    body: 'Recipient → amount → confirm. Everything else was hidden until needed.',
  },
  {
    caption: 'Fixed, Transparent Fee',
    body: '5,000 KRW to any country. No exchange rate anxiety, no hidden math. Trust through predictability.',
  },
  {
    caption: 'Status as Story, Not Code',
    body: 'Transaction states were designed as human-language milestones ("Sent to bank", "Arriving in Vietnam"), not technical statuses.',
  },
  {
    caption: 'KYC as a Conversation, Not a Form',
    body: 'Each verification step explained why it existed and what happened if the user didn’t have it, with fallback paths for expired documents.',
  },
  {
    caption: 'Multi-Language from Day One',
    body: 'Designed with variable text lengths and cultural conventions in mind, not translated afterward.',
  },
  {
    caption: 'Referral Loop Tuned to Community Trust',
    body: 'Foreign worker communities in Korea rely heavily on word-of-mouth, so referrals were designed to feel like recommending a friend, not earning points.',
  },
] as const;

function DesignDirectionList() {
  return (
    <Stack gap={CS.space.stack}>
      {DESIGN_DIRECTION.map((item) => (
        <div key={item.caption}>
          <Caption>{item.caption}</Caption>
          <Body style={{ marginTop: CS.space.captionText }}>{item.body}</Body>
        </div>
      ))}
    </Stack>
  );
}

function ProcessTimeline() {
  return (
    <section>
      <div style={{
        backgroundColor: '#fafafa',
        border: '1px solid rgba(0,0,0,0.08)',
        borderRadius: 16,
        padding: 'clamp(24px, 4vw, 64px)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40, flexWrap: 'wrap', gap: 24 }}>
          <p style={{ fontFamily: TYPE.p16.fontFamily, fontSize: 36, fontWeight: 400, lineHeight: 1.3, letterSpacing: '-0.01em', color: CS.color.ink, margin: 0 }}>Cross Product Roadmap</p>
          <HeaderStats />
        </div>

        <div style={{ position: 'relative' }}>
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', margin: '0 -1px', padding: '0 1px 4px' }}>
            <div style={{ minWidth: 900 }}>
              <PhasePillsRow />
              <GanttChart />
            </div>
          </div>
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 4,
            width: 48,
            background: 'linear-gradient(to right, rgba(250,250,250,0), #fafafa)',
            pointerEvents: 'none',
          }} />
        </div>
      </div>
    </section>
  );
}

const IMPACT_STATS = [
  {
    value: '+50%',
    unit: 'MoM',
    unitPosition: 'below',
    description: 'Monthly transaction volume growth in year one (Ripple, 2019). The blockchain stayed invisible; the trust compounded.',
  },
  {
    value: '15',
    unit: 'countries',
    unitPosition: 'inline',
    description: 'Corridors served by March 2020, up from 3 at launch. Design system scaled across new languages, currencies, and KYC regimes.',
  },
] as const;

const RETENTION_PCT = 80;

function RetentionWaffle() {
  const dots = Array.from({ length: 100 });
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 40,
      alignItems: 'center',
      backgroundColor: '#0a0a0d',
      borderRadius: 16,
      padding: 'clamp(24px, 4vw, 48px)',
    }}>
      <div style={{ flex: '1 1 240px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <p style={{ fontFamily: TYPE.p16.fontFamily, fontSize: 'clamp(48px, 6vw, 72px)', fontWeight: 300, lineHeight: 1, color: '#fff', margin: 0 }}>{RETENTION_PCT}%</p>
        <p style={{ fontFamily: TYPE.p16.fontFamily, fontSize: 20, fontWeight: 400, lineHeight: 1.4, color: 'rgba(255,255,255,0.7)', margin: 0 }}>
          of Cross users <span style={{ color: '#8d90ff' }}>came back month after month</span> after launch
        </p>
        <span style={{ fontFamily: TYPE.p16.fontFamily, fontSize: 12, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Ripple, 2019</span>
      </div>
      <div style={{
        flex: '1 1 240px',
        maxWidth: 340,
        display: 'grid',
        gridTemplateColumns: 'repeat(10, 1fr)',
        gap: 6,
      }}>
        {dots.map((_, i) => (
          <div key={i} style={{
            width: '100%',
            aspectRatio: '1',
            borderRadius: '50%',
            backgroundColor: i < RETENTION_PCT ? CROSS_BLUE : 'rgba(255,255,255,0.12)',
          }} />
        ))}
      </div>
    </div>
  );
}

type StatData = { value: string; unit?: string | null; unitPosition?: 'inline' | 'below'; description: string };

function ImpactStat({ stat }: { stat: StatData }) {
  const unitStyle = { fontFamily: TYPE.p16.fontFamily, fontSize: 'clamp(22px, 2vw, 32px)', fontWeight: 400, color: CS.color.dim, margin: 0 };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <p style={{ ...TYPE.p56Regular, display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap', margin: 0 }}>
        {stat.value}
        {stat.unit && stat.unitPosition === 'inline' && <span style={unitStyle}>{stat.unit}</span>}
      </p>
      {stat.unit && stat.unitPosition === 'below' && <p style={unitStyle}>{stat.unit}</p>}
      <p style={{ ...TYPE.p16, color: CS.color.dim, marginTop: 8 }}>{stat.description}</p>
    </div>
  );
}

function ImpactSection() {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', paddingTop: CS.space.section, paddingBottom: 100 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <SectionTitle>The Impact</SectionTitle>
      </div>

      <div style={{ marginTop: 40 }}>
        <RetentionWaffle />
      </div>

      <div className="cs-impact-grid" style={{ marginTop: 40 }}>
        {IMPACT_STATS.map((stat, i) => (
          <div key={stat.value} style={{
            paddingLeft: i > 0 ? 'var(--spacing-cs-stack)' : undefined,
            borderLeft: i > 0 ? `1px solid ${CS.color.line}` : undefined,
          }}>
            <ImpactStat stat={stat} />
          </div>
        ))}
      </div>

      <div className="cs-impact-stack" style={{ paddingTop: 40 }}>
        {IMPACT_STATS.map((stat, i) => (
          <Fragment key={stat.value}>
            {i > 0 && <Divider />}
            <ImpactStat stat={stat} />
          </Fragment>
        ))}
      </div>
    </section>
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
        <p style={TYPE.h3_32SemiBold}>Cross</p>
        <p style={TYPE.h3_20Regular}>Blockchain Remittance UX for Migrant Workers in Korea</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <Pill>2018 – 2019</Pill>
          <Pill href="https://crossenf.com/remittance">Coinone Transfer ›</Pill>
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

export default function CrossRemittancePage() {
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

        <FullBleedImage src="/assets/cross/cross_01.jpg" />

        <SplitSection title={<SectionTitle>Project Overview</SectionTitle>}>
          <Stack>
            <div>
              <SubTitle>Cross</SubTitle>
              <Body>
                Cross is a government-certified, Ripple-powered blockchain remittance service that Coinone Transfer launched in 2018 for foreigners living in Korea: migrant workers, students, and long-term residents sending money home reliably and cheaply.
              </Body>
            </div>
            <div>
              <SubTitle>My Role</SubTitle>
              <Body>
                As Product Designer, I owned the mobile/web product end-to-end. That meant user research, information architecture, wireframing through high-fidelity UI, prototyping and usability testing, and frontend implementation handoff. I worked solo, aligning closely with product, engineering, compliance, and marketing.
              </Body>
            </div>
          </Stack>
        </SplitSection>

        <ProcessTimeline />

        <SplitSection title={<SectionTitle>The Challenge</SectionTitle>} pt={CS.space.section} pb={40}>
          <div>
            <Body>
              Korea&apos;s large population of migrant workers, students, and expats sends money home not as a convenience, but as a monthly obligation tied to family survival.
            </Body>
            <Body style={{ marginTop: CS.space.paragraph }}>
              Banks meant high fees and rejection risk. Coinone Transfer saw an opportunity to use Ripple&apos;s blockchain settlement to bypass the correspondent banking layer. But the technology was the easy part.
            </Body>
          </div>
        </SplitSection>

        <ConstraintsGrid />

        <div style={{ paddingTop: CS.space.section }}>
          <Divider />
        </div>

        <EvidenceSection />

        <div style={{ paddingTop: 0 }}>
          <Divider />
        </div>

        <SplitSection title={<SectionTitle>Design Direction</SectionTitle>} pt={CS.space.section}>
          <Stack gap={CS.space.stack}>
            <Body>
              Rather than optimizing for the &quot;average user,&quot; I designed for the most constrained user first: a first-time sender, on an older Android phone, with limited Korean, sending money on a payday deadline. Everything cascaded from there.
            </Body>
            <DesignDirectionList />
          </Stack>
        </SplitSection>

        <Divider />

        <ImpactSection />

        <div style={{ paddingTop: 0 }}>
          <Divider />
        </div>

        <SplitSection title={<SectionTitle>Reflection</SectionTitle>} pt={CS.space.section}>
          <Stack gap={CS.space.paragraph}>
            <Body>
              Designing for high-stakes financial trust is different from designing for engagement. The goal isn&apos;t to maximize interaction. It&apos;s to make each interaction feel safe enough to repeat next month.
            </Body>
            <Body>
              Regulation turned out to be a design constraint, not a design ceiling. The most restrictive requirements often produced the clearest UX, as forcing KYC transparency became a trust asset rather than a burden.
            </Body>
            <Body>
              Designing for foreign workers in Korea forced me to unlearn assumptions about digital literacy, language, and device context. Those unlearnings shaped every product I designed afterward.
            </Body>
            <Body>
              Blockchain worked best when it was invisible. Users didn&apos;t need to know Ripple existed. They needed to know the money arrived. The design&apos;s job was to make the infrastructure disappear.
            </Body>
          </Stack>
        </SplitSection>

        <Footer />
      </div>
    </main>
  );
}
