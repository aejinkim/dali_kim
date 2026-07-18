import { Fragment } from 'react';
import type { ReactNode, CSSProperties } from 'react';
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
  DisplayText,
  Divider,
  Pill,
  FullBleedImage,
} from '../_shared/components';
import { GaugeBar } from './GaugeBar';
import InViewTrigger from './InViewTrigger';

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
  { label: 'Impact', value: '80% User Retention\n15 Countries Served' },
] as const;

function ConstraintsGrid() {
  return (
    <div style={{ borderRadius: 16, overflow: 'hidden' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/cross/cross_02.jpg"
        alt="Four constraints defined everything that followed: Trust, Identity, Access, Regulation"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />
    </div>
  );
}

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
    icon: '/assets/cross/icon-safety.svg',
    color: '#3366F2',
  },
  {
    insight: 'It has to be cheap',
    decision: 'A flat fee set 80% below the average bank charge. When the amount is rent, price isn’t optional.',
    icon: '/assets/cross/icon-cheap.svg',
    color: '#3366F2',
  },
  {
    insight: 'Speed is why they switch',
    decision: 'Settlement in about an hour on blockchain rails, surfaced up front instead of buried in an FAQ.',
    icon: '/assets/cross/icon-speed.svg',
    color: '#3366F2',
  },
] as const;

function GaugeCard({ stat }: { stat: ResearchInsight }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <p style={{ ...TYPE.p16SemiBold, margin: 0 }}>{stat.headline}</p>
          <p style={{ ...TYPE.p16, color: CS.color.dim, margin: 0 }}>{stat.description}</p>
        </div>
        <p style={{ ...TYPE.p56Regular, fontSize: 44, display: 'flex', alignItems: 'baseline', gap: 2, margin: 0, whiteSpace: 'nowrap' }}>
          {stat.value}
          <span style={{ fontFamily: TYPE.p16.fontFamily, fontSize: 30, fontWeight: 400, color: CS.color.dim }}>%</span>
        </p>
      </div>
      <div style={{ marginTop: 8 }}>
        <GaugeBar value={stat.value} />
      </div>
    </div>
  );
}

function StepBlock({ num, label, children, numColor = CROSS_BLUE }: { num: string; label: string; children: ReactNode; numColor?: string }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 16 }}>
        <span style={{ ...TYPE.p16SemiBold, color: numColor }}>{num}</span>
        <span style={{ ...TYPE.p16SemiBold, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      </div>
      <Divider />
      <div style={{ marginTop: 24 }}>{children}</div>
    </div>
  );
}

function ResearchQuote() {
  return (
    <div>
      <DisplayText>
        Price wasn’t the deciding factor.<br />Trust and speed were.
      </DisplayText>
    </div>
  );
}

function InsightsStep() {
  return (
    <StepBlock num="01" label="Insights">
      <div style={{ display: 'flex', flexDirection: 'column', gap: CS.space.stack }}>
        {RESEARCH_INSIGHTS.map((s) => (
          <GaugeCard key={s.headline} stat={s} />
        ))}
      </div>
    </StepBlock>
  );
}

function OutcomeCard({ row }: { row: (typeof RESEARCH_TO_DESIGN)[number] }) {
  return (
    <div>
      <div style={{ height: 101, display: 'flex', alignItems: 'flex-start', marginBottom: 16 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={row.icon} alt="" style={{ height: '100%', width: 'auto' }} />
      </div>
      <p style={{ ...TYPE.p16SemiBold, color: row.color, margin: '0 0 8px' }}>{row.insight}</p>
      <p style={{ ...TYPE.p16, margin: 0 }}>{row.decision}</p>
    </div>
  );
}

function OutcomeStep() {
  return (
    <StepBlock num="02" label="What It Changed" numColor="#3366F2">
      <div className="cs-impact-grid" style={{ gap: 30 }}>
        {RESEARCH_TO_DESIGN.map((row) => (
          <OutcomeCard key={row.insight} row={row} />
        ))}
      </div>
      <div className="cs-impact-stack">
        {RESEARCH_TO_DESIGN.map((row, i) => (
          <Fragment key={row.insight}>
            {i > 0 && <Divider />}
            <OutcomeCard row={row} />
          </Fragment>
        ))}
      </div>
    </StepBlock>
  );
}

function EvidenceSection() {
  return (
    <SplitSection title={<SectionTitle>User Research</SectionTitle>} pt={100} pb={100}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 64 }}>
        <Body>
          A six-step survey in 2018 with 30 migrant workers in Korea, all actively sending money home. What they said mattered shaped every decision below.
        </Body>
        <InsightsStep />
        <ResearchQuote />
        <OutcomeStep />
      </div>
    </SplitSection>
  );
}

const DESIGN_DIRECTION = [
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

const RETENTION_PCT = 80;

const IMPACT_CARDS = [
  {
    kind: 'waffle',
    value: '80%',
    unit: 'retention',
    unitPosition: 'inline',
    description: 'of Cross users came back month after month after launch (Ripple, 2019).',
  },
  {
    kind: 'bars',
    value: '+50%',
    unit: 'MoM',
    unitPosition: 'inline',
    description: 'Monthly transaction volume growth in year one (Ripple, 2019).',
  },
  {
    kind: 'dots',
    value: '15',
    unit: 'countries',
    unitPosition: 'inline',
    description: 'Corridors served by March 2020, up from 3 at launch. Design system scaled across new languages, currencies, and KYC regimes.',
  },
] as const;

function WaffleGraphic() {
  return (
    <div style={{ width: '100%', maxWidth: 473, display: 'grid', gridTemplateColumns: 'repeat(17, 1fr)', columnGap: '1.3%', rowGap: 5 }}>
      {Array.from({ length: 100 }).map((_, i) => (
        <div key={i} className="waffle-dot" style={{
          '--i': i,
          width: '100%',
          aspectRatio: '1',
          borderRadius: '30%',
          backgroundColor: i < RETENTION_PCT ? '#415ee8' : '#fabfb7',
        } as CSSProperties} />
      ))}
    </div>
  );
}

function BarsGraphic() {
  const heights = [8.9, 15.8, 20.3, 35.4, 61.4, 100];
  return (
    <div style={{ width: '100%', maxWidth: 436, height: '100%', display: 'flex', alignItems: 'flex-end', gap: '3.4%' }}>
      {heights.map((h, i) => (
        <div key={h} className="bar-graphic" style={{
          '--i': i,
          flex: 1,
          height: `${h}%`,
          borderRadius: '10px 10px 0 0',
          backgroundColor: i === heights.length - 1 ? '#415ee8' : '#fabfb7',
        } as CSSProperties} />
      ))}
    </div>
  );
}

// Robinson-projected positions (% of map width/height) for Korea and the 15 corridor countries
const MAP_DOTS = [
  { id: 'kr', left: 81.1, top: 27.3, origin: true },
  { id: 'vn', left: 77.2, top: 37.7 },
  { id: 'ph', left: 82.5, top: 41.9 },
  { id: 'th', left: 76.1, top: 42.2 },
  { id: 'id', left: 78.5, top: 54.5 },
  { id: 'kh', left: 77.4, top: 43.5 },
  { id: 'mm', left: 74.8, top: 40.2 },
  { id: 'np', left: 71.3, top: 33.5 },
  { id: 'bd', left: 72.9, top: 36.0 },
  { id: 'in', left: 69.1, top: 33.0 },
  { id: 'lk', left: 71.2, top: 46.2 },
  { id: 'pk', left: 67.6, top: 29.8 },
  { id: 'cn', left: 78.2, top: 26.0 },
  { id: 'uz', left: 66.0, top: 25.1 },
  { id: 'mn', left: 74.5, top: 21.1 },
  { id: 'my', left: 76.6, top: 48.8 },
] as const;

// Zoom the map to the Korea + Southeast Asia cluster instead of showing the whole world
const MAP_ZOOM = 3;
const MAP_ZOOM_CENTER = { left: 78.65, top: 40.9 };

function DotsGraphic() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        height: `${MAP_ZOOM * 100}%`,
        aspectRatio: '2754 / 1398',
        transform: `translate(-${MAP_ZOOM_CENTER.left}%, -${MAP_ZOOM_CENTER.top}%)`,
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/cross/world-map.svg"
          alt="Map showing the 15 remittance corridors Cross served across Southeast Asia, from Korea"
          style={{ width: '100%', height: '100%' }}
        />
        {MAP_DOTS.map((d, i) => (
          <span key={d.id} className="map-dot" style={{
            '--i': i,
            position: 'absolute',
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: 'origin' in d && d.origin ? '2.6%' : '1.9%',
            aspectRatio: '1',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'origin' in d && d.origin ? '#ffb199' : '#415ee8',
          } as CSSProperties} />
        ))}
      </div>
    </div>
  );
}

const IMPACT_GRAPHICS = {
  waffle: <WaffleGraphic />,
  bars: <BarsGraphic />,
  dots: <DotsGraphic />,
} as const;

type StatData = { value: string; unit?: string | null; unitPosition?: 'inline' | 'below'; description: string; kind?: string };

function ImpactStat({ stat }: { stat: StatData }) {
  const unitStyle = { fontFamily: TYPE.p16.fontFamily, fontSize: 'clamp(22px, 2vw, 32px)', fontWeight: 400, color: CS.color.dim, margin: 0 };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <p style={{ ...TYPE.p56Regular, display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap', margin: 0 }}>
        {stat.value}
        {stat.unit && stat.unitPosition === 'inline' && <span style={unitStyle}>{stat.unit}</span>}
      </p>
      {stat.unit && stat.unitPosition === 'below' && <p style={unitStyle}>{stat.unit}</p>}
      <p className="impact-desc" style={{ ...TYPE.p16, marginTop: 8 }}>{stat.description}</p>
    </div>
  );
}

function ImpactCard({ card }: { card: (typeof IMPACT_CARDS)[number] }) {
  return (
    <InViewTrigger className="impact-card" style={{
      border: '1px solid rgba(0,0,0,0.08)',
      borderRadius: 16,
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
    }}>
      <div style={{
        height: 180,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {IMPACT_GRAPHICS[card.kind]}
      </div>
      <ImpactStat stat={card} />
    </InViewTrigger>
  );
}

function ImpactSection() {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', paddingTop: CS.space.section, paddingBottom: 100 }}>
      <style>{`
        .impact-card {
          background-color: #fafafa;
          transition: background-color 0.3s ease, transform 0.3s ease;
        }
        .impact-card:hover {
          background-color: #ffffff;
          transform: translateY(-10px);
        }
        .impact-desc {
          color: ${CS.color.dim} !important;
          transition: color 0.3s ease;
        }
        .impact-card:hover .impact-desc {
          color: ${CS.color.ink} !important;
        }
        @keyframes waffle-pop {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes waffle-pop-hover {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .impact-card.in-view .waffle-dot {
          animation: waffle-pop 0.4s ease both;
          animation-delay: calc(var(--i) * 4ms);
        }
        .impact-card:hover .waffle-dot {
          animation: waffle-pop-hover 0.4s ease both;
          animation-delay: calc(var(--i) * 4ms);
        }
        @keyframes bar-grow {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
        @keyframes bar-grow-hover {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
        .bar-graphic {
          transform-origin: bottom;
        }
        .impact-card.in-view .bar-graphic {
          animation: bar-grow 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
          animation-delay: calc(var(--i) * 70ms);
        }
        .impact-card:hover .bar-graphic {
          animation: bar-grow-hover 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
          animation-delay: calc(var(--i) * 70ms);
        }
        @keyframes map-pop {
          from { transform: translate(-50%, -50%) scale(0); opacity: 0; }
          to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        @keyframes map-pop-hover {
          from { transform: translate(-50%, -50%) scale(0); opacity: 0; }
          to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        .impact-card.in-view .map-dot {
          animation: map-pop 0.45s ease both;
          animation-delay: calc(var(--i) * 25ms);
        }
        .impact-card:hover .map-dot {
          animation: map-pop-hover 0.45s ease both;
          animation-delay: calc(var(--i) * 25ms);
        }
      `}</style>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <SectionTitle>The Impact</SectionTitle>
      </div>

      <div className="cs-impact-grid" style={{ marginTop: 40, gap: 16 }}>
        {IMPACT_CARDS.map((card) => (
          <ImpactCard key={card.value} card={card} />
        ))}
      </div>

      <div className="cs-impact-stack" style={{ paddingTop: 40, gap: 16 }}>
        {IMPACT_CARDS.map((card) => (
          <ImpactCard key={card.value} card={card} />
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

        <Footer />
      </div>
    </main>
  );
}
